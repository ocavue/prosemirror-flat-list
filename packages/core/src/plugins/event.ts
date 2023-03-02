import { Plugin } from 'prosemirror-state'
import { handleListMarkerMouseDown } from '../dom-events'

/**
 * Handle the DOM events for list
 *
 * @public
 */
export function createListEventPlugin(): Plugin {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event) => handleListMarkerMouseDown({ view, event }),
      },
    },
  })
}
