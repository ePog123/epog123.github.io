#!/bin/sh

jspm bundle --minify --skip-source-maps x-retro + raw + snes9x-next bundle.js
cat jspm_packages/system.js bundle.js config.js > build.js
rm bundle.js
echo 'System.import("x-retro");' >> build.js
