import { Command } from '@remirror/pm/state'
import { cutByIndex } from '../utils/cut-by-index'
import { findListsRange } from '../utils/list-range'

export function createMoveListCommand(direction: 'up' | 'down'): Command {
  const moveList: Command = (state, dispatch): boolean => {
    const { $from, $to } = state.selection
    const range = findListsRange($from, $to)
    if (!range) return false

    const { parent, depth, startIndex, endIndex } = range

    if (direction === 'up') {
      if (startIndex > 0) {
        const before = cutByIndex(parent.content, startIndex - 1, startIndex)
        const selected = cutByIndex(parent.content, startIndex, endIndex)
        if (
          parent.canReplace(startIndex - 1, endIndex, selected.append(before))
        ) {
          if (dispatch) {
            const tr = state.tr
            tr.insert($from.posAtIndex(endIndex, depth), before)
            tr.delete(
              $from.posAtIndex(startIndex - 1, depth),
              $from.posAtIndex(startIndex, depth),
            )
            dispatch(tr)
          }
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      if (endIndex < parent.childCount) {
        const selected = cutByIndex(parent.content, startIndex, endIndex)
        const after = cutByIndex(parent.content, endIndex, endIndex + 1)
        if (
          parent.canReplace(startIndex, endIndex + 1, after.append(selected))
        ) {
          if (dispatch) {
            const tr = state.tr
            tr.delete(
              $from.posAtIndex(endIndex, depth),
              $from.posAtIndex(endIndex + 1, depth),
            )
            tr.insert($from.posAtIndex(startIndex, depth), after)
            dispatch(tr)
          }
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }

  return moveList
}
