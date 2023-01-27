import { NodeType, ProsemirrorNode } from '@remirror/pm'
import { NodeRange, ResolvedPos } from '@remirror/pm/model'

export function findItemContentRange(
  $pos: ResolvedPos,
  listType: NodeType,
): NodeRange | null {
  const range = $pos.blockRange(
    $pos,
    (parent: ProsemirrorNode) => parent.type === listType,
  )

  if (!range) {
    return null
  }

  const listNode = range.parent
  if (range.startIndex === 0) {
    let end = range.end

    for (let i = 1; i < listNode.childCount; i++) {
      const child = listNode.child(i)
      if (child.type !== listType) {
        end += child.nodeSize
      }
    }
    return new NodeRange($pos, $pos.doc.resolve(end - 1), range.depth)
  } else {
    return range
  }
}
