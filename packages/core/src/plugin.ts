import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { handleListMarkerMouseDown } from './dom-events'
import { ListDOMSerializer } from './utils/list-serializer'

/** @public */
export function createListPlugin(schema: Schema): Plugin {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event): boolean => {
          return handleListMarkerMouseDown(view, event)
        },
      },

      clipboardSerializer: ListDOMSerializer.fromSchema(schema),
    },
  })
}
