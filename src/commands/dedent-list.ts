import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList2 } from '../utils/auto-join-list'
import {
  atEndBlockBoundary,
  atStartBlockBoundary,
} from '../utils/block-boundary'
import { findListsRange } from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { safeLift } from '../utils/safe-lift'
import { zoomInRange } from '../utils/zoom-in-range'

export function createDedentListCommand(listType: NodeType): Command {
  const dedentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    const { $from, $to } = tr.selection

    const range = findListsRange($from, $to, listType)
    if (!range) return false

    if (dedentRange(range, tr, listType)) {
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

  if (!startBoundary) {
    const { startIndex, endIndex } = range
    if (endIndex - startIndex === 1) {
      const contentRange = zoomInRange(range)
      return contentRange ? dedentRange(contentRange, tr, listType) : false
    } else {
      return splitAndDedentRange(range, tr, listType, startIndex + 1)
    }
  }

  endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1)

  if (!endBoundary) {
    fixEndBoundary(range, tr, listType)

    const endOfParent = $to.end(depth)
    range = new NodeRange(
      tr.doc.resolve($from.pos),
      tr.doc.resolve(endOfParent),
      depth,
    )
    return dedentRange(range, tr, listType, undefined, true)
  }

  if (
    range.startIndex === 0 &&
    range.endIndex === range.parent.childCount &&
    range.parent.type === listType
  ) {
    return dedentNodeRange(new NodeRange($from, $to, depth - 1), tr, listType)
  }

  return dedentNodeRange(range, tr, listType)
}

/**
 * Split a range into two parts, and dedent them separately.
 */
function splitAndDedentRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
  splitIndex: number,
): boolean {
  const { $from, $to, depth } = range

  const splitPos = $from.posAtIndex(splitIndex, depth)

  const range1 = $from.blockRange(tr.doc.resolve(splitPos - 1))
  if (!range1) return false

  const getRange2From = mapPos(tr, splitPos + 1)
  const getRange2To = mapPos(tr, $to.pos)

  dedentRange(range1, tr, listType, undefined, true)

  let range2 = tr.doc
    .resolve(getRange2From())
    .blockRange(tr.doc.resolve(getRange2To()))

  if (range2 && range2.depth >= depth) {
    range2 = new NodeRange(range2.$from, range2.$to, depth)
    dedentRange(range2, tr, listType, true, undefined)
  }
  return true
}

function dedentNodeRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
) {
  if (range.parent.type === listType) {
    return safeLift(tr, range)
  } else {
    return dedentOutOfList(tr, range)
  }
}

function fixEndBoundary(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
): void {
  if (range.endIndex - range.startIndex >= 2) {
    range = new NodeRange(
      range.$to.doc.resolve(
        range.$to.posAtIndex(range.endIndex - 1, range.depth),
      ),
      range.$to,
      range.depth,
    )
  }

  const contentRange = zoomInRange(range)
  if (contentRange) {
    fixEndBoundary(contentRange, tr, listType)
    range = new NodeRange(
      tr.doc.resolve(range.$from.pos),
      tr.doc.resolve(range.$to.pos),
      range.depth,
    )
  }

  const { $to, depth, end, parent, endIndex } = range
  const endOfParent = $to.end(depth)

  if (end < endOfParent && parent.maybeChild(endIndex - 1)?.type === listType) {
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
  }
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
