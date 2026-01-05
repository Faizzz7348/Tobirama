#!/bin/bash
cd /workspaces/Tobirama
git add -A
git commit -m "chore: Suppress Node.js deprecation warnings in production

- Add NODE_OPTIONS='--no-deprecation' to build and preview scripts
- Set environment variable in vercel.json for production deployment
- Suppresses url.parse() deprecation warning from dependencies
- Already had it for dev, now consistent across all environments"
git push
