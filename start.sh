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
elif [ "$ENV_TYPE" = "DENO" ]; then
    RUNTIME_SCRIPT="deno"
    RUNTIME="deno"
    RUNTIME_VERSION="${DENO_VERSION:-$(deno -v | awk '{ print $2 }')}"
else
    echo "Unsupported environment: $ENV_TYPE"
    exit 1
fi

export RUNTIME
export RUNTIME_VERSION

if [ "$ENV_TYPE" = "NODE" ]; then
    $RUNTIME_SCRIPT run start
elif [ "$ENV_TYPE" = "BUN" ]; then
    $RUNTIME_SCRIPT run start:bun
elif [ "$ENV_TYPE" = "DENO" ]; then
    $RUNTIME_SCRIPT task start:deno
else
    echo "Unsupported environment: $ENV_TYPE"
    exit 1
fi

if [ "$ENV_TYPE" = "NODE" ]; then
    $RUNTIME_SCRIPT run start create-preview-svg
fi
