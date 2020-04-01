#!/bin/sh

set -ex

export NODE_VERSION="${NODE_VERSION:-$(node -v)}"

npm start
