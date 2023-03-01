import {
  chainCommands,
  deleteSelection,
  joinTextblockBackward,
  joinTextblockForward,
  selectNodeBackward,
  selectNodeForward,
} from 'prosemirror-commands'
import { createDedentListCommand } from './dedent-list'
import { createIndentListCommand } from './indent-list'
import { joinListBackward } from './join-list-backward'
import { protectCollapsed } from './protect-collapsed'
import { createSplitListCommand } from './split-list'

/**
 * Keybinding for `Backspace`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - {@link joinListBackward}
 * - [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
 * - [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)
 *
 * @public
 */
export const backspaceCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinListBackward,
  joinTextblockBackward,
  selectNodeBackward,
)

/**
 * Keybinding for `Delete`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
 * - [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)
 *
 * @public
 */
export const deleteCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinTextblockForward,
  selectNodeForward,
)

/**
 * Returns an object containing the keymap for the list commands.
 *
 * - `Enter`: Split current list item or create a new paragraph. See {@link createSplitListCommand}.
 * - `Mod-[`: Decrease indentation. See {@link createDedentListCommand}.
 * - `Mod-]`: Increase indentation. See {@link createIndentListCommand}.
 * - `Backspace`: See {@link backspaceCommand}.
 * - `Delete`: See {@link deleteCommand}.
 *
 * @public
 */
export const listKeymap = {
  Enter: createSplitListCommand(),

  'Mod-[': createDedentListCommand(),

  'Mod-]': createIndentListCommand(),

  Backspace: backspaceCommand,

  Delete: deleteCommand,
}
