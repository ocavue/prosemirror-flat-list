import { NodeSelection, Selection } from '@remirror/pm/state'

export function isBlockNodeSelection(selection: Selection): boolean {
  return Boolean((selection as NodeSelection).node?.type?.isBlock)
}
