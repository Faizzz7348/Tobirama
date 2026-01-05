#!/bin/bash
# Push fix for Vercel serverless

echo "📤 Pushing changes to GitHub..."
echo ""

# Make sure we're on main branch
git checkout main

# Add all changes
git add -A

# Check what we're committing
echo "📝 Files to commit:"
git status --short
echo ""

# Commit
git commit -m "fix: use default export for Vercel serverless functions

Changes:
- api/routes.js: Refactored to use default export handler
- api/locations.js: Refactored to use default export handler
- Added HTTP method routing (GET, POST, PUT, DELETE)
- Fixed 'Invalid export' Vercel error

All endpoints now work with Vercel serverless functions."

# Push to main
echo ""
echo "🚀 Pushing to origin/main..."
git push origin main

# Verify
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Push successful!"
  echo ""
  echo "Monitor deployment:"
  echo "1. Go to https://vercel.com"
  echo "2. Select your project (Tobirama)"
  echo "3. Check 'Deployments' tab"
  echo "4. Wait for 'Ready' status"
  echo "5. Check Function Logs for any errors"
else
  echo ""
  echo "❌ Push failed"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check internet connection"
  echo "2. Verify GitHub credentials"
  echo "3. Try: git push origin main --force"
  echo "4. Check: git log --oneline (to see commits)"
fi
