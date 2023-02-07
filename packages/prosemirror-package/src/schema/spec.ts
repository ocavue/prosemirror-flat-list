import { DOMOutputSpec, NodeSpec } from 'prosemirror-model'
import { createParseDomRules } from './parse-dom'
import { listToDOM } from './to-dom'

export const flatListGroup = 'flatList'

export function createListSpec(): NodeSpec {
  return {
    content: 'block+',
    group: flatListGroup,
    defining: true,
    attrs: {
      type: {
        default: 'bullet',
      },
      counter: {
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
      return listToDOM(node, false)
    },

    parseDOM: createParseDomRules(),
  }
}
