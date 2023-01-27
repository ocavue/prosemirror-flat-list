import { NodeRange, NodeType, ResolvedPos } from '@remirror/pm/model'
import { findItemRange } from './find-item-range'

export function findIndentationRange(
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
  isIndent: boolean,
): NodeRange | null {
  const range = findItemRange($from, $to, listType)

  if (!range) {
    return null
  }

  // If multiple items are selected, then we lift/sink the item range.
  if (range.endIndex - range.startIndex > 1) {
    return range
  }

  return range

  // // When indent, we want to only indent the first child inside that item, and keep the reset children (if any) stay at the same level.
  // // When dedent, we want to dedent the item itself, including all its children.
  // if (
  //   isIndent === false &&
  //   $from.depth > range.depth &&
  //   $from.index(range.depth + 1) === 0
  // ) {
  //   return range
  // }

  // // Otherwise, we only lift/sink the block range inside the item.
  // return new NodeRange($from, $to, range.depth + 1)
}
