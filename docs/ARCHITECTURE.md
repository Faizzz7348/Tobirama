# 🗺️ Google Map Architecture & Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Your Application                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Your Component                                  │   │
│  │  ┌────────────────────────────────────────────────────┐  │   │
│  │  │                                                    │  │   │
│  │  │  <GoogleMapView                                   │  │   │
│  │  │    locations={data}                               │  │   │
│  │  │    onLocationSelect={handler}                     │  │   │
│  │  │  />                                               │  │   │
│  │  │                                                    │  │   │
│  │  └────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             △                                     │
│                             │                                     │
└─────────────────────────────┼─────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
         ┌──────────▼──────────┐  ┌────▼──────────────┐
         │  GoogleMapView.jsx  │  │  google-map.css   │
         │                     │  │  google-map-      │
         │  - MapContainer     │  │  styles.css       │
         │  - Markers          │  │                   │
         │  - Search           │  │  - Styling        │
         │  - Popup            │  │  - Responsive     │
         │  - Fullscreen       │  │  - Dark Mode      │
         │  - Info Panel       │  │  - Animations     │
         └─────────┬──────────┘  └───────────────────┘
                   │
         ┌─────────▼─────────────────────────┐
         │   React Leaflet Libraries         │
         ├───────────────────────────────────┤
         │ - react-leaflet (^4.2.1)          │
         │ - leaflet (^1.9.4)                │
         │ - primereact (^10.5.1)            │
         │ - react (^18.2.0)                 │
         └─────────┬──────────────────────┘
                   │
         ┌─────────▼───────────┐
         │  OpenStreetMap API  │
         │  (Free Map Data)    │
         └─────────────────────┘
```

---

## Component Structure

### GoogleMapView
```
GoogleMapView
├── MapContainer
│   ├── TileLayer (OpenStreetMap)
│   ├── MapUpdater (controls zoom/center)
│   ├── Markers
│   │   ├── Marker (custom icon)
│   │   └── Popup (location details)
│   └── ZoomControl
├── Search Bar
├── Fullscreen Button
└── Info Panel
```

### DataTableWithMap
```
DataTableWithMap
├── Toast (notifications)
├── Header (title + map button)
├── DataTable
│   └── Columns (code, location, address, coordinates, warehouse, actions)
├── Selected Location Details
└── Map Modal (Dialog)
    └── GoogleMapView
```

---

## Data Flow

```
User Data
    │
    ▼
┌─────────────────┐
│  Prepare Data   │
│  (validate)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  GoogleMapView          │
│  (locations prop)       │
└────────┬────────────────┘
         │
         ├──────────────────┬──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌────────┐         ┌────────┐        ┌──────────┐
    │ Search │         │Markers │        │Fullscreen│
    └───┬────┘         └───┬────┘        └────┬─────┘
        │                  │                   │
        ▼                  ▼                   ▼
    Filter Data     Click to Select      Open Dialog
        │                  │                   │
        └──────┬───────────┴───────────────────┘
               │
               ▼
        onLocationSelect
        (callback)
               │
               ▼
        Update Parent State
```

---

## File Dependencies

```
GoogleMapView.jsx
├── react (useState, useEffect)
├── primereact (Dialog, Button, InputText, Card)
├── leaflet (L, MapContainer, TileLayer, Marker, Popup)
├── react-leaflet (MapContainer, TileLayer, Marker, Popup, useMap)
└── google-map.css

GoogleMapDemo.jsx
├── react (useState)
├── GoogleMapView
├── primereact (Card)
├── google-map.css
└── Sample location data

DataTableWithMap.jsx
├── react (useState, useRef)
├── primereact (DataTable, Column, Button, Dialog, Card, Toast)
├── GoogleMapView
├── google-map.css
└── Integration pattern

google-map.css
└── All styling rules

google-map-styles.css
└── Additional styling & utilities
```

---

## Technology Stack

```
Frontend Framework
├── React (^18.2.0)
└── Vite (build tool)

UI Libraries
├── PrimeReact (^10.5.1)
│   ├── DataTable
│   ├── Dialog/Modal
│   ├── Buttons
│   └── Toast
└── PrimeIcons (^7.0.0)
    └── Icons for UI

Mapping
├── Leaflet (^1.9.4)
│   ├── Core map library
│   ├── Markers
│   ├── Popups
│   └── Controls
└── React-Leaflet (^4.2.1)
    ├── React components wrapper
    ├── MapContainer
    ├── TileLayer
    └── Marker, Popup

Data & Storage
├── Prisma (for your DB)
└── Your API endpoints

CSS
└── Modern CSS3
    ├── Flexbox
    ├── Grid
    ├── Media queries
    └── CSS animations
```

---

## Component Props Interface

```
GoogleMapView Props:
├── locations: Array<Location>
│   └── Required: latitude, longitude
│   └── Optional: code, location, address, warehouse, ...
├── onLocationSelect?: (location: Location) => void
├── showSearch?: Boolean (default: true)
├── showInfo?: Boolean (default: true)
└── fullscreen?: Boolean (default: false)

Location Object:
├── id?: Number
├── code?: String
├── location?: String
├── address?: String
├── latitude: Number (REQUIRED)
├── longitude: Number (REQUIRED)
├── warehouse?: String
└── ...other custom fields
```

---

## State Management

```
Component State

GoogleMapView:
├── fullscreenVisible: Boolean (modal open/closed)
├── addressExpanded: Boolean (expand address)
├── searchValue: String (search query)
├── selectedLocation: Object (currently selected)
├── mapCenter: {lat, lng} (map center coordinates)
└── zoomLevel: Number (current zoom)

DataTableWithMap:
├── selectedRows: Array (selected table rows)
├── mapVisible: Boolean (map modal visible)
└── selectedLocation: Object (selected location)
```

---

## CSS Architecture

```
google-map.css + google-map-styles.css

├── Reset & Base Styles
├── Map Container
├── Marker Styling
├── Popup Styling
├── Control Buttons
├── Info Panel
├── Search Bar
├── Location Cards
├── Tables
├── Responsive Design
│   ├── Desktop (> 768px)
│   ├── Tablet (480-768px)
│   └── Mobile (< 480px)
├── Dark Mode
├── Print Styles
├── Animations
│   ├── Fade in
│   ├── Popup enter
│   └── Bounce
└── Accessibility
    ├── Focus states
    └── High contrast
```

---

## Integration Patterns

### Pattern 1: Standalone
```
YourComponent
    └── GoogleMapView
```

### Pattern 2: With Dialog
```
YourComponent
├── Dialog
│   └── GoogleMapView
└── Button (open dialog)
```

### Pattern 3: With DataTable
```
YourComponent
├── DataTable
└── Dialog
    └── GoogleMapView
```

### Pattern 4: Dashboard
```
Dashboard
├── GoogleMapView (main offices)
├── GoogleMapView (branches)
└── GoogleMapView (hubs)
```

---

## Data Flow Examples

### Example 1: Simple Selection
```
User clicks marker
    ↓
GoogleMapView captures click
    ↓
Calls onLocationSelect callback
    ↓
Parent component updates state
    ↓
Display selected location info
```

### Example 2: Search Filter
```
User types in search
    ↓
GoogleMapView filters locations
    ↓
Updates displayed markers
    ↓
Shows result count
```

### Example 3: Fullscreen Mode
```
User clicks fullscreen button
    ↓
GoogleMapView opens Dialog
    ↓
Displays expanded map
    ↓
User closes dialog
    ↓
Returns to normal view
```

---

## Performance Considerations

```
Optimization Strategies

1. Rendering
   ├── React.memo for components
   ├── useMemo for computed values
   └── useCallback for handlers

2. Data
   ├── Filter locations before passing
   ├── Cache API responses
   └── Pagination for large datasets

3. Map
   ├── Lazy load map component
   ├── Marker clustering for 100+ markers
   └── Debounce search input

4. CSS
   ├── Minified in production
   ├── Hardware-accelerated animations
   └── Optimized media queries
```

---

## Browser Compatibility

```
✅ Chrome/Edge (Latest 2 versions)
✅ Firefox (Latest 2 versions)
✅ Safari (Latest 2 versions)
✅ Mobile Browsers
   ├── Chrome Mobile
   ├── Safari iOS
   └── Firefox Android
```

---

## Deployment Architecture

```
Development
├── npm run dev
├── Vite dev server
└── Hot reload

Production
├── npm run build
├── dist/ folder
├── Static assets
└── CDN ready
```

---

## File Size Impact

```
Components
├── GoogleMapView.jsx       ~10 KB
├── GoogleMapDemo.jsx       ~5 KB
└── DataTableWithMap.jsx    ~8 KB

Styles
├── google-map.css          ~15 KB
└── google-map-styles.css   ~18 KB

Total Package Size: ~56 KB (uncompressed)
Gzip Compressed: ~15-18 KB

Dependencies (already installed)
├── leaflet              ~40 KB
├── react-leaflet        ~10 KB
└── primereact           ~300 KB
```

---

## API Integration Points

```
Your Application
    │
    ├──────────────────────────────────┐
    │                                  │
    ▼                                  ▼
Fetch Locations              Real-time Updates
    │                                  │
    ├─ /api/locations          ├─ WebSocket
    ├─ /api/warehouses         ├─ SSE (Server-Sent Events)
    ├─ /api/deliveries         └─ Polling
    └─ Transform data
         │
         ▼
    GoogleMapView
```

---

## Security Considerations

```
✅ No sensitive data in coordinates
✅ API responses validated
✅ User input sanitized (search)
✅ XSS protection (React escaping)
✅ CORS handled by backend
✅ No authentication required for map
```

---

## Future Enhancement Points

```
Advanced Features (Not Implemented Yet)
├── Marker Clustering
│   └── For 100+ markers
├── Route Drawing
│   └── Connect multiple locations
├── Heatmap Layer
│   └── Visualize data density
├── Real-time Updates
│   └── WebSocket integration
├── Geolocation
│   └── User location detection
├── Offline Support
│   └── Cached tiles
├── Advanced Search
│   └── Autocomplete, filters
└── Custom Overlays
    └── Shapes, polygons
```

---

**Architecture Last Updated:** December 30, 2025
**Status:** ✅ PRODUCTION READY
