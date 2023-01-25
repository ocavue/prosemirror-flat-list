import { NodeRange, NodeType } from '@remirror/pm/model'

export function isItemRange(range: NodeRange, listType: NodeType): boolean {
  const { startIndex, endIndex, parent } = range
  let childrenAreItems = true

  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).type !== listType) {
      childrenAreItems = false
      break
    }
  }

  return childrenAreItems
}
