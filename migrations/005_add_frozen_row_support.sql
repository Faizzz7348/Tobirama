-- Migration 005: Add frozen row support
-- Date: January 12, 2026
-- Database: Neon PostgreSQL
-- Purpose: Add fields to support frozen rows with edit capabilities

-- Add frozen row fields to Location table
ALTER TABLE "Location" 
ADD COLUMN IF NOT EXISTS "isFrozen" BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "freezeOrder" INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS "allowEdit" BOOLEAN DEFAULT TRUE;

-- Set QL Kitchen as frozen row (code 'QLK')
UPDATE "Location"
SET 
  "isFrozen" = TRUE,
  "freezeOrder" = 1,
  "allowEdit" = TRUE
WHERE code = 'QLK' OR location = 'QL Kitchen';

-- Create index for frozen rows (for quick lookup)
CREATE INDEX IF NOT EXISTS idx_location_frozen ON "Location"("isFrozen") WHERE "isFrozen" = TRUE;
CREATE INDEX IF NOT EXISTS idx_location_freeze_order ON "Location"("freezeOrder") WHERE "freezeOrder" IS NOT NULL;

-- Verify the migration
SELECT 
  id,
  code,
  location,
  "isFrozen",
  "freezeOrder",
  "allowEdit"
FROM "Location"
WHERE "isFrozen" = TRUE
ORDER BY "freezeOrder";

-- Show column details
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'Location'
  AND column_name IN ('isFrozen', 'freezeOrder', 'allowEdit')
ORDER BY ordinal_position;
