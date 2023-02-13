/**
 * Wrap the giving command function so that it always returns `true`. This is
 * useful when we want pressing `Tab` and `Shift-Tab` won't blur the editor even
 * if the keybinding command returns `false`
 *
 * @public
 */
export function alwaysTrue<T extends (...args: any[]) => boolean>(func: T): T {
  // @ts-expect-error: ignore this error
  return (...args) => {
    func(...args)
    return true
  }
}
