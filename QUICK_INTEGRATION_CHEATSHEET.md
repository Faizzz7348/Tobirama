# 🚀 Quick Integration Cheatsheet

## Copy & Paste Ready - Choose Your Pattern

---

## Pattern 1: Full Detail Card
```jsx
import { LocationDetailCard } from './components/LocationDetailCard';

export function LocationDetails() {
  const location = { id: '123', name: 'KL', images: [] };
  
  return (
    <LocationDetailCard 
      location={location}
      onLocationUpdate={(updated) => console.log(updated)}
    />
  );
}
```

---

## Pattern 2: Modal Dialog Button + Component
```jsx
import { useState } from 'react';
import { Button } from 'primereact/button';
import { TableRowImageModal } from './components/TableRowImageModal';

export function MyTableRow({ rowData }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button 
        icon="pi pi-image" 
        rounded 
        text
        onClick={() => setShowModal(true)}
      />
      
      <TableRowImageModal
        rowData={rowData}
        visible={showModal}
        onHide={() => setShowModal(false)}
        onImagesAdded={(images) => {
          // Update your table/state here
          rowData.images = images;
        }}
      />
    </>
  );
}
```

---

## Pattern 3: DataTable Column Template
```jsx
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { QuickImageUploadCell } from './components/QuickImageUploadCell';

export function LocationsTable() {
  const [locations, setLocations] = useState([...]);

  const imageBodyTemplate = (rowData) => (
    <QuickImageUploadCell
      rowData={rowData}
      onImageAdded={(images) => {
        setLocations(locations.map(l =>
          l.id === rowData.id ? { ...l, images } : l
        ));
      }}
    />
  );

  return (
    <DataTable value={locations}>
      <Column field="name" header="Location" />
      <Column field="code" header="Code" />
      <Column header="Images" body={imageBodyTemplate} style={{ width: '200px' }} />
    </DataTable>
  );
}
```

---

## Pattern 4: Standalone Upload Hook
```jsx
import { useImageUpload } from './hooks/useImageUpload';

export function MyComponent() {
  const { uploadImage, isLoading, error, progress } = useImageUpload();

  const handleClick = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const result = await uploadImage(file, 'location-123');
        console.log('Uploaded:', result);
      }
    };
    
    fileInput.click();
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? `Uploading: ${progress}%` : 'Upload Image'}
      {error && <span style={{color: 'red'}}>{error}</span>}
    </button>
  );
}
```

---

## Pattern 5: Custom Image Upload Service
```jsx
import { ImageUploadService } from './service/ImageUploadService';
import { CustomerService } from './service/CustomerService';

async function myCustomUpload(file, locationId) {
  try {
    // Step 1: Upload to ImgBB
    const imgbbResult = await ImageUploadService.uploadImageToImgBB(
      file,
      `my-custom-name-${Date.now()}`
    );
    
    console.log('ImgBB URL:', imgbbResult.url);
    
    // Step 2: Save to database
    const dbResult = await CustomerService.addImageToLocation(
      locationId,
      [imgbbResult.url]
    );
    
    console.log('Saved to DB:', dbResult);
    
    return imgbbResult.url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Usage:
const imageUrl = await myCustomUpload(file, '123');
```

---

## Environment Setup

Make sure `.env` file has these (it should):
```
VITE_DATABASE_URL=postgresql://...
VITE_IMGBB_API_KEY=4042c537845e8b19b443add46f4a859c
VITE_API_URL=/api
```

---

## Testing Quickly

### Test 1: Upload & See URL
```javascript
// Open browser console (F12) and paste:
import { ImageUploadService } from './service/ImageUploadService.js';

// Create test file
const canvas = document.createElement('canvas');
canvas.width = 100;
canvas.height = 100;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 100, 100);

canvas.toBlob(async (blob) => {
  try {
    const result = await ImageUploadService.uploadImageToImgBB(
      blob, 
      'test-image'
    );
    console.log('✅ Success! URL:', result.url);
  } catch(err) {
    console.error('❌ Error:', err);
  }
});
```

### Test 2: Database Connection
```javascript
import { CustomerService } from './service/CustomerService.js';

// Test getting locations
const locations = await CustomerService.getLocations();
console.log('Locations:', locations);

// Test adding image
const result = await CustomerService.addImageToLocation(
  'test-location-123',
  ['https://example.com/image.jpg']
);
console.log('Database response:', result);
```

---

## Common Issues & Fixes

**Issue: "Cannot find module"**
```
✅ Make sure you're importing from the correct path:
✅ FROM: './components/LocationDetailCard'
❌ NOT: './LocationDetailCard'
```

**Issue: "IMGBB_API_KEY undefined"**
```
✅ Check .env file exists in project root
✅ Variable name must be VITE_IMGBB_API_KEY (with VITE_ prefix)
✅ Restart dev server after changing .env
```

**Issue: "Database connection failed"**
```
✅ Check DATABASE_URL in .env is complete
✅ Verify network (should work from browser)
✅ Check if backend API is running
✅ Use localStorage fallback for development
```

---

## Key Files Reference

| File | Purpose | Location |
|------|---------|----------|
| ImageUploadComponent | Core UI component | `src/components/` |
| ImageUploadService | ImgBB integration | `src/service/` |
| useImageUpload | React hook | `src/hooks/` |
| CustomerService | Database methods | `src/service/` |
| LocationDetailCard | Example: Detail page | `src/components/` |
| TableRowImageModal | Example: Modal | `src/components/` |
| QuickImageUploadCell | Example: Inline | `src/components/` |

---

## One More Thing: Environment Variables

### For Development
Uses localStorage fallback - works immediately!

### For Production
```javascript
// In CustomerService.js, these are called automatically:
await api.post('/api/locations/:id/images', { urls })
await api.delete('/api/locations/:id/images', { url })
```

Backend needs these endpoints. Until then, localStorage caches images locally.

---

**Pick a pattern above, copy it, customize, and go!** 🚀
