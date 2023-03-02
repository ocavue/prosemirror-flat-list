import { Plugin } from 'prosemirror-state'
import { createListNodeView } from '../node-view'

/**
 * Handle the list node rendering.
 *
 * @public
 */
export function createListRenderingPlugin(): Plugin {
  return new Plugin({
    props: {
      nodeViews: {
        list: createListNodeView,
      },
    },
  })
}
