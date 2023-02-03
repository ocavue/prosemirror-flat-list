import { DispatchFunction, ProsemirrorNode, ResolvedPos } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction, Selection } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList, autoJoinList2 } from '../utils/auto-join-list'
import {
  atEndBlockBoundary,
  atStartBlockBoundary,
} from '../utils/block-boundary'
import { findListContentRange } from '../utils/find-item-content-range'
import {
  findListsRange,
  isLeftOpenRange,
  isListsRange,
  isRightOpenRange,
} from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { safeLift } from '../utils/safe-lift'
import { zoomInRange } from '../utils/zoom-in-range'
import { separateItemRange } from './separate-item-range'

export { createDedentListCommandV4 as createDedentListCommand }

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

export function createDedentListCommandV4(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    const { $from, $to } = tr.selection

    const listsRange =
      findListsRange($from, $to, listType) || $from.blockRange($to)
    if (!listsRange) return false

    if (dedentRange(listsRange, tr, listType)) {
      autoJoinList2(tr, listType)
      dispatch?.(tr)
      return true
    }
    return false
  }

  return dedentListCommand
}

function dedentRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
  startBoundary?: boolean,
  endBoundary?: boolean,
): boolean {
  const { depth, $from, $to } = range

  startBoundary = startBoundary || atStartBlockBoundary($from, depth + 1)
  endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1)
  console.log(`dedentRange: boundary: ${startBoundary} ${endBoundary}`)

  if (!endBoundary) {
    fixEndBoundary(range, tr, listType)

    const endOfParent = $to.end(depth)
    range = new NodeRange(
      tr.doc.resolve($from.pos),
      tr.doc.resolve(endOfParent),
      depth,
    )
    // return true
    return dedentNodeRange(range, tr, listType)
    // const { startIndex, endIndex } = range
    // if (endIndex - startIndex === 1) {
    //   const contentRange = zoomInRange(range)
    //   return contentRange ? dedentRange(contentRange, tr, listType) : false
    // } else {
    //   throw new Error('not implementation')
    //   // return splitAndIndentRange(range, tr, listType, endIndex - 1)
    // }
  }

  return dedentNodeRange(range, tr, listType)
}

function dedentNodeRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
) {
  return dedentToOuterList(tr, range, listType)
}

function fixEndBoundary(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
): void {
  const contentRange = zoomInRange(range)
  if (contentRange) {
    const { $to, $from, depth, end, parent, endIndex } = range
    const endOfParent = $to.end(depth)
    console.log('fixEndBoundary: deeper')
    fixEndBoundary(contentRange, tr, listType)

    range = new NodeRange(
      tr.doc.resolve($from.pos),
      tr.doc.resolve($to.pos),
      depth,
    )
  }

  const { $to, $from, depth, end, parent, endIndex } = range

  const endOfParent = $to.end(depth)

  console.log(`fixEndBoundary: end:${end} endOfParent:${endOfParent}`)
  if (end < endOfParent) {
    if (parent.maybeChild(endIndex - 1)?.type === listType) {
      console.log('fixEndBoundary: ReplaceAroundStep')
      // There are siblings after the lifted items, which must become
      // children of the last item
      tr.step(
        new ReplaceAroundStep(
          end - 1,
          endOfParent,
          end,
          endOfParent,
          new Slice(Fragment.from(listType.create(null)), 1, 0),
          0,
          true,
        ),
      )
      range = new NodeRange(
        tr.doc.resolve($from.pos),
        tr.doc.resolve(endOfParent),
        depth,
      )
    }
  }
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
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    if (doDedent(tr, tr.selection.from, tr.selection.to, listType)) {
      dispatch?.(tr)
      return true
    }
    return false
  }

  return autoJoinList(dedentListCommand, listType)
}

export function dedentListV3(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
  cycle = 0,
): boolean {
  if (cycle >= 3) {
    console.warn('dedentListV3 cycle limit reached')
    return false
  }

  const $from = normalizeFrom(tr.doc.resolve(from))
  const $to = normalizeTo(tr.doc.resolve(to))
  if ($from == null || $to == null) {
    return false
  }

  const range = $from.blockRange($to)
  if (!range) return false

  const { start: itemBefore, end: itemAfter } = range
  let itemStart = itemBefore + 1
  let itemEnd = itemAfter - 1
  let before = $from.before($from.depth)
  let after = $to.after($to.depth)

  const getStart = mapPos(tr, itemStart)
  const getEnd = mapPos(tr, itemEnd)
  const getBefore = mapPos(tr, before)
  const getAfter = mapPos(tr, after)

  console.log('dedentListV3 A', {
    // itemBefore,
    // itemAfter,
    itemStart,
    itemEnd,
    before,
    after,
  })

  itemStart = getStart()
  itemEnd = getEnd()
  before = getBefore()
  after = getAfter()

  indentListV3(tr, after, itemEnd, listType, cycle + 1)
  // indentListV3(tr, itemStart, before, listType, cycle + 1)

  itemStart = getStart()
  itemEnd = getEnd()
  before = getBefore()
  after = getAfter()

  console.log('dedentListV3 B', {
    // itemBefore,
    // itemAfter,
    itemStart,
    itemEnd,
    before,
    after,
  })

  return doDedent(tr, itemStart, itemEnd, listType)
}

function doDedent(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
): boolean {
  console.log('doDedent A:', { from, to })

  if (from === to) {
    if (!tr.doc.resolve(from).parent.isTextblock) {
      return false
    }
  } else if (isEmptyRange(tr.doc, from, to)) {
    return false
  }

  console.warn('doDedent B:', { from, to })
  // return false

  const $from = normalizeFrom(tr.doc.resolve(from))
  const $to = normalizeTo(tr.doc.resolve(to))
  if ($from == null || $to == null) {
    return false
  }

  // const range =  $from.blockRange($to)
  const range = $from.blockRange($to)
  if (!range) {
    return false
  }

  // const listsRange = findListsRange($from, $to, listType)
  // if (
  //   listsRange &&
  //   listsRange.start + 1 === range.start &&
  //   listsRange.end - 1 === range.end
  // ) {
  //   range = listsRange
  // }

  const { parent, startIndex, endIndex, start, end, depth } = range
  console.log('doDedent', {
    startIndex,
    endIndex,
    start,
    end,
    depth,
    parent: parent.toString(),
  })

  if (parent.type !== listType && isListsRange(range, listType)) {
    console.log('dedentOutOfList')

    return dedentOutOfList(tr, range)
  } else {
    console.log('dedentToOuterList')
    return dedentToOuterList(tr, range, listType)
  }
}

function dedentListsRange(
  tr: Transaction,
  range: NodeRange,
  listType: NodeType,
): boolean {
  if (range.parent.type === listType) {
    return dedentToOuterList(tr, range, listType)
  } else {
    return dedentOutOfList(tr, range)
  }
}

function dedentToOuterList(
  tr: Transaction,
  range: NodeRange,
  listType: NodeType,
): boolean {
  {
    const { $to, $from, depth, end, parent, endIndex } = range

    const endOfParent = $to.end(depth)
    if (
      end < endOfParent &&
      parent.maybeChild(endIndex - 1)?.type === listType
    ) {
      console.log('dedentToOuterList: ReplaceAroundStep')
      // There are siblings after the lifted items, which must become
      // children of the last item
      tr.step(
        new ReplaceAroundStep(
          end - 1,
          endOfParent,
          end,
          endOfParent,
          new Slice(Fragment.from(listType.create(null)), 1, 0),
          0,
          true,
        ),
      )
      range = new NodeRange(
        tr.doc.resolve($from.pos),
        tr.doc.resolve(endOfParent),
        depth,
      )
    }
  }
  return safeLift(tr, range)
}

function dedentOutOfList(tr: Transaction, range: NodeRange): boolean {
  const { startIndex, endIndex, parent } = range

  const getRangeStart = mapPos(tr, range.start)
  const getRangeEnd = mapPos(tr, range.end)

  // Merge the list nodes into a single big list node
  for (let end = getRangeEnd(), i = endIndex - 1; i > startIndex; i--) {
    end -= parent.child(i).nodeSize
    tr.delete(end - 1, end + 1)
  }

  const $start = tr.doc.resolve(getRangeStart())
  const listNode = $start.nodeAfter

  if (!listNode) return false

  const start = range.start
  const end = start + listNode.nodeSize

  if (getRangeEnd() !== end) return false

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
    if (indentListV3(tr, tr.selection.from, tr.selection.to, listType, 0)) {
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
  cycle: number,
): boolean {
  if (cycle >= 3) {
    console.warn('indentListV3 cycle limit reached')
    return false
  }

  const $from = normalizeFrom(tr.doc.resolve(from))
  const $to = normalizeTo(tr.doc.resolve(to))
  if ($from == null || $to == null) {
    return false
  }

  const range = findListsRange($from, $to, listType)
  if (!range) return false

  const { start: itemBefore, end: itemAfter } = range
  let itemStart = itemBefore + 1
  let itemEnd = itemAfter - 1
  let before = $from.before($from.depth)
  let after = $to.after($to.depth)

  const getStart = mapPos(tr, itemStart)
  const getEnd = mapPos(tr, itemEnd)
  const getBefore = mapPos(tr, before)
  const getAfter = mapPos(tr, after)

  console.log('indentListV3 A', {
    // itemBefore,
    // itemAfter,
    itemStart,
    itemEnd,
    before,
    after,
  })

  doIndent(tr, itemBefore, itemAfter, listType)

  itemStart = getStart()
  itemEnd = getEnd()
  before = getBefore()
  after = getAfter()

  console.log('indentListV3 B', {
    // itemBefore,
    // itemAfter,
    itemStart,
    itemEnd,
    before,
    after,
  })

  dedentListV3(tr, after, itemEnd, listType, cycle + 1)
  dedentListV3(tr, itemStart, before, listType, cycle + 1)

  // doDedent(tr, after, itemEnd, listType)
  // doDedent(tr, itemStart, before, listType)

  return true
}

export function doIndent(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
): boolean {
  console.log('doIndent', { from, to })

  if (from === to) {
    if (!tr.doc.resolve(from).parent.isTextblock) {
      return false
    }
  } else if (isEmptyRange(tr.doc, from, to)) {
    return false
  }

  const $from = normalizeFrom(tr.doc.resolve(from))
  const $to = normalizeTo(tr.doc.resolve(to))
  if ($from == null || $to == null) {
    return false
  }

  const range = $from.blockRange($to)
  if (!range) {
    return false
  }

  const { parent, startIndex, endIndex, start, end } = range

  if (startIndex > 0) {
    const nodeBefore = parent.child(startIndex - 1)
    if (nodeBefore.type === listType) {
      tr.step(
        new ReplaceAroundStep(
          start - 1,
          end,
          start,
          end,
          new Slice(Fragment.from(listType.create(null)), 1, 0),
          0,
          true,
        ),
      )
      return true
    }
  }

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

function isEmptyRange(doc: ProsemirrorNode, from: number, to: number): boolean {
  return doc.slice(from, to).size === 0
}

function maybeTextBlockStart($pos: ResolvedPos): number {
  if ($pos.parent.isTextblock) {
    return $pos.start()
  } else {
    return $pos.pos
  }
}

function maybeTextBlockEnd($pos: ResolvedPos): number {
  if ($pos.parent.isTextblock) {
    return $pos.start()
  } else {
    return $pos.pos
  }
}

function normalizeFrom($from: ResolvedPos): ResolvedPos | null {
  return $from
  return Selection.findFrom($from, 1)?.$to ?? null
}

function normalizeTo($to: ResolvedPos): ResolvedPos | null {
  return $to
  return Selection.findFrom($to, -1)?.$from ?? null
}
