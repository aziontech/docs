const FENCE = /^---[ \t]*$/;

interface Block {
	start: number;
	end: number;
	lines: string[];
}

export function frontmatterBlock(source: string): Block | null {
	const lines = source.split('\n');
	if (!FENCE.test(lines[0] ?? '')) return null;
	for (let i = 1; i < lines.length; i += 1) {
		if (FENCE.test(lines[i])) return { start: 0, end: i, lines };
	}
	return null;
}

function keyLine(lines: string[], block: Block, key: string): number {
	const pattern = new RegExp(`^${key}\\s*:`);
	for (let i = block.start + 1; i < block.end; i += 1) {
		if (pattern.test(lines[i])) return i;
	}
	return -1;
}

function valueEnd(lines: string[], block: Block, at: number): number {
	const value = lines[at].slice(lines[at].indexOf(':') + 1).trim();
	if (!/^[>|][-+]?\d*$/.test(value)) return at;
	let end = at;
	for (let i = at + 1; i < block.end; i += 1) {
		if (lines[i].trim() === '' || /^\s/.test(lines[i])) end = i;
		else break;
	}
	return end;
}

export function fieldRange(source: string, key: string): [number, number] | null {
	const block = frontmatterBlock(source);
	if (!block) return null;
	const at = keyLine(block.lines, block, key);
	if (at === -1) return null;
	return [at, valueEnd(block.lines, block, at)];
}

export function readField(source: string, key: string): string | null {
	const block = frontmatterBlock(source);
	if (!block) return null;
	const at = keyLine(block.lines, block, key);
	if (at === -1) return null;
	const end = valueEnd(block.lines, block, at);
	if (end === at) return block.lines[at].slice(block.lines[at].indexOf(':') + 1).trim();
	return block.lines
		.slice(at + 1, end + 1)
		.map((line) => line.trim())
		.filter(Boolean)
		.join(' ');
}

export function setField(source: string, key: string, value: string): string {
	const block = frontmatterBlock(source);
	if (!block) throw new Error(`no frontmatter block`);
	const at = keyLine(block.lines, block, key);
	const line = `${key}: ${value}`;
	if (at === -1) {
		const lines = [...block.lines];
		lines.splice(block.end, 0, line);
		return lines.join('\n');
	}
	const end = valueEnd(block.lines, block, at);
	const lines = [...block.lines];
	lines.splice(at, end - at + 1, line);
	return lines.join('\n');
}

export function removeField(source: string, key: string): string {
	const block = frontmatterBlock(source);
	if (!block) return source;
	const at = keyLine(block.lines, block, key);
	if (at === -1) return source;
	const end = valueEnd(block.lines, block, at);
	const lines = [...block.lines];
	lines.splice(at, end - at + 1);
	return lines.join('\n');
}
