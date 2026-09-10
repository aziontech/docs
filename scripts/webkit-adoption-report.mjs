#!/usr/bin/env node
// Measures how much of this project's UI is actually the design system.
//
//   node scripts/webkit-adoption-report.mjs                    Markdown to stdout
//   node scripts/webkit-adoption-report.mjs --format json      the same numbers, for a machine
//   node scripts/webkit-adoption-report.mjs --update           snapshot the baseline
//   node scripts/webkit-adoption-report.mjs --fail-on new      fail only on new violations
//
// Markdown goes to stdout and progress to stderr, so CI can redirect it straight into
// $GITHUB_STEP_SUMMARY. See scripts/lib/webkit-lint.mjs for why it shells out to the
// eslint shim, and for when this script goes away.

import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { extensionOf, readCatalog, runESLint, UI_EXTENSIONS } from './lib/webkit-lint.mjs'

const BASELINE = '.webkit-baseline.json'
const FAIL_MODES = new Set(['never', 'new', 'any'])

const RULE_PURPOSE = {
  'valid-import-path': 'import path that does not exist in the installed version',
  'no-deep-internal-import': 'reaches into the package internals instead of a published entry',
  'no-barrel-import': 'bare-package barrel import (there is no barrel entry)',
  'no-whole-icon-set-import': 'pulls the whole icon set instead of one icon',
  'no-hardcoded-color': 'hardcoded colour, palette class or raw text size',
  'no-hardcoded-motion': 'literal duration/easing, or motion with no reduced-motion escape',
  'prefer-tree-shakeable-root': 'compound entry imported where the root would do',
  'no-deprecated-component': 'component marked deprecated in the catalog',
  'prefer-webkit-component': 'foreign UI library where a webkit component exists',
  'prefer-define-model': 'hand-rolled modelValue + update:modelValue pair',
  'no-style-override': 'class/style on a webkit component — restyling it',
  'authoring-standards': 'shared authoring standards (typed slots, comments, deprecation)'
}

const bare = (rule) => rule.replace(/^webkit\//, '')

function parseArgs(argv) {
  const args = argv.slice(2)
  const valueOf = (flag, fallback) => {
    const i = args.indexOf(flag)
    return i === -1 ? fallback : args[i + 1]
  }
  const format = valueOf('--format', 'markdown')
  const failOn = valueOf('--fail-on', 'never')
  if (format !== 'markdown' && format !== 'json') {
    process.stderr.write(`--format must be markdown or json (got "${format}")\n`)
    process.exit(1)
  }
  if (!FAIL_MODES.has(failOn)) {
    process.stderr.write(`--fail-on must be never, new or any (got "${failOn}")\n`)
    process.exit(1)
  }
  return { format, failOn, update: args.includes('--update'), baseline: valueOf('--baseline', BASELINE) }
}

/** Aggregate the ESLint results, keeping only `webkit/*`. */
function collect(results, cwd) {
  const byRule = new Map()
  const byFile = new Map()
  const byExtension = new Map()
  const uiFiles = new Set()
  const keys = []

  for (const result of results) {
    const path = relative(cwd, result.filePath) || result.filePath
    const extension = extensionOf(path)
    if (UI_EXTENSIONS.includes(extension)) uiFiles.add(path)

    for (const message of result.messages) {
      // A fatal parse error carries a null ruleId. It is not a violation, and the file was
      // not measured at all — counting it would inflate the number and hide the breakage.
      const rule = message.ruleId
      if (!rule || !rule.startsWith('webkit/')) continue
      keys.push(`${path}::${rule}`)
      byRule.set(rule, (byRule.get(rule) ?? 0) + 1)
      byExtension.set(extension, (byExtension.get(extension) ?? 0) + 1)
      const entry = byFile.get(path) ?? { count: 0, rules: new Set() }
      entry.count += 1
      entry.rules.add(rule)
      byFile.set(path, entry)
    }
  }

  const dirtyUi = [...byFile.keys()].filter((f) => UI_EXTENSIONS.includes(extensionOf(f)))
  // Share of clean UI files, not of violations: a file counts once however many findings it
  // has, so the number moves when a file is finished rather than when the cheap ones go.
  const score = uiFiles.size === 0 ? 100 : Math.round((1 - dirtyUi.length / uiFiles.size) * 100)

  return {
    total: keys.length,
    keys,
    filesAffected: byFile.size,
    uiFilesTotal: uiFiles.size,
    uiFilesClean: uiFiles.size - dirtyUi.length,
    score,
    byRule: [...byRule.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
    byExtension: [...byExtension.entries()].sort((a, b) => b[1] - a[1]),
    byFile: [...byFile.entries()]
      .map(([file, entry]) => ({ file, count: entry.count, rules: [...entry.rules].sort() }))
      .sort((a, b) => b.count - a.count || a.file.localeCompare(b.file))
  }
}

/**
 * Multiset diff: keys repeat, so a SECOND violation of an already-baselined rule in the
 * same file counts as introduced. A plain Set would let it through.
 */
function diffBaseline(current, baseline) {
  const counts = (list) => {
    const map = new Map()
    for (const key of list) map.set(key, (map.get(key) ?? 0) + 1)
    return map
  }
  const now = counts(current)
  const before = counts(baseline)

  const introduced = []
  for (const [key, n] of now) {
    for (let i = 0; i < n - (before.get(key) ?? 0); i++) introduced.push(key)
  }
  const fixed = []
  for (const [key, n] of before) {
    for (let i = 0; i < n - (now.get(key) ?? 0); i++) fixed.push(key)
  }
  return { introduced: introduced.sort(), fixed: fixed.sort() }
}

function renderMarkdown(report, { catalog, diff, baselinePath }) {
  const out = []
  const push = (line = '') => out.push(line)

  push('## Webkit adoption')
  push()

  if (!catalog.available) {
    push(
      '> **The webkit catalog could not be resolved, so the catalog-backed rules did nothing.** ' +
        'This is not a clean bill of health — check the `@aziontech/webkit` install and run it again.'
    )
    push()
  }

  push(
    catalog.version
      ? `Measured against \`@aziontech/webkit@${catalog.version}\`.`
      : 'Measured against `@aziontech/webkit` (version unknown).'
  )
  push()
  push('| | |')
  push('|---|---|')
  push(`| Violations | **${report.total}** |`)
  push(`| Files affected | ${report.filesAffected} |`)
  push(
    `| UI files clean | ${report.uiFilesClean} of ${report.uiFilesTotal} — **${report.score}%** |`
  )
  if (diff) {
    push(
      `| New since the baseline | ${diff.introduced.length === 0 ? 'none' : `**${diff.introduced.length}**`} |`
    )
    if (diff.fixed.length) push(`| Fixed since the baseline | ${diff.fixed.length} |`)
  }
  push()

  if (diff?.introduced.length) {
    push(`### ${diff.introduced.length} new violation(s) — not in the baseline`)
    push()
    for (const key of diff.introduced) {
      const at = key.lastIndexOf('::')
      push(`- \`${key.slice(0, at)}\` — \`${bare(key.slice(at + 2))}\``)
    }
    push()
  }
  if (diff?.fixed.length) {
    push(
      `_${diff.fixed.length} baseline violation(s) no longer present — prune them with ` +
        '`pnpm report:webkit-adoption --update`._'
    )
    push()
  }

  if (report.total === 0) {
    push('No `webkit/*` violations. Read the coverage note before celebrating.')
    push()
  } else {
    push('### By rule')
    push()
    push('| Rule | Count | What it catches |')
    push('|---|---:|---|')
    for (const [rule, count] of report.byRule) {
      push(`| \`${bare(rule)}\` | ${count} | ${RULE_PURPOSE[bare(rule)] ?? '—'} |`)
    }
    push()
    push('### By file')
    push()
    push('| File | Count | Rules |')
    push('|---|---:|---|')
    const shown = report.byFile.slice(0, 15)
    for (const { file, count, rules } of shown) {
      push(`| \`${file}\` | ${count} | ${rules.map((r) => `\`${bare(r)}\``).join(', ')} |`)
    }
    if (report.byFile.length > shown.length) {
      push()
      push(`_${report.byFile.length - shown.length} more file(s) not shown._`)
    }
    push()
  }

  push('### Coverage — what this did and did not look at')
  push()
  const found = report.byExtension.length
    ? report.byExtension.map(([ext, n]) => `\`.${ext || 'no extension'}\` (${n})`).join(', ')
    : 'none'
  push(`- Violations found in: ${found}.`)
  push(
    `- The score counts ${UI_EXTENSIONS.map((e) => `\`.${e}\``).join(' and ')} files only — those ` +
      'are the ones the design system governs.'
  )
  push(
    '- `no-style-override` does **not** run on `.astro`: it needs vue-eslint-parser\'s template ' +
      'visitor, which astro-eslint-parser does not provide. A restyled component inside an Astro ' +
      'file is invisible here.'
  )
  push(
    '- Raw HTML where a webkit component exists (`<button>`, `<input>`, a hand-rolled modal) is ' +
      'caught by **no rule yet** — `prefer-webkit-component` matches imports from a foreign ' +
      'package, not markup.'
  )
  if (baselinePath) push(`- Baseline: \`${baselinePath}\`.`)
  push()
  push('This report never fails the build on its own. It measures.')
  push()

  return out.join('\n')
}

function main() {
  const { format, failOn, update, baseline } = parseArgs(process.argv)
  const cwd = process.cwd()
  const catalog = readCatalog(cwd)

  if (!catalog.available) {
    process.stderr.write(
      'WARNING: no @aziontech/webkit catalog resolved — the catalog-backed rules were disabled, ' +
        'so this report undercounts.\n'
    )
  }

  process.stderr.write('Linting…\n')
  const lint = runESLint(cwd, ['.'])
  if (!lint.ok) {
    process.stderr.write(`Could not run ESLint: ${lint.reason}\n`)
    process.exit(1)
  }

  const report = collect(lint.results, cwd)
  const baselineAbs = join(cwd, baseline)

  if (update) {
    writeFileSync(baselineAbs, `${JSON.stringify(report.keys.slice().sort(), null, 2)}\n`)
    process.stderr.write(`${baseline} updated: ${report.total} known violation(s) recorded.\n`)
    return
  }

  let diff = null
  if (existsSync(baselineAbs)) {
    try {
      const known = JSON.parse(readFileSync(baselineAbs, 'utf-8'))
      if (!Array.isArray(known)) throw new Error('expected an array of keys')
      diff = diffBaseline(report.keys, known)
    } catch (error) {
      process.stderr.write(
        `Could not read ${baseline} (${error.message}). Re-snapshot it with --update.\n`
      )
      process.exit(1)
    }
  } else if (failOn === 'new') {
    process.stderr.write(
      `--fail-on new needs a baseline and ${baseline} does not exist. Create it once with ` +
        '--update and commit it.\n'
    )
    process.exit(1)
  }

  process.stderr.write(
    `${report.total} webkit/* violation(s) in ${report.filesAffected} file(s); adoption ` +
      `${report.score}%${diff ? `; ${diff.introduced.length} new since the baseline.` : '.'}\n`
  )

  process.stdout.write(
    format === 'json'
      ? `${JSON.stringify(
          {
            webkitVersion: catalog.version,
            catalogAvailable: catalog.available,
            total: report.total,
            filesAffected: report.filesAffected,
            uiFilesTotal: report.uiFilesTotal,
            uiFilesClean: report.uiFilesClean,
            score: report.score,
            byRule: Object.fromEntries(report.byRule),
            byFile: report.byFile,
            introduced: diff?.introduced ?? null,
            fixed: diff?.fixed ?? null
          },
          null,
          2
        )}\n`
      : renderMarkdown(report, {
          catalog,
          diff,
          baselinePath: existsSync(baselineAbs) ? baseline : null
        })
  )

  if (failOn === 'any' && report.total > 0) process.exit(1)
  if (failOn === 'new' && diff && diff.introduced.length > 0) process.exit(1)
}

main()
