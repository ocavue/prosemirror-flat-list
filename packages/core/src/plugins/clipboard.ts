import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { ListDOMSerializer } from '../utils/list-serializer'

/**
 * Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
 * clipboard. See {@link ListDOMSerializer}.
 *
 * @public
 */
export function createListClipboardPlugin(schema: Schema): Plugin {
  return new Plugin({
    props: {
      clipboardSerializer: ListDOMSerializer.fromSchema(schema),
    },
  })
}
