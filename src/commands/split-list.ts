import { CommandFunction } from '@remirror/pm'
import { NodeType } from '@remirror/pm/model'
import { canSplit } from '@remirror/pm/transform'
import { isBlockNodeSelection } from '../utils/is-block-node-selection'
import { enterWithoutLift } from './enter-without-lift'

export function createSplitListCommand(listType: NodeType): CommandFunction {
  return (props): boolean => {
    const { tr, dispatch, state } = props
    const { selection } = state
    const { $from, $to } = selection

    if (isBlockNodeSelection(selection)) {
      return false
    }

    if (!$from.sameParent($to)) {
      return false
    }

    if ($from.depth < 2) {
      return false
    }

    const currItem = $from.node(-1)

    if (currItem.type !== listType) {
      return false
    }

    // If the cursor is inside the list item, but not inside the first child
    // of the list item, then we don't want to split the list item and we
    // also don't want to lift the parent block. So we use the original
    // ProseMirror `Enter` keybinding but remove the `liftEmptyBlock`
    // command from it.
    if ($from.index(-1) !== 0) {
      return enterWithoutLift(props)
    }

    // If the parent block is empty, we lift this empty block.
    if ($from.parent.content.size === 0) {
      return false
    }

    // Split the list item
    const nextType =
      $to.pos === $from.end()
        ? currItem.contentMatchAt(0).defaultType
        : undefined
    tr.delete($from.pos, $to.pos)
    const typesAfter = [
      { type: currItem.type, attrs: currItem.attrs },
      nextType ? { type: nextType } : null,
    ]

    if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
      return false
    }

    dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
    return true
  }
}
