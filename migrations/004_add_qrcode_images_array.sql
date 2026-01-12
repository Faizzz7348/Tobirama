-- Migration 004: Add qrCodeImages array field to Location table
-- This replaces the old qrCodeImageUrl and qrCodeDestinationUrl fields with a JSONB array

-- Add new qrCodeImages column as JSONB
ALTER TABLE "Location" 
ADD COLUMN IF NOT EXISTS "qrCodeImages" JSONB DEFAULT '[]';

-- Migrate existing data from old fields to new array format
-- Only migrate if old fields have values
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

-- Create index for JSONB queries (optional, for performance)
CREATE INDEX IF NOT EXISTS idx_location_qrcode_images ON "Location" USING GIN ("qrCodeImages");

-- Note: We keep the old columns for backward compatibility
-- They can be removed in a future migration after confirming the new system works
