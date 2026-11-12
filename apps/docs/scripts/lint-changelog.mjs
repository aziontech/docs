import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slug } from 'github-slugger';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';

/**
 * Checks the entries of the changelog pages, each one a `DocUpdate`, against the rules of the style
 * guide's Changelog page (style-guide/content/changelog.mdx).
 *
 * Every entry, old or new, is checked for what breaks the page for a reader today:
 *
 * - anchor: present, unique on the page, and starting with the date of its label as a slug, so a
 *   link to `#<date>` opens the entry of that date;
 * - order: dates run newest first;
 * - quotes: `label` and `anchor` in double quotes, the only form the page outline reads.
 *
 * An entry dated after NEW_AFTER also gets the rest of the rules. The log is append-only, so an older
 * entry is a record: it is never rewritten to meet rules written after it.
 *
 * - label: `October 22, 2026` in en, `22 de outubro de 2026` in pt-br;
 * - anchor: the date as a slug, or the date and the tag as a slug for another entry on that date;
 * - tags: exactly one, from TAGS;
 * - description: when present, `Version <x.y.z>` in en, `Versão <x.y.z>` in pt-br;
 * - closing link: the last paragraph is `For more information, refer to [...](/en/...).` in en,
 *   `Para mais informações, consulte [...](/pt-br/...).` in pt-br;
 * - blank lines: one after the opening tag and one before the closing tag, or the notes render as
 *   a single literal paragraph.
 *
 * A label the script cannot read as a date is reported when the entry sits above every older entry,
 * where new entries go, and skipped below them, where it can only be a historic record.
 *
 *   node scripts/lint-changelog.mjs              the changelog pages
 *   node scripts/lint-changelog.mjs <file>...    only these files (paths from where pnpm ran)
 */

const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const DOCS_ROOT = fileURLToPath(new URL('../', import.meta.url));

/** The pages made of `DocUpdate` entries. A page that moves must move here too. */
const CHANGELOG_PAGES = [
	'src/content/docs/en/pages/main-menu/release-notes/release-notes.mdx',
	'src/content/docs/pt-br/pages/menu-principal/release-notes/release-notes.mdx',
	'src/content/docs/en/pages/changelog/previous-years/previous-years-changelog.mdx',
	'src/content/docs/pt-br/pages/changelog/anos-passados/anos-passados-changelog.mdx',
];

/** The newest entry when this check was added. Entries dated after it get every rule. */
const NEW_AFTER = { year: 2026, month: 10, day: 22 };

/**
 * The closed tag list: the Platform Resources and products of the current catalog, plus the
 * channels the release notes report on. An entry covers one of them. CONTRIBUTING.md lists the same
 * names, so change both together.
 */
const TAGS = new Set([
	// Platform Resources and channels
	'Azion API',
	'Azion CLI',
	'Azion Console',
	'Azion MCP servers',
	'Terraform Provider',
	'DevTools & Integrations',
	'Marketplace',
	'GraphQL API',
	'Applications',
	'Firewall',
	'Connectors',
	'Workloads',
	'Certificate Manager',
	'Custom Pages',
	'DDoS Protection',
	'Real-Time Purge',
	'Copilot',
	'Real-Time Metrics',
	// Build
	'AI Inference',
	'Application Accelerator',
	'Cache',
	'Durable Objects',
	'Functions',
	'Image Processor',
	'Live Ingest',
	'LoRA Fine-Tune',
	'Orchestrator',
	// Store
	'KV Store',
	'Object Storage',
	'SQL Database',
	// Secure
	'AI Gateway',
	'Bot Manager',
	'Edge DNS',
	'Load Balancer',
	'Network Shield',
	'Origin Shield',
	'Secure Internet Access',
	'WAF',
	// Observe
	'Data Stream',
	'Edge Pulse',
	'Real-Time Events',
]);

/** Tags the pages have used, and earlier names, mapped to the tag that replaces them. */
const TAG_ALIASES = new Map(
	Object.entries({
		console: 'Azion Console',
		'real-time manager': 'Azion Console',
		api: 'Azion API',
		'azion apis': 'Azion API',
		'edge api': 'Azion API',
		'api v4': 'Azion API',
		'api v4 (preview)': 'Azion API',
		'functions api': 'Azion API',
		cli: 'Azion CLI',
		mcp: 'Azion MCP servers',
		'mcp servers': 'Azion MCP servers',
		'azion mcp': 'Azion MCP servers',
		graphql: 'GraphQL API',
		'azion copilot': 'Copilot',
		'edge application': 'Applications',
		'edge applications': 'Applications',
		'edge firewall': 'Firewall',
		'edge connector': 'Connectors',
		'edge connectors': 'Connectors',
		'edge ai': 'AI Inference',
		'application acceleration': 'Application Accelerator',
		'edge cache': 'Cache',
		'edge functions': 'Functions',
		'image processing': 'Image Processor',
		'edge orchestrator': 'Orchestrator',
		'edge kv': 'KV Store',
		'edge storage': 'Object Storage',
		'object storage rest api': 'Object Storage',
		'edge sql': 'SQL Database',
		'edge sql vector search': 'SQL Database',
		'network layer protection': 'Network Shield',
		'web application firewall': 'WAF',
		'web application firewall (waf)': 'WAF',
		'data streaming': 'Data Stream',
		'digital certificates': 'Certificate Manager',
		'devtools & integrações': 'DevTools & Integrations',
		'vector search do edge sql': 'SQL Database',
	})
);
const TAGS_BY_CASE = new Map([...TAGS].map((tag) => [tag.toLowerCase(), tag]));

const MONTHS = {
	en: [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	],
	'pt-br': [
		'janeiro',
		'fevereiro',
		'março',
		'abril',
		'maio',
		'junho',
		'julho',
		'agosto',
		'setembro',
		'outubro',
		'novembro',
		'dezembro',
	],
};

/** What differs between the two languages: the label, the version line, and the closing link. */
const LANGUAGES = {
	en: {
		label: ({ year, month, day }) => `${MONTHS.en[month - 1]} ${day}, ${year}`,
		version: 'Version',
		closing: 'For more information, refer to ',
		linkPrefix: '/en/',
		closingExample:
			'For more information, refer to [<the documenting page>](/en/documentation/.../).',
	},
	'pt-br': {
		label: ({ year, month, day }) => `${day} de ${MONTHS['pt-br'][month - 1]} de ${year}`,
		version: 'Versão',
		closing: 'Para mais informações, consulte ',
		linkPrefix: '/pt-br/',
		closingExample:
			'Para mais informações, consulte [<a página que documenta a mudança>](/pt-br/documentacao/.../).',
	},
};

/** @typedef {{ year: number, month: number, day: number }} EntryDate  day is 0 for a month-only label */
/** @typedef {{ file: string, line: number, rule: string, message: string }} Issue */

const parser = remark().use(remarkMdx);

/** Lowercase with the accents dropped: `Março` and `marco` read the same. */
function fold(text) {
	return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

/** The anchor a label or a tag turns into, the way the existing anchors were written. */
function slugOf(text) {
	return slug(fold(text));
}

function monthNumber(name, language) {
	const index = MONTHS[language].findIndex((month) => fold(month) === fold(name));
	return index + 1;
}

function realDay(year, month, day) {
	const date = new Date(Date.UTC(year, month - 1, day));
	return date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

/**
 * Reads the date of a label in any form the pages have used: the current one, the comma form
 * (`14 de outubro, 2026`), a leading zero, or a historic month-only label (`June, 2023`).
 * `strict` says whether the label is written in the current form.
 *
 * @returns {(EntryDate & { strict: boolean }) | null}
 */
function readDate(label, language) {
	const text = label.trim();
	const full =
		language === 'en'
			? text.match(/^(?<month>\p{L}+) (?<day>\d{1,2}),? (?<year>\d{4})$/u)
			: text.match(/^(?<day>\d{1,2}) de (?<month>\p{L}+)(?:,| de) (?<year>\d{4})$/u);
	const monthOnly = text.match(/^(?<month>\p{L}+),? (?:de )?(?<year>\d{4})$/u);
	const groups = (full ?? monthOnly)?.groups;
	if (!groups) return null;

	const year = Number(groups.year);
	const month = monthNumber(groups.month, language);
	const day = full ? Number(groups.day) : 0;
	if (!month || (day && !realDay(year, month, day))) return null;
	return {
		year,
		month,
		day,
		strict: day > 0 && text === LANGUAGES[language].label({ year, month, day }),
	};
}

/** Newest first: positive when `a` is newer than `b`. Compares months when either has no day. */
function compareDates(a, b) {
	const months = a.year * 12 + a.month - (b.year * 12 + b.month);
	return months || !a.day || !b.day ? months : a.day - b.day;
}

/** The end of an opening tag: the first `>` outside a quoted value or an expression. */
function openingTagEnd(source, start) {
	let quote = '';
	let depth = 0;
	for (let i = start; i < source.length; i++) {
		const char = source[i];
		if (quote) {
			if (char === quote) quote = '';
		} else if (char === '"' || char === "'" || char === '`') {
			quote = char;
		} else if (char === '{') {
			depth++;
		} else if (char === '}') {
			depth--;
		} else if (char === '>' && depth === 0) {
			return i + 1;
		}
	}
	return source.length;
}

function lineAt(source, offset) {
	let line = 1;
	for (let i = 0; i < offset; i++) if (source[i] === '\n') line++;
	return line;
}

/** @returns {{ tags: string[] } | { missing: true } | { error: string }} */
function readTags(attribute) {
	if (!attribute) return { missing: true };
	if (typeof attribute.value === 'string') {
		return { error: `\`tags\` takes an array, not a string: tags={['${attribute.value}']}.` };
	}
	const expression = attribute.value?.data?.estree?.body?.[0]?.expression;
	const literal = (element) => element?.type === 'Literal' && typeof element.value === 'string';
	if (expression?.type !== 'ArrayExpression' || !expression.elements.every(literal)) {
		return { error: "`tags` takes an array of quoted names: tags={['Azion CLI']}." };
	}
	return { tags: expression.elements.map((element) => element.value) };
}

/** What to write instead of a tag outside the list, when the script knows it. */
function suggestTag(tag) {
	const key = tag.trim().toLowerCase();
	return TAGS_BY_CASE.get(key) ?? TAG_ALIASES.get(key);
}

/** Blanks the frontmatter but keeps its lines, so every line number stays true to the file. */
function withoutFrontmatter(source) {
	return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, (block) => block.replace(/[^\n]/g, ''));
}

/** @returns {Issue[]} */
function lintFile(absolute, totals) {
	const file = path.relative(REPO_ROOT, absolute);
	const language = /\/pt-br\//.test(absolute.split(path.sep).join('/')) ? 'pt-br' : 'en';
	const rules = LANGUAGES[language];
	const source = withoutFrontmatter(fs.readFileSync(absolute, 'utf8'));
	/** @type {Issue[]} */
	const issues = [];
	const flag = (line, rule, message) => issues.push({ file, line, rule, message });

	let tree;
	try {
		tree = parser.parse(source);
	} catch (error) {
		return [
			{
				file,
				line: error.line ?? 1,
				rule: 'mdx',
				message: `Cannot parse the page: ${error.reason ?? error.message}`,
			},
		];
	}

	/** @type {import('mdast-util-mdx-jsx').MdxJsxFlowElement[]} */
	const nodes = [];
	visit(tree, 'mdxJsxFlowElement', (node) => {
		if (node.name === 'DocUpdate' && node.position) nodes.push(node);
	});

	/** @type {Map<string, number>} */
	const anchors = new Map();
	/** @type {{ date: EntryDate, label: string, line: number } | null} */
	let previous = null;
	let olderSeen = false;

	for (const node of nodes) {
		totals.entries++;
		const line = node.position.start.line;
		const attributes = new Map(
			node.attributes
				.filter((attribute) => attribute.type === 'mdxJsxAttribute')
				.map((attribute) => [attribute.name, attribute])
		);
		const text = (name) => {
			const value = attributes.get(name)?.value;
			return typeof value === 'string' ? value : undefined;
		};
		const label = text('label') ?? '';
		const anchor = text('anchor');
		const date = readDate(label, language);
		const isNew = date ? compareDates(date, NEW_AFTER) > 0 : !olderSeen;
		if (date && !isNew) olderSeen = true;
		if (isNew) totals.fresh++;
		const openEnd = openingTagEnd(source, node.position.start.offset);
		const opening = source.slice(node.position.start.offset, openEnd);

		// Every entry: what breaks the page for a reader today.
		// The outline (src/util/docUpdateHeadings.ts) reads only double-quoted values.
		for (const name of ['label', 'anchor']) {
			if (text(name) !== undefined && !new RegExp(`\\b${name}="`).test(opening)) {
				flag(
					line,
					'quotes',
					`Write \`${name}\` in double quotes, ${name}="...": the page outline reads only double-quoted values, so it leaves this entry out.`
				);
			}
		}
		if (!anchor) {
			flag(
				line,
				'anchor',
				`The entry has no \`anchor\`: the page outline links each date by its anchor.`
			);
		} else if (anchors.has(anchor)) {
			flag(
				line,
				'anchor',
				`Anchor \`${anchor}\` is already used by the entry on line ${anchors.get(anchor)}, so \`#${anchor}\` opens that entry.`
			);
		} else {
			anchors.set(anchor, line);
		}

		if (date) {
			if (previous && compareDates(date, previous.date) > 0) {
				flag(
					line,
					'order',
					`\`${label}\` is newer than \`${previous.label}\` on line ${previous.line}, above it: entries run newest first.`
				);
			}
			previous = { date, label, line };
		}

		const dateSlug = date ? slugOf(label) : '';
		if (date && !isNew && anchor && anchor !== dateSlug && !anchor.startsWith(`${dateSlug}-`)) {
			flag(
				line,
				'anchor',
				`Anchor \`${anchor}\` does not match the date \`${label}\`: start it with \`${dateSlug}\`.`
			);
		}

		if (!isNew) continue;

		// An entry dated after NEW_AFTER: every rule of the Changelog page.
		if (!date) {
			flag(
				line,
				'label',
				`Cannot read the date in label \`${label}\`: write it as \`${rules.label(NEW_AFTER)}\`.`
			);
		} else if (!date.day) {
			flag(line, 'label', `Give the label its day, as in \`${rules.label(NEW_AFTER)}\`.`);
		} else if (!date.strict) {
			flag(line, 'label', `Write the label as \`${rules.label(date)}\`.`);
		}

		const tags = readTags(attributes.get('tags'));
		let tag = '';
		if ('missing' in tags) {
			flag(
				line,
				'tags',
				`The entry has no \`tags\`. Name the Platform Resource it covers: tags={['Azion CLI']}, from the list in CONTRIBUTING.md.`
			);
		} else if ('error' in tags) {
			flag(line, 'tags', tags.error);
		} else if (tags.tags.length !== 1) {
			flag(
				line,
				'tags',
				tags.tags.length
					? `An entry covers one Platform Resource: give each of ${tags.tags.map((name) => `\`${name}\``).join(', ')} an entry of its own.`
					: `\`tags\` is empty. Name the Platform Resource the entry covers: tags={['Azion CLI']}.`
			);
		} else if (!TAGS.has(tags.tags[0])) {
			const suggestion = suggestTag(tags.tags[0]);
			flag(
				line,
				'tags',
				suggestion
					? `Tag \`${tags.tags[0]}\` is not in the closed list: use \`${suggestion}\`.`
					: `Tag \`${tags.tags[0]}\` is not in the closed list in CONTRIBUTING.md. Use one of its names, or add the new one there and in this script.`
			);
		} else {
			tag = tags.tags[0];
		}

		if (date?.day && anchor) {
			// The anchor of the label as it should be written, so one pass fixes both.
			const base = slugOf(rules.label(date));
			const expected = [base, ...(tag ? [`${base}-${slugOf(tag)}`] : [])];
			// Without a valid tag the suffix cannot be checked; the tag finding already covers it.
			const unchecked = !tag && anchor.startsWith(`${base}-`);
			if (!expected.includes(anchor) && !unchecked) {
				flag(
					line,
					'anchor',
					`Anchor \`${anchor}\` does not match the entry: use \`${expected[0]}\`${expected[1] ? `, or \`${expected[1]}\` when another entry on the page has this date` : ''}.`
				);
			}
		}

		const description = attributes.get('description');
		if (description) {
			const pattern = new RegExp(`^${rules.version} \\d+\\.\\d+\\.\\d+(?:-[0-9A-Za-z.-]+)?$`);
			if (typeof description.value !== 'string' || !pattern.test(description.value)) {
				flag(
					line,
					'description',
					`Write the description as \`${rules.version} <x.y.z>\`, or leave it out when the release has no version.`
				);
			}
		}

		if (opening.trimEnd().endsWith('/>')) {
			flag(
				line,
				'notes',
				'The entry closes itself and has no notes: open it with `<DocUpdate ...>`, write the notes, and close it with `</DocUpdate>`.'
			);
			continue;
		}

		const afterOpen = source.slice(openEnd).match(/^[ \t]*\r?\n([^\n]*)/);
		if (!afterOpen || afterOpen[1].trim()) {
			flag(
				line,
				'blank-line',
				'Leave a blank line after the opening tag, or the notes render as one literal paragraph.'
			);
		}
		const closeStart = source.lastIndexOf('</DocUpdate', node.position.end.offset);
		const beforeClose = source.slice(0, closeStart).match(/([^\n]*)\r?\n([ \t]*)$/);
		if (!beforeClose || beforeClose[1].trim()) {
			flag(
				lineAt(source, closeStart),
				'blank-line',
				'Leave a blank line before the closing tag, or the notes render as one literal paragraph.'
			);
		}

		const last = node.children.at(-1);
		const lastLine = last?.position?.start.line ?? lineAt(source, closeStart);
		const lastText = last?.position
			? source.slice(last.position.start.offset, last.position.end.offset).trim()
			: '';
		const links =
			last?.type === 'paragraph' ? last.children.filter((child) => child.type === 'link') : [];
		if (
			last?.type !== 'paragraph' ||
			!lastText.startsWith(rules.closing) ||
			!links.length ||
			!lastText.endsWith('.')
		) {
			flag(
				lastLine,
				'closing-link',
				`Close the entry with the link to the page that documents the change: \`${rules.closingExample}\``
			);
		} else {
			for (const link of links) {
				if (!link.url.startsWith(rules.linkPrefix)) {
					flag(
						link.position?.start.line ?? lastLine,
						'closing-link',
						`The closing link points to \`${link.url}\`: link the page in this language, root-relative (\`${rules.linkPrefix}...\`).`
					);
				}
			}
		}
	}
	return issues;
}

/** The files to check: the arguments, resolved from where pnpm ran, or every changelog page. */
function targets(args) {
	if (!args.length) {
		const pages = CHANGELOG_PAGES.map((page) => path.join(DOCS_ROOT, page));
		const missing = pages.filter((page) => !fs.existsSync(page));
		if (missing.length) {
			// A moved page would otherwise go unchecked without a word.
			for (const page of missing) {
				console.error(
					`The changelog page ${path.relative(REPO_ROOT, page)} does not exist: update CHANGELOG_PAGES in this script.`
				);
			}
			process.exit(2);
		}
		return pages;
	}
	const base = process.env.INIT_CWD ?? process.cwd();
	const files = args.map((arg) => path.resolve(base, arg));
	const invalid = files.filter(
		(file) => !/\.mdx?$/.test(file) || !fs.statSync(file, { throwIfNoEntry: false })?.isFile()
	);
	if (invalid.length) {
		// A mistyped path would otherwise check nothing and pass.
		for (const file of invalid) console.error(`${file} is not a .md or .mdx file.`);
		process.exit(2);
	}
	return files;
}

/** Workflow commands carry their message on one line, with these characters escaped. */
function escapeAnnotation(text) {
	return text.replace(/%/g, '%25').replace(/\r/g, '%0D').replace(/\n/g, '%0A');
}

/** A property of a workflow command also escapes the characters that separate properties. */
function escapeProperty(text) {
	return escapeAnnotation(text).replace(/:/g, '%3A').replace(/,/g, '%2C');
}

function report(issues, checked, totals) {
	const inGitHub = process.env.GITHUB_ACTIONS === 'true';
	for (const issue of issues) {
		console.log(`${issue.file}:${issue.line} [${issue.rule}] ${issue.message}`);
		if (inGitHub) {
			const properties = [
				`file=${escapeProperty(issue.file)}`,
				`line=${issue.line}`,
				`title=${escapeProperty(`Changelog entry (${issue.rule})`)}`,
			].join(',');
			console.log(`::warning ${properties}::${escapeAnnotation(issue.message)}`);
		}
	}

	const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
	const files = new Set(issues.map((issue) => issue.file)).size;
	const summary = issues.length
		? `Found ${count(issues.length, 'changelog issue', 'changelog issues')} in ${files} of ${count(checked, 'file', 'files')}`
		: `Found no changelog issues in ${count(checked, 'file', 'files')}`;
	const scope = `Checked ${count(totals.entries, 'entry', 'entries')}; ${totals.fresh} dated after ${LANGUAGES.en.label(NEW_AFTER)} got every rule, the rest only the anchor and order checks.`;

	if (process.env.GITHUB_STEP_SUMMARY) {
		const rows = issues
			.slice(0, 200)
			.map(
				(issue) =>
					`| \`${issue.file}:${issue.line}\` | ${issue.rule} | ${issue.message.replace(/\|/g, '\\|')} |`
			);
		const body = [
			'## Changelog entries',
			'',
			`${summary}. ${scope}`,
			'',
			...(issues.length
				? [
						'| Where | Rule | Problem |',
						'| --- | --- | --- |',
						...rows,
						...(issues.length > rows.length
							? ['', `And ${issues.length - rows.length} more.`]
							: []),
						'',
						'This check does not block the merge: the PR author decides whether to fix it here.',
						'Older entries are records and are never rewritten; correct one with a new dated entry.',
					]
				: []),
		];
		fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${body.join('\n')}\n`);
	}

	console.log(scope);
	// The summary line comes last: it is the line a reader, or a script, looks for.
	console.log(summary);
}

const files = targets(process.argv.slice(2));
const totals = { entries: 0, fresh: 0 };
const issues = files.flatMap((file) => lintFile(file, totals));
report(issues, files.length, totals);
process.exit(issues.length ? 1 : 0);
