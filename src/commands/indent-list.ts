import { ProsemirrorNode } from '@remirror/pm'
import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList, autoJoinList2 } from '../utils/auto-join-list'
import {
  atEndBlockBoundary,
  atStartBlockBoundary,
} from '../utils/block-boundary'
import { findListsRange } from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { zoomInRange } from '../utils/zoom-in-range'
import { createIndentListCommandV3 } from './dedent-list'
import { separateItemRange } from './separate-item-range'

export {
  createIndentListCommandV3,
  createIndentListCommandV4 as createIndentListCommand,
}

export function createIndentListCommandV1(listType: NodeType): Command {
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

  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr

    {
      const { $from, $to } = tr.selection
      separateItemRange(tr, $from, $to, listType)
    }

    {
      const { $from, $to } = tr.selection

      const itemsRange = findListsRange($from, $to, listType)
      if (!itemsRange) {
        return false
      }

      const { start, end } = itemsRange

      tr.step(
        new ReplaceAroundStep(
          start,
          end,
          start,
          end,
          new Slice(Fragment.from(listType.create(null)), 0, 0),
          1,
          true,
        ),
      )
    }

    if (dispatch) {
      dispatch(tr)
    }

    return true
  }

  return autoJoinList(indentListCommand, listType)
}

export function createIndentListCommandV4(listType: NodeType): Command {
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

  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    const { $from, $to } = tr.selection

    const listsRange = findListsRange($from, $to, listType)
    if (!listsRange) return false

    if (indentRange(listsRange, tr, listType)) {
      autoJoinList2(tr, listType)
      dispatch?.(tr)
      return true
    }
    return false
  }

  return indentListCommand
}

function indentRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,

  includeStartBoundary?: boolean,
): boolean {
  const { parent, depth, $from, $to, startIndex, endIndex, start, end } = range
  const length = endIndex - startIndex

  const from = $from.pos
  const to = $to.pos

  includeStartBoundary =
    includeStartBoundary || atStartBlockBoundary($from, depth + 1)

  if (!includeStartBoundary) {
    console.log('not includeStartBoundary')

    if (length === 1) {
      return indentRange(
        new NodeRange(
          $from,
          $to.pos < end ? $to : tr.doc.resolve(range.end - 1),
          depth + 1,
        ),
        tr,
        listType,
      )
    } else {
      const splitPos = $from.posAtIndex(startIndex + 1, depth)

      const range1 = new NodeRange(
        $from,
        tr.doc.resolve(splitPos - 1),
        depth + 1,
      )
      const getRange2From = mapPos(tr, splitPos + 1)
      const getRange2To = mapPos(tr, to)

      indentRange(range1, tr, listType)

      const range2 = new NodeRange(
        tr.doc.resolve(getRange2From()),
        tr.doc.resolve(getRange2To()),
        depth,
      )

      indentRange(range2, tr, listType)
      return true
    }
  }

  if (!atEndBlockBoundary($to, depth + 1)) {
    console.log('not atEndBlockBoundary')

    if (length === 1) {
      return indentRange(
        new NodeRange(
          $from.pos > start ? $from : tr.doc.resolve(range.start + 1),
          $to.pos < end ? $to : tr.doc.resolve(range.end - 1),
          depth + 1,
        ),
        tr,
        listType,
      )
    } else {
      const splitPos = $from.posAtIndex(endIndex - 1, depth)

      const getRange1From = mapPos(tr, from)
      const getRange1To = mapPos(tr, splitPos - 1)

      const range2 = new NodeRange(tr.doc.resolve(splitPos + 1), $to, depth + 1)
      indentRange(range2, tr, listType)

      const range1 = new NodeRange(
        tr.doc.resolve(getRange1From()),
        tr.doc.resolve(getRange1To()),
        depth,
      )

      indentRange(range1, tr, listType)
      return true
    }

    return false
  }

  console.log('at boundary')

  return indentNodeRange(range, tr, listType)

  //   if (atEndBlockBoundary($to, depth)) {
  //     return indentNodeRange(range, tr, listType)
  //   } else {
  //     const range1 = new NodeRange(
  //       $from,
  //       tr.doc.resolve($from.posAtIndex(depth, endIndex - 1) - 1),
  //       depth,
  //     )

  //     const range2 = length >= 2 && zoomInRange(range, endIndex - 1)

  //     const getRange2From = range2 && mapPos(tr, range2.$from.pos)
  //     const getRange2To = range2 && mapPos(tr, range2.$to.pos)

  //     indentRange(range1, tr, listType)

  //     const range3 =
  //       range2 &&
  //       getRange2From &&
  //       getRange2To &&
  //       new NodeRange(
  //         tr.doc.resolve(getRange2From()),
  //         tr.doc.resolve(getRange2To()),
  //         range2.depth,
  //       )
  //     range3 && indentRange(range3, tr, listType)
  //   }
  // } else {
  //   const range1 = zoomInRange(range, startIndex)
  //   console.assert(range1, `range1 does not exist`)

  //   const range2 =
  //     length >= 2 &&
  //     new NodeRange(
  //       $from,
  //       tr.doc.resolve($from.posAtIndex(depth, startIndex + 1) + 1),
  //       depth,
  //     )

  //   const getRange2From = range2 && mapPos(tr, range2.$from.pos)
  //   const getRange2To = range2 && mapPos(tr, range2.$to.pos)

  //   range1 && indentRange(range1, tr, listType)

  //   const range3 =
  //     range2 &&
  //     getRange2From &&
  //     getRange2To &&
  //     new NodeRange(
  //       tr.doc.resolve(getRange2From()),
  //       tr.doc.resolve(getRange2To()),
  //       range2.depth,
  //     )
  //   range3 && indentRange(range3, tr, listType)
  // }

  // const firstChildRange = zoomInRange(range, startIndex)
  // if (
  //   firstChildRange &&
  //   (length > 1 || !isListNodeWithSingleChild(parent, listType))
  // ) {
  //   if (length === 1) {
  //     console.log('[indentRange] 1')
  //     return indentRange(firstChildRange, tr, listType)
  //   } else {
  //     const firstChild = parent.child(startIndex)
  //     const lastChild = parent.child(endIndex - 1)

  //     const getFurtherRangeFrom1 = mapPos(tr, start + firstChild.nodeSize + 1)
  //     const getFurtherRangeTo1 = mapPos(tr, end - lastChild.nodeSize - 1)

  //     const getFurtherRangeFrom2 = mapPos(tr, end - lastChild.nodeSize + 1)
  //     const getFurtherRangeTo2 = mapPos(tr, Math.min($to.pos, end - 1))

  //     console.log('[indentRange] 2')
  //     indentRange(firstChildRange, tr, listType)

  //     if (length >= 3) {
  //       const furtherRange1 = new NodeRange(
  //         tr.doc.resolve(getFurtherRangeFrom1()),
  //         tr.doc.resolve(getFurtherRangeTo1()),
  //         depth,
  //       )

  //       console.log('[indentRange] 3')
  //       indentNodeRange(furtherRange1, tr, listType)
  //     }

  //     const furtherRange2 = new NodeRange(
  //       tr.doc.resolve(getFurtherRangeFrom2()),
  //       tr.doc.resolve(getFurtherRangeTo2()),
  //       depth,
  //     )

  //     console.log('[indentRange] 4')
  //     indentRange(furtherRange2, tr, listType)
  //     return true
  //   }
  // }
  // console.log('[indentRange] 5')
  // return indentNodeRange(range, tr, listType)
}

function indentNodeRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
): boolean {
  const { parent, startIndex, start, end } = range
  const prevChild = startIndex >= 1 && parent.child(startIndex - 1)

  if (prevChild && prevChild.type === listType) {
    // Append the selected content into the prev child list

    tr.step(
      new ReplaceAroundStep(
        start - 1,
        end,
        start,
        end,
        new Slice(Fragment.from(listType.create(null)), 1, 0),
        0,
        true,
      ),
    )
    return true
  } else {
    // Wrap the selected content with a new list node

    tr.step(
      new ReplaceAroundStep(
        start,
        end,
        start,
        end,
        new Slice(Fragment.from(listType.create(null)), 0, 0),
        1,
        true,
      ),
    )
    return true
  }
}

function isListNodeWithSingleChild(node: ProsemirrorNode, listType: NodeType) {
  return node.type === listType && node.childCount <= 1
}
