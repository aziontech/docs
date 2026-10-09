#!/usr/bin/env node
/**
 * Validates the redirect data. Read-only — never writes files.
 *
 * Checks: valid JSON arrays; every entry has `from` xor `from_regex` and exactly
 * one of `moved`/`found`; duplicate sources (same `from`); per-language file
 * symmetry; and the 300 KB per-file size budget from Azion's Massive Redirect docs.
 *
 * Duplicate sources are warnings, not errors: the files are separate redirect
 * groups and the engine resolves a repeated source to the LAST file loaded (the
 * `FILES` order in index.ts).
 *
 * Exits non-zero on a hard error (schema) so it can gate CI.
 * Run: `pnpm -F redirects-massive validate`
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const LOCALES = ['en', 'pt-br']
const SIZE_LIMIT_BYTES = 300 * 1024

// Files that legitimately exist for only some locales, so the symmetry check flags
// only accidental omissions.
const EXPECTED_MISSING = new Set([])

/** Same normalization the engine uses, but tolerant of malformed input. */
function normalizeUrl(url) {
  try {
    const parsed = new URL(url)
    return (parsed.host + parsed.pathname.replace(/\/$/, '')).toLowerCase()
  } catch {
    return String(url).toLowerCase()
  }
}

/** All `.json` files under `dir`, recursively (absolute paths). */
function walkJsonFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkJsonFiles(full)
    return entry.name.endsWith('.json') ? [full] : []
  })
}

const relativePath = (file) => path.relative(HERE, file)

/**
 * Validates one entry's schema. Returns its schema errors plus a `kind`:
 * `'regex'` / `'exact'` (with normalized `key` + `target`) / `'skip'`.
 */
function validateEntry(entry, location) {
  const errors = []
  const hasFrom = typeof entry.from === 'string'
  const hasRegex = typeof entry.from_regex === 'string'
  const hasMoved = typeof entry.moved === 'string'
  const hasFound = typeof entry.found === 'string'

  if (hasFrom === hasRegex) errors.push(`${location}: needs exactly one of "from" / "from_regex"`)
  if (hasMoved === hasFound)
    errors.push(`${location}: needs exactly one of "moved" / "found" (JA001)`)

  if (hasRegex) {
    try {
      new RegExp(entry.from_regex)
    } catch (err) {
      errors.push(`${location}: invalid regex — ${err.message}`)
    }
    return { errors, kind: 'regex' }
  }
  if (!hasFrom) return { errors, kind: 'skip' }

  return {
    errors,
    kind: 'exact',
    key: normalizeUrl(entry.from),
    target: entry.moved ?? entry.found
  }
}

/**
 * Reads and validates every file. Returns collected errors, byte total, entry
 * counts, and the exact sources grouped by normalized key (for dedup checks).
 */
function scanFiles(files) {
  const errors = []
  const sourcesByKey = new Map() // normalized `from` -> [{ file, target }]
  let totalBytes = 0
  const fileBytes = [] // [{ file, bytes }]
  let exactCount = 0
  let regexCount = 0

  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8')
    const bytes = Buffer.byteLength(raw)
    totalBytes += bytes
    fileBytes.push({ file: relativePath(file), bytes })

    let entries
    try {
      entries = JSON.parse(raw)
    } catch (err) {
      errors.push(`${relativePath(file)}: invalid JSON — ${err.message}`)
      continue
    }
    if (!Array.isArray(entries)) {
      errors.push(`${relativePath(file)}: top-level value must be an array`)
      continue
    }

    entries.forEach((entry, index) => {
      const result = validateEntry(entry, `${relativePath(file)}[${index}]`)
      errors.push(...result.errors)
      if (result.kind === 'regex') {
        regexCount++
      } else if (result.kind === 'exact') {
        exactCount++
        const occurrences = sourcesByKey.get(result.key) ?? []
        occurrences.push({ file: relativePath(file), target: result.target })
        sourcesByKey.set(result.key, occurrences)
      }
    })
  }

  return { errors, totalBytes, fileBytes, exactCount, regexCount, sourcesByKey }
}

/**
 * Duplicate sources: same normalized `from` with DIFFERENT targets is an
 * overridden source (the last file loaded wins); with the SAME target it is a
 * redundant (safe-to-remove) one. Both are warnings.
 */
function checkDuplicates(sourcesByKey) {
  let overriddenCount = 0
  let redundantCount = 0

  for (const occurrences of sourcesByKey.values()) {
    if (occurrences.length < 2) continue
    const distinctTargets = new Set(occurrences.map((o) => normalizeUrl(o.target)))
    if (distinctTargets.size > 1) overriddenCount++
    else redundantCount++
  }

  const warnings = []
  if (overriddenCount)
    warnings.push(
      `${overriddenCount} source(s) listed with different targets — the last file loaded wins`
    )
  if (redundantCount)
    warnings.push(`${redundantCount} redundant duplicate source(s) (same target) — safe to remove`)
  return { errors: [], warnings }
}

/** Warns when a group exists for some locales but is missing (unexpectedly) in others. */
function checkLocaleSymmetry() {
  const filesByLocale = {}
  for (const locale of LOCALES) {
    const dir = path.join(HERE, locale)
    filesByLocale[locale] = fs.existsSync(dir)
      ? new Set(fs.readdirSync(dir).filter((name) => name.endsWith('.json')))
      : new Set()
  }

  const allGroups = new Set(LOCALES.flatMap((locale) => [...filesByLocale[locale]]))
  const warnings = []
  for (const group of allGroups) {
    const missing = LOCALES.filter(
      (locale) => !filesByLocale[locale].has(group) && !EXPECTED_MISSING.has(`${locale}/${group}`)
    )
    if (missing.length)
      warnings.push(`group "${group}" missing for locale(s): ${missing.join(', ')}`)
  }
  return { warnings }
}

/** Warns when a single file exceeds Azion's per-file budget; reports the total. */
function checkSizeBudget(totalBytes, fileBytes) {
  const kb = (totalBytes / 1024).toFixed(1)
  const warnings = fileBytes
    .filter(({ bytes }) => bytes > SIZE_LIMIT_BYTES)
    .map(
      ({ file, bytes }) =>
        `${file} is ${(bytes / 1024).toFixed(1)} KB — over Azion's 300 KB single-file limit`
    )
  return { warnings, kb }
}

function main() {
  const files = walkJsonFiles(HERE)
  const scan = scanFiles(files)
  const duplicates = checkDuplicates(scan.sourcesByKey)
  const symmetry = checkLocaleSymmetry()
  const size = checkSizeBudget(scan.totalBytes, scan.fileBytes)

  const errors = [...scan.errors, ...duplicates.errors]
  const warnings = [...duplicates.warnings, ...symmetry.warnings, ...size.warnings]

  console.log(
    `Scanned ${files.length} files — ${scan.exactCount} exact + ${scan.regexCount} regex entries, ${size.kb} KB total`
  )
  for (const warning of warnings) console.log(`⚠️  ${warning}`)

  if (errors.length) {
    console.error(`\n❌ ${errors.length} error(s):`)
    for (const error of errors) console.error(`  • ${error}`)
    process.exit(1)
  }
  console.log('✅ redirect data is valid')
}

main()
