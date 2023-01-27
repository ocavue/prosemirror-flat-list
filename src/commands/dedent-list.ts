import { DispatchFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../utils/auto-join-list'
import { findItemContentRange } from '../utils/find-item-content-range'
import { findItemsRange } from '../utils/find-items-range'
import { safeLift } from '../utils/safe-lift'
import { separateItemRange } from './separate-item-range'

export function createDedentListCommand(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    separateItemRange(tr, tr.selection.$from, tr.selection.$to, listType)

    const { $from, $to } = tr.selection
    const range = findItemsRange($from, $to, listType)
    if (!range) {
      return false
    }

    if (range.parent.type === listType) {
      return liftToOuterList(state.tr, dispatch, listType, range)
    }

    {
      const range = findItemContentRange($from, $to, listType)
      if (range && safeLift(tr, range)) {
        dispatch?.(tr)
        return true
      }
    }
    {
      const range = findItemsRange($from, $to, listType)
      if (range) {
        let end = range.end
        for (let i = range.endIndex - 1; i >= range.startIndex; i--) {
          const listNode = range.parent.child(i)
          const start = end - listNode.nodeSize
          const itemContentRange = new NodeRange(
            tr.doc.resolve(start + 1),
            tr.doc.resolve(end - 1),
            range.depth + 1,
          )
          safeLift(tr, itemContentRange)
          end = start
        }
        dispatch?.(tr)
        return true
      }
    }

    return false
  }

  return autoJoinList(dedentListCommand, listType)
}

/** @internal */
export function liftToOuterList(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  listType: NodeType,
  range: NodeRange,
) {
  const siblingStart = range.end
  const siblingEnd = range.$to.end(range.depth)

  if (siblingStart < siblingEnd) {
    // There are siblings after the lifted list node, which must become children
    // of the last list node
    tr.step(
      new ReplaceAroundStep(
        siblingStart - 1,
        siblingEnd,
        siblingStart,
        siblingEnd,
        new Slice(Fragment.from(listType.create(null)), 1, 0),
        0,
        true,
      ),
    )
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(siblingEnd),
      range.depth,
    )
  }

  if (safeLift(tr, range)) {
    dispatch?.(tr)
    return true
  }
  return false
}
