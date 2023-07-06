import { Node as ProsemirrorNode } from 'prosemirror-model'
import { Command } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { withSafeSelection } from './commands/set-safe-selection'
import { ListAttributes } from './types'
import { isListNode } from './utils/is-list-node'
import { setNodeAttributes } from './utils/set-node-attributes'

/** @internal */
export function handleListMarkerMouseDown({
  view,
  event,
  onListClick = defaultListClickHandler,
}: {
  view: EditorView
  event: MouseEvent
  onListClick?: ListClickHandler
}): boolean {
  const target = event.target as HTMLElement | null

  if (target?.closest('.list-marker-click-target')) {
    event.preventDefault()

    const pos = view.posAtDOM(target, -10, -10)
    return handleMouseDown(pos, onListClick)(view.state, view.dispatch)
  }

  return false
}

function handleMouseDown(pos: number, onListClick: ListClickHandler): Command {
  const mouseDown: Command = (state, dispatch) => {
    const tr = state.tr
    const $pos = tr.doc.resolve(pos)
    const list = $pos.parent
    if (!isListNode(list)) {
      return false
    }

    const listPos = $pos.before($pos.depth)
    const attrs = onListClick(list)
    if (setNodeAttributes(tr, listPos, list.attrs, attrs)) {
      dispatch?.(tr)
    }
    return true
  }

  return withSafeSelection(mouseDown)
}

/** @internal */
export type ListClickHandler = (node: ProsemirrorNode) => ListAttributes

/** @internal */
export const defaultListClickHandler: ListClickHandler = (node) => {
  const attrs = node.attrs as ListAttributes
  if (attrs.kind === 'task') {
    return { ...attrs, checked: !attrs.checked }
  } else if (attrs.kind === 'toggle') {
    return { ...attrs, collapsed: !attrs.collapsed }
  } else {
    return attrs
  }
}
