import { findWrapping } from 'prosemirror-transform'
import { Attrs, NodeRange } from 'prosemirror-model'
import { Command } from 'prosemirror-state'
import { ListAttributes } from '../types'
import { isListNode } from '../utils/is-list-node'
import { getListType } from '../utils/get-list-type'
import { setNodeAttributes } from '../utils/setNodeAttributes'

export function createWrapInListCommand<T extends Attrs = ListAttributes>(
  getAttrs: T | ((range: NodeRange) => T | null),
): Command {
  const wrapInList: Command = (state, dispatch): boolean => {
    const { $from, $to } = state.selection

    let range = $from.blockRange($to)
    if (!range) {
      return false
    }

    if (
      rangeAllowInlineContent(range) &&
      isListNode(range.parent) &&
      range.depth > 0
    ) {
      range = new NodeRange($from, $to, range.depth - 1)
    }

    const attrs: T | null =
      typeof getAttrs === 'function' ? getAttrs(range) : getAttrs
    if (!attrs) {
      return false
    }

    const { parent, startIndex, endIndex, depth } = range
    const tr = state.tr
    const listType = getListType(state.schema)

    for (let i = endIndex - 1; i >= startIndex; i--) {
      const node = parent.child(i)
      if (isListNode(node)) {
        const oldAttrs: T = node.attrs as T
        const newAttrs: T = { ...oldAttrs, ...attrs }
        setNodeAttributes(tr, $from.posAtIndex(i, depth), oldAttrs, newAttrs)
      } else {
        const range = new NodeRange(
          tr.doc.resolve($from.posAtIndex(i, depth) + 1),
          tr.doc.resolve($from.posAtIndex(i + 1, depth) - 1),
          depth,
        )
        const wrapping = findWrapping(range, listType, attrs)
        if (wrapping) {
          tr.wrap(range, wrapping)
        }
      }
    }

    dispatch?.(tr)
    return true
  }

  return wrapInList
}

function rangeAllowInlineContent(range: NodeRange): boolean {
  const { parent, startIndex, endIndex } = range
  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).inlineContent) {
      return true
    }
  }
  return false
}
