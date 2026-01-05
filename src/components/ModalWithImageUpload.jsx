import React, { useState } from 'react';
import useImageUpload from '../hooks/useImageUpload';
import { CustomerService } from '../service/CustomerService';
import { ImageLightbox } from './ImageLightbox';

/**
 * Example: Integrating Image Upload ke Existing Modal Component
 * 
 * Ini adalah contoh cara integrate image upload functionality
 * ke modal/dialog yang sudah ada
 */
export function ModalWithImageUpload({ locationId, onSave }) {
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { uploadMultiple, isLoading, error, progress } = useImageUpload();
    const fileInputRef = React.useRef(null);

    const handleUploadImages = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        setIsUploading(true);
        try {
            const result = await uploadMultiple(files, locationId);
            
            if (result.success) {
                setImages(prev => [...prev, ...result.urls]);
                onSave?.(result.urls);
                
                // Reset input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async (imageUrl) => {
        try {
            await CustomerService.removeImageFromLocation(locationId, imageUrl);
            setImages(prev => prev.filter(img => img !== imageUrl));
        } catch (err) {
            console.error('Remove error:', err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Upload Images untuk Location #{locationId}</h3>
            
            {/* Upload Input */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadImages}
                    disabled={isLoading}
                    style={{
                        display: 'block',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                />
            </div>

            {/* Progress Bar */}
            {isLoading && (
                <div style={{
                    marginBottom: '20px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    padding: '10px'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '4px',
                        backgroundColor: '#4CAF50',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                    }} />
                    <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
                        Uploading... {progress}%
                    </p>
                </div>
            )}

            {/* Error Message */}
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

            {/* Images Gallery */}
            {images.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Uploaded Images ({images.length})</h4>
                    
                    {/* Lightbox Gallery */}
                    <ImageLightbox images={images} rowId={locationId} />
                    
                    {/* Grid with Remove Buttons */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '10px',
                        marginTop: '10px'
                    }}>
                        {images.map((image, index) => (
                            <div key={index} style={{
                                position: 'relative',
                                aspectRatio: '1',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={image}
                                    alt={`Uploaded ${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <button
                                    onClick={() => handleRemoveImage(image)}
                                    style={{
                                        position: 'absolute',
                                        top: '2px',
                                        right: '2px',
                                        width: '24px',
                                        height: '24px',
                                        padding: '0',
                                        border: 'none',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
                </div>
            )}
        </div>
    );
}

export default ModalWithImageUpload;
