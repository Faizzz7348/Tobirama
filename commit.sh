#!/bin/bash

echo "📦 Staging all changes..."
git add -A

echo "📝 Committing changes..."
git commit -m "feat: Add QR code multiple support with database migration

- Fix QR code not showing in View Mode issue
- Add qrCodeImages JSONB field to Location table (supports multiple QR codes)
- Update API endpoints to handle qrCodeImages array
- Create complete database setup script (setup-and-migrate.js)
- Add migration 004 for qrCodeImages support
- Include comprehensive documentation
- Add npm script 'setup-prod' for easy database setup

Database Changes:
- Add qrCodeImages JSONB column to Location table
- Migrate existing QR code data to new format
- Add GIN index for qrCodeImages queries

API Updates (api/locations.js):
- GET: Return qrCodeImages field
- POST: Support qrCodeImages parameter
- PUT: Handle qrCodeImages updates (batch & single)
- DELETE: Include qrCodeImages in response

New Files:
- migrations/004_add_qrcode_images_array.sql
- COMPLETE_DATABASE_SETUP.sql
- DATABASE_SETUP_GUIDE.md
- QR_CODE_FIX_INSTRUCTIONS.md
- setup-and-migrate.js
- run-migration-004.js

Production Ready ✅"

echo "✅ Commit completed!"
echo ""
echo "🚀 Next step: Push to GitHub"
echo "Run: git push origin main"
