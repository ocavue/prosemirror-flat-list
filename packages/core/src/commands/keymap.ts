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
 * Keybinding for `Enter`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - {@link createSplitListCommand}
 *
 * @public
 */
export const enterCommand = chainCommands(
  protectCollapsed,
  createSplitListCommand(),
)

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
 * - `Enter`: See {@link enterCommand}.
 * - `Backspace`: See {@link backspaceCommand}.
 * - `Delete`: See {@link deleteCommand}.
 * - `Mod-[`: Decrease indentation. See {@link createDedentListCommand}.
 * - `Mod-]`: Increase indentation. See {@link createIndentListCommand}.
 *
 * @public
 */
export const listKeymap = {
  Enter: enterCommand,

  Backspace: backspaceCommand,

  Delete: deleteCommand,

  'Mod-[': createDedentListCommand(),

  'Mod-]': createIndentListCommand(),
}
