import { DOMOutputSpec, NodeSpec } from 'prosemirror-model'
import { createParseDomRules } from './parse-dom'
import { listToDOM } from './to-dom'

/**
 * The default group name for list nodes.
 *
 * @public
 */
export const flatListGroup = 'flatList'

/** @public */
export function createListSpec(): NodeSpec {
  return {
    content: 'block+',
    group: flatListGroup,
    defining: true,
    attrs: {
      kind: {
        default: 'bullet',
      },
      order: {
        default: null,
      },
      checked: {
        default: false,
      },
      collapsed: {
        default: false,
      },
    },
    toDOM: (node): DOMOutputSpec => {
      return listToDOM({ node })
    },

    parseDOM: createParseDomRules(),
  }
}
