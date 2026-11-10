import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import glob from 'fast-glob';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import ts from 'typescript';
import { visit } from 'unist-util-visit';

/**
 * Checks that the code samples in the docs are what they claim to be: a `json` block parses, a
 * JavaScript or TypeScript block is free of syntax errors, and the JSON body of a `curl --data` in a
 * shell block parses. Readers paste these samples into the Console, a terminal, or a function, and a
 * sample that cannot parse fails there, far from the page that caused it.
 *
 * The check reads the conventions the docs use on purpose and does not count them as errors:
 *
 * - a bare `<placeholder>` where a value goes, such as `"id": <rule-id>`;
 * - an elision, `...` or `…`, standing for members, elements, or statements left out;
 * - a fragment: the members of an object without its braces, an object literal, or the body of a
 *   class or interface;
 * - a `diff` in the fence meta (```javascript diff): the removed and the added side are each checked;
 * - a `jsonc` block may carry comments and trailing commas, and a `jsonl` block holds one JSON value
 *   per line.
 *
 * A block that is partial on purpose, such as a function split across two steps, opts out with
 * `nolint` in its fence meta (```typescript nolint). Nothing renders the meta, so readers never see it.
 *
 *   node scripts/lint-codeblocks.mjs              every page
 *   node scripts/lint-codeblocks.mjs <file>...    only these files (paths from where pnpm ran)
 */

const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const DOCS_ROOT = fileURLToPath(new URL('../', import.meta.url));
const DEFAULT_GLOBS = ['src/content/docs/**/*.{md,mdx}', 'src/includes/**/*.{md,mdx}'];

const JSON_LANGS = new Set(['json', 'jsonc', 'jsonl', 'ndjson']);
/** @type {Map<string, 'js' | 'jsx' | 'ts' | 'tsx'>} */
const JS_LANGS = new Map([
	['js', 'js'],
	['javascript', 'js'],
	['mjs', 'js'],
	['cjs', 'js'],
	['jsx', 'jsx'],
	['ts', 'ts'],
	['typescript', 'ts'],
	['tsx', 'tsx'],
]);
const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'zsh']);
const CURL_DATA_FLAGS = new Set([
	'-d',
	'--data',
	'--data-raw',
	'--data-binary',
	'--data-ascii',
	'--json',
]);

/**
 * @typedef {{ file: string, line: number, lang: string, message: string }} Issue
 */

// ---------------------------------------------------------------------------------------------
// JSON
// ---------------------------------------------------------------------------------------------

/** Index just past the string that opens at `start`, honoring escapes. */
function stringEnd(text, start) {
	for (let i = start + 1; i < text.length; i++) {
		if (text[i] === '\\') i++;
		else if (text[i] === '"') return i + 1;
		else if (text[i] === '\n') return i;
	}
	return text.length;
}

/** The next character that is not whitespace, at or after `from`. */
function nextSignificant(text, from) {
	const match = /\S/.exec(text.slice(from));
	return match ? match[0] : '';
}

/**
 * Rewrites, outside strings only, the documentation conventions into valid JSON: a bare
 * `<placeholder>` becomes `null`, an elision becomes an elided member or element, and, for `jsonc`,
 * comments and trailing commas go away. Line breaks are kept, so a parse error keeps its line.
 */
function normalizeJson(text, { jsonc = false } = {}) {
	let out = '';
	/** @type {string[]} */
	const stack = [];
	// What the grammar accepts next: an object key, a value, or what follows a key or a value.
	let expect = 'value';

	for (let i = 0; i < text.length; i++) {
		const c = text[i];

		if (c === '"') {
			const end = stringEnd(text, i);
			out += text.slice(i, end);
			i = end - 1;
			expect = 'after';
			continue;
		}
		if (jsonc && c === '/' && text[i + 1] === '/') {
			const end = text.indexOf('\n', i);
			const stop = end === -1 ? text.length : end;
			out += ' '.repeat(stop - i);
			i = stop - 1;
			continue;
		}
		if (jsonc && c === '/' && text[i + 1] === '*') {
			const end = text.indexOf('*/', i + 2);
			const stop = end === -1 ? text.length : end + 2;
			out += text.slice(i, stop).replace(/[^\n]/g, ' ');
			i = stop - 1;
			continue;
		}
		if (c === '{' || c === '[') {
			stack.push(c);
			expect = c === '{' ? 'key' : 'value';
			out += c;
			continue;
		}
		if (c === '}' || c === ']') {
			stack.pop();
			expect = 'after';
			out += c;
			continue;
		}
		if (c === ',') {
			if (jsonc && '}]'.includes(nextSignificant(normalizeTail(text, i + 1, jsonc), 0))) {
				out += ' ';
				continue;
			}
			expect = stack.at(-1) === '{' ? 'key' : 'value';
			out += c;
			continue;
		}
		if (c === ':') {
			expect = 'value';
			out += c;
			continue;
		}

		const elision = text.startsWith('...', i) ? 3 : c === '…' ? 1 : 0;
		if (elision) {
			const inObject = stack.at(-1) === '{';
			const asValue = expect === 'value' && out.trimEnd().at(-1) === ':';
			let replacement = inObject && !asValue ? '"__elided__": null' : 'null';
			const previous = out.trimEnd().at(-1);
			if (!asValue && previous && !'{[,'.includes(previous)) replacement = `,${replacement}`;
			const next = nextSignificant(text, i + elision);
			if (next && !',}]'.includes(next)) replacement += ',';
			out += replacement;
			expect = 'after';
			i += elision - 1;
			continue;
		}

		if (c === '<') {
			const placeholder = /^<[A-Za-z_][^<>\n"]{0,80}>/.exec(text.slice(i));
			if (placeholder) {
				out += expect === 'key' ? '"__placeholder__"' : 'null';
				expect = 'after';
				i += placeholder[0].length - 1;
				continue;
			}
		}

		if (!/\s/.test(c)) expect = 'after';
		out += c;
	}
	return out;
}

/** The rest of the text with comments blanked, to see what a `jsonc` comma is followed by. */
function normalizeTail(text, from, jsonc) {
	const tail = text.slice(from);
	return jsonc ? tail.replace(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g, ' ') : tail;
}

/** True when every bracket outside strings is closed by its own kind. */
function balanced(text) {
	const stack = [];
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (c === '"') i = stringEnd(text, i) - 1;
		else if (c === '{' || c === '[') stack.push(c);
		else if (c === '}' && stack.pop() !== '{') return false;
		else if (c === ']' && stack.pop() !== '[') return false;
	}
	return stack.length === 0;
}

class JsonError extends Error {
	constructor(message, offset) {
		super(message);
		this.offset = offset;
	}
}

/**
 * Validates one JSON document (RFC 8259) and says where it breaks. `JSON.parse` would do for the
 * verdict, but for an unexpected token V8 reports no position, and a finding without its line
 * sends the author hunting.
 */
function validateJson(text) {
	let i = 0;
	const fail = (message, at = i) => {
		throw new JsonError(message, at);
	};
	const describe = () => (i >= text.length ? 'the end of the block' : `\`${text[i]}\``);
	const space = () => {
		while (i < text.length && ' \t\n\r'.includes(text[i])) i++;
	};
	const comment = () =>
		text[i] === '/' && (text[i + 1] === '/' || text[i + 1] === '*')
			? fail('JSON has no comments: explain the value in the text around the block')
			: null;

	const string = () => {
		const start = i++;
		while (i < text.length) {
			const c = text[i];
			if (c === '"') {
				i++;
				return;
			}
			if (c < ' ') fail('A string is not closed, or holds a raw line break or tab', start);
			if (c === '\\') {
				const escape = text[i + 1];
				if (escape === 'u' && /^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) i += 6;
				else if (escape !== undefined && '"\\/bfnrt'.includes(escape)) i += 2;
				else fail('Invalid escape sequence in a string');
				continue;
			}
			i++;
		}
		fail('A string is not closed', start);
	};

	const value = () => {
		space();
		comment();
		const c = text[i];
		if (c === '{') return object();
		if (c === '[') return array();
		if (c === '"') return string();
		const literal = /^(?:-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null)/.exec(
			text.slice(i)
		);
		if (literal && !/^[\w$]/.test(text.slice(i + literal[0].length))) {
			i += literal[0].length;
			return;
		}
		fail(`Expected a value, found ${describe()}`);
	};

	const members = (close, item, what) => {
		i++;
		space();
		comment();
		if (text[i] === close) {
			i++;
			return;
		}
		for (;;) {
			item();
			space();
			comment();
			if (text[i] === close) {
				i++;
				return;
			}
			if (text[i] !== ',')
				fail(`Expected \`,\` or \`${close}\` after ${what}, found ${describe()}`);
			const comma = i++;
			space();
			comment();
			if (text[i] === close) fail(`Trailing comma before \`${close}\``, comma);
		}
	};

	const object = () =>
		members(
			'}',
			() => {
				space();
				comment();
				if (text[i] !== '"') fail(`Expected a double-quoted property name, found ${describe()}`);
				string();
				space();
				if (text[i] !== ':') fail(`Expected \`:\` after a property name, found ${describe()}`);
				i++;
				value();
			},
			'a property'
		);
	const array = () => members(']', value, 'an element');

	try {
		value();
		space();
		comment();
		if (i < text.length) fail(`Unexpected text after the JSON value: ${describe()}`);
		return null;
	} catch (error) {
		if (!(error instanceof JsonError)) throw error;
		const offset = Math.min(error.offset, text.length);
		return { message: error.message, line: text.slice(0, offset).split('\n').length };
	}
}

/**
 * Checks a JSON sample. Returns null when it parses once the documentation conventions are read
 * as such, or `{ message, line }` with the line inside the sample (1-based).
 */
function checkJson(code, lang = 'json') {
	if (lang === 'jsonl' || lang === 'ndjson') {
		const lines = code.split('\n');
		for (let i = 0; i < lines.length; i++) {
			if (!lines[i].trim()) continue;
			const error = validateJson(normalizeJson(lines[i]));
			if (error) return { message: error.message, line: i + 1 };
		}
		return null;
	}

	const normalized = normalizeJson(code, { jsonc: lang === 'jsonc' });
	const error = validateJson(normalized);
	if (!error) return null;

	// A fragment: the members of an object shown without its braces. Only when every bracket is
	// closed, so a missing `}` at the end is never "fixed" by the wrapper.
	const trimmed = normalized.trim();
	if (trimmed.startsWith('"')) {
		if (!balanced(trimmed)) {
			return {
				message: 'A fragment of members has to close every bracket it opens',
				line: error.line,
			};
		}
		if (!validateJson(`{${normalized}}`)) return null;
	}

	const first = trimmed[0];
	if (first && !'{["-0123456789tfn'.includes(first)) {
		return {
			message: `${error.message}. This does not look like JSON: check the block's language tag`,
			line: error.line,
		};
	}
	const lines = code.split('\n').filter((line) => line.trim());
	if (lines.length > 1 && lines.every((line) => !validateJson(normalizeJson(line)))) {
		return { message: 'One JSON value per line: tag the block jsonl', line: 1 };
	}
	return error;
}

// ---------------------------------------------------------------------------------------------
// JavaScript and TypeScript
// ---------------------------------------------------------------------------------------------

/** Syntax errors only: the sample is checked as written, with no types or imports resolved. */
function syntaxErrors(code, kind) {
	const { diagnostics = [] } = ts.transpileModule(code, {
		fileName: `sample.${kind}`,
		reportDiagnostics: true,
		compilerOptions: {
			target: ts.ScriptTarget.ESNext,
			module: ts.ModuleKind.ESNext,
			moduleDetection: ts.ModuleDetectionKind.Force,
			jsx: ts.JsxEmit.Preserve,
			allowJs: true,
		},
	});
	return diagnostics.filter((d) => d.category === ts.DiagnosticCategory.Error && d.file);
}

/** `...` that stands for omitted code, not spread syntax: nothing follows it but a closer. */
function elide(code) {
	return code.replace(/…/g, '/*…*/').replace(/\.\.\.(?=\s*(?:[}\]),;]|$))/gm, '/*…*/');
}

/** Checks a JavaScript or TypeScript sample; returns null or `{ message, line }` (1-based). */
function checkScript(code, kind) {
	if (!syntaxErrors(code, kind).length) return null;

	const elided = elide(code);
	const typed = kind === 'ts' || kind === 'tsx';
	const attempts = [
		elided,
		`(\n${elided}\n)`,
		`[\n${elided}\n]`,
		`({\n${elided}\n})`,
		`class _ {\n${elided}\n}`,
		...(typed ? [`interface _ {\n${elided}\n}`] : []),
	];
	if (attempts.some((attempt) => !syntaxErrors(attempt, kind).length)) return null;

	const [diagnostic] = syntaxErrors(elided, kind);
	const { line } = ts.getLineAndCharacterOfPosition(diagnostic.file, diagnostic.start ?? 0);
	return { message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '), line: line + 1 };
}

/** One side of a diff block: the lines it keeps, without their markers, and where each came from. */
function diffSide(code, dropped) {
	const lines = [];
	const origin = [];
	code.split('\n').forEach((line, index) => {
		if (line.startsWith(dropped)) return;
		lines.push(/^[+\- ]/.test(line) ? line.slice(1) : line);
		origin.push(index + 1);
	});
	return { code: lines.join('\n'), origin };
}

function checkDiff(code, kind) {
	for (const [dropped, side] of [
		['-', 'added'],
		['+', 'removed'],
	]) {
		const { code: sideCode, origin } = diffSide(code, dropped);
		const error = checkScript(sideCode, kind);
		if (error) {
			return {
				message: `${error.message} (${side} side of the diff)`,
				line: origin[error.line - 1] ?? 1,
			};
		}
	}
	return null;
}

// ---------------------------------------------------------------------------------------------
// curl bodies in shell blocks
// ---------------------------------------------------------------------------------------------

/**
 * Splits a shell block into commands made of words, joining quoted parts the way the shell does
 * (`'a'"'"'b'` is one word). A word that expands a variable is marked `dynamic`: its value is only
 * known when it runs.
 *
 * @returns {{ value: string, line: number, dynamic: boolean }[][]}
 */
function shellCommands(text) {
	const commands = [];
	let words = [];
	let word = null;
	let line = 0;
	const push = () => {
		if (word) words.push(word);
		word = null;
	};
	const end = () => {
		push();
		if (words.length) commands.push(words);
		words = [];
	};

	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (c === '\\' && text[i + 1] === '\n') {
			push();
			line++;
			i++;
			continue;
		}
		if (c === '\n') {
			end();
			line++;
			continue;
		}
		if (c === ' ' || c === '\t') {
			push();
			continue;
		}
		if (c === ';' || c === '|' || c === '&') {
			end();
			continue;
		}
		if (c === '#' && !word) {
			const stop = text.indexOf('\n', i);
			i = (stop === -1 ? text.length : stop) - 1;
			continue;
		}

		word ??= { value: '', line, dynamic: false };
		if (c === "'") {
			const close = text.indexOf("'", i + 1);
			const stop = close === -1 ? text.length : close;
			const part = text.slice(i + 1, stop);
			word.value += part;
			line += part.split('\n').length - 1;
			i = stop;
		} else if (c === '"') {
			let j = i + 1;
			for (; j < text.length && text[j] !== '"'; j++) {
				if (text[j] === '\\' && '"\\$`\n'.includes(text[j + 1])) {
					j++;
					if (text[j] !== '\n') word.value += text[j];
					else line++;
					continue;
				}
				if (text[j] === '$' || text[j] === '`') word.dynamic = true;
				if (text[j] === '\n') line++;
				word.value += text[j];
			}
			i = j;
		} else if (c === '\\') {
			word.value += text[i + 1] ?? '';
			i++;
		} else {
			if (c === '$' || c === '`') word.dynamic = true;
			word.value += c;
		}
	}
	end();
	return commands;
}

/** Every JSON body passed to curl in a shell block, with the block line it starts on (1-based). */
function curlBodies(code) {
	const bodies = [];
	for (const words of shellCommands(code)) {
		if (!words.some((word) => word.value === 'curl')) continue;
		words.forEach((word, index) => {
			let body = null;
			if (CURL_DATA_FLAGS.has(word.value)) body = words[index + 1];
			else {
				const inline = /^(--data(?:-raw|-binary|-ascii)?|--json)=/.exec(word.value);
				if (inline) body = { ...word, value: word.value.slice(inline[0].length) };
			}
			if (!body || body.dynamic) return;
			const value = body.value.trim();
			if (!value.startsWith('{') && !value.startsWith('[')) return;
			bodies.push({ value: body.value, line: body.line + 1 });
		});
	}
	return bodies;
}

// ---------------------------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------------------------

const mdxParser = remark().use(remarkMdx);
const mdParser = remark();

/** Blanks the frontmatter but keeps its lines, so every line number stays true to the file. */
function withoutFrontmatter(source) {
	return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, (block) => block.replace(/[^\n]/g, ''));
}

/** @returns {Issue[]} */
function lintFile(absolute) {
	const file = path.relative(REPO_ROOT, absolute);
	const source = withoutFrontmatter(fs.readFileSync(absolute, 'utf8'));
	/** @type {Issue[]} */
	const issues = [];

	let tree;
	try {
		tree = (absolute.endsWith('.mdx') ? mdxParser : mdParser).parse(source);
	} catch (error) {
		return [
			{
				file,
				line: error.line ?? 1,
				lang: 'mdx',
				message: `Cannot parse the page: ${error.reason ?? error.message}`,
			},
		];
	}

	visit(tree, 'code', (node) => {
		const lang = (node.lang ?? '').toLowerCase();
		const meta = (node.meta ?? '').split(/\s+/);
		if (meta.includes('nolint') || !node.position) return;
		// The fence is on the start line; the first line of code is the one after it.
		const at = (line) => node.position.start.line + line;

		if (JSON_LANGS.has(lang)) {
			const error = checkJson(node.value, lang);
			if (error) issues.push({ file, line: at(error.line), lang, message: error.message });
		} else if (JS_LANGS.has(lang)) {
			const kind = JS_LANGS.get(lang);
			const error = meta.includes('diff')
				? checkDiff(node.value, kind)
				: checkScript(node.value, kind);
			if (error) issues.push({ file, line: at(error.line), lang, message: error.message });
		} else if (SHELL_LANGS.has(lang)) {
			for (const body of curlBodies(node.value)) {
				const error = checkJson(body.value);
				if (error) {
					issues.push({
						file,
						line: at(body.line + error.line - 1),
						lang: `${lang}: curl body`,
						message: error.message,
					});
				}
			}
		}
	});
	return issues;
}

/** The files to check: the arguments, resolved from where pnpm ran, or every page. */
function targets(args) {
	if (!args.length) {
		return glob.sync(DEFAULT_GLOBS, { cwd: DOCS_ROOT, absolute: true }).sort();
	}
	const base = process.env.INIT_CWD ?? process.cwd();
	return args
		.map((arg) => path.resolve(base, arg))
		.filter((file) => /\.mdx?$/.test(file) && fs.existsSync(file));
}

/** Workflow commands carry their message on one line, with these characters escaped. */
function escapeAnnotation(text) {
	return text.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

/** A property of a workflow command also escapes the characters that separate properties. */
function escapeProperty(text) {
	return escapeAnnotation(text).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

function report(issues, checked) {
	const inGitHub = process.env.GITHUB_ACTIONS === 'true';
	for (const issue of issues) {
		console.log(`${issue.file}:${issue.line} [${issue.lang}] ${issue.message}`);
		if (inGitHub) {
			const properties = [
				`file=${escapeProperty(issue.file)}`,
				`line=${issue.line}`,
				`title=${escapeProperty(`Code block (${issue.lang})`)}`,
			].join(',');
			console.log(`::warning ${properties}::${escapeAnnotation(issue.message)}`);
		}
	}

	const files = new Set(issues.map((issue) => issue.file)).size;
	const summary = issues.length
		? `Found ${issues.length} code block issues in ${files} of ${checked} files`
		: `Found no code block issues in ${checked} files`;

	if (process.env.GITHUB_STEP_SUMMARY) {
		const rows = issues
			.slice(0, 200)
			.map(
				(issue) =>
					`| \`${issue.file}:${issue.line}\` | ${issue.lang} | ${issue.message.replace(/\|/g, '\\|')} |`
			);
		const body = [
			'## Code blocks',
			'',
			summary + '.',
			'',
			...(issues.length
				? [
						'| Where | Block | Problem |',
						'| --- | --- | --- |',
						...rows,
						...(issues.length > rows.length
							? ['', `And ${issues.length - rows.length} more.`]
							: []),
						'',
						'This check does not block the merge: the PR author decides whether to fix it here.',
						'A block that is partial on purpose opts out with `nolint` in its fence meta.',
					]
				: []),
		];
		fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${body.join('\n')}\n`);
	}

	// The summary line comes last: it is the line a reader, or a script, looks for.
	console.log(summary);
}

const files = targets(process.argv.slice(2));
const issues = files.flatMap(lintFile);
report(issues, files.length);
process.exit(issues.length ? 1 : 0);
