#!/bin/sh

set -ex

export NODE_VERSION="${NODE_VERSION:-$(node -v)}"

npm run start
npm run start create-preview-svg
