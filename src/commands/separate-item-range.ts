import { NodeType, ResolvedPos, Transaction } from '@remirror/pm'
import { findItemContentRange } from '../utils/find-item-content-range'
import { findItemRange } from '../utils/find-item-range'
import { splitBoundary } from '../utils/split-boundary'

export function separateItemRange(
  tr: Transaction,
  $from: ResolvedPos,
  $to: ResolvedPos,
  listType: NodeType,
) {
  const doc = $from.doc

  // The block range that includes both $from and $to. It could contain one or more list nodes.
  const allItemsRange = findItemRange($from, $to, listType)
  if (!allItemsRange) {
    return false
  }

  // The block range that includes $from. It should contain only one top-level list node.
  const firstItemRange = $from.blockRange()
  if (!firstItemRange) {
    return false
  }

  // The block range that includes $to. It should contain only one top-level list node.
  const lastItemRange = findItemContentRange($to, listType)
  if (!lastItemRange) {
    return false
  }

  if (
    allItemsRange.start !== lastItemRange.start ||
    allItemsRange.end !== lastItemRange.end
  ) {
    const $posBeforeAllItems = doc.resolve(allItemsRange.start)
    const $posBeforeFirstItem = doc.resolve(firstItemRange.start)
    const $posAfterLastItem = doc.resolve(lastItemRange.end)
    const $posAfterAllItems = doc.resolve(allItemsRange.end)
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
