import { CommandFunction } from '@remirror/pm'
import { Fragment, NodeType, Slice } from '@remirror/pm/model'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { findIndentationRange } from "../utils/find-indentation-range"

export function createIndentListCommand(itemType: NodeType): CommandFunction {
  return (props): boolean => {
    const { tr, dispatch } = props

    const { $from, $to } = tr.selection
    // const range = findItemRange($from, $to, itemType)
    const range = findIndentationRange($from, $to, itemType, true)

    if (!range) {
      return false
    }

    const { startIndex, parent } = range

    const nodeBefore = startIndex > 0 ? parent.child(startIndex - 1) : null
    const itemBefore = nodeBefore?.type === itemType ? nodeBefore : null

    if (dispatch) {
      const attrs = parent.type === itemType ? parent.attrs : null
      const slice = new Slice(
        Fragment.from(itemType.create({ ...attrs })),
        itemBefore ? 1 : 0,
        0
      )
      const { start, end } = range
      tr.step(
        new ReplaceAroundStep(
          start - (itemBefore ? 1 : 0),
          end,
          start,
          end,
          slice,
          itemBefore ? 0 : 1,
          true
        )
      )
      dispatch(tr.scrollIntoView())
    }

    return true
  }
}
