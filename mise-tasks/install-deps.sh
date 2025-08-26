#!/usr/bin/env bash
#MISE description="Install Node dependencies."

set -eo pipefail

if [[ $CI ]]; then
    npm ci
else
    npm i
fi
