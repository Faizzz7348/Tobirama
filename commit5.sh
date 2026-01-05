#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "fix: Improve info button visibility and add database migration

- Add explicit styling to info button (blue color, visible cursor, clear opacity)
- Make info button more visually distinct and clickable
- Create new migration 002_add_location_extended_fields.sql
- Ensure websiteLink, qrCodeImageUrl, qrCodeDestinationUrl columns exist
- Supports website link shortcut and QR code features

Run migration in Neon console to apply database changes"
git push
