#!/bin/bash
# Cleanup redundant documentation and scripts
# Run this once to clean up the repository

echo "🧹 Cleaning up redundant files..."

# Redundant markdown files (root)
rm -f \
  COPY_PASTE_CODE.md \
  FILE_INDEX.md \
  FINAL_SUMMARY.txt \
  HOW_TO_INTEGRATE.txt \
  IMPLEMENTATION_COMPLETE.md \
  IMPLEMENTATION_COMPLETE_READY_TO_USE.md \
  INTEGRATION_GUIDE.md \
  INTEGRATION_QUICK_REF.md \
  MANIFEST.md \
  QUICK_INTEGRATION_CHEATSHEET.md \
  README_IMAGE_UPLOAD.md \
  README_IMAGE_UPLOAD_SYSTEM.md \
  SETUP_SUMMARY.txt \
  START_HERE.txt \
  START_INTEGRATING_NOW.txt \
  STATUS_BOARD.txt \
  TESTING_COMPLETE.md \
  CHECKLIST.md

# One-time use scripts (no longer needed)
rm -f \
  CHECK_ROUTE.sh \
  CHECK_SCHEMA.sh \
  COMMIT.sh \
  COMMIT_ROUTES.sh \
  DIAGNOSTIC.sh \
  FIX_AND_DEPLOY.sh \
  FIX_SCHEMA.sh \
  PUSH_FIX.sh \
  UPDATE_API.sh \
  VERCEL_FIX.sh

# Redundant docs
rm -rf \
  docs/ANIMATED_MODAL_README.md \
  docs/AUTO_QR_SCAN_FEATURE.md \
  docs/CHANGELOG_PERSISTENCE.md \
  docs/CLEANUP_SUMMARY.md \
  docs/COMMIT_INSTRUCTIONS.md \
  docs/COMMIT_MESSAGE.md \
  docs/COMPLETE.md \
  docs/DEVICE_DETECTION_README.md \
  docs/DIALOG_TRANSITIONS.md \
  docs/DUPLICATE_VALIDATION.md \
  docs/FINAL_SUMMARY.md \
  docs/IMAGELIGHTBOX_README.md \
  docs/IMAGE_LIGHTGALLERY_GUIDE.md \
  docs/INDEX.md \
  docs/INDEX_IMAGE_UPLOAD.md \
  docs/MODAL_CHANGELOG.md \
  docs/MODAL_ENHANCEMENTS.md \
  docs/MODAL_QUICKSTART.md \
  docs/QUICK_FIX_SUMMARY.md \
  docs/QUICK_REF_LINK_CONFIRMATION.md \
  docs/QUICK_START_5_MIN.md \
  docs/QUICK_START_IMAGE_UPLOAD.md \
  docs/QUICKSTART.md \
  docs/SAVE_FEATURE_SETUP.md \
  docs/SAVE_ORDER_PRESET.md \
  docs/SAVE_TROUBLESHOOTING.md \
  docs/SETUP_COMPLETE.md \
  docs/SETUP_INSTRUCTIONS.md \
  docs/START_HERE.md

# Keep only essential docs
echo "✅ Cleanup complete!"
echo ""
echo "📚 Remaining documentation:"
echo "  - README.md (project overview)"
echo "  - COMPLETE_GUIDE.md (comprehensive setup guide)"
echo "  - docs/TESTING_GUIDE.md (testing procedures)"
echo "  - docs/COMPONENTS_USAGE_GUIDE.md (component reference)"
echo "  - docs/IMAGE_UPLOAD_INTEGRATION.md (image feature)"
echo "  - docs/DATABASE_IMGBB_SETUP.md (database setup)"
echo "  - docs/MAP_FEATURE_SETUP.md (map feature)"
echo "  - docs/PUBLIC_DATA_SETUP.md (public data)"
echo "  - docs/PWA_SETUP_GUIDE.md (PWA setup)"
echo "  - docs/QR_CODE_FEATURE.md (QR code feature)"
echo "  - docs/DESCRIPTION_MIGRATION_GUIDE.md (migration)"
echo "  - docs/ARCHITECTURE.md (system architecture)"
echo "  - docs/ARCHITECTURE_IMAGE_UPLOAD.md (image architecture)"
echo ""
echo "🚀 Git commit:"
echo "  git add -A"
echo "  git commit -m 'chore: consolidate documentation and remove duplicates'"
echo "  git push origin main"
