# 🔧 FIX: QR Code Not Showing in View Mode

## 📋 Masalah yang Ditemukan

Ketika QR code di-update di Vercel, data tidak muncul di view mode karena:

1. **Database Schema Tidak Lengkap**: Database masih menggunakan field lama (`qrCodeImageUrl`, `qrCodeDestinationUrl`) untuk single QR code
2. **Frontend Menggunakan Array**: Frontend sudah di-update untuk mendukung multiple QR codes menggunakan field `qrCodeImages` (array)
3. **API Tidak Sinkron**: API backend tidak menangani field `qrCodeImages` yang baru

## ✅ Solusi yang Sudah Diimplementasikan

### 1. Migration Database (004)
File: `migrations/004_add_qrcode_images_array.sql`

- Menambahkan kolom `qrCodeImages` JSONB ke tabel Location
- Migrasi data lama ke format baru
- Membuat index untuk performa

### 2. API Update
File: `api/locations.js`

- GET: Menambahkan field `qrCodeImages` di semua query SELECT
- POST: Mendukung parameter `qrCodeImages` saat create location
- PUT: Mendukung update `qrCodeImages` (single & batch)
- DELETE: Menambahkan field `qrCodeImages` di return value

### 3. Migration Runner
File: `run-migration-004.js`

- Script untuk menjalankan migration dengan mudah
- Verifikasi hasil migration
- Cek data yang sudah dimigrasi

## 🚀 Cara Deploy Fix

### Step 1: Jalankan Migration di Database Production

**Option A: Via Local Machine (Recommended)**
```bash
# Pastikan .env file ada dengan VITE_DATABASE_URL
# Isi .env:
# VITE_DATABASE_URL=your_neon_database_url

# Install dependencies jika belum
npm install

# Jalankan migration
node run-migration-004.js
```

**Option B: Via SQL Console di Neon Dashboard**
1. Login ke [Neon Console](https://console.neon.tech)
2. Pilih project database Anda
3. Buka SQL Editor
4. Copy-paste isi file `migrations/004_add_qrcode_images_array.sql`
5. Execute query

**Expected Output:**
```
🚀 Running migration 004: Add qrCodeImages array...
📝 Executing: ALTER TABLE "Location" ADD COLUMN...
✅ Done
...
✅ Column "qrCodeImages" exists with type: jsonb
📊 X location(s) have QR code data
🎉 Migration 004 completed successfully!
```

### Step 2: Deploy API ke Vercel

```bash
# Commit changes
git add .
git commit -m "fix: Add qrCodeImages support for multiple QR codes"

# Push ke Vercel (automatic deployment)
git push origin main
```

### Step 3: Verifikasi Fix

1. **Buka aplikasi di Vercel**
2. **Pilih route dengan QR code**
3. **Edit Mode**: 
   - Klik icon QR Code pada location
   - Add/edit QR codes
   - Klik Save
   - Klik Save di menu utama
4. **View Mode**:
   - Toggle ke View Mode
   - QR code icon seharusnya muncul (berwarna)
   - Klik icon untuk scan QR code
   - QR code list seharusnya muncul

## 🧪 Testing Checklist

- [ ] Migration berhasil dijalankan tanpa error
- [ ] Data lama sudah ter-migrate ke format baru
- [ ] API deployment berhasil di Vercel
- [ ] QR code bisa di-add di Edit Mode
- [ ] QR code ter-save ke database
- [ ] QR code muncul di View Mode
- [ ] QR code bisa di-scan di View Mode
- [ ] Multiple QR codes per location berfungsi

## 📊 Database Schema Changes

**Before:**
```sql
CREATE TABLE "Location" (
  ...
  "qrCodeImageUrl" TEXT,
  "qrCodeDestinationUrl" TEXT,
  ...
);
```

**After:**
```sql
CREATE TABLE "Location" (
  ...
  "qrCodeImageUrl" TEXT,        -- kept for backward compatibility
  "qrCodeDestinationUrl" TEXT,  -- kept for backward compatibility
  "qrCodeImages" JSONB DEFAULT '[]', -- NEW: supports multiple QR codes
  ...
);
```

**qrCodeImages Format:**
```json
[
  {
    "imageUrl": "data:image/png;base64,...",
    "destinationUrl": "https://example.com",
    "title": "Main QR Code",
    "id": 1734953400000
  },
  {
    "imageUrl": "data:image/png;base64,...",
    "destinationUrl": "https://another.com",
    "title": "Secondary QR",
    "id": 1734953401000
  }
]
```

## 🔍 Debugging Tips

### Cek apakah migration sudah jalan:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Location' 
AND column_name = 'qrCodeImages';
```

### Cek data QR code:
```sql
SELECT id, location, "qrCodeImages" 
FROM "Location" 
WHERE "qrCodeImages" IS NOT NULL 
AND "qrCodeImages" != '[]'::jsonb;
```

### Cek API response:
```javascript
// Di browser console
fetch('https://your-app.vercel.app/api/locations?routeId=1')
  .then(r => r.json())
  .then(data => console.log(data[0].qrCodeImages));
```

## 📝 Notes

- Field lama (`qrCodeImageUrl`, `qrCodeDestinationUrl`) tetap ada untuk backward compatibility
- Migration akan otomatis convert data lama ke format array baru
- Frontend sudah kompatibel dengan format array sejak awal
- Setelah migration, semua update akan menggunakan field `qrCodeImages`

## 🆘 Troubleshooting

### Problem: Migration error "column already exists"
**Solution:** Column sudah ada, skip migration atau run ALTER IF NOT EXISTS

### Problem: QR code masih tidak muncul di View Mode
**Solution:** 
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Cek API response apakah `qrCodeImages` ada
4. Cek browser console untuk error

### Problem: Data lama tidak ter-migrate
**Solution:** Run manual update query:
```sql
UPDATE "Location"
SET "qrCodeImages" = jsonb_build_array(
    jsonb_build_object(
        'imageUrl', "qrCodeImageUrl",
        'destinationUrl', "qrCodeDestinationUrl",
        'title', 'QR Code',
        'id', floor(extract(epoch from NOW()) * 1000)
    )
)
WHERE "qrCodeImageUrl" IS NOT NULL 
  AND "qrCodeImageUrl" != ''
  AND ("qrCodeImages" IS NULL OR "qrCodeImages" = '[]');
```

---

**Status:** ✅ Fix Ready to Deploy
**Priority:** 🔴 HIGH (Production Bug)
**Impact:** Multiple QR codes per location + View mode display
