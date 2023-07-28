import { chainCommands } from 'prosemirror-commands'
import { NodeRange } from 'prosemirror-model'
import { Command } from 'prosemirror-state'

import { ListAttributes } from '../types'

import { createUnwrapListCommand } from './unwrap-list'
import { createWrapInListCommand } from './wrap-in-list'

export function createToggleListCommand<
  T extends ListAttributes = ListAttributes,
>(
  /** The list node attributes or a callback function to take the current
   * selection block range and return list node attributes. If this callback
   * function returns null, the command won't do anything.
   *
   * @public
   */
  getAttrs: T | ((range: NodeRange) => T),
): Command {
  const unwrapList = createUnwrapListCommand()
  const wrapInList = createWrapInListCommand(getAttrs)
  return chainCommands(unwrapList, wrapInList)
}
