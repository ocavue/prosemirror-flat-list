import { CommandFunction } from '@remirror/pm'
import { NodeType } from '@remirror/pm/model'
import findItemRange from '../utils/find-item-range'
import { equalMaxOpenEnd } from '../utils/max-open'

export function createIndentListCommand(listType: NodeType): CommandFunction {
  return (props): boolean => {
    /*

    Let's say we have the following list nodes, represented in the Markdown
    syntax. The <start> and <end> are the current selection range.

    - A1
      - B1
      - <start>B2
    - A2
      - B3
        - C1<end>
          - D1
      - B4

    Here is what this function will do to indent the list nodes:

    Step 1: we split these list nodes into three parts. (FYI, the following code snippet is a 100%
    valid Markdown syntax based on the CommonMark spec).

    - A1
      - B1

    - - <start>B2
    - A2
      - B3
        - C1<end>

    - - - - D1
      - B4

    Step 2: we need to increase the indentation for the middle part. 

    - A1
      - B1

    - - - <start>B2
      - A2
        - B3
          - C1<end>

    - - - - D1
      - B4

    Step 3: we join all three parts together and get rid of the extra list nodes

    - A1
      - B1
        - <start>B2
      - A2
        - B3
          - C1<end>
          - D1
      - B4

    Q&A

    Q: Why don't we just use the `ReplaceAroundStep` to do the job? 

    A: We cannot, at least with the current `ReplaceAroundStep` design.
    `ReplaceAroundStep` requires the gap to be a flat range
    (https://github.com/prosemirror/prosemirror-transform/blob/1.7.1/src/replace_step.ts#L116),
    while the slice between <start> and <end> in the example above is not flat.
    We could, however, update the current `ReplaceAroundStep` to support such
    cases, but I would like to avoid changing the core library for now.

    Q: Why don't we just use one big `ReplaceStep`, to wrap the content that
    need to be indented? 

    A: Because we will lose the text selection, as the selection range will been
    replaced if we do so.

    */

    const { tr, dispatch } = props
    const { doc } = tr

    const { $from, $to } = tr.selection

    // The block range that includes both $from and $to. It could contain one or more list nodes.
    const allItemsRange = findItemRange($from, $to, listType)
    if (!allItemsRange) {
      return false
    }

    // The block range that includes $from. It should contain only one top-level list node.
    const firstItemRange = findItemRange($from, $from, listType)
    if (!firstItemRange) {
      return false
    }

    // The block range that includes $to. It should contain only one top-level list node.
    const lastItemRange = $from.sameParent($to)
      ? firstItemRange
      : findItemRange($to, $to, listType)
    if (!lastItemRange) {
      return false
    }

    if (!tr.selection.empty && allItemsRange.end !== lastItemRange.end) {
      const $posAfterLastItem = doc.resolve(lastItemRange.end)
      const $posAfterAllItems = doc.resolve(allItemsRange.end)

      if (!equalMaxOpenEnd($posAfterLastItem, $posAfterAllItems)) {
        const maxDepthOffset = $posAfterLastItem.depth - $posAfterAllItems.depth

        for (let depthOffset = 0; depthOffset < maxDepthOffset; depthOffset++) {
          const after = $posAfterLastItem.after(
            $posAfterLastItem.depth - depthOffset
          )
          const expectedAfter = $posAfterLastItem.pos + depthOffset + 1

          if (after !== $posAfterLastItem.pos + depthOffset + 1) {
            console.log('split At depth', depthOffset, {
              after,
              expectedAfter,
            })
            tr.split(expectedAfter - 1, maxDepthOffset - depthOffset)
            break
          }
        }
      }
    }

    if (dispatch) {
      dispatch(tr)
    }

    return true

    // const { startIndex, parent } = range

    // const nodeBefore = startIndex > 0 ? parent.child(startIndex - 1) : null
    // const itemBefore = nodeBefore?.type === listType ? nodeBefore : null

    // console.log('itemBefore:', !!itemBefore)
    // const listNode = range.parent.child(range.startIndex)
    // console.log('range.parent:', range.parent.type.name)

    // console.assert(listNode.type.name === 'list')

    // if (false && dispatch) {
    //   const attrs = parent.type === listType ? parent.attrs : null
    //   const slice = new Slice(
    //     Fragment.from(
    //       //
    //       listType.create(
    //         null
    //         // Fragment.from(
    //         //   //
    //         //   listType.create(
    //         //
    //         // Fragment.from(
    //         //   //
    //         //   listType.create(
    //         //     { ...listNode.attrs, type: 'task' }
    //         //     // listNode.content
    //         //   )
    //         // )
    //         // )
    //         //   )
    //         // )
    //       )
    //     ),
    //     itemBefore ? 1 : 0,
    //     itemBefore ? 1 : 0
    //   )
    //   const { start, end } = range
    //   console.log('start end', start, end)
    //   tr.step(
    //     new ReplaceAroundStep(
    //       start - (itemBefore ? 1 : 0),
    //       end - (itemBefore ? 1 : 0),
    //       start,
    //       end,
    //       slice,
    //       itemBefore ? 0 : 1,
    //       true
    //     )
    //   )
    //   dispatch(tr.scrollIntoView())
    // }

    // return true
  }
}
