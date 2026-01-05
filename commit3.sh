#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "feat: Add batch update support to routes API endpoint

- Add batch update mode to PUT /api/routes
- Support both single and multiple route updates
- Matches locations API batch update pattern
- Allows updating multiple routes in one request
- Fixes 'Failed to save 1 route(s)' error"
git push
