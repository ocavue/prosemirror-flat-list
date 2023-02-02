import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../utils/auto-join-list'
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
      dispatch?.(tr)
      return true
    }
    return false
  }

  return autoJoinList(indentListCommand, listType)
}

function indentRange(
  range: NodeRange,
  tr: Transaction,
  listType: NodeType,
): boolean {
  const { parent, depth, $to, startIndex, endIndex, start } = range
  const length = endIndex - startIndex

  const firstChildRange = zoomInRange(range, startIndex)
  if (firstChildRange) {
    if (
      firstChildRange.parent.type === listType &&
      firstChildRange.parent.childCount === 1
    ) {
      return indentNodeRange(range, tr, listType)
    } else if (length === 1) {
      return indentRange(firstChildRange, tr, listType)
    } else {
      const firstChild = parent.child(startIndex)
      const getFurtherRangeFrom = mapPos(tr, start + firstChild.nodeSize + 1)
      const getFurtherRangeTo = mapPos(tr, $to.pos)

      indentRange(firstChildRange, tr, listType)

      const furtherRange = new NodeRange(
        tr.doc.resolve(getFurtherRangeFrom()),
        tr.doc.resolve(getFurtherRangeTo()),
        depth,
      )

      return indentNodeRange(furtherRange, tr, listType)
    }
  }
  return indentNodeRange(range, tr, listType)
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
