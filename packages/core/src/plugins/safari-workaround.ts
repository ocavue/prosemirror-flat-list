import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import * as browser from '../utils/browser'

/**
 * Return a plugin as a workaround for a bug in Safari that causes the composition
 * based IME to remove the empty HTML element with CSS `position: relative`.
 *
 * See also https://github.com/ProseMirror/prosemirror/issues/934
 *
 * @public
 */
export function createSafariInputMethodWorkaroundPlugin(): Plugin {
  let view: EditorView | null = null
  let span: HTMLSpanElement | null = null

  const getSpan = (): HTMLSpanElement => {
    if (!span) {
      span = document.createElement('span')
      span.className = 'prosemirror-flat-list-safari-workaround'
    }
    return span
  }

  const createDecorations = (): DecorationSet | null => {
    if (view?.composing) {
      const state = view.state
      const selection = state.selection
      const { $from, $to, to } = selection
      if ($from.sameParent($to)) {
        return DecorationSet.create(state.doc, [Decoration.widget(to, getSpan)])
      }
    }
    return null
  }

  return new Plugin({
    props: {
      decorations: browser.safari ? createDecorations : undefined,
    },

    view: (v) => {
      view = v
      return {}
    },
  })
}
