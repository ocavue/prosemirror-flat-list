import {
  type Attrs,
  Fragment,
  type NodeRange,
  type Node as ProsemirrorNode,
  Slice,
} from 'prosemirror-model'
import type { Command, Transaction } from 'prosemirror-state'
import { ReplaceAroundStep } from 'prosemirror-transform'

import { getTransactionRanges, withAutoFixList } from '../utils/auto-fix-list'
import {
  atEndBlockBoundary,
  atStartBlockBoundary,
} from '../utils/block-boundary'
import { getListType } from '../utils/get-list-type'
import { inCollapsedList } from '../utils/in-collapsed-list'
import { isListNode } from '../utils/is-list-node'
import { findListsRange } from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { patchCommand } from '../utils/patch-command'
import { zoomInRange } from '../utils/zoom-in-range'

import { withVisibleSelection } from './set-safe-selection'

/**
 * @public
 *
 * @group Commands
 */
export interface IndentListOptions {
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

  /**
   * Whether to wrap the range with a new list node when there is no previous
   * list node to indent into (for example, the first item of a list). The new
   * list node's marker is hidden. Set it to `false` to make the command do
   * nothing in this case.
   *
   * @defaultValue `true`
   */
  wrap?: boolean

  /**
   * Returns the attributes for a list node whose marker is hidden after the
   * indent, because its first child is a list node. This applies to the new
   * wrapper list node, and to an existing list node whose first paragraph was
   * wrapped. It is useful when a hidden marker still has a meaning, for
   * example a task checkbox in Markdown.
   *
   * @defaultValue A function that returns `node.attrs` unchanged.
   */
  getHiddenListAttrs?: (node: ProsemirrorNode) => Attrs
}

/**
 * Returns a command function that increases the indentation of selected list
 * nodes.
 *
 * @public
 *
 * @group Commands
 */
export function createIndentListCommand(options?: IndentListOptions): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    const $from =
      options?.from == null ? tr.selection.$from : tr.doc.resolve(options.from)
    const $to =
      options?.to == null ? tr.selection.$to : tr.doc.resolve(options.to)

    const range = findListsRange($from, $to) || $from.blockRange($to)
    if (!range) return false

    if (indentRange(range, tr, options)) {
      dispatch?.(tr)
      return true
    }
    return false
  }

  const getHiddenListAttrs = options?.getHiddenListAttrs
  const command = withAutoFixList(indentListCommand)
  return withVisibleSelection(
    getHiddenListAttrs
      ? patchCommand((tr) => fixHiddenMarkers(tr, getHiddenListAttrs))(command)
      : command,
  )
}

function indentRange(
  range: NodeRange,
  tr: Transaction,
  options: IndentListOptions | undefined,
  startBoundary?: boolean,
  endBoundary?: boolean,
): boolean {
  const { depth, $from, $to } = range

  startBoundary = startBoundary || atStartBlockBoundary($from, depth + 1)

  if (!startBoundary) {
    const { startIndex, endIndex } = range
    if (endIndex - startIndex === 1) {
      const contentRange = zoomInRange(range)
      return contentRange ? indentRange(contentRange, tr, options) : false
    } else {
      return splitAndIndentRange(range, tr, options, startIndex + 1)
    }
  }

  endBoundary = endBoundary || atEndBlockBoundary($to, depth + 1)

  if (!endBoundary && !inCollapsedList($to)) {
    const { startIndex, endIndex } = range
    if (endIndex - startIndex === 1) {
      const contentRange = zoomInRange(range)
      return contentRange ? indentRange(contentRange, tr, options) : false
    } else {
      return splitAndIndentRange(range, tr, options, endIndex - 1)
    }
  }

  return indentNodeRange(range, tr, options)
}

/**
 * Split a range into two parts, and indent them separately.
 */
function splitAndIndentRange(
  range: NodeRange,
  tr: Transaction,
  options: IndentListOptions | undefined,
  splitIndex: number,
): boolean {
  const { $from, $to, depth } = range

  const splitPos = $from.posAtIndex(splitIndex, depth)

  const range1 = $from.blockRange(tr.doc.resolve(splitPos - 1))
  if (!range1) return false

  const getRange2From = mapPos(tr, splitPos + 1)
  const getRange2To = mapPos(tr, $to.pos)

  indentRange(range1, tr, options, undefined, true)

  const range2 = tr.doc
    .resolve(getRange2From())
    .blockRange(tr.doc.resolve(getRange2To()))

  if (range2) {
    indentRange(range2, tr, options, true, undefined)
  }
  return true
}

/**
 * Increase the indentation of a block range.
 */
function indentNodeRange(
  range: NodeRange,
  tr: Transaction,
  options: IndentListOptions | undefined,
): boolean {
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
  if (
    options?.wrap !== false &&
    ((startIndex === 0 && isParentListNode) || isFirstChildListNode)
  ) {
    const { start, end } = range
    const child = parent.child(startIndex)
    const listAttrs: Attrs | null = isFirstChildListNode
      ? (options?.getHiddenListAttrs?.(child) ?? child.attrs)
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

/**
 * When we wrap the first paragraph of a list node, the new list node shows the
 * marker and the old list node hides its marker. Update the attributes of such
 * hidden list nodes in the changed ranges. This runs after `withAutoFixList`,
 * so that a list node split from the old one keeps the old attributes.
 */
function fixHiddenMarkers(
  tr: Transaction,
  getHiddenListAttrs: (node: ProsemirrorNode) => Attrs,
): Transaction {
  const ranges = getTransactionRanges(tr).next().value
  const fixes = new Map<number, Attrs>()

  for (let i = 0; i + 1 < ranges.length; i += 2) {
    const from = Math.min(ranges[i], ranges[i + 1])
    const to = Math.max(ranges[i], ranges[i + 1], from + 1)
    tr.doc.nodesBetween(
      from,
      Math.min(to, tr.doc.content.size),
      (node, pos) => {
        if (!isListNode(node) || !isListNode(node.firstChild)) return
        const attrs = getHiddenListAttrs(node)
        if (!node.hasMarkup(node.type, attrs)) fixes.set(pos, attrs)
      },
    )
  }

  // `setNodeMarkup` does not change positions, so the order does not matter.
  for (const [pos, attrs] of fixes) {
    tr.setNodeMarkup(pos, undefined, attrs)
  }
  return tr
}
