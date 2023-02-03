import { NodeType } from '@remirror/pm/model'
import { Command } from '@remirror/pm/state'
import { canSplit } from '@remirror/pm/transform'
import { isBlockNodeSelection } from '../utils/is-block-node-selection'
import { enterWithoutLift } from './enter-without-lift'

export function createSplitListCommand(listType: NodeType): Command {
  const splitListCommand: Command = (state, dispatch, view): boolean => {
    const { selection } = state
    const { $from, $to } = selection

    if (isBlockNodeSelection(selection)) {
      return false
    }

    if (!$from.sameParent($to)) {
      return false
    }

    const listNode = $from.node(-1)

    if (!listNode || listNode.type !== listType) {
      return false
    }

    // If the cursor is inside the list item, but not inside the first child
    // of the list item, then we don't want to split the list item and we
    // also don't want to lift the parent block. So we use the original
    // ProseMirror `Enter` keybinding but remove the `liftEmptyBlock`
    // command from it.
    if ($from.index(-1) !== 0) {
      return enterWithoutLift(state, dispatch, view)
    }

    // If the parent block is empty, we lift this empty block.
    if ($from.parent.content.size === 0) {
      return false
    }

    const tr = state.tr

    tr.delete($from.pos, $to.pos)

    // If split the list at the start or at the middle, we want to inherit the
    // current parent type (e.g. heading); otherwise, we want to create a new
    // default block type (typically paragraph)
    const nextType =
      $to.pos === $from.end()
        ? listNode.contentMatchAt(0).defaultType
        : undefined
    const typesAfter = [
      {
        type: listType,
        attrs: {
          // We don't want to inherit the list attributes (e.g. checked) except
          // for the list type
          type: listNode.attrs.type,
        },
      },
      nextType ? { type: nextType } : null,
    ]

    if (!canSplit(tr.doc, $from.pos, 2, typesAfter)) {
      return false
    }

    dispatch?.(tr.split($from.pos, 2, typesAfter).scrollIntoView())
    return true
  }

  return splitListCommand
}
