import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { afterAll, describe, expect, it } from 'vitest'

// Runs the repository's real content validator (test-frontmatter.js, the last
// step of every `pnpm build:*`) against the real content and against small
// broken fixtures. The script is copied under tests/vitest so that it resolves
// gray-matter from this package instead of the full site install.
const TESTS_DIR = path.resolve(__dirname, '..')
const REPO_ROOT = path.resolve(TESTS_DIR, '../..')
const CONTENT = path.join(REPO_ROOT, 'src/content/docs')
const runDir = mkdtempSync(path.join(TESTS_DIR, '.run-'))
const validator = path.join(runDir, 'test-frontmatter.js')
copyFileSync(path.join(REPO_ROOT, 'test-frontmatter.js'), validator)

afterAll(() => rmSync(runDir, { recursive: true, force: true }))

function validate(cwd: string) {
  const res = spawnSync(process.execPath, [validator], { cwd, encoding: 'utf8' })
  return { status: res.status, output: `${res.stdout}${res.stderr}` }
}

function page(fields: Record<string, string>): string {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${v}`)
  return `---\n${lines.join('\n')}\n---\n\nBody.\n`
}

/** A minimal content tree with one valid page per language plus `extra` files. */
function fixture(extra: Record<string, string> = {}): string {
  const root = mkdtempSync(path.join(runDir, 'fixture-'))
  const files: Record<string, string> = {
    'en/a.mdx': page({ title: 'A', namespace: 'docs_a', permalink: '/documentation/a/' }),
    'pt-br/a.mdx': page({ title: 'A', namespace: 'docs_a', permalink: '/documentacao/a/' }),
    ...extra,
  }
  for (const [rel, body] of Object.entries(files)) {
    const file = path.join(root, 'src/content/docs', rel)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, body)
  }
  return root
}

function contentFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) return contentFiles(full)
    return /\.mdx?$/.test(name) ? [full] : []
  })
}

describe('content validator on the repository content', () => {
  it('accepts the published content (namespaces and permalinks present, valid and unique)', () => {
    const res = validate(REPO_ROOT)
    expect(res.output).not.toMatch(/Duplicate|Invalid characters|missing a/)
    expect(res.status).toBe(0)
  })

  it('finds both language trees with pages to validate', () => {
    const en = contentFiles(path.join(CONTENT, 'en'))
    const ptBr = contentFiles(path.join(CONTENT, 'pt-br'))
    expect(en.length).toBeGreaterThan(100)
    expect(ptBr.length).toBeGreaterThan(100)
  })

  it('every page has a title in its frontmatter', () => {
    const missing = contentFiles(CONTENT)
      .filter((file) => !matter(readFileSync(file, 'utf8')).data.title)
      .map((file) => path.relative(REPO_ROOT, file))
    expect(missing).toEqual([])
  })
})

describe('content validator rejects broken content', () => {
  it('accepts a minimal valid tree', () => {
    expect(validate(fixture()).status).toBe(0)
  })

  it('rejects a duplicate permalink within a language', () => {
    const res = validate(fixture({ 'en/b.mdx': page({ title: 'B', namespace: 'docs_b', permalink: '/documentation/a/' }) }))
    expect(res.status).toBe(1)
    expect(res.output).toMatch(/Duplicate permalink found: '\/documentation\/a\/'/)
  })

  it('rejects a duplicate namespace within a language', () => {
    const res = validate(fixture({ 'pt-br/b.mdx': page({ title: 'B', namespace: 'docs_a', permalink: '/documentacao/b/' }) }))
    expect(res.status).toBe(1)
    expect(res.output).toMatch(/Duplicate namespace found: 'docs_a'/)
  })

  it('rejects a permalink with invalid characters', () => {
    const res = validate(fixture({ 'en/b.mdx': page({ title: 'B', namespace: 'docs_b', permalink: '/documentation/Bad_Link/' }) }))
    expect(res.status).toBe(1)
    expect(res.output).toMatch(/Invalid characters found in permalink/)
  })

  it('rejects a page without a namespace', () => {
    const res = validate(fixture({ 'en/b.mdx': page({ title: 'B', permalink: '/documentation/b/' }) }))
    expect(res.status).toBe(1)
    expect(res.output).toMatch(/missing a 'namespace' field/)
  })
})
