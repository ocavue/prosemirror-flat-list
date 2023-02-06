import { DOMOutputSpec, NodeSpec } from '@remirror/pm/model'
import { createParseDomRules } from './parse-dom'
import { listToDOM } from './to-dom'

export function createListSpec(): NodeSpec {
  return {
    content: 'block+',
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
