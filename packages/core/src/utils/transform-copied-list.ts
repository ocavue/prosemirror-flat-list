import { Slice } from 'prosemirror-model'

import { isListNode } from './is-list-node'

/**
 * Modify the copied slice for improved list paste behavior.
 *
 * @internal
 */
export function transformCopiedList(slice: Slice): Slice {
  // Reduce the open depth of a slice if it only contains a single list node.
  // When copying some text from a deep nested list node, we don't want to paste
  // the entire list structure into the document later.
  while (
    slice.openStart >= 2 &&
    slice.openEnd >= 2 &&
    slice.content.childCount === 1 &&
    isListNode(slice.content.child(0))
  ) {
    slice = new Slice(
      slice.content.child(0).content,
      slice.openStart - 1,
      slice.openEnd - 1,
    )
  }

  // If the slice contains multiple nodes, and the first child is a list node,
  // ensure that its attributes are preserved.
  if (
    slice.openStart >= 2 &&
    slice.content.childCount >= 2 &&
    isListNode(slice.content.child(0))
  ) {
    slice = new Slice(slice.content, 0, slice.openEnd)
  }

  return slice
}
