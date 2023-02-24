import { Fragment, NodeRange, Slice } from 'prosemirror-model'
import { Command, Transaction } from 'prosemirror-state'
import { ReplaceAroundStep } from 'prosemirror-transform'
import { ListAttributes } from '../types'
import { autoJoinList } from '../utils/auto-join-list'
import {
  atEndBlockBoundary,
  atStartBlockBoundary,
} from '../utils/block-boundary'
import { getListType } from '../utils/get-list-type'
import { inCollapsedList } from '../utils/in-collapsed-list'
import { isListNode } from '../utils/is-list-node'
import { findListsRange } from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { zoomInRange } from '../utils/zoom-in-range'

/** @public */
export interface IndentListProps {
  /**
   * A optional from position to indent.
   *
   * @defaultValue `state.selection.from`
   */
  from?: number

  /**
   * A optional to position to indent.
   *
   * @defaultValue `state.selection.to`
   */
  to?: number
}

/**
 * Returns a command function that increases the indentation of selected list
 * nodes.
 *
 * @public
 */
export function createIndentListCommand(props?: IndentListProps): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    // prettier-ignore
    const $from = props?.from == null ? tr.selection.$from : tr.doc.resolve(props.from)
    const $to = props?.to == null ? tr.selection.$to : tr.doc.resolve(props.to)

    const range = findListsRange($from, $to) || $from.blockRange($to)
    if (!range) return false

    if (indentRange(range, tr)) {
      if (dispatch) {
        autoJoinList(tr)
        dispatch(tr)
      }
      return true
    }
    return false
  }

  return indentListCommand
}

function indentRange(
  range: NodeRange,
  tr: Transaction,
  startBoundary?: boolean,
  endBoundary?: boolean,
): boolean {
  const { depth, $from, $to } = range

  startBoundary = startBoundary || atStartBlockBoundary($from, depth + 1)

  if (!startBoundary) {
    const { startIndex, endIndex } = range
    if (endIndex - startIndex === 1) {
      const contentRange = zoomInRange(range)
      return contentRange ? indentRange(contentRange, tr) : false
    } else {
      return splitAndIndentRange(range, tr, startIndex + 1)
    }
  }

  endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1)

  if (!endBoundary && !inCollapsedList($to)) {
    const { startIndex, endIndex } = range
    if (endIndex - startIndex === 1) {
      const contentRange = zoomInRange(range)
      return contentRange ? indentRange(contentRange, tr) : false
    } else {
      return splitAndIndentRange(range, tr, endIndex - 1)
    }
  }

  return indentNodeRange(range, tr)
}

/**
 * Split a range into two parts, and indent them separately.
 */
function splitAndIndentRange(
  range: NodeRange,
  tr: Transaction,
  splitIndex: number,
): boolean {
  const { $from, $to, depth } = range

  const splitPos = $from.posAtIndex(splitIndex, depth)

  const range1 = $from.blockRange(tr.doc.resolve(splitPos - 1))
  if (!range1) return false

  const getRange2From = mapPos(tr, splitPos + 1)
  const getRange2To = mapPos(tr, $to.pos)

  indentRange(range1, tr, undefined, true)

  const range2 = tr.doc
    .resolve(getRange2From())
    .blockRange(tr.doc.resolve(getRange2To()))

  range2 && indentRange(range2, tr, true, undefined)

  return true
}

/**
 * Increase the indentation of a block range.
 */
function indentNodeRange(range: NodeRange, tr: Transaction): boolean {
  const listType = getListType(tr.doc.type.schema)
  const { parent, startIndex } = range
  const prevChild = startIndex >= 1 && parent.child(startIndex - 1)

  // If the previous node before the range is a list node, move the range into
  // the previous list node as its children
  if (prevChild && isListNode(prevChild)) {
    const { start, end } = range
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

  // If we can avoid to add a new bullet visually, we can wrap the range with a
  // new list node.
  const isParentListNode = isListNode(parent)
  const isFirstChildListNode = isListNode(parent.maybeChild(startIndex))
  if ((startIndex === 0 && isParentListNode) || isFirstChildListNode) {
    const { start, end } = range
    const listAttrs: ListAttributes | null = isFirstChildListNode
      ? parent.child(startIndex).attrs
      : isParentListNode
      ? parent.attrs
      : null
    tr.step(
      new ReplaceAroundStep(
        start,
        end,
        start,
        end,
        new Slice(Fragment.from(listType.create(listAttrs)), 0, 0),
        1,
        true,
      ),
    )
    return true
  }

  // Otherwise we cannot indent
  return false
}
