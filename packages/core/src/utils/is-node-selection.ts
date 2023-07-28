import { NodeSelection, Selection } from 'prosemirror-state'

export function isNodeSelection(
  selection: Selection,
): selection is NodeSelection {
  return Boolean((selection as NodeSelection).node)
}
