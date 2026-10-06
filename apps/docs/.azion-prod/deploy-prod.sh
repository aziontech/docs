#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/scripts/deploy/azion-deploy.sh" prod
