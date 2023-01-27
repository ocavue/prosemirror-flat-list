import { NodeRange, NodeType, ResolvedPos } from '@remirror/pm/model'

/**
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list nodes.
 */
export function findListsRange(
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
): NodeRange | null {
  if ($to.pos < $from.pos) {
    return findListsRange($to, $from, listType)
  }

  let range = $from.blockRange($to)

  while (range) {
    if (isListsRange(range, listType)) {
      return range
    }

    if (range.depth <= 0) {
      break
    }

    range = new NodeRange($from, $to, range.depth - 1)
  }

  return null
}

export function isListsRange(range: NodeRange, listType: NodeType): boolean {
  const { startIndex, endIndex, parent } = range

  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).type !== listType) {
      return false
    }
  }

  return true
}

// function splitListsRange(range: NodeRange) {
//   const { $from, $to } = range
//   const { startIndex, endIndex, parent } = range
//   const { depth } = range

//   const leftOpen = isLeftOpenRange(range)
//   const rightOpen = isRightOpenRange(range)

//   const leftContentRange = new NodeRange(
//     $
//   )

// }

export function isLeftOpenRange(range: NodeRange): false | number {
  const { $from } = range
  if ($from.depth > range.depth) {
    const startIndex = $from.index(range.depth + 1)
    if (startIndex > 0) {
      return startIndex
    }
  }
  return false
}

export function isRightOpenRange(range: NodeRange): false | number {
  const { $to } = range
  if ($to.depth > range.depth) {
    const endIndex = $to.indexAfter(range.depth + 1)
    if (endIndex < $to.node(range.depth + 1).childCount) {
      return endIndex
    }
  }
  return false
}
