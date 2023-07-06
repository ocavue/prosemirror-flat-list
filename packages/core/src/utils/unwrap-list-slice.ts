import { Slice } from 'prosemirror-model'

import { isListNode } from './is-list-node'

/**
 * Reduce the open depth of a slice if it only contains a single list node. This
 * will improve the copy/paste experience.
 *
 * @internal
 */
export function unwrapListSlice(slice: Slice): Slice {
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
  return slice
}
