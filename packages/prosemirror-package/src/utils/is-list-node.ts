import { ProsemirrorNode } from '@remirror/pm'
import { isListType } from './is-list-type'

export function isListNode(node: ProsemirrorNode | null | undefined): boolean {
  if (!node) return false
  return isListType(node.type)
}
