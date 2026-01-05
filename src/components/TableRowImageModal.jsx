import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { ImageUploadComponent } from './ImageUploadComponent';
import { ImageLightbox } from './ImageLightbox';

/**
 * EXAMPLE 2: Modal for Adding Images to Table Row
 * Shows how to use ImageUploadComponent in a modal/dialog
 */
export function TableRowImageModal({ rowData, visible, onHide, onImagesAdded }) {
    const [images, setImages] = useState(rowData?.images || []);

    const handleImagesUploaded = (newUrls) => {
        const updatedImages = [...images, ...newUrls];
        setImages(updatedImages);
        onImagesAdded?.(updatedImages);
    };

    const handleClose = () => {
        setImages(rowData?.images || []);
        onHide();
    };

    return (
        <Dialog
            visible={visible}
            onHide={handleClose}
            header={`📸 Manage Images - ${rowData?.name || rowData?.location}`}
            modal
            style={{ width: '600px' }}
            className="p-dialog"
        >
            {rowData && (
                <div>
                    {/* Info */}
                    <div style={{
                        backgroundColor: '#f5f5f5',
                        padding: '15px',
                        borderRadius: '4px',
                        marginBottom: '20px'
                    }}>
                        <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                            Location: <strong>{rowData.location || rowData.name}</strong>
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                            Code: <strong>{rowData.code}</strong> | Current Images: <strong>{images.length}</strong>
                        </p>
                    </div>

                    {/* Upload Component */}
                    <ImageUploadComponent
                        locationId={rowData.id}
                        onImagesUploaded={handleImagesUploaded}
                    />

                    {/* Gallery */}
                    {images.length > 0 && (
                        <div style={{ marginTop: '25px' }}>
                            <h4 style={{ marginBottom: '15px' }}>
                                Attached Images ({images.length})
                            </h4>
                            <ImageLightbox images={images} rowId={rowData.id} />
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'flex-end'
                    }}>
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            onClick={handleClose}
                            className="p-button-text"
                        />
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleClose}
                            className="p-button-success"
                        />
                    </div>
                </div>
            )}
        </Dialog>
    );
}

export default TableRowImageModal;
