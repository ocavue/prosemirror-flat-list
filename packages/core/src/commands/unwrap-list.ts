import { Command } from 'prosemirror-state'

import { isListNode } from '../utils/is-list-node'
import { isNodeSelection } from '../utils/is-node-selection'
import { isListsRange } from '../utils/list-range'
import { safeLiftFromTo } from '../utils/safe-lift'

import { dedentOutOfList } from './dedent-list'

/**
 * Returns a command function that unwraps the list around the selection.
 *
 * @public
 */
export function createUnwrapListCommand(): Command {
  const unwrapList: Command = (state, dispatch) => {
    const selection = state.selection

    if (isNodeSelection(selection) && isListNode(selection.node)) {
      if (dispatch) {
        const tr = state.tr
        safeLiftFromTo(tr, tr.selection.from + 1, tr.selection.to - 1)
        dispatch(tr.scrollIntoView())
      }
      return true
    }

    const range = selection.$from.blockRange(selection.$to)

    if (range && isListsRange(range)) {
      const tr = state.tr
      if (dedentOutOfList(tr, range)) {
        dispatch?.(tr)
        return true
      }
    }

    if (range && isListNode(range.parent)) {
      if (dispatch) {
        const tr = state.tr
        safeLiftFromTo(
          tr,
          range.$from.start(range.depth),
          range.$to.end(range.depth),
        )
        dispatch(tr.scrollIntoView())
      }
      return true
    }

    return false
  }

  return unwrapList
}
