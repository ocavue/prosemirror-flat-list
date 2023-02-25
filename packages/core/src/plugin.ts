import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { handleListMarkerMouseDown } from './dom-events'
import { createListNodeView } from './node-view'
import { ListDOMSerializer } from './utils/list-serializer'

/**
 * Return a ProseMirror plugin for list.
 *
 * @remarks
 *
 * This plugin is responsible for the following:
 *
 * 1. Handling DOM events for clicking on list markers.
 * 2. Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`)
 *    to clipboard. See {@link ListDOMSerializer}.
 * 3. Create a custom node view for list nodes. See {@link createListNodeView}.
 *
 *
 * @public
 */
export function createListPlugin(schema: Schema): Plugin {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event) => handleListMarkerMouseDown({ view, event }),
      },

      clipboardSerializer: ListDOMSerializer.fromSchema(schema),

      nodeViews: {
        list: createListNodeView,
      },
    },
  })
}
