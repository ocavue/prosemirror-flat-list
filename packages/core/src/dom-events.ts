import { Node as ProsemirrorNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { ListAttributes } from './types'
import { isListNode } from './utils/is-list-node'
import { setNodeAttributes } from './utils/set-node-attributes'

/** @public */
export function handleListMarkerMouseDown(
  view: EditorView,
  event: MouseEvent,
  onListClick: ListClickHandler = defaultListClickHandler,
): boolean {
  const target = event.target as HTMLElement | null

  if (target?.classList.contains('list-marker-click-target')) {
    event.preventDefault()

    const pos = view.posAtDOM(target, -10, -10)
    const tr = view.state.tr
    const $pos = tr.doc.resolve(pos)
    const list = $pos.parent
    if (!isListNode(list)) {
      return false
    }

    const listPos = $pos.before($pos.depth)
    const attrs = onListClick(list)
    if (setNodeAttributes(tr, listPos, list.attrs, attrs)) {
      view.dispatch(tr)
    }
    return true
  }

  return false
}

/** @public */
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
