-- =====================================================
-- COMPLETE DATABASE SETUP FOR PRODUCTION
-- Database: Tobirama Route Management
-- Date: 2026-01-12
-- =====================================================

-- =====================================================
-- STEP 1: Create Base Tables
-- =====================================================

-- Create Route table
CREATE TABLE IF NOT EXISTS "Route" (
  id BIGSERIAL PRIMARY KEY,
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
  "routeId" BIGINT NOT NULL REFERENCES "Route"(id) ON DELETE CASCADE,
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
  "isFrozen" BOOLEAN DEFAULT FALSE,
  "freezeOrder" INTEGER DEFAULT NULL,
  "allowEdit" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create base indexes
CREATE INDEX IF NOT EXISTS idx_location_routeId ON "Location"("routeId");
CREATE INDEX IF NOT EXISTS idx_route_name ON "Route"(route);
CREATE INDEX IF NOT EXISTS idx_location_name ON "Location"(location);

-- =====================================================
-- STEP 2: Migration 003 - Ensure routeId is BIGINT
-- =====================================================

-- Drop and recreate foreign key constraint if needed
-- (This handles the case where routeId needs to be converted from INT to BIGINT)
DO $$
BEGIN
  -- Drop existing foreign key if exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Location_routeId_fkey' 
    AND table_name = 'Location'
  ) THEN
    ALTER TABLE "Location" DROP CONSTRAINT "Location_routeId_fkey";
  END IF;

  -- Alter column to BIGINT if not already
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Location' 
    AND column_name = 'routeId' 
    AND data_type = 'integer'
  ) THEN
    ALTER TABLE "Location" ALTER COLUMN "routeId" TYPE BIGINT;
  END IF;

  -- Re-add foreign key constraint
  ALTER TABLE "Location" 
  ADD CONSTRAINT "Location_routeId_fkey" 
  FOREIGN KEY ("routeId") REFERENCES "Route"(id) ON DELETE CASCADE;
END $$;

-- =====================================================
-- STEP 3: Migration 004 - Add qrCodeImages array
-- =====================================================

-- Add qrCodeImages column if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Location' 
    AND column_name = 'qrCodeImages'
  ) THEN
    ALTER TABLE "Location" ADD COLUMN "qrCodeImages" JSONB DEFAULT '[]';
  END IF;
END $$;

-- Migrate existing QR code data to array format
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
  AND ("qrCodeImages" IS NULL OR "qrCodeImages" = '[]'::jsonb);

-- Create GIN index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_location_qrcode_images 
ON "Location" USING GIN ("qrCodeImages");

-- =====================================================
-- STEP 4: Migration 005 - Add Frozen Row Support
-- =====================================================

-- Add frozen row fields if not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Location' 
    AND column_name = 'isFrozen'
  ) THEN
    ALTER TABLE "Location" ADD COLUMN "isFrozen" BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Location' 
    AND column_name = 'freezeOrder'
  ) THEN
    ALTER TABLE "Location" ADD COLUMN "freezeOrder" INTEGER DEFAULT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Location' 
    AND column_name = 'allowEdit'
  ) THEN
    ALTER TABLE "Location" ADD COLUMN "allowEdit" BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

-- Set QL Kitchen as frozen row (if exists)
UPDATE "Location"
SET 
  "isFrozen" = TRUE,
  "freezeOrder" = 1,
  "allowEdit" = TRUE
WHERE (code = 'QLK' OR location = 'QL Kitchen')
  AND "isFrozen" IS NOT TRUE;

-- Create indexes for frozen rows
CREATE INDEX IF NOT EXISTS idx_location_frozen 
ON "Location"("isFrozen") WHERE "isFrozen" = TRUE;

CREATE INDEX IF NOT EXISTS idx_location_freeze_order 
ON "Location"("freezeOrder") WHERE "freezeOrder" IS NOT NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check tables
SELECT 'Route table exists' as status, COUNT(*) as row_count FROM "Route"
UNION ALL
SELECT 'Location table exists' as status, COUNT(*) as row_count FROM "Location";

-- Check schema
SELECT 
  'Schema check' as status,
  column_name, 
  data_type,
  CASE 
    WHEN column_name = 'routeId' AND data_type = 'bigint' THEN '✅'
    WHEN column_name = 'qrCodeImages' AND data_type = 'jsonb' THEN '✅'
    ELSE '❌'
  END as check_mark
FROM information_schema.columns 
WHERE table_name = 'Location' 
AND column_name IN ('routeId', 'qrCodeImages')
ORDER BY column_name;

-- Check QR code data
SELECT 
  'QR Code Migration' as status,
  COUNT(*) as locations_with_qr_codes
FROM "Location" 
WHERE "qrCodeImages" IS NOT NULL 
AND "qrCodeImages" != '[]'::jsonb;

-- Check frozen rows
SELECT 
  'Frozen Rows' as status,
  id,
  code,
  location,
  "isFrozen",
  "freezeOrder",
  "allowEdit"
FROM "Location" 
WHERE "isFrozen" = TRUE
ORDER BY "freezeOrder";

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- All tables created ✅
-- All migrations applied ✅
-- QR code multiple support enabled ✅
-- Frozen row support with edit capability ✅
-- =====================================================
