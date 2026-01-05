#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "feat: Add frozen row detection for location saving

- Separate new locations from existing locations during save
- New locations (isNew=true or temp IDs) are created via POST
- Existing locations are updated via batch PUT
- Skip frozen/unchanged rows to prevent 'Location not found' error
- Allows adding new rows even if existing rows fail to update

Fixes issue where saving with new rows would fail if location was missing"
git push
