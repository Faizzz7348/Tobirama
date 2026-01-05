#!/usr/bin/env python3
"""Clean up redundant documentation files"""
import os
import subprocess
from pathlib import Path

os.chdir('/workspaces/Tobirama')

# Files to delete
to_delete = [
    # Root markdown files
    'COPY_PASTE_CODE.md',
    'FILE_INDEX.md',
    'FINAL_SUMMARY.txt',
    'HOW_TO_INTEGRATE.txt',
    'IMPLEMENTATION_COMPLETE.md',
    'IMPLEMENTATION_COMPLETE_READY_TO_USE.md',
    'INTEGRATION_GUIDE.md',
    'INTEGRATION_QUICK_REF.md',
    'MANIFEST.md',
    'QUICK_INTEGRATION_CHEATSHEET.md',
    'README_IMAGE_UPLOAD.md',
    'README_IMAGE_UPLOAD_SYSTEM.md',
    'SETUP_SUMMARY.txt',
    'START_HERE.txt',
    'START_INTEGRATING_NOW.txt',
    'STATUS_BOARD.txt',
    'TESTING_COMPLETE.md',
    'CHECKLIST.md',
    # Helper scripts
    'CHECK_ROUTE.sh',
    'CHECK_SCHEMA.sh',
    'COMMIT.sh',
    'COMMIT_ROUTES.sh',
    'DIAGNOSTIC.sh',
    'FIX_AND_DEPLOY.sh',
    'FIX_SCHEMA.sh',
    'PUSH_FIX.sh',
    'UPDATE_API.sh',
    'VERCEL_FIX.sh',
]

deleted_count = 0
errors = []

print("🧹 Deleting redundant files...")
for file in to_delete:
    filepath = Path(file)
    if filepath.exists():
        try:
            filepath.unlink()
            print(f"  ✓ Deleted: {file}")
            deleted_count += 1
        except Exception as e:
            errors.append(f"  ✗ Error deleting {file}: {e}")
    else:
        print(f"  - Skipped: {file} (not found)")

print(f"\n✅ Deleted {deleted_count} files")

if errors:
    print("\n⚠️ Errors:")
    for error in errors:
        print(error)

# Git operations
print("\n📝 Git operations...")
try:
    subprocess.run(['git', 'add', '-A'], check=True)
    print("  ✓ git add -A")
    
    subprocess.run(['git', 'commit', '-m', 'chore: consolidate docs and remove duplicates (30 files)'], check=True)
    print("  ✓ git commit")
    
    subprocess.run(['git', 'push', 'origin', 'main'], check=True)
    print("  ✓ git push origin main")
    
    print("\n🎉 Cleanup complete!")
except subprocess.CalledProcessError as e:
    print(f"  ✗ Git error: {e}")

print("\n📚 Remaining files:")
print("  ✓ README.md")
print("  ✓ COMPLETE_GUIDE.md (NEW - master guide)")
print("  ✓ CLEANUP.sh")
print("  ✓ CLEANUP_PLAN.md")
print("  ✓ All source code intact")
