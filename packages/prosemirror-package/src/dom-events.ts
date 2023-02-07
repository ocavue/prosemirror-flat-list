import { EditorView } from 'prosemirror-view'
import { ListAttributes } from './types'
import { isListNode } from './utils/is-list-node'

export function handleListMarkerMouseDown(
  view: EditorView,
  event: MouseEvent,
): boolean {
  const target = event.target as HTMLElement | null

  if (target?.classList.contains('list-marker')) {
    event.preventDefault()

    const pos = view.posAtDOM(target, -10, -10)
    const tr = view.state.tr
    const $pos = tr.doc.resolve(pos)
    const list = $pos.parent
    if (isListNode(list)) {
      return false
    }

    const attrs = list.attrs as ListAttributes
    const listPos = $pos.before($pos.depth)
    if (attrs.type === 'task') {
      tr.setNodeAttribute(listPos, 'checked', !attrs.checked)
    } else if (attrs.type === 'toggle') {
      tr.setNodeAttribute(listPos, 'collapsed', !attrs.collapsed)
    }
    view.dispatch(tr)
    return true
  }

  return false
}
