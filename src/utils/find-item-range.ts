import { NodeRange, NodeType, ResolvedPos } from '@remirror/pm/model'
import { isItemRange } from './is-item-range'

/**
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list items.
 */

export default function findItemRange(
  $from: ResolvedPos,
  $to: ResolvedPos,
  itemType: NodeType
): NodeRange | null {
  if ($to.pos < $from.pos) {
    return findItemRange($to, $from, itemType)
  }

  let range = $from.blockRange($to)

  while (range) {
    if (isItemRange(range, itemType)) {
      return range
    }

    if (range.depth <= 0) {
      break
    }

    range = new NodeRange($from, $to, range.depth - 1)
  }

  return null
}
