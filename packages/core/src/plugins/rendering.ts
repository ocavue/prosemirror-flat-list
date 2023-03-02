import { Plugin } from 'prosemirror-state'
import { handleListMarkerMouseDown } from '../dom-events'
import { createListNodeView } from '../node-view'

/**
 * Handle the list node rendering.
 *
 * @public
 */
export function createListRenderingPlugin(): Plugin {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event) => handleListMarkerMouseDown({ view, event }),
      },

      nodeViews: {
        list: createListNodeView,
      },
    },
  })
}
