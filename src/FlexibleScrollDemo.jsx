import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { SpeedDial } from 'primereact/speeddial';
import { CustomerService } from './service/CustomerService';
import { ImageLightbox } from './components/ImageLightbox';
import MiniMap from './components/MiniMap';
import MarkerColorPicker from './components/MarkerColorPicker';
import { TableRowModal } from './components/TableRowModal';
import { EditableDescriptionList } from './components/EditableDescriptionList';
import { useDeviceDetect, getResponsiveStyles } from './hooks/useDeviceDetect';
import { usePWAInstall } from './hooks/usePWAInstall';
import { uploadImageToImgBB } from './service/ImageUploadService';
import QrScanner from 'qr-scanner';

// CSS untuk remove border dari table header
const tableStyles = `
    /* Global border removal for light mode */
    .p-component {
        border: none !important;
    }
    
    /* Remove all dialog borders in light mode */
    .p-dialog .p-dialog-header {
        border-bottom: none !important;
    }
    
    .p-dialog .p-dialog-content {
        border: none !important;
    }
    
    .p-dialog .p-dialog-footer {
        border-top: none !important;
    }
    
    /* Remove button borders in light mode */
    .p-button {
        border: none !important;
        outline: none !important;
    }
    
    .p-button:focus {
        box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6 !important;
        outline: none !important;
    }
    
    body.dark .p-button:focus {
        box-shadow: 0 0 0 2px #1e293b, 0 0 0 4px #60a5fa !important;
    }
    
    /* Remove input borders in light mode */
    .p-inputtext {
        border: 1px solid #d1d5db !important;
        outline: none !important;
    }
    
    .p-inputtext:focus {
        border-color: #3b82f6 !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    body.dark .p-inputtext {
        border-color: #374151 !important;
    }
    
    body.dark .p-inputtext:focus {
        border-color: #60a5fa !important;
    }
    
    /* Remove dropdown borders */
    .p-dropdown {
        border: 1px solid #d1d5db !important;
        outline: none !important;
    }
    
    .p-dropdown:focus {
        border-color: #3b82f6 !important;
        outline: none !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    /* Remove calendar borders */
    .p-calendar .p-inputtext {
        border: 1px solid #d1d5db !important;
    }
    
    .no-header-border .p-datatable-thead > tr > th {
        border: none !important;
    }
    
    /* Table header background matching dialog header */
    .p-datatable .p-datatable-thead > tr > th {
        background-color: #e5e7eb !important;
        color: #111827 !important;
        font-weight: 600 !important;
        border: none !important;
        border-width: 0 !important;
        border-style: none !important;
        padding: 1.25rem 1rem !important;
        font-size: 13px !important;
        letter-spacing: 0.5px !important;
        height: 56px !important;
        line-height: 1.5 !important;
    }
    
    body.dark .p-datatable .p-datatable-thead > tr > th {
        background: linear-gradient(180deg, #0f2438 0%, #0b1a2a 100%) !important;
        color: #7ab8d4 !important;
        border: none !important;
        border-width: 0 !important;
        border-style: none !important;
        box-shadow: none !important;
    }
    
    /* Table body row text size */
    .p-datatable .p-datatable-tbody > tr > td {
        font-size: 12px !important;
        font-weight: 600 !important;
        border: none !important;
        border-width: 0 !important;
        border-style: none !important;
        border-left: none !important;
        border-right: none !important;
        border-top: none !important;
        border-bottom: none !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody > tr > td {
        border: none !important;
        border-width: 0 !important;
        border-style: none !important;
    }
    
    /* Remove all table borders */
    .p-datatable table {
        border-collapse: collapse !important;
        border: none !important;
        border-width: 0 !important;
    }
    
    .p-datatable .p-datatable-tbody > tr {
        border: none !important;
        border-width: 0 !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody > tr {
        border: none !important;
        border-width: 0 !important;
    }
    
    /* Remove table wrapper borders */
    .p-datatable-wrapper {
        border: none !important;
    }
    
    .p-datatable .p-datatable-thead {
        border: none !important;
    }
    
    .p-datatable .p-datatable-tbody {
        border: none !important;
    }
    
    .p-datatable .p-datatable-tfoot {
        border: none !important;
    }
    
    /* Edit Mode Row Highlighting */
    .p-datatable .p-datatable-tbody > tr.p-row-editing {
        background-color: #dbeafe !important;
        border-left: 3px solid #3b82f6 !important;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15) !important;
        transition: all 0.3s ease !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody > tr.p-row-editing {
        background-color: #1e3a5f !important;
        border-left: 3px solid #60a5fa !important;
        box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2) !important;
    }
    
    /* Editable Cell Hover Effect */
    .p-datatable .p-datatable-tbody > tr > td.p-editable-column:hover {
        background-color: #f3f4f6 !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody > tr > td.p-editable-column:hover {
        background-color: #374151 !important;
    }
    
    /* Input Field Styling in Edit Mode */
    .p-datatable .p-datatable-tbody .p-inputtext {
        border: 2px solid #3b82f6 !important;
        border-radius: 6px !important;
        padding: 0.5rem !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    .p-datatable .p-datatable-tbody .p-inputtext:focus {
        border-color: #2563eb !important;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2) !important;
        outline: none !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody .p-inputtext {
        background-color: #1f2937 !important;
        border-color: #60a5fa !important;
        color: #f3f4f6 !important;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1) !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody .p-inputtext:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
    }
    
    /* Cell editing indicator */
    .p-datatable .p-datatable-tbody > tr > td.p-cell-editing {
        background-color: #eff6ff !important;
        position: relative !important;
    }
    
    body.dark .p-datatable .p-datatable-tbody > tr > td.p-cell-editing {
        background-color: #1e3a5f !important;
    }
    
    /* Add subtle animation for edit mode activation */
    @keyframes editModeActivate {
        0% {
            transform: scale(0.98);
            opacity: 0.8;
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .p-datatable .p-datatable-tbody > tr.p-row-editing {
        animation: editModeActivate 0.3s ease !important;
    }
    
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* QR Code Scanning Animation */
    @keyframes scanLine {
        0% {
            top: 0%;
        }
        50% {
            top: 100%;
        }
        100% {
            top: 0%;
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
    
    .qr-scan-container {
        position: relative;
        overflow: hidden;
    }
    
    .qr-scan-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(transparent, #10b981, transparent);
        box-shadow: 0 0 10px #10b981;
        animation: scanLine 2s ease-in-out infinite;
    }
    
    .qr-scan-corners {
        position: absolute;
        top: 10%;
        left: 10%;
        right: 10%;
        bottom: 10%;
        border: 2px solid #10b981;
        border-radius: 12px;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    .qr-scan-corner {
        position: absolute;
        width: 20px;
        height: 20px;
        border: 3px solid #10b981;
    }
    
    .qr-scan-corner.top-left {
        top: -2px;
        left: -2px;
        border-right: none;
        border-bottom: none;
        border-radius: 12px 0 0 0;
    }
    
    .qr-scan-corner.top-right {
        top: -2px;
        right: -2px;
        border-left: none;
        border-bottom: none;
        border-radius: 0 12px 0 0;
    }
    
    .qr-scan-corner.bottom-left {
        bottom: -2px;
        left: -2px;
        border-right: none;
        border-top: none;
        border-radius: 0 0 0 12px;
    }
    
    .qr-scan-corner.bottom-right {
        bottom: -2px;
        right: -2px;
        border-left: none;
        border-top: none;
        border-radius: 0 0 12px 0;
    }
    
    /* Responsive table wrapper for fewer columns */
    .p-datatable-wrapper {
        overflow-x: auto !important;
    }
    
    /* Center table when it's narrower than container */
    .p-datatable .p-datatable-table-container {
        overflow-x: auto;
    }
    
    /* Mobile responsive styles */
    @media (max-width: 768px) {
        .p-datatable .p-datatable-thead > tr > th {
            padding: 0.5rem !important;
            font-size: 11px !important;
        }
        
        .p-datatable .p-datatable-tbody > tr > td {
            padding: 0.5rem !important;
            font-size: 10px !important;
        }
        
        /* Make table fit mobile screen */
        .p-dialog .p-dialog-content {
            padding: 0.5rem !important;
        }
    }
    
    /* Tablet responsive styles */
    @media (max-width: 1024px) and (min-width: 769px) {
        .p-datatable .p-datatable-thead > tr > th {
            padding: 0.75rem !important;
            font-size: 12px !important;
        }
    }
`;

// Custom editor component with duplicate detection
const DuplicateCheckEditor = ({ options, allData, field }) => {
    const [localValue, setLocalValue] = useState(options.value);
    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        if (field === 'code') {
            const duplicate = allData.some(item => 
                item.code === localValue && item.id !== options.rowData.id
            );
            setIsDuplicate(duplicate);
        }
    }, [localValue, allData, field, options.rowData.id]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        options.editorCallback(newValue);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <InputText 
                type="text" 
                value={localValue}
                onChange={handleChange}
                style={{ 
                    width: '100%',
                    border: isDuplicate ? '2px solid #ef4444' : '1px solid #ced4da',
                    backgroundColor: isDuplicate ? '#fee2e2' : undefined,
                    color: isDuplicate ? '#000000' : undefined,
                    borderRadius: '6px',
                    padding: '0.5rem',
                    fontSize: '1rem'
                }}
            />
            {isDuplicate && (
                <div style={{ 
                    color: '#ef4444', 
                    fontSize: '0.75rem', 
                    marginTop: '0.25rem',
                    fontWeight: '600'
                }}>
                    Duplicate!
                </div>
            )}
        </div>
    );
};

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default function FlexibleScrollDemo() {
    
    // Device Detection
    const deviceInfo = useDeviceDetect();
    const responsiveStyles = getResponsiveStyles(deviceInfo);
    
    // PWA Install
    const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
    
    const [routes, setRoutes] = useState([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMaximized, setDialogMaximized] = useState(false);
    const [dialogData, setDialogData] = useState([]);
    const [currentRouteId, setCurrentRouteId] = useState(null);
    const [currentRouteName, setCurrentRouteName] = useState('');
    const [currentRouteWarehouse, setCurrentRouteWarehouse] = useState('');
    const [currentRouteShift, setCurrentRouteShift] = useState('');
    
    // Global frozen row data - fetched from database (PUBLIC/SHARED)
    // This will be loaded from database with a special ID or flag
    const [frozenRowData, setFrozenRowData] = useState({
        id: 'frozen-row',
        code: 'QLK',
        location: 'QL Kitchen',
        delivery: 'Available',
        images: [],
        powerMode: 'Daily',
        latitude: null,
        longitude: null,
        address: ''
    });
    
    // Frozen row data for dialog table
    const frozenRow = [frozenRowData];
    
    // Dark Mode State - Simple implementation (INDIVIDUAL - localStorage)
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('isDark');
        return saved === 'true';
    });
    
    const [editMode, setEditMode] = useState(false);
    const [modeTransitioning, setModeTransitioning] = useState(false);
    const [infoDialogVisible, setInfoDialogVisible] = useState(false);
    const [selectedRowInfo, setSelectedRowInfo] = useState(null);
    const [isRouteInfo, setIsRouteInfo] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    
    // Column Visibility State (INDIVIDUAL - localStorage)
    // Each user can customize their own column view
    const [visibleColumns, setVisibleColumns] = useState(() => {
        const saved = localStorage.getItem('columnVisibility');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error parsing column visibility:', e);
            }
        }
        return {
            no: true,
            code: true,
            location: true,
            delivery: true,
            kilometer: true,
            latitude: false,
            longitude: false,
            address: false,
            image: true
        };
    });
    const [showColumnPanel, setShowColumnPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    // Track unsaved changes per route
    const [routeUnsavedChanges, setRouteUnsavedChanges] = useState(new Map());
    
    // Helper function to set unsaved changes for specific route
    const setRouteHasUnsavedChanges = (routeId, hasChanges) => {
        setRouteUnsavedChanges(prev => {
            const newMap = new Map(prev);
            if (hasChanges) {
                newMap.set(routeId, true);
            } else {
                newMap.delete(routeId);
            }
            // Also update global flag if any route has changes
            const anyUnsaved = Array.from(newMap.values()).some(v => v === true);
            setHasUnsavedChanges(anyUnsaved);
            return newMap;
        });
    };
    const [originalData, setOriginalData] = useState([]);
    const [originalDialogData, setOriginalDialogData] = useState([]);
    
    // Custom Sort State (INDIVIDUAL - localStorage)
    // Each user can set their own custom order
    const [customSortMode, setCustomSortMode] = useState(false);
    const [sortOrders, setSortOrders] = useState({});
    const [isCustomSorted, setIsCustomSorted] = useState(() => {
        const saved = localStorage.getItem('isCustomSorted');
        return saved === 'true';
    }); // Track if data is custom sorted
    
    // Pin Row State (INDIVIDUAL - localStorage)
    // Each user can pin/unpin their own rows
    const [pinnedRows, setPinnedRows] = useState(() => {
        const saved = localStorage.getItem('pinnedRows');
        if (saved) {
            try {
                return new Set(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing pinned rows:', e);
            }
        }
        return new Set();
    });
    const [pinnedDialogRows, setPinnedDialogRows] = useState(() => {
        const saved = localStorage.getItem('pinnedDialogRows');
        if (saved) {
            try {
                return new Set(JSON.parse(saved));
            } catch (e) {
                console.error('Error parsing pinned dialog rows:', e);
            }
        }
        return new Set();
    }); // Pin state for dialog table rows
    
    // Save Order Preset State (INDIVIDUAL - localStorage)
    // Each user can save their own order presets
    const [savePresetDialogVisible, setSavePresetDialogVisible] = useState(false);
    const [presetName, setPresetName] = useState('');
    const [presetIsPublic, setPresetIsPublic] = useState(false);
    const [savedPresets, setSavedPresets] = useState([]);
    const [presetsListVisible, setPresetsListVisible] = useState(false);
    const [presetPreviewMode, setPresetPreviewMode] = useState(false);
    const [activePresetId, setActivePresetId] = useState(null);
    const [presetSpeedDialVisible, setPresetSpeedDialVisible] = useState(null); // ID of preset with visible speed dial
    
    // Delete Confirmation State
    const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteType, setDeleteType] = useState(null); // 'route' or 'location'
    
    // Image Management State
    const [imageDialogVisible, setImageDialogVisible] = useState(false);
    const [currentRowImages, setCurrentRowImages] = useState([]);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [imageUrlInput, setImageUrlInput] = useState('');
    const [editingImageIndex, setEditingImageIndex] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageLoadingStates, setImageLoadingStates] = useState({});
    
    // Power Mode Modal State
    const [powerModeDialogVisible, setPowerModeDialogVisible] = useState(false);
    const [selectedPowerMode, setSelectedPowerMode] = useState('Daily');
    const [powerModeRowId, setPowerModeRowId] = useState(null);
    
    // Info Modal Edit State
    const [infoEditMode, setInfoEditMode] = useState(false);
    const [infoEditData, setInfoEditData] = useState({
        latitude: null,
        longitude: null,
        address: ''
    });
    const [infoModalHasChanges, setInfoModalHasChanges] = useState(false);
    const [tempInfoData, setTempInfoData] = useState(null);
    
    // Password Protection State
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // General operation loading state
    const [savingInfo, setSavingInfo] = useState(false);
    
    // Change Password Dialog State
    const [changePasswordDialogVisible, setChangePasswordDialogVisible] = useState(false);
    const [changePasswordData, setChangePasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changePasswordError, setChangePasswordError] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Function Dropdown State
    const [functionDropdownVisible, setFunctionDropdownVisible] = useState(false);
    const [activeFunction, setActiveFunction] = useState(null); // 'setOrder' or 'addRow'
    
    // Column Visibility Modal State
    const [columnModalVisible, setColumnModalVisible] = useState(false);
    const [tempVisibleColumns, setTempVisibleColumns] = useState({});
    
    // Add Row Mode State
    const [addRowMode, setAddRowMode] = useState(false);
    const [newRows, setNewRows] = useState([]);
    
    // Track deleted items for batch deletion on save
    const [deletedRoutes, setDeletedRoutes] = useState([]);
    const [deletedLocations, setDeletedLocations] = useState([]);
    
    // Link Confirmation Dialog State
    const [linkConfirmVisible, setLinkConfirmVisible] = useState(false);
    const [pendingLinkData, setPendingLinkData] = useState({ url: '', type: '' });
    
    // Action Confirmation Modal State (untuk shortcuts Google Maps, Waze, Website, dll)
    const [actionConfirmVisible, setActionConfirmVisible] = useState(false);
    const [actionConfirmData, setActionConfirmData] = useState({
        icon: '',
        title: '',
        message: '',
        details: {},
        action: null,
        buttonLabel: 'Open',
        buttonColor: '#3b82f6'
    });
    
    // Track modified rows
    const [modifiedRows, setModifiedRows] = useState(new Set());
    
    // View Mode Dialog State
    const [viewDialogVisible, setViewDialogVisible] = useState(false);
    const [selectedViewRoute, setSelectedViewRoute] = useState(null);
    
    // Changelog Dialog State
    const [changelogDialogVisible, setChangelogDialogVisible] = useState(false);
    const [changelogDateRange, setChangelogDateRange] = useState(null);
    const [changelogSearchText, setChangelogSearchText] = useState('');
    const [changelogFilterAction, setChangelogFilterAction] = useState('all');
    const [changelogFilterType, setChangelogFilterType] = useState('all');
    
    // Custom Menu State
    const [customMenuVisible, setCustomMenuVisible] = useState(false);
    
    // Auto Column Width State
    const [columnWidths, setColumnWidths] = useState({
        code: 70,
        location: 190,
        delivery: 90,
        image: 90
    });
    
    // Changelog State with localStorage persistence
    const [changelog, setChangelog] = useState(() => {
        try {
            const saved = localStorage.getItem('appChangelog');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Convert date strings back to Date objects
                return parsed.map(entry => ({
                    ...entry,
                    date: new Date(entry.date)
                }));
            }
        } catch (error) {
            console.error('Failed to load changelog from localStorage:', error);
        }
        return [];
    });
    
    // Initialize changelog from localStorage on mount
    useEffect(() => {
        // Auto-cleanup old entries (remove entries older than 1 day from display)
        const cleanupOldEntries = () => {
            const now = new Date();
            const oneDayMs = 24 * 60 * 60 * 1000;
            
            setChangelog(prev => {
                const cleaned = prev.map(entry => ({
                    ...entry,
                    // Mark entries older than 1 day as archived (they stay in history)
                    isArchived: (now - new Date(entry.date)) > oneDayMs
                }));
                
                // Save to localStorage
                try {
                    localStorage.setItem('appChangelog', JSON.stringify(cleaned));
                } catch (error) {
                    console.error('Failed to save changelog to localStorage:', error);
                }
                
                return cleaned;
            });
        };
        
        // Run cleanup on component mount
        cleanupOldEntries();
        
        // Set up interval to check every minute
        const cleanupInterval = setInterval(cleanupOldEntries, 60000);
        
        return () => clearInterval(cleanupInterval);
    }, []);
    
    // Website Link Modal State
    const [websiteLinkDialogVisible, setWebsiteLinkDialogVisible] = useState(false);
    const [websiteLinkInput, setWebsiteLinkInput] = useState('');
    const [currentEditingRowId, setCurrentEditingRowId] = useState(null);
    
    // QR Code Modal State
    const [qrCodeDialogVisible, setQrCodeDialogVisible] = useState(false);
    const [qrCodeImages, setQrCodeImages] = useState([]); // Array of {imageUrl, destinationUrl, title, id}
    const [uploadingQrCode, setUploadingQrCode] = useState(false);
    const [scanningQrCode, setScanningQrCode] = useState(false);
    const [scannedUrl, setScannedUrl] = useState(''); // Store scanned URL to display
    const [qrResultDialogVisible, setQrResultDialogVisible] = useState(false); // Simple result dialog
    const [qrImageSelectionDialogVisible, setQrImageSelectionDialogVisible] = useState(false); // Multiple QR images selection
    const [editingQrIndex, setEditingQrIndex] = useState(null); // Track which QR is being edited
    
    // Marker Color Picker State
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [colorPickerRowId, setColorPickerRowId] = useState(null);
    const [colorPickerLocationName, setColorPickerLocationName] = useState('');
    
    // Update Notification State
    const [showUpdateBanner, setShowUpdateBanner] = useState(false);
    const APP_VERSION = '1.0.1'; // Increment this when pushing updates

    // QR Code Scanning Function - Defined early to avoid reference errors
    const handleScanQrCode = React.useCallback(async (qrImageUrl, destinationUrl) => {
        setScanningQrCode(true);
        setScannedUrl(''); // Reset
        
        try {
            // Simple direct scan with qr-scanner library only
            const result = await QrScanner.scanImage(qrImageUrl, {
                returnDetailedScanResult: true,
                alsoTryWithoutScanRegion: true,
            });
            
            // QR code scanned successfully
            let targetUrl = result.data;
            
            // If not a URL, search on Google
            if (!targetUrl.match(/^https?:\/\//)) {
                if (targetUrl.includes('.') && !targetUrl.includes(' ')) {
                    targetUrl = `https://${targetUrl}`;
                } else {
                    targetUrl = `https://www.google.com/search?q=${encodeURIComponent(targetUrl)}`;
                }
            }
            
            // Store the scanned URL and show result dialog
            setScannedUrl(targetUrl);
            setScanningQrCode(false);
            setQrResultDialogVisible(true);
                
        } catch (error) {
            console.error('QR scanning error:', error);
            setScanningQrCode(false);
            
            // Fallback: If have destination URL, use it
            if (destinationUrl) {
                setScannedUrl(destinationUrl);
                setQrResultDialogVisible(true);
            } else {
                alert('Could not read QR code from the image.');
            }
        }
    }, []);

    // Calculate dynamic table width based on visible columns
    const calculateTableWidth = () => {
        let totalWidth = 0;
        
        // Adjust column widths based on device
        const isMobileDevice = deviceInfo.isMobile;
        const columnWidthMap = {
            no: isMobileDevice ? 45 : 55,
            code: isMobileDevice ? (columnWidths.code ? columnWidths.code * 0.8 : 100) : (columnWidths.code || 120),
            location: isMobileDevice ? (columnWidths.location ? columnWidths.location * 0.7 : 160) : (columnWidths.location || 220),
            delivery: isMobileDevice ? (columnWidths.delivery ? columnWidths.delivery * 0.8 : 90) : (columnWidths.delivery || 110),
            kilometer: isMobileDevice ? 90 : 100,
            image: isMobileDevice ? 80 : 120
        };
        
        // Count visible columns
        let visibleCount = 0;
        Object.keys(visibleColumns).forEach(col => {
            if (visibleColumns[col] && columnWidthMap[col]) {
                totalWidth += columnWidthMap[col];
                visibleCount++;
            }
        });
        
        // Add action column width if in edit mode
        if (editMode) {
            totalWidth += isMobileDevice ? 80 : 120; // action column width
        }
        
        // Get viewport width
        const viewportWidth = window.innerWidth;
        const availableWidth = isMobileDevice ? viewportWidth * 0.9 : viewportWidth * 0.85;
        
        // If only 1-3 columns visible, fit to content but don't exceed viewport
        if (visibleCount <= 3) {
            const calculatedWidth = Math.min(totalWidth, availableWidth);
            return `${calculatedWidth}px`;
        }
        
        // For 4-5 columns, balance between content and viewport
        if (visibleCount <= 5) {
            const calculatedWidth = Math.min(totalWidth * 1.1, availableWidth);
            return `${calculatedWidth}px`;
        }
        
        // For more columns, allow scrolling but optimize width
        return totalWidth < availableWidth ? `${totalWidth}px` : '100%';
    };

    // Calculate optimal column widths based on content
    const calculateColumnWidths = (data) => {
        if (!data || data.length === 0) return;
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = '11px system-ui, -apple-system, sans-serif'; // Match table font
        
        const minWidths = {
            code: 70,      // Minimum width
            location: 140,
            delivery: 90
        };
        
        const maxWidths = {
            code: 140,     // Maximum width to prevent too wide
            location: 390,
            delivery: 140
        };
        
        const padding = 32; // Cell padding (left + right)
        
        const widths = {
            code: minWidths.code,
            location: minWidths.location,
            delivery: minWidths.delivery,
            image: 90 // Fixed for image column
        };
        
        // Find longest content in each column
        data.forEach(row => {
            ['code', 'location', 'delivery'].forEach(field => {
                const text = String(row[field] || '');
                const textWidth = context.measureText(text).width + padding;
                widths[field] = Math.max(widths[field], textWidth);
            });
        });
        
        // Also check header text width
        const headers = {
            code: 'Code',
            location: 'Location',
            delivery: 'Delivery'
        };
        
        Object.keys(headers).forEach(field => {
            const headerWidth = context.measureText(headers[field]).width + padding + 20; // Extra for sort icons
            widths[field] = Math.max(widths[field], headerWidth);
        });
        
        // Apply min/max constraints
        Object.keys(widths).forEach(field => {
            if (minWidths[field]) {
                widths[field] = Math.max(widths[field], minWidths[field]);
            }
            if (maxWidths[field]) {
                widths[field] = Math.min(widths[field], maxWidths[field]);
            }
        });
        
        setColumnWidths(widths);
    };

    // Format ID with zero padding (minimum 5 digits)
    const formatId = (id) => {
        if (!id || id === 'frozen-row') return id;
        // For temp IDs (timestamp - very large numbers), show as "NEW"
        if (id > 1000000000000) return 'NEW';
        // For regular IDs, pad with zeros to 5 digits
        return String(id).padStart(5, '0');
    };

    // Compute displayed routes with pinned rows at top
    const displayedRoutes = React.useMemo(() => {
        const pinned = routes.filter(route => pinnedRows.has(route.id));
        const unpinned = routes.filter(route => !pinnedRows.has(route.id));
        return [...pinned, ...unpinned];
    }, [routes, pinnedRows]);

    // Compute displayed dialog data with pinned rows at top
    const displayedDialogData = React.useMemo(() => {
        const pinned = dialogData.filter(row => pinnedDialogRows.has(row.id));
        const unpinned = dialogData.filter(row => !pinnedDialogRows.has(row.id));
        return [...pinned, ...unpinned];
    }, [dialogData, pinnedDialogRows]);

    // Calculate kilometer values for dialog data based on custom sort order
    const dialogDataWithKilometers = React.useMemo(() => {
        if (!dialogData || dialogData.length === 0) return dialogData;
        
        // QL Kitchen coordinates
        const qlLat = frozenRowData.latitude;
        const qlLng = frozenRowData.longitude;
        
        // Check if custom sort is active
        const hasCustomSort = Object.values(sortOrders).some(order => order !== '' && order !== undefined && order !== null);
        
        if (!hasCustomSort) {
            // Default mode: Calculate direct distance from QL Kitchen to each location
            return dialogData.map(row => {
                if (!row.latitude || !row.longitude) {
                    return { ...row, kilometer: null, segmentDistance: 0 };
                }
                
                const distance = calculateDistance(qlLat, qlLng, row.latitude, row.longitude);
                return { ...row, kilometer: distance, segmentDistance: distance };
            });
        } else {
            // Custom sort mode: Calculate cumulative distance through the route
            // Sort by custom order first
            const sorted = [...dialogData].sort((a, b) => {
                const orderA = sortOrders[a.id];
                const orderB = sortOrders[b.id];
                if (orderA === '' || orderA === undefined) return 1;
                if (orderB === '' || orderB === undefined) return -1;
                return parseInt(orderA) - parseInt(orderB);
            });
            
            let cumulativeDistance = 0;
            let previousLat = qlLat;
            let previousLng = qlLng;
            
            return sorted.map(row => {
                if (!row.latitude || !row.longitude) {
                    return { ...row, kilometer: null, segmentDistance: 0 };
                }
                
                const segmentDistance = calculateDistance(previousLat, previousLng, row.latitude, row.longitude);
                cumulativeDistance += segmentDistance;
                
                previousLat = row.latitude;
                previousLng = row.longitude;
                
                return { ...row, kilometer: cumulativeDistance, segmentDistance };
            });
        }
    }, [dialogData, sortOrders, frozenRowData]);

    // Natural sort function for routes (handles both alphabetic and numeric sorting)
    const sortRoutes = (routesData) => {
        return [...routesData].sort((a, b) => {
            const routeA = String(a.route || '').toLowerCase();
            const routeB = String(b.route || '').toLowerCase();
            
            // Natural sort that handles both letters and numbers correctly
            return routeA.localeCompare(routeB, undefined, { 
                numeric: true, 
                sensitivity: 'base' 
            });
        });
    };

    useEffect(() => {
        // Preload cache in background for faster subsequent loads
        CustomerService.preloadCache();
        
        const loadData = async () => {
            try {
                // Data is now fetched from API only (public/shared)
                // Only user preferences (pin/order/columns) remain in localStorage
                const data = await CustomerService.getRoutes();
                
                // Fetch all locations to count them for each route
                const allLocations = await CustomerService.getDetailData();
                
                // Load frozen row from database (QL Kitchen with code 'QLK')
                const frozenLocation = allLocations.find(loc => loc.code === 'QLK' || loc.location === 'QL Kitchen');
                if (frozenLocation) {
                    console.log('✅ Loaded frozen row from database:', frozenLocation);
                    setFrozenRowData({
                        id: frozenLocation.id,
                        code: frozenLocation.code || 'QLK',
                        location: frozenLocation.location || 'QL Kitchen',
                        delivery: frozenLocation.delivery || 'Available',
                        images: frozenLocation.images || [],
                        powerMode: frozenLocation.powerMode || 'Daily',
                        latitude: frozenLocation.latitude || null,
                        longitude: frozenLocation.longitude || null,
                        address: frozenLocation.address || '',
                        description: frozenLocation.description || ''
                    });
                } else {
                    console.warn('⚠️ Frozen row (QL Kitchen) not found in database');
                }
                
                // Add location count to each route
                const routesWithLocationCount = data.map(route => {
                    const locationCount = allLocations.filter(loc => loc.routeId === route.id).length;
                    return { ...route, locationCount };
                });
                
                // Sort routes by default (A-Z, 1-10)
                const sortedRoutes = sortRoutes(routesWithLocationCount);
                
                // Smart loading delay for smooth intro
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setRoutes(sortedRoutes);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
            }
        };
        
        loadData();
    }, []);
    
    // Load saved presets from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('sortPresets');
            if (saved) {
                setSavedPresets(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading presets:', error);
        }
    }, []);
    
    // Calculate column widths when dialogData changes
    useEffect(() => {
        if (dialogData && dialogData.length > 0) {
            calculateColumnWidths(dialogData);
        }
    }, [dialogData]);
    
    // Auto-show QR selection when dialog opens in view mode
    useEffect(() => {
        if (qrCodeDialogVisible && !editMode && qrCodeImages.length > 0) {
            // If multiple QR codes, show selection dialog
            if (qrCodeImages.length > 1) {
                setTimeout(() => {
                    setQrImageSelectionDialogVisible(true);
                }, 300);
            } else if (qrCodeImages.length === 1) {
                // Single QR code - auto scan
                setTimeout(() => {
                    handleScanQrCode(qrCodeImages[0].imageUrl, qrCodeImages[0].destinationUrl);
                }, 300);
            }
        }
    }, [qrCodeDialogVisible, editMode, qrCodeImages, handleScanQrCode]);
    
    // Apply dark mode to body class and PrimeReact theme
    useEffect(() => {
        // Apply body class
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        localStorage.setItem('isDark', isDark.toString());
        
        // Switch PrimeReact theme dynamically
        const themeLink = document.getElementById('app-theme');
        const theme = isDark ? 'lara-dark-cyan' : 'lara-light-cyan';
        const themePath = `https://unpkg.com/primereact/resources/themes/${theme}/theme.css`;
        
        if (themeLink) {
            themeLink.href = themePath;
        } else {
            // Create theme link if it doesn't exist
            const newThemeLink = document.createElement('link');
            newThemeLink.id = 'app-theme';
            newThemeLink.rel = 'stylesheet';
            newThemeLink.href = themePath;
            document.head.appendChild(newThemeLink);
        }
    }, [isDark]);
    
    // Check for app updates
    useEffect(() => {
        const checkForUpdates = () => {
            const storedVersion = localStorage.getItem('appVersion');
            
            if (storedVersion && storedVersion !== APP_VERSION) {
                setShowUpdateBanner(true);
            } else if (!storedVersion) {
                localStorage.setItem('appVersion', APP_VERSION);
            }
        };
        
        checkForUpdates();
        
        // Check for updates every 5 minutes
        const intervalId = setInterval(checkForUpdates, 5 * 60 * 1000);
        
        return () => clearInterval(intervalId);
    }, []);
    
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (functionDropdownVisible && !event.target.closest('.function-dropdown-container')) {
                setFunctionDropdownVisible(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [functionDropdownVisible]);

    // Keyboard shortcuts for Info Modal
    useEffect(() => {
        if (!infoDialogVisible) return;
        
        const handleKeyDown = (event) => {
            // Ignore if user is typing in input field
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                // Only handle Enter for save in edit mode
                if (event.key === 'Enter' && infoEditMode && !editMode) {
                    event.preventDefault();
                    handleSaveInfoEdit();
                }
                return;
            }
            
            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    // Check for unsaved changes before closing
                    if (infoModalHasChanges) {
                        const confirmed = window.confirm('⚠️ You have unsaved changes. Close anyway?');
                        if (!confirmed) return;
                    }
                    setInfoDialogVisible(false);
                    setInfoEditMode(false);
                    setInfoModalHasChanges(false);
                    setTempInfoData(null);
                    break;
                    
                case 'ArrowLeft':
                case 'ArrowRight':
                    // Navigate between locations if we're viewing a location (not route)
                    if (!isRouteInfo && dialogData && dialogData.length > 0) {
                        event.preventDefault();
                        const currentIndex = dialogData.findIndex(loc => loc.id === selectedRowInfo?.id);
                        if (currentIndex === -1) return;
                        
                        let newIndex;
                        if (event.key === 'ArrowLeft') {
                            newIndex = currentIndex > 0 ? currentIndex - 1 : dialogData.length - 1;
                        } else {
                            newIndex = currentIndex < dialogData.length - 1 ? currentIndex + 1 : 0;
                        }
                        
                        const nextLocation = dialogData[newIndex];
                        handleShowInfo(nextLocation, false);
                    }
                    break;
                    
                case 'Enter':
                    // Save if in edit mode
                    if (infoEditMode && !editMode) {
                        event.preventDefault();
                        handleSaveInfoEdit();
                    }
                    break;
                    
                case 'e':
                case 'E':
                    // Toggle edit mode (only for locations in edit mode)
                    if (!isRouteInfo && editMode && !infoEditMode) {
                        event.preventDefault();
                        setInfoEditMode(true);
                    }
                    break;
                
                // Shortcut buttons
                case 'g':
                case 'G':
                    // Google Maps
                    if (!isRouteInfo && selectedRowInfo?.latitude && selectedRowInfo?.longitude) {
                        event.preventDefault();
                        const url = `https://www.google.com/maps/search/?api=1&query=${selectedRowInfo.latitude},${selectedRowInfo.longitude}`;
                        window.open(url, '_blank');
                    }
                    break;
                    
                case 'w':
                case 'W':
                    // Waze
                    if (!isRouteInfo && selectedRowInfo?.latitude && selectedRowInfo?.longitude) {
                        event.preventDefault();
                        const url = `https://waze.com/ul?ll=${selectedRowInfo.latitude},${selectedRowInfo.longitude}&navigate=yes`;
                        window.open(url, '_blank');
                    }
                    break;
                    
                case 'l':
                case 'L':
                    // Website Link
                    if (!isRouteInfo) {
                        event.preventDefault();
                        if (editMode) {
                            setCurrentEditingRowId(selectedRowInfo.id);
                            setWebsiteLinkInput(selectedRowInfo.websiteLink || '');
                            setWebsiteLinkDialogVisible(true);
                        } else if (selectedRowInfo.websiteLink) {
                            handleOpenLink(selectedRowInfo.websiteLink, 'Website');
                        }
                    }
                    break;
                    
                case 'q':
                case 'Q':
                    // QR Code
                    if (!isRouteInfo) {
                        event.preventDefault();
                        setCurrentEditingRowId(selectedRowInfo.id);
                        setQrCodeImages(selectedRowInfo.qrCodeImages || []);
                        setQrCodeDialogVisible(true);
                    }
                    break;
                    
                case 'p':
                case 'P':
                    // Phone/Call
                    if (!isRouteInfo && selectedRowInfo?.phone) {
                        event.preventDefault();
                        window.location.href = `tel:${selectedRowInfo.phone}`;
                    }
                    break;
                    
                default:
                    break;
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [infoDialogVisible, infoEditMode, infoModalHasChanges, isRouteInfo, dialogData, selectedRowInfo, editMode]);

    const dialogFooterTemplate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ color: isCustomSorted ? '#1e40af' : '#065f46' }}>
                            {isCustomSorted ? '📊 Custom Sorted' : '🗄️ Original Database Order'}
                        </span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {customSortMode && (
                        <Button 
                            label="Save Preset" 
                            icon="pi pi-save" 
                            onClick={() => setSavePresetDialogVisible(true)} 
                            size="small"
                            severity="success"
                            disabled={!Object.values(sortOrders).some(order => order !== '' && order !== undefined)}
                        />
                    )}
                    {isCustomSorted && !customSortMode && (
                        <Button 
                            label="Reset Order" 
                            icon="pi pi-refresh" 
                            onClick={() => {
                                // Clear custom sort from localStorage PER ROUTE
                                localStorage.removeItem(`isCustomSorted_${currentRouteId}`);
                                localStorage.removeItem(`customSortedOrder_${currentRouteId}`);
                                // Reset to default sort
                                const sortedData = sortDialogData(dialogData);
                                setDialogData(sortedData);
                                setIsCustomSorted(false);
                            }} 
                            size="small"
                            severity="warning"
                            outlined
                        />
                    )}
                    <Button 
                        label="Close" 
                        icon="pi pi-times" 
                        onClick={() => {
                            setDialogVisible(false);
                            // Clear dialog state completely when closing
                            setTimeout(() => {
                                setDialogData([]);
                                setOriginalDialogData([]);
                                setNewRows([]);
                                setModifiedRows(new Set());
                                setCurrentRouteId(null);
                                setCurrentRouteName('');
                                setCurrentRouteWarehouse('');
                                setCurrentRouteShift('');
                            }, 300); // Delay to allow closing animation
                        }} 
                        size="small"
                        outlined
                        style={{ 
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.8rem'
                        }}
                    />
                </div>
            </div>
        );
    };

    const handleUpdateRow = (rowId, field, value) => {
        const route = routes.find(r => r.id === rowId);
        const oldValue = route ? route[field] : '';
        
        const updatedRoutes = routes.map(route => 
            route.id === rowId ? { ...route, [field]: value } : route
        );
        // Sort routes after update to maintain A-Z, 1-10 order
        setRoutes(sortRoutes(updatedRoutes));
        setHasUnsavedChanges(true);
        
        // Add to changelog
        if (oldValue !== value) {
            addChangelogEntry('edit', 'route', {
                route: route?.route || 'Unknown',
                field: field,
                oldValue: oldValue,
                newValue: value
            });
        }
    };

    const handleUpdateDialogData = (rowId, field, value) => {
        const location = dialogData.find(d => d.id === rowId);
        const oldValue = location ? location[field] : '';
        
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, [field]: value } : data
        );
        setDialogData(sortDialogData(updatedData));
        setRouteHasUnsavedChanges(currentRouteId, true);
        
        // Mark row as modified
        setModifiedRows(prev => new Set(prev).add(rowId));
        
        // Add to changelog
        if (oldValue !== value) {
            addChangelogEntry('edit', 'location', {
                code: location?.code || 'Unknown',
                location: location?.location || 'Unknown',
                field: field,
                oldValue: oldValue,
                newValue: value
            });
        }
        
        // Recalculate column widths if content field changed
        if (['code', 'location', 'delivery'].includes(field)) {
            calculateColumnWidths(updatedData);
        }
    };

    const handlePowerModeChange = (rowId, mode) => {
        const updatedData = dialogData.map(data => 
            data.id === rowId ? { ...data, powerMode: mode } : data
        );
        setDialogData(sortDialogData(updatedData));
        setRouteHasUnsavedChanges(currentRouteId, true);
        
        // Mark row as modified
        setModifiedRows(prev => new Set(prev).add(rowId));
    };
    
    // Handle Marker Color Change
    const handleMarkerColorChange = (color) => {
        if (!colorPickerRowId) return;
        
        const location = dialogData.find(d => d.id === colorPickerRowId);
        const oldColor = location?.markerColor || '#dc3545';
        
        const updatedData = dialogData.map(data => 
            data.id === colorPickerRowId ? { ...data, markerColor: color } : data
        );
        setDialogData(sortDialogData(updatedData));
        setRouteHasUnsavedChanges(currentRouteId, true);
        
        // Update selectedRowInfo if info modal is open for this row
        if (infoDialogVisible && selectedRowInfo && selectedRowInfo.id === colorPickerRowId) {
            setSelectedRowInfo(prev => ({
                ...prev,
                markerColor: color
            }));
        }
        
        // Mark row as modified
        setModifiedRows(prev => new Set(prev).add(colorPickerRowId));
        
        // Add to changelog
        if (oldColor !== color) {
            addChangelogEntry('edit', 'location', {
                code: location?.code || 'Unknown',
                location: location?.location || 'Unknown',
                field: 'markerColor',
                oldValue: oldColor,
                newValue: color
            });
        }
        
        // Show success toast
        showSuccessToast('🎨 Marker color updated!');
        
        // Show reminder toast after a short delay
        setTimeout(() => {
            toast.current.show({
                severity: 'warn',
                summary: '💾 Remember to Save',
                detail: 'Click the Save button in the menu to save your marker color changes permanently.',
                life: 5000,
                sticky: false
            });
        }, 500);
    };
    
    const openColorPicker = (rowId, locationName) => {
        setColorPickerRowId(rowId);
        setColorPickerLocationName(locationName);
        setColorPickerVisible(true);
    };

    const sortDialogData = (data) => {
        return [...data].sort((a, b) => {
            const statusA = getPowerStatus(a.powerMode || 'Daily');
            const statusB = getPowerStatus(b.powerMode || 'Daily');
            
            // Power OFF goes to bottom, Power ON stays at top
            if (statusA === 'OFF' && statusB === 'ON') return 1;
            if (statusA === 'ON' && statusB === 'OFF') return -1;
            
            // If both have same status, sort by code (ascending)
            const codeA = parseInt(a.code) || 0;
            const codeB = parseInt(b.code) || 0;
            return codeA - codeB;
        });
    };

    const getPowerStatus = (powerMode) => {
        const today = new Date().getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
        const dateNum = new Date().getDate(); // 1-31
        
        switch(powerMode) {
            case 'Daily':
                return 'ON'; // Always on
            case 'Weekday':
                // Off on Friday (5) and Saturday (6)
                return (today === 5 || today === 6) ? 'OFF' : 'ON';
            case 'Alt 1':
                // Alternating daily: ON on odd dates (1,3,5,7,9...)
                return (dateNum % 2 === 1) ? 'ON' : 'OFF';
            case 'Alt 2':
                // Alternating daily: ON on even dates (2,4,6,8,10...)
                return (dateNum % 2 === 0) ? 'ON' : 'OFF';
            default:
                return 'OFF';
        }
    };

    const getPowerColor = (powerMode) => {
        const status = getPowerStatus(powerMode);
        return status === 'ON' ? '#10b981' : '#ef4444';
    };
    
    // Add changelog entry
    const addChangelogEntry = (action, type, details) => {
        const now = new Date();
        const entry = {
            id: Date.now(),
            timestamp: new Date().toLocaleString('en-MY', { 
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            }),
            date: now, // Store actual Date object for filtering
            action, // 'add', 'edit', 'delete'
            type, // 'route', 'location'
            details,
            isArchived: false // Mark as current/not archived
        };
        
        const updatedChangelog = [entry, ...changelog].slice(0, 100); // Keep last 100 entries
        setChangelog(updatedChangelog);
        
        // Save to localStorage
        try {
            localStorage.setItem('appChangelog', JSON.stringify(updatedChangelog));
        } catch (error) {
            console.error('Failed to save changelog to localStorage:', error);
        }
    };
    
    // Filter changelog entries - separates active from archived
    const getFilteredChangelog = () => {
        let filtered = [...changelog];
        
        // Filter by date range
        if (changelogDateRange && changelogDateRange[0]) {
            const startDate = new Date(changelogDateRange[0]);
            startDate.setHours(0, 0, 0, 0);
            
            const endDate = changelogDateRange[1] ? new Date(changelogDateRange[1]) : new Date();
            endDate.setHours(23, 59, 59, 999);
            
            filtered = filtered.filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= startDate && entryDate <= endDate;
            });
        }
        
        // Filter by action
        if (changelogFilterAction !== 'all') {
            filtered = filtered.filter(entry => entry.action === changelogFilterAction);
        }
        
        // Filter by type
        if (changelogFilterType !== 'all') {
            filtered = filtered.filter(entry => entry.type === changelogFilterType);
        }
        
        // Filter by search text
        if (changelogSearchText.trim()) {
            const searchLower = changelogSearchText.toLowerCase();
            filtered = filtered.filter(entry => {
                const detailsStr = JSON.stringify(entry.details).toLowerCase();
                return detailsStr.includes(searchLower) || 
                       entry.action.toLowerCase().includes(searchLower) ||
                       entry.type.toLowerCase().includes(searchLower);
            });
        }
        
        return filtered;
    };
    
    // Get only active (non-archived) entries for the main view
    const getActiveChangelog = () => {
        return getFilteredChangelog().filter(entry => !entry.isArchived);
    };
    
    // Get latest changes for display
    const getLatestChanges = () => {
        const active = getActiveChangelog();
        return active.length > 0 ? active.slice(0, 5) : [];
    };
    
    // Export changelog to JSON
    const exportChangelog = () => {
        const filtered = getFilteredChangelog();
        const dataStr = JSON.stringify(filtered, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `changelog_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Helper function to show success toast notifications
    const showSuccessToast = (message) => {
        // Add animation styles if not already present
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        const toastEl = document.createElement('div');
        toastEl.innerHTML = `
            <div style="
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 14px 22px;
                border-radius: 10px;
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
                z-index: 10000;
                font-size: 14px;
                font-weight: 600;
                animation: toastSlideIn 0.3s ease-out;
                display: flex;
                align-items: center;
                gap: 10px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <i class="pi pi-check-circle" style="font-size: 1.3rem;"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(toastEl);
        
        // Auto remove after 3.5 seconds
        setTimeout(() => {
            const toast = toastEl.firstElementChild;
            if (toast) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in';
                setTimeout(() => {
                    if (toastEl.parentNode) {
                        document.body.removeChild(toastEl);
                    }
                }, 300);
            }
        }, 3500);
    };

    const handleShowInfo = (rowData, isRoute = false) => {
        // Get the latest data from dialogData if available
        let latestRowData = rowData;
        
        if (isRoute && rowData.id) {
            // For route info, get latest locations from dialogData if this is the current route
            if (rowData.id === currentRouteId) {
                latestRowData = {
                    ...rowData,
                    locations: dialogData.filter(loc => loc.routeId === currentRouteId)
                };
            }
        } else if (!isRoute && rowData.id) {
            const foundInDialog = dialogData.find(item => item.id === rowData.id);
            if (foundInDialog) {
                latestRowData = foundInDialog;
            }
        }
        
        // 🔍 Debug: Log data untuk ensure QR code fields tersedia
        if (!isRoute && latestRowData.qrCodeImages && latestRowData.qrCodeImages.length > 0) {
            console.log('✅ QR Code detected in location:', {
                id: latestRowData.id,
                location: latestRowData.location,
                hasQrCode: true,
                qrCount: latestRowData.qrCodeImages.length
            });
        }
        
        setSelectedRowInfo(latestRowData);
        setIsRouteInfo(isRoute);
        setInfoEditData({
            latitude: latestRowData.latitude || null,
            longitude: latestRowData.longitude || null,
            address: latestRowData.address || ''
        });
        setTempInfoData({
            description: latestRowData.description || ''
        });
        setInfoEditMode(false);
        setInfoModalHasChanges(false);
        setInfoDialogVisible(true);
    };
    
    const handleSaveInfoModal = async () => {
        if (!selectedRowInfo) return;
        
        setSavingInfo(true);
        try {
            console.log('💾 Saving info modal changes:', {
                id: selectedRowInfo.id,
                description: tempInfoData.description
            });
            
            // Simulate a brief delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Update the appropriate data
            if (isRouteInfo) {
                // Update route description
                const updatedRoutes = routes.map(route => 
                    route.id === selectedRowInfo.id ? { ...route, description: tempInfoData.description } : route
                );
                setRoutes(updatedRoutes);
                setSelectedRowInfo({ ...selectedRowInfo, description: tempInfoData.description });
            } else {
                // Update location description
                const updatedDialogData = dialogData.map(location => 
                    location.id === selectedRowInfo.id ? { ...location, description: tempInfoData.description } : location
                );
                setDialogData(updatedDialogData);
                setSelectedRowInfo({ ...selectedRowInfo, description: tempInfoData.description });
                setRouteHasUnsavedChanges(currentRouteId, true);
            }
            
            setInfoModalHasChanges(false);
            setSavingInfo(false);
            
            // Show success toast
            showSuccessToast(isRouteInfo ? '📝 Route description updated!' : '📝 Location description updated!');
            
            // Show reminder toast after a short delay
            setTimeout(() => {
                toast.current.show({
                    severity: 'warn',
                    summary: '💾 Remember to Save',
                    detail: 'Click the Save button in the menu to save your description changes permanently.',
                    life: 5000,
                    sticky: false
                });
            }, 500);
            
        } catch (error) {
            console.error('❌ Error saving info modal:', error);
            setSavingInfo(false);
            alert('❌ Error saving info. Please try again.');
        }
    };
    
    const handleSaveInfoEdit = async () => {
        if (!selectedRowInfo) return;
        
        setSavingInfo(true);
        try {
            console.log('💾 Saving location info:', {
                id: selectedRowInfo.id,
                latitude: infoEditData.latitude,
                longitude: infoEditData.longitude,
                address: infoEditData.address
            });
            
            // Simulate a brief delay for visual feedback
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // 🔄 UPDATE DIALOG DATA - Sync info modal changes to table columns
            const updatedDialogData = dialogData.map(item => {
                if (item.id === selectedRowInfo.id) {
                    return {
                        ...item,
                        latitude: infoEditData.latitude,
                        longitude: infoEditData.longitude,
                        address: infoEditData.address
                    };
                }
                return item;
            });
            
            setDialogData(updatedDialogData);
            
            // Update the location in routes
            const updatedRoutes = routes.map(route => ({
                ...route,
                locations: route.locations?.map(loc => {
                    if (loc.id === selectedRowInfo.id) {
                        return {
                            ...loc,
                            latitude: infoEditData.latitude,
                            longitude: infoEditData.longitude,
                            address: infoEditData.address
                        };
                    }
                    return loc;
                })
            }));
            
            setRoutes(updatedRoutes);
            
            // Update selectedRowInfo to reflect the changes
            setSelectedRowInfo({
                ...selectedRowInfo,
                latitude: infoEditData.latitude,
                longitude: infoEditData.longitude,
                address: infoEditData.address
            });
            
            // Mark as having unsaved changes
            setRouteHasUnsavedChanges(currentRouteId, true);
            
            setSavingInfo(false);
            setInfoEditMode(false);
            
            // Show success toast
            showSuccessToast('📍 Location info updated!');
            
            // Show reminder toast after a short delay
            setTimeout(() => {
                toast.current.show({
                    severity: 'warn',
                    summary: '💾 Remember to Save',
                    detail: 'Click the Save button in the menu to save your location changes permanently.',
                    life: 5000,
                    sticky: false
                });
            }, 500);
            
        } catch (error) {
            console.error('❌ Error saving location info:', error);
            setSavingInfo(false);
            alert('❌ Error saving location info. Please try again.');
        }
    };
    
    // Handle saving website link
    const handleSaveWebsiteLink = async () => {
        if (!currentEditingRowId) return;
        
        try {
            console.log('💾 Saving website link:', {
                id: currentEditingRowId,
                websiteLink: websiteLinkInput
            });
            
            // Update the location in dialogData
            const updatedDialogData = dialogData.map(item => {
                if (item.id === currentEditingRowId) {
                    return {
                        ...item,
                        websiteLink: websiteLinkInput
                    };
                }
                return item;
            });
            
            setDialogData(updatedDialogData);
            
            // Update the location in routes
            const updatedRoutes = routes.map(route => ({
                ...route,
                locations: route.locations?.map(loc => {
                    if (loc.id === currentEditingRowId) {
                        return {
                            ...loc,
                            websiteLink: websiteLinkInput
                        };
                    }
                    return loc;
                }) || []
            }));
            
            setRoutes(updatedRoutes);
            
            // Update selectedRowInfo if it's the same location
            if (selectedRowInfo && selectedRowInfo.id === currentEditingRowId) {
                setSelectedRowInfo({
                    ...selectedRowInfo,
                    websiteLink: websiteLinkInput
                });
            }
            
            setRouteHasUnsavedChanges(currentRouteId, true);
            setWebsiteLinkDialogVisible(false);
            setWebsiteLinkInput('');
            setCurrentEditingRowId(null);
            
            // Show success toast
            showSuccessToast('🔗 Website link updated!');
            
            // Show reminder toast after a short delay
            setTimeout(() => {
                toast.current.show({
                    severity: 'warn',
                    summary: '💾 Remember to Save',
                    detail: 'Click the Save button in the menu to save your website link permanently.',
                    life: 5000,
                    sticky: false
                });
            }, 500);
        } catch (error) {
            console.error('❌ Error saving website link:', error);
            alert('Error saving website link: ' + error.message);
        }
    };
    
    // Handle QR code image upload
    const handleQrCodeUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            event.target.value = ''; // Reset input
            return;
        }
        
        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            event.target.value = ''; // Reset input
            return;
        }
        
        setUploadingQrCode(true);
        
        try {
            // Processing QR code image
            
            // Convert file to base64 for preview and storage
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                // Add new QR code to array with empty title
                setQrCodeImages(prev => [...prev, {
                    imageUrl: base64String,
                    destinationUrl: '',
                    title: '', // Empty title for user to fill
                    id: Date.now() // unique id for each QR
                }]);
                setUploadingQrCode(false);
                event.target.value = ''; // Reset input for next upload
                showSuccessToast('📱 QR code image added! Add a title below.');
            };
            reader.onerror = () => {
                alert('Failed to read file');
                setUploadingQrCode(false);
                event.target.value = '';
            };
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('❌ Error processing QR code:', error);
            alert('Error processing QR code: ' + error.message);
            event.target.value = '';
            setUploadingQrCode(false);
        }
    };
    
    // Handle saving QR code (allow saving even if empty to delete QR code)
    const handleSaveQrCode = async () => {
        if (!currentEditingRowId) return;
        
        try {
            console.log('💾 Saving QR codes:', {
                id: currentEditingRowId,
                qrCodeImages: qrCodeImages,
                count: qrCodeImages.length,
                action: qrCodeImages.length === 0 ? 'DELETE' : 'UPDATE'
            });
            
            // Validate titles are filled (optional but good UX)
            const qrCodesWithoutTitle = qrCodeImages.filter(qr => !qr.title?.trim());
            if (qrCodesWithoutTitle.length > 0) {
                const confirmSave = window.confirm(
                    `⚠️ ${qrCodesWithoutTitle.length} QR code(s) don't have a title.\n\n` +
                    `It's recommended to add titles to identify your QR codes easily.\n\n` +
                    `Do you want to save anyway?`
                );
                if (!confirmSave) return;
            }
            
            // Update the location in dialogData
            const updatedDialogData = dialogData.map(item => {
                if (item.id === currentEditingRowId) {
                    return {
                        ...item,
                        qrCodeImages: qrCodeImages.length > 0 ? qrCodeImages : null
                    };
                }
                return item;
            });
            
            setDialogData(updatedDialogData);
            
            // Update the location in routes
            const updatedRoutes = routes.map(route => ({
                ...route,
                locations: route.locations?.map(loc => {
                    if (loc.id === currentEditingRowId) {
                        return {
                            ...loc,
                            qrCodeImages: qrCodeImages.length > 0 ? qrCodeImages : null
                        };
                    }
                    return loc;
                }) || []
            }));
            
            setRoutes(updatedRoutes);
            
            // Update selectedRowInfo if it's the same location
            if (selectedRowInfo && selectedRowInfo.id === currentEditingRowId) {
                setSelectedRowInfo({
                    ...selectedRowInfo,
                    qrCodeImages: qrCodeImages.length > 0 ? qrCodeImages : null
                });
            }
            
            setRouteHasUnsavedChanges(currentRouteId, true);
            setQrCodeDialogVisible(false);
            setQrCodeImages([]);
            setCurrentEditingRowId(null);
            
            const actionMessage = qrCodeImages.length === 0
                ? '📱 QR codes removed!'
                : `📱 ${qrCodeImages.length} QR code(s) saved!`;
            showSuccessToast(actionMessage);
            
            // Show reminder toast after a short delay
            setTimeout(() => {
                toast.current.show({
                    severity: 'warn',
                    summary: '💾 Remember to Save',
                    detail: 'Click the Save button in the menu to save your QR code changes permanently.',
                    life: 5000,
                    sticky: false
                });
            }, 500);
        } catch (error) {
            console.error('❌ Error saving QR code:', error);
            alert('Error saving QR code: ' + error.message);
        }
    };
    
    // Note: handleScanQrCode is now defined earlier using React.useCallback to avoid reference errors

    // Handle link opening with confirmation
    const handleOpenLink = (url, type) => {
        setPendingLinkData({ url, type });
        setLinkConfirmVisible(true);
    };

    const confirmOpenLink = () => {
        window.open(pendingLinkData.url, '_blank');
        setLinkConfirmVisible(false);
        setPendingLinkData({ url: '', type: '' });
    };

    const cancelOpenLink = () => {
        setLinkConfirmVisible(false);
        setPendingLinkData({ url: '', type: '' });
    };

    const handleSaveChanges = async () => {
        // Validation: Check routes have required fields
        const invalidRoutes = routes.filter(r => {
            // Check if it's a new row (tempId > 1000000000000)
            const isNewRow = r.id > 1000000000000;
            
            // For new rows OR rows with any data, validate required fields
            if (isNewRow || r.route || r.shift || r.warehouse) {
                return !r.route?.trim() || !r.shift?.trim() || !r.warehouse?.trim();
            }
            
            return false; // Skip unchanged rows
        });
        
        if (invalidRoutes.length > 0) {
            alert('⚠️ Validation Error\n\nSome routes are missing required fields:\n• Route name\n• Shift\n• Warehouse\n\nPlease fill in all required fields before saving.');
            return;
        }
        
        // Validation: Check if any locations have temp routeId
        const locationsWithTempRouteId = dialogData.filter(loc => 
            loc.routeId && loc.routeId > 2147483647
        );
        
        if (locationsWithTempRouteId.length > 0) {
            alert('⚠️ Cannot Save Locations\n\nYou have locations assigned to unsaved routes.\n\nPlease save the route first, then add locations to it.');
            return;
        }
        
        setSaving(true);
        
        try {
            // Step 1: Delete marked items first
            let deletedRoutesCount = 0;
            let deletedLocationsCount = 0;
            
            if (deletedRoutes.length > 0) {
                console.log('🗑️ Deleting routes:', deletedRoutes);
                await Promise.all(deletedRoutes.map(id => CustomerService.deleteRoute(id)));
                deletedRoutesCount = deletedRoutes.length;
            }
            
            if (deletedLocations.length > 0) {
                console.log('🗑️ Deleting locations:', deletedLocations);
                await Promise.all(deletedLocations.map(id => CustomerService.deleteLocation(id)));
                deletedLocationsCount = deletedLocations.length;
            }
            
            // Step 2: Save both routes and locations
            const results = await Promise.all([
                CustomerService.saveRoutes(routes),
                CustomerService.saveLocations(dialogData)
            ]);
            
            // Save completed successfully
            
            // Refresh routes and locations from database to get real IDs
            const freshRoutes = await CustomerService.getRoutes();
            const allLocations = await CustomerService.getDetailData();
            
            // Update routes with location counts
            const routesWithLocationCount = freshRoutes.map(route => {
                const locationCount = allLocations.filter(loc => loc.routeId === route.id).length;
                return { ...route, locationCount };
            });
            
            // Sort routes to maintain A-Z, 1-10 order
            const sortedRoutes = sortRoutes(routesWithLocationCount);
            
            setRoutes(sortedRoutes);
            setOriginalData([...sortedRoutes]);
            
            // 🔄 SMART SYNC: Update dialogData with fresh data, but handle temp ID replacement
            if (currentRouteId) {
                const freshLocationsForRoute = allLocations.filter(loc => loc.routeId === currentRouteId);
                
                // Map old IDs to new IDs (for temp IDs that got real IDs after save)
                const idMapping = new Map();
                
                // Update dialogData: Replace temp IDs with real IDs, and use fresh data
                const syncedDialogData = freshLocationsForRoute.map(freshLoc => {
                    // Try to find matching location in current dialogData by temp ID or matching fields
                    const oldLoc = dialogData.find(loc => 
                        loc.id === freshLoc.id || // Same ID
                        (loc.id > 1000000000000 && loc.location === freshLoc.location && !idMapping.has(loc.id)) // Temp ID match
                    );
                    
                    if (oldLoc && oldLoc.id > 1000000000000) {
                        idMapping.set(oldLoc.id, freshLoc.id);
                    }
                    
                    // Use fresh data from database (which includes all saved changes)
                    return freshLoc;
                });
                
                setDialogData(syncedDialogData);
                setOriginalDialogData([...syncedDialogData]);
            } else {
                // No current route open, keep original behavior
                setOriginalDialogData([...dialogData]);
            }
            
            setHasUnsavedChanges(false);
            // Clear all route-specific unsaved changes
            setRouteUnsavedChanges(new Map());
            setSaving(false);
            
            // Clear modified rows tracking
            setModifiedRows(new Set());
            setNewRows([]);
            // Clear deleted items tracking
            setDeletedRoutes([]);
            setDeletedLocations([]);
            
            // Check if using localStorage
            const isLocalStorage = results[0].message?.includes('localStorage');
            
            // Success message with deletion info
            let message = '✅ Changes saved successfully!\n\n';
            
            if (isLocalStorage) {
                message += '💾 Using localStorage (Development Mode)\n';
            } else {
                message += '🗄️ Database Updated:\n';
            }
            
            // Add deletion counts
            if (deletedRoutesCount > 0) {
                message += `🗑️ Deleted ${deletedRoutesCount} route${deletedRoutesCount > 1 ? 's' : ''}\n`;
            }
            if (deletedLocationsCount > 0) {
                message += `🗑️ Deleted ${deletedLocationsCount} location${deletedLocationsCount > 1 ? 's' : ''}\n`;
            }
            
            // Add creation/update counts
            message += `✅ Routes: ${results[0].created || 0} created, ${results[0].updated || 0} updated\n`;
            message += `✅ Locations: ${results[1].created || 0} created, ${results[1].updated || 0} updated`;
            
            if (isCustomSorted) {
                message += '\n\n📊 Custom sort order has been saved.';
            }
            
            alert(message);
            
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            setSaving(false);
            alert('❌ Error saving changes. Please try again.\n\n' + error.message + '\n\nCheck browser console for details.');
        }
    };

    const handleCancelChanges = () => {
        if (hasUnsavedChanges) {
            const confirmed = window.confirm('⚠️ You have unsaved changes. Are you sure you want to cancel?');
            if (!confirmed) return;
        }
        setRoutes([...originalData]);
        setDialogData([...originalDialogData]);
        setHasUnsavedChanges(false);
        // Clear all route-specific unsaved changes
        setRouteUnsavedChanges(new Map());
        // Clear deleted items tracking
        setDeletedRoutes([]);
        setDeletedLocations([]);
    };

    const handleToggleEditMode = () => {
        if (editMode) {
            // Exiting edit mode
            if (hasUnsavedChanges) {
                const confirmed = window.confirm('⚠️ You have unsaved changes. Do you want to save before exiting edit mode?');
                if (confirmed) {
                    handleSaveChanges();
                }
            }
            
            // Show loading spinner
            setModeTransitioning(true);
            
            // Simulate transition time and reset all edit-related states
            setTimeout(() => {
                setEditMode(false);
                setModeTransitioning(false);
                
                // Reset all edit mode related states - but keep newRows
                setActiveFunction(null);
                setAddRowMode(false);
                // setNewRows([]); // KEEP new rows visible even in view mode
                setFunctionDropdownVisible(false);
                setCustomSortMode(false);
                setSortOrders({});
                setInfoEditMode(false);
                setModifiedRows(new Set());
                // Clear deleted items tracking
                setDeletedRoutes([]);
                setDeletedLocations([]);
                
                // Cancel any new unsaved rows
                const filteredData = dialogData.filter(row => !newRows.includes(row.id));
                if (filteredData.length !== dialogData.length) {
                    setDialogData(filteredData);
                }
            }, 600);
        } else {
            // Entering edit mode - show password dialog
            setPasswordInput('');
            setPasswordError('');
            setPasswordDialogVisible(true);
        }
    };
    
    const handlePasswordSubmit = () => {
        const storedPassword = localStorage.getItem('editModePassword') || '1234';
        
        if (passwordInput === storedPassword) {
            setPasswordLoading(true);
            setPasswordError('');
            
            // Simulate loading
            setTimeout(() => {
                setPasswordLoading(false);
                setPasswordDialogVisible(false);
                setPasswordInput('');
                setShowPassword(false);
                
                // Enter edit mode and reset all edit-related states
                setOriginalData([...routes]);
                setOriginalDialogData([...dialogData]);
                setHasUnsavedChanges(false);
                setEditMode(true);
                
                // Ensure clean state when entering edit mode - but keep existing new rows
                setActiveFunction(null);
                setAddRowMode(false);
                // setNewRows([]); // KEEP existing new rows when entering edit mode
                setFunctionDropdownVisible(false);
                setCustomSortMode(false);
                setSortOrders({});
                setModifiedRows(new Set());
            }, 800);
        } else {
            setPasswordError('Incorrect password. Please try again.');
            setPasswordInput('');
            setShowPassword(false);
        }
    };
    
    const handleChangePassword = () => {
        const storedPassword = localStorage.getItem('editModePassword') || '1234';
        const { currentPassword, newPassword, confirmPassword } = changePasswordData;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setChangePasswordError('All fields are required');
            return;
        }
        
        if (currentPassword !== storedPassword) {
            setChangePasswordError('Current password is incorrect');
            return;
        }
        
        if (newPassword.length !== 4 || !/^\d+$/.test(newPassword)) {
            setChangePasswordError('New password must be exactly 4 digits');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            setChangePasswordError('New password and confirm password do not match');
            return;
        }
        
        // Save new password
        localStorage.setItem('editModePassword', newPassword);
        setChangePasswordDialogVisible(false);
        setChangePasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setChangePasswordError('');
        
        alert('✅ Password changed successfully!');
    };
    
    const handleToggleCustomSort = () => {
        if (customSortMode) {
            // Exiting custom sort mode
            setSortOrders({});
        } else {
            // Entering custom sort mode - initialize with empty values
            const initialOrders = {};
            dialogData.forEach((row) => {
                initialOrders[row.id] = '';
            });
            setSortOrders(initialOrders);
        }
        setCustomSortMode(!customSortMode);
    };
    
    const handleSortOrderChange = (rowId, value) => {
        const newValue = value === '' ? '' : parseInt(value);
        const updated = {
            ...sortOrders, 
            [rowId]: newValue
        };
        setSortOrders(updated);
    };
    
    const isOrderDuplicate = (rowId, order) => {
        if (!order) return false;
        return Object.entries(sortOrders).some(([id, ord]) => 
            parseInt(id) !== rowId && ord === order
        );
    };
    
    const applyCustomSort = () => {
        const filledOrders = Object.entries(sortOrders).filter(([_, order]) => order !== '');
        
        if (filledOrders.length === 0) {
            alert('⚠️ Please enter at least one row order number!');
            return;
        }
        
        // Check for duplicates
        const orders = filledOrders.map(([_, order]) => order);
        const uniqueOrders = new Set(orders);
        
        if (uniqueOrders.size !== orders.length) {
            alert('⚠️ Nombor tidak boleh duplikat! Sila gunakan nombor yang berbeza untuk setiap row.');
            return;
        }
        
        // Separate rows: those with order and those without
        const rowsWithOrder = [];
        const rowsWithoutOrder = [];
        
        dialogData.forEach(row => {
            const order = sortOrders[row.id];
            if (order !== '' && order !== undefined) {
                rowsWithOrder.push({ ...row, customOrder: order });
            } else {
                rowsWithoutOrder.push(row);
            }
        });
        
        // Sort rows with custom order by their order number
        rowsWithOrder.sort((a, b) => a.customOrder - b.customOrder);
        
        // Sort rows without order by code (default)
        rowsWithoutOrder.sort((a, b) => {
            const codeA = parseInt(a.code) || 0;
            const codeB = parseInt(b.code) || 0;
            return codeA - codeB;
        });
        
        // Combine: custom ordered rows first, then default sorted rows
        const sortedData = [...rowsWithOrder, ...rowsWithoutOrder];
        
        setDialogData(sortedData);
        setHasUnsavedChanges(true);
        setCustomSortMode(false);
        
        // Auto-save to active preset if in preview mode
        if (presetPreviewMode && activePresetId) {
            const updatedPresets = savedPresets.map(p => {
                if (p.id === activePresetId) {
                    return { ...p, sortOrders: { ...sortOrders } };
                }
                return p;
            });
            setSavedPresets(updatedPresets);
            localStorage.setItem('sortPresets', JSON.stringify(updatedPresets));
        }
        
        // Exit preview mode after applying
        setPresetPreviewMode(false);
        setActivePresetId(null);
        
        setSortOrders({});
        setIsCustomSorted(true);
        // Save custom sort state to localStorage PER ROUTE
        localStorage.setItem(`isCustomSorted_${currentRouteId}`, 'true');
        localStorage.setItem(`customSortedOrder_${currentRouteId}`, JSON.stringify(sortedData.map(row => row.id)));
        setActiveFunction(null);
        setFunctionDropdownVisible(false);
        
        const message = filledOrders.length === dialogData.length
            ? '✅ All rows have been sorted according to your order!'
            : `✅ ${filledOrders.length} row(s) sorted by your order, remaining ${rowsWithoutOrder.length} row(s) sorted by code!`;
        
        alert(message);
    };

    const handleSavePreset = () => {
        if (!presetName.trim()) {
            alert('⚠️ Please enter a preset name!');
            return;
        }
        
        // Check if current order has any entries
        const hasOrders = Object.values(sortOrders).some(order => order !== '' && order !== undefined);
        if (!hasOrders) {
            alert('⚠️ Please set some order values before saving!');
            return;
        }
        
        // Create preset object
        const preset = {
            id: Date.now(),
            name: presetName.trim(),
            routeId: currentRouteId,
            routeName: currentRouteName,
            sortOrders: { ...sortOrders },
            isPublic: presetIsPublic,
            createdAt: new Date().toISOString()
        };
        
        // Add to saved presets
        const updatedPresets = [...savedPresets, preset];
        setSavedPresets(updatedPresets);
        
        // Save to localStorage
        localStorage.setItem('sortPresets', JSON.stringify(updatedPresets));
        
        // Close dialog and reset
        setSavePresetDialogVisible(false);
        setPresetName('');
        setPresetIsPublic(false);
        
        alert(`✅ Preset "${preset.name}" saved successfully!`);
    };
    
    const handleApplyPreset = (preset) => {
        // Check if preset is for current route
        if (preset.routeId !== currentRouteId) {
            alert('⚠️ This preset is for a different route!');
            return;
        }
        
        // Enter preview mode first
        setSortOrders(preset.sortOrders);
        setCustomSortMode(true);
        setActiveFunction('setOrder');
        setPresetPreviewMode(true);
        setActivePresetId(preset.id);
        setPresetsListVisible(false);
        
        // Show info that user is in preview mode
        alert(`👁️ Preview Mode: "${preset.name}"\n\nClick Apply in Set Order to confirm changes.\nAny changes will auto-save to this preset.`);
    };
    
    const handlePresetPreview = (preset) => {
        // Same as apply but emphasize it's preview
        handleApplyPreset(preset);
    };
    
    const handleTogglePresetVisibility = (preset) => {
        const updatedPresets = savedPresets.map(p => {
            if (p.id === preset.id) {
                return { ...p, isPublic: !p.isPublic };
            }
            return p;
        });
        setSavedPresets(updatedPresets);
        localStorage.setItem('sortPresets', JSON.stringify(updatedPresets));
        
        alert(`✅ Preset "${preset.name}" is now ${!preset.isPublic ? 'PUBLIC' : 'PRIVATE'}!`);
    };
    
    const handleEditPreset = (preset) => {
        // Load preset data for editing
        setPresetName(preset.name);
        setPresetIsPublic(preset.isPublic || false);
        setSortOrders(preset.sortOrders);
        setCustomSortMode(true);
        setActiveFunction('setOrder');
        setPresetsListVisible(false);
        
        // Delete old preset (will save new one when user clicks save)
        const updatedPresets = savedPresets.filter(p => p.id !== preset.id);
        setSavedPresets(updatedPresets);
        localStorage.setItem('sortPresets', JSON.stringify(updatedPresets));
        
        alert(`✏️ Editing preset "${preset.name}"\n\nMake your changes and save again.`);
    };
    
    const handleDeletePreset = (presetId) => {
        if (!confirm('Are you sure you want to delete this preset?')) {
            return;
        }
        
        const updatedPresets = savedPresets.filter(p => p.id !== presetId);
        setSavedPresets(updatedPresets);
        localStorage.setItem('sortPresets', JSON.stringify(updatedPresets));
        
        // If deleting active preset, exit preview mode
        if (activePresetId === presetId) {
            setPresetPreviewMode(false);
            setActivePresetId(null);
        }
        
        alert('✅ Preset deleted successfully!');
    };

    const handleAddDialogRow = () => {
        const tempId = Date.now(); // Use numeric timestamp for new rows (must be > 1000000000000)
        const highestNo = dialogData.length > 0 ? Math.max(...dialogData.map(d => typeof d.no === 'number' ? d.no : 0)) : 0;
        
        // Debug: Check current route context
        console.log('➕ Adding new location row:', {
            currentRouteId,
            currentRouteName,
            tempId
        });
        
        const newRow = {
            id: tempId,
            no: highestNo + 1,
            code: '',
            location: '',
            delivery: 'Daily',
            images: [],
            powerMode: 'Daily',
            routeId: currentRouteId, // Use the current route ID
            isNew: true
        };
        // Add new row at the top
        const updatedData = [newRow, ...dialogData];
        setDialogData(updatedData);
        setNewRows([...newRows, tempId]);
        setRouteHasUnsavedChanges(currentRouteId, true);
        
        // Add to changelog
        addChangelogEntry('add', 'location', {
            route: currentRouteName,
            code: 'New Location',
            location: '',
            delivery: 'Daily'
        });
        
        // Added new location with temp ID
        
        // Recalculate column widths
        calculateColumnWidths(updatedData);
    };

    const handleDeleteDialogRow = (rowId) => {
        const rowToDelete = dialogData.find(data => data.id === rowId);
        setDeleteTarget({ id: rowId, data: rowToDelete });
        setDeleteType('location');
        setDeleteConfirmVisible(true);
    };
    
    const confirmDelete = async () => {
        if (deleteType === 'location') {
            const locationToDelete = deleteTarget.data;
            
            // Check if it's a new unsaved row
            const isNewRow = !locationToDelete.id || String(locationToDelete.id).startsWith('new-');
            
            // In edit mode OR if it's a new row, just mark for deletion without calling API
            if (editMode || isNewRow) {
                const updatedData = dialogData.filter(data => data.id !== deleteTarget.id);
                setDialogData(sortDialogData(updatedData));
                
                // Remove from newRows if it was a new row
                if (isNewRow) {
                    setNewRows(prev => prev.filter(id => id !== deleteTarget.id));
                } else {
                    // Add to deletedLocations for batch deletion on save
                    setDeletedLocations(prev => [...prev, locationToDelete.id]);
                    // Mark route as having unsaved changes
                    setRouteHasUnsavedChanges(currentRouteId, true);
                    setHasUnsavedChanges(true);
                }
                
                // Add to changelog
                addChangelogEntry('delete', 'location', {
                    route: currentRouteName,
                    code: locationToDelete?.code || 'Unknown',
                    location: locationToDelete?.location || 'Unknown'
                });
                
                calculateColumnWidths(updatedData);
                
                toast.current?.show({
                    severity: 'info',
                    summary: 'Location Marked for Deletion',
                    detail: isNewRow ? 'New location removed' : 'Location will be deleted when you save',
                    life: 3000
                });
                
                setDeleteConfirmVisible(false);
                setDeleteTarget(null);
                setDeleteType(null);
                return;
            }
            
            // Not in edit mode - delete immediately from database
            try {
                await customerService.deleteLocation(locationToDelete.id);
                
                const updatedData = dialogData.filter(data => data.id !== deleteTarget.id);
                setDialogData(sortDialogData(updatedData));
                
                // Add to changelog
                addChangelogEntry('delete', 'location', {
                    route: currentRouteName,
                    code: locationToDelete?.code || 'Unknown',
                    location: locationToDelete?.location || 'Unknown'
                });
                
                // Recalculate column widths after delete
                calculateColumnWidths(updatedData);
                
                toast.current?.show({
                    severity: 'success',
                    summary: 'Location Deleted',
                    detail: `${locationToDelete.location} has been deleted`,
                    life: 3000
                });
            } catch (error) {
                console.error('Error deleting location:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Delete Failed',
                    detail: error.message || 'Failed to delete location',
                    life: 5000
                });
            }
        } else if (deleteType === 'route') {
            const routeToDelete = deleteTarget.data;
            
            // Check if it's a new unsaved row
            const isNewRow = !routeToDelete.id || String(routeToDelete.id).startsWith('new-');
            
            // In edit mode OR if it's a new row, just mark for deletion without calling API
            if (editMode || isNewRow) {
                const updatedRoutes = routes.filter(route => route.id !== deleteTarget.id);
                setRoutes(sortRoutes(updatedRoutes));
                
                // Remove from newRows if it was a new row
                if (isNewRow) {
                    setNewRows(prev => prev.filter(id => id !== deleteTarget.id));
                } else {
                    // Add to deletedRoutes for batch deletion on save
                    setDeletedRoutes(prev => [...prev, routeToDelete.id]);
                    // Mark as having unsaved changes
                    setHasUnsavedChanges(true);
                }
                
                // Add to changelog
                addChangelogEntry('delete', 'route', {
                    route: routeToDelete?.route || 'Unknown',
                    shift: routeToDelete?.shift || '',
                    warehouse: routeToDelete?.warehouse || ''
                });
                
                toast.current?.show({
                    severity: 'info',
                    summary: 'Route Marked for Deletion',
                    detail: isNewRow ? 'New route removed' : 'Route will be deleted when you save',
                    life: 3000
                });
                
                setDeleteConfirmVisible(false);
                setDeleteTarget(null);
                setDeleteType(null);
                return;
            }
            
            // Not in edit mode - delete immediately from database
            try {
                await customerService.deleteRoute(routeToDelete.id);
                
                const updatedRoutes = routes.filter(route => route.id !== deleteTarget.id);
                setRoutes(sortRoutes(updatedRoutes));
                
                // Add to changelog
                addChangelogEntry('delete', 'route', {
                    route: routeToDelete?.route || 'Unknown',
                    shift: routeToDelete?.shift || '',
                    warehouse: routeToDelete?.warehouse || ''
                });
                
                toast.current?.show({
                    severity: 'success',
                    summary: 'Route Deleted',
                    detail: `${routeToDelete.route} has been deleted`,
                    life: 3000
                });
            } catch (error) {
                console.error('Error deleting route:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Delete Failed',
                    detail: error.message || 'Failed to delete route',
                    life: 5000
                });
            }
        }
        setDeleteConfirmVisible(false);
        setDeleteTarget(null);
        setDeleteType(null);
    };
    
    const cancelDelete = () => {
        setDeleteConfirmVisible(false);
        setDeleteTarget(null);
        setDeleteType(null);
    };
    
    const handleOpenImageDialog = (rowData) => {
        setSelectedRowId(rowData.id);
        setCurrentRowImages(rowData.images || []);
        setImageDialogVisible(true);
        setImageUrlInput('');
        setEditingImageIndex(null);
        // Initialize loading states for all images
        const loadingStates = {};
        (rowData.images || []).forEach((_, index) => {
            loadingStates[index] = true;
        });
        setImageLoadingStates(loadingStates);
    };
    
    const handleAddImageUrl = () => {
        if (imageUrlInput.trim()) {
            const newImages = [...currentRowImages, imageUrlInput.trim()];
            const newIndex = newImages.length - 1;
            setCurrentRowImages(newImages);
            setImageUrlInput('');
            // Set loading state for new image
            setImageLoadingStates(prev => ({ ...prev, [newIndex]: true }));
        }
    };
    
    const handleEditImage = (index) => {
        setEditingImageIndex(index);
        setImageUrlInput(currentRowImages[index]);
    };
    
    const handleUpdateImage = () => {
        if (editingImageIndex !== null && imageUrlInput.trim()) {
            const newImages = [...currentRowImages];
            newImages[editingImageIndex] = imageUrlInput.trim();
            setCurrentRowImages(newImages);
            setImageUrlInput('');
            setEditingImageIndex(null);
        }
    };
    
    const handleDeleteImage = (index) => {
        const newImages = currentRowImages.filter((_, i) => i !== index);
        setCurrentRowImages(newImages);
    };
    
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            // No file selected
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (jpg, png, gif, webp)');
            console.error('Invalid file type:', file.type);
            return;
        }
        
        // Check file size (10MB limit)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            alert('File size exceeds 10MB limit');
            return;
        }
        
        // Warn if file is larger than 4.5MB (Vercel limit)
        if (file.size > 4.5 * 1024 * 1024) {
            const proceed = confirm(
                `Warning: File size is ${(file.size / 1024 / 1024).toFixed(2)}MB.\n` +
                `Vercel has a 4.5MB request limit.\n` +
                `Upload may fail. Continue anyway?`
            );
            if (!proceed) return;
        }
        
        try {
            setUploadingImage(true);
            
            console.log('Starting upload...', {
                fileName: file.name,
                fileType: file.type,
                fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
            });
            
            // Upload to ImgBB
            const result = await uploadImageToImgBB(file, file.name);
            
            if (result.error) {
                console.error('Upload failed:', result.error);
                alert(`Failed to upload image: ${result.error}`);
                return;
            }
            
            console.log('✅ Upload successful:', result.url);
            
            // Add the new image URL to the array
            const newImages = [...currentRowImages, result.url];
            const newIndex = newImages.length - 1;
            setCurrentRowImages(newImages);
            
            // Mark as loading while thumbnail loads
            setImageLoadingStates(prev => ({ ...prev, [newIndex]: true }));
            
            // Auto-save to database
            if (selectedRowId === 'frozen-row') {
                setFrozenRowData(prev => ({
                    ...prev,
                    images: newImages
                }));
                alert('✅ Image uploaded and saved!');
            } else {
                const updatedData = dialogData.map(data => 
                    data.id === selectedRowId ? { ...data, images: newImages } : data
                );
                
                // AUTO-SAVE
                try {
                    console.log('🔄 Auto-saving image to database...');
                    await CustomerService.saveLocations(updatedData);
                    console.log('✅ Image saved to database successfully');
                    
                    const freshData = await CustomerService.getDetailData(currentRouteId);
                    const sortedFreshData = sortDialogData(freshData);
                    setDialogData(sortedFreshData);
                    setOriginalDialogData(sortedFreshData);
                    
                    const updatedRow = sortedFreshData.find(row => row.id === selectedRowId);
                    if (updatedRow && updatedRow.images) {
                        setCurrentRowImages(updatedRow.images);
                    }
                    
                    if (import.meta.env.DEV) {
                        localStorage.setItem('locations', JSON.stringify(sortedFreshData));
                        console.log('💾 Image also backed up to localStorage');
                    }
                    
                    alert('✅ Image uploaded and saved to database successfully!');
                } catch (saveError) {
                    console.error('❌ Failed to auto-save image:', saveError);
                    alert('⚠️ Image uploaded but failed to save to database.\nPlease click "Save Changes" button to save manually.');
                    setDialogData(sortDialogData(updatedData));
                    setHasUnsavedChanges(true);
                }
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert(`Error uploading image: ${error.message}\n\nPlease check:\n- Internet connection\n- File size (<32MB limit)\n- ImgBB API Key is configured`);
        } finally {
            setUploadingImage(false);
            // Clear file input
            event.target.value = '';
        }
    };
    
    const handleSaveImages = async () => {
        // Frozen row is now treated as a regular location in database
        // Update dialogData and frozen row state if editing frozen row
        if (selectedRowId === frozenRowData.id) {
            setFrozenRowData(prev => ({
                ...prev,
                images: currentRowImages
            }));
        }
        
        const updatedData = dialogData.map(data => 
            data.id === selectedRowId ? { ...data, images: currentRowImages } : data
        );
        
        // AUTO-SAVE TO DATABASE IMMEDIATELY
        try {
            console.log('🔄 Auto-saving images to database...');
            await CustomerService.saveLocations(updatedData);
            console.log('✅ Images saved to database successfully');
            
            // RELOAD DATA FROM DATABASE to ensure UI is in sync
            const freshData = await CustomerService.getDetailData(currentRouteId);
            const sortedFreshData = sortDialogData(freshData);
            setDialogData(sortedFreshData);
            setOriginalDialogData(sortedFreshData);
            
            // Also update localStorage in dev mode for backup
            if (import.meta.env.DEV) {
                localStorage.setItem('locations', JSON.stringify(sortedFreshData));
                console.log('💾 Images also backed up to localStorage');
            }
            
            setImageDialogVisible(false);
            alert('✅ Images saved to database successfully!');
        } catch (saveError) {
            console.error('❌ Failed to auto-save images:', saveError);
            setDialogData(sortDialogData(updatedData));
            setRouteHasUnsavedChanges(currentRouteId, true);
            setImageDialogVisible(false);
            
            // Show toast notification instead of alert
            toast.current.show({
                severity: 'warn',
                summary: '⚠️ Manual Save Required',
                detail: 'Images updated but need manual save. Click Save button in menu.',
                life: 6000,
                sticky: false
            });
        }
    };
    
    const handleOpenPowerModeDialog = (rowData) => {
        setPowerModeRowId(rowData.id);
        setSelectedPowerMode(rowData.powerMode || 'Daily');
        setPowerModeDialogVisible(true);
    };
    
    const handleSavePowerMode = () => {
        // Frozen row is now treated as a regular location in database
        // Update dialogData and frozen row state if editing frozen row
        if (powerModeRowId === frozenRowData.id) {
            setFrozenRowData(prev => ({
                ...prev,
                powerMode: selectedPowerMode
            }));
        }
        
        const updatedData = dialogData.map(data => 
            data.id === powerModeRowId ? { ...data, powerMode: selectedPowerMode } : data
        );
        setDialogData(sortDialogData(updatedData));
        setRouteHasUnsavedChanges(currentRouteId, true);
        setPowerModeDialogVisible(false);
        
        // Show success toast
        showSuccessToast('⚡ Power mode updated!');
        
        // Show reminder toast after a short delay
        setTimeout(() => {
            toast.current.show({
                severity: 'warn',
                summary: '💾 Remember to Save',
                detail: 'Click the Save button in the menu to save your power mode changes permanently.',
                life: 5000,
                sticky: false
            });
        }, 500);
    };

    const handleAddRow = () => {
        // Use timestamp for temporary ID (will be replaced by database auto-increment)
        // Must be > 1000000000000 to be detected as new row by API
        const tempId = Date.now(); // This will be ~13 digits (e.g., 1734953400000)
        const newRow = {
            id: tempId,
            route: '',
            shift: '',
            warehouse: '',
            locationCount: 0
        };
        const updatedRoutes = sortRoutes([...routes, newRow]);
        setRoutes(updatedRoutes);
        setHasUnsavedChanges(true);
        setNewRows([...newRows, tempId]); // Track new rows
        
        // Add to changelog
        addChangelogEntry('add', 'route', {
            route: 'New Route',
            shift: '',
            warehouse: ''
        });
        
        // Added new route with temp ID
    };

    const handleDeleteRow = (rowId) => {
        const rowToDelete = routes.find(route => route.id === rowId);
        setDeleteTarget({ id: rowId, data: rowToDelete });
        setDeleteType('route');
        setDeleteConfirmVisible(true);
    };

    const handleTogglePin = (rowId) => {
        setPinnedRows(prev => {
            const newPinned = new Set(prev);
            if (newPinned.has(rowId)) {
                newPinned.delete(rowId);
            } else {
                newPinned.add(rowId);
            }
            // Save to localStorage
            localStorage.setItem('pinnedRows', JSON.stringify(Array.from(newPinned)));
            return newPinned;
        });
    };

    const handleTogglePinDialog = (rowId) => {
        setPinnedDialogRows(prev => {
            const newPinned = new Set(prev);
            if (newPinned.has(rowId)) {
                newPinned.delete(rowId);
            } else {
                newPinned.add(rowId);
            }
            // Save to localStorage
            localStorage.setItem('pinnedDialogRows', JSON.stringify(Array.from(newPinned)));
            return newPinned;
        });
    };

    const textEditor = (options) => {
        // Use duplicate check editor for 'code' field
        if (options.field === 'code') {
            return <DuplicateCheckEditor options={options} allData={dialogData} field="code" />;
        }
        // Regular editor for other fields
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} style={{ width: '100%' }} />;
    };

    const dropdownEditor = (options, dropdownOptions) => {
        return (
            <Dropdown
                value={options.value}
                options={dropdownOptions}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="Select"
                style={{ width: '100%' }}
            />
        );
    };

    // Dropdown options
    const deliveryOptions = [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekday', value: 'Weekday' },
        { label: 'Alt 1', value: 'Alt 1' },
        { label: 'Alt 2', value: 'Alt 2' }
    ];

    const shiftOptions = [
        { label: 'AM', value: 'AM' },
        { label: 'PM', value: 'PM' }
    ];

    const onCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        
        // Check for duplicate 'route' values
        if (field === 'route' && newValue !== rowData[field]) {
            const isDuplicate = routes.some(item => 
                item.route === newValue && item.id !== rowData.id
            );
            
            if (isDuplicate) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Duplicate Route',
                    detail: `Route "${newValue}" already exists! Please use a unique route name.`,
                    life: 3000
                });
                return; // Prevent save
            }
        }
        
        if (newValue !== rowData[field]) {
            handleUpdateRow(rowData.id, field, newValue);
        }
    };

    const onDialogCellEditComplete = (e) => {
        let { rowData, newValue, field } = e;
        
        // Check for duplicate 'code' values
        if (field === 'code' && newValue !== rowData[field]) {
            const isDuplicate = dialogData.some(item => 
                item.code === newValue && item.id !== rowData.id
            );
            
            if (isDuplicate) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Duplicate Code',
                    detail: `Code "${newValue}" already exists! Please use a unique code.`,
                    life: 3000
                });
                return; // Prevent save
            }
        }
        
        // Convert latitude/longitude to number if editing those fields
        if (field === 'latitude' || field === 'longitude') {
            if (newValue === '' || newValue === null || newValue === undefined) {
                newValue = null;
            } else {
                const parsed = parseFloat(newValue);
                newValue = isNaN(parsed) ? null : parsed;
            }
        }
        
        if (newValue !== rowData[field]) {
            // If editing frozen row (QL Kitchen), update global state
            if (rowData.id === 'frozen-row') {
                setFrozenRowData(prev => ({
                    ...prev,
                    [field]: newValue
                }));
            }
            handleUpdateDialogData(rowData.id, field, newValue);
            
            // 🔄 AUTO-SYNC: If info modal is open and editing same row, sync the changes
            if (infoDialogVisible && selectedRowInfo && selectedRowInfo.id === rowData.id) {
                if (field === 'latitude' || field === 'longitude' || field === 'address') {
                    setInfoEditData(prev => ({
                        ...prev,
                        [field]: newValue
                    }));
                    setSelectedRowInfo(prev => ({
                        ...prev,
                        [field]: newValue
                    }));
                }
            }
        }
    };

    const actionBodyTemplate = (rowData) => {
        const isPinned = pinnedRows.has(rowData.id);
        
        return (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                {/* Pin Button - Always visible */}
                <Button 
                    icon={isPinned ? "pi pi-bookmark-fill" : "pi pi-bookmark"} 
                    size="small"
                    severity={isPinned ? "warning" : "secondary"}
                    tooltip={isPinned ? "Unpin from top" : "Pin to top"}
                    tooltipOptions={{ position: 'top' }}
                    text
                    onClick={() => handleTogglePin(rowData.id)} 
                />
                
                {editMode ? (
                    <>
                        <Button 
                            icon="pi pi-pencil" 
                            size="small"
                            severity="info"
                            tooltip="Edit"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => {
                                // Store previous route ID before changing
                                const previousRouteId = currentRouteId;
                                const isSameRoute = previousRouteId === rowData.id;
                                
                                // Set new route context FIRST
                                setCurrentRouteId(rowData.id);
                                setCurrentRouteName(rowData.route);
                                setCurrentRouteWarehouse(rowData.warehouse || '');
                                setCurrentRouteShift(rowData.shift || '');
                                
                                CustomerService.getDetailData(rowData.id).then((data) => {
                                    const sortedData = sortDialogData(data);
                                    
                                    // Only preserve new rows from the SAME route
                                    let existingNewRows = [];
                                    if (isSameRoute) {
                                        existingNewRows = dialogData.filter(row => newRows.includes(row.id));
                                        // Update routeId for all existing new rows to current route
                                        existingNewRows = existingNewRows.map(row => ({
                                            ...row,
                                            routeId: rowData.id
                                        }));
                                    }
                                    
                                    // If switching to different route, clear new rows state
                                    if (!isSameRoute) {
                                        setNewRows([]);
                                    }
                                    
                                    // Merge: existing new rows (if same route) + fresh data from database
                                    const mergedData = [...existingNewRows, ...sortedData];
                                    
                                    setDialogData(mergedData);
                                    setOriginalDialogData(sortedData); // Keep original as DB data only
                                    setDialogVisible(true);
                                    setIsCustomSorted(false);
                                    // Calculate column widths for new data
                                    calculateColumnWidths(mergedData);
                                });
                            }} 
                        />
                        <Button 
                            icon="pi pi-trash" 
                            size="small"
                            severity="danger"
                            tooltip="Delete"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => handleDeleteRow(rowData.id)} 
                        />
                    </>
                ) : (
                    <>
                        <Button 
                            icon="pi pi-info-circle" 
                            size="small"
                            severity="info"
                            tooltip="View Map"
                            tooltipOptions={{ position: 'top' }}
                            text
                            loading={selectedRowInfo?.id === rowData.id && infoDialogVisible}
                            style={{
                                color: '#3b82f6',
                                fontSize: '1.1rem',
                                padding: '0.5rem',
                                cursor: 'pointer',
                                opacity: 1,
                                pointerEvents: 'auto'
                            }}
                            onClick={async () => {
                                try {
                                    // Fetch locations for this route
                                    const locations = await CustomerService.getDetailData(rowData.id);
                                    // Add locations array to rowData
                                    const routeWithLocations = {
                                        ...rowData,
                                        locations: locations || []
                                    };
                                    handleShowInfo(routeWithLocations, true);
                                } catch (error) {
                                    console.error('❌ Error opening info for route:', error);
                                    alert('Error loading route information. Check console for details.');
                                }
                            }} 
                        />
                        <Button 
                            icon="pi pi-list" 
                            size="small"
                            tooltip="Show Locations"
                            tooltipOptions={{ position: 'top' }}
                            text
                            onClick={() => {
                                setCurrentRouteId(rowData.id);
                                setCurrentRouteName(rowData.route);
                                setCurrentRouteWarehouse(rowData.warehouse || '');
                                setCurrentRouteShift(rowData.shift || '');
                                
                                // Reset states for new route
                                setCustomSortMode(false);
                                setSortOrders({});
                                setNewRows([]);
                                setModifiedRows(new Set());
                                
                                CustomerService.getDetailData(rowData.id).then((data) => {
                                    let sortedData = sortDialogData(data);
                                    
                                    // Check if there's a saved custom sort order FOR THIS SPECIFIC ROUTE
                                    const routeSortKey = `customSortedOrder_${rowData.id}`;
                                    const routeCustomSortKey = `isCustomSorted_${rowData.id}`;
                                    const isCustomSortedSaved = localStorage.getItem(routeCustomSortKey) === 'true';
                                    const savedSortOrder = localStorage.getItem(routeSortKey);
                                    
                                    if (isCustomSortedSaved && savedSortOrder) {
                                        try {
                                            const orderArray = JSON.parse(savedSortOrder);
                                            // Create a map for quick lookup
                                            const orderMap = {};
                                            orderArray.forEach((id, index) => {
                                                orderMap[id] = index;
                                            });
                                            
                                            // Sort data based on saved order
                                            sortedData = [...data].sort((a, b) => {
                                                const orderA = orderMap[a.id];
                                                const orderB = orderMap[b.id];
                                                
                                                // If both have order, sort by order
                                                if (orderA !== undefined && orderB !== undefined) {
                                                    return orderA - orderB;
                                                }
                                                // If only A has order, A comes first
                                                if (orderA !== undefined) return -1;
                                                // If only B has order, B comes first
                                                if (orderB !== undefined) return 1;
                                                // If neither has order, sort by code
                                                return (parseInt(a.code) || 0) - (parseInt(b.code) || 0);
                                            });
                                        } catch (e) {
                                            console.error('Error applying saved sort order:', e);
                                        }
                                    }
                                    
                                    // Don't merge with previous route data - use fresh data only
                                    setDialogData(sortedData);
                                    setOriginalDialogData(sortedData);
                                    setDialogVisible(true);
                                    setIsCustomSorted(isCustomSortedSaved);
                                    // Calculate column widths for new data
                                    calculateColumnWidths(sortedData);
                                });
                            }} 
                        />
                    </>
                )}
            </div>
        );
    };

    const handleUpdateApp = () => {
        localStorage.setItem('appVersion', APP_VERSION);
        window.location.reload();
    };
    
    const handleDismissUpdate = () => {
        setShowUpdateBanner(false);
    };
    
    const handleClearAllData = () => {
        if (confirm('⚠️ Clear All Data?\n\nThis will delete ALL routes and locations from localStorage.\nYou will start with a fresh empty database.\n\nThis action cannot be undone!')) {
            localStorage.removeItem('routes');
            localStorage.removeItem('locations');
            localStorage.removeItem('editModePassword');
            localStorage.setItem('clearDataOnLoad', 'true');
            alert('✅ Data cleared! Reloading page...');
            window.location.reload();
        }
    };

    // Loading state with smooth animation
    if (loading) {
        return (
            <div style={{ 
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: isDark 
                    ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' 
                    : 'linear-gradient(135deg, #f5f5f5 0%, #e5e7eb 100%)',
                animation: 'fadeIn 0.5s ease-in'
            }}>
                <style>
                    {`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                        }
                        @keyframes slideUp {
                            from { transform: translateY(20px); opacity: 0; }
                            to { transform: translateY(0); opacity: 1; }
                        }
                    `}
                </style>
                <div style={{
                    animation: 'pulse 1.5s ease-in-out infinite',
                    marginBottom: '2rem'
                }}>
                    <i className="pi pi-spin pi-spinner" style={{ 
                        fontSize: '4rem', 
                        color: isDark ? '#60a5fa' : '#3b82f6'
                    }}></i>
                </div>
                <h2 style={{
                    color: isDark ? '#e5e7eb' : '#1f2937',
                    fontSize: '2rem',
                    fontWeight: '700',
                    margin: '0 0 0.5rem 0',
                    animation: 'slideUp 0.6s ease-out',
                    textShadow: isDark ? '0 2px 10px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.1)'
                }}>Route Management</h2>
                <p style={{
                    color: isDark ? '#9ca3af' : '#6b7280',
                    fontSize: '1.1rem',
                    margin: 0,
                    animation: 'slideUp 0.8s ease-out',
                    textShadow: isDark ? '0 1px 5px rgba(0,0,0,0.3)' : '0 1px 5px rgba(0,0,0,0.05)'
                }}>Loading your data...</p>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh',
            background: isDark 
                ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' 
                : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
            color: isDark ? '#e5e5e5' : '#1f2937',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'fadeIn 0.6s ease-out'
        }}>
            <style>{tableStyles}</style>
            
            {/* Persistent Unsaved Changes Banner */}
            {editMode && hasUnsavedChanges && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1100,
                    background: isDark 
                        ? 'linear-gradient(90deg, #dc2626 0%, #f59e0b 100%)'
                        : 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    animation: 'slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <i className="pi pi-exclamation-circle" style={{
                            fontSize: '1.5rem',
                            color: '#ffffff',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}></i>
                        <div>
                            <p style={{ 
                                margin: 0, 
                                fontWeight: '700', 
                                fontSize: '1rem',
                                color: '#ffffff'
                            }}>
                                ⚠️ You have unsaved changes
                            </p>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '0.875rem', 
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginTop: '0.25rem'
                            }}>
                                Click the Save button in the menu to save your work
                            </p>
                        </div>
                    </div>
                    <Button
                        label="Save Now"
                        icon={saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'}
                        onClick={() => {
                            if (!saving) {
                                handleSaveChanges();
                            }
                        }}
                        disabled={saving}
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#dc2626',
                            border: 'none',
                            fontWeight: '700',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                    />
                </div>
            )}
            
            {/* Navigation Header - Sticky */}
            <div style={{
                background: isDark ? '#0f172a' : 'linear-gradient(135deg, rgba(224, 242, 254, 0.95) 0%, rgba(186, 230, 253, 0.9) 100%)',
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: isDark ? '1px solid #334155' : '1px solid rgba(6, 182, 212, 0.3)',
                marginBottom: '2rem',
                boxShadow: isDark ? '0 1px 4px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(6, 182, 212, 0.15)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'sticky',
                top: editMode && hasUnsavedChanges ? '5rem' : '0',
                zIndex: 900,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
            }}>
                <h2 style={{ 
                    margin: 0, 
                    color: isDark ? '#f1f5f9' : '#0c4a6e',
                    fontSize: '25px',
                    fontWeight: '700',
                    textShadow: isDark ? 'none' : '0 1px 2px rgba(6, 182, 212, 0.1)'
                }}>{editMode ? 'Edit Mode' : 'Route Management'}</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Button 
                        icon="pi pi-bars"
                        onClick={(e) => {
                            e.stopPropagation();
                            setCustomMenuVisible(prev => !prev);
                        }}
                        severity="info"
                        size="small"
                        raised
                        badge={editMode && hasUnsavedChanges ? "!" : null}
                        badgeSeverity="warning"
                        aria-label="Menu"
                    />
                </div>
            </div>
            
            {/* Custom Menu Overlay - Outside header for proper blur */}
            {customMenuVisible && (
                    <>
                        <div 
                            onClick={() => setCustomMenuVisible(false)}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                zIndex: 999,
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                animation: 'fadeIn 0.2s ease-out'
                            }}
                        />
                        <div style={{
                            position: 'fixed',
                            top: editMode && hasUnsavedChanges ? 'calc(5rem + 80px)' : '80px',
                            right: '2rem',
                            backgroundColor: isDark ? '#1e293b' : 'rgba(255, 255, 255, 0.85)',
                            backdropFilter: isDark ? 'none' : 'blur(30px) saturate(200%)',
                            WebkitBackdropFilter: isDark ? 'none' : 'blur(30px) saturate(200%)',
                            borderRadius: '16px',
                            boxShadow: isDark 
                                ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                                : '0 8px 32px rgba(6, 182, 212, 0.2), 0 0 0 1px rgba(6, 182, 212, 0.1) inset',
                            minWidth: '320px',
                            zIndex: 1000,
                            overflow: 'hidden',
                            animation: 'slideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            border: `1px solid ${isDark ? '#334155' : 'rgba(6, 182, 212, 0.25)'}`,
                            background: isDark 
                                ? '#1e293b'
                                : 'linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(255, 255, 255, 0.85) 100%)'
                        }}>  
                            {/* Menu Header */}
                            <div style={{
                                padding: '1.25rem 1.5rem',
                                background: isDark 
                                    ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)'
                                    : 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)',
                                backdropFilter: isDark ? 'none' : 'blur(30px) saturate(200%)',
                                WebkitBackdropFilter: isDark ? 'none' : 'blur(30px) saturate(200%)',
                                border: isDark ? 'none' : '1px solid rgba(209, 213, 219, 0.5)',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderTop: 'none',
                                color: isDark ? '#ffffff' : '#1f2937',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <i className="pi pi-cog" style={{ fontSize: '1.5rem', color: isDark ? '#ffffff' : '#374151' }}></i>
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: isDark ? '#f1f5f9' : '#0e7490' }}>Settings</h3>
                                    <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9, color: isDark ? '#cbd5e1' : '#0c4a6e' }}>Manage your preferences</p>
                                </div>
                            </div>
                            
                            {/* Unsaved Changes Warning */}
                            {editMode && hasUnsavedChanges && (
                                <div style={{
                                    margin: '1rem',
                                    padding: '1rem',
                                    backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : '#fef3c7',
                                    border: `2px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                                    borderRadius: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <i className="pi pi-exclamation-triangle" style={{
                                        color: '#f59e0b',
                                        fontSize: '1.25rem'
                                    }}></i>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '700', color: isDark ? '#fbbf24' : '#92400e', fontSize: '0.875rem' }}>Unsaved Changes</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#fcd34d' : '#b45309', marginTop: '0.25rem' }}>Don't forget to save your work</p>
                                    </div>
                                </div>
                            )}
                            
                            {/* Menu Items */}
                            <div style={{ padding: '0.75rem' }}>
                                {/* Theme Toggle */}
                                <div
                                    onClick={() => {
                                        setIsDark(!isDark);
                                        setCustomMenuVisible(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(207, 250, 254, 0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className={isDark ? 'pi pi-sun' : 'pi pi-moon'} style={{
                                            color: isDark ? '#fbbf24' : '#0891b2',
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#0c4a6e' }}>
                                            {isDark ? 'Light Mode' : 'Dark Mode'}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#0e7490', marginTop: '0.15rem' }}>
                                            Switch theme
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Changelog */}
                                <div
                                    onClick={() => {
                                        setChangelogDialogVisible(true);
                                        setCustomMenuVisible(false);
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem',
                                        position: 'relative'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(207, 250, 254, 0.5)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className="pi pi-history" style={{
                                            color: '#0891b2',
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#0c4a6e' }}>
                                            Changelog
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#0e7490', marginTop: '0.15rem' }}>
                                            View activity history
                                        </p>
                                    </div>
                                    {changelog.length > 0 && (
                                        <span style={{
                                            backgroundColor: '#6366f1',
                                            color: '#ffffff',
                                            fontSize: '0.7rem',
                                            fontWeight: '700',
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '12px',
                                            minWidth: '24px',
                                            textAlign: 'center'
                                        }}>
                                            {changelog.length}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Edit/View Mode Toggle */}
                                <div
                                    onClick={() => {
                                        if (!modeTransitioning && !saving) {
                                            handleToggleEditMode();
                                            setCustomMenuVisible(false);
                                        }
                                    }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        cursor: (saving || modeTransitioning) ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        backgroundColor: 'transparent',
                                        marginBottom: '0.5rem',
                                        opacity: (saving || modeTransitioning) ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => !(saving || modeTransitioning) && (e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(207, 250, 254, 0.5)')}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <i className={modeTransitioning ? 'pi pi-spin pi-spinner' : (editMode ? 'pi pi-eye' : 'pi pi-pencil')} style={{
                                            color: modeTransitioning ? '#0891b2' : (editMode ? '#10b981' : '#ef4444'),
                                            fontSize: '1.1rem'
                                        }}></i>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#0c4a6e' }}>
                                            {modeTransitioning ? 'Switching...' : (editMode ? 'View Mode' : 'Edit Mode')}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#0e7490', marginTop: '0.15rem' }}>
                                            {modeTransitioning ? 'Please wait' : (editMode ? 'Switch to read-only' : 'Enable editing')}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Edit Mode Options */}
                                {editMode && (
                                    <>
                                        <div style={{
                                            height: '1px',
                                            background: isDark ? '#334155' : 'rgba(6, 182, 212, 0.2)',
                                            margin: '0.75rem 0'
                                        }} />
                                        
                                        {/* Change Password */}
                                        <div
                                            onClick={() => {
                                                setChangePasswordDialogVisible(true);
                                                setCustomMenuVisible(false);
                                            }}
                                            style={{
                                                padding: '1rem 1.25rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                backgroundColor: 'transparent',
                                                marginBottom: '0.5rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : 'rgba(207, 250, 254, 0.5)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="pi pi-lock" style={{
                                                    color: '#0891b2',
                                                    fontSize: '1.1rem'
                                                }}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: isDark ? '#f1f5f9' : '#0c4a6e' }}>
                                                    Change Password
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#0e7490', marginTop: '0.15rem' }}>
                                                    Update security
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Clear All Data */}
                                        <div
                                            onClick={() => {
                                                handleClearAllData();
                                                setCustomMenuVisible(false);
                                            }}
                                            style={{
                                                padding: '1rem 1.25rem',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem',
                                                backgroundColor: 'transparent',
                                                marginBottom: '0.5rem'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <i className="pi pi-trash" style={{
                                                    color: '#ef4444',
                                                    fontSize: '1.1rem'
                                                }}></i>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem', color: '#ef4444' }}>
                                                    Clear All Data
                                                </p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: isDark ? '#94a3b8' : '#0e7490', marginTop: '0.15rem' }}>
                                                    Delete everything
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                {/* Save/Cancel Actions */}
                                {editMode && hasUnsavedChanges && (
                                    <>
                                        <div style={{
                                            height: '1px',
                                            background: isDark ? '#334155' : 'rgba(6, 182, 212, 0.2)',
                                            margin: '0.75rem 0'
                                        }} />
                                        
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {/* Save Button */}
                                            <div
                                                onClick={() => {
                                                    handleSaveChanges();
                                                    setCustomMenuVisible(false);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    cursor: saving ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: saving ? (isDark ? '#1e3a2e' : '#d1fae5') : 'transparent',
                                                    border: 'none',
                                                    color: '#10b981',
                                                    fontWeight: '700',
                                                    fontSize: '0.95rem',
                                                    opacity: saving ? 0.7 : 1
                                                }}
                                            >
                                                <i className={saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'} style={{ color: '#10b981' }} />
                                                {saving ? 'Saving...' : 'Save'}
                                            </div>
                                            
                                            {/* Cancel Button */}
                                            <div
                                                onClick={() => {
                                                    handleCancelChanges();
                                                    setCustomMenuVisible(false);
                                                }}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    cursor: saving ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s ease',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    background: isDark ? '#1e293b' : 'rgba(224, 242, 254, 0.5)',
                                                    border: `1px solid ${isDark ? '#334155' : 'rgba(6, 182, 212, 0.3)'}`,
                                                    color: isDark ? '#f1f5f9' : '#0c4a6e',
                                                    fontWeight: '600',
                                                    fontSize: '0.95rem',
                                                    opacity: saving ? 0.5 : 1
                                                }}
                                            >
                                                <i className="pi pi-times" />
                                                Cancel
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </>
                )}

            {/* Update Notification Banner */}
            {showUpdateBanner && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: isDark ? '#1e3a8a' : 'rgba(224, 242, 254, 0.95)',
                    border: `2px solid ${isDark ? '#3b82f6' : '#06b6d4'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.5rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    maxWidth: '90%',
                    animation: 'slideDown 0.3s ease-out',
                    backdropFilter: 'blur(10px)'
                }}>
                    <i className="pi pi-info-circle" style={{ 
                        fontSize: '1.5rem', 
                        color: isDark ? '#60a5fa' : '#0891b2' 
                    }}></i>
                    <div style={{ flex: 1 }}>
                        <div style={{ 
                            fontWeight: '700', 
                            fontSize: '0.95rem',
                            color: isDark ? '#e0f2fe' : '#0c4a6e',
                            marginBottom: '0.25rem'
                        }}>
                            App Ada Update!
                        </div>
                        <div style={{ 
                            fontSize: '0.85rem',
                            color: isDark ? '#bae6fd' : '#0e7490'
                        }}>
                            Sila refresh app untuk versi terkini
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button 
                            label="Update"
                            icon="pi pi-refresh"
                            onClick={handleUpdateApp}
                            severity="info"
                            size="small"
                            raised
                            style={{
                                backgroundColor: isDark ? '#3b82f6' : '#0891b2',
                                border: 'none',
                                fontWeight: '600'
                            }}
                        />
                        <Button 
                            icon="pi pi-times"
                            onClick={handleDismissUpdate}
                            severity="secondary"
                            size="small"
                            text
                            style={{
                                color: isDark ? '#94a3b8' : '#0e7490'
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="card">
                {editMode && (
                    <div style={{ marginBottom: '1rem' }}>
                        <Button 
                            label="Add New Row" 
                            icon="pi pi-plus" 
                            onClick={handleAddRow}
                            severity="success"
                            size="small"
                            raised
                        />
                    </div>
                )}
                <DataTable 
                    value={displayedRoutes} 
                    scrollable 
                    scrollHeight={deviceInfo.tableScrollHeight} 
                    tableStyle={{ minWidth: calculateTableWidth() }}
                    editMode={editMode ? "cell" : null}
                    className="no-header-border"
                    resizableColumns
                    columnResizeMode="expand"
                    rowClassName={(rowData) => pinnedRows.has(rowData.id) ? 'pinned-row' : ''}
                >
                    <Column 
                        field="route" 
                        header="Route" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                        style={{ width: '140px', minWidth: '140px' }}
                    />
                    <Column 
                        field="shift" 
                        header="Shift" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? (options) => dropdownEditor(options, shiftOptions) : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                        style={{ width: '120px', minWidth: '120px' }}
                    />
                    <Column 
                        field="warehouse" 
                        header="Warehouse" 
                        align="center" 
                        alignHeader="center"
                        headerStyle={{ textAlign: 'center' }}
                        editor={editMode ? textEditor : null}
                        onCellEditComplete={editMode ? onCellEditComplete : null}
                        style={{ width: '140px', minWidth: '140px' }}
                    />
                    <Column 
                        header="Location" 
                        align="center" 
                        alignHeader="center"
                        body={(rowData) => {
                            const count = rowData.locationCount || 0;
                            const isOverLimit = count > 15;
                            return (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <i className="pi pi-map-marker" style={{ 
                                        color: isOverLimit ? '#ef4444' : '#10b981',
                                        fontSize: '0.875rem'
                                    }}></i>
                                    <span style={{
                                        fontWeight: '600',
                                        color: isOverLimit ? '#ef4444' : '#10b981'
                                    }}>
                                        {count}
                                    </span>
                                </div>
                            );
                        }}
                        headerStyle={{ color: isDark ? '#ffffff' : '#000000', textAlign: 'center', fontWeight: 'bold' }}
                        style={{ width: '120px', minWidth: '120px' }}
                    />
                    <Column 
                        header="Action" 
                        align="center" 
                        alignHeader="center" 
                        body={actionBodyTemplate}
                        headerStyle={{ color: '#ef4444', textAlign: 'center' }}
                        style={{ width: editMode ? '260px' : '140px', minWidth: editMode ? '260px' : '140px' }}
                    />
                </DataTable>

                <Dialog 
                    header={
                        (() => {
                            const routeUpper = currentRouteName.toUpperCase();
                            let flagSrc = null;
                            if (routeUpper.startsWith('KL')) {
                                flagSrc = '/flag/960px-Flag_of_the_Federal_Territories_of_Malaysia.svg.png';
                            } else if (routeUpper.startsWith('SL')) {
                                flagSrc = '/flag/960px-Flag_of_Selangor.svg.png';
                            }
                            
                            return (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    gap: '0.75rem',
                                    width: '100%',
                                    flexWrap: deviceInfo.isMobile ? 'wrap' : 'nowrap'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {flagSrc && (
                                            <img 
                                                src={flagSrc} 
                                                alt="flag" 
                                                style={{ 
                                                    width: deviceInfo.isMobile ? '36px' : '48px', 
                                                    height: deviceInfo.isMobile ? '24px' : '32px', 
                                                    objectFit: 'cover',
                                                    borderRadius: '3px',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                                }} 
                                            />
                                        )}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                            <span style={{ fontSize: deviceInfo.isMobile ? '0.9rem' : '1rem' }}>Route {currentRouteName}</span>
                                            {(currentRouteWarehouse || currentRouteShift) && (
                                                <span style={{ 
                                                    fontSize: '0.7rem',
                                                    color: isDark ? '#94a3b8' : '#64748b',
                                                    fontWeight: '500'
                                                }}>
                                                    {currentRouteWarehouse} - {currentRouteShift}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Search and Function Button */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {/* Search Field */}
                                        <span style={{ 
                                            position: 'relative',
                                            display: 'inline-block',
                                            width: deviceInfo.isMobile ? '150px' : '200px'
                                        }}>
                                            <InputText
                                                value={globalFilterValue}
                                                onChange={(e) => setGlobalFilterValue(e.target.value)}
                                                placeholder="Search routes..."
                                                style={{ 
                                                    width: '100%',
                                                    backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                                                    color: isDark ? '#f1f5f9' : '#0f172a',
                                                    border: `2px solid ${globalFilterValue ? (isDark ? '#3b82f6' : '#2563eb') : (isDark ? '#334155' : '#cbd5e1')}`,
                                                    paddingLeft: '0.75rem',
                                                    paddingRight: globalFilterValue ? '2.5rem' : '0.75rem',
                                                    paddingTop: '0.5rem',
                                                    paddingBottom: '0.5rem',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    borderRadius: '10px',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    boxShadow: globalFilterValue 
                                                        ? (isDark ? '0 0 0 3px rgba(59, 130, 246, 0.2), 0 4px 12px rgba(0, 0, 0, 0.3)' : '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)')
                                                        : (isDark ? '0 2px 4px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.04)'),
                                                    transform: globalFilterValue ? 'translateY(-1px)' : 'translateY(0)'
                                                }}
                                                onFocus={(e) => {
                                                    e.target.style.borderColor = isDark ? '#3b82f6' : '#2563eb';
                                                }}
                                                onBlur={(e) => {
                                                    if (!globalFilterValue) {
                                                        e.target.style.borderColor = isDark ? '#334155' : '#cbd5e1';
                                                    }
                                                }}
                                            />
                                            {globalFilterValue && (
                                                <i 
                                                    className="pi pi-times" 
                                                    onClick={() => setGlobalFilterValue('')}
                                                    style={{ 
                                                        position: 'absolute',
                                                        right: '0.75rem',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        fontSize: '0.75rem',
                                                        color: isDark ? '#94a3b8' : '#64748b',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s ease',
                                                        padding: '0.25rem',
                                                        borderRadius: '50%',
                                                        zIndex: 2,
                                                        opacity: 0.6,
                                                        animation: 'fadeIn 0.2s ease'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.opacity = '1';
                                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(148, 163, 184, 0.15)' : 'rgba(100, 116, 139, 0.1)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.opacity = '0.6';
                                                        e.currentTarget.style.backgroundColor = 'transparent';
                                                    }}
                                                />
                                            )}
                                        </span>
                                        
                                        {/* Function Button with Dropdown */}
                                        <div className="function-dropdown-container" style={{ position: 'relative' }}>
                                            <Button 
                                                label={deviceInfo.isMobile ? '' : (
                                                    activeFunction === 'setOrder' ? 'Set Order' :
                                                    activeFunction === 'addRow' ? 'Add New Row' :
                                                    'Function'
                                                )}
                                                icon="pi pi-bars"
                                                severity={activeFunction ? 'success' : 'info'}
                                                size="small"
                                                onClick={() => setFunctionDropdownVisible(!functionDropdownVisible)}
                                                style={{ 
                                                    minWidth: deviceInfo.isMobile ? '28px' : 'auto',
                                                    padding: deviceInfo.isMobile ? '0.3rem 0.4rem' : '0.4rem 0.6rem',
                                                    fontSize: '0.8rem'
                                                }}
                                            />
                                            
                                            {/* Function Dropdown Menu */}
                                            {functionDropdownVisible && (
                                                <>
                                                    <div 
                                                        style={{
                                                            position: 'fixed',
                                                            top: 0,
                                                            left: 0,
                                                            right: 0,
                                                            bottom: 0,
                                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                            backdropFilter: 'blur(4px)',
                                                            zIndex: 999
                                                        }}
                                                        onClick={() => setFunctionDropdownVisible(false)}
                                                    />
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '100%',
                                                        right: 0,
                                                        marginTop: '0.5rem',
                                                        backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                                                        border: `1px solid ${isDark ? '#404040' : '#d1d5db'}`,
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        minWidth: '200px',
                                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                        zIndex: 1000
                                                    }}>
                                                        {/* Main Menu - Show when no active function */}
                                                        {activeFunction !== 'setOrder' && activeFunction !== 'addRow' && (
                                                            <>
                                                                <Button 
                                                                    label="Set Order" 
                                                                    icon="pi pi-sort-numeric-up"
                                                                    severity="info"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        setActiveFunction('setOrder');
                                                                        setCustomSortMode(true);
                                                                        const initialOrders = {};
                                                                        dialogData.forEach((row) => {
                                                                            initialOrders[row.id] = '';
                                                                        });
                                                                        setSortOrders(initialOrders);
                                                                    }}
                                                                />
                                                                {editMode && (
                                                                    <Button 
                                                                        label="Add New Row" 
                                                                        icon="pi pi-plus"
                                                                        severity="success"
                                                                        size="small"
                                                                        text
                                                                        style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                                                                        onClick={() => {
                                                                            setActiveFunction('addRow');
                                                                            setAddRowMode(true);
                                                                        }}
                                                                    />
                                                                )}
                                                                <Button 
                                                                    label="View Saved Presets" 
                                                                    icon="pi pi-bookmark"
                                                                    severity="help"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        setPresetsListVisible(true);
                                                                        setFunctionDropdownVisible(false);
                                                                    }}
                                                                />
                                                                <Button 
                                                                    label="Columns" 
                                                                    icon="pi pi-th-large"
                                                                    severity="secondary"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        setTempVisibleColumns({...visibleColumns});
                                                                        setColumnModalVisible(true);
                                                                        setFunctionDropdownVisible(false);
                                                                    }}
                                                                />
                                                                <Button 
                                                                    label={dialogMaximized ? 'Exit Full View' : 'Full View'}
                                                                    icon={dialogMaximized ? 'pi pi-window-minimize' : 'pi pi-window-maximize'}
                                                                    severity={dialogMaximized ? 'warning' : 'secondary'}
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', justifyContent: 'flex-start', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        setDialogMaximized(!dialogMaximized);
                                                                        setFunctionDropdownVisible(false);
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                        
                                                        {/* Set Order Actions */}
                                                        {activeFunction === 'setOrder' && (
                                                            <>
                                                                <div style={{ 
                                                                    fontWeight: 'bold', 
                                                                    fontSize: '0.875rem', 
                                                                    marginBottom: '0.5rem',
                                                                    color: isDark ? '#e5e5e5' : '#000000'
                                                                }}>
                                                                    Set Order Mode
                                                                </div>
                                                                <Button 
                                                                    label="Apply" 
                                                                    icon="pi pi-check"
                                                                    severity="success"
                                                                    size="small"
                                                                    text
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        marginBottom: '0.25rem',
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: Object.values(sortOrders).some(o => o !== '') ? '#10b981' : '#6b7280'
                                                                    }}
                                                                    onClick={applyCustomSort}
                                                                    disabled={!Object.values(sortOrders).some(o => o !== '')}
                                                                />
                                                                <Button 
                                                                    label="Cancel" 
                                                                    icon="pi pi-times"
                                                                    severity="danger"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        setActiveFunction(null);
                                                                        setCustomSortMode(false);
                                                                        setSortOrders({});
                                                                        setFunctionDropdownVisible(false);
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                        
                                                        {/* Add Row Actions - Only in Edit Mode */}
                                                        {activeFunction === 'addRow' && editMode && (
                                                            <>
                                                                <div style={{ 
                                                                    fontWeight: 'bold', 
                                                                    fontSize: '0.875rem', 
                                                                    marginBottom: '0.5rem',
                                                                    color: isDark ? '#e5e5e5' : '#000000'
                                                                }}>
                                                                    Add New Row Mode
                                                                </div>
                                                                <Button 
                                                                    label="Add Row" 
                                                                    icon="pi pi-plus"
                                                                    severity="success"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', marginBottom: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={handleAddDialogRow}
                                                                />
                                                                <Button 
                                                                    label="Save Changes" 
                                                                    icon={saving ? "pi pi-spin pi-spinner" : "pi pi-save"}
                                                                    severity={hasUnsavedChanges ? "success" : "secondary"}
                                                                    size="small"
                                                                    text
                                                                    style={{ 
                                                                        width: '100%', 
                                                                        marginBottom: '0.25rem',
                                                                        backgroundColor: 'transparent',
                                                                        border: 'none',
                                                                        color: hasUnsavedChanges ? '#10b981' : '#6b7280'
                                                                    }}
                                                                    onClick={() => {
                                                                        handleSaveChanges();
                                                                        setActiveFunction(null);
                                                                        setAddRowMode(false);
                                                                        setNewRows([]);
                                                                        setFunctionDropdownVisible(false);
                                                                    }}
                                                                    disabled={!hasUnsavedChanges || saving}
                                                                />
                                                                <Button 
                                                                    label="Cancel" 
                                                                    icon="pi pi-times"
                                                                    severity="danger"
                                                                    size="small"
                                                                    text
                                                                    style={{ width: '100%', backgroundColor: 'transparent', border: 'none' }}
                                                                    onClick={() => {
                                                                        const filteredData = dialogData.filter(row => !newRows.includes(row.id));
                                                                        setDialogData(filteredData);
                                                                        setActiveFunction(null);
                                                                        setAddRowMode(false);
                                                                        setNewRows([]);
                                                                        setFunctionDropdownVisible(false);
                                                                        if (newRows.length > 0) {
                                                                            setHasUnsavedChanges(false);
                                                                        }
                                                                    }}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    }
                    visible={dialogVisible} 
                    style={{ width: dialogMaximized ? '100vw' : deviceInfo.dialogWidth }} 
                    modal
                    closable={false}
                    closeOnEscape
                    dismissableMask 
                    contentStyle={{ height: dialogMaximized ? 'calc(100vh - 120px)' : (deviceInfo.isMobile ? '400px' : '500px') }} 
                    onHide={() => {
                        setDialogVisible(false);
                        // Clear dialog state completely when closing
                        setTimeout(() => {
                            setDialogData([]);
                            setOriginalDialogData([]);
                            setNewRows([]);
                            setModifiedRows(new Set());
                            setCurrentRouteId(null);
                            setCurrentRouteName('');
                        }, 300); // Delay to allow closing animation
                    }} 
                    footer={dialogFooterTemplate}
                    headerStyle={{ color: isDark ? '#fff' : '#000' }}
                    headerClassName={isDark ? '' : 'light-mode-dialog-header'}
                    transitionOptions={{ timeout: 300 }}
                >
                    
                    {/* Unsaved Changes Indicator - Per Route, Above table */}
                    {routeUnsavedChanges.has(currentRouteId) && routeUnsavedChanges.get(currentRouteId) && editMode && (
                        <div style={{
                            backgroundColor: isDark ? '#854d0e' : '#fef3c7',
                            border: `2px solid ${isDark ? '#f59e0b' : '#f59e0b'}`,
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: isDark ? '#fbbf24' : '#92400e',
                            fontWeight: 'bold',
                            fontSize: '0.875rem'
                        }}>
                            <i className="pi pi-exclamation-triangle"></i>
                            <span>You have unsaved changes in this route</span>
                        </div>
                    )}
                    
                    {/* Info message for Set Order */}
                    {customSortMode && (
                        <div style={{
                            backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            color: isDark ? '#93c5fd' : '#1e40af',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <i className="pi pi-info-circle"></i>
                            <span>Enter numbers for rows you want to reorder. Remaining rows will be sorted by code.</span>
                        </div>
                    )}
                        
                    {/* Custom Sort Table - Separate from DataTable */}
                    {customSortMode ? (
                        <div style={{ 
                            border: isDark ? 'none' : '1px solid #ddd', 
                            borderRadius: '8px', 
                            overflow: 'auto',
                            maxHeight: '600px',
                            backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
                        }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ 
                                    position: 'sticky', 
                                    top: 0, 
                                    backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                                    zIndex: 10
                                }}>
                                    <tr>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Order</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>No</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Code</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Location</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', border: 'none', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>Delivery</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedDialogData.map((rowData) => {
                                        const order = sortOrders[rowData.id];
                                        const isDuplicate = isOrderDuplicate(rowData.id, order);
                                        return (
                                            <tr key={rowData.id} style={{ border: 'none' }}>
                                                <td style={{ padding: '1rem', textAlign: 'center', border: 'none' }}>
                                                    <input
                                                        type="text"
                                                        value={order === '' || order === undefined ? '' : order}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            if (val === '' || /^[0-9]+$/.test(val)) {
                                                                handleSortOrderChange(rowData.id, val);
                                                            }
                                                        }}
                                                        placeholder="#"
                                                        autoComplete="off"
                                                        style={{ 
                                                            width: '55px', 
                                                            textAlign: 'center',
                                                            border: isDuplicate ? '2px solid #ef4444' : '1px solid #ced4da',
                                                            backgroundColor: isDuplicate ? '#fee2e2' : '#ffffff',
                                                            color: isDark ? '#000000' : '#000000',
                                                            padding: '0.5rem',
                                                            borderRadius: '6px',
                                                            fontSize: '1rem'
                                                        }}
                                                    />
                                                    {isDuplicate && (
                                                        <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '600' }}>
                                                            Duplicate!
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.no}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.code}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.location}</td>
                                                <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '11px', fontWeight: '600', border: 'none' }}>{rowData.delivery}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                    <DataTable 
                        value={displayedDialogData}
                        frozenValue={frozenRow}
                        scrollable 
                        scrollHeight="flex" 
                        tableStyle={{ minWidth: calculateTableWidth() }}
                        editMode={editMode ? "cell" : null}
                        globalFilter={globalFilterValue}
                        resizableColumns
                        columnResizeMode="expand"
                        className="no-header-border"
                        rowClassName={(rowData) => {
                            let classes = '';
                            
                            // Frozen row styling
                            if (rowData.id === 'frozen-row') {
                                return 'frozen-row-highlight';
                            }
                            
                            // Highlight new rows with light yellow background
                            if (newRows.includes(rowData.id)) {
                                classes += isDark ? 'new-row-dark' : 'new-row-light';
                            }
                            // Highlight modified rows with light yellow background
                            else if (modifiedRows.has(rowData.id)) {
                                classes += isDark ? 'modified-row-dark' : 'modified-row-light';
                            }
                            
                            // Add pinned class for pinned rows
                            if (pinnedDialogRows.has(rowData.id)) {
                                classes += (classes ? ' ' : '') + 'pinned-row';
                            }
                            
                            // Add disabled class for power off status
                            const status = getPowerStatus(rowData.powerMode || 'Daily');
                            if (status === 'OFF') {
                                classes += (classes ? ' ' : '') + 'row-disabled';
                            }
                            
                            return classes;
                        }}
                    >
                        {customSortMode && (
                            <Column 
                                header="Order" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    const order = sortOrders[rowData.id];
                                    const isDuplicate = isOrderDuplicate(rowData.id, order);
                                    // Rendering input for row
                                    return (
                                        <div 
                                            style={{ padding: '0.5rem' }}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onMouseUp={(e) => e.stopPropagation()}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                key={`sort-${rowData.id}`}
                                                type="text"
                                                value={order === '' || order === undefined || order === null ? '' : String(order)}
                                                onChange={(e) => {
                                                    // Input onChange triggered
                                                    const val = e.target.value;
                                                    // Only allow numbers
                                                    if (val === '' || /^[0-9]+$/.test(val)) {
                                                        handleSortOrderChange(rowData.id, val);
                                                    }
                                                }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onMouseUp={(e) => e.stopPropagation()}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.target.focus();
                                                }}
                                                onFocus={(e) => {
                                                    // Input focused
                                                    e.stopPropagation();
                                                }}
                                                onKeyDown={(e) => e.stopPropagation()}
                                                placeholder="#"
                                                autoComplete="off"
                                                style={{ 
                                                    width: '70px', 
                                                    textAlign: 'center',
                                                    border: isDuplicate ? '2px solid #ef4444' : '1px solid #ced4da',
                                                    backgroundColor: isDuplicate ? '#fee2e2' : '#ffffff',
                                                    color: isDark ? '#000000' : '#000000',
                                                    padding: '0.5rem',
                                                    borderRadius: '6px',
                                                    fontSize: '1rem',
                                                    cursor: 'text',
                                                    pointerEvents: 'auto',
                                                    zIndex: 1000
                                                }}
                                            />
                                        </div>
                                    );
                                }}
                                style={{ width: '60px' }}
                            />
                        )}
                        {visibleColumns.no && (
                            <Column 
                                header="No" 
                                align="center" 
                                alignHeader="center"
                                body={(data, options) => {
                                    // Show infinity symbol for frozen row
                                    if (data.id === 'frozen-row') {
                                        return <span style={{ fontSize: '1.1rem', fontWeight: '700', color: isDark ? '#60a5fa' : '#3b82f6' }}>∞</span>;
                                    }
                                    return options.rowIndex + 1;
                                }}
                                style={{ width: '55px' }}
                            />
                        )}
                        {visibleColumns.code && (
                            <Column 
                                field="code" 
                                header="Code" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    if (rowData.id === 'frozen-row') return rowData.code;
                                    const isDuplicate = dialogData.some(item => 
                                        item.code === rowData.code && item.id !== rowData.id && rowData.code
                                    );
                                    return (
                                        <div>
                                            <div>{rowData.code}</div>
                                            {isDuplicate && (
                                                <div style={{ 
                                                    color: '#ef4444', 
                                                    fontSize: '0.6rem', 
                                                    marginTop: '0.1rem',
                                                    fontWeight: '600',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    Duplicate!
                                                </div>
                                            )}
                                        </div>
                                    );
                                }}
                                editor={(options) => {
                                    return editMode ? textEditor(options) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.code}px`, minWidth: '70px' }}
                            />
                        )}
                        {visibleColumns.location && (
                            <Column 
                                field="location" 
                                header="Location" 
                                align="center" 
                                alignHeader="center"
                                editor={(options) => {
                                    return editMode ? textEditor(options) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.location}px`, minWidth: '140px' }}
                            />
                        )}
                        {visibleColumns.delivery && (
                            <Column 
                                field="delivery" 
                                header="Delivery" 
                                align="center" 
                                alignHeader="center"
                                editor={(options) => {
                                    return editMode ? dropdownEditor(options, deliveryOptions) : null;
                                }}
                                onCellEditComplete={editMode ? onDialogCellEditComplete : null}
                                style={{ width: `${columnWidths.delivery}px`, minWidth: '90px' }}
                            />
                        )}
                        {visibleColumns.kilometer && (
                            <Column 
                                header="Kilometer" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    // For frozen row (QL Kitchen), show 0.0 Km with tooltip
                                    if (rowData.id === 'frozen-row') {
                                        return (
                                            <div 
                                                style={{ fontSize: '11px', fontWeight: '600', cursor: 'help' }}
                                                title="Starting Point"
                                            >
                                                0.0 Km
                                            </div>
                                        );
                                    }
                                    
                                    // Find the row with kilometer data
                                    const rowWithKm = dialogDataWithKilometers.find(r => r.id === rowData.id);
                                    
                                    if (!rowWithKm || rowWithKm.kilometer === null || rowWithKm.kilometer === undefined) {
                                        return <div style={{ fontSize: '11px', color: '#999' }}>-</div>;
                                    }
                                    
                                    // Format kilometer value
                                    const kmValue = rowWithKm.kilometer.toFixed(1);
                                    const segmentDistance = rowWithKm.segmentDistance || 0;
                                    
                                    // Check if custom sort is active
                                    const hasCustomSort = Object.values(sortOrders).some(order => order !== '' && order !== undefined && order !== null);
                                    
                                    // Tooltip text
                                    const tooltipText = hasCustomSort 
                                        ? `+${segmentDistance.toFixed(1)} km from previous location`
                                        : `${segmentDistance.toFixed(1)} km from QL Kitchen`;
                                    
                                    return (
                                        <div 
                                            style={{ fontSize: '11px', fontWeight: '600', cursor: 'help' }}
                                            title={tooltipText}
                                        >
                                            {kmValue} Km
                                        </div>
                                    );
                                }}
                                style={{ width: '100px', minWidth: '100px' }}
                            />
                        )}
                        {editMode && visibleColumns.latitude && (
                            <Column 
                                field="latitude" 
                                header="Latitude" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    const value = rowData.latitude;
                                    return (
                                        <div style={{ fontSize: '11px' }}>
                                            {value !== null && value !== undefined ? value.toFixed(6) : '-'}
                                        </div>
                                    );
                                }}
                                editor={(options) => {
                                    return <InputText 
                                        type="text" 
                                        value={options.value !== null && options.value !== undefined ? String(options.value) : ''} 
                                        onChange={(e) => options.editorCallback(e.target.value)} 
                                        placeholder="e.g., 3.139003"
                                        style={{ width: '100%' }} 
                                    />;
                                }}
                                onCellEditComplete={onDialogCellEditComplete}
                                style={{ width: '110px', minWidth: '110px' }}
                            />
                        )}
                        {editMode && visibleColumns.longitude && (
                            <Column 
                                field="longitude" 
                                header="Longitude" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    const value = rowData.longitude;
                                    return (
                                        <div style={{ fontSize: '11px' }}>
                                            {value !== null && value !== undefined ? value.toFixed(6) : '-'}
                                        </div>
                                    );
                                }}
                                editor={(options) => {
                                    return <InputText 
                                        type="text" 
                                        value={options.value !== null && options.value !== undefined ? String(options.value) : ''} 
                                        onChange={(e) => options.editorCallback(e.target.value)} 
                                        placeholder="e.g., 101.686855"
                                        style={{ width: '100%' }} 
                                    />;
                                }}
                                onCellEditComplete={onDialogCellEditComplete}
                                style={{ width: '120px', minWidth: '120px' }}
                            />
                        )}
                        {editMode && visibleColumns.address && (
                            <Column 
                                field="address" 
                                header="Address" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    const value = rowData.address;
                                    return (
                                        <div style={{ 
                                            fontSize: '11px',
                                            maxWidth: '150px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {value || '-'}
                                        </div>
                                    );
                                }}
                                editor={(options) => {
                                    return <InputText 
                                        type="text" 
                                        value={options.value || ''} 
                                        onChange={(e) => options.editorCallback(e.target.value)} 
                                        placeholder="e.g., Wisma CIMB, KL"
                                        style={{ width: '100%' }} 
                                    />;
                                }}
                                onCellEditComplete={onDialogCellEditComplete}
                                style={{ width: '150px', minWidth: '150px' }}
                            />
                        )}
                        {visibleColumns.image && (
                            <Column 
                                columnKey="image"
                                header="Image" 
                                align="center" 
                                alignHeader="center"
                                body={(rowData) => {
                                    console.log('Image column render for row:', rowData.id, {
                                        hasImages: !!rowData.images,
                                        imageCount: rowData.images?.length || 0,
                                        images: rowData.images
                                    });
                                    
                                    if (!rowData.images || rowData.images.length === 0) {
                                        return (
                                            <div style={{
                                                width: '60px',
                                                height: '45px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                                borderRadius: '8px',
                                                border: `2px dashed ${isDark ? '#404040' : '#d1d5db'}`,
                                                position: 'relative',
                                                margin: '0 auto'
                                            }}>
                                                <i className="pi pi-image" style={{ 
                                                    fontSize: '1.5rem', 
                                                    color: '#9ca3af'
                                                }}></i>
                                            </div>
                                        );
                                    }
                                    
                                    // Use the new ImageLightbox component
                                    return (
                                        <ImageLightbox 
                                            images={rowData.images} 
                                            rowId={rowData.id}
                                        />
                                    );
                                }}
                                style={{ width: '100px' }}
                            />
                        )}
                        <Column 
                            columnKey="action"
                            header="Action" 
                            align="center" 
                            alignHeader="center"
                            headerStyle={{ color: '#ef4444' }}
                            body={(rowData) => {
                                const isPinnedDialog = pinnedDialogRows.has(rowData.id);
                                return (
                                <div style={{ 
                                    display: 'flex', 
                                    gap: '0.5rem', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    flexWrap: 'nowrap',
                                    minWidth: editMode ? '220px' : '80px'
                                }}>
                                    {/* Info Button - Opens full info modal */}
                                    <Button 
                                        icon="pi pi-info-circle" 
                                        size="small"
                                        severity="info"
                                        tooltip="View Location Info"
                                        tooltipOptions={{ position: 'top' }}
                                        text
                                        onClick={() => {
                                            // Transform rowData to match expected format
                                            const transformedData = {
                                                ...rowData,
                                                // Ensure all required fields exist
                                                code: rowData.code || '',
                                                location: rowData.location || '',
                                                latitude: rowData.latitude,
                                                longitude: rowData.longitude,
                                                address: rowData.address || '',
                                                kilometer: rowData.kilometer,
                                                delivery: rowData.delivery || '',
                                                description: rowData.description || '',
                                                images: rowData.images || [],
                                                websiteLink: rowData.websiteLink || '',
                                                qrCodeImages: rowData.qrCodeImages || []
                                            };
                                            handleShowInfo(transformedData, false);
                                        }}
                                        style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
                                    />

                                    {/* Power Mode - Icon Button in Edit Mode, Icon in View Mode */}
                                    {editMode ? (
                                        <Button 
                                            icon="pi pi-power-off" 
                                            size="small"
                                            severity={getPowerStatus(rowData.powerMode || 'Daily') === 'ON' ? 'success' : 'danger'}
                                            tooltip={`${rowData.powerMode || 'Daily'} - ${getPowerStatus(rowData.powerMode || 'Daily')}`}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleOpenPowerModeDialog(rowData)}
                                            style={{ 
                                                color: getPowerColor(rowData.powerMode || 'Daily'),
                                                backgroundColor: isDark ? '#1a1a1a' : undefined
                                            }}
                                        />
                                    ) : (
                                        <Button 
                                            icon="pi pi-power-off" 
                                            size="small"
                                            tooltip={`${rowData.powerMode || 'Daily'} - ${getPowerStatus(rowData.powerMode || 'Daily')}`}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            style={{ 
                                                color: getPowerColor(rowData.powerMode || 'Daily'),
                                                backgroundColor: isDark ? '#1a1a1a' : undefined
                                            }}
                                        />
                                    )}

                                    {/* Image Management Button - Only in Edit Mode */}
                                    {editMode && (
                                        <Button 
                                            icon={rowData.images && rowData.images.length > 0 ? "pi pi-images" : "pi pi-image"}
                                            size="small"
                                            severity={rowData.images && rowData.images.length > 0 ? "success" : "secondary"}
                                            tooltip={rowData.images && rowData.images.length > 0 ? "Manage Images" : "Add Images"}
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleOpenImageDialog(rowData)}
                                            style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
                                        />
                                    )}

                                    {/* Delete Button - Only in Edit Mode */}
                                    {editMode && (
                                        <Button 
                                            icon="pi pi-trash" 
                                            size="small"
                                            severity="danger"
                                            tooltip="Delete"
                                            tooltipOptions={{ position: 'top' }}
                                            text
                                            onClick={() => handleDeleteDialogRow(rowData.id)}
                                            style={{ backgroundColor: isDark ? '#1a1a1a' : undefined }}
                                        />
                                    )}
                                </div>
                                );
                            }}
                            style={{ width: editMode ? '220px' : '80px', minWidth: editMode ? '220px' : '80px' }}
                        />
                    </DataTable>
                    )}
                </Dialog>

                {/* Info Dialog */}
                <Dialog 
                    header={
                        <div style={{ 
                            textAlign: 'center', 
                            fontSize: deviceInfo.isMobile ? '11px' : '12px',
                            padding: '8px 0',
                            lineHeight: '1.6'
                        }}>
                            {selectedRowInfo && (
                                <>
                                    {isRouteInfo 
                                        ? (
                                            <>
                                                <div style={{ fontWeight: '700', fontSize: '13px' }}>
                                                    Route {selectedRowInfo.route}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '11px', 
                                                    color: isDark ? '#9ca3af' : '#6b7280',
                                                    marginTop: '4px',
                                                    fontWeight: '600'
                                                }}>
                                                    {selectedRowInfo.warehouse || 'N/A'}
                                                </div>
                                            </>
                                        )
                                        : (
                                            <>
                                                <div>{selectedRowInfo.code} - {selectedRowInfo.location}</div>
                                                {routeUnsavedChanges.get(currentRouteId) && (
                                                    <div style={{
                                                        marginTop: '6px',
                                                        padding: '4px 10px',
                                                        backgroundColor: isDark ? 'rgba(251, 191, 36, 0.15)' : '#fef3c7',
                                                        border: `1px solid ${isDark ? '#f59e0b' : '#fbbf24'}`,
                                                        borderRadius: '6px',
                                                        fontSize: '10px',
                                                        fontWeight: '600',
                                                        color: isDark ? '#fbbf24' : '#92400e',
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}>
                                                        <i className="pi pi-exclamation-triangle" style={{ fontSize: '10px' }}></i>
                                                        Unsaved Changes
                                                    </div>
                                                )}
                                            </>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    }
                    visible={infoDialogVisible} 
                    style={{ 
                        width: deviceInfo.isMobile ? '95vw' : isRouteInfo ? '650px' : '450px',
                        zIndex: 9999
                    }} 
                    contentStyle={{ height: deviceInfo.isMobile ? '400px' : '500px' }}
                    modal
                    dismissableMask
                    closeOnEscape
                    closable={false}
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        if (infoModalHasChanges) {
                            const confirmed = window.confirm('⚠️ You have unsaved changes in this modal. Close anyway?');
                            if (!confirmed) return;
                        }
                        setInfoDialogVisible(false);
                        setInfoEditMode(false);
                        setInfoModalHasChanges(false);
                        setTempInfoData(null);
                    }}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {!isRouteInfo && !infoEditMode && editMode && (
                                    <Button 
                                        label="Edit Location" 
                                        icon="pi pi-map-marker" 
                                        onClick={() => setInfoEditMode(true)}
                                        size="small"
                                        severity="info"
                                    />
                                )}
                                {!isRouteInfo && infoEditMode && (
                                    <>
                                        <Button 
                                            label={savingInfo ? "Saving..." : "Save Location"} 
                                            icon={savingInfo ? "pi pi-spin pi-spinner" : "pi pi-check"} 
                                            onClick={handleSaveInfoEdit}
                                            size="small"
                                            severity="success"
                                            disabled={savingInfo}
                                        />
                                        <Button 
                                            label="Cancel" 
                                            icon="pi pi-times" 
                                            onClick={() => {
                                                setInfoEditMode(false);
                                                setInfoEditData({
                                                    latitude: selectedRowInfo.latitude || null,
                                                    longitude: selectedRowInfo.longitude || null,
                                                    address: selectedRowInfo.address || ''
                                                });
                                            }}
                                            size="small"
                                            severity="secondary"
                                        />
                                    </>
                                )}
                            </div>
                            <Button 
                                label="Close" 
                                icon="pi pi-times" 
                                onClick={() => {
                                    if (infoModalHasChanges) {
                                        const confirmed = window.confirm('⚠️ You have unsaved changes. Close anyway?');
                                        if (!confirmed) return;
                                    }
                                    setInfoDialogVisible(false);
                                    setInfoEditMode(false);
                                    setInfoModalHasChanges(false);
                                    setTempInfoData(null);
                                }}
                                size="small"
                                severity="secondary"
                                outlined
                            />
                        </div>
                    }
                >
                    {selectedRowInfo && (
                        <div style={{ padding: '0' }}>
                            {/* Mini Map */}
                            <MiniMap 
                                latitude={!isRouteInfo ? (infoEditMode ? infoEditData.latitude : selectedRowInfo.latitude) : null}
                                longitude={!isRouteInfo ? (infoEditMode ? infoEditData.longitude : selectedRowInfo.longitude) : null}
                                address={!isRouteInfo ? (infoEditMode ? infoEditData.address : selectedRowInfo.address) : null}
                                locations={isRouteInfo ? selectedRowInfo.locations : []}
                                style={{ marginBottom: '20px' }}
                            />
                            
                            {/* Coordinates & Address Edit Section - Show in edit mode for locations */}
                            {!isRouteInfo && infoEditMode && (
                                <div style={{ 
                                    backgroundColor: isDark ? '#1e293b' : '#e7f3ff',
                                    borderRadius: '8px',
                                    border: isDark ? '1px solid #3b82f6' : '1px solid #93c5fd',
                                    margin: '15px',
                                    marginTop: '0',
                                    padding: '15px'
                                }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <strong style={{ 
                                            fontSize: '12px', 
                                            color: isDark ? '#93c5fd' : '#1e40af',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}>
                                            <i className="pi pi-map-marker" style={{ fontSize: '14px' }}></i>
                                            Location Coordinates & Address
                                        </strong>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ fontSize: '10px', color: isDark ? '#d1d5db' : '#374151', display: 'block', marginBottom: '4px' }}>
                                                Latitude:
                                            </label>
                                            <InputText
                                                type="text"
                                                value={infoEditData.latitude !== null && infoEditData.latitude !== undefined ? String(infoEditData.latitude) : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setInfoEditData({
                                                        ...infoEditData,
                                                        latitude: val === '' ? null : parseFloat(val) || null
                                                    });
                                                }}
                                                placeholder="e.g., 3.139003"
                                                style={{ width: '100%', fontSize: '11px' }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '10px', color: isDark ? '#d1d5db' : '#374151', display: 'block', marginBottom: '4px' }}>
                                                Longitude:
                                            </label>
                                            <InputText
                                                type="text"
                                                value={infoEditData.longitude !== null && infoEditData.longitude !== undefined ? String(infoEditData.longitude) : ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setInfoEditData({
                                                        ...infoEditData,
                                                        longitude: val === '' ? null : parseFloat(val) || null
                                                    });
                                                }}
                                                placeholder="e.g., 101.686855"
                                                style={{ width: '100%', fontSize: '11px' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '12px' }}>
                                        <label style={{ fontSize: '10px', color: isDark ? '#d1d5db' : '#374151', display: 'block', marginBottom: '4px' }}>
                                            Address:
                                        </label>
                                        <InputText
                                            type="text"
                                            value={infoEditData.address || ''}
                                            onChange={(e) => {
                                                setInfoEditData({
                                                    ...infoEditData,
                                                    address: e.target.value
                                                });
                                            }}
                                            placeholder="Enter full address..."
                                            style={{ width: '100%', fontSize: '11px' }}
                                        />
                                    </div>
                                    <div style={{ 
                                        marginTop: '12px',
                                        padding: '8px',
                                        backgroundColor: isDark ? '#0f172a' : '#dbeafe',
                                        borderRadius: '6px',
                                        fontSize: '9px',
                                        color: isDark ? '#93c5fd' : '#1e40af'
                                    }}>
                                        <i className="pi pi-info-circle" style={{ marginRight: '4px' }}></i>
                                        Changes will sync with table columns. Use decimal format for coordinates.
                                    </div>
                                </div>
                            )}
                            
                            {/* General Information Section - For Route Only */}
                            {isRouteInfo && selectedRowInfo.locations && (
                                <div style={{ 
                                    backgroundColor: isDark ? 'transparent' : '#ffffff',
                                    borderRadius: '8px',
                                    border: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                    margin: '15px',
                                    marginTop: '0'
                                }}>
                                    <div style={{
                                        padding: '10px 15px',
                                        borderBottom: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                        backgroundColor: isDark ? 'transparent' : '#f8f9fa'
                                    }}>
                                        <strong style={{ fontSize: '12px', color: isDark ? '#e5e5e5' : '#495057', display: 'block', textAlign: 'center' }}>
                                            General Information
                                        </strong>
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <div style={{ 
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                            fontSize: '12px'
                                        }}>
                                            <div style={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                                                borderRadius: '6px',
                                                border: isDark ? '1px solid #334155' : '1px solid #e9ecef'
                                            }}>
                                                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>Daily:</span>
                                                <span style={{ color: isDark ? '#e5e5e5' : '#111827', fontWeight: '700' }}>
                                                    {selectedRowInfo.locations.filter(loc => loc.powerMode === 'Daily').length}
                                                </span>
                                            </div>
                                            <div style={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                                                borderRadius: '6px',
                                                border: isDark ? '1px solid #334155' : '1px solid #e9ecef'
                                            }}>
                                                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>Alt 1:</span>
                                                <span style={{ color: isDark ? '#e5e5e5' : '#111827', fontWeight: '700' }}>
                                                    {selectedRowInfo.locations.filter(loc => loc.powerMode === 'Alt 1').length}
                                                </span>
                                            </div>
                                            <div style={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                                                borderRadius: '6px',
                                                border: isDark ? '1px solid #334155' : '1px solid #e9ecef'
                                            }}>
                                                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>Alt 2:</span>
                                                <span style={{ color: isDark ? '#e5e5e5' : '#111827', fontWeight: '700' }}>
                                                    {selectedRowInfo.locations.filter(loc => loc.powerMode === 'Alt 2').length}
                                                </span>
                                            </div>
                                            <div style={{ 
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                                                borderRadius: '6px',
                                                border: isDark ? '1px solid #334155' : '1px solid #e9ecef'
                                            }}>
                                                <span style={{ color: isDark ? '#9ca3af' : '#6b7280', fontWeight: '500' }}>Weekday:</span>
                                                <span style={{ color: isDark ? '#e5e5e5' : '#111827', fontWeight: '700' }}>
                                                    {selectedRowInfo.locations.filter(loc => loc.powerMode === 'Weekday').length}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Description Section */}
                            {!isRouteInfo && (
                                <div style={{ 
                                    backgroundColor: isDark ? 'transparent' : '#ffffff',
                                    borderRadius: '8px',
                                    border: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                    margin: '15px',
                                    marginTop: '0'
                                }}>
                                    <div style={{
                                        padding: '10px 15px',
                                        borderBottom: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                        backgroundColor: isDark ? 'transparent' : '#f8f9fa',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ fontSize: '12px', color: isDark ? '#e5e5e5' : '#495057' }}>
                                            📝 Description
                                        </strong>
                                        {editMode && (
                                            <i className="pi pi-pencil" style={{ fontSize: '10px', color: '#3b82f6' }}></i>
                                        )}
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <EditableDescriptionList
                                            value={tempInfoData?.description || selectedRowInfo.description || ''}
                                            onSave={(newValue) => {
                                                setTempInfoData({ ...tempInfoData, description: newValue });
                                                setInfoModalHasChanges(true);
                                            }}
                                            isEditable={editMode}
                                        />
                                        {editMode && infoModalHasChanges && (
                                            <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                                <Button 
                                                    label={savingInfo ? "Saving..." : "Save Description"} 
                                                    icon={savingInfo ? "pi pi-spin pi-spinner" : "pi pi-check"} 
                                                    onClick={handleSaveInfoModal}
                                                    size="small"
                                                    severity="success"
                                                    disabled={savingInfo}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {/* Marker Color Section */}
                            {!isRouteInfo && editMode && (
                                <div style={{ 
                                    backgroundColor: isDark ? 'transparent' : '#ffffff',
                                    borderRadius: '8px',
                                    border: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                    margin: '15px',
                                    marginTop: '0'
                                }}>
                                    <div style={{
                                        padding: '10px 15px',
                                        borderBottom: isDark ? '1px solid #374151' : '1px solid #e9ecef',
                                        backgroundColor: isDark ? 'transparent' : '#f8f9fa',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <strong style={{ fontSize: '12px', color: isDark ? '#e5e5e5' : '#495057' }}>
                                            🎨 Marker Color
                                        </strong>
                                    </div>
                                    <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px',
                                            backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
                                            borderRadius: '8px',
                                            border: isDark ? '1px solid #334155' : '1px solid #e9ecef',
                                            width: '100%',
                                            justifyContent: 'center'
                                        }}>
                                            <span style={{ fontSize: '11px', color: isDark ? '#d1d5db' : '#6b7280' }}>Current Color:</span>
                                            <svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                                                <path 
                                                    d="M12 0C5.4 0 0 5.4 0 12c0 8.1 12 20 12 20s12-11.9 12-20c0-6.6-5.4-12-12-12z" 
                                                    fill={selectedRowInfo.markerColor || '#dc3545'}
                                                    stroke="#fff"
                                                    strokeWidth="1.5"
                                                />
                                                <circle cx="12" cy="12" r="4" fill="#fff"/>
                                            </svg>
                                            <span style={{ 
                                                fontSize: '11px', 
                                                color: isDark ? '#e5e5e5' : '#111827',
                                                fontWeight: '600',
                                                fontFamily: 'monospace'
                                            }}>
                                                {selectedRowInfo.markerColor || '#dc3545'}
                                            </span>
                                        </div>
                                        <Button 
                                            label="Change Marker Color" 
                                            icon="pi pi-palette" 
                                            size="small"
                                            severity="info"
                                            onClick={() => {
                                                openColorPicker(selectedRowInfo.id, selectedRowInfo.location);
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                        <div style={{ 
                                            fontSize: '9px',
                                            color: isDark ? '#93c5fd' : '#1e40af',
                                            textAlign: 'center',
                                            padding: '6px',
                                            backgroundColor: isDark ? '#0f172a' : '#dbeafe',
                                            borderRadius: '4px',
                                            width: '100%'
                                        }}>
                                            <i className="pi pi-info-circle" style={{ marginRight: '4px' }}></i>
                                            Marker color will be visible on the map
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Shortcut Section */}
                            {!isRouteInfo && (
                                <div style={{ padding: '15px', paddingTop: '0' }}>
                                    <strong style={{ fontSize: '12px', color: isDark ? '#e5e5e5' : '#495057', display: 'block', marginBottom: '12px', textAlign: 'center' }}>
                                        Shortcuts
                                    </strong>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '8px',
                                        justifyContent: 'center',
                                        flexWrap: 'wrap'
                                    }}>
                                        {/* Google Maps Button - [G] */}
                                        {selectedRowInfo?.latitude && selectedRowInfo?.longitude && (
                                            <button
                                                title="Google Maps [G]"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'transparent',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    boxSizing: 'border-box',
                                                    outline: 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                onClick={() => {
                                                    setActionConfirmData({
                                                        icon: '/Gmaps.png',
                                                        title: 'Open Google Maps',
                                                        message: 'Navigate to this location?',
                                                        details: {
                                                            Location: selectedRowInfo.location || 'Unknown',
                                                            Coordinates: `${selectedRowInfo.latitude}, ${selectedRowInfo.longitude}`
                                                        },
                                                        action: () => {
                                                            const url = `https://www.google.com/maps/search/?api=1&query=${selectedRowInfo.latitude},${selectedRowInfo.longitude}`;
                                                            window.open(url, '_blank');
                                                        },
                                                        buttonLabel: 'Open Maps',
                                                        buttonColor: '#10b981'
                                                    });
                                                    setActionConfirmVisible(true);
                                                }}
                                            >
                                                <img 
                                                    src="/Gmaps.png" 
                                                    alt="Google Maps" 
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }} 
                                                />
                                            </button>
                                        )}
                                        
                                        {/* Waze Button - [W] */}
                                        {selectedRowInfo?.latitude && selectedRowInfo?.longitude && (
                                            <button
                                                title="Waze [W]"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    padding: '11px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'transparent',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    boxSizing: 'border-box',
                                                    outline: 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                onClick={() => {
                                                    setActionConfirmData({
                                                        icon: '/waze.svg',
                                                        title: 'Open Waze Navigation',
                                                        message: 'Navigate with Waze?',
                                                        details: {
                                                            Location: selectedRowInfo.location || 'Unknown',
                                                            Coordinates: `${selectedRowInfo.latitude}, ${selectedRowInfo.longitude}`
                                                        },
                                                        action: () => {
                                                            const url = `https://waze.com/ul?ll=${selectedRowInfo.latitude},${selectedRowInfo.longitude}&navigate=yes`;
                                                            window.open(url, '_blank');
                                                        },
                                                        buttonLabel: 'Open Waze',
                                                        buttonColor: '#06b6d4'
                                                    });
                                                    setActionConfirmVisible(true);
                                                }}
                                            >
                                                <img 
                                                    src="/waze.svg" 
                                                    alt="Waze" 
                                                    style={{ 
                                                        width: '100%', 
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }} 
                                                />
                                            </button>
                                        )}
                                        
                                        {/* Website Link Button - [L] */}
                                        {/* Show in view mode only if URL exists, or always in edit mode */}
                                        {(editMode || selectedRowInfo?.websiteLink) && (
                                            <button
                                                title={editMode
                                                    ? (selectedRowInfo?.websiteLink ? "Edit Website [L]" : "Add Website Link [L]")
                                                    : "Website Link [L]"
                                                }
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'transparent',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    boxSizing: 'border-box',
                                                    fontSize: '24px',
                                                    color: editMode
                                                        ? (selectedRowInfo?.websiteLink ? '#f59e0b' : '#8b5cf6')
                                                        : '#10b981',
                                                    outline: 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                onClick={() => {
                                                    if (editMode) {
                                                        // Edit mode: Open dialog to add/edit
                                                        setCurrentEditingRowId(selectedRowInfo.id);
                                                        setWebsiteLinkInput(selectedRowInfo.websiteLink || '');
                                                        setWebsiteLinkDialogVisible(true);
                                                    } else if (selectedRowInfo.websiteLink) {
                                                        // View mode: Open link with modal
                                                        setActionConfirmData({
                                                            icon: 'pi-globe',
                                                            title: 'Open Website',
                                                            message: 'Visit this website?',
                                                            details: {
                                                                URL: selectedRowInfo.websiteLink
                                                            },
                                                            action: () => {
                                                                handleOpenLink(selectedRowInfo.websiteLink, 'Website');
                                                            },
                                                            buttonLabel: 'Open Website',
                                                            buttonColor: '#10b981'
                                                        });
                                                        setActionConfirmVisible(true);
                                                    }
                                                }}
                                            >
                                                <i className={`pi ${
                                                    editMode 
                                                        ? (selectedRowInfo?.websiteLink ? 'pi-pencil' : 'pi-plus-circle')
                                                        : 'pi-globe'
                                                }`}></i>
                                            </button>
                                        )}
                                        
                                        {/* QR Code Button - [Q] */}
                        {/* Only show in view mode if QR code exists, or always show in edit mode */}
                        {(editMode || (selectedRowInfo?.qrCodeImages && selectedRowInfo.qrCodeImages.length > 0)) && (
                            editMode ? (
                                <button
                                    title={(selectedRowInfo?.qrCodeImages && selectedRowInfo.qrCodeImages.length > 0) ? `Edit QR Codes (${selectedRowInfo.qrCodeImages.length}) [Q]` : "Add QR Code [Q]"}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        padding: '5px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'transparent',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        boxSizing: 'border-box',
                                        fontSize: '24px',
                                        color: (selectedRowInfo?.qrCodeImages && selectedRowInfo.qrCodeImages.length > 0) ? '#f59e0b' : '#8b5cf6',
                                        outline: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                    onClick={() => {
                                        // Edit mode: Open dialog to edit QR code
                                        setCurrentEditingRowId(selectedRowInfo.id);
                                        setQrCodeImages(selectedRowInfo.qrCodeImages || []);
                                        setQrCodeDialogVisible(true);
                                    }}
                                >
                                    <i className={`pi ${(selectedRowInfo?.qrCodeImages && selectedRowInfo.qrCodeImages.length > 0) ? 'pi-pencil' : 'pi-plus-circle'}`}></i>
                                </button>
                            ) : (
                                <button
                                    title="Scan QR Code [Q]"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        padding: '3px',
                                        cursor: scanningQrCode ? 'wait' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'transparent',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        boxSizing: 'border-box',
                                        position: 'relative',
                                        outline: 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!scanningQrCode) {
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                            e.currentTarget.style.boxShadow = isDark ? '0 4px 8px rgba(255, 255, 255, 0.3)' : '0 4px 8px rgba(0, 0, 0, 0.3)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!scanningQrCode) {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }
                                    }}
                                    onClick={() => {
                                        // View mode: Open QR dialog (will auto-show selection or scan)
                                        if (selectedRowInfo.qrCodeImages && selectedRowInfo.qrCodeImages.length > 0 && !scanningQrCode) {
                                            setQrCodeImages(selectedRowInfo.qrCodeImages);
                                            setQrCodeDialogVisible(true);
                                        }
                                    }}
                                    disabled={scanningQrCode}
                                >
                                    {scanningQrCode ? (
                                        <i className="pi pi-spin pi-spinner" style={{ 
                                            fontSize: '24px',
                                            color: isDark ? '#ffffff' : '#000000'
                                        }}></i>
                                    ) : (
                                        <img 
                                            src="/QRcodewoi.png" 
                                            alt="QR Code" 
                                            style={{ 
                                                width: '100%', 
                                                height: '100%',
                                                objectFit: 'contain',
                                                filter: isDark ? 'brightness(0) saturate(100%) invert(100%)' : 'brightness(0) saturate(100%)'
                                            }} 
                                        />
                                    )}
                                </button>
                            )
                        )}
                                        
                                        {/* FamilyMart Button */}
                                        {(() => {
                                            const code = selectedRowInfo?.code;
                                            let familyMartLink = null;
                                            
                                            // If code is empty, default to M0000
                                            if (!code || code.toString().trim() === '') {
                                                familyMartLink = 'https://fmvending.web.app/refill-service/M0000';
                                            } else {
                                                // Check if code is numeric only (no letters)
                                                const isNumeric = /^\d+$/.test(code.toString().trim());
                                                if (isNumeric) {
                                                    // Format to 4 digits with leading zeros
                                                    const formattedCode = code.toString().trim().padStart(4, '0');
                                                    familyMartLink = `https://fmvending.web.app/refill-service/M${formattedCode}`;
                                                }
                                            }
                                            
                                            // Only show button if we have a valid link
                                            return familyMartLink ? (
                                                <button
                                                    title="FamilyMart Refill"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        padding: '5px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: 'transparent',
                                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                        boxSizing: 'border-box',
                                                        outline: 'none'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }}
                                                    onClick={() => {
                                                        const code = selectedRowInfo?.code || '0000';
                                                        setActionConfirmData({
                                                            icon: '/FamilyMart.png',
                                                            title: 'FamilyMart Refill Service',
                                                            message: 'Open refill service page?',
                                                            details: {
                                                                'Location Code': code,
                                                                URL: familyMartLink
                                                            },
                                                            action: () => {
                                                                window.open(familyMartLink, '_blank');
                                                            },
                                                            buttonLabel: 'Open Service',
                                                            buttonColor: '#14b8a6'
                                                        });
                                                        setActionConfirmVisible(true);
                                                    }}
                                                >
                                                    <img 
                                                        src="/FamilyMart.png" 
                                                        alt="FamilyMart" 
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '100%',
                                                            objectFit: 'contain'
                                                        }} 
                                                    />
                                                </button>
                                            ) : null;
                                        })()}
                                        
                                        {/* Phone/Call Button - [P] */}
                                        {selectedRowInfo?.phone && (
                                            <button
                                                title={`Call ${selectedRowInfo.phone} [P]`}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    padding: '5px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: 'transparent',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    boxSizing: 'border-box',
                                                    fontSize: '24px',
                                                    color: '#059669',
                                                    outline: 'none'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1.1)';
                                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'scale(1)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                                onClick={() => {
                                                    setActionConfirmData({
                                                        icon: 'pi-phone',
                                                        title: 'Call Phone Number',
                                                        message: 'Make a call to this number?',
                                                        details: {
                                                            Phone: selectedRowInfo.phone
                                                        },
                                                        action: () => {
                                                            window.location.href = `tel:${selectedRowInfo.phone}`;
                                                        },
                                                        buttonLabel: 'Call Now',
                                                        buttonColor: '#059669'
                                                    });
                                                    setActionConfirmVisible(true);
                                                }}
                                            >
                                                <i className="pi pi-phone"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Dialog>

                {/* View Mode Route Info Dialog - Enhanced */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-info-circle" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Route Information</span>
                        </div>
                    }
                    visible={viewDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '650px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setViewDialogVisible(false);
                        setSelectedViewRoute(null);
                    }}
                >
                    {selectedViewRoute && (
                        <div style={{ padding: '1rem' }}>
                            {/* Header Info */}
                            <div style={{ 
                                backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                border: `1px solid ${isDark ? '#374151' : '#e9ecef'}`,
                                marginBottom: '1rem'
                            }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingBottom: '1rem',
                                    borderBottom: `2px solid ${isDark ? '#374151' : '#dee2e6'}`
                                }}>
                                    <div>
                                        <div style={{ 
                                            fontSize: '18px', 
                                            fontWeight: 'bold',
                                            color: isDark ? '#60a5fa' : '#3b82f6'
                                        }}>
                                            {selectedViewRoute.route}
                                        </div>
                                        <div style={{ 
                                            fontSize: '12px',
                                            color: isDark ? '#9ca3af' : '#6c757d',
                                            marginTop: '0.25rem'
                                        }}>
                                            {selectedViewRoute.warehouse}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem'
                                    }}>
                                        <i className="pi pi-map-marker" style={{ 
                                            color: isDark ? '#60a5fa' : '#3b82f6',
                                            fontSize: '1.5rem'
                                        }}></i>
                                        <div style={{
                                            textAlign: 'center'
                                        }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                fontSize: '24px',
                                                color: isDark ? '#60a5fa' : '#3b82f6'
                                            }}>
                                                {selectedViewRoute.locationCount || 0}
                                            </div>
                                            <div style={{
                                                fontSize: '11px',
                                                color: isDark ? '#9ca3af' : '#6c757d'
                                            }}>
                                                Locations
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Control Bar - Search, Date, History */}
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                flexWrap: 'wrap',
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                backgroundColor: isDark ? '#111827' : '#f9fafb',
                                borderRadius: '6px',
                                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                            }}>
                                <div style={{ flex: '1', minWidth: '180px', position: 'relative' }}>
                                    <span className="p-input-icon-left" style={{ width: '100%' }}>
                                        <i className="pi pi-search" style={{ fontSize: '0.75rem', opacity: 0.5 }}></i>
                                        <InputText
                                            placeholder="Search..."
                                            style={{ width: '100%', fontSize: '12px' }}
                                        />
                                    </span>
                                </div>
                                <input
                                    type="date"
                                    style={{
                                        padding: '0.5rem',
                                        fontSize: '12px',
                                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                                        borderRadius: '4px',
                                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                        color: isDark ? '#e5e7eb' : '#111827'
                                    }}
                                />
                                <Button
                                    icon="pi pi-history"
                                    label="History"
                                    size="small"
                                    severity="info"
                                    outlined
                                    style={{
                                        padding: '0.5rem 1rem',
                                        fontSize: '12px'
                                    }}
                                    onClick={() => {
                                        // History toggle functionality
                                    }}
                                />
                            </div>

                            {/* Details Grid */}
                            <div style={{ 
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                                    borderRadius: '6px',
                                    border: `1px solid ${isDark ? '#374151' : '#e9ecef'}`
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: isDark ? '#9ca3af' : '#6c757d',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        Shift
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: isDark ? '#e5e7eb' : '#212529'
                                    }}>
                                        {selectedViewRoute.shift || 'N/A'}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                                    borderRadius: '6px',
                                    border: `1px solid ${isDark ? '#374151' : '#e9ecef'}`
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: isDark ? '#9ca3af' : '#6c757d',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        Warehouse
                                    </div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: 'bold',
                                        color: isDark ? '#e5e7eb' : '#212529'
                                    }}>
                                        {selectedViewRoute.warehouse || 'N/A'}
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: isDark ? '#1f2937' : '#f8f9fa',
                                    borderRadius: '6px',
                                    border: `1px solid ${isDark ? '#374151' : '#e9ecef'}`
                                }}>
                                    <div style={{
                                        fontSize: '11px',
                                        color: isDark ? '#9ca3af' : '#6c757d',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        Status
                                    </div>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600'
                                    }}>
                                        Active
                                    </div>
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div style={{
                                padding: '1rem',
                                backgroundColor: isDark ? '#1a1a2e' : '#f0f7ff',
                                borderLeft: '3px solid #3b82f6',
                                borderRadius: '4px',
                                marginBottom: '1rem'
                            }}>
                                <div style={{
                                    fontSize: '12px',
                                    color: isDark ? '#93c5fd' : '#1e40af',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <i className="pi pi-info-circle" style={{ fontSize: '0.875rem' }}></i>
                                    <span>Last updated: {new Date().toLocaleDateString('ms-MY')}</span>
                                </div>
                            </div>
                            
                            <div style={{ 
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'flex-end'
                            }}>
                                <Button 
                                    label="Close"
                                    icon="pi pi-times"
                                    onClick={() => setViewDialogVisible(false)}
                                    severity="secondary"
                                    size="small"
                                />
                                <Button 
                                    label="Edit Route"
                                    icon="pi pi-pencil"
                                    onClick={() => setViewDialogVisible(false)}
                                    severity="info"
                                    size="small"
                                />
                            </div>
                        </div>
                    )}
                </Dialog>

                {/* Password Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-lock" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Enter Password</span>
                        </div>
                    }
                    visible={passwordDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '400px' }}
                    modal
                    closable={!passwordLoading}
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        if (!passwordLoading) {
                            setPasswordDialogVisible(false);
                            setPasswordInput('');
                            setPasswordError('');
                            setShowPassword(false);
                        }
                    }}
                >
                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ 
                            padding: '1rem',
                            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid #bfdbfe'
                        }}>
                            <p style={{ 
                                margin: 0,
                                color: isDark ? '#93c5fd' : '#1e40af',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <i className="pi pi-info-circle"></i>
                                Please enter your 4-digit password to access Edit Mode
                            </p>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: isDark ? '#e5e5e5' : '#1f2937',
                                letterSpacing: '0.025em'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <InputText
                                    type={showPassword ? "text" : "password"}
                                    value={passwordInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 4 && /^\d*$/.test(value)) {
                                            setPasswordInput(value);
                                            setPasswordError('');
                                        }
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && passwordInput.length === 4 && !passwordLoading) {
                                            handlePasswordSubmit();
                                        }
                                    }}
                                    placeholder="Enter 4-digit password"
                                    maxLength={4}
                                    style={{ 
                                        width: '100%',
                                        paddingRight: '3rem',
                                        fontSize: '1.125rem',
                                        letterSpacing: showPassword ? 'normal' : '0.25rem',
                                        fontWeight: '500'
                                    }}
                                    disabled={passwordLoading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={passwordLoading}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: passwordLoading ? 'not-allowed' : 'pointer',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease',
                                        opacity: passwordLoading ? 0.5 : 1
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!passwordLoading) {
                                            e.currentTarget.style.color = '#3b82f6';
                                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <i className={showPassword ? "pi pi-eye-slash" : "pi pi-eye"} style={{ fontSize: '1.1rem' }}></i>
                                </button>
                            </div>
                            <div style={{ 
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                color: isDark ? '#9ca3af' : '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}>
                                <i className="pi pi-shield" style={{ fontSize: '0.7rem' }}></i>
                                {passwordInput.length}/4 digits entered
                            </div>
                        </div>
                        
                        {passwordError && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
                                color: isDark ? '#fca5a5' : '#991b1b',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                                animation: 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
                            }}>
                                <i className="pi pi-times-circle" style={{ fontSize: '1rem' }}></i>
                                <span style={{ fontWeight: '500' }}>{passwordError}</span>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => {
                                    setPasswordDialogVisible(false);
                                    setPasswordInput('');
                                    setPasswordError('');
                                    setShowPassword(false);
                                }}
                                className="p-button-text"
                                size="small"
                                disabled={passwordLoading}
                            />
                            <Button
                                label={passwordLoading ? "Verifying..." : "Submit"}
                                icon={passwordLoading ? "pi pi-spin pi-spinner" : "pi pi-check"}
                                onClick={handlePasswordSubmit}
                                disabled={passwordInput.length !== 4 || passwordLoading}
                                severity="success"
                                size="small"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Change Password Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="pi pi-key" style={{ fontSize: '1.2rem', color: '#3b82f6' }}></i>
                            <span>Change Password</span>
                        </div>
                    }
                    visible={changePasswordDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setChangePasswordDialogVisible(false);
                        setChangePasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                        });
                        setChangePasswordError('');
                        setShowCurrentPassword(false);
                        setShowNewPassword(false);
                        setShowConfirmPassword(false);
                    }}
                >
                    <div style={{ padding: '1.5rem' }}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: isDark ? '#e5e5e5' : '#1f2937',
                                letterSpacing: '0.025em'
                            }}>
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <InputText
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={changePasswordData.currentPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 4 && /^\d*$/.test(value)) {
                                            setChangePasswordData({
                                                ...changePasswordData,
                                                currentPassword: value
                                            });
                                            setChangePasswordError('');
                                        }
                                    }}
                                    placeholder="Enter current password"
                                    maxLength={4}
                                    style={{ 
                                        width: '100%',
                                        paddingRight: '3rem',
                                        fontSize: '1.125rem',
                                        letterSpacing: showCurrentPassword ? 'normal' : '0.25rem',
                                        fontWeight: '500'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#3b82f6';
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <i className={showCurrentPassword ? "pi pi-eye-slash" : "pi pi-eye"} style={{ fontSize: '1.1rem' }}></i>
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: isDark ? '#e5e5e5' : '#1f2937',
                                letterSpacing: '0.025em'
                            }}>
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <InputText
                                    type={showNewPassword ? "text" : "password"}
                                    value={changePasswordData.newPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 4 && /^\d*$/.test(value)) {
                                            setChangePasswordData({
                                                ...changePasswordData,
                                                newPassword: value
                                            });
                                            setChangePasswordError('');
                                        }
                                    }}
                                    placeholder="Enter new 4-digit password"
                                    maxLength={4}
                                    style={{ 
                                        width: '100%',
                                        paddingRight: '3rem',
                                        fontSize: '1.125rem',
                                        letterSpacing: showNewPassword ? 'normal' : '0.25rem',
                                        fontWeight: '500'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#3b82f6';
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <i className={showNewPassword ? "pi pi-eye-slash" : "pi pi-eye"} style={{ fontSize: '1.1rem' }}></i>
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ 
                                display: 'block', 
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                color: isDark ? '#e5e5e5' : '#1f2937',
                                letterSpacing: '0.025em'
                            }}>
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <InputText
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={changePasswordData.confirmPassword}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value.length <= 4 && /^\d*$/.test(value)) {
                                            setChangePasswordData({
                                                ...changePasswordData,
                                                confirmPassword: value
                                            });
                                            setChangePasswordError('');
                                        }
                                    }}
                                    placeholder="Confirm new password"
                                    maxLength={4}
                                    style={{ 
                                        width: '100%',
                                        paddingRight: '3rem',
                                        fontSize: '1.125rem',
                                        letterSpacing: showConfirmPassword ? 'normal' : '0.25rem',
                                        fontWeight: '500'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: '4px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = '#3b82f6';
                                        e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <i className={showConfirmPassword ? "pi pi-eye-slash" : "pi pi-eye"} style={{ fontSize: '1.1rem' }}></i>
                                </button>
                            </div>
                            <div style={{ 
                                marginTop: '0.5rem',
                                fontSize: '0.75rem',
                                color: changePasswordData.newPassword && changePasswordData.confirmPassword && changePasswordData.newPassword === changePasswordData.confirmPassword
                                    ? isDark ? '#86efac' : '#16a34a'
                                    : isDark ? '#9ca3af' : '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontWeight: '500'
                            }}>
                                {changePasswordData.newPassword && changePasswordData.confirmPassword ? (
                                    changePasswordData.newPassword === changePasswordData.confirmPassword ? (
                                        <>
                                            <i className="pi pi-check-circle" style={{ fontSize: '0.75rem' }}></i>
                                            Passwords match
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-times-circle" style={{ fontSize: '0.75rem', color: isDark ? '#fca5a5' : '#dc2626' }}></i>
                                            <span style={{ color: isDark ? '#fca5a5' : '#dc2626' }}>Passwords don't match</span>
                                        </>
                                    )
                                ) : null}
                            </div>
                        </div>
                        
                        {changePasswordError && (
                            <div style={{
                                padding: '1rem',
                                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2',
                                color: isDark ? '#fca5a5' : '#991b1b',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid #fecaca',
                                animation: 'shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)'
                            }}>
                                <i className="pi pi-times-circle" style={{ fontSize: '1rem' }}></i>
                                <span style={{ fontWeight: '500' }}>{changePasswordError}</span>
                            </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => {
                                    setChangePasswordDialogVisible(false);
                                    setChangePasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                    setChangePasswordError('');
                                    setShowCurrentPassword(false);
                                    setShowNewPassword(false);
                                    setShowConfirmPassword(false);
                                }}
                                className="p-button-text"
                                size="small"
                            />
                            <Button
                                label="Change Password"
                                icon="pi pi-check"
                                onClick={handleChangePassword}
                                severity="success"
                                size="small"
                            />
                        </div>
                    </div>
                </Dialog>

                {/* Saving Overlay */}
                {saving && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10000,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div style={{
                            backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
                            padding: '3rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                            border: `2px solid ${isDark ? '#1a3a52' : '#3b82f6'}`
                        }}>
                            <i className="pi pi-spin pi-spinner" style={{ 
                                fontSize: '3rem', 
                                color: '#3b82f6',
                                marginBottom: '1rem'
                            }}></i>
                            <h3 style={{ 
                                margin: '1rem 0 0.5rem 0',
                                color: isDark ? '#e5e5e5' : '#000000',
                                fontSize: '1.5rem'
                            }}>Saving Changes...</h3>
                            <p style={{ 
                                margin: 0,
                                color: isDark ? '#9ca3af' : '#6b7280',
                                fontSize: '0.875rem'
                            }}>Please wait while we save your data</p>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '1.5rem' }}></i>
                            <span>Confirm Delete</span>
                        </div>
                    }
                    visible={deleteConfirmVisible}
                    style={{ width: '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={cancelDelete}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={cancelDelete}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Delete"
                                icon="pi pi-trash"
                                onClick={confirmDelete}
                                severity="danger"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        <p style={{ 
                            margin: '0 0 1rem 0',
                            fontSize: '1rem',
                            color: isDark ? '#e5e5e5' : '#000000'
                        }}>
                            Are you sure you want to delete this {deleteType === 'location' ? 'location' : 'route'}?
                        </p>
                        {deleteTarget && deleteTarget.data && (
                            <div style={{
                                backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                                padding: '1rem',
                                borderRadius: '8px',
                                border: `2px solid ${isDark ? '#404040' : '#e5e7eb'}`
                            }}>
                                {deleteType === 'location' ? (
                                    <>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Code:</strong> {deleteTarget.data.code}
                                        </div>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Location:</strong> {deleteTarget.data.location}
                                        </div>
                                        <div>
                                            <strong>Delivery:</strong> {deleteTarget.data.delivery}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Route:</strong> {deleteTarget.data.route}
                                        </div>
                                        <div style={{ marginBottom: '0.5rem' }}>
                                            <strong>Shift:</strong> {deleteTarget.data.shift}
                                        </div>
                                        <div>
                                            <strong>Warehouse:</strong> {deleteTarget.data.warehouse}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                        <p style={{ 
                            margin: '1rem 0 0 0',
                            fontSize: '0.875rem',
                            color: '#ef4444',
                            fontWeight: 'bold'
                        }}>
                            ⚠️ This action cannot be undone!
                        </p>
                    </div>
                </Dialog>

                {/* Image Management Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-images" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                            <span>Manage Images</span>
                        </div>
                    }
                    visible={imageDialogVisible}
                    style={{ width: '600px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => setImageDialogVisible(false)}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setImageDialogVisible(false)}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                onClick={handleSaveImages}
                                severity="success"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        {/* Add Image by URL */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: isDark ? '#e5e5e5' : '#000000'
                            }}>
                                {editingImageIndex !== null ? 'Edit Image URL:' : 'Add Image by URL:'}
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <InputText
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="Enter image URL..."
                                    style={{ flex: 1 }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            editingImageIndex !== null ? handleUpdateImage() : handleAddImageUrl();
                                        }
                                    }}
                                />
                                {editingImageIndex !== null ? (
                                    <>
                                        <Button
                                            label="Update"
                                            icon="pi pi-check"
                                            onClick={handleUpdateImage}
                                            severity="success"
                                            size="small"
                                        />
                                        <Button
                                            label="Cancel"
                                            icon="pi pi-times"
                                            onClick={() => {
                                                setEditingImageIndex(null);
                                                setImageUrlInput('');
                                            }}
                                            severity="secondary"
                                            size="small"
                                            outlined
                                        />
                                    </>
                                ) : (
                                    <Button
                                        label="Add"
                                        icon="pi pi-plus"
                                        onClick={handleAddImageUrl}
                                        severity="info"
                                        size="small"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Upload Image from File */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.75rem',
                                fontWeight: '600',
                                fontSize: '13px',
                                color: isDark ? '#e5e5e5' : '#374151'
                            }}>
                                Upload Image:
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    disabled={uploadingImage}
                                    id="file-upload-input"
                                    style={{
                                        position: 'absolute',
                                        opacity: 0,
                                        width: '100%',
                                        height: '100%',
                                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                        zIndex: 2
                                    }}
                                />
                                <label 
                                    htmlFor="file-upload-input"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        padding: '1rem',
                                        border: `2px dashed ${isDark ? '#4b5563' : '#d1d5db'}`,
                                        borderRadius: '12px',
                                        backgroundColor: isDark ? 'rgba(31, 41, 55, 0.3)' : 'rgba(249, 250, 251, 0.5)',
                                        cursor: uploadingImage ? 'not-allowed' : 'pointer',
                                        opacity: uploadingImage ? 0.6 : 1,
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!uploadingImage) {
                                            e.currentTarget.style.borderColor = '#3b82f6';
                                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!uploadingImage) {
                                            e.currentTarget.style.borderColor = isDark ? '#4b5563' : '#d1d5db';
                                            e.currentTarget.style.backgroundColor = isDark ? 'rgba(31, 41, 55, 0.3)' : 'rgba(249, 250, 251, 0.5)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <i className="pi pi-spin pi-spinner" style={{ 
                                                fontSize: '1.5rem',
                                                color: '#3b82f6'
                                            }}></i>
                                            <span style={{ 
                                                fontSize: '14px',
                                                fontWeight: '600',
                                                color: isDark ? '#93c5fd' : '#3b82f6'
                                            }}>
                                                Uploading...
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="pi pi-cloud-upload" style={{ 
                                                fontSize: '1.5rem',
                                                color: isDark ? '#60a5fa' : '#3b82f6'
                                            }}></i>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ 
                                                    fontSize: '14px',
                                                    fontWeight: '600',
                                                    color: isDark ? '#e5e5e5' : '#374151',
                                                    marginBottom: '2px'
                                                }}>
                                                    Choose File or Drag & Drop
                                                </div>
                                                <div style={{ 
                                                    fontSize: '11px',
                                                    color: isDark ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    PNG, JPG, GIF up to 10MB
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Current Images List */}
                        <div>
                            <label style={{ 
                                display: 'block',
                                marginBottom: '0.5rem',
                                fontWeight: 'bold',
                                color: isDark ? '#e5e5e5' : '#000000'
                            }}>
                                Current Images ({currentRowImages.length}):
                            </label>
                            {currentRowImages.length === 0 ? (
                                <div style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    backgroundColor: 'transparent',
                                    borderRadius: '8px',
                                    color: isDark ? '#9ca3af' : '#6b7280'
                                }}>
                                    <i className="pi pi-image" style={{ 
                                        fontSize: '3rem', 
                                        marginBottom: '1rem', 
                                        opacity: 0.3,
                                        animation: 'floatImage 3s ease-in-out infinite'
                                    }}></i>
                                    <p style={{ margin: 0 }}>No images added yet</p>
                                    <style>{`
                                        @keyframes floatImage {
                                            0%, 100% { transform: translateY(0px); }
                                            50% { transform: translateY(-10px); }
                                        }
                                    `}</style>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {currentRowImages.map((img, index) => (
                                        <div key={index} style={{
                                            position: 'relative',
                                            border: `2px solid ${isDark ? '#404040' : '#e5e7eb'}`,
                                            borderRadius: '8px',
                                            padding: '0.5rem',
                                            backgroundColor: isDark ? '#2a2a2a' : '#ffffff'
                                        }}>
                                            <div style={{ position: 'relative', width: '100%', height: '80px' }}>
                                                {imageLoadingStates[index] && (
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: isDark ? 'rgba(42, 42, 42, 0.95)' : 'rgba(243, 244, 246, 0.95)',
                                                        borderRadius: '6px',
                                                        zIndex: 1,
                                                        backdropFilter: 'blur(4px)',
                                                        animation: 'fadeInOverlay 0.3s ease-in'
                                                    }}>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            gap: '0.5rem'
                                                        }}>
                                                            <i className="pi pi-spin pi-spinner" style={{ 
                                                                fontSize: '1.8rem',
                                                                color: '#3b82f6'
                                                            }}></i>
                                                            <span style={{
                                                                fontSize: '0.7rem',
                                                                color: isDark ? '#9ca3af' : '#6b7280',
                                                                fontWeight: '500'
                                                            }}>Loading...</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <img
                                                    src={img}
                                                    alt={`Image ${index + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '80px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px',
                                                        marginBottom: '0.5rem',
                                                        display: imageLoadingStates[index] ? 'none' : 'block'
                                                    }}
                                                    onLoad={() => {
                                                        setImageLoadingStates(prev => ({ ...prev, [index]: false }));
                                                    }}
                                                    onError={() => {
                                                        setImageLoadingStates(prev => ({ ...prev, [index]: false }));
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                                                <Button
                                                    icon="pi pi-pencil"
                                                    size="small"
                                                    severity="info"
                                                    text
                                                    tooltip="Edit"
                                                    onClick={() => handleEditImage(index)}
                                                />
                                                <Button
                                                    icon="pi pi-trash"
                                                    size="small"
                                                    severity="danger"
                                                    text
                                                    tooltip="Delete"
                                                    onClick={() => handleDeleteImage(index)}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog>

                {/* Power Mode Selection Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-power-off" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                            <span>Power Mode Settings</span>
                        </div>
                    }
                    visible={powerModeDialogVisible}
                    style={{ width: '500px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => setPowerModeDialogVisible(false)}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setPowerModeDialogVisible(false)}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Save"
                                icon="pi pi-check"
                                onClick={handleSavePowerMode}
                                severity="success"
                                size="small"
                                raised
                            />
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        <p style={{ 
                            marginBottom: '1.5rem',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            fontSize: '0.875rem'
                        }}>
                            Select one power mode. Only one mode can be active at a time.
                        </p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[
                                { 
                                    value: 'Daily', 
                                    label: 'Daily', 
                                    description: 'Always ON - Runs every day',
                                    icon: 'pi-sun'
                                },
                                { 
                                    value: 'Weekday', 
                                    label: 'Weekday', 
                                    description: 'OFF on Friday & Saturday',
                                    icon: 'pi-calendar'
                                },
                                { 
                                    value: 'Alt 1', 
                                    label: 'Alternate 1', 
                                    description: 'ON: Odd dates (1,3,5,7...)',
                                    icon: 'pi-chart-line'
                                },
                                { 
                                    value: 'Alt 2', 
                                    label: 'Alternate 2', 
                                    description: 'ON: Even dates (2,4,6,8...)',
                                    icon: 'pi-chart-bar'
                                }
                            ].map((mode) => {
                                const isSelected = selectedPowerMode === mode.value;
                                const status = getPowerStatus(mode.value);
                                const color = getPowerColor(mode.value);
                                
                                return (
                                    <div
                                        key={mode.value}
                                        onClick={() => setSelectedPowerMode(mode.value)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: '1rem',
                                            border: `2px solid ${isSelected ? '#3b82f6' : (isDark ? '#404040' : '#e5e7eb')}`,
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: isSelected 
                                                ? (isDark ? '#1e3a5f' : '#dbeafe')
                                                : (isDark ? '#2a2a2a' : '#ffffff'),
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = isDark ? '#353535' : '#f9fafb';
                                                e.currentTarget.style.borderColor = '#3b82f6';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.backgroundColor = isDark ? '#2a2a2a' : '#ffffff';
                                                e.currentTarget.style.borderColor = isDark ? '#404040' : '#e5e7eb';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                            <i 
                                                className={`pi ${mode.icon}`}
                                                style={{ 
                                                    fontSize: '1.5rem',
                                                    color: isSelected ? '#3b82f6' : (isDark ? '#9ca3af' : '#6b7280')
                                                }}
                                            ></i>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.25rem',
                                                    color: isDark ? '#e5e5e5' : '#000000'
                                                }}>
                                                    {mode.label}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.75rem',
                                                    color: isDark ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    {mode.description}
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.75rem'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 'bold',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '12px',
                                                    backgroundColor: status === 'ON' ? '#dcfce7' : '#fee2e2',
                                                    color: status === 'ON' ? '#166534' : '#991b1b'
                                                }}>
                                                    {status}
                                                </span>
                                                {/* Custom Switch */}
                                                <div
                                                    style={{
                                                        width: '48px',
                                                        height: '24px',
                                                        borderRadius: '12px',
                                                        backgroundColor: isSelected ? '#3b82f6' : (isDark ? '#4b5563' : '#d1d5db'),
                                                        position: 'relative',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#ffffff',
                                                            position: 'absolute',
                                                            top: '2px',
                                                            left: isSelected ? '26px' : '2px',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Dialog>
                
                {/* Column Visibility Modal */}
                <Dialog
                    visible={columnModalVisible}
                    onHide={() => setColumnModalVisible(false)}
                    header="Column Visibility"
                    style={{ width: deviceInfo.isMobile ? '90vw' : '400px', maxWidth: '400px' }}
                    contentStyle={{ height: deviceInfo.isMobile ? '400px' : '500px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    footer={
                        <div style={{ 
                            display: 'flex', 
                            gap: '0.5rem', 
                            justifyContent: 'flex-end'
                        }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                severity="secondary"
                                size="small"
                                outlined
                                onClick={() => setColumnModalVisible(false)}
                            />
                            <Button
                                label="Apply"
                                icon="pi pi-check"
                                severity="success"
                                size="small"
                                onClick={() => {
                                    setVisibleColumns(tempVisibleColumns);
                                    localStorage.setItem('columnVisibility', JSON.stringify(tempVisibleColumns));
                                    setColumnModalVisible(false);
                                }}
                            />
                        </div>
                    }
                >
                    <div style={{ padding: deviceInfo.isMobile ? '0.5rem 0' : '1rem 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: deviceInfo.isMobile ? '0.75rem' : '1rem' }}>
                            {[
                                { key: 'no', label: 'No' },
                                { key: 'code', label: 'Code' },
                                { key: 'location', label: 'Location' },
                                { key: 'delivery', label: 'Delivery' },
                                { key: 'kilometer', label: 'Kilometer' },
                                { key: 'latitude', label: 'Latitude' },
                                { key: 'longitude', label: 'Longitude' },
                                { key: 'address', label: 'Address' },
                                { key: 'image', label: 'Image' }
                            ].filter(col => {
                                // Hanya show latitude, longitude, address toggle dalam edit mode
                                if (['latitude', 'longitude', 'address'].includes(col.key)) {
                                    return editMode;
                                }
                                return true;
                            }).map(col => (
                                <div key={col.key} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: deviceInfo.isMobile ? '0.5rem' : '0.75rem',
                                    backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                                }}>
                                    <span style={{
                                        fontWeight: '600',
                                        fontSize: deviceInfo.isMobile ? '0.875rem' : '1rem',
                                        color: isDark ? '#e5e5e5' : '#000000'
                                    }}>
                                        {col.label}
                                    </span>
                                    <div
                                        onClick={() => setTempVisibleColumns({
                                            ...tempVisibleColumns,
                                            [col.key]: !tempVisibleColumns[col.key]
                                        })}
                                        style={{
                                            width: '48px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            backgroundColor: tempVisibleColumns[col.key] ? '#10b981' : (isDark ? '#4b5563' : '#d1d5db'),
                                            position: 'relative',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: '#ffffff',
                                                position: 'absolute',
                                                top: '2px',
                                                left: tempVisibleColumns[col.key] ? '26px' : '2px',
                                                transition: 'all 0.3s ease',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog>

                {/* Changelog Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-history" style={{ fontSize: '1.25rem' }}></i>
                            <span>Changelog History</span>
                        </div>
                    }
                    visible={changelogDialogVisible}
                    onHide={() => {
                        setChangelogDialogVisible(false);
                        setChangelogDateRange(null);
                        setChangelogSearchText('');
                        setChangelogFilterAction('all');
                        setChangelogFilterType('all');
                    }}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '80vw' }}
                    maximizable
                    modal
                    footer={
                        changelog.length > 0 && (
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '0.5rem 0',
                                borderTop: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                flexWrap: 'wrap',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    color: isDark ? '#9ca3af' : '#6b7280',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    gap: '1rem'
                                }}>
                                    <span>
                                        Active: <span style={{ fontWeight: 'bold', color: isDark ? '#10b981' : '#059669' }}>{getActiveChangelog().length}</span>
                                    </span>
                                    <span>
                                        Archived: <span style={{ fontWeight: 'bold', color: isDark ? '#6b7280' : '#9ca3af' }}>{changelog.filter(e => e.isArchived).length}</span>
                                    </span>
                                    <span>
                                        Total: <span style={{ fontWeight: 'bold' }}>{changelog.length}</span>
                                    </span>
                                </div>
                                <span style={{
                                    color: isDark ? '#9ca3af' : '#6b7280',
                                    fontSize: '0.875rem'
                                }}>
                                    Last: {changelog[0]?.timestamp || 'N/A'}
                                </span>
                            </div>
                        )
                    }
                >
                    {changelog.length === 0 ? (
                        <div style={{
                            padding: '3rem',
                            textAlign: 'center',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                            <i className="pi pi-history" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}></i>
                            <p style={{ fontSize: '1rem', fontWeight: '500' }}>No changes recorded yet</p>
                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Changes will appear here when you add, edit, or delete routes and locations</p>
                        </div>
                    ) : (
                        <>
                            {/* Latest Changes Summary - Show if no filters applied */}
                            {!changelogDateRange && !changelogSearchText && changelogFilterAction === 'all' && changelogFilterType === 'all' && getLatestChanges().length > 0 && (
                                <div style={{
                                    padding: '1rem',
                                    marginBottom: '1.5rem',
                                    backgroundColor: isDark ? '#064e3b' : '#d1fae5',
                                    borderLeft: '4px solid #10b981',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDark ? '#047857' : '#a7f3d0'}`
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem',
                                        color: isDark ? '#a7f3d0' : '#047857',
                                        fontWeight: 'bold'
                                    }}>
                                        <i className="pi pi-star-fill" style={{ fontSize: '1rem' }}></i>
                                        Latest Changes (Last 24 Hours)
                                    </div>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: deviceInfo.isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '0.5rem'
                                    }}>
                                        {getLatestChanges().map((entry) => (
                                            <div key={entry.id} style={{
                                                padding: '0.75rem',
                                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                color: isDark ? '#e5e7eb' : '#374151'
                                            }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                                                    {entry.action.toUpperCase()} {entry.type}
                                                </div>
                                                <div style={{ opacity: 0.8 }}>
                                                    {entry.type === 'route' 
                                                        ? `Route: ${entry.details.route || 'N/A'}`
                                                        : `Location: ${entry.details.code || 'N/A'}`
                                                    }
                                                </div>
                                                <div style={{ opacity: 0.6, marginTop: '0.25rem' }}>
                                                    {entry.timestamp}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Filter Controls */}
                            <div style={{
                                display: 'flex',
                                flexDirection: deviceInfo.isMobile ? 'column' : 'row',
                                gap: '1rem',
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                                borderRadius: '8px',
                                border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                            }}>
                                {/* Date Range Picker */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: isDark ? '#e5e7eb' : '#374151'
                                    }}>
                                        <i className="pi pi-calendar" style={{ marginRight: '0.5rem' }}></i>
                                        Date Range
                                    </label>
                                    <Calendar
                                        value={changelogDateRange}
                                        onChange={(e) => setChangelogDateRange(e.value)}
                                        selectionMode="range"
                                        readOnlyInput
                                        placeholder="Select date range"
                                        dateFormat="dd/mm/yy"
                                        showIcon
                                        showButtonBar
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                {/* Action Filter */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: isDark ? '#e5e7eb' : '#374151'
                                    }}>
                                        <i className="pi pi-filter" style={{ marginRight: '0.5rem' }}></i>
                                        Action
                                    </label>
                                    <Dropdown
                                        value={changelogFilterAction}
                                        onChange={(e) => setChangelogFilterAction(e.value)}
                                        options={[
                                            { label: 'All Actions', value: 'all' },
                                            { label: 'Add', value: 'add' },
                                            { label: 'Edit', value: 'edit' },
                                            { label: 'Delete', value: 'delete' }
                                        ]}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                
                                {/* Type Filter */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ 
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        color: isDark ? '#e5e7eb' : '#374151'
                                    }}>
                                        <i className="pi pi-tag" style={{ marginRight: '0.5rem' }}></i>
                                        Type
                                    </label>
                                    <Dropdown
                                        value={changelogFilterType}
                                        onChange={(e) => setChangelogFilterType(e.value)}
                                        options={[
                                            { label: 'All Types', value: 'all' },
                                            { label: 'Route', value: 'route' },
                                            { label: 'Location', value: 'location' }
                                        ]}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                            
                            {/* Search & Actions Bar */}
                            <div style={{
                                display: 'flex',
                                flexDirection: deviceInfo.isMobile ? 'column' : 'row',
                                gap: '1rem',
                                marginBottom: '1rem',
                                alignItems: deviceInfo.isMobile ? 'stretch' : 'center'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <span className="p-input-icon-left" style={{ width: '100%' }}>
                                        <i className="pi pi-search" />
                                        <InputText
                                            value={changelogSearchText}
                                            onChange={(e) => setChangelogSearchText(e.target.value)}
                                            placeholder="Search in changelog..."
                                            style={{ width: '100%' }}
                                        />
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        label={deviceInfo.isMobile ? 'Export' : 'Export JSON'}
                                        icon="pi pi-download"
                                        size="small"
                                        severity="info"
                                        outlined
                                        onClick={exportChangelog}
                                        disabled={getFilteredChangelog().length === 0}
                                    />
                                    <Button
                                        label={deviceInfo.isMobile ? 'Clear' : 'Clear All'}
                                        icon="pi pi-trash"
                                        size="small"
                                        severity="danger"
                                        outlined
                                        onClick={() => {
                                            if (confirm('Are you sure you want to clear all changelog history?')) {
                                                setChangelog([]);
                                            }
                                        }}
                                    />
                                    <Button
                                        label="Reset"
                                        icon="pi pi-refresh"
                                        size="small"
                                        severity="secondary"
                                        outlined
                                        onClick={() => {
                                            setChangelogDateRange(null);
                                            setChangelogSearchText('');
                                            setChangelogFilterAction('all');
                                            setChangelogFilterType('all');
                                        }}
                                    />
                                </div>
                            </div>
                            
                            {/* Results Count */}
                            {(changelogDateRange || changelogSearchText || changelogFilterAction !== 'all' || changelogFilterType !== 'all') && (
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                                    borderLeft: '3px solid #3b82f6',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    color: isDark ? '#93c5fd' : '#1e40af',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <i className="pi pi-info-circle"></i>
                                    <span>Showing {getFilteredChangelog().length} of {changelog.length} entries</span>
                                </div>
                            )}
                            
                            {/* Changelog Entries */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                maxHeight: '50vh',
                                overflowY: 'auto',
                                padding: '0.5rem'
                            }}>
                                {getFilteredChangelog().length === 0 ? (
                                    <div style={{
                                        padding: '2rem',
                                        textAlign: 'center',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        backgroundColor: isDark ? '#1a1a1a' : '#f9fafb',
                                        borderRadius: '8px',
                                        border: `2px dashed ${isDark ? '#334155' : '#e5e7eb'}`
                                    }}>
                                        <i className="pi pi-filter-slash" style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.3 }}></i>
                                        <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>No matching entries found</p>
                                        <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Try adjusting your filters</p>
                                    </div>
                                ) : (
                                    getFilteredChangelog().map((entry) => {
                                    const actionColors = {
                                        add: '#10b981',
                                        edit: '#f59e0b',
                                        delete: '#ef4444'
                                    };
                                    const actionIcons = {
                                        add: 'pi-plus-circle',
                                        edit: 'pi-pencil',
                                        delete: 'pi-trash'
                                    };
                                    
                                    return (
                                        <div key={entry.id} style={{
                                            padding: '1rem',
                                            backgroundColor: entry.isArchived 
                                                ? (isDark ? '#0f172a' : '#f3f4f6')
                                                : (isDark ? '#1a1a1a' : '#f9fafb'),
                                            borderLeft: `4px solid ${entry.isArchived ? '#6b7280' : actionColors[entry.action]}`,
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'flex-start',
                                            transition: 'all 0.2s ease',
                                            boxShadow: isDark ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                                            opacity: entry.isArchived ? 0.7 : 1
                                        }}>
                                            <i className={`pi ${actionIcons[entry.action]}`} style={{
                                                color: entry.isArchived ? '#6b7280' : actionColors[entry.action],
                                                fontSize: '1.25rem',
                                                marginTop: '0.1rem'
                                            }}></i>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.5rem',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        fontWeight: '700',
                                                        color: entry.isArchived ? '#6b7280' : actionColors[entry.action],
                                                        textTransform: 'uppercase',
                                                        fontSize: '0.75rem',
                                                        letterSpacing: '1px',
                                                        padding: '0.25rem 0.75rem',
                                                        backgroundColor: entry.isArchived 
                                                            ? '#d1d5db40'
                                                            : `${actionColors[entry.action]}20`,
                                                        borderRadius: '4px'
                                                    }}>
                                                        {entry.action} {entry.type}
                                                        {entry.isArchived && (
                                                            <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                                                                📦 ARCHIVED
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span style={{
                                                        color: isDark ? '#9ca3af' : '#6b7280',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '500'
                                                    }}>
                                                        {entry.timestamp}
                                                    </span>
                                                </div>
                                                <div style={{
                                                    color: isDark ? '#e5e5e5' : '#374151',
                                                    lineHeight: '1.6',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {entry.action === 'add' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route: ${entry.details.route || 'New Route'}`
                                                                : `Location: ${entry.details.code || 'New Location'} in Route ${entry.details.route}`
                                                            }
                                                        </span>
                                                    )}
                                                    {entry.action === 'edit' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route ${entry.details.route}: ${entry.details.field} changed from "${entry.details.oldValue}" to "${entry.details.newValue}"`
                                                                : `Location ${entry.details.code}: ${entry.details.field} changed from "${entry.details.oldValue}" to "${entry.details.newValue}"`
                                                            }
                                                        </span>
                                                    )}
                                                    {entry.action === 'delete' && (
                                                        <span>
                                                            {entry.type === 'route' 
                                                                ? `Route: ${entry.details.route}`
                                                                : `Location: ${entry.details.code} from Route ${entry.details.route}`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }))}
                            </div>
                        </>
                    )}
                </Dialog>
                
                {/* Website Link Dialog */}
                <Dialog 
                    header={
                        <div style={{ 
                            textAlign: 'center', 
                            fontSize: '14px',
                            padding: '8px 0'
                        }}>
                            <i className="pi pi-external-link" style={{ marginRight: '8px' }}></i>
                            Add Website Link
                        </div>
                    }
                    visible={websiteLinkDialogVisible} 
                    style={{ width: deviceInfo.isMobile ? '95vw' : '500px' }} 
                    modal
                    dismissableMask
                    closeOnEscape
                    onHide={() => {
                        setWebsiteLinkDialogVisible(false);
                        setWebsiteLinkInput('');
                        setCurrentEditingRowId(null);
                    }}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <div>
                                {/* Show Delete button only if URL exists */}
                                {websiteLinkInput && (
                                    <Button 
                                        label="Delete" 
                                        icon="pi pi-trash" 
                                        onClick={() => {
                                            const confirmed = window.confirm('🗑️ Delete Website Link?\n\nThis will remove the website link from this location.');
                                            if (confirmed) {
                                                setWebsiteLinkInput('');
                                                handleSaveWebsiteLink();
                                            }
                                        }}
                                        className="p-button-danger"
                                        outlined
                                    />
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button 
                                    label="Cancel" 
                                    icon="pi pi-times" 
                                    onClick={() => {
                                        setWebsiteLinkDialogVisible(false);
                                        setWebsiteLinkInput('');
                                        setCurrentEditingRowId(null);
                                    }}
                                    className="p-button-text"
                                />
                                <Button 
                                    label="Save" 
                                    icon="pi pi-check" 
                                    onClick={handleSaveWebsiteLink}
                                    className="p-button-success"
                                />
                            </div>
                        </div>
                    }
                >
                    <div style={{ padding: '1rem 0' }}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '10px',
                            fontSize: '13px',
                            fontWeight: 'bold',
                            color: isDark ? '#e5e5e5' : '#495057'
                        }}>
                            Website URL
                        </label>
                        <InputText 
                            value={websiteLinkInput}
                            onChange={(e) => setWebsiteLinkInput(e.target.value)}
                            placeholder="https://example.com"
                            style={{ width: '100%' }}
                            autoFocus
                        />
                        <small style={{ 
                            display: 'block', 
                            marginTop: '8px',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            fontSize: '12px'
                        }}>
                            Enter the full URL including http:// or https://
                        </small>
                    </div>
                </Dialog>
                
                {/* QR Code Dialog */}
                <Dialog 
                    visible={qrCodeDialogVisible} 
                    onHide={() => {
                        setQrCodeDialogVisible(false);
                        setQrCodeImages([]);
                        setCurrentEditingRowId(null);
                        setScannedUrl('');
                        setScanningQrCode(false);
                        const fileInput = document.getElementById('qr-code-upload-input');
                        if (fileInput) fileInput.value = '';
                    }}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '550px' }} 
                    modal
                    dismissableMask
                    closable={false}
                >
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1rem'
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <i 
                                className="pi pi-qrcode"
                                style={{ 
                                    fontSize: '4rem',
                                    color: editMode ? '#8b5cf6' : '#10b981'
                                }}
                            ></i>
                        </div>
                        
                        {/* Title */}
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: isDark ? '#f1f5f9' : '#1e293b'
                        }}>
                            {editMode ? 'Manage QR Codes' : 'View QR Codes'}
                        </div>
                        
                        {/* Message */}
                        <div style={{
                            fontSize: '1rem',
                            textAlign: 'center',
                            color: isDark ? '#94a3b8' : '#64748b'
                        }}>
                            {editMode 
                                ? 'Upload and manage QR codes for this location'
                                : scanningQrCode 
                                    ? 'Scanning QR code...' 
                                    : `${qrCodeImages.length} QR code(s) available`
                            }
                        </div>
                        
                        {/* Content */}
                        <div style={{ width: '100%' }}>
                        {editMode ? (
                            <>
                                {/* Upload QR Code Images */}
                                <div style={{ marginBottom: '1.5rem', width: '100%' }}>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '10px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                        color: isDark ? '#e5e5e5' : '#495057'
                                    }}>
                                        Upload QR Code Images
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrCodeUpload}
                                            disabled={uploadingQrCode}
                                            id="qr-code-upload-input"
                                            style={{
                                                padding: '0.5rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '6px',
                                                width: '100%',
                                                cursor: uploadingQrCode ? 'not-allowed' : 'pointer',
                                                opacity: uploadingQrCode ? 0.6 : 1
                                            }}
                                        />
                                        {uploadingQrCode && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                right: '1rem',
                                                transform: 'translateY(-50%)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                color: '#3b82f6',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}>
                                                <i className="pi pi-spin pi-spinner"></i>
                                                Uploading...
                                            </div>
                                        )}
                                    </div>
                                    <small style={{ 
                                        display: 'block', 
                                        marginTop: '8px',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        fontSize: '12px'
                                    }}>
                                        You can upload multiple QR code images - just select and upload again
                                    </small>
                                    
                                    {/* Show uploaded QR codes */}
                                    {qrCodeImages.length > 0 && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <div style={{
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                marginBottom: '0.75rem',
                                                color: isDark ? '#e5e5e5' : '#495057'
                                            }}>
                                                {qrCodeImages.length} QR Code(s) Uploaded:
                                            </div>
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr',
                                                gap: '1rem'
                                            }}>
                                                {qrCodeImages.map((qrItem, index) => (
                                                    <div key={qrItem.id} style={{ 
                                                        border: `2px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                                                        borderRadius: '8px',
                                                        padding: '1rem',
                                                        backgroundColor: isDark ? '#1e293b' : '#f9fafb'
                                                    }}>
                                                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                                <img 
                                                                    src={qrItem.imageUrl} 
                                                                    alt={`QR Code ${index + 1}`}
                                                                    style={{ 
                                                                        width: '120px',
                                                                        height: '120px',
                                                                        objectFit: 'contain',
                                                                        border: '2px solid #e5e7eb',
                                                                        borderRadius: '8px',
                                                                        display: 'block',
                                                                        backgroundColor: 'white'
                                                                    }} 
                                                                />
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    top: '5px',
                                                                    left: '5px',
                                                                    backgroundColor: '#3b82f6',
                                                                    color: 'white',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '12px',
                                                                    fontSize: '11px',
                                                                    fontWeight: '700'
                                                                }}>
                                                                    #{index + 1}
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setQrCodeImages(prev => prev.filter((_, i) => i !== index));
                                                                    }}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        top: '-8px',
                                                                        right: '-8px',
                                                                        width: '28px',
                                                                        height: '28px',
                                                                        borderRadius: '50%',
                                                                        border: 'none',
                                                                        backgroundColor: '#ef4444',
                                                                        color: 'white',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: '14px',
                                                                        fontWeight: 'bold',
                                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                                                        transition: 'all 0.2s ease',
                                                                        outline: 'none'
                                                                    }}
                                                                    onMouseEnter={(e) => {
                                                                        e.currentTarget.style.backgroundColor = '#dc2626';
                                                                        e.currentTarget.style.transform = 'scale(1.1)';
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        e.currentTarget.style.backgroundColor = '#ef4444';
                                                                        e.currentTarget.style.transform = 'scale(1)';
                                                                    }}
                                                                    title="Delete QR Code"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <label style={{
                                                                    display: 'block',
                                                                    marginBottom: '0.5rem',
                                                                    fontSize: '12px',
                                                                    fontWeight: '600',
                                                                    color: isDark ? '#e5e5e5' : '#374151'
                                                                }}>
                                                                    Title / Label
                                                                </label>
                                                                <InputText
                                                                    value={qrItem.title || ''}
                                                                    onChange={(e) => {
                                                                        const newQrCodeImages = [...qrCodeImages];
                                                                        newQrCodeImages[index] = {
                                                                            ...newQrCodeImages[index],
                                                                            title: e.target.value
                                                                        };
                                                                        setQrCodeImages(newQrCodeImages);
                                                                    }}
                                                                    placeholder="e.g., Main Entrance, Back Door, etc."
                                                                    style={{ width: '100%' }}
                                                                />
                                                                <small style={{
                                                                    display: 'block',
                                                                    marginTop: '0.25rem',
                                                                    fontSize: '11px',
                                                                    color: isDark ? '#9ca3af' : '#6b7280'
                                                                }}>
                                                                    Optional: Add a label to identify this QR code
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            // View Mode - Show scanning state or QR info
                            <>
                                {scanningQrCode ? (
                                    // Scanning Animation
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1.5rem',
                                        color: isDark ? '#94a3b8' : '#6b7280',
                                        fontSize: '14px'
                                    }}>
                                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                                        <div>Scanning QR code...</div>
                                    </div>
                                ) : qrCodeImages.length === 0 ? (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1rem',
                                        color: isDark ? '#9ca3af' : '#6b7280',
                                        fontSize: '14px'
                                    }}>
                                        No QR code configured for this location
                                    </div>
                                ) : null}
                            </>
                        )}
                        </div>
                        
                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            width: '100%',
                            marginTop: '0.5rem'
                        }}>
                            {editMode ? (
                                <>
                                    {qrCodeImages.length > 0 && (
                                        <Button
                                            label="Delete All"
                                            icon="pi pi-trash"
                                            onClick={() => {
                                                const confirmed = window.confirm(`🗑️ Delete All QR Codes?\n\nThis will remove all ${qrCodeImages.length} QR code(s) from this location.`);
                                                if (confirmed) {
                                                    setQrCodeImages([]);
                                                    handleSaveQrCode();
                                                }
                                            }}
                                            severity="danger"
                                            outlined
                                            style={{ flex: 1 }}
                                        />
                                    )}
                                    <Button
                                        label="Cancel"
                                        icon="pi pi-times"
                                        onClick={() => {
                                            setQrCodeDialogVisible(false);
                                            setQrCodeImages([]);
                                            setCurrentEditingRowId(null);
                                            setScannedUrl('');
                                            setScanningQrCode(false);
                                            const fileInput = document.getElementById('qr-code-upload-input');
                                            if (fileInput) fileInput.value = '';
                                        }}
                                        severity="secondary"
                                        outlined
                                        style={{ flex: 1 }}
                                    />
                                    <Button
                                        label="Save"
                                        icon="pi pi-check"
                                        onClick={handleSaveQrCode}
                                        severity="success"
                                        style={{ flex: 1 }}
                                    />
                                </>
                            ) : (
                                <Button
                                    label="Close"
                                    icon="pi pi-times"
                                    onClick={() => {
                                        setQrCodeDialogVisible(false);
                                        setScannedUrl('');
                                        setScanningQrCode(false);
                                    }}
                                    severity="secondary"
                                    outlined
                                    style={{ flex: 1 }}
                                />
                            )}
                        </div>
                    </div>
                </Dialog>

                {/* Link Confirmation Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-external-link" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i>
                            <span>Open External Link</span>
                        </div>
                    }
                    visible={linkConfirmVisible}
                    style={{ width: '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={cancelOpenLink}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={cancelOpenLink}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Open Link"
                                icon="pi pi-external-link"
                                onClick={confirmOpenLink}
                                severity="success"
                                size="small"
                            />
                        </div>
                    }
                >
                    <div style={{ 
                        padding: '1rem',
                        color: isDark ? '#e5e7eb' : '#1f2937'
                    }}>
                        <p style={{ 
                            fontSize: '15px',
                            marginBottom: '1rem',
                            lineHeight: '1.6'
                        }}>
                            You are about to open <strong>{pendingLinkData.type}</strong> in a new tab:
                        </p>
                        <div style={{
                            backgroundColor: isDark ? '#1e293b' : '#f3f4f6',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                            wordBreak: 'break-all',
                            fontSize: '13px',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            maxHeight: '100px',
                            overflowY: 'auto'
                        }}>
                            {pendingLinkData.url}
                        </div>
                        <p style={{ 
                            fontSize: '13px',
                            marginTop: '1rem',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                            <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                            Make sure you trust this link before opening it.
                        </p>
                    </div>
                </Dialog>

                {/* QR Code Result Dialog - Simple */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-qrcode" style={{ color: '#10b981', fontSize: '1.5rem' }}></i>
                            <span>QR Code Scanned</span>
                        </div>
                    }
                    visible={qrResultDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setQrResultDialogVisible(false);
                        setScannedUrl('');
                    }}
                    footer={
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => {
                                    setQrResultDialogVisible(false);
                                    setScannedUrl('');
                                }}
                                severity="secondary"
                                size="small"
                                outlined
                            />
                            <Button
                                label="Open Link"
                                icon="pi pi-external-link"
                                onClick={() => {
                                    window.open(scannedUrl, '_blank');
                                    setQrResultDialogVisible(false);
                                    setScannedUrl('');
                                }}
                                severity="success"
                                size="small"
                            />
                        </div>
                    }
                >
                    <div style={{ 
                        padding: '1rem',
                        color: isDark ? '#e5e7eb' : '#1f2937'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            color: '#10b981',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            <i className="pi pi-check-circle"></i>
                            <span>QR Code Successfully Decoded!</span>
                        </div>
                        <p style={{ 
                            fontSize: '15px',
                            marginBottom: '1rem',
                            lineHeight: '1.6'
                        }}>
                            Detected link from QR code:
                        </p>
                        <div style={{
                            backgroundColor: isDark ? '#1e293b' : '#f0fdf4',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: `2px solid ${isDark ? '#10b981' : '#86efac'}`,
                            wordBreak: 'break-all',
                            fontSize: '13px',
                            color: isDark ? '#e5e7eb' : '#374151',
                            fontWeight: '600',
                            maxHeight: '100px',
                            overflowY: 'auto'
                        }}>
                            {scannedUrl}
                        </div>
                        <p style={{ 
                            fontSize: '13px',
                            marginTop: '1rem',
                            color: isDark ? '#9ca3af' : '#6b7280'
                        }}>
                            <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                            Click "Open Link" to visit this URL in a new tab.
                        </p>
                    </div>
                </Dialog>
                
                {/* QR Image Selection Dialog - When multiple QR images uploaded */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-qrcode" style={{ color: '#3b82f6', fontSize: '1.25rem' }}></i>
                            <span>Select QR Code to Scan</span>
                        </div>
                    }
                    visible={qrImageSelectionDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '550px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setQrImageSelectionDialogVisible(false);
                    }}
                >
                    <div style={{ 
                        padding: '1rem',
                        color: isDark ? '#e5e7eb' : '#1f2937'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1.5rem',
                            color: '#3b82f6',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            <i className="pi pi-info-circle"></i>
                            <span>Found {qrCodeImages.length} QR Code(s) - Select one to scan:</span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: deviceInfo.isMobile ? '1fr' : 'repeat(2, 1fr)',
                            gap: '1rem',
                            maxHeight: '500px',
                            overflowY: 'auto'
                        }}>
                            {qrCodeImages.map((qrItem, index) => (
                                <div
                                    key={qrItem.id}
                                    style={{
                                        backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}
                                    onClick={() => {
                                        setQrImageSelectionDialogVisible(false);
                                        handleScanQrCode(qrItem.imageUrl, qrItem.destinationUrl);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#3b82f6';
                                        e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#eff6ff';
                                        e.currentTarget.style.transform = 'scale(1.02)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = isDark ? '#334155' : '#e2e8f0';
                                        e.currentTarget.style.backgroundColor = isDark ? '#1e293b' : '#f8fafc';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }}
                                >
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '16px'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <img 
                                        src={qrItem.imageUrl} 
                                        alt={qrItem.title || `QR Code ${index + 1}`}
                                        style={{ 
                                            width: '100%',
                                            maxWidth: '200px',
                                            height: 'auto',
                                            border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                                            borderRadius: '8px',
                                            objectFit: 'contain'
                                        }} 
                                    />
                                    {qrItem.title && (
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            color: isDark ? '#e5e7eb' : '#1f2937',
                                            textAlign: 'center',
                                            maxWidth: '100%'
                                        }}>
                                            {qrItem.title}
                                        </div>
                                    )}
                                    {qrItem.destinationUrl && (
                                        <div style={{
                                            fontSize: '11px',
                                            wordBreak: 'break-all',
                                            color: isDark ? '#94a3b8' : '#64748b',
                                            textAlign: 'center',
                                            maxWidth: '100%'
                                        }}>
                                            {qrItem.destinationUrl}
                                        </div>
                                    )}
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#3b82f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        fontWeight: '600'
                                    }}>
                                        <i className="pi pi-search" style={{ fontSize: '11px' }}></i>
                                        <span>Click to scan</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ 
                            fontSize: '13px',
                            marginTop: '1.5rem',
                            color: isDark ? '#9ca3af' : '#6b7280',
                            textAlign: 'center'
                        }}>
                            <i className="pi pi-hand-pointer" style={{ marginRight: '0.5rem' }}></i>
                            Click on any QR code image to scan it
                        </p>
                    </div>
                </Dialog>
                
                {/* Save Preset Dialog */}
                <Dialog
                    header={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="pi pi-save" style={{ color: '#10b981', fontSize: '1.25rem' }}></i>
                            <span>Save Sort Preset</span>
                        </div>
                    }
                    visible={savePresetDialogVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '450px' }}
                    modal
                    dismissableMask
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => {
                        setSavePresetDialogVisible(false);
                        setPresetName('');
                    }}
                >
                    <div style={{ padding: '1rem' }}>
                        <p style={{ 
                            marginBottom: '1rem',
                            color: isDark ? '#e5e7eb' : '#1f2937',
                            fontSize: '14px'
                        }}>
                            Give your sort preset a name to save it for later use:
                        </p>
                        <InputText
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                            placeholder="Enter preset name..."
                            style={{ 
                                width: '100%',
                                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                                color: isDark ? '#ffffff' : '#000000',
                                border: isDark ? '1px solid #374151' : '1px solid #d1d5db',
                                marginBottom: '1rem'
                            }}
                            autoFocus
                        />
                        
                        {/* Public/Private Toggle */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                            borderRadius: '8px',
                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                            marginBottom: '1rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <i className={`pi ${presetIsPublic ? 'pi-eye' : 'pi-lock'}`} style={{ 
                                    color: presetIsPublic ? '#10b981' : '#94a3af',
                                    fontSize: '1rem'
                                }}></i>
                                <span style={{ 
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: isDark ? '#e5e7eb' : '#1f2937'
                                }}>
                                    {presetIsPublic ? 'Public' : 'Private'}
                                </span>
                                <span style={{
                                    fontSize: '12px',
                                    color: isDark ? '#9ca3af' : '#6b7280'
                                }}>
                                    {presetIsPublic ? '(visible to all users)' : '(only you can see this)'}
                                </span>
                            </div>
                            <div
                                onClick={() => setPresetIsPublic(!presetIsPublic)}
                                style={{
                                    width: '48px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    backgroundColor: presetIsPublic ? '#10b981' : (isDark ? '#4b5563' : '#d1d5db'),
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ffffff',
                                        position: 'absolute',
                                        top: '2px',
                                        left: presetIsPublic ? '26px' : '2px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}
                                ></div>
                            </div>
                        </div>
                        
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: isDark ? '#93c5fd' : '#1e40af'
                        }}>
                            <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                            Preset for route: <strong>{currentRouteName}</strong>
                        </div>
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        gap: '0.5rem', 
                        justifyContent: 'flex-end',
                        padding: '1rem',
                        borderTop: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                    }}>
                        <Button
                            label="Cancel"
                            icon="pi pi-times"
                            onClick={() => {
                                setSavePresetDialogVisible(false);
                                setPresetName('');
                            }}
                            severity="secondary"
                            size="small"
                            outlined
                        />
                        <Button
                            label="Save"
                            icon="pi pi-check"
                            onClick={handleSavePreset}
                            severity="success"
                            size="small"
                            disabled={!presetName.trim()}
                        />
                    </div>
                </Dialog>

                {/* View Saved Presets Dialog */}
                <Dialog
                    header={
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
                                Saved Sort Presets
                            </div>
                            <div style={{ fontSize: '11.5px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                                {currentRouteName}
                            </div>
                        </div>
                    }
                    visible={presetsListVisible}
                    style={{ width: deviceInfo.isMobile ? '95vw' : '600px' }}
                    modal
                    dismissableMask
                    closable={false}
                    transitionOptions={{ timeout: 300 }}
                    onHide={() => setPresetsListVisible(false)}
                >
                    <div style={{ padding: '1rem' }}>
                        {savedPresets.filter(p => p.routeId === currentRouteId).length === 0 ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '2rem',
                                color: isDark ? '#9ca3af' : '#6b7280'
                            }}>
                                <i className="pi pi-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
                                <p>No saved presets for this route yet.</p>
                                <p style={{ fontSize: '13px', marginTop: '0.5rem' }}>
                                    Use "Set Order" and click "Save Preset" to save your custom sort orders.
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {savedPresets
                                    .filter(preset => preset.routeId === currentRouteId)
                                    .map((preset) => {
                                    const speedDialItems = [
                                        {
                                            label: 'Apply',
                                            icon: 'pi pi-play',
                                            command: () => handleApplyPreset(preset)
                                        },
                                        {
                                            label: 'Edit',
                                            icon: 'pi pi-pencil',
                                            command: () => handleEditPreset(preset)
                                        },
                                        {
                                            label: preset.isPublic ? 'Make Private' : 'Make Public',
                                            icon: preset.isPublic ? 'pi pi-lock' : 'pi pi-eye',
                                            command: () => handleTogglePresetVisibility(preset)
                                        },
                                        {
                                            label: 'Delete',
                                            icon: 'pi pi-trash',
                                            command: () => handleDeletePreset(preset.id)
                                        }
                                    ];
                                    
                                    return (
                                        <div 
                                            key={preset.id}
                                            style={{
                                                backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                                                border: `2px solid ${preset.isPublic ? '#10b981' : (isDark ? '#374151' : '#e5e7eb')}`,
                                                borderRadius: '12px',
                                                padding: '1rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = isDark ? '#374151' : '#f3f4f6';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = isDark ? '#1f2937' : '#f9fafb';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    <i className={`pi ${preset.isPublic ? 'pi-eye' : 'pi-lock'}`} style={{ 
                                                        fontSize: '0.875rem',
                                                        color: preset.isPublic ? '#10b981' : '#94a3af'
                                                    }}></i>
                                                    <div style={{ 
                                                        fontWeight: 'bold',
                                                        fontSize: '15px',
                                                        color: isDark ? '#e5e7eb' : '#1f2937'
                                                    }}>
                                                        {preset.name}
                                                    </div>
                                                    {preset.isPublic && (
                                                        <span style={{
                                                            fontSize: '10px',
                                                            fontWeight: '600',
                                                            padding: '2px 6px',
                                                            backgroundColor: '#10b981',
                                                            color: '#ffffff',
                                                            borderRadius: '4px'
                                                        }}>
                                                            PUBLIC
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '12px',
                                                    color: isDark ? '#9ca3af' : '#6b7280'
                                                }}>
                                                    Route: <strong>{preset.routeName}</strong>
                                                </div>
                                                <div style={{ 
                                                    fontSize: '11px',
                                                    color: isDark ? '#9ca3af' : '#6b7280',
                                                    marginTop: '0.25rem'
                                                }}>
                                                    {Object.values(preset.sortOrders).filter(o => o !== '' && o !== undefined).length} items sorted • {new Date(preset.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <SpeedDial
                                                model={speedDialItems}
                                                direction="left"
                                                showIcon="pi pi-bars"
                                                hideIcon="pi pi-times"
                                                className="preset-speeddial"
                                                buttonClassName="preset-speeddial-btn"
                                                style={{ position: 'relative' }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        padding: '1rem',
                        borderTop: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
                    }}>
                        <Button
                            label="Close"
                            icon="pi pi-times"
                            onClick={() => setPresetsListVisible(false)}
                            severity="danger"
                            size="small"
                            outlined
                        />
                    </div>
                </Dialog>
                
                {/* Marker Color Picker Dialog */}
                <MarkerColorPicker
                    visible={colorPickerVisible}
                    onHide={() => {
                        setColorPickerVisible(false);
                        setColorPickerRowId(null);
                        setColorPickerLocationName('');
                    }}
                    currentColor={
                        colorPickerRowId 
                            ? (dialogData.find(d => d.id === colorPickerRowId)?.markerColor || '#dc3545')
                            : '#dc3545'
                    }
                    onColorChange={handleMarkerColorChange}
                    locationName={colorPickerLocationName}
                />

                {/* Action Confirmation Modal */}
                <Dialog
                    visible={actionConfirmVisible}
                    onHide={() => setActionConfirmVisible(false)}
                    style={{ width: deviceInfo.isMobile ? '90vw' : '450px' }}
                    modal
                    dismissableMask
                    closable={false}
                >
                    <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.5rem',
                        padding: '1rem'
                    }}>
                        {/* Icon */}
                        <div style={{
                            width: '80px',
                            height: '80px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {actionConfirmData.icon.startsWith('pi-') ? (
                                <i 
                                    className={`pi ${actionConfirmData.icon}`}
                                    style={{ 
                                        fontSize: '4rem',
                                        color: actionConfirmData.buttonColor
                                    }}
                                ></i>
                            ) : (
                                <img 
                                    src={actionConfirmData.icon}
                                    alt="Action Icon"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                        </div>
                        
                        {/* Title */}
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: isDark ? '#f1f5f9' : '#1e293b'
                        }}>
                            {actionConfirmData.title}
                        </div>
                        
                        {/* Message */}
                        <div style={{
                            fontSize: '1rem',
                            textAlign: 'center',
                            color: isDark ? '#94a3b8' : '#64748b'
                        }}>
                            {actionConfirmData.message}
                        </div>
                        
                        {/* Details */}
                        {Object.keys(actionConfirmData.details).length > 0 && (
                            <div style={{
                                width: '100%',
                                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                                borderRadius: '8px',
                                padding: '1rem',
                                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`
                            }}>
                                {Object.entries(actionConfirmData.details).map(([key, value]) => (
                                    <div key={key} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span style={{ 
                                            fontWeight: '600',
                                            color: isDark ? '#94a3b8' : '#64748b'
                                        }}>
                                            {key}:
                                        </span>
                                        <span style={{ 
                                            fontWeight: '500',
                                            color: isDark ? '#e2e8f0' : '#1e293b',
                                            marginLeft: '1rem',
                                            textAlign: 'right',
                                            wordBreak: 'break-all'
                                        }}>
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {/* Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '0.75rem',
                            width: '100%',
                            marginTop: '0.5rem'
                        }}>
                            <Button
                                label="Cancel"
                                icon="pi pi-times"
                                onClick={() => setActionConfirmVisible(false)}
                                severity="secondary"
                                outlined
                                style={{ flex: 1 }}
                            />
                            <Button
                                label={actionConfirmData.buttonLabel}
                                icon="pi pi-check"
                                onClick={() => {
                                    if (actionConfirmData.action) {
                                        actionConfirmData.action();
                                    }
                                    setActionConfirmVisible(false);
                                }}
                                style={{ 
                                    flex: 1,
                                    backgroundColor: actionConfirmData.buttonColor,
                                    borderColor: actionConfirmData.buttonColor
                                }}
                            />
                        </div>
                    </div>
                </Dialog>

            </div>
            
            {/* Device Info Footer */}
            <div style={{
                position: 'fixed',
                bottom: '1rem',
                left: '1rem',
                backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(224, 242, 254, 0.95)',
                border: `1px solid ${isDark ? '#334155' : 'rgba(6, 182, 212, 0.3)'}`,
                borderRadius: '12px',
                padding: '0.75rem 1rem',
                boxShadow: isDark ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(6, 182, 212, 0.15)',
                zIndex: 100,
                backdropFilter: 'blur(8px)',
                fontSize: '0.75rem',
                color: isDark ? '#9ca3af' : '#0e7490',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={`pi ${deviceInfo.isMobile ? 'pi-mobile' : deviceInfo.isTablet ? 'pi-tablet' : 'pi-desktop'}`} 
                       style={{ fontSize: '1rem', color: isDark ? '#60a5fa' : '#0891b2' }}></i>
                    <span style={{ color: isDark ? '#e5e7eb' : '#0c4a6e', fontWeight: '700' }}>
                        {deviceInfo.deviceType.toUpperCase()}
                    </span>
                </div>
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span>{deviceInfo.screenWidth} × {deviceInfo.screenHeight}</span>
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span style={{ 
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                }}>
                    <i className={`pi ${deviceInfo.orientation === 'portrait' ? 'pi-arrow-up' : 'pi-arrow-right'}`} 
                       style={{ fontSize: '0.75rem' }}></i>
                    {deviceInfo.orientation}
                </span>
                {deviceInfo.touchSupport && (
                    <>
                        <div style={{ 
                            width: '1px', 
                            height: '16px', 
                            backgroundColor: isDark ? '#475569' : '#d1d5db' 
                        }}></div>
                        <i className="pi pi-hand-pointer" style={{ fontSize: '0.875rem', color: '#10b981' }} title="Touch Enabled"></i>
                    </>
                )}
                <div style={{ 
                    width: '1px', 
                    height: '16px', 
                    backgroundColor: isDark ? '#475569' : '#d1d5db' 
                }}></div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <i className="pi pi-globe" style={{ fontSize: '0.75rem' }}></i>
                    {deviceInfo.browserInfo.name}
                </span>
            </div>
        </div>
    );
}
