import { CommandFunction } from '@remirror/pm'
import { Fragment, NodeType, Slice } from '@remirror/pm/model'
import { ReplaceAroundStep, ReplaceStep } from '@remirror/pm/transform'
import { findIndentationRange } from '../utils/find-indentation-range'

export function createIndentListCommand(listType: NodeType): CommandFunction {
  return (props): boolean => {
    const { tr, dispatch } = props

    const { $from, $to } = tr.selection
    // const range = findItemRange($from, $to, listType)
    const range = findIndentationRange($from, $to, listType, true)

    if (!range) {
      return false
    }

    const { startIndex, parent } = range

    const nodeBefore = startIndex > 0 ? parent.child(startIndex - 1) : null
    const itemBefore = nodeBefore?.type === listType ? nodeBefore : null

    console.log('itemBefore:', !!itemBefore)
    const listNode = range.parent.child(range.startIndex)
    console.log('range.parent:', range.parent.type.name)

    console.assert(listNode.type.name === 'list')

    if (dispatch) {
      const attrs = parent.type === listType ? parent.attrs : null
      const slice = new Slice(
        Fragment.from(
          //
          listType.create(
            null
            // Fragment.from(
            //   //
            //   listType.create(
            //
            // Fragment.from(
            //   //
            //   listType.create(
            //     { ...listNode.attrs, type: 'task' }
            //     // listNode.content
            //   )
            // )
            // )
            //   )
            // )
          )
        ),
        itemBefore ? 1 : 0,
        itemBefore ? 1 : 0
      )
      const { start, end } = range
      console.log('start end', start, end)
      tr.step(
        new ReplaceAroundStep(
          start - (itemBefore ? 1 : 0),
          end - (itemBefore ? 1 : 0),
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
