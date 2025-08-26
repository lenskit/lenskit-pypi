#!/usr/bin/env bash
#MISE description="Copy static files."

set -eo pipefail

mkdir -p out
cp -rf static/* out/
