import { Fragment, NodeRange, NodeType, Slice } from '@remirror/pm/model'
import { Command, Transaction } from '@remirror/pm/state'
import { ReplaceAroundStep } from '@remirror/pm/transform'
import { autoJoinList } from '../utils/auto-join-list'
import {
  findListsRange,
  isLeftOpenRange,
  isRightOpenRange,
} from '../utils/list-range'
import { mapPos } from '../utils/map-pos'
import { dedentListV3 } from './dedent-list'
import { separateItemRange } from './separate-item-range'

export { createIndentListCommandV3 as createIndentListCommand }

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

export function createIndentListCommandV3(listType: NodeType): Command {
  const indentListCommand: Command = (state, dispatch): boolean => {
    const tr = state.tr
    if (indentListV3(tr, tr.selection.from, tr.selection.to, listType)) {
      dispatch?.(tr)
      return true
    }
    return false
  }

  return autoJoinList(indentListCommand, listType)
}

export function indentListV3(
  tr: Transaction,
  from: number,
  to: number,
  listType: NodeType,
): boolean {
  const map = mapPos(tr)

  const $from = tr.doc.resolve(from)
  const $to = tr.doc.resolve(to)
  const range = findListsRange($from, $to, listType)
  if (!range) return false

  const leftOpenIndex = isLeftOpenRange(range)
  const rightOpenIndex = isRightOpenRange(range)

  let leftStart = leftOpenIndex !== false && $from.before(range.depth + 1) + 1
  let leftEnd = leftOpenIndex !== false && $from.before($from.depth + 1) + 1

  let rightStart = rightOpenIndex !== false && $to.after(range.depth + 1) - 1
  let rightEnd = rightOpenIndex !== false && $to.after($to.depth-1) - 1

  indentListsRange(tr, range, listType)
  // return true

  leftStart = leftStart !== false && map(leftStart)
  leftEnd = leftEnd !== false && map(leftEnd)
  rightStart = rightStart !== false && map(rightStart)
  rightEnd = rightEnd !== false && map(rightEnd)

  console.log('indentListV3:', {
    leftStart,
    leftEnd,
    rightStart,
    rightEnd,
  })

  if (rightStart !== false && rightEnd !== false) {
    dedentListV3(tr, rightStart, rightEnd, listType)
  }

  if (leftStart !== false && leftEnd !== false) {
    dedentListV3(tr, leftStart, leftEnd, listType)
  }

  return true
}

function indentListsRange(
  tr: Transaction,
  range: NodeRange,
  listType: NodeType,
): boolean {
  const { start, end } = range

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
