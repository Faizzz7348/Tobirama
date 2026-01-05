# 🚀 Quick Start: Database & Image Upload

Panduan cepat untuk mulai menggunakan fitur database PostgreSQL dan upload image ke ImgBB.

## ⚡ 5 Menit Setup

### Step 1: Environment Variables Already Set ✅
File `.env` sudah dikonfigurasi dengan:
- Database PostgreSQL Neon
- ImgBB API Key
- API base URL

**File:** `.env` (gitignored untuk security)

### Step 2: Understanding the Flow

```
User Upload Image
         ↓
ImageUploadService (ImgBB)
         ↓
Get Image URL
         ↓
CustomerService.addImageToLocation()
         ↓
Save URL to Database (PostgreSQL)
         ↓
Display in ImageLightbox
```

## 📖 Usage Examples

### Option A: Simple Upload Hook (Recommended)

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';

export function MyUploadButton({ locationId }) {
    const { uploadImage, isLoading, error, progress } = useImageUpload();
    
    const handleUpload = async (file) => {
        const result = await uploadImage(file, locationId);
        if (result.success) {
            alert('Image uploaded: ' + result.url);
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

### Option B: Pre-built Component

```jsx
import ImageUploadComponent from '../components/ImageUploadComponent';

export function LocationDetailPage({ location }) {
    return (
        <div>
            <h1>{location.name}</h1>
            
            <ImageUploadComponent 
                locationId={location.id}
                onImagesUploaded={(urls) => {
                    console.log('Uploaded:', urls);
                }}
            />
            
            {location.images?.length > 0 && (
                <ImageLightbox images={location.images} rowId={location.id} />
            )}
        </div>
    );
}
```

### Option C: Modal Integration

```jsx
import ModalWithImageUpload from '../components/ModalWithImageUpload';

<ModalWithImageUpload 
    locationId={123}
    onSave={(urls) => {
        console.log('Images saved:', urls);
    }}
/>
```

## 🔗 Service Methods

### Upload to ImgBB (Client-side)

```javascript
import { uploadImageToImgBB } from '../service/ImageUploadService';

// Single image
const result = await uploadImageToImgBB(file);
console.log(result.url); // ImgBB URL

// Multiple images
const results = await Promise.all(
    files.map(f => uploadImageToImgBB(f))
);
```

### Save to Database

```javascript
import { CustomerService } from '../service/CustomerService';

// Add single image URL
await CustomerService.addImageToLocation(123, 'https://imgbb.com/...');

// Add multiple image URLs
await CustomerService.addImageToLocation(123, [
    'https://imgbb.com/image1',
    'https://imgbb.com/image2'
]);

// Remove image
await CustomerService.removeImageFromLocation(123, 'https://imgbb.com/...');
```

## 🎯 Real World Example

Complete example integrating everything:

```jsx
import { useState } from 'react';
import { ImageLightbox } from '../components/ImageLightbox';
import { ImageUploadComponent } from '../components/ImageUploadComponent';
import { CustomerService } from '../service/CustomerService';

export function LocationDetailModal({ location, onClose }) {
    const [images, setImages] = useState(location.images || []);
    const [saving, setSaving] = useState(false);
    
    const handleImagesUploaded = (newUrls) => {
        setImages([...images, ...newUrls]);
    };
    
    const handleRemoveImage = async (url) => {
        setSaving(true);
        try {
            await CustomerService.removeImageFromLocation(location.id, url);
            setImages(images.filter(img => img !== url));
        } catch (err) {
            alert('Error removing image: ' + err.message);
        } finally {
            setSaving(false);
        }
    };
    
    return (
        <div className="modal">
            <h2>{location.name}</h2>
            
            {/* Upload new images */}
            <ImageUploadComponent 
                locationId={location.id}
                onImagesUploaded={handleImagesUploaded}
            />
            
            {/* Show existing images */}
            {images.length > 0 && (
                <>
                    <h3>Existing Images ({images.length})</h3>
                    <ImageLightbox images={images} rowId={location.id} />
                    
                    {/* Remove buttons */}
                    <div style={{ marginTop: '20px' }}>
                        {images.map(url => (
                            <button 
                                key={url}
                                onClick={() => handleRemoveImage(url)}
                                disabled={saving}
                            >
                                Remove
                            </button>
                        ))}
                    </div>
                </>
            )}
            
            <button onClick={onClose}>Close</button>
        </div>
    );
}
```

## 📋 Checklist for Backend

Backend team needs to implement these endpoints:

### POST `/api/locations/:id/images`
Add images to location
```json
{
    "images": ["https://imgbb.com/image1", "https://imgbb.com/image2"]
}
```

### DELETE `/api/locations/:id/images`
Remove image from location
```json
{
    "imageUrl": "https://imgbb.com/image1"
}
```

### Database Schema Update
```sql
-- Add images column if not exists
ALTER TABLE locations 
ADD COLUMN images TEXT[] DEFAULT '{}';

-- Index for performance
CREATE INDEX idx_locations_images ON locations USING GIN(images);
```

## 🧪 Testing in Browser Console

Quick test without changing code:

```javascript
// Load service
import { uploadImageToImgBB } from './service/ImageUploadService.js';

// Select file from page
const fileInput = document.querySelector('input[type=file]');
const file = fileInput.files[0];

// Upload
const result = await uploadImageToImgBB(file);
console.log(result);
// Output: { url: "https://imgbb.com/...", displayUrl: "...", ... }
```

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "API Key not configured" | Restart dev server, check `.env` |
| "Failed to upload to ImgBB" | Check image file type & size |
| "Failed to save to database" | Backend API endpoint not implemented |
| "CORS error" | Backend needs CORS headers configured |

## 📚 Full Documentation

See complete guide: [IMAGE_UPLOAD_INTEGRATION.md](./IMAGE_UPLOAD_INTEGRATION.md)

## 💡 Tips

1. **Development:** Use localStorage fallback
   - Set `USE_LOCALSTORAGE = true` in CustomerService.js

2. **Testing:** Check Network tab
   - Watch POST to api.imgbb.com
   - Check response structure

3. **Performance:** Cache images
   - ImageLightbox handles caching
   - Implement CDN for ImgBB URLs in production

4. **Security:** Environment variables
   - `.env` is gitignored
   - Never commit sensitive data
   - Rotate API keys periodically

---

🎉 **You're ready to go!** Choose an option above and start integrating!
