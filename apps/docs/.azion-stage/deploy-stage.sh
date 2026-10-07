#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/apps/docs/scripts/deploy/azion-deploy.sh" stage
