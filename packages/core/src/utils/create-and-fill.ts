import type {
  Attrs,
  Fragment,
  Mark,
  Node as ProsemirrorNode,
  NodeType,
} from 'prosemirror-model'

export function createAndFill(
  type: NodeType,
  attrs?: Attrs | null,
  content?: Fragment | ProsemirrorNode | readonly ProsemirrorNode[] | null,
  marks?: readonly Mark[],
) {
  const node = type.createAndFill(attrs, content, marks)
  if (!node) {
    throw new RangeError(`Failed to create '${type.name}' node`)
  }
  node.check()
  return node
}
