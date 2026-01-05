import React, { useState } from 'react';
import { ImageUploadComponent } from './ImageUploadComponent';
import { ImageLightbox } from './ImageLightbox';

/**
 * EXAMPLE 1: Location Detail Card
 * Shows how to use ImageUploadComponent in a card/detail view
 */
export function LocationDetailCard({ location, onLocationUpdate }) {
    const [images, setImages] = useState(location?.images || []);

    const handleImagesUploaded = (newUrls) => {
        const updatedImages = [...images, ...newUrls];
        setImages(updatedImages);
        onLocationUpdate?.({
            ...location,
            images: updatedImages
        });
    };

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: 'white',
            maxWidth: '700px',
            margin: '20px auto'
        }}>
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ margin: '0 0 5px 0' }}>{location?.name || 'Location Detail'}</h2>
                <p style={{ color: '#666', margin: 0 }}>
                    Code: {location?.code} | ID: {location?.id}
                </p>
            </div>

            {/* Divider */}
            <hr style={{ margin: '15px 0' }} />

            {/* Location Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <div>
                    <label style={{ color: '#999', fontSize: '12px' }}>Delivery</label>
                    <p style={{ margin: '5px 0 0 0' }}>{location?.delivery}</p>
                </div>
                <div>
                    <label style={{ color: '#999', fontSize: '12px' }}>Power Mode</label>
                    <p style={{ margin: '5px 0 0 0' }}>{location?.powerMode}</p>
                </div>
                <div>
                    <label style={{ color: '#999', fontSize: '12px' }}>Address</label>
                    <p style={{ margin: '5px 0 0 0' }}>{location?.address || 'N/A'}</p>
                </div>
                <div>
                    <label style={{ color: '#999', fontSize: '12px' }}>Images</label>
                    <p style={{ margin: '5px 0 0 0' }}>{images.length} uploaded</p>
                </div>
            </div>

            {/* Divider */}
            <hr style={{ margin: '15px 0' }} />

            {/* Image Upload Component */}
            <ImageUploadComponent
                locationId={location?.id}
                onImagesUploaded={handleImagesUploaded}
                showGallery={true}
                showRemove={true}
            />

            {/* Display Images if Any */}
            {images.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ marginBottom: '15px' }}>
                        Attached Images ({images.length})
                    </h4>
                    <ImageLightbox images={images} rowId={location?.id} />
                </div>
            )}

            {/* Footer */}
            <div style={{
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
            }}>
                <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Cancel
                </button>
                <button style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default LocationDetailCard;
