import { NodeSelection, Selection } from 'prosemirror-state'

export function isBlockNodeSelection(selection: Selection): boolean {
  return Boolean((selection as NodeSelection).node?.type?.isBlock)
}
