#!/usr/bin/env bash
#MISE description=["Build the PyPI index."]
#MISE depends=["copy-static", "index:*"]

set -eo pipefail

echo "index built successfully"
