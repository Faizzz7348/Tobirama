# 📚 COMPLETE PROJECT GUIDE - Tobirama Database & API Setup

**Status:** ✅ Production Ready  
**Date:** January 6, 2026  
**Version:** 1.0.0  

---

## 🎯 Project Overview

Complete database migration and API setup for Tobirama application with:
- **Database:** Neon PostgreSQL
- **Image Upload:** ImgBB
- **Backend:** Vercel Serverless Functions
- **Frontend:** React + PrimeReact

---

## 📋 TABLE OF CONTENTS

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Database Migration](#database-migration)
4. [Testing](#testing)
5. [Frontend Integration](#frontend-integration)
6. [Troubleshooting](#troubleshooting)
7. [Deployment](#deployment)

---

## 📊 DATABASE SCHEMA

### Route Table

| Column | Type | Required | Purpose |
|--------|------|----------|---------|
| id | integer | ✅ | Primary Key |
| route | text | ✅ | Route name (e.g., "KL 7") |
| shift | text | ✅ | Shift (e.g., "PM", "AM") |
| warehouse | text | ✅ | Warehouse code |
| description | text | ❌ | Route description |
| createdAt | timestamp | ✅ | Creation time |
| updatedAt | timestamp | ✅ | Last update time |

### Location Table

| Column | Type | Required | Purpose |
|--------|------|----------|---------|
| id | integer | ✅ | Primary Key |
| routeId | integer | ✅ | Foreign Key (Route) |
| location | text | ✅ | Location name |
| code | text | ❌ | Location code |
| no | integer | ❌ | Location number |
| delivery | text | ❌ | Delivery type |
| powerMode | text | ❌ | Power mode |
| latitude | double | ❌ | Latitude coordinate |
| longitude | double | ❌ | Longitude coordinate |
| address | text | ❌ | Full address |
| description | text | ❌ | Location description |
| images | TEXT[] | ❌ | Image URLs array |
| websiteLink | text | ❌ | Website URL |
| qrCodeImageUrl | text | ❌ | QR code image URL |
| qrCodeDestinationUrl | text | ❌ | QR code destination URL |
| createdAt | timestamp | ✅ | Creation time |
| updatedAt | timestamp | ✅ | Last update time |

---

## 🔌 API ENDPOINTS

### Routes API

#### GET /api/routes
Get all routes

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "route": "KL 7",
    "shift": "PM",
    "warehouse": "3AVK04",
    "description": "Main delivery route",
    "createdAt": "2026-01-06T00:00:00Z",
    "updatedAt": "2026-01-06T00:00:00Z"
  }
]
```

#### GET /api/routes?id=1
Get single route with locations

**Response (200 OK):**
```json
{
  "route": {
    "id": 1,
    "route": "KL 7",
    "shift": "PM",
    "warehouse": "3AVK04",
    "description": "Main delivery route",
    "createdAt": "2026-01-06T00:00:00Z",
    "updatedAt": "2026-01-06T00:00:00Z"
  },
  "locations": [
    {
      "id": 1,
      "routeId": 1,
      "location": "KLCC Tower",
      "latitude": 3.1690,
      "longitude": 101.7123,
      "description": "Shopping mall",
      "images": ["https://imgbb.com/abc.jpg"]
    }
  ]
}
```

#### POST /api/routes
Create new route

**Request:**
```json
{
  "route": "KL 7",
  "shift": "PM",
  "warehouse": "3AVK04",
  "description": "Main delivery route"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "route": "KL 7",
  "shift": "PM",
  "warehouse": "3AVK04",
  "description": "Main delivery route",
  "createdAt": "2026-01-06T00:00:00Z",
  "updatedAt": "2026-01-06T00:00:00Z"
}
```

#### PUT /api/routes?id=1
Update route

**Request:**
```json
{
  "route": "KL 7",
  "shift": "AM",
  "warehouse": "3AVK04",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "route": "KL 7",
  "shift": "AM",
  "warehouse": "3AVK04",
  "description": "Updated description",
  "updatedAt": "2026-01-06T01:00:00Z"
}
```

#### DELETE /api/routes?id=1
Delete route (cascades to locations)

**Response (200 OK):**
```json
{
  "success": true,
  "id": 1
}
```

---

### Locations API

#### GET /api/locations
Get all locations

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "routeId": 1,
    "location": "KLCC Tower",
    "code": "KL01",
    "latitude": 3.1690,
    "longitude": 101.7123,
    "description": "Shopping mall",
    "images": ["https://imgbb.com/img1.jpg"],
    "address": "Kuala Lumpur City Centre"
  }
]
```

#### GET /api/locations?id=1
Get single location

**Response (200 OK):**
```json
{
  "id": 1,
  "routeId": 1,
  "location": "KLCC Tower",
  "code": "KL01",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Shopping mall",
  "images": ["https://imgbb.com/img1.jpg"],
  "address": "Kuala Lumpur City Centre",
  "createdAt": "2026-01-06T00:00:00Z",
  "updatedAt": "2026-01-06T00:00:00Z"
}
```

#### POST /api/locations
Create location

**Request:**
```json
{
  "routeId": 1,
  "location": "KLCC Tower",
  "code": "KL01",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Shopping mall",
  "address": "Kuala Lumpur City Centre"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "routeId": 1,
  "location": "KLCC Tower",
  "code": "KL01",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Shopping mall",
  "images": [],
  "address": "Kuala Lumpur City Centre",
  "createdAt": "2026-01-06T00:00:00Z",
  "updatedAt": "2026-01-06T00:00:00Z"
}
```

#### POST /api/locations?id=1&imageUrl=...
Add image to location

**Request:**
```json
{
  "imageUrl": "https://imgbb.com/image.jpg"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "routeId": 1,
  "location": "KLCC Tower",
  "images": ["https://imgbb.com/image.jpg"],
  "updatedAt": "2026-01-06T01:00:00Z"
}
```

#### PUT /api/locations?id=1
Update location

**Request:**
```json
{
  "location": "KLCC Tower",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "routeId": 1,
  "location": "KLCC Tower",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Updated description",
  "updatedAt": "2026-01-06T01:00:00Z"
}
```

#### DELETE /api/locations?id=1
Delete location

**Response (200 OK):**
```json
{
  "success": true,
  "id": 1
}
```

#### DELETE /api/locations?id=1&imageUrl=...
Remove image from location

**Response (200 OK):**
```json
{
  "id": 1,
  "location": "KLCC Tower",
  "images": [],
  "updatedAt": "2026-01-06T01:05:00Z"
}
```

---

## 🔧 DATABASE MIGRATION

### Create Tables (SQL)

```sql
-- Create Route table
CREATE TABLE IF NOT EXISTS "Route" (
  id SERIAL PRIMARY KEY,
  route TEXT NOT NULL,
  shift TEXT NOT NULL,
  warehouse TEXT NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Location table
CREATE TABLE IF NOT EXISTS "Location" (
  id SERIAL PRIMARY KEY,
  "routeId" INTEGER NOT NULL REFERENCES "Route"(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  code TEXT,
  no INTEGER,
  delivery TEXT,
  "powerMode" TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  "websiteLink" TEXT,
  "qrCodeImageUrl" TEXT,
  "qrCodeDestinationUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_location_routeId ON "Location"("routeId");
CREATE INDEX idx_route_name ON "Route"(route);
CREATE INDEX idx_location_name ON "Location"(location);
```

### Verify Migration

```sql
-- Check Route table
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'Route' ORDER BY ordinal_position;

-- Check Location table
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'Location' ORDER BY ordinal_position;

-- Count records
SELECT COUNT(*) FROM "Route";
SELECT COUNT(*) FROM "Location";
```

---

## 🧪 TESTING

### Browser Console Tests

#### Test Routes API

```javascript
// Get all routes
fetch('/api/routes')
  .then(r => r.json())
  .then(data => console.log('Routes:', data))
  .catch(e => console.error('Error:', e));

// Get single route with locations
fetch('/api/routes?id=1')
  .then(r => r.json())
  .then(data => console.log('Route with locations:', data))
  .catch(e => console.error('Error:', e));

// Create route
fetch('/api/routes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    route: 'KL 7',
    shift: 'PM',
    warehouse: '3AVK04',
    description: 'Test route'
  })
})
.then(r => r.json())
.then(data => console.log('Created:', data))
.catch(e => console.error('Error:', e));
```

#### Test Locations API

```javascript
// Get all locations
fetch('/api/locations')
  .then(r => r.json())
  .then(data => console.log('Locations:', data))
  .catch(e => console.error('Error:', e));

// Create location
fetch('/api/locations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    routeId: 1,
    location: 'KLCC Tower',
    latitude: 3.1690,
    longitude: 101.7123,
    description: 'Shopping mall'
  })
})
.then(r => r.json())
.then(data => console.log('Created:', data))
.catch(e => console.error('Error:', e));

// Add image
fetch('/api/locations?id=1&imageUrl=https://imgbb.com/image.jpg', {
  method: 'POST'
})
.then(r => r.json())
.then(data => console.log('Image added:', data))
.catch(e => console.error('Error:', e));
```

---

## 🎨 FRONTEND INTEGRATION

### CustomerService.js Methods

```javascript
// Get routes
const routes = await CustomerService.getRoutes();

// Get locations
const locations = await CustomerService.getDetailData();

// Update route
await CustomerService.updateRoute(routeId, {
  route: 'KL 7',
  shift: 'AM',
  description: 'Updated'
});

// Update location
await CustomerService.updateLocation(locationId, {
  location: 'KLCC Tower',
  description: 'Updated'
});

// Add image
await CustomerService.addImageToLocation(locationId, imageUrl);

// Remove image
await CustomerService.removeImageFromLocation(locationId, imageUrl);
```

### DescriptionEditor Component

```jsx
import { DescriptionEditor } from './components/DescriptionEditor';

export function MyComponent() {
  return (
    <DescriptionEditor 
      itemId={1}
      itemType="location" // or "route"
      currentDescription="Current description"
      itemName="Location Name"
      onSave={(result) => console.log('Saved:', result)}
      onError={(error) => console.error('Error:', error)}
    />
  );
}
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Column does not exist"
**Cause:** Database schema mismatch  
**Solution:** Verify schema with diagnostic queries

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'Location' ORDER BY ordinal_position;
```

### Issue: "Cannot POST /api/routes"
**Cause:** API not deployed or endpoint incorrect  
**Solution:** 
1. Check Vercel deployment status
2. Verify files in `/api/` folder
3. Check Vercel function logs

### Issue: "Database not connected"
**Cause:** DATABASE_URL environment variable missing  
**Solution:**
1. Verify `.env` has DATABASE_URL
2. Check Vercel project settings → Environment Variables
3. Restart deployment

### Issue: "Foreign key constraint"
**Cause:** Trying to delete route with locations  
**Solution:** Use DELETE which cascades to locations

### Issue: Images not saving
**Cause:** Images array format incorrect  
**Solution:** Ensure images is TEXT[] type in database

---

## 🚀 DEPLOYMENT

### Vercel Deployment Steps

1. **Push code to GitHub**
```bash
git add -A
git commit -m "feat: database and API setup"
git push origin main
```

2. **Vercel auto-detects `/api/` folder**
   - Creates serverless functions
   - Deploys automatically

3. **Monitor deployment**
   - Vercel Dashboard → Deployments
   - Check Function Logs for errors

4. **Test endpoints**
```bash
curl https://your-app.vercel.app/api/routes
curl https://your-app.vercel.app/api/locations
```

### Environment Variables (Vercel)

Set in Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require&channel_binding=require
VITE_DATABASE_URL=same_as_above
VITE_API_URL=/api
VITE_IMGBB_API_KEY=your_api_key
```

---

## 📚 FILES STRUCTURE

```
/workspaces/Tobirama/
├── api/
│   ├── routes.js          ✅ Routes CRUD API
│   └── locations.js       ✅ Locations CRUD API
├── src/
│   ├── components/
│   │   ├── DescriptionEditor.jsx      ✅ Edit descriptions
│   │   └── EditableDescriptionList.jsx
│   ├── service/
│   │   └── CustomerService.js         ✅ API calls
│   └── hooks/
│       └── useImageUpload.js
├── prisma/
│   └── schema.prisma      ✅ Database schema reference
├── migrations/
│   └── 001_add_description_and_images.sql
└── COMPLETE_GUIDE.md      ✅ THIS FILE
```

---

## ✅ CHECKLIST

- [x] Database tables created (Route, Location)
- [x] Columns verified and correct
- [x] API endpoints implemented
- [x] Vercel serverless functions working
- [x] Frontend services updated
- [x] Components created
- [x] Testing guide provided
- [x] Deployment instructions complete

---

## 📞 SUPPORT

For issues or questions:
1. Check [TROUBLESHOOTING](#troubleshooting) section
2. Review API endpoint examples
3. Check Vercel Function Logs
4. Verify database schema

---

**Last Updated:** January 6, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0

Made with ❤️ for efficient development
