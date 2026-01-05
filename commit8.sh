#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "fix: Mark chart.js/auto as external in build configuration

- Add chart.js/auto to build.rollupOptions.external
- Prevents 'failed to resolve' error during Vercel build
- Project doesn't use chart.js (no charts), so safe to externalize
- Fixes build error: '[vite]: Rollup failed to resolve import \"chart.js/auto\"'

The error was caused by primereact importing chart.js but the package
not being installed. Since we don't use charts, marking it external
prevents the build failure."
git push
