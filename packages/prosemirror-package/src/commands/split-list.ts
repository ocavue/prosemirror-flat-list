import { ProsemirrorNode } from '@remirror/core'
import { Command, EditorState, Transaction } from 'prosemirror-state'
import { canSplit } from 'prosemirror-transform'
import { getListType } from '../utils/get-list-type'
import { isBlockNodeSelection } from '../utils/is-block-node-selection'
import { isListNode } from '../utils/is-list-node'

/** @public */
export function createSplitListCommand(): Command {
  const splitListCommand: Command = (state, dispatch): boolean => {
    const { selection } = state
    const { $from, $to } = selection

    if (isBlockNodeSelection(selection)) {
      return false
    }

    if (!$from.sameParent($to)) {
      return false
    }

    const listNode = $from.node(-1)

    if (!isListNode(listNode)) {
      return false
    }

    const parent = $from.parent

    const indexInList = $from.index(-1)
    const parentEmpty = parent.content.size === 0

    // When the cursor is inside the first child of the list:
    if (indexInList === 0) {
      // If the parent is empty, lift delete the list bullet.
      if (parentEmpty) {
        return false
      }
      // Otherwise split and create a new list node.
      else {
        return doSplitList(state, listNode, dispatch)
      }
    }
    // When the cursor is not inside the first child of the list
    else {
      // If the parent is empty, split the list and create a new list node.
      if (parentEmpty) {
        return doSplitList(state, listNode, dispatch)
      }
      // Otherwise insert a new paragraph node and move the caret in it.
      else {
        return false
      }
    }
  }

  return splitListCommand
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
  const { $from, $to } = tr.selection

  tr.delete($from.pos, $to.pos)

  // If split the list at the start or at the middle, we want to inherit the
  // current parent type (e.g. heading); otherwise, we want to create a new
  // default block type (typically paragraph)
  const nextType =
    $to.pos === $from.end() ? listNode.contentMatchAt(0).defaultType : undefined
  const typesAfter = [
    {
      type: getListType(state.schema),
      attrs: {
        // We don't want to inherit the list attributes (e.g. checked) except
        // for the list type
        type: listNode.attrs.type,
      },
    },
    nextType ? { type: nextType } : null,
  ]

  if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
    return false
  }

  dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
  return true
}
