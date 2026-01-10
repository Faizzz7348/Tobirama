import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl, ZoomControl } from 'react-leaflet';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { MultiStateCheckbox } from 'primereact/multistatecheckbox';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { BaseLayer } = LayersControl;

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [15, 25],        // Smaller size (reduced from 20x33)
    iconAnchor: [7, 25],       // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -25],     // Point from which the popup should open relative to the iconAnchor
    shadowSize: [25, 25]       // Smaller shadow size
});

// Function to create custom colored marker icon
const createColoredMarkerIcon = (color = '#dc3545') => {
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `
            <div style="position: relative; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
                <svg width="24" height="32" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C8.925 0 4 4.925 4 11c0 8.25 11 29 11 29s11-20.75 11-29c0-6.075-4.925-11-11-11z" 
                          fill="${color}" 
                          stroke="white" 
                          stroke-width="2"/>
                    <circle cx="15" cy="11" r="4" fill="white"/>
                </svg>
            </div>
        `,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -32]
    });
};

// Component to update map view when coordinates change
function MapUpdater({ center, zoom }) {
    const map = useMap();
    
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    
    return null;
}

export default function MiniMap({ latitude, longitude, address, locations = [], style = {}, onMarkerColorChange, isDark = false }) {
    const [fullscreenVisible, setFullscreenVisible] = useState(false);
    const [addressExpanded, setAddressExpanded] = useState(false);
    const [mapType, setMapType] = useState('street');
    const mapTypeOptions = [
        { label: 'Street', value: 'street', icon: 'pi pi-map' },
        { label: 'Satellite', value: 'satellite', icon: 'pi pi-image' },
        { label: 'Topographic', value: 'topographic', icon: 'pi pi-compass' }
    ];
    
    // Default marker color
    const defaultMarkerColor = '#dc3545';
    
    // Default coordinates (Kuala Lumpur) if no coordinates provided
    const defaultLat = 3.139;
    const defaultLng = 101.6869;
    
    // Malaysia bounds to restrict map area (reduce lag)
    // Southwest: [0.8, 99.6], Northeast: [7.4, 119.3]
    const malaysiaBounds = [
        [0.8, 99.6],    // Southwest corner (Johor area)
        [7.4, 119.3]     // Northeast corner (Sabah/Sarawak area)
    ];
    
    // If locations array is provided (multiple markers mode)
    const isMultipleMarkers = locations && locations.length > 0;
    
    let center, zoom, hasValidCoordinates;
    
    if (isMultipleMarkers) {
        // Filter locations with valid coordinates
        const validLocations = locations.filter(loc => 
            loc.latitude !== null && loc.latitude !== undefined &&
            loc.longitude !== null && loc.longitude !== undefined
        );
        
        if (validLocations.length > 0) {
            // Calculate center from all valid locations
            const avgLat = validLocations.reduce((sum, loc) => sum + loc.latitude, 0) / validLocations.length;
            const avgLng = validLocations.reduce((sum, loc) => sum + loc.longitude, 0) / validLocations.length;
            center = [avgLat, avgLng];
            zoom = validLocations.length === 1 ? 15 : 12;
            hasValidCoordinates = true;
        } else {
            center = [defaultLat, defaultLng];
            zoom = 11;
            hasValidCoordinates = false;
        }
    } else {
        // Single marker mode
        const lat = latitude !== null && latitude !== undefined ? latitude : defaultLat;
        const lng = longitude !== null && longitude !== undefined ? longitude : defaultLng;
        center = [lat, lng];
        zoom = latitude !== null && latitude !== undefined && 
               longitude !== null && longitude !== undefined ? 15 : 11;
        hasValidCoordinates = latitude !== null && latitude !== undefined && 
                            longitude !== null && longitude !== undefined;
    }

    const getTileLayerUrl = () => {
        switch(mapType) {
            case 'satellite':
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case 'topographic':
                return "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
            case 'dark':
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            default:
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        }
    };

    return (
        <>
            {/* Mini Map Container */}
            <div style={{ position: 'relative', ...style }}>
                {/* Single map-type toggle (MultiStateCheckbox) */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1001 }}>
                    <MultiStateCheckbox
                        value={mapType}
                        options={mapTypeOptions}
                        optionValue="value"
                        className="maptype-toggle"
                        onChange={(e) => setMapType(e.value)}
                        tooltip={mapTypeOptions.find(o => o.value === mapType)?.label}
                        tooltipOptions={{ position: 'bottom' }}
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            background: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                            color: isDark ? '#93c5fd' : '#374151'
                        }}
                    />
                </div>

                <MapContainer
                    center={center}
                    zoom={zoom}
                    style={{ 
                        height: '250px', 
                        width: '100%', 
                        borderRadius: '12px',
                        border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0,0,0,0.1)'}`,
                        boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    className="mini-map-container"
                    scrollWheelZoom={false}
                    dragging={false}
                    doubleClickZoom={false}
                    zoomControl={false}
                    touchZoom={false}
                    maxBounds={malaysiaBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
                    maxZoom={18}
                >
                    <TileLayer
                        attribution={mapType === 'satellite' ? '&copy; <a href="https://www.esri.com">Esri</a>' : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                        url={getTileLayerUrl()}
                    />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker 
                                    key={index} 
                                    position={[loc.latitude, loc.longitude]}
                                    icon={createColoredMarkerIcon(loc.markerColor || defaultMarkerColor)}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '200px' }}>
                                            <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                                {loc.location || `Location ${index + 1}`}
                                            </strong>
                                            {loc.code && <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Code: {loc.code}</div>}
                                            {loc.address && <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>{loc.address}</div>}
                                            <div style={{ fontSize: '10px', color: '#999', marginTop: '6px' }}>
                                                Lat: {loc.latitude.toFixed(6)}, Lng: {loc.longitude.toFixed(6)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))
                    ) : (
                        // Single marker
                        hasValidCoordinates && (
                            <Marker 
                                position={center}
                                icon={createColoredMarkerIcon(locations[0]?.markerColor || defaultMarkerColor)}
                            >
                                <Popup>
                                    <div style={{ minWidth: '180px' }}>
                                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                            {address || 'Location'}
                                        </strong>
                                        <div style={{ fontSize: '10px', color: '#999' }}>
                                            Lat: {center[0].toFixed(6)}, Lng: {center[1].toFixed(6)}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
                
                {/* Fullscreen Button */}
                <Button
                    icon="pi pi-window-maximize"
                    className="p-button-rounded p-button-info"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 1000,
                        width: '40px',
                        height: '40px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                    onClick={() => setFullscreenVisible(true)}
                    tooltip="Open Fullscreen Map"
                    tooltipOptions={{ position: 'left' }}
                />
                
                {/* Address Caption */}
                {!isMultipleMarkers && address && (
                    <div 
                        className="map-address-caption"
                        style={{
                            marginTop: '10px',
                            padding: '8px 12px',
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontFamily: "'Open Sans', sans-serif",
                            color: isDark ? '#93c5fd' : '#1f2937',
                            textAlign: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.1)'}`,
                            backdropFilter: 'blur(8px)'
                        }}
                        onClick={() => setAddressExpanded(!addressExpanded)}
                    >
                        <i 
                            className={`pi ${addressExpanded ? 'pi-chevron-up' : 'pi-chevron-down'}`} 
                            style={{ 
                                fontSize: '9px',
                                color: '#dc3545',
                                transition: 'transform 0.2s ease'
                            }}
                        ></i>
                        <i className="pi pi-map-marker" style={{ fontSize: '10px', color: '#dc3545' }}></i>
                        <span style={{
                            overflow: addressExpanded ? 'visible' : 'hidden',
                            textOverflow: addressExpanded ? 'clip' : 'ellipsis',
                            whiteSpace: addressExpanded ? 'normal' : 'nowrap',
                            maxWidth: addressExpanded ? 'none' : '100%',
                            display: addressExpanded ? 'block' : 'inline'
                        }}>
                            {address}
                        </span>
                    </div>
                )}
                

                
                {!hasValidCoordinates && (
                    <div className="map-info-box map-info-warning" style={{
                        marginTop: '10px',
                        padding: '10px 12px',
                        backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fff3cd',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: isDark ? '#fbbf24' : '#856404',
                        textAlign: 'center',
                        boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                        border: `1px solid ${isDark ? 'rgba(217, 119, 6, 0.3)' : 'rgba(0,0,0,0.1)'}`
                    }}>
                        <i className="pi pi-info-circle" style={{ marginRight: '5px', fontSize: '14px' }}></i>
                        {isMultipleMarkers ? 'No locations with coordinates found.' : 'No coordinates set. Showing default location (KL).'}
                    </div>
                )}
            </div>
            
            {/* Fullscreen Dialog */}
            <Dialog
                header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="pi pi-map" style={{ fontSize: '1.3rem', color: '#06b6d4' }}></i>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                            {isMultipleMarkers ? 'Route Map View' : 'Map View'}
                        </span>
                    </div>
                }
                visible={fullscreenVisible}
                style={{ width: '95vw', height: '95vh' }}
                maximizable
                modal
                onHide={() => setFullscreenVisible(false)}
                contentStyle={{ height: 'calc(100% - 60px)', padding: 0, overflow: 'hidden' }}
                className="fullscreen-map-dialog"
            >
                {/* Fullscreen map-type toggle (MultiStateCheckbox) */}
                <div style={{ position: 'absolute', top: '14px', left: '16px', zIndex: 1500 }}>
                    <MultiStateCheckbox
                        value={mapType}
                        options={mapTypeOptions}
                        optionValue="value"
                        className="maptype-toggle"
                        onChange={(e) => setMapType(e.value)}
                        tooltip={mapTypeOptions.find(o => o.value === mapType)?.label}
                        tooltipOptions={{ position: 'bottom' }}
                        style={{
                            width: '42px',
                            height: '42px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            background: 'transparent',
                            border: 'none',
                            boxShadow: 'none',
                            color: isDark ? '#93c5fd' : '#374151'
                        }}
                    />
                </div>

                <MapContainer
                    center={center}
                    zoom={zoom + 1}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                    zoomControl={false}
                    maxBounds={malaysiaBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
                    maxZoom={19}
                >
                    <TileLayer
                        attribution={
                            mapType === 'satellite'
                                ? '&copy; <a href="https://www.esri.com">Esri</a>'
                                : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        }
                        url={getTileLayerUrl()}
                    />
                    <ZoomControl position="bottomright" />
                    <MapUpdater center={center} zoom={zoom + 1} />
                    {isMultipleMarkers ? (
                        // Multiple markers
                        locations
                            .filter(loc => loc.latitude !== null && loc.latitude !== undefined &&
                                         loc.longitude !== null && loc.longitude !== undefined)
                            .map((loc, index) => (
                                <Marker 
                                    key={index} 
                                    position={[loc.latitude, loc.longitude]}
                                    icon={createColoredMarkerIcon(loc.markerColor || defaultMarkerColor)}
                                >
                                    <Popup>
                                        <div style={{ minWidth: '220px' }}>
                                            <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                                {loc.location || `Location ${index + 1}`}
                                            </strong>
                                            {loc.code && <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>Code: {loc.code}</div>}
                                            {loc.address && <div style={{ fontSize: '11px', color: '#666', marginBottom: '4px' }}>{loc.address}</div>}
                                            <div style={{ fontSize: '10px', color: '#999', marginTop: '6px' }}>
                                                Lat: {loc.latitude.toFixed(6)}
                                                <br />
                                                Lng: {loc.longitude.toFixed(6)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))
                    ) : (
                        // Single marker
                        hasValidCoordinates && (
                            <Marker 
                                position={center}
                                icon={createColoredMarkerIcon(locations[0]?.markerColor || defaultMarkerColor)}
                            >
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <strong style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                                            {address || 'Location'}
                                        </strong>
                                        <div style={{ fontSize: '10px', color: '#999' }}>
                                            Lat: {center[0].toFixed(6)}
                                            <br />
                                            Lng: {center[1].toFixed(6)}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
                
                {!isMultipleMarkers && address && (
                    <div className="fullscreen-map-badge" style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '85%',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.1)'}`,
                        color: isDark ? '#93c5fd' : '#1f2937'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '10px', color: '#dc3545', fontSize: '16px' }}></i>
                        <strong style={{ fontSize: '14px' }}>{address}</strong>
                    </div>
                )}
                
                {isMultipleMarkers && (
                    <div className="fullscreen-map-badge" style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        maxWidth: '85%',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0,0,0,0.1)'}`,
                        color: isDark ? '#93c5fd' : '#1f2937'
                    }}>
                        <i className="pi pi-map-marker" style={{ marginRight: '10px', color: '#06b6d4', fontSize: '16px' }}></i>
                        <strong style={{ fontSize: '14px' }}>{locations.filter(loc => loc.latitude && loc.longitude).length} Locations on Map</strong>
                        <i className="pi pi-map-marker" style={{ marginRight: '10px', color: '#06b6d4', fontSize: '16px' }}></i>
                        <strong style={{ fontSize: '14px' }}>{locations.filter(loc => loc.latitude && loc.longitude).length} Locations on Map</strong>
                    </div>
                )}
            </Dialog>
        </>
    );
}
