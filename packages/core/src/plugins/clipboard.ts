import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

import { ListDOMSerializer } from '../utils/list-serializer'
import { transformCopiedList } from '../utils/transform-copied-list'

/**
 * Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
 * clipboard. See {@link ListDOMSerializer}.
 *
 * @public @group Plugins
 */
export function createListClipboardPlugin(schema: Schema): Plugin {
  return new Plugin({
    props: {
      clipboardSerializer: ListDOMSerializer.fromSchema(schema),

      transformCopied: transformCopiedList,
    },
  })
}
