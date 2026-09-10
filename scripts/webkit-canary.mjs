#!/usr/bin/env node
// Proves the design-system rules still reach this project.
//
//   node scripts/webkit-canary.mjs
//
// Inverted logic: each fixture violates one rule ON PURPOSE and must keep being flagged by
// that exact rule. A fixture that comes back clean means the rules stopped arriving.
//
// This exists because every way of losing them is silent:
//
//   the catalog does not resolve            → one stderr line, 8 of 12 rules disabled
//   an extension is missing from the preset → nothing at all for those files
//   a config edit drops the preset          → a lint that still passes
//
// In all three cases the adoption report reads BETTER, not worse. Two of the three happened
// while this gate was being built. The canary is the only check that goes red when the
// measurement stops working, which is why the CI blocks on it.
//
// See scripts/lib/webkit-lint.mjs for when this script goes away.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { readCatalog, runESLint } from './lib/webkit-lint.mjs'

// Inside the project so the project's own flat config applies. Removed in a finally.
const DIR = '.webkit-canary'

/* eslint-disable webkit/no-hardcoded-color --
   The fixtures below contain a deliberately hardcoded colour: that IS the fixture. The rule
   scans raw text, so it flags the literal here even though this file ships no UI. */
const FIXTURES = [
  {
    file: 'denied-import.vue',
    rule: 'webkit/no-deep-internal-import',
    content: `<script setup>
import Button from '@aziontech/webkit/src/components/actions/button/button.vue'
</script>

<template>
  <Button>deliberately reaching into internals</Button>
</template>
`
  },
  {
    file: 'unknown-export.vue',
    rule: 'webkit/valid-import-path',
    content: `<script setup>
import Nope from '@aziontech/webkit/this-export-does-not-exist'
</script>

<template>
  <Nope />
</template>
`
  },
  {
    file: 'hardcoded-color.vue',
    rule: 'webkit/no-hardcoded-color',
    content: `<template>
  <div class="bg-[#ff0000]">deliberately hardcoded</div>
</template>
`
  },
  {
    file: 'foreign-library.vue',
    rule: 'webkit/prefer-webkit-component',
    content: `<script setup>
import Dropdown from 'primevue/dropdown'
</script>

<template>
  <Dropdown />
</template>
`
  },
  {
    // This one is the reason the fixture list has an .astro entry at all: the published
    // preset does not list .astro in its own FILES, so without the local block in
    // eslint.config.mjs every Astro file here would be outside every rule — silently.
    file: 'hardcoded-color.astro',
    rule: 'webkit/no-hardcoded-color',
    content: `---
const label = 'deliberately hardcoded'
---

<div class="bg-[#ff0000]">{label}</div>
`
  }
]
/* eslint-enable webkit/no-hardcoded-color */

function main() {
  const cwd = process.cwd()
  const catalog = readCatalog(cwd)
  const dir = join(cwd, DIR)

  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })

  try {
    for (const fixture of FIXTURES) writeFileSync(join(dir, fixture.file), fixture.content)

    // --no-ignore so a broad ignore pattern in the project config cannot hide the fixtures.
    const lint = runESLint(cwd, [DIR], ['--no-ignore'])
    if (!lint.ok) {
      process.stdout.write(`FAIL  could not lint the canaries: ${lint.reason}\n`)
      process.exitCode = 1
      return
    }

    const seen = new Map()
    for (const result of lint.results) {
      const name = result.filePath.slice(result.filePath.lastIndexOf('/') + 1)
      const rules = new Set()
      let fatal = null
      for (const message of result.messages) {
        if (message.fatal) fatal = message.message
        else if (message.ruleId) rules.add(message.ruleId)
      }
      seen.set(name, { rules, fatal })
    }

    let failed = 0
    for (const fixture of FIXTURES) {
      const found = seen.get(fixture.file)
      if (!found) {
        failed += 1
        process.stdout.write(`FAIL  ${fixture.file} was not linted at all — expected ${fixture.rule}.\n`)
      } else if (found.fatal) {
        // A parse failure is not proof the rule works — the rule never ran.
        failed += 1
        process.stdout.write(`FAIL  ${fixture.file} failed to parse (${found.fatal}).\n`)
      } else if (found.rules.has(fixture.rule)) {
        process.stdout.write(`OK    ${fixture.file} — ${fixture.rule}\n`)
      } else {
        failed += 1
        process.stdout.write(`FAIL  ${fixture.file} — ${fixture.rule} did not fire.\n`)
      }
    }

    process.stdout.write('\n')
    if (!catalog.available) {
      process.stdout.write(
        'The webkit catalog did not resolve, which disables the catalog-backed rules.\n'
      )
    }
    process.stdout.write(
      failed === 0
        ? `${FIXTURES.length} of ${FIXTURES.length} canaries fired — the rules reach this project.\n`
        : `${failed} canary/canaries did not fire. The design-system rules are NOT reaching this ` +
            'project, so any adoption number is too low.\n'
    )
    process.exitCode = failed === 0 ? 0 : 1
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

main()
