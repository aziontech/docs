export function rehypeLinks() {
  return function (tree) {
    tree.children.forEach((node) => {
      setLinkAttributes(node)
    })
  }
}

const setLinkAttributes = (node) => {
  if (node.tagName !== "a" && node.children) {
    node.children.forEach((n) => setLinkAttributes(n))
  } else if (node.tagName === "a") {
		if (node.properties.href.startsWith('#')) return
    node.properties.target = "_blank"
    node.properties.rel = "noopener"
  }
}
