import { Transaction } from '@remirror/core'
import { Attrs, NodeType } from '@remirror/pm/dist-types/model'
import { InputRule } from '@remirror/pm/inputrules'
import { findWrapping } from '@remirror/pm/transform'

import { ListAttributes } from './types'

export function wrappingListInputRule<T extends Attrs = ListAttributes>(
  re: RegExp,
  listType: NodeType,
  getAttrs: T | ((matches: RegExpMatchArray) => T)
): InputRule {
  return new InputRule(re, (state, match, start, end): Transaction | null => {
    const tr = state.tr
    tr.deleteRange(start, end)

    const attrs = typeof getAttrs === 'function' ? getAttrs(match) : getAttrs

    const $pos = tr.selection.$from
    const listNode = $pos.node(-1)
    if (listNode && listNode.type === listType) {
      const oldAttrs: T = listNode.attrs as T
      const newAttrs: T = { ...oldAttrs, ...attrs }
      const needUpdate = Object.keys(newAttrs).some(
        (key) => newAttrs[key] != oldAttrs[key]
      )

      if (needUpdate) {
        return tr.setNodeMarkup($pos.before(-1), undefined, newAttrs)
      } else {
        return null
      }
    }

    const $start = tr.doc.resolve(start)
    const range = $start.blockRange()
    if (!range) {
      return null
    }

    const wrapping = findWrapping(range, listType, attrs)
    if (!wrapping) {
      return null
    }

    return tr.wrap(range, wrapping)
  })
}

export function createListInputRules(listType: NodeType): InputRule[] {
  const bulletRegexp = /^\s?([*+-])\s$/
  const orderedRegexp = /^\s?(\d+)\.\s$/
  const taskRegexp = /^\s?\[([\sXx]?)]\s$/

  return [
    wrappingListInputRule(bulletRegexp, listType, { type: 'bullet' }),
    wrappingListInputRule(orderedRegexp, listType, { type: 'ordered' }),
    wrappingListInputRule(taskRegexp, listType, (match) => ({
      type: 'task',
      checked: ['x', 'X'].includes(match[1]),
    })),
  ]
}
