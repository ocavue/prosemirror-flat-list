import { Schema } from '@remirror/pm/model'
import { Plugin } from '@remirror/pm/state'
import { handleListMarkerMouseDown } from './dom-events'
import { ListDOMSerializer } from './utils/list-serializer'

export function createListPlugin(schema: Schema): Plugin {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event): boolean => {
          return handleListMarkerMouseDown(view, event)
        },
      },

      clipboardSerializer: new ListDOMSerializer(
        ListDOMSerializer.nodesFromSchema(schema),
        ListDOMSerializer.marksFromSchema(schema),
      ),
    },
  })
}
