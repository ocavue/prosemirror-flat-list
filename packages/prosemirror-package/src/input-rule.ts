import { InputRule } from '@remirror/pm/inputrules'
import { Attrs } from '@remirror/pm/model'
import { Transaction } from '@remirror/pm/state'
import { findWrapping } from '@remirror/pm/transform'

import { ListAttributes } from './types'
import { getListType } from './utils/get-list-type'
import { isListNode } from './utils/is-list-node'

export function wrappingListInputRule<T extends Attrs = ListAttributes>(
  re: RegExp,
  getAttrs: T | ((matches: RegExpMatchArray) => T),
): InputRule {
  return new InputRule(re, (state, match, start, end): Transaction | null => {
    const tr = state.tr
    tr.deleteRange(start, end)

    const attrs = typeof getAttrs === 'function' ? getAttrs(match) : getAttrs

    const $pos = tr.selection.$from
    const listNode = $pos.index(-1) === 0 && $pos.node(-1)
    if (listNode && isListNode(listNode)) {
      const oldAttrs: T = listNode.attrs as T
      const newAttrs: T = { ...oldAttrs, ...attrs }
      const needUpdate = Object.keys(newAttrs).some(
        (key) => newAttrs[key] !== oldAttrs[key],
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

    const wrapping = findWrapping(range, getListType(state.schema), attrs)
    if (!wrapping) {
      return null
    }

    return tr.wrap(range, wrapping)
  })
}

export function createListInputRules(): InputRule[] {
  const bulletRegexp = /^\s?([*-])\s$/
  const orderedRegexp = /^\s?(\d+)\.\s$/
  const taskRegexp = /^\s?\[([\sXx]?)]\s$/
  const toggleRegexp = /^\s?>>\s$/

  return [
    wrappingListInputRule(bulletRegexp, { type: 'bullet' }),
    wrappingListInputRule(orderedRegexp, { type: 'ordered' }),
    wrappingListInputRule(taskRegexp, (match) => ({
      type: 'task',
      checked: ['x', 'X'].includes(match[1]),
    })),
    wrappingListInputRule(toggleRegexp, { type: 'toggle' }),
  ]
}
