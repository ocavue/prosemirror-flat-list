import { NodeSelection, Selection } from '@remirror/pm/state';


export function isBlockNodeSelection(selection: Selection): boolean {
  return (
    (selection as NodeSelection).node &&
    (selection as NodeSelection).node.type.isBlock
  );
}
