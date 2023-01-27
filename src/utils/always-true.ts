import { CommandFunction } from '@remirror/pm'

/**
 * Wrap the giving command function so that it always returns `true`. This is
 * useful when we want pressing `Tab` and `Shift-Tab` won't blur the editor even
 * if the keybinding command returns `false`
 */
export function alwaysTrue(command: CommandFunction): CommandFunction {
  return (props) => {
    command(props)
    return true
  }
}
