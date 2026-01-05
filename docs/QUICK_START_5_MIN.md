# 🗺️ GOOGLE MAP - GET STARTED IN 5 MINUTES

## Step 1: Copy This Code ⬇️

```jsx
import GoogleMapView from './components/GoogleMapView';
import './google-map.css';
import { useState } from 'react';

export default function MyMapPage() {
  const [locations] = useState([
    {
      id: 1,
      code: 'KL-001',
      location: 'Kuala Lumpur HQ',
      address: '123 Main Street, KL',
      latitude: 3.1390,
      longitude: 101.6869,
      warehouse: 'Main'
    },
    {
      id: 2,
      code: 'PJ-001',
      location: 'Petaling Jaya Branch',
      address: '456 Branch Road, PJ',
      latitude: 3.3206,
      longitude: 101.5807,
      warehouse: 'Branch'
    }
  ]);

  return (
    <div>
      <h1>📍 Location Map</h1>
      <GoogleMapView 
        locations={locations}
        showSearch={true}
        showInfo={true}
      />
    </div>
  );
}
```

## Step 2: Replace Sample Data ✏️

Replace the `locations` array with YOUR location data:

```jsx
const [locations] = useState([
  {
    code: 'YOUR-CODE',
    location: 'Your Location Name',
    address: 'Your Street Address',
    latitude: YOUR_LAT,  // e.g., 3.139
    longitude: YOUR_LNG, // e.g., 101.687
    warehouse: 'Your Warehouse'
  }
]);
```

## Step 3: Add to Your Component 🎯

Put this in your component where you want the map:

```jsx
<GoogleMapView 
  locations={locations}
  showSearch={true}
  showInfo={true}
/>
```

## Done! 🎉

Map is ready to use. Test it in your browser.

---

## Common Issues & Quick Fixes

### Map not showing?
✓ Check CSS is imported: `import './google-map.css';`

### Markers not visible?
✓ Check each location has `latitude` and `longitude` as numbers

### Search not working?
✓ Check locations have `location`, `address`, or `code` fields

---

## Next Steps

Want more? Check these:

📖 **Full Setup Guide:** `docs/GOOGLE_MAP_SETUP.md`
📚 **More Examples:** `docs/GOOGLE_MAP_QUICK_REF.md`
🎓 **Advanced Features:** `docs/GOOGLE_MAP_ADVANCED.md`
🔧 **Integration Tips:** `docs/GOOGLE_MAP_INTEGRATION_GUIDE.md`

---

## Malaysia Coordinates Reference

```javascript
// Copy-paste these for testing:
const CITIES = {
  KL: { lat: 3.1390, lng: 101.6869 },
  PJ: { lat: 3.3206, lng: 101.5807 },
  Shah: { lat: 3.0673, lng: 101.5413 },
  SJ: { lat: 3.0433, lng: 101.6033 },
  Ipoh: { lat: 4.5921, lng: 101.0901 }
};
```

---

**That's it! You're ready.** 🚀
