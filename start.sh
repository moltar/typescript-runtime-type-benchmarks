#!/bin/sh

set -ex

ENV_TYPE=$1

if [ "$ENV_TYPE" = "NODE" ]; then
    RUNTIME_SCRIPT="npm"
    RUNTIME="node"
    RUNTIME_VERSION="${NODE_VERSION:-$(node -v)}"
elif [ "$ENV_TYPE" = "BUN" ]; then
    RUNTIME_SCRIPT="bun"
    RUNTIME="bun"
    RUNTIME_VERSION="${BUN_VERSION:-$(bun -v)}"
else
    echo "Unsupported environment: $ENV_TYPE"
    exit 1
fi

export RUNTIME
export RUNTIME_VERSION

$RUNTIME_SCRIPT run start

if [ "$ENV_TYPE" = "NODE" ]; then
    $RUNTIME_SCRIPT run start create-preview-svg
fi
