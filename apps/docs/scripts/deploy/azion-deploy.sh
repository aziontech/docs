#!/usr/bin/env bash
set -euo pipefail

BUNDLER_VERSION="${BUNDLER_VERSION:-1.1.4}"

usage() {
	echo "usage: ${0##*/} <stage|prod>" >&2
	exit 2
}

[ "$#" -eq 1 ] || usage

case "$1" in
	stage)
		state=.azion-stage
		consts=env/consts.stage.ts
		;;
	prod)
		state=.azion-prod
		consts=env/consts.production.ts
		;;
	*) usage ;;
esac

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

for path in azion.config.* azion; do
	if [ -e "$path" ]; then
		echo "error: ./$path already exists (stale state from an interrupted run); remove it and retry" >&2
		exit 1
	fi
done

finish() {
	local rc=$?
	set +e
	# Persist what the CLI wrote, even when the deploy failed halfway.
	if [ -f azion.config.ts ]; then cp azion.config.ts "$state/azion.config.ts"; fi
	if [ -f azion/azion.json ]; then cp azion/azion.json "$state/azion/azion.json"; fi
	rm -rf azion.config.ts azion
	git checkout -- src/consts.ts || echo "warning: could not restore src/consts.ts" >&2
	exit "$rc"
}
trap finish EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

cp "$state/azion.config.ts" azion.config.ts
cp -R "$state/azion" azion
cp "$consts" src/consts.ts

# The first deploy reads .edge/manifest.json before it builds; later runs rebuild it.
if [ ! -f .edge/manifest.json ]; then
	npx --yes "@aziontech/bundler@${BUNDLER_VERSION}" manifest generate -e azion.config.ts -o .edge
fi

status=0
NODE_OPTIONS=--max-old-space-size=8120 azion deploy --local --auto --debug || status=$?
exit "$status"
