#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "fix: Add detailed logging to handleShowInfo for debugging modal

- Add console.log at each step of handleShowInfo function
- Log when function is called with parameters
- Log when selected row info is set
- Log when infoDialogVisible is being set to true
- Helps debug why info modal is not appearing

Steps to debug:
1. Click info button
2. Open browser console (F12)
3. Look for '🔍 handleShowInfo called' message
4. Check if '📂 Setting infoDialogVisible to true' appears
5. If not appearing, infoDialogVisible state might be broken"
git push
