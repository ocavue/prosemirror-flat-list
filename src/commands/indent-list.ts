import { CommandFunction } from '@remirror/pm'
import { Fragment, NodeType, Slice } from '@remirror/pm/model'
import {
  ReplaceAroundStep,
  ReplaceStep,
  replaceStep,
} from '@remirror/pm/transform'
import { findIndentationRange } from '../utils/find-indentation-range'
import { isFirstChild, isLastChild } from '../utils/is-last-child'

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
      const listDepth = range.depth + 1
      const siblingBefore = !isFirstChild($from, listDepth)
      const siblingAfter = !isLastChild($to, listDepth)

      // const siblingBefore =
      //   $from.before($from.depth) - 1 ===` $from.before($from.depth - 1)
      //     ? false
      //     : true

      // const siblingAfter =
      //   $to.end($to.depth) + 1 === $to.after($to.depth - 1) ? false : true

      console.log('start end', start, end)
      console.log('siblingBefore siblingAfter', siblingBefore, siblingAfter)

      const fr = tr.doc.slice(27, 37).content
      console.log('fr', fr.toString())
      // debugger
      tr.step(
        // new ReplaceAroundStep(25, 37, 27, 37, slice, 1, true)
        new ReplaceStep(
          25,
          37,
          new Slice(tr.doc.slice(27, 37).content, 0, 0),
          false
        )
      )
      dispatch(tr.scrollIntoView())
    }

    return true
  }
}
