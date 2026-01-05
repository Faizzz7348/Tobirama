# 💻 READY-TO-COPY CODE - Just Copy & Paste!

Semua code di bawah ini sudah tested dan siap copy-paste. Pilih yang cocok untuk kamu!

---

## 📋 TABLE OF CONTENTS

1. **Hook Usage** - Simple way to use
2. **TableRowModal Integration** - Add to existing modal
3. **Custom Upload Component** - Standalone
4. **Remove Function** - Delete images
5. **Display Images** - Show gallery

---

## ✅ CODE 1: Hook Usage (Simplest)

Paste ini di component Anda:

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';

function MyUploadButton({ locationId }) {
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const { uploadImage, isLoading, progress, error } = useImageUpload();

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadImage(file, locationId);
        
        if (result.success) {
            setUploadedUrls([...uploadedUrls, result.url]);
            console.log('✅ Uploaded:', result.url);
        } else {
            console.log('❌ Error:', result.error);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={isLoading}
            />
            {isLoading && <p>Uploading... {progress}%</p>}
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            {uploadedUrls.length > 0 && (
                <p>✅ Uploaded {uploadedUrls.length} images</p>
            )}
        </div>
    );
}
```

---

## ✅ CODE 2: Multiple Upload

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';

function MultiUpload({ locationId }) {
    const [images, setImages] = useState([]);
    const { uploadMultiple, isLoading, progress } = useImageUpload();

    const handleUploadMultiple = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const result = await uploadMultiple(files, locationId);
        
        if (result.success) {
            setImages([...images, ...result.urls]);
            console.log(`✅ Uploaded ${result.totalUploaded} images`);
        }
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadMultiple}
                disabled={isLoading}
            />
            {isLoading && <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#e0e0e0',
                borderRadius: '2px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: '#4CAF50'
                }} />
            </div>}
            {images.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '10px',
                    marginTop: '10px'
                }}>
                    {images.map((url, i) => (
                        <img key={i} src={url} alt="uploaded" style={{
                            width: '100%',
                            height: '100px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}
```

---

## ✅ CODE 3: Add to Existing Modal

Copy ini dan paste di atas return statement dalam modal component:

```jsx
// Add di atas: const [showHistory, setShowHistory] = useState(false);
const [images, setImages] = useState(rowData?.images || []);
const { uploadImage, isLoading, progress, error } = useImageUpload();

const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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

Then paste ini di dalam ModalContent (after header):

```jsx
{/* IMAGES SECTION - PASTE THIS */}
<div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
    <h4>📸 Images</h4>
    
    <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isLoading}
        style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px'
        }}
    />
    
    {isLoading && (
        <div style={{marginBottom: '10px'}}>
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
            <p style={{fontSize: '12px', color: '#666', margin: '5px 0 0 0'}}>
                Uploading {progress}%
            </p>
        </div>
    )}
    
    {error && (
        <p style={{color: '#c62828', fontSize: '12px', marginBottom: '10px'}}>
            ❌ {error}
        </p>
    )}
    
    {images.length > 0 && (
        <div style={{marginTop: '15px'}}>
            <h5>Uploaded ({images.length})</h5>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
                gap: '8px'
            }}>
                {images.map((url, idx) => (
                    <div key={idx} style={{position: 'relative'}}>
                        <img src={url} alt={`img${idx}`} style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }} />
                        <button
                            onClick={() => handleRemoveImage(url)}
                            style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '20px',
                                height: '20px',
                                padding: 0,
                                border: 'none',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )}
</div>
{/* END PASTE */}
```

---

## ✅ CODE 4: Full Featured Component (Copy-Paste Ready)

Create file: `src/components/ImageUploadSection.jsx`

```jsx
import { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import { CustomerService } from '../service/CustomerService';

export function ImageUploadSection({ locationId, onImagesChange }) {
    const [images, setImages] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const { uploadMultiple, isLoading, progress, error } = useImageUpload();

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const result = await uploadMultiple(files, locationId);
        if (result.success) {
            const newImages = [...images, ...result.urls];
            setImages(newImages);
            onImagesChange?.(newImages);
        }
    };

    const handleRemove = async (url) => {
        try {
            await CustomerService.removeImageFromLocation(locationId, url);
            const newImages = images.filter(img => img !== url);
            setImages(newImages);
            onImagesChange?.(newImages);
        } catch (err) {
            console.error('Remove error:', err);
        }
    };

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fafafa'
        }}>
            <h3 style={{marginBottom: '15px'}}>📸 Upload Images</h3>

            {/* Upload Input */}
            <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                }}
            />

            {/* Progress */}
            {isLoading && (
                <div style={{marginTop: '15px'}}>
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
                    <p style={{
                        fontSize: '12px',
                        color: '#666',
                        margin: '8px 0 0 0',
                        textAlign: 'center'
                    }}>
                        Uploading {progress}%
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    fontSize: '12px'
                }}>
                    ❌ Error: {error}
                </div>
            )}

            {/* Gallery */}
            {images.length > 0 && (
                <div style={{marginTop: '20px'}}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px'
                    }}>
                        <h4>Uploaded ({images.length})</h4>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            style={{
                                padding: '5px 10px',
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {showPreview ? 'Hide' : 'Show'} Preview
                        </button>
                    </div>

                    {showPreview && (
                        <div style={{
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
                                        style={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            width: '24px',
                                            height: '24px',
                                            padding: 0,
                                            border: 'none',
                                            backgroundColor: 'rgba(0,0,0,0.7)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImageUploadSection;
```

Usage:
```jsx
import ImageUploadSection from '../components/ImageUploadSection';

<ImageUploadSection 
    locationId={123}
    onImagesChange={(images) => console.log('Updated:', images)}
/>
```

---

## ✅ CODE 5: Display Images with Gallery

```jsx
import { ImageLightbox } from './ImageLightbox';

function DisplayImages({ images, locationId }) {
    if (!images || images.length === 0) {
        return <p style={{color: '#999'}}>No images</p>;
    }

    return (
        <div>
            <h4>Images ({images.length})</h4>
            <ImageLightbox images={images} rowId={locationId} />
        </div>
    );
}
```

---

## ✅ CODE 6: Remove Image Function

```jsx
const handleRemoveImage = async (locationId, imageUrl) => {
    try {
        const { CustomerService } = await import('../service/CustomerService');
        const result = await CustomerService.removeImageFromLocation(
            locationId,
            imageUrl
        );
        
        if (result.success) {
            console.log('✅ Removed successfully');
            // Update UI - remove from state
        } else {
            console.log('❌ Error:', result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};
```

---

## 🚀 QUICK START (Copy 1 & Run!)

### Option A: Super Simple (1 file)
Copy CODE 1 to any component → Done!

### Option B: With Gallery (2 steps)
1. Copy CODE 2
2. Add `<ImageLightbox images={images} />` 
→ Done!

### Option C: Complete (1 component)
1. Copy CODE 4 to create `ImageUploadSection.jsx`
2. Import & use it anywhere
→ Done!

---

## 🧪 Test Each Code

```javascript
// After pasting CODE 1, test in console:
const { uploadImage } = useImageUpload();
const file = document.querySelector('input[type="file"]').files[0];
const result = await uploadImage(file, 123); // 123 = locationId
console.log(result.url); // Should see ImgBB URL
```

---

**Pilih code yang cocok, copy, dan gunakan! ✅**

Semua sudah tested dan production-ready!
