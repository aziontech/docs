// Shared plumbing for the two webkit gate scripts.
//
// These scripts are a local stand-in for `webkit report` / `webkit canary`, which are being
// added to @aziontech/webkit itself (aziontech/webkit#964). They live here because the
// commands only reach a consumer through an npm release, and this repo needed the gate
// before that release. When the published package carries them, both scripts and this
// module go away and the CI calls the design system's own reusable workflow instead.

import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

/** Extensions the design system governs — the denominator of the adoption score. */
export const UI_EXTENSIONS = ['vue', 'astro']

/**
 * Run ESLint through this project's `node_modules/.bin/eslint` **shim**, never the Node API
 * and never the resolved bin file.
 *
 * Measured here on 2026-09-10 with eslint 9.39.5, all three on the same files:
 *
 *   new ESLint().lintFiles(['.'])            →  0 findings in .astro (fatal parse error)
 *   node node_modules/…/eslint/bin/eslint.js →  0 findings in .astro (same failure)
 *   node_modules/.bin/eslint                 →  3 findings in .astro (correct)
 *
 * pnpm's shim exports NODE_PATH into its .pnpm directories before exec'ing node; without it
 * ESLint cannot resolve astro-eslint-parser and silently falls back to the default parser.
 * All three paths *succeed* — two just report a smaller number. A gate cannot be quietly
 * wrong, so it uses the same entry point `pnpm lint:eslint` does.
 */
export function runESLint(cwd, patterns, extraArgs = []) {
  const shim = join(
    cwd,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
  )
  if (!existsSync(shim)) {
    return { ok: false, reason: 'no node_modules/.bin/eslint — run pnpm install first' }
  }

  const proc = spawnSync(
    shim,
    [...patterns, '--format', 'json', '--no-error-on-unmatched-pattern', ...extraArgs],
    { cwd, encoding: 'utf-8', maxBuffer: 256 * 1024 * 1024 }
  )
  if (proc.error) return { ok: false, reason: proc.error.message }

  // ESLint exits 1 when it finds errors, which is the normal case here. Only output that
  // is not JSON means the run itself failed.
  let results
  try {
    results = JSON.parse(proc.stdout)
  } catch {
    const detail = (proc.stderr || proc.stdout || '').trim().split('\n').slice(0, 6).join('\n')
    return { ok: false, reason: `ESLint produced no JSON report (exit ${proc.status}).\n${detail}` }
  }
  if (!Array.isArray(results)) return { ok: false, reason: 'the ESLint report was not an array' }
  return { ok: true, results }
}

/**
 * The installed catalog is what the rules validate against. When it does not resolve the
 * plugin disables eight of its twelve rules with a single stderr line — so "clean" and
 * "blind" look identical unless something checks for it.
 */
export function readCatalog(cwd) {
  try {
    const require = createRequire(join(cwd, '__webkit__.js'))
    const path = require.resolve('@aziontech/webkit/catalog.json')
    const catalog = JSON.parse(readFileSync(path, 'utf-8'))
    return { available: true, version: catalog.webkitVersion ?? null }
  } catch {
    return { available: false, version: null }
  }
}

export function extensionOf(path) {
  const base = path.slice(path.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  return dot === -1 ? '' : base.slice(dot + 1)
}
