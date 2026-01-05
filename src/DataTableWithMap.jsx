import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import MiniMap from './components/MiniMap';
import { Toast } from 'primereact/toast';

/**
 * Example integration of MiniMap with DataTable
 * Shows how to combine map and table for location management
 */
export default function DataTableWithMap({ tableData = [] }) {
    const toast = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [mapVisible, setMapVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Filter locations that have coordinates for map display
    const mapLocations = tableData.filter(item => 
        item.latitude && item.longitude
    );

    // Handle map marker click
    const handleMapLocationSelect = (location) => {
        setSelectedLocation(location);
        toast.current?.show({
            severity: 'info',
            summary: 'Location Selected',
            detail: `${location.location || location.address}`,
            life: 2000
        });
    };

    // Action button template for table
    const actionTemplate = (rowData) => {
        return (
            <div style={{ display: 'flex', gap: '5px' }}>
                <Button
                    icon="pi pi-map"
                    className="p-button-rounded p-button-info p-button-sm"
                    tooltip="View on Map"
                    onClick={() => {
                        if (rowData.latitude && rowData.longitude) {
                            setSelectedLocation(rowData);
                            setMapVisible(true);
                        } else {
                            toast.current?.show({
                                severity: 'warn',
                                summary: 'No Coordinates',
                                detail: 'This location does not have coordinates yet',
                                life: 2000
                            });
                        }
                    }}
                />
                <Button
                    icon="pi pi-info-circle"
                    className="p-button-rounded p-button-help p-button-sm"
                    tooltip="Details"
                    onClick={() => setSelectedLocation(rowData)}
                />
            </div>
        );
    };

    return (
        <div>
            <Toast ref={toast} />

            {/* Header */}
            <Card className="mb-4">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3>Locations Management</h3>
                        <small>Total locations: {tableData.length} | With coordinates: {mapLocations.length}</small>
                    </div>
                    <Button
                        icon="pi pi-map"
                        label="View All on Map"
                        onClick={() => setMapVisible(true)}
                        className="p-button-primary"
                    />
                </div>
            </Card>

            {/* Data Table */}
            <Card className="mb-4">
                <DataTable
                    value={tableData}
                    selectionMode="multiple"
                    selection={selectedRows}
                    onSelectionChange={(e) => setSelectedRows(e.value)}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    responsive
                    striped
                    scrollable
                    scrollHeight="400px"
                >
                    <Column selectionMode="multiple" header="Select" style={{ width: '3rem' }} />
                    <Column field="code" header="Code" sortable style={{ minWidth: '80px' }} />
                    <Column field="location" header="Location" sortable style={{ minWidth: '150px' }} />
                    <Column field="address" header="Address" sortable style={{ minWidth: '200px' }} />
                    <Column 
                        field="latitude" 
                        header="Coordinates" 
                        body={(rowData) => (
                            rowData.latitude && rowData.longitude ?
                                `${rowData.latitude.toFixed(4)}, ${rowData.longitude.toFixed(4)}` :
                                <span style={{ color: '#aaa' }}>-</span>
                        )}
                        style={{ minWidth: '150px' }}
                    />
                    <Column field="warehouse" header="Warehouse" sortable style={{ minWidth: '100px' }} />
                    <Column header="Actions" body={actionTemplate} style={{ minWidth: '120px' }} />
                </DataTable>
            </Card>

            {/* Selected Location Info */}
            {selectedLocation && (
                <Card 
                    className="mb-4"
                    title={`Selected: ${selectedLocation.location}`}
                    style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #007bff' }}
                >
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <p><strong>Code:</strong> {selectedLocation.code}</p>
                            <p><strong>Location:</strong> {selectedLocation.location}</p>
                        </div>
                        <div className="col-12 md:col-4">
                            <p><strong>Address:</strong></p>
                            <p style={{ color: '#666', fontSize: '0.9em' }}>{selectedLocation.address}</p>
                        </div>
                        <div className="col-12 md:col-4">
                            {selectedLocation.latitude && selectedLocation.longitude ? (
                                <>
                                    <p><strong>Coordinates:</strong></p>
                                    <p style={{ color: '#666', fontSize: '0.9em' }}>
                                        {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
                                    </p>
                                </>
                            ) : (
                                <p style={{ color: '#999' }}>No coordinates</p>
                            )}
                        </div>
                        <div className="col-12 md:col-4">
                            <p><strong>Warehouse:</strong> {selectedLocation.warehouse}</p>
                        </div>
                    </div>
                </Card>
            )}

            {/* Map Modal */}
            <Dialog
                visible={mapVisible}
                onHide={() => setMapVisible(false)}
                maximizable
                modal
                style={{ width: '90vw' }}
                header="📍 Location Map"
            >
                <MiniMap
                    locations={mapLocations}
                    style={{ height: '70vh' }}
                />
            </Dialog>
        </div>
    );
}
