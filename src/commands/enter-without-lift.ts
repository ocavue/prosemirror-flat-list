import { convertCommand } from '@remirror/pm'
import {
  chainCommands as pmChainCommands,
  createParagraphNear,
  newlineInCode,
  splitBlock,
} from '@remirror/pm/commands'

// This command has the same behavior as the `Enter` keybinding, but without the
// `liftEmptyBlock` command.

export const enterWithoutLift = convertCommand(
  pmChainCommands(newlineInCode, createParagraphNear, splitBlock)
)
