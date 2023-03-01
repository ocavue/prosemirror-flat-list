import { Node as ProsemirrorNode, NodeRange } from 'prosemirror-model'
import { Command, EditorState, Selection, Transaction } from 'prosemirror-state'
import { canSplit } from 'prosemirror-transform'
import { ListAttributes } from '../types'
import { getListType } from '../utils/get-list-type'
import { isBlockNodeSelection } from '../utils/is-block-node-selection'
import { isListNode } from '../utils/is-list-node'
import { dedentNodeRange } from './dedent-list'
import { enterWithoutLift } from './enter-without-lift'

/**
 * Returns a command that split the current list node.
 *
 * @public
 */
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
    //    Otherwise split and create a new list node.
    // When the cursor is inside the second or further children of the list:
    //    Create a new paragraph.
    if (indexInList === 0) {
      if (parentEmpty) {
        const tr = state.tr
        const range = new NodeRange(
          $from,
          tr.doc.resolve($from.end(listDepth - 1)),
          listDepth - 1,
        )
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
  const attrs: ListAttributes = listNode.attrs

  tr.delete(tr.selection.from, tr.selection.to)

  const { $from, $to } = tr.selection

  const atEnd = $to.parentOffset == $to.parent.content.size

  if (atEnd && attrs.collapsed) {
    if (dispatch) {
      const pos = $from.after(-1)
      tr.insert(
        pos,
        listNode.type.createAndFill({
          kind: attrs.kind,
        } satisfies ListAttributes)!,
      )
      tr.setSelection(Selection.near(tr.doc.resolve(pos)))
      dispatch(tr)
    }
    return true
  }

  // If split the list at the start or at the middle, we want to inherit the
  // current parent type (e.g. heading); otherwise, we want to create a new
  // default block type (typically paragraph)
  const nextType = atEnd ? listNode.contentMatchAt(0).defaultType : undefined
  const typesAfter = [
    {
      type: getListType(state.schema),
      attrs: {
        // We don't want to inherit all list attributes (e.g. checked) except
        // for the list kind
        kind: attrs.kind,
      } satisfies ListAttributes,
    },
    nextType ? { type: nextType } : null,
  ]

  if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
    return false
  }

  dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
  return true
}
