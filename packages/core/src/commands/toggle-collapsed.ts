import { ProsemirrorNode } from '@remirror/core'
import { Command } from 'prosemirror-state'
import { ListAttributes } from '../types'
import { isListNode } from '../utils/is-list-node'

/**
 * @public
 */
export interface ToggleCollapsedOptions {
  /**
   * If this value exists, the command will set the `collapsed` attribute to
   * this value instead of toggle it.
   */
  collapsed?: boolean

  /**
   * An optional function to accept a list node and return whether or not this
   * node can toggle its `collapsed` attribute.
   */
  isToggleable?: (node: ProsemirrorNode) => boolean
}

/**
 * @public
 *
 * Return a command function that toggle the `collapsed` attribute of the list node.
 */
export function createToggleCollapsedCommand({
  collapsed = undefined,
  isToggleable = defaultIsToggleable,
}: ToggleCollapsedOptions = {}): Command {
  const toggleCollapsed: Command = (state, dispatch) => {
    const { $from } = state.selection

    for (let depth = $from.depth; depth >= 0; depth--) {
      const node = $from.node(depth)
      if (isListNode(node) && isToggleable(node)) {
        const pos = $from.before(depth)
        const attrs = node.attrs as ListAttributes
        dispatch?.(
          state.tr.setNodeAttribute(
            pos,
            'collapsed',
            collapsed ?? !attrs.collapsed,
          ),
        )
        return true
      }
    }
    return false
  }

  return toggleCollapsed
}

function defaultIsToggleable(node: ProsemirrorNode): boolean {
  const attrs = node.attrs as ListAttributes

  return (
    attrs.kind === 'toggle' &&
    node.childCount >= 2 &&
    !isListNode(node.firstChild)
  )
}
