# 🚀 Setup Database Production - Panduan Lengkap

## 📋 Database Information
**Database:** Production  
**Connection:** Neon PostgreSQL (Singapore Region)  
**Status:** Ready to setup ✅

---

## 🎯 Cara Setup (2 Pilihan)

### ✅ **PILIHAN 1: Via Neon SQL Console (RECOMMENDED - Paling Mudah)**

1. **Buka Neon Console**
   - Login ke: https://console.neon.tech
   - Pilih project database Anda
   - Region: ap-southeast-1 (Singapore)
   - Database: **Production**

2. **Buka SQL Editor**
   - Di dashboard, klik tab **"SQL Editor"**
   - Atau klik **"Query"** di sidebar

3. **Copy & Execute SQL**
   - Buka file: [`COMPLETE_DATABASE_SETUP.sql`](COMPLETE_DATABASE_SETUP.sql)
   - Copy SEMUA isinya (Ctrl+A, Ctrl+C)
   - Paste di SQL Editor (Ctrl+V)
   - Klik tombol **"Run"** atau tekan **Ctrl+Enter**

4. **Tunggu & Verify**
   - Proses setup akan jalan ~5-10 detik
   - Akan muncul hasil verification di bawah
   - Pastikan semua ada tanda ✅

---

### 🔧 **PILIHAN 2: Via Terminal (Butuh Node.js)**

```bash
# Pastikan di directory project
cd /workspaces/Tobirama

# Install dependencies jika belum
npm install

# Jalankan setup script
node setup-and-migrate.js
```

**Expected Output:**
```
🚀 Starting complete database setup and migration...
============================================================
📋 STEP 1: Creating base tables...
  ✅ Route table created
  ✅ Location table created
  ✅ Base indexes created

📋 STEP 2: Running migration 003 (routeId to BIGINT)...
  ✅ routeId converted to BIGINT

📋 STEP 3: Running migration 004 (qrCodeImages array)...
  ✅ qrCodeImages column added
  ✅ Migrated X QR code(s)
  ✅ Index created

🎉 DATABASE SETUP AND MIGRATION COMPLETED SUCCESSFULLY!
```

---

## 🔍 Verification

Setelah setup selesai, jalankan query ini di SQL Editor untuk verify:

```sql
-- Check tables
SELECT 'Route table' as table_name, COUNT(*) as rows FROM "Route"
UNION ALL
SELECT 'Location table' as table_name, COUNT(*) as rows FROM "Location";

-- Check schema (harus BIGINT dan JSONB)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Location' 
AND column_name IN ('routeId', 'qrCodeImages')
ORDER BY column_name;
```

**Expected Result:**
```
column_name    | data_type
--------------+-----------
qrCodeImages   | jsonb      ✅
routeId        | bigint     ✅
```

---

## 📦 Yang Akan Di-Setup

### 1. **Tabel Route**
```sql
CREATE TABLE "Route" (
  id BIGSERIAL PRIMARY KEY,
  route TEXT NOT NULL,
  shift TEXT NOT NULL,
  warehouse TEXT NOT NULL,
  description TEXT,
  ...
);
```

### 2. **Tabel Location**
```sql
CREATE TABLE "Location" (
  id SERIAL PRIMARY KEY,
  routeId BIGINT NOT NULL,
  location TEXT NOT NULL,
  code TEXT,
  delivery TEXT,
  qrCodeImages JSONB DEFAULT '[]',  ← NEW! Support multiple QR
  ...
);
```

### 3. **Indexes untuk Performa**
- `idx_location_routeId` - Filter by route
- `idx_route_name` - Search routes
- `idx_location_name` - Search locations
- `idx_location_qrcode_images` - QR code queries (GIN index)

---

## 🎯 Next Steps Setelah Setup

### 1. **Deploy Frontend ke Vercel**

```bash
# Commit database changes
git add .
git commit -m "feat: Setup production database with QR codes support"

# Push to trigger Vercel deploy
git push origin main
```

### 2. **Test di Production**

1. Buka app di Vercel: `https://your-app.vercel.app`
2. Create route baru
3. Add locations
4. Upload QR codes (Edit Mode)
5. Save changes
6. Toggle View Mode → QR codes harus muncul ✅

---

## ⚠️ Troubleshooting

### Problem: "Connection timeout"
**Solusi:** 
- Pastikan IP Anda di whitelist di Neon
- Atau gunakan pooler connection (sudah di-set di .env)

### Problem: "Table already exists"
**Solusi:** 
- Tidak masalah! Script sudah handle dengan `IF NOT EXISTS`
- Migration akan skip kalau sudah ada

### Problem: Column qrCodeImages tidak ada
**Solusi:**
- Jalankan ulang STEP 3 dari COMPLETE_DATABASE_SETUP.sql
- Atau jalankan manual:
```sql
ALTER TABLE "Location" ADD COLUMN "qrCodeImages" JSONB DEFAULT '[]';
```

---

## 📊 Database Schema Final

```
Route (id, route, shift, warehouse, description, ...)
  ↓ (1 to many)
Location (id, routeId, location, code, delivery, qrCodeImages, ...)

qrCodeImages format:
[
  {
    "imageUrl": "data:image/png;base64,...",
    "destinationUrl": "https://example.com",
    "title": "Main QR",
    "id": 1734953400000
  }
]
```

---

## ✅ Setup Checklist

- [ ] Database Production sudah dibuat di Neon
- [ ] .env file sudah ada dengan VITE_DATABASE_URL
- [ ] Jalankan COMPLETE_DATABASE_SETUP.sql di Neon Console
- [ ] Verify schema: routeId = BIGINT, qrCodeImages = JSONB
- [ ] Commit & push changes ke GitHub
- [ ] Vercel auto-deploy
- [ ] Test app di production

---

**Status:** 🟢 Ready to Setup  
**Estimasi Waktu:** ~2 menit  
**Difficulty:** ⭐ Easy (via Neon Console)

**Questions?** Check troubleshooting section atau review error logs.
