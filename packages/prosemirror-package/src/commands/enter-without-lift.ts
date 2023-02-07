import {
  chainCommands,
  createParagraphNear,
  newlineInCode,
  splitBlock,
} from 'prosemirror-commands'
import { Command } from 'prosemirror-state'

// This command has the same behavior as the `Enter` keybinding, but without the
// `liftEmptyBlock` command.

export const enterWithoutLift: Command = chainCommands(
  newlineInCode,
  createParagraphNear,
  splitBlock,
)
