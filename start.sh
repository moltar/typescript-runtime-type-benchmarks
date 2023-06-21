#!/bin/sh

set -ex

export NODE_VERSION="${NODE_VERSION:-$(node -v)}"

npm run start
npm install vega-lite@4.17.0
npm run start create-preview-svg
git checkout -- package.json package-lock.json
