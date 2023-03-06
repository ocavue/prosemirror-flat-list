import { InputRule } from 'prosemirror-inputrules'
import { Attrs } from 'prosemirror-model'
import { Transaction } from 'prosemirror-state'
import { findWrapping } from 'prosemirror-transform'

import { ListAttributes } from './types'
import { getListType } from './utils/get-list-type'
import { isListNode } from './utils/is-list-node'
import { parseInteger } from './utils/parse-integer'

/**
 * Build an input rule for automatically wrapping a textblock into a list node
 * when a given string is typed.
 *
 * @public @group Input Rules
 */
export function wrappingListInputRule<
  T extends ListAttributes = ListAttributes,
>(regexp: RegExp, getAttrs: T | ((matches: RegExpMatchArray) => T)): InputRule {
  return new InputRule(
    regexp,
    (state, match, start, end): Transaction | null => {
      const tr = state.tr
      tr.deleteRange(start, end)

      const attrs = typeof getAttrs === 'function' ? getAttrs(match) : getAttrs

      const $pos = tr.selection.$from
      const listNode = $pos.index(-1) === 0 && $pos.node(-1)
      if (listNode && isListNode(listNode)) {
        const oldAttrs: Attrs = listNode.attrs as ListAttributes
        const newAttrs: Attrs = { ...oldAttrs, ...attrs }
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
    },
  )
}

/**
 * All input rules for lists.
 *
 * @public @group Input Rules
 */
export const listInputRules: InputRule[] = [
  wrappingListInputRule<ListAttributes>(/^\s?([*-])\s$/, {
    kind: 'bullet',
    collapsed: false,
  }),
  wrappingListInputRule<ListAttributes>(/^\s?(\d+)\.\s$/, (match) => {
    const order = parseInteger(match[1])
    return {
      kind: 'ordered',
      collapsed: false,
      order: order != null && order >= 2 ? order : null,
    }
  }),
  wrappingListInputRule<ListAttributes>(/^\s?\[([\sXx]?)]\s$/, (match) => {
    return {
      kind: 'task',
      checked: ['x', 'X'].includes(match[1]),
      collapsed: false,
    }
  }),
  wrappingListInputRule<ListAttributes>(/^\s?>>\s$/, {
    kind: 'toggle',
  }),
]
