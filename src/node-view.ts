import { type ProsemirrorNode } from '@remirror/pm'
import { DOMSerializer } from '@remirror/pm/model'
import { type NodeViewConstructor } from '@remirror/pm/view'

/**
 * A simple node view that is used to render the list node. It ensures
 * that the list node get updated when its marker visibility changes.
 */
export const createListNodeView: NodeViewConstructor = (node) => {
  const prevNode = node
  const prevNested = node.firstChild?.type === node.type
  const spec = node.type.spec.toDOM!(node)
  const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec)

  const update = (node: ProsemirrorNode) => {
    if (!node.sameMarkup(prevNode)) return false
    const nested = node.firstChild?.type === node.type
    if (prevNested !== nested) return false
    return true
  }

  return { dom, contentDOM, update }
}
