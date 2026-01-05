import React, { useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Image as PrimeImage } from 'primereact/image';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { ImageUploadService } from '../service/ImageUploadService';
import { CustomerService } from '../service/CustomerService';

/**
 * EXAMPLE 3: Quick Upload Cell for Data Table
 * Lightweight image upload directly in table cell
 * Perfect for inline editing
 */
export function QuickImageUploadCell({ rowData, onImageAdded }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [images, setImages] = useState(rowData?.images || []);
    const toastRef = useRef(null);

    const handleUpload = async (event) => {
        const file = event.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Upload to ImgBB
            const imgbbResult = await ImageUploadService.uploadImageToImgBB(
                file,
                `location-${rowData.id}-${Date.now()}`
            );

            // Step 2: Save URL to database
            const dbResult = await CustomerService.addImageToLocation(
                rowData.id,
                [imgbbResult.url]
            );

            // Step 3: Update local state
            const updatedImages = [...images, imgbbResult.url];
            setImages(updatedImages);

            // Step 4: Notify parent
            onImageAdded?.(updatedImages);

            // Step 5: Show success
            toastRef.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Image uploaded successfully',
                life: 3000
            });

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed');
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: err.message || 'Failed to upload image',
                life: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveImage = async (imageUrl) => {
        try {
            setIsLoading(true);
            await CustomerService.removeImageFromLocation(rowData.id, imageUrl);
            const updatedImages = images.filter(img => img !== imageUrl);
            setImages(updatedImages);
            onImageAdded?.(updatedImages);
            
            toastRef.current?.show({
                severity: 'info',
                summary: 'Removed',
                detail: 'Image removed successfully',
                life: 2000
            });
        } catch (err) {
            console.error('Remove error:', err);
            toastRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to remove image'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Toast ref={toastRef} />

            {/* Current Images */}
            <div style={{ display: 'flex', gap: '5px' }}>
                {images.slice(0, 3).map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                        <PrimeImage
                            src={img}
                            alt={`img-${idx}`}
                            width="40"
                            height="40"
                            preview
                            style={{
                                borderRadius: '4px',
                                objectFit: 'cover',
                                border: '1px solid #ddd'
                            }}
                        />
                        {isLoading === false && (
                            <button
                                onClick={() => handleRemoveImage(img)}
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                {images.length > 3 && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#666'
                    }}>
                        +{images.length - 3}
                    </div>
                )}
            </div>

            {/* Upload Button */}
            <FileUpload
                name="image"
                url="/" // Not used, handled by our handler
                accept="image/*"
                maxFileSize={32000000}
                auto={false}
                chooseLabel="+"
                className="p-button-rounded p-button-text"
                onSelect={handleUpload}
                disabled={isLoading}
                customUpload
                style={{ minWidth: 'auto' }}
            />

            {/* Error Message */}
            {error && (
                <span style={{ color: '#ff4444', fontSize: '12px' }}>
                    Error
                </span>
            )}
        </div>
    );
}

export default QuickImageUploadCell;
