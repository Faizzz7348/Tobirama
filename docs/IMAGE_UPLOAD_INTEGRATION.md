# Image Upload Integration Guide

Panduan lengkap untuk menggunakan fitur upload image ke ImgBB dan menyimpan URL ke database.

## Konfigurasi

### 1. Environment Variables

File `.env` sudah dikonfigurasi dengan:

```env
VITE_API_URL=/api
VITE_DATABASE_URL=postgresql://neondb_owner:npg_PgQsZS4DeY9F@ep-weathered-grass-ad6a3l3j-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
VITE_IMGBB_API_KEY=4042c537845e8b19b443add46f4a859c
```

**Jangan commit file `.env` ke git** - gunakan `.env.example` sebagai template.

## Komponen & Services

### ImageUploadService (`src/service/ImageUploadService.js`)

Service utama untuk upload image ke ImgBB.

**Functions:**

#### `uploadImageToImgBB(file, fileName)`
- **Params:**
  - `file` (File|Blob): File image yang akan diupload
  - `fileName` (string, optional): Custom filename
- **Returns:** Promise<{ url, displayUrl, deleteUrl, title }>
- **Validasi:** 
  - File harus image (image/*)
  - Max size: 32MB

```javascript
import { uploadImageToImgBB } from '../service/ImageUploadService';

const result = await uploadImageToImgBB(file);
if (result.url) {
    console.log('Image uploaded:', result.url);
} else {
    console.error('Upload failed:', result.error);
}
```

#### `uploadMultipleImagesToImgBB(files)`
- **Params:** `files` (File[]): Array of image files
- **Returns:** Promise<Array> - Array of upload results

```javascript
import { uploadMultipleImagesToImgBB } from '../service/ImageUploadService';

const files = [file1, file2, file3];
const results = await uploadMultipleImagesToImgBB(files);
const urls = results.filter(r => r.url).map(r => r.url);
```

#### `handleFileInputChange(event)`
- **Params:** `event` (Event): File input change event
- **Returns:** Promise<{ urls, errors }>

```javascript
<input 
    type="file" 
    multiple 
    accept="image/*"
    onChange={async (e) => {
        const { urls, errors } = await handleFileInputChange(e);
    }}
/>
```

### useImageUpload Hook (`src/hooks/useImageUpload.js`)

Custom hook untuk simplify image upload dalam React component.

**Returns:**
```javascript
{
    uploadImage: Function,      // Upload single image
    uploadMultiple: Function,   // Upload multiple images
    isLoading: boolean,         // Loading state
    error: string|null,         // Error message
    progress: number            // Upload progress (0-100)
}
```

**Usage:**

```javascript
import useImageUpload from '../hooks/useImageUpload';

function MyComponent({ locationId }) {
    const { uploadImage, isLoading, error, progress } = useImageUpload();

    const handleUpload = async (file) => {
        const result = await uploadImage(file, locationId);
        if (result.success) {
            console.log('Image saved:', result.url);
        }
    };

    return (
        <div>
            {isLoading && <p>Uploading... {progress}%</p>}
            {error && <p>Error: {error}</p>}
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files[0])}
            />
        </div>
    );
}
```

### CustomerService Updates

Ditambahkan 3 method baru:

#### `addImageToLocation(locationId, imageUrls)`
Tambah image ke location di database.

```javascript
import { CustomerService } from '../service/CustomerService';

// Single image
await CustomerService.addImageToLocation(123, 'https://imgbb.com/...');

// Multiple images
await CustomerService.addImageToLocation(123, [
    'https://imgbb.com/image1',
    'https://imgbb.com/image2'
]);
```

#### `removeImageFromLocation(locationId, imageUrl)`
Hapus image dari location.

```javascript
await CustomerService.removeImageFromLocation(123, 'https://imgbb.com/...');
```

## Component Contoh

### ImageUploadComponent (`src/components/ImageUploadComponent.jsx`)

Contoh component siap pakai untuk image upload:

```javascript
import ImageUploadComponent from '../components/ImageUploadComponent';

function MyPage() {
    return (
        <ImageUploadComponent 
            locationId={123}
            onImagesUploaded={(urls) => {
                console.log('Images uploaded:', urls);
            }}
        />
    );
}
```

**Features:**
- Single & multiple file upload
- Progress bar
- Thumbnail preview
- Remove image button
- Error handling

## Integrasi ke Component Existing

### Option 1: Menggunakan Hook di Component Anda

```javascript
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import { ImageLightbox } from './ImageLightbox';

export function LocationDetail({ location }) {
    const [images, setImages] = useState(location.images || []);
    const { uploadImage, isLoading } = useImageUpload();

    const handleUpload = async (file) => {
        const result = await uploadImage(file, location.id);
        if (result.success) {
            setImages([...images, result.url]);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files[0])}
                    disabled={isLoading}
                />
            </div>
            
            {images.length > 0 && (
                <ImageLightbox images={images} rowId={location.id} />
            )}
        </div>
    );
}
```

### Option 2: Menggunakan ImageUploadComponent

```javascript
import ImageUploadComponent from '../components/ImageUploadComponent';
import { ImageLightbox } from './ImageLightbox';

export function LocationDetail({ location }) {
    const [images, setImages] = useState(location.images || []);

    return (
        <div>
            <ImageUploadComponent 
                locationId={location.id}
                onImagesUploaded={(newUrls) => {
                    setImages([...images, ...newUrls]);
                }}
            />
            
            {images.length > 0 && (
                <ImageLightbox images={images} rowId={location.id} />
            )}
        </div>
    );
}
```

## API Backend Requirements

Untuk bekerja optimal dengan database PostgreSQL Neon, backend perlu endpoints:

### POST `/api/locations/:id/images`
Tambah images ke location.

**Request:**
```json
{
    "images": ["https://imgbb.com/image1", "https://imgbb.com/image2"]
}
```

**Response:**
```json
{
    "success": true,
    "images": [...]
}
```

### DELETE `/api/locations/:id/images`
Hapus image dari location.

**Request:**
```json
{
    "imageUrl": "https://imgbb.com/image1"
}
```

## Error Handling

Setiap upload operation akan return error message yang descriptive:

```javascript
const result = await uploadImage(file, locationId);

if (!result.success) {
    switch(result.error) {
        case 'File must be an image':
            // Handle file type error
            break;
        case 'File size exceeds 32MB limit':
            // Handle file size error
            break;
        case 'ImgBB API Key is not configured':
            // Handle config error
            break;
        default:
            // Handle other errors
    }
}
```

## Development Tips

1. **Test Upload:** Buka browser DevTools → Console → test function:
   ```javascript
   const { uploadImageToImgBB } = await import('./service/ImageUploadService.js');
   const input = document.querySelector('input[type=file]');
   const result = await uploadImageToImgBB(input.files[0]);
   console.log(result);
   ```

2. **Check API Response:** Network tab di DevTools
   - Watch untuk POST request ke `api.imgbb.com`
   - Check response structure

3. **Local Testing:** Gunakan `.env.local` untuk override values

## Troubleshooting

### "ImgBB API Key is not configured"
- Check `.env` file exists dan `VITE_IMGBB_API_KEY` ada
- Vite perlu restart untuk load env variables baru

### Upload fails dengan "400 Bad Request"
- Check image format (harus valid image file)
- Check file size (max 32MB)
- Check API key valid di ImgBB dashboard

### Images tidak appear di database
- Check backend API endpoint `/api/locations/:id/images` exists
- Check database connection string correct
- Check network tab untuk error response

## Production Checklist

- [ ] `.env` file added ke `.gitignore`
- [ ] `.env` values updated dengan production credentials
- [ ] Backend API endpoints implemented & tested
- [ ] Database schema updated dengan images field (array/JSON)
- [ ] Error handling tested dengan network errors
- [ ] File size validation pada client & server
- [ ] SSL/TLS enabled untuk HTTPS
