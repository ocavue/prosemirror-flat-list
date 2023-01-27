import { NodeType, ResolvedPos, Transaction } from '@remirror/pm'
import { findItemContentRange } from '../utils/find-item-content-range'
import { findItemsRange } from '../utils/find-items-range'
import { splitBoundary } from '../utils/split-boundary'

export function separateItemRange(
  tr: Transaction,
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
) {
  const doc = $from.doc

  // The block range that includes both $from and $to. It could contain one or more list nodes.
  const itemsRange = findItemsRange($from, $to, listType)
  if (!itemsRange) {
    return false
  }

  // The block range that includes $from. It should contain only one top-level list node.
  const firstItemRange = $from.blockRange()
  if (!firstItemRange) {
    return false
  }

  // The block range that includes $to. It should contain only one top-level list node.
  const lastItemRange = findItemContentRange($to, $to, listType)
  if (!lastItemRange) {
    return false
  }

  if (
    itemsRange.start !== lastItemRange.start ||
    itemsRange.end !== lastItemRange.end
  ) {
    const $posBeforeAllItems = doc.resolve(itemsRange.start)
    const $posBeforeFirstItem = doc.resolve(firstItemRange.start)
    const $posAfterLastItem = doc.resolve(lastItemRange.end)
    const $posAfterAllItems = doc.resolve(itemsRange.end)
    splitBoundary(
      tr,
      $posAfterLastItem.pos,
      $posAfterLastItem.depth - $posAfterAllItems.depth,
    )
    splitBoundary(
      tr,
      $posBeforeFirstItem.pos,
      $posBeforeFirstItem.depth - $posBeforeAllItems.depth,
    )
    return true
  }

  return false
}
