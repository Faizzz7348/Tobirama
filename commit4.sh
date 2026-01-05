#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "fix: Add error handling to info button clicks

- Add try-catch blocks to info button onClick handlers
- Both route and location info buttons now handle errors gracefully
- Add error messages to console and alert user on failure
- Improve UX when opening info modals

Fixes 'button info flex table tak berfungsi' issue"
git push
