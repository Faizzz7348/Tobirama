#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "chore: Optimize bundle chunking and increase chunk size limit

- Increase chunkSizeWarningLimit from 1000kb to 1500kb
- Add manual chunks for heavy dependencies (primereact, leaflet, lightgallery)
- Split large libraries into separate chunks for better loading
- Reduces main bundle size and improves initial page load time

This prevents 'Chunk size warning' during production build"
git push
