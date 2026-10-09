import {
  chainCommands,
  deleteSelection,
  joinTextblockBackward,
  joinTextblockForward,
  selectNodeBackward,
  selectNodeForward,
} from 'prosemirror-commands'
import type { Command } from 'prosemirror-state'

import { createDedentListCommand } from './dedent-list'
import { createIndentListCommand } from './indent-list'
import { joinCollapsedListBackward } from './join-collapsed-backward'
import { joinListUp } from './join-list-up'
import { protectCollapsed } from './protect-collapsed'
import { createSplitListCommand } from './split-list'

/**
 * Keybinding for `Enter`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - {@link createSplitListCommand}
 *
 * @public
 *
 * @group Commands
 */
export const enterCommand = createEnterCommand()

function createEnterCommand(options?: ListKeymapOptions): Command {
  return chainCommands(protectCollapsed, createSplitListCommand(options))
}

/**
 * Keybinding for `Backspace`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - {@link joinListUp}
 * - {@link joinCollapsedListBackward}
 * - [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
 * - [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)
 *
 * @public
 *
 * @group Commands
 *
 */
export const backspaceCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinListUp,
  joinCollapsedListBackward,
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
 *
 * @group Commands
 *
 */
export const deleteCommand = chainCommands(
  protectCollapsed,
  deleteSelection,
  joinTextblockForward,
  selectNodeForward,
)

/**
 * @public
 *
 * @group Commands
 */
export interface ListKeymapOptions {
  /**
   * The `strict` option passed to {@link createSplitListCommand},
   * {@link createDedentListCommand} and {@link createIndentListCommand}.
   *
   * @defaultValue `false`
   */
  strict?: boolean
}

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
 *
 * @group Commands
 */
export function createListKeymap(
  options?: ListKeymapOptions,
): Record<string, Command> {
  return {
    Enter: createEnterCommand(options),

    Backspace: backspaceCommand,

    Delete: deleteCommand,

    'Mod-[': createDedentListCommand(options),

    'Mod-]': createIndentListCommand(options),
  }
}

/**
 * The keymap returned by {@link createListKeymap} with the default options.
 *
 * @public
 *
 * @group Commands
 */
export const listKeymap = createListKeymap()
