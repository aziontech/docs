import Slugger from 'github-slugger'
import {hasProperty} from 'hast-util-has-property'
import {headingRank} from 'hast-util-heading-rank'
import {toString} from 'hast-util-to-string'
import {visit} from 'unist-util-visit'

const slugs = new Slugger()

const removeAccent = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export default function rehypeSlug(options = {}) {
  const prefix = options.prefix || ''

  return (tree) => {
    slugs.reset()

    visit(tree, 'element', (node) => {
      if (headingRank(node) && node.properties && !hasProperty(node, 'id')) {
        node.properties.id = prefix + slugs.slug(removeAccent(toString(node)))
      }
    })
  }
}
