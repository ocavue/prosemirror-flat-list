import { Node as ProsemirrorNode } from 'prosemirror-model'
import { DOMSerializer } from 'prosemirror-model'
import { type NodeViewConstructor } from 'prosemirror-view'

/**
 * A simple node view that is used to render the list node. It ensures that the
 * list node get updated when its marker styling should changes.
 */
export const createListNodeView: NodeViewConstructor = (node) => {
  let prevNode = node
  const prevNested = node.firstChild?.type === node.type
  const prevSingleChild = node.childCount === 1

  const spec = node.type.spec.toDOM!(node)
  const { dom, contentDOM } = DOMSerializer.renderSpec(document, spec)

  const update = (node: ProsemirrorNode): boolean => {
    if (!node.sameMarkup(prevNode)) return false
    const nested = node.firstChild?.type === node.type
    const singleChild = node.childCount === 1
    if (prevNested !== nested || prevSingleChild !== singleChild) return false
    prevNode = node
    return true
  }

  return { dom, contentDOM, update }
}
