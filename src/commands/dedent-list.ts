import { CommandFunction, DispatchFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Transaction } from '@remirror/pm/state'
import { liftTarget, ReplaceAroundStep } from '@remirror/pm/transform'
import { findIndentationRange } from "../utils/find-indentation-range"
import { isItemRange } from "../utils/is-item-range"

export function createDedentListCommand(itemType: NodeType): CommandFunction {
  return (props): boolean => {
    const { state, dispatch, tr } = props

    const { $from, $to } = state.selection
    // const range = findItemRange($from, $to, itemType)
    const range = findIndentationRange($from, $to, itemType, false)

    if (!range) {
      return false
    }

    if (isItemRange(range, itemType)) {
      return liftToOuterList(tr, dispatch, itemType, range)
    }

    return liftBlockRange(tr, dispatch, range)
  }
}

export function liftToOuterList(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  itemType: NodeType,
  range: NodeRange
) {
  const endOfItem = range.end
  const endOfSiblings = range.$to.end(range.depth)

  if (endOfItem < endOfSiblings) {
    // There are siblings after the lifted items, which must become
    // children of the last item
    tr.step(
      new ReplaceAroundStep(
        endOfItem - 1,
        endOfSiblings,
        endOfItem,
        endOfSiblings,
        new Slice(Fragment.from(itemType.create(null)), 1, 0),
        0,
        true
      )
    )
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfSiblings),
      range.depth
    )
  }

  return liftBlockRange(tr, dispatch, range)
}

export function liftBlockRange(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  range: NodeRange
) {
  const target = liftTarget(range)

  if (target == null) {
    return false
  }

  dispatch?.(tr.lift(range, target).scrollIntoView())
  return true
}
