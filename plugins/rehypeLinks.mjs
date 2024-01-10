export function rehypeLinks() {
  return function (tree) {
    tree.children.forEach((node) => {
      setLinkAttributes(node)
    })
  }
}

const setLinkAttributes = (node) => {
  if (node.tagName === "p" || node.tagName === "ul" || node.tagName === "li" || node.tagName === "h2" || node.tagName === "h3" ||  node.tagName === "aside" ||  node.tagName === "section") {
    node.children.forEach((n) => setLinkAttributes(n))
  } else if (node.tagName === "a") {
		if (node.properties.href.startsWith('#')) return
    node.properties.target = "_blank"
    node.properties.rel = "noopener"
  }
}

			// [
			// 	rehypeExternalLinks,
			// 	{
			// 			target: '_blank',
			// 			rel: ['noopener', 'noreferrer'],
			// 	},
			// ],	
