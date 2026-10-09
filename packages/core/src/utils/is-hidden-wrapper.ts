import type { Node as ProsemirrorNode } from 'prosemirror-model'

import { isListNode } from './is-list-node'

/**
 * Returns `true` if `node` is a list node whose first child is also a list
 * node. Such a node renders no marker: it only adds one level of indentation
 * to its children.
 *
 * @internal
 */
export function isHiddenWrapper(
  node: ProsemirrorNode | null | undefined,
): boolean {
  return isListNode(node) && isListNode(node?.firstChild)
}
