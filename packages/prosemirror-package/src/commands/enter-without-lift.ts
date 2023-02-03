import {
  chainCommands,
  createParagraphNear,
  newlineInCode,
  splitBlock,
} from '@remirror/pm/commands'
import { Command } from '@remirror/pm/state'

// This command has the same behavior as the `Enter` keybinding, but without the
// `liftEmptyBlock` command.

export const enterWithoutLift: Command = chainCommands(
  newlineInCode,
  createParagraphNear,
  splitBlock,
)
