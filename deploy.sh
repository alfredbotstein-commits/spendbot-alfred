#!/bin/bash
git push && curl -s -X POST https://api.netlify.com/build_hooks/69821f645bcede434310bec9
echo "✓ Pushed and triggered Netlify build"
