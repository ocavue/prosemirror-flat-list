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
import { mapPos } from '../utils/map-pos'
import { safeLift } from '../utils/safe-lift'
import { separateItemRange } from './separate-item-range'

export { createDedentListCommandV3 as createDedentListCommand }

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
        for (let i = itemsRange.endIndex - 1; i >= itemsRange.startIndex; i--) {
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

export function createDedentListCommandV3(listType: NodeType): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    if (dedentListV3(tr, tr.selection.from, tr.selection.to, listType)) {
      dispatch?.(tr)
      return true
    }
    return false
  }

  return autoJoinList(indentListCommand, listType)
}

export function dedentListV3(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
): boolean {
  const map = mapPos(tr)

  const $from = tr.doc.resolve(from)
  const $to = tr.doc.resolve(to)
  const range = findListsRange($from, $to, listType)
  if (!range) return false

  const rightOpenIndex = isRightOpenRange(range)
  const leftOpenIndex = isLeftOpenRange(range)

  const leftStart = $from.before(range.depth + 1) + 1
  const leftEnd = $from.before($from.depth + 1) + 1

  const rightStart = $to.after(range.depth + 1) - 1
  const rightEnd = $to.after($to.depth + 1) - 1

  dedentListsRange(tr, range, listType)

  console.log('leftOpenIndex:', leftOpenIndex)
  console.log('rightOpenIndex:', rightOpenIndex)

  // if (rightOpenIndex !== false) {
  //   indentListV3(tr, map(leftStart), map(leftEnd), listType)
  // }

  // if (leftOpenIndex !== false) {
  //   indentListV3(tr, map(rightStart), map(rightEnd), listType)
  // }

  return true
}

function dedentListsRange(
  tr: Transaction,
  range: NodeRange,
  listType: NodeType,
): boolean {
  if (range.parent.type === listType) {
    return dedentToOuterList(tr, range)
  } else {
    return dedentOutOfList(tr, range)
  }
}

function dedentToOuterList(tr: Transaction, range: NodeRange): boolean {
  return safeLift(tr, range)
}

function dedentOutOfList(tr: Transaction, range: NodeRange): boolean {
  const map = mapPos(tr)

  const { startIndex, endIndex, parent } = range

  // Merge the list nodes into a single big list node
  for (let end = range.end, i = endIndex - 1; i > startIndex; i--) {
    end -= parent.child(i).nodeSize
    tr.delete(end - 1, end + 1)
  }

  const $start = tr.doc.resolve(range.start)
  const listNode = $start.nodeAfter

  if (!listNode) return false

  const start = range.start
  const end = start + listNode.nodeSize

  if (map(range.end) !== end) return false

  if (
    !$start.parent.canReplace(
      startIndex,
      startIndex + 1,
      Fragment.from(listNode),
    )
  ) {
    return false
  }

  tr.step(
    new ReplaceAroundStep(
      start,
      end,
      start + 1,
      end - 1,
      new Slice(Fragment.empty, 0, 0),
      0,
      true,
    ),
  )
  return true
}

export function createIndentListCommandV3(listType: NodeType): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    if (indentListV3(tr, tr.selection.from, tr.selection.to, listType)) {
      dispatch?.(tr)
      return true
    }
    return false
  }

  return autoJoinList(indentListCommand, listType)
}

export function indentListV3(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
): boolean {
  const map = mapPos(tr)

  const $from = tr.doc.resolve(from)
  const $to = tr.doc.resolve(to)
  const range = findListsRange($from, $to, listType)
  if (!range) return false

  const leftOpenIndex = isLeftOpenRange(range)
  const rightOpenIndex = isRightOpenRange(range)

  let leftStart = leftOpenIndex !== false && $from.before(range.depth + 1) + 1
  let leftEnd = leftOpenIndex !== false && $from.before($from.depth + 1) + 1

  let rightStart = rightOpenIndex !== false && $to.after(range.depth + 1) - 1
  let rightEnd = rightOpenIndex !== false && $to.after($to.depth - 1) - 1

  indentListsRange(tr, range, listType)

  leftStart = leftStart !== false && map(leftStart)
  leftEnd = leftEnd !== false && map(leftEnd)
  rightStart = rightStart !== false && map(rightStart)
  rightEnd = rightEnd !== false && map(rightEnd)

  console.log('indentListV3:', {
    leftStart,
    leftEnd,
    rightStart,
    rightEnd,
  })

  if (rightStart !== false && rightEnd !== false) {
    dedentListV3(tr, rightStart, rightEnd, listType)
  }

  if (leftStart !== false && leftEnd !== false) {
    dedentListV3(tr, leftStart, leftEnd, listType)
  }

  return true
}

function indentListsRange(
  tr: Transaction,
  range: NodeRange,
  listType: NodeType,
): boolean {
  const { start, end } = range

  tr.step(
    new ReplaceAroundStep(
      start,
      end,
      start,
      end,
      new Slice(Fragment.from(listType.create(null)), 0, 0),
      1,
      true,
    ),
  )

  return true
}
