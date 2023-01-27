import { DispatchFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../plugins/auto-join-item-plugin'
import { findItemContentRange } from '../utils/find-item-content-range'
import { findItemsRange } from '../utils/find-items-range'
import { safeLift } from '../utils/safe-lift'
import { separateItemRange } from './separate-item-range'

export function createDedentListCommand(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    {
      const { $from, $to } = tr.selection
      separateItemRange(tr, $from, $to, listType)
    }

    {
      const { $from, $to } = tr.selection
      const range = findItemsRange($from, $to, listType)
      if (!range) {
        return false
      }

      if (range.parent.type === listType) {
        return liftToOuterList(state.tr, dispatch, listType, range)
      }
    }
    {
      const { $from, $to } = tr.selection
      const range = findItemContentRange($from, $to, listType)
      if (range && safeLift(tr, range)) {
        dispatch?.(tr)
        return true
      }
    }
    {
      const { $from, $to } = tr.selection
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

export function liftToOuterList(
  tr: Transaction,
  dispatch: DispatchFunction | undefined,
  listType: NodeType,
  range: NodeRange,
) {
  const endOfItem = range.end
  const endOfSiblings = range.$to.end(range.depth)

  if (endOfItem < endOfSiblings) {
    // There are siblings after the lifted items, which must become children of
    // the last item
    tr.step(
      new ReplaceAroundStep(
        endOfItem - 1,
        endOfSiblings,
        endOfItem,
        endOfSiblings,
        new Slice(Fragment.from(listType.create(null)), 1, 0),
        0,
        true,
      ),
    )
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(endOfSiblings),
      range.depth,
    )
  }

  if (safeLift(tr, range)) {
    dispatch?.(tr)
    return true
  }
  return false
}
