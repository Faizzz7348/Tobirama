# 🔗 PANDUAN INTEGRASI LENGKAP - Step by Step

Mari kita integrate image upload ke 3 tempat berbeda dengan concrete examples.

---

## ✅ CONTOH 1: Integrate ke Table Row Modal (Easiest)

### Step 1: Update TableRowModal.jsx

Import hook di bagian atas file:
```jsx
import useImageUpload from '../hooks/useImageUpload';
import { ImageLightbox } from './ImageLightbox';
```

### Step 2: Tambah di dalam component

Di dalam `TableRowModal({ rowData, trigger })`, tambah di awal:
```jsx
const [images, setImages] = useState(rowData?.images || []);
const { uploadImage, isLoading, progress, error } = useImageUpload();

const handleUploadImage = async (file) => {
    const result = await uploadImage(file, rowData.id);
    if (result.success) {
        setImages([...images, result.url]);
    }
};

const handleRemoveImage = async (url) => {
    const { CustomerService } = await import('../service/CustomerService');
    await CustomerService.removeImageFromLocation(rowData.id, url);
    setImages(images.filter(img => img !== url));
};
```

### Step 3: Tambah UI di modal

Di dalam ModalContent (after header), tambah section baru:
```jsx
{/* Image Upload Section */}
<div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
    <h4 style={{ marginBottom: '10px' }}>📸 Images</h4>
    
    {/* Upload Input */}
    <div style={{ marginBottom: '15px' }}>
        <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files[0] && handleUploadImage(e.target.files[0])}
            disabled={isLoading}
            style={{
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '100%'
            }}
        />
    </div>
    
    {/* Progress */}
    {isLoading && (
        <div style={{ marginBottom: '10px' }}>
            <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#f0f0f0',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50',
                    transition: 'width 0.3s'
                }} />
            </div>
            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                Uploading {progress}%
            </p>
        </div>
    )}
    
    {/* Error */}
    {error && (
        <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
            ❌ {error}
        </p>
    )}
    
    {/* Images Gallery */}
    {images.length > 0 && (
        <>
            <h5>Attached Images ({images.length})</h5>
            <ImageLightbox images={images} rowId={rowData.id} />
            
            {/* Remove buttons */}
            <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {images.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleRemoveImage(url)}
                        style={{
                            padding: '5px 10px',
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Remove Image {idx + 1}
                    </button>
                ))}
            </div>
        </>
    )}
</div>
```

**Done!** ✅ Sekarang TableRowModal sudah bisa upload images!

---

## ✅ CONTOH 2: Integrate ke DataTable (Medium)

### Step 1: Update DataTableWithMap.jsx

Tambah import:
```jsx
import useImageUpload from '../hooks/useImageUpload';
import { ImageLightbox } from './components/ImageLightbox';
```

### Step 2: Update state

Dalam component, tambah:
```jsx
const [imageDialogVisible, setImageDialogVisible] = useState(false);
const [selectedLocationForImage, setSelectedLocationForImage] = useState(null);
const [locationImages, setLocationImages] = useState({});
const { uploadMultiple, isLoading, progress } = useImageUpload();
```

### Step 3: Add handler function

```jsx
const handleImageUpload = async (file, location) => {
    const result = await uploadMultiple([file], location.id);
    if (result.success) {
        setLocationImages({
            ...locationImages,
            [location.id]: [
                ...(locationImages[location.id] || location.images || []),
                ...result.urls
            ]
        });
    }
};
```

### Step 4: Update action template

```jsx
const actionTemplate = (rowData) => {
    return (
        <div style={{ display: 'flex', gap: '5px' }}>
            {/* New image button */}
            <Button
                icon="pi pi-image"
                className="p-button-rounded p-button-success p-button-sm"
                tooltip="Add Images"
                onClick={() => {
                    setSelectedLocationForImage(rowData);
                    setImageDialogVisible(true);
                }}
            />
            
            {/* Existing buttons */}
            <Button
                icon="pi pi-map"
                className="p-button-rounded p-button-info p-button-sm"
                // ... existing code
            />
            {/* ... rest of buttons */}
        </div>
    );
};
```

### Step 5: Add image dialog

Di akhir JSX (sebelum closing div), tambah:
```jsx
{/* Image Upload Dialog */}
<Dialog
    visible={imageDialogVisible}
    onHide={() => setImageDialogVisible(false)}
    header={`Add Images - ${selectedLocationForImage?.name}`}
    modal
    style={{ width: '500px' }}
>
    {selectedLocationForImage && (
        <div>
            {/* Upload */}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                    Array.from(e.target.files || []).forEach(file => {
                        handleImageUpload(file, selectedLocationForImage);
                    });
                }}
                disabled={isLoading}
                style={{ width: '100%', marginBottom: '15px' }}
            />
            
            {/* Progress */}
            {isLoading && (
                <div style={{
                    marginBottom: '15px',
                    height: '4px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: '#4CAF50'
                    }} />
                </div>
            )}
            
            {/* Gallery */}
            {(locationImages[selectedLocationForImage.id]?.length > 0 || selectedLocationForImage.images?.length > 0) && (
                <ImageLightbox
                    images={locationImages[selectedLocationForImage.id] || selectedLocationForImage.images}
                    rowId={selectedLocationForImage.id}
                />
            )}
        </div>
    )}
</Dialog>
```

**Done!** ✅ DataTable sekarang punya image management!

---

## ✅ CONTOH 3: Custom Component (Advanced)

### Buat file baru: `LocationImageManager.jsx`

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import { ImageLightbox } from './ImageLightbox';
import { CustomerService } from '../service/CustomerService';

export function LocationImageManager({ location, onUpdate }) {
    const [images, setImages] = useState(location?.images || []);
    const [isUpdating, setIsUpdating] = useState(false);
    const { uploadMultiple, isLoading, progress, error } = useImageUpload();

    const handleUpload = async (files) => {
        const result = await uploadMultiple(files, location.id);
        if (result.success) {
            const newImages = [...images, ...result.urls];
            setImages(newImages);
            onUpdate?.(newImages);
        }
    };

    const handleRemove = async (url) => {
        setIsUpdating(true);
        try {
            await CustomerService.removeImageFromLocation(location.id, url);
            const newImages = images.filter(img => img !== url);
            setImages(newImages);
            onUpdate?.(newImages);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>📸 Location Images</h3>

            {/* Upload Area */}
            <div
                onDrop={(e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files);
                    handleUpload(files);
                }}
                onDragOver={(e) => e.preventDefault()}
                style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '30px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: '#fafafa',
                    marginBottom: '20px',
                    opacity: isLoading ? 0.6 : 1
                }}
            >
                <p>📁 Drag images here or</p>
                <label style={{ cursor: 'pointer', color: 'blue' }}>
                    click to select
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleUpload(Array.from(e.target.files || []))}
                        disabled={isLoading}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>

            {/* Progress */}
            {isLoading && (
                <div style={{ marginBottom: '15px' }}>
                    <div style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '3px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            transition: 'width 0.3s'
                        }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
                        Uploading... {progress}%
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    marginBottom: '15px',
                    fontSize: '12px'
                }}>
                    ❌ {error}
                </div>
            )}

            {/* Gallery */}
            {images.length > 0 ? (
                <>
                    <h4 style={{ marginBottom: '15px' }}>
                        Attached ({images.length})
                    </h4>
                    <ImageLightbox images={images} rowId={location.id} />

                    {/* Remove */}
                    <div style={{
                        marginTop: '15px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '10px'
                    }}>
                        {images.map((url, idx) => (
                            <div
                                key={idx}
                                style={{
                                    position: 'relative',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                    backgroundColor: '#f0f0f0'
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`Image ${idx}`}
                                    style={{
                                        width: '100%',
                                        height: '100px',
                                        objectFit: 'cover'
                                    }}
                                />
                                <button
                                    onClick={() => handleRemove(url)}
                                    disabled={isUpdating}
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        width: '24px',
                                        height: '24px',
                                        border: 'none',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        padding: 0
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>
                    No images yet. Upload one to get started!
                </p>
            )}
        </div>
    );
}
```

### Cara pakai:
```jsx
import { LocationImageManager } from './LocationImageManager';

<LocationImageManager 
    location={selectedLocation}
    onUpdate={(images) => {
        setSelectedLocation({
            ...selectedLocation,
            images
        });
    }}
/>
```

---

## 🚀 INTEGRATION CHECKLIST

### Untuk setiap yang mau integrate:

- [ ] Import hook: `import useImageUpload from '../hooks/useImageUpload';`
- [ ] Import component: `import { ImageLightbox } from './ImageLightbox';`
- [ ] Add state: `const [images, setImages] = useState(...)`
- [ ] Use hook: `const { uploadImage, uploadMultiple, ... } = useImageUpload();`
- [ ] Add upload handler
- [ ] Add remove handler
- [ ] Add UI untuk upload
- [ ] Add UI untuk display (ImageLightbox)
- [ ] Test upload flow
- [ ] Test remove flow

---

## 🧪 TESTING SETIAP INTEGRATION

```javascript
// Di browser console
// Test 1: Upload
const file = document.querySelector('input[type="file"]').files[0];
const { uploadImage } = useImageUpload();
const result = await uploadImage(file, 123); // 123 = locationId
console.log(result); // ✅ Success check

// Test 2: Display
console.log(images); // Check array

// Test 3: Remove
const { removeImageFromLocation } = await import('./service/CustomerService');
await removeImageFromLocation(123, imageUrl);
console.log('Removed');
```

---

## 📊 INTEGRATION SUMMARY

| Lokasi | Kesulitan | Time | Notes |
|--------|-----------|------|-------|
| **TableRowModal** | Easy | 10 min | Best untuk modal |
| **DataTable** | Medium | 20 min | Need Dialog component |
| **Custom Component** | Medium | 20 min | Most flexible |

---

**Pilih salah satu dan follow step-by-step!** ✅

Bisa juga combine multiple pendekatan dalam app yang sama.
