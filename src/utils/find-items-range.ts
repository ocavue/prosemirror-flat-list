import { NodeRange, NodeType, ResolvedPos } from '@remirror/pm/model'

/**
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list nodes.
 */
export function findItemsRange(
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
): NodeRange | null {
  if ($to.pos < $from.pos) {
    return findItemsRange($to, $from, listType)
  }

  let range = $from.blockRange($to)

  while (range) {
    if (isItemsRange(range, listType)) {
      return range
    }

    if (range.depth <= 0) {
      break
    }

    range = new NodeRange($from, $to, range.depth - 1)
  }

  return null
}

function isItemsRange(range: NodeRange, listType: NodeType): boolean {
  const { startIndex, endIndex, parent } = range

  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).type !== listType) {
      return false
    }
  }

  return true
}
