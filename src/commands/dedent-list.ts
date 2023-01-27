import { DispatchFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../utils/auto-join-list'
import { findListContentRange } from '../utils/find-item-content-range'
import {
  findListsRange,
  isLeftOpenRange,
  isRightOpenRange,
} from '../utils/list-range'
import { safeLift } from '../utils/safe-lift'
import { separateItemRange } from './separate-item-range'

export { createDedentListCommandV2 as createDedentListCommand }

export function createDedentListCommandV1(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    separateItemRange(tr, tr.selection.$from, tr.selection.$to, listType)

    const { $from, $to } = tr.selection
    const range = findListsRange($from, $to, listType)
    if (!range) {
      return false
    }

    if (range.parent.type === listType) {
      return liftToOuterList(state.tr, dispatch, listType, range)
    }

    {
      const range = findListContentRange($from, $to, listType)
      if (range && safeLift(tr, range)) {
        dispatch?.(tr)
        return true
      }
    }
    {
      const range = findListsRange($from, $to, listType)
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

export function createDedentListCommandV2(listType: NodeType): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    {
      const { $from, $to } = tr.selection

      const itemsRange = findListsRange($from, $to, listType)
      if (!itemsRange) {
        return false
      }

      const rightOpenIndex = isRightOpenRange(itemsRange)
      if (rightOpenIndex !== false) {
        const rightItem = itemsRange.parent.child(itemsRange.endIndex - 1)
        const rightItemBefore = itemsRange.end - rightItem.nodeSize
        const rightItemAfter = rightItemBefore + rightItem.nodeSize

        const extraItemContentStartIndex = rightOpenIndex
        const extraItemContentEndIndex = rightItem.childCount

        const extraItemContentStartPos = $to.after(itemsRange.depth + 2)
        const extraItemContentEndPos = $to.after(itemsRange.depth + 1) - 1

        const lastSelectedContent = rightItem.maybeChild(rightOpenIndex - 1)

        if (lastSelectedContent?.type === listType) {
          /* 
          
          Example: Put B2b as a child of C1.

          before: 

          - A1
            - <start>B1
            - B2a
              - C1<end>
              B2b
          
          after:

          - A1
            - <start>B1
            - B2a
              - C1<end>
                B2b
          */
          tr.step(
            new ReplaceAroundStep(
              extraItemContentStartPos - 1,
              extraItemContentEndPos,
              extraItemContentStartPos,
              extraItemContentEndPos,
              new Slice(Fragment.from(listType.create(null)), 1, 0),
              0,
              true,
            ),
          )
        } else {
          /* 

          Example: Wrap B2b with a list node, so that it becomes a child of B2a.
          This is not ideal because we add an extra list bullet before B2b.

          before: 

          - A1
            - <start>B1
            - B2a<end>
              B2b

          after:

          - A1
            - <start>B1
            - B2a<end>
              - B2b
          */
          tr.step(
            new ReplaceAroundStep(
              extraItemContentStartPos,
              extraItemContentEndPos,
              extraItemContentStartPos,
              extraItemContentEndPos,
              new Slice(Fragment.from(listType.create(null)), 0, 0),
              1,
              true,
            ),
          )
        }
      }

      const leftOpenIndex = isLeftOpenRange(itemsRange)

      {
        let end = itemsRange.end
        // const startIndex =
        //   leftOpenIndex === false
        //     ? itemsRange.startIndex + 1
        //     : itemsRange.startIndex
        for (let i = itemsRange.endIndex - 1; i >=  itemsRange.startIndex; i--) {
          const listNode = itemsRange.parent.child(i)
          const start = end - listNode.nodeSize
          const itemContentRange = new NodeRange(
            tr.doc.resolve(start + 1),
            tr.doc.resolve(end - 1),
            itemsRange.depth + 1,
          )
          safeLift(tr, itemContentRange)
          end = start
        }
      }

      // if (leftOpenIndex !== false) {
      //   const leftItem = itemsRange.parent.child(itemsRange.startIndex)
      //   const leftEnd = itemsRange.start + leftItem.nodeSize

      //   safeLift(
      //     tr,
      //     new NodeRange(
      //       $from,
      //       tr.doc.resolve(leftEnd - 1),
      //       itemsRange.depth + 1,
      //     ),
      //   )
      // }

      if (dispatch) {
        dispatch(tr)
      }

      return true
    }
  }

  return autoJoinList(indentListCommand, listType)
}
