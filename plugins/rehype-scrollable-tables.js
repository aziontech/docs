export default function rehypeScrollableTables() {
	return function (tree) {
		tree.children.forEach((node, index) => {
			if (node.tagName !== 'table') return;
			createScrollableTables(tree, node, index);
		});
	};
}

const createScrollableTables = (tree, node, index) => {
	const newNode = {
		type: 'element',
		tagName: 'div',
		properties: {
			class: 'overflow-x-auto w-full',
		},
		children: [{ ...node }],
		...node.position,
	};

	tree.children[index] = newNode;
};
