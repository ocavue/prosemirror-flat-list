import { Attrs } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { ListAttributes } from '../types'
import { isListNode } from './is-list-node'
import { setNodeAttributes } from './set-node-attributes'

export function setListAttributes<T extends Attrs = ListAttributes>(
  tr: Transaction,
  pos: number,
  attrs: T,
): boolean {
  const $pos = tr.doc.resolve(pos)
  for (let depth = $pos.depth; depth > 0; depth--) {
    const node = $pos.node(depth)
    if (isListNode(node)) {
      const pos = depth > 0 ? $pos.before(depth) : 0
      const oldAttrs: T = node.attrs as T
      const newAttrs: T = { ...oldAttrs, ...attrs }
      return setNodeAttributes(tr, pos, oldAttrs, newAttrs)
    }
  }
  return false
}
