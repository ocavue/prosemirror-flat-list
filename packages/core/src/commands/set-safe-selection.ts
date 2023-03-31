import { ResolvedPos } from 'prosemirror-model'
import { Selection, TextSelection, Transaction } from 'prosemirror-state'
import { isCollapsedListNode } from '../utils/is-collapsed-list-node'

function moveOutOfCollapsed(
  $pos: ResolvedPos,
  minDepth: number,
): Selection | null {
  for (let depth = minDepth; depth <= $pos.depth; depth++) {
    if (isCollapsedListNode($pos.node(depth)) && $pos.index(depth) >= 1) {
      const before = $pos.posAtIndex(1, depth)
      const $before = $pos.doc.resolve(before)
      return TextSelection.near($before, -1)
    }
  }
  return null
}

/**
 * If one of the selection's end points is inside a collapsed node, move the selection outside of it
 *
 * @internal
 */
export function setSafeSelection(tr: Transaction): Transaction {
  const { $from, $to, to } = tr.selection
  const selection =
    moveOutOfCollapsed($from, 0) ||
    moveOutOfCollapsed($to, $from.sharedDepth(to))
  if (selection) {
    tr.setSelection(selection)
  }
  return tr
}
