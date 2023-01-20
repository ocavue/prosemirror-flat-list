import { NodeRange, NodeType } from '@remirror/pm/model';


export function isItemRange(range: NodeRange, itemType: NodeType): boolean {
  const { startIndex, endIndex, parent } = range;
  let childrenAreItems = true;

  for (let i = startIndex; i < endIndex; i++) {
    if (parent.child(i).type !== itemType) {
      childrenAreItems = false;
      break;
    }
  }

  return childrenAreItems;
}
