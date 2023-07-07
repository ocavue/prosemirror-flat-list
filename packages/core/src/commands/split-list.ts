import { isTextSelection } from '@remirror/core'
import { chainCommands } from 'prosemirror-commands'
import {
  Fragment,
  NodeRange,
  Node as ProsemirrorNode,
  Slice,
} from 'prosemirror-model'
import {
  Command,
  EditorState,
  NodeSelection,
  Selection,
  TextSelection,
  Transaction,
} from 'prosemirror-state'
import { canSplit } from 'prosemirror-transform'

import { ListAttributes } from '../types'
import { withAutoFixList } from '../utils/auto-fix-list'
import { createAndFill } from '../utils/create-and-fill'
import { isBlockNodeSelection } from '../utils/is-block-node-selection'
import { isListNode } from '../utils/is-list-node'

import { dedentNodeRange } from './dedent-list'
import { enterWithoutLift } from './enter-without-lift'

/**
 * Returns a command that split the current list node.
 *
 * @public @group Commands
 *
 */
export function createSplitListCommand(): Command {
  return withAutoFixList(
    chainCommands(splitBlockNodeSelectionInListCommand, splitListCommand),
  )
}

function deriveListAttributes(listNode: ProsemirrorNode): ListAttributes {
  // For the new list node, we don't want to inherit any list attribute (For example: `checked`) other than `kind`
  return { kind: (listNode.attrs as ListAttributes).kind }
}

const splitBlockNodeSelectionInListCommand: Command = (state, dispatch) => {
  if (!isBlockNodeSelection(state.selection)) {
    return false
  }

  const selection = state.selection as NodeSelection
  const { $to, node } = selection
  const parent = $to.parent

  // We only cover the case that
  // 1. the list node only contains one child node
  // 2. this child node is not a list node
  if (
    isListNode(node) ||
    !isListNode(parent) ||
    parent.childCount !== 1 ||
    parent.firstChild !== node
  ) {
    return false
  }

  const listType = parent.type
  const nextList = listType.createAndFill(deriveListAttributes(parent))
  if (!nextList) {
    return false
  }

  if (dispatch) {
    const tr = state.tr
    const cutPoint = $to.pos
    tr.replace(
      cutPoint,
      cutPoint,
      new Slice(Fragment.fromArray([listType.create(), nextList]), 1, 1),
    )
    const newSelection = TextSelection.near(tr.doc.resolve(cutPoint))
    if (isTextSelection(newSelection)) {
      tr.setSelection(newSelection)
      dispatch(tr)
    }
  }

  return true
}

const splitListCommand: Command = (state, dispatch): boolean => {
  if (isBlockNodeSelection(state.selection)) {
    return false
  }

  const { $from, $to } = state.selection

  if (!$from.sameParent($to)) {
    return false
  }

  if ($from.depth < 2) {
    return false
  }

  const listDepth = $from.depth - 1
  const listNode = $from.node(listDepth)

  if (!isListNode(listNode)) {
    return false
  }

  const parent = $from.parent

  const indexInList = $from.index(listDepth)
  const parentEmpty = parent.content.size === 0

  // When the cursor is inside the first child of the list:
  //    If the parent block is empty, dedent the list;
  //    otherwise split and create a new list node.
  // When the cursor is inside the second or further children of the list:
  //    Create a new paragraph.
  if (indexInList === 0) {
    if (parentEmpty) {
      const $listEnd = state.doc.resolve($from.end(listDepth))

      const listParentDepth = listDepth - 1
      const listParent = $from.node(listParentDepth)
      const indexInListParent = $from.index(listParentDepth)
      const isLastChildInListParent =
        indexInListParent === listParent.childCount - 1

      // If the list is the last child of the list parent, we want to dedent
      // the whole list; otherwise, we only want to dedent the list content
      // (and thus unwrap these content from the list node)
      const range = isLastChildInListParent
        ? new NodeRange($from, $listEnd, listParentDepth)
        : new NodeRange($from, $listEnd, listDepth)
      const tr = state.tr
      if (range && dedentNodeRange(range, tr)) {
        dispatch?.(tr)
        return true
      }
      return false
    } else {
      return doSplitList(state, listNode, dispatch)
    }
  } else {
    if (parentEmpty) {
      return enterWithoutLift(state, dispatch)
    } else {
      return false
    }
  }
}

/**
 * @internal
 */
export function doSplitList(
  state: EditorState,
  listNode: ProsemirrorNode,
  dispatch?: (tr: Transaction) => void,
): boolean {
  const tr = state.tr
  const listType = listNode.type
  const attrs: ListAttributes = listNode.attrs
  const newAttrs: ListAttributes = deriveListAttributes(listNode)

  tr.delete(tr.selection.from, tr.selection.to)

  const { $from, $to } = tr.selection

  const { parentOffset } = $to

  const atStart = parentOffset == 0
  const atEnd = parentOffset == $to.parent.content.size

  if (atStart) {
    if (dispatch) {
      const pos = $from.before(-1)
      tr.insert(pos, createAndFill(listType, newAttrs))
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  if (atEnd && attrs.collapsed) {
    if (dispatch) {
      const pos = $from.after(-1)
      tr.insert(pos, createAndFill(listType, newAttrs))
      tr.setSelection(Selection.near(tr.doc.resolve(pos)))
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  // If split the list at the start or at the middle, we want to inherit the
  // current parent type (e.g. heading); otherwise, we want to create a new
  // default block type (typically paragraph)
  const nextType = atEnd ? listNode.contentMatchAt(0).defaultType : undefined
  const typesAfter = [
    { type: listType, attrs: newAttrs },
    nextType ? { type: nextType } : null,
  ]

  if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
    return false
  }

  dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
  return true
}
