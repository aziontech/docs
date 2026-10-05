/** Reads the literal an MDX attribute expression holds (`cols={2}`, `code={`…`}`, `rows={[…]}`)
 * from the estree remark-mdx attaches. Only literals are supported, which is every expression
 * the docs pass; anything else throws, so live code fails the corpus check. */

interface EstreeNode {
	type: string;
	body?: EstreeNode[];
	expression?: EstreeNode;
	value?: unknown;
	expressions?: EstreeNode[];
	quasis?: { value: { cooked: string } }[];
	elements?: EstreeNode[];
	properties?: EstreeNode[];
	computed?: boolean;
	key?: EstreeNode;
	name?: string;
	operator?: string;
	argument?: EstreeNode;
}

export function evaluateLiteral(node: EstreeNode): unknown {
	switch (node.type) {
		case 'Program':
			return evaluateLiteral(node.body![0]);
		case 'ExpressionStatement':
			return evaluateLiteral(node.expression!);
		case 'Literal':
			return node.value;
		case 'TemplateLiteral':
			if (node.expressions!.length > 0) throw new Error('template literal with interpolation');
			return node.quasis![0].value.cooked;
		case 'ArrayExpression':
			return node.elements!.map((element) => evaluateLiteral(element));
		case 'ObjectExpression':
			return Object.fromEntries(
				node.properties!.map((property) => {
					if (property.type !== 'Property' || property.computed)
						throw new Error(`unsupported object member ${property.type}`);
					const key = property.key!;
					return [key.type === 'Identifier' ? key.name : String(key.value), evaluateLiteral(property.value as EstreeNode)];
				})
			);
		case 'UnaryExpression':
			if (node.operator === '-') return -(evaluateLiteral(node.argument!) as number);
			break;
		case 'Identifier':
			if (node.name === 'undefined') return undefined;
			break;
	}
	throw new Error(`unsupported expression ${node.type}`);
}
