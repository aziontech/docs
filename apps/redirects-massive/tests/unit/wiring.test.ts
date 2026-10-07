import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { redirects, normalizeUrl } from '../../src/redirects'

const REDIRECTS_DIR = path.resolve(fileURLToPath(import.meta.url), '../../../src/redirects')

/** Every *.json redirect file on disk, relative to the redirects dir. */
function allJsonFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...allJsonFiles(full))
    else if (entry.name.endsWith('.json')) out.push(full)
  }
  return out
}

type Entry = { from?: string; from_regex?: string }

describe('every JSON file is wired into the engine', () => {
  const files = allJsonFiles(REDIRECTS_DIR)
  // The raw sources actually loaded by the engine.
  const loadedExact = new Set(redirects.filter((r) => r.from).map((r) => normalizeUrl(r.from!)))
  const loadedRegex = new Set(redirects.filter((r) => r.from_regex).map((r) => r.from_regex!))

  it('finds redirect files on disk', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it.each(files)('%s is imported (all its entries are loaded)', (file) => {
    const entries: Entry[] = JSON.parse(fs.readFileSync(file, 'utf-8'))
    const missing = entries.filter((e) =>
      e.from_regex ? !loadedRegex.has(e.from_regex) : !loadedExact.has(normalizeUrl(e.from!))
    )
    expect(
      missing,
      `${path.basename(file)} is not wired into src/redirects/index.ts (FILES). ` +
        `Add an import + a FILES entry for it. First missing: ${
          missing[0]?.from ?? missing[0]?.from_regex
        }`
    ).toEqual([])
  })

  it('loads exactly the entries on disk (no file wired twice, none missing)', () => {
    const onDisk = files.reduce(
      (sum, f) => sum + (JSON.parse(fs.readFileSync(f, 'utf-8')) as unknown[]).length,
      0
    )
    expect(redirects.length).toBe(onDisk)
  })
})
