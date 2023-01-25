import { NodeRange, NodeType } from '@remirror/pm/model'

/**
 * Check if the node range only contains list nodes
 */
export function isItemRange(range: NodeRange, listType: NodeType): boolean {
  const { startIndex, endIndex, parent } = range

  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).type !== listType) {
      return false
    }
  }

  return true
}
