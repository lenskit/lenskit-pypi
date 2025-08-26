#!/usr/bin/env bash
#MISE description="Copy static files."

set -eo pipefail

cp -rf static/* out/
