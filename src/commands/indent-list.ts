import { CommandFunction } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { findIndentationRange } from '../utils/find-indentation-range'
import findItemRange from '../utils/find-item-range'
import { isLastChild } from '../utils/is-last-child'

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
    const listDepth = range.depth + 1
    const listContentDepth = listDepth + 1

    const nodeBefore = startIndex > 0 ? parent.child(startIndex - 1) : null
    const itemBefore = nodeBefore?.type === listType ? nodeBefore : null

    const siblingAfter = !isLastChild($to, listDepth)
    console.log('siblingAfter:', siblingAfter)

    const listContentEnd = $to.after(listContentDepth)
    const listEnd = $to.after(listDepth)
    let siblingAfterFrom = listContentEnd
    let siblingAfterTo = listEnd - 1
    console.log(
      'siblingAfterFrom siblingAfterTo',
      siblingAfterFrom,
      siblingAfterTo
    )
    // debugger

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

      {
        const { $to } = tr.selection
        const listRange = findItemRange($to, $to, listType)
        if (listRange) {
          const listDepth = listRange.depth + 1
          const listContentDepth = listDepth + 1
          const listContentRangeAfterFrom = $to.after(listContentDepth)
          const listContentRangeAfterTo = $to.after(listDepth) - 1

          if (listContentRangeAfterFrom < listContentRangeAfterTo) {
            tr.step(
              new ReplaceAroundStep(
                listContentRangeAfterFrom,
                listContentRangeAfterTo + 1,
                listContentRangeAfterFrom,
                listContentRangeAfterTo,
                new Slice(
                  Fragment.fromArray([
                    //
                    listType.create(null),
                    // listType.create(null),
                  ]),
                  1,
                  0
                ),
                1,
                true
              )
            )
          }
        }
      }

      if (false && siblingAfterFrom < siblingAfterTo) {
        if (itemBefore) {
          siblingAfterFrom--
          siblingAfterTo--
        } else {
          siblingAfterFrom++
          siblingAfterTo++
        }

        tr.step(
          new ReplaceAroundStep(
            siblingAfterFrom,
            siblingAfterTo + 1,
            siblingAfterFrom,
            siblingAfterTo,
            new Slice(
              Fragment.fromArray([
                //
                listType.create(null),
                // listType.create(null),
              ]),
              1,
              0
            ),
            1,
            true
          )
        )
      }

      // debugger

      dispatch(tr.scrollIntoView())
    }

    return true
  }
}
