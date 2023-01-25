import { KeyBindings, NodeType } from '@remirror/core'

import { createDedentListCommand } from './commands/dedent-list'
import { createSplitListCommand } from './commands/split-list'
import { createIndentListCommand } from './commands/indent-list'

export function createListKeymap(listType: NodeType): KeyBindings {
  return {
    Enter: createSplitListCommand(listType),

    'Shift-Tab': createDedentListCommand(listType),

    Tab: createIndentListCommand(listType),

    // TODO: remove this
    'Mod-Shift-l': ({ tr, dispatch }): boolean => {
      let range: number[] | null = null

      tr.doc.descendants((node, pos) => {
        if (node.type.name === 'blockquote') {
          range = [pos, pos + node.nodeSize]
        }
      })

      if (range) {
        dispatch?.(tr.deleteRange(range[0], range[1]))
        return true
      }

      return false
    },
  }
}
