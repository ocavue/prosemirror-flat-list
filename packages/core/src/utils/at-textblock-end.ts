import type { ResolvedPos } from 'prosemirror-model'
import type { EditorState, TextSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

// Copied from https://github.com/prosemirror/prosemirror-commands/blob/1.5.0/src/commands.ts#L157
export function atTextblockEnd(
  state: EditorState,
  view?: EditorView,
): ResolvedPos | null {
  const { $cursor } = state.selection as TextSelection
  if (
    !$cursor ||
    (view
      ? !view.endOfTextblock('forward', state)
      : $cursor.parentOffset < $cursor.parent.content.size)
  )
    return null
  return $cursor
}
