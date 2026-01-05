# 🧪 Testing Guide - Image Upload & Database

Panduan lengkap untuk test semua functionality image upload dan database integration.

## Before Testing

✅ Ensure:
- Dev server berjalan (`npm run dev`)
- `.env` file sudah setup
- Browser console ready (F12)

## Level 1: Unit Testing (Services)

### Test 1.1: ImageUploadService - Single Image

```javascript
// Buka browser console (F12)
import { uploadImageToImgBB } from './src/service/ImageUploadService.js';

// Pick image dari file input
const input = document.querySelector('input[type="file"]');
const file = input.files[0]; // Select file dulu

// Upload
const result = await uploadImageToImgBB(file);

// Check result
console.log('Success:', !!result.url);
console.log('URL:', result.url);
console.log('Delete URL:', result.deleteUrl);

// Expected:
// ✅ result.url = 'https://imgbb.com/...'
// ✅ result.displayUrl = '...'
// ✅ result.deleteUrl = '...'
```

### Test 1.2: ImageUploadService - Multiple Images

```javascript
import { uploadMultipleImagesToImgBB } from './src/service/ImageUploadService.js';

const input = document.querySelector('input[type="file"]');
const files = Array.from(input.files); // Multiple files

const results = await uploadMultipleImagesToImgBB(files);

// Check results
results.forEach((result, index) => {
    console.log(`Image ${index}:`, result.url || result.error);
});

// Expected:
// ✅ Array of upload results
// ✅ Each item has .url or .error
```

### Test 1.3: CustomerService - Add Image

```javascript
import { CustomerService } from './src/service/CustomerService.js';

// Mock image URL (from test 1.1)
const imageUrl = 'https://i.imgbb.com/...';
const locationId = 1;

const result = await CustomerService.addImageToLocation(locationId, imageUrl);

console.log('Result:', result);

// Expected:
// ✅ result.success = true
// ✅ result.images array contains the URL
```

### Test 1.4: CustomerService - Remove Image

```javascript
import { CustomerService } from './src/service/CustomerService.js';

const imageUrl = 'https://i.imgbb.com/...';
const locationId = 1;

const result = await CustomerService.removeImageFromLocation(locationId, imageUrl);

console.log('Result:', result);

// Expected:
// ✅ result.success = true
// ✅ result.images array no longer contains the URL
```

## Level 2: Hook Testing (useImageUpload)

### Test 2.1: Single Image Upload with Hook

```javascript
// Di component dengan hook
import useImageUpload from '../hooks/useImageUpload';

function TestComponent() {
    const { uploadImage, isLoading, progress, error } = useImageUpload();
    
    const handleTest = async () => {
        // Get file dari input
        const file = document.querySelector('input[type="file"]').files[0];
        const locationId = 1;
        
        console.log('Starting upload...');
        const result = await uploadImage(file, locationId);
        
        console.log('Upload result:', result);
        // ✅ result.success = true
        // ✅ result.url = 'https://imgbb.com/...'
    };
    
    return (
        <div>
            <button onClick={handleTest}>Test Upload</button>
            {isLoading && <p>Loading: {progress}%</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}
```

### Test 2.2: Multiple Images Upload with Hook

```javascript
const { uploadMultiple, isLoading, progress } = useImageUpload();

const handleTest = async () => {
    const files = Array.from(
        document.querySelector('input[type="file"]').files
    );
    const locationId = 1;
    
    const result = await uploadMultiple(files, locationId);
    
    console.log('Upload result:', result);
    // ✅ result.success = true
    // ✅ result.urls = array of URLs
    // ✅ result.totalUploaded = number
};
```

## Level 3: Component Testing

### Test 3.1: ImageUploadComponent

```jsx
import ImageUploadComponent from './components/ImageUploadComponent';

function TestPage() {
    const handleImagesUploaded = (urls) => {
        console.log('Images uploaded:', urls);
        // ✅ Verify images appear in callback
    };
    
    return (
        <ImageUploadComponent 
            locationId={1}
            onImagesUploaded={handleImagesUploaded}
        />
    );
}

// Test:
// 1. Select single file → progress bar → image appears
// 2. Select multiple files → all appear in grid
// 3. Click X to remove → image disappears
// 4. Error handling → show error message
```

### Test 3.2: ModalWithImageUpload

```jsx
import ModalWithImageUpload from './components/ModalWithImageUpload';

<ModalWithImageUpload 
    locationId={123}
    onSave={(urls) => {
        console.log('Saved:', urls);
    }}
/>

// Test:
// 1. Upload image → appears in gallery
// 2. Remove image → disappears from gallery
// 3. Multiple uploads → all saved
```

## Level 4: Integration Testing

### Test 4.1: Full Upload Flow

```javascript
// Step 1: Upload image to ImgBB
const file = document.querySelector('input[type="file"]').files[0];
import { uploadImageToImgBB } from './src/service/ImageUploadService.js';
const imgbbResult = await uploadImageToImgBB(file);
console.log('1. ImgBB upload:', ✅, imgbbResult.url);

// Step 2: Save URL to database
import { CustomerService } from './src/service/CustomerService.js';
const dbResult = await CustomerService.addImageToLocation(1, imgbbResult.url);
console.log('2. Database save:', ✅, dbResult.success);

// Step 3: Fetch locations to verify
const locations = await CustomerService.getDetailData();
console.log('3. Images in DB:', ✅, locations[0].images);

// Expected:
// ✅ Image uploaded to ImgBB
// ✅ URL saved to database
// ✅ URL appears in fetched data
```

### Test 4.2: Full Remove Flow

```javascript
import { CustomerService } from './src/service/CustomerService.js';

const imageUrl = 'https://i.imgbb.com/...';
const locationId = 1;

// Step 1: Remove from database
const removeResult = await CustomerService.removeImageFromLocation(
    locationId,
    imageUrl
);
console.log('1. Database remove:', ✅, removeResult.success);

// Step 2: Verify it's gone
const locations = await CustomerService.getDetailData();
console.log('2. Images after remove:', ✅, locations[0].images);

// Expected:
// ✅ Removed from database
// ✅ Not in images array anymore
```

## Level 5: Error Handling Testing

### Test 5.1: Invalid File Type

```javascript
import { uploadImageToImgBB } from './src/service/ImageUploadService.js';

// Create non-image file
const blob = new Blob(['test'], { type: 'text/plain' });
const file = new File([blob], 'test.txt');

const result = await uploadImageToImgBB(file);

console.log('Error:', result.error);
// Expected: "File must be an image"
```

### Test 5.2: File Too Large

```javascript
import { uploadImageToImgBB } from './src/service/ImageUploadService.js';

// Create large file (>32MB)
const blob = new Blob([new ArrayBuffer(33 * 1024 * 1024)]);
const file = new File([blob], 'large.jpg');

const result = await uploadImageToImgBB(file);

console.log('Error:', result.error);
// Expected: "File size exceeds 32MB limit"
```

### Test 5.3: No API Key

```javascript
// Temporarily remove API key
const original = import.meta.env.VITE_IMGBB_API_KEY;
delete import.meta.env.VITE_IMGBB_API_KEY;

import { uploadImageToImgBB } from './src/service/ImageUploadService.js';
const result = await uploadImageToImgBB(file);

console.log('Error:', result.error);
// Expected: "ImgBB API Key is not configured"

// Restore
import.meta.env.VITE_IMGBB_API_KEY = original;
```

## Level 6: Network Testing

### Test 6.1: Monitor Network Requests

```
1. Open DevTools → Network tab
2. Upload image
3. Look for:
   ✅ POST to api.imgbb.com
      - Status: 200
      - Response: JSON with url
   
   ✅ POST to /api/locations/1/images
      - Status: 200
      - Response: success: true
```

### Test 6.2: Verify ImgBB Response

```javascript
// In Network tab, check ImgBB response:
{
    "success": true,
    "data": {
        "id": "...",
        "image": {
            "url": "https://i.imgbb.com/...",
            "display_url": "https://imgbb.com/..."
        },
        "delete_url": "https://api.imgbb.com/delete/..."
    }
}

// ✅ Has correct structure
// ✅ URL is valid
```

### Test 6.3: Verify Backend Response

```javascript
// Expected from /api/locations/:id/images
{
    "success": true,
    "images": ["https://i.imgbb.com/...", ...],
    "location_id": 1
}

// ✅ Has success flag
// ✅ Has images array
// ✅ Can be stored in DB
```

## Level 7: Performance Testing

### Test 7.1: Multiple Simultaneous Uploads

```javascript
const files = [...]; // 10 files
const startTime = Date.now();

const results = await Promise.all(
    files.map(f => uploadImageToImgBB(f))
);

const duration = Date.now() - startTime;
console.log(`Uploaded ${results.length} files in ${duration}ms`);

// Expected:
// ✅ All uploads complete
// ✅ No duplicates
// ✅ Reasonable time (< 30s for 10 files)
```

### Test 7.2: Cache Performance

```javascript
import { CustomerService } from './src/service/CustomerService.js';

// First call (fetch from API)
console.time('first');
const data1 = await CustomerService.getDetailData();
console.timeEnd('first');
// Expected: ~200-500ms

// Second call (from cache)
console.time('second');
const data2 = await CustomerService.getDetailData();
console.timeEnd('second');
// Expected: <5ms

// Verify same data
console.log('Same data:', JSON.stringify(data1) === JSON.stringify(data2));
// Expected: true
```

## Test Checklist

### Basic Functionality
- [ ] Single image upload works
- [ ] Multiple image upload works
- [ ] Images appear after upload
- [ ] Remove image works
- [ ] Images persist in database

### Error Handling
- [ ] Invalid file type rejected
- [ ] File too large rejected
- [ ] API key missing handled
- [ ] Network error handled
- [ ] Database error handled

### UI/UX
- [ ] Loading state shows
- [ ] Progress updates
- [ ] Success message shows
- [ ] Error message shows
- [ ] Images preview correctly

### Performance
- [ ] Multiple uploads don't timeout
- [ ] Cache works properly
- [ ] No memory leaks
- [ ] Network requests optimized
- [ ] UI responsive during upload

### Integration
- [ ] Works with ImageLightbox
- [ ] Works in modals
- [ ] Works in table rows
- [ ] Persists across page reload
- [ ] Works on different routes

## Common Issues & Debug

### Upload hangs
```javascript
// Check if API key is set
console.log(import.meta.env.VITE_IMGBB_API_KEY);

// Check network in DevTools
// Look for pending requests
```

### Images not appearing
```javascript
// Check if URL saved correctly
const locations = await CustomerService.getDetailData();
console.log('Images array:', locations[0].images);

// Verify URL is valid
// Try in new tab: <image URL>
```

### Database not updating
```javascript
// Check if API call succeeds
// Open Network tab
// Look for POST to /api/locations/:id/images

// Check response status code
// 200 = success
// 400 = bad request
// 500 = server error
```

---

**Testing Priority:**
1. Level 1 & 2: Services & Hooks (Easiest)
2. Level 3: Components (UI Testing)
3. Level 4: Integration (Full flow)
4. Level 5: Error cases (Edge cases)
5. Level 6 & 7: Advanced (Optional)

**Time Estimate:** 30-60 minutes for full test suite

Good luck! 🚀
