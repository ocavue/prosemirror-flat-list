import { NodeType, ProsemirrorNode } from '@remirror/pm'
import { NodeRange, ResolvedPos } from '@remirror/pm/model'

export function findItemContentRange(
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
): NodeRange | null {
  const range = $from.blockRange(
    $to,
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
      if (child.type === listType) {
        break
      }
      end += child.nodeSize
    }
    return new NodeRange($from, $from.doc.resolve(end - 1), range.depth)
  } else {
    return range
  }
}
