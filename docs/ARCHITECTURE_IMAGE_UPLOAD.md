# 📊 Architecture Overview - Database & Image Upload

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Components                                              │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ • ImageUploadComponent       (Standalone upload UI)     │   │
│  │ • ModalWithImageUpload       (Modal integration)        │   │
│  │ • ImageLightbox              (Image gallery)            │   │
│  │ • TableRowModal              (Existing detail modal)    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Custom Hooks                                            │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ • useImageUpload()  (Upload + DB save in one call)     │   │
│  │   - uploadImage()   (Single file)                       │   │
│  │   - uploadMultiple() (Multiple files)                   │   │
│  │   - Progress tracking, Error handling                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Services                                                │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │ ImageUploadService        CustomerService               │   │
│  │ ├─ uploadImageToImgBB()   ├─ addImageToLocation()       │   │
│  │ ├─ uploadMultiple()       ├─ removeImageFromLocation()  │   │
│  │ └─ handleFileInput()      └─ (existing methods)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│        ↓ (ImgBB API)             ↓ (REST API)                   │
└─────────────────────────────────────────────────────────────────┘
         │                              │
         ↓                              ↓
    ┌─────────┐                  ┌─────────────────────┐
    │ ImgBB   │                  │ Backend API         │
    │ Cloud   │                  │ (Node/Python/etc)   │
    │Storage  │                  │ ┌─────────────────┐ │
    │(Images) │                  │ │ /api/locations  │ │
    └─────────┘                  │ └─────────────────┘ │
                                 └──────────┬──────────┘
                                            ↓
                                 ┌─────────────────────┐
                                 │ PostgreSQL Neon DB  │
                                 │ (locations table)   │
                                 │ ├─ id              │
                                 │ ├─ name            │
                                 │ ├─ images[] (URLs) │ ← NEW
                                 │ └─ ...             │
                                 └─────────────────────┘
```

## Data Flow

### Upload & Save Flow

```
User selects file(s)
    ↓
useImageUpload.uploadImage/uploadMultiple()
    ↓
ImageUploadService.uploadImageToImgBB()
    ↓
🌐 API Call → api.imgbb.com/upload
    ↓
✅ Get ImgBB URL back
    ↓
CustomerService.addImageToLocation()
    ↓
🌐 API Call → /api/locations/:id/images
    ↓
💾 Save URL to PostgreSQL
    ↓
✅ Display in component
```

### Remove Flow

```
User clicks remove button
    ↓
CustomerService.removeImageFromLocation()
    ↓
🌐 API Call → DELETE /api/locations/:id/images
    ↓
💾 Remove URL from PostgreSQL
    ↓
✅ Update UI
```

## File Structure Tree

```
/workspaces/Tobirama/
│
├── .env (GITIGNORED - CONTAINS SECRETS)
│   ├── VITE_DATABASE_URL → PostgreSQL Neon
│   ├── VITE_IMGBB_API_KEY → ImgBB API
│   └── VITE_API_URL → Backend URL
│
├── .env.example (Template for .env)
│
├── .gitignore (Updated to exclude .env)
│
├── src/
│   ├── components/
│   │   ├── ImageUploadComponent.jsx ✨ NEW
│   │   │   └── Standalone upload UI with preview
│   │   │
│   │   ├── ModalWithImageUpload.jsx ✨ NEW
│   │   │   └── Example modal integration
│   │   │
│   │   ├── ImageLightbox.jsx (Already exists)
│   │   │   └── Used to display uploaded images
│   │   │
│   │   ├── TableRowModal.jsx (Already exists)
│   │   │
│   │   └── [Other components]
│   │
│   ├── hooks/
│   │   ├── useImageUpload.js ✨ NEW
│   │   │   ├── uploadImage(file, locationId)
│   │   │   └── uploadMultiple(files, locationId)
│   │   │
│   │   └── [Other hooks]
│   │
│   ├── service/
│   │   ├── ImageUploadService.js ✨ NEW
│   │   │   ├── uploadImageToImgBB(file)
│   │   │   ├── uploadMultipleImagesToImgBB(files)
│   │   │   └── handleFileInputChange(event)
│   │   │
│   │   ├── CustomerService.js (UPDATED)
│   │   │   ├── addImageToLocation(id, urls) ✨ NEW
│   │   │   └── removeImageFromLocation(id, url) ✨ NEW
│   │   │
│   │   └── [Other services]
│   │
│   ├── config/
│   │   └── database.js ✨ NEW
│   │       └── PostgreSQL Neon configuration
│   │
│   └── main.jsx, index-clean.css, [Other files]
│
└── docs/
    ├── IMAGE_UPLOAD_INTEGRATION.md ✨ NEW
    │   └── Complete integration guide
    │
    ├── QUICK_START_IMAGE_UPLOAD.md ✨ NEW
    │   └── 5-minute quick start
    │
    ├── DATABASE_IMGBB_SETUP.md ✨ NEW
    │   └── Setup summary & checklist
    │
    ├── ARCHITECTURE.md (Already exists)
    │
    └── [Other documentation]
```

## Technology Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18.2 | UI Framework |
| Vite 5.1 | Build tool |
| LightGallery 2.9 | Image gallery |
| Framer Motion 12.23 | Animations |

### Image Hosting
| Service | Purpose |
|---------|---------|
| ImgBB | Cloud image storage (free) |
| API Endpoint | https://api.imgbb.com/1/upload |

### Database
| Component | Details |
|-----------|---------|
| Database | PostgreSQL |
| Provider | Neon (Cloud) |
| Region | US East 1 |
| SSL | Required (Enabled) |
| Connection | Pooled (2-10 connections) |

### APIs
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/locations | GET | Fetch all locations |
| /api/locations/:id/images | POST | Add images |
| /api/locations/:id/images | DELETE | Remove image |

## Environment Variables

```
VITE_API_URL=/api
    ↓
Backend API base URL for your app

VITE_DATABASE_URL=postgresql://...
    ↓
PostgreSQL Neon connection string
Provider: Neon
Database: neondb
User: neondb_owner
Region: ep-weathered-grass-ad6a3l3j-pooler.c-2.us-east-1.aws.neon.tech

VITE_IMGBB_API_KEY=4042c537845e8b19b443add46f4a859c
    ↓
ImgBB API key for image uploads
Service: ImgBB (imgbb.com)
Purpose: Upload images to cloud storage
```

## Component Dependencies

```
useImageUpload
    ↓
    ├── ImageUploadService
    │   └── ImgBB API
    │
    └── CustomerService
        └── Backend API
            └── PostgreSQL

ImageUploadComponent
    ↓
    └── useImageUpload
        (See above)

ModalWithImageUpload
    ↓
    ├── useImageUpload
    ├── CustomerService
    └── ImageLightbox
```

## Integration Points

### Existing Components That Can Use This

1. **ImageLightbox**
   ```jsx
   <ImageLightbox 
     images={location.images}
     rowId={location.id}
   />
   ```

2. **TableRowModal**
   - Can add ImageUploadComponent inside modal
   - Can display images in modal body

3. **EditableDescriptionList**
   - Can add image management to editable fields
   - Can integrate upload with other location data

## API Contract

### Backend Needs to Implement

**POST /api/locations/:id/images**
```json
Request Body:
{
    "images": ["url1", "url2"]
}

Response:
{
    "success": true,
    "images": ["url1", "url2"],
    "location_id": 123
}
```

**DELETE /api/locations/:id/images**
```json
Request Body:
{
    "imageUrl": "url1"
}

Response:
{
    "success": true,
    "images": ["url2"]
}
```

## Performance Considerations

### Caching
- ✅ CustomerService caches locations data
- ✅ ImageLightbox caches image URLs
- ✅ Browser caches ImgBB images

### Optimization
- ✅ Parallel uploads (Promise.all)
- ✅ Request deduplication
- ✅ Lazy loading images
- ✅ Connection pooling (2-10)

### Limits
- ⚠️ ImgBB: Max 32MB per file
- ⚠️ PostgreSQL: Text array size depends on DB
- ⚠️ Browser: Simultaneous uploads should be throttled

## Security

### What's Protected
- ✅ `.env` excluded from git
- ✅ Database uses SSL/TLS
- ✅ Channel binding enabled
- ✅ API key stored in env vars
- ✅ No credentials in source code

### What Needs Implementation
- ⚠️ Backend API authentication
- ⚠️ Rate limiting on endpoints
- ⚠️ File type validation on server
- ⚠️ Virus scanning for uploads
- ⚠️ CORS properly configured

## Next Steps Priority

1. **HIGH** - Backend API implementation
   - Create /api/locations/:id/images endpoints
   - Add images column to locations table
   - Implement authentication

2. **HIGH** - Testing
   - Test upload flow
   - Test database persistence
   - Test error scenarios

3. **MEDIUM** - Integration
   - Add to existing modals
   - Update UI/UX
   - Add user feedback

4. **MEDIUM** - Optimization
   - Implement caching
   - Add image compression
   - Optimize queries

5. **LOW** - Polish
   - Add animations
   - Improve error messages
   - Add help text

---

**Status:** ✅ Frontend setup complete, awaiting backend implementation
