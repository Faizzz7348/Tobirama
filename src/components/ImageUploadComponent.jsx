import { useRef, useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import { CustomerService } from "../service/CustomerService";

/**
 * ImageUploadComponent - Complete Image Management
 * 
 * Features:
 * - Single & multiple file upload
 * - Progress tracking
 * - Image preview gallery
 * - Remove image functionality
 * - Error handling
 * - Lightbox integration
 * 
 * @param {number} locationId - Location ID to attach images to
 * @param {function} onImagesUploaded - Callback when images uploaded
 * @param {boolean} showGallery - Show lightbox gallery (default: true)
 * @param {boolean} showRemove - Show remove buttons (default: true)
 */
export function ImageUploadComponent({ 
    locationId, 
    onImagesUploaded,
    showGallery = true,
    showRemove = true 
}) {
    const fileInputRef = useRef(null);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isRemoving, setIsRemoving] = useState(false);
    const { uploadImage, uploadMultiple, isLoading, error, progress } = useImageUpload();

    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        
        if (files.length === 0) return;

        if (files.length === 1) {
            // Single file upload
            const result = await uploadImage(files[0], locationId);
            
            if (result.success) {
                const newImages = [...uploadedImages, {
                    url: result.url,
                    displayUrl: result.displayUrl
                }];
                setUploadedImages(newImages);
                onImagesUploaded?.([result.url]);
            }
        } else {
            // Multiple files upload
            const result = await uploadMultiple(files, locationId);
            
            if (result.success) {
                const newImages = [
                    ...uploadedImages,
                    ...result.urls.map(url => ({ url, displayUrl: url }))
                ];
                setUploadedImages(newImages);
                onImagesUploaded?.(result.urls);
            }
        }

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = async (url) => {
        setIsRemoving(true);
        try {
            await CustomerService.removeImageFromLocation(locationId, url);
            setUploadedImages(prev => prev.filter(img => img.url !== url));
        } catch (err) {
            console.error('Error removing image:', err);
            alert('Error removing image: ' + err.message);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
            maxWidth: '600px'
        }}>
            <h3 style={{ marginBottom: '15px' }}>📸 Upload Images</h3>
            
            <div style={{ marginBottom: '20px' }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isLoading}
                    style={{
                        padding: '10px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                />
            </div>

            {/* Loading progress */}
            {isLoading && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: '#4CAF50',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
                        Uploading... {progress}%
                    </p>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}

            {/* Uploaded images grid */}
            {uploadedImages.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Uploaded Images ({uploadedImages.length})</h4>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                        gap: '10px'
                    }}>
                        {uploadedImages.map((image, index) => (
                            <div
                                key={index}
                                style={{
                                    position: 'relative',
                                    aspectRatio: '1',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={image.displayUrl || image.url}
                                    alt={`Uploaded ${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <button
                                    onClick={() => handleRemoveImage(image.url)}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        width: '24px',
                                        height: '24px',
                                        padding: '0',
                                        border: 'none',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    );
}

export default ImageUploadComponent;
