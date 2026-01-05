# 🧪 Complete Testing Guide - Database Migration & API Integration

**Date:** January 5, 2026  
**Status:** ✅ All features ready for testing  
**Database:** Neon PostgreSQL  
**Image Upload:** ImgBB  

---

## 📋 Quick Test Checklist

### ✅ Level 1: Database Verification
- [ ] Tables exist: Route, Location
- [ ] Columns added: description, images
- [ ] Primary keys work correctly
- [ ] Foreign key relationships work

### ✅ Level 2: API Endpoints
- [ ] GET /api/routes
- [ ] POST /api/routes
- [ ] PUT /api/routes/:id
- [ ] DELETE /api/routes/:id
- [ ] GET /api/locations
- [ ] POST /api/locations
- [ ] PUT /api/locations/:id
- [ ] DELETE /api/locations/:id
- [ ] POST /api/locations/:id/images
- [ ] DELETE /api/locations/:id/images

### ✅ Level 3: Frontend Service
- [ ] CustomerService methods work
- [ ] Cache management works
- [ ] Error handling works

### ✅ Level 4: UI Components
- [ ] Description editor renders
- [ ] Form validation works
- [ ] Images upload correctly
- [ ] Images display correctly

### ✅ Level 5: Full Integration
- [ ] Create route with description
- [ ] Create location with description
- [ ] Edit route description
- [ ] Edit location description
- [ ] Upload image to location
- [ ] Delete image from location
- [ ] Verify persistence (refresh page)

---

## 🔧 Manual Testing (Browser Console)

### Test 1: Fetch All Routes
```javascript
fetch('/api/routes')
  .then(r => r.json())
  .then(data => console.log('✅ Routes:', data))
  .catch(e => console.error('❌ Error:', e));
```

### Test 2: Create Route with Description
```javascript
fetch('/api/routes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Route',
    description: 'This is a test route description'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Created:', data))
.catch(e => console.error('❌ Error:', e));
```

### Test 3: Update Route Description
```javascript
const routeId = 1; // Replace with actual ID
fetch(`/api/routes/${routeId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    description: 'Updated description'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Updated:', data))
.catch(e => console.error('❌ Error:', e));
```

### Test 4: Create Location with Description
```javascript
fetch('/api/locations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    routeId: 1,
    name: 'Test Location',
    latitude: 3.1390,
    longitude: 101.6869,
    description: 'Test location description'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Created:', data))
.catch(e => console.error('❌ Error:', e));
```

### Test 5: Add Image to Location
```javascript
const locationId = 1; // Replace with actual ID
fetch(`/api/locations/${locationId}/images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://example.com/image.jpg'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Image added:', data))
.catch(e => console.error('❌ Error:', e));
```

### Test 6: Get Location with Images
```javascript
const locationId = 1;
fetch(`/api/locations/${locationId}`)
  .then(r => r.json())
  .then(data => console.log('✅ Location:', data))
  .catch(e => console.error('❌ Error:', e));
```

---

## 🧬 API Request/Response Examples

### Routes API

#### GET /api/routes
**Response:**
```json
[
  {
    "id": 1,
    "name": "KL 7",
    "description": "Morning delivery route",
    "createdAt": "2026-01-05T10:00:00Z",
    "updatedAt": "2026-01-05T10:00:00Z"
  }
]
```

#### POST /api/routes
**Request:**
```json
{
  "name": "KL 7",
  "description": "Morning delivery route"
}
```
**Response:** (201 Created)
```json
{
  "id": 1,
  "name": "KL 7",
  "description": "Morning delivery route",
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

#### PUT /api/routes/:id
**Request:**
```json
{
  "description": "Updated description"
}
```
**Response:** (200 OK)
```json
{
  "id": 1,
  "name": "KL 7",
  "description": "Updated description",
  "updatedAt": "2026-01-05T11:00:00Z"
}
```

### Locations API

#### POST /api/locations
**Request:**
```json
{
  "routeId": 1,
  "name": "KLCC Tower",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Luxury shopping mall"
}
```
**Response:** (201 Created)
```json
{
  "id": 5,
  "routeId": 1,
  "name": "KLCC Tower",
  "latitude": 3.1690,
  "longitude": 101.7123,
  "description": "Luxury shopping mall",
  "images": [],
  "createdAt": "2026-01-05T10:00:00Z",
  "updatedAt": "2026-01-05T10:00:00Z"
}
```

#### POST /api/locations/:id/images
**Request:**
```json
{
  "imageUrl": "https://imgbb.com/abc123/image.jpg"
}
```
**Response:** (200 OK)
```json
{
  "id": 5,
  "images": [
    "https://imgbb.com/abc123/image.jpg"
  ],
  "updatedAt": "2026-01-05T10:05:00Z"
}
```

#### DELETE /api/locations/:id/images
**Request:**
```json
{
  "imageUrl": "https://imgbb.com/abc123/image.jpg"
}
```
**Response:** (200 OK)
```json
{
  "id": 5,
  "images": [],
  "updatedAt": "2026-01-05T10:10:00Z"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot POST /api/routes"
**Cause:** API endpoints not deployed yet  
**Solution:** 
- Check if you're on Vercel or local dev
- API files must be in `/api/` folder (serverless functions)
- For local: Use Next.js or Express.js wrapper

### Issue 2: "DATABASE_URL not found"
**Cause:** Environment variable not set  
**Solution:**
- Check `.env` file has VITE_DATABASE_URL
- Restart dev server after .env changes
- For Vercel: Check project settings → Environment Variables

### Issue 3: "TypeError: sql is not defined"
**Cause:** @neondatabase/serverless not installed  
**Solution:**
```bash
npm install @neondatabase/serverless
```

### Issue 4: Images not saving
**Cause:** Images array not properly updated  
**Solution:**
- Check Location model has images column
- Verify images are array type (TEXT[])
- Check array_append syntax in SQL

### Issue 5: Description not showing
**Cause:** Component not rendering correctly  
**Solution:**
- Import DescriptionEditor component
- Pass itemId, itemType, currentDescription props
- Check console for errors

---

## 📊 Performance Testing

### Load Test: Create 100 Locations
```javascript
async function loadTest() {
  const routeId = 1;
  const start = Date.now();
  
  for (let i = 0; i < 100; i++) {
    await fetch('/api/locations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId,
        name: `Location ${i}`,
        latitude: 3.1390 + (i * 0.001),
        longitude: 101.6869 + (i * 0.001),
        description: `Test location ${i}`
      })
    });
  }
  
  const time = Date.now() - start;
  console.log(`✅ Created 100 locations in ${time}ms`);
}

loadTest();
```

### Cache Performance
```javascript
import { CustomerService } from './src/service/CustomerService.js';

// First call - fetches from API
console.time('First fetch');
const data1 = await CustomerService.getDetailData();
console.timeEnd('First fetch');

// Second call - should use cache
console.time('Second fetch');
const data2 = await CustomerService.getDetailData();
console.timeEnd('Second fetch');

// Cache stats
console.log(CustomerService.getCacheStats());
```

---

## ✅ Verification Checklist

After implementing, verify:

- [ ] `.env` has DATABASE_URL
- [ ] Database tables created (Route, Location)
- [ ] Columns added: description, images
- [ ] API files created: routes.js, locations.js
- [ ] CustomerService methods updated
- [ ] DescriptionEditor component created
- [ ] Dependencies installed: @neondatabase/serverless
- [ ] All console tests pass
- [ ] No errors in browser console
- [ ] No errors in Vercel logs

---

## 🚀 Next Steps

1. **If testing locally:**
   - Start dev server: `npm run dev`
   - Open browser: `http://localhost:5173`
   - Run console tests

2. **If deploying to Vercel:**
   - Push code: `git push origin main`
   - Check Vercel deployment
   - Monitor logs for errors
   - Run tests on live URL

3. **If integrating with UI:**
   - Import DescriptionEditor in your components
   - Add image upload functionality
   - Test full flow end-to-end

---

**Last Updated:** January 5, 2026  
**Made with ❤️ for efficient development**
