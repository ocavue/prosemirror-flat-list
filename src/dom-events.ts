import { EditorView, NodeType } from '@remirror/pm'
import { ListAttributes } from './types'

export function handleListMarkerMouseDown(
  view: EditorView,
  event: MouseEvent,
  listType: NodeType,
): boolean {
  const target = event.target as HTMLElement | null

  if (target?.classList.contains('list-marker')) {
    event.preventDefault()

    const pos = view.posAtDOM(target, -10, -10)
    const tr = view.state.tr
    const $pos = tr.doc.resolve(pos)
    const list = $pos.parent
    if (list.type !== listType) {
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
