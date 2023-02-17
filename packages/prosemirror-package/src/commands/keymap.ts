import {
  chainCommands,
  deleteSelection,
  joinTextblockBackward,
  joinTextblockForward,
  selectNodeBackward,
  selectNodeForward,
} from 'prosemirror-commands'
import { alwaysTrue } from '../utils/always-true'
import { createDedentListCommand } from './dedent-list'
import { createIndentListCommand } from './indent-list'
import { protectCollapsed } from './protect-collapsed'
import { createSplitListCommand } from './split-list'

const deleteCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinTextblockForward,
  selectNodeForward,
)

const backspaceCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinTextblockBackward,
  selectNodeBackward,
)

/**
 * Returns an object containing the keymap for the list commands.
 *
 * - `Enter`: Split current list item or create a new paragraph.
 * - `Mod-[`: Decrease indentation.
 * - `Mod-]`: Increase indentation.
 * - `Delete`: Expand selected collapsed content, or fall back to the usually delete command.
 * - `Backspace`: Expand selected collapsed content, or fall back to the usually Backspace command.
 *
 * Notice that `Delete` and `Backspace` use [`joinTextblockForward`](https://prosemirror.net/docs/ref/#commands.joinTextblockForward) and [`joinTextblockBackward`](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward) under the hood, which have slightly different behavior than the default [`joinForward`](https://prosemirror.net/docs/ref/#commands.joinForward) and [`joinBackward`](https://prosemirror.net/docs/ref/#commands.joinBackward) commands in the `prosemirror-commands` package.
 *
 * @public
 */
export const listKeymap = {
  Enter: createSplitListCommand(),

  'Mod-[': alwaysTrue(createDedentListCommand()),

  'Mod-]': alwaysTrue(createIndentListCommand()),

  Delete: deleteCommand,

  Backspace: backspaceCommand,
}
