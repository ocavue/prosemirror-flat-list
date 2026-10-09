import { InputRule } from 'prosemirror-inputrules'
import type { Attrs } from 'prosemirror-model'
import type { EditorState, Transaction } from 'prosemirror-state'
import { findWrapping } from 'prosemirror-transform'

import type { ListAttributes } from './types'
import { getListType } from './utils/get-list-type'
import { isListNode } from './utils/is-list-node'
import { parseInteger } from './utils/parse-integer'

/**
 * A callback function to get the attributes for a list input rule.
 *
 * @public
 *
 * @group Input Rules
 */
export type ListInputRuleAttributesGetter<
  T extends ListAttributes = ListAttributes,
> = (options: {
  /**
   * The match result of the regular expression.
   */
  match: RegExpMatchArray

  /**
   * The previous attributes of the existing list node, if it exists.
   */
  attributes?: T
}) => T

/**
 * The handler of a list input rule.
 *
 * @internal
 */
export type ListInputRuleHandler = (
  state: EditorState,
  match: RegExpMatchArray,
  start: number,
  end: number,
) => Transaction | null

/**
 * Build the handler behind {@link wrappingListInputRule}: it deletes the
 * matched text, then updates the attributes of the list node the textblock
 * already starts, or wraps the textblock into a new list node.
 *
 * @internal
 */
export function createListInputRuleHandler<
  T extends ListAttributes = ListAttributes,
>(getAttrs: T | ListInputRuleAttributesGetter<T>): ListInputRuleHandler {
  return (state, match, start, end): Transaction | null => {
    const tr = state.tr
    tr.deleteRange(start, end)

    const $pos = tr.selection.$from
    const listNode = $pos.index(-1) === 0 && $pos.node(-1)
    if (listNode && isListNode(listNode)) {
      const oldAttrs: Attrs = listNode.attrs
      const newAttrs: Attrs =
        typeof getAttrs === 'function'
          ? getAttrs({ match, attributes: oldAttrs as T })
          : getAttrs

      const entries = Object.entries(newAttrs).filter(([key, value]) => {
        return oldAttrs[key] !== value
      })
      if (entries.length === 0) {
        return null
      } else {
        const pos = $pos.before(-1)
        for (const [key, value] of entries) {
          tr.setNodeAttribute(pos, key, value)
        }
        return tr
      }
    }

    const $start = tr.doc.resolve(start)
    const range = $start.blockRange()
    if (!range) {
      return null
    }

    const newAttrs: Attrs =
      typeof getAttrs === 'function' ? getAttrs({ match }) : getAttrs
    const wrapping = findWrapping(range, getListType(state.schema), newAttrs)
    if (!wrapping) {
      return null
    }

    return tr.wrap(range, wrapping)
  }
}

/**
 * Build an input rule for automatically wrapping a textblock into a list node
 * when a given string is typed.
 *
 * @public
 *
 * @group Input Rules
 */
export function wrappingListInputRule<
  T extends ListAttributes = ListAttributes,
>(regexp: RegExp, getAttrs: T | ListInputRuleAttributesGetter<T>): InputRule {
  return new InputRule(regexp, createListInputRuleHandler(getAttrs))
}

/**
 * The pattern and attributes of one built-in list input rule.
 *
 * @internal
 */
export interface ListInputRuleOptions<
  T extends ListAttributes = ListAttributes,
> {
  regexp: RegExp
  getAttrs: T | ListInputRuleAttributesGetter<T>
}

/**
 * `- ` or `* ` opens a bullet list.
 *
 * @internal
 */
export const bulletListInputRule: ListInputRuleOptions = {
  regexp: /^\s?([*-])\s$/,
  getAttrs: {
    kind: 'bullet',
    collapsed: false,
  },
}

/**
 * `1. ` opens an ordered list; a number above 1 becomes the start order.
 *
 * @internal
 */
export const orderedListInputRule: ListInputRuleOptions = {
  regexp: /^\s?(\d+)\.\s$/,
  getAttrs: ({ match }) => {
    const order = parseInteger(match[1])
    return {
      kind: 'ordered',
      collapsed: false,
      order: order != null && order >= 2 ? order : null,
    }
  },
}

/**
 * `[ ] ` or `[x] ` opens a task list.
 *
 * @internal
 */
export const taskListInputRule: ListInputRuleOptions = {
  regexp: /^\s?\[([\sX]?)\]\s$/i,
  getAttrs: ({ match }) => {
    return {
      kind: 'task',
      checked: ['x', 'X'].includes(match[1]),
      collapsed: false,
    }
  },
}

/**
 * `>> ` opens a toggle list.
 *
 * @internal
 */
export const toggleListInputRule: ListInputRuleOptions = {
  regexp: /^\s?>>\s$/,
  getAttrs: {
    kind: 'toggle',
  },
}

/**
 * All input rules for lists.
 *
 * @public
 *
 * @group Input Rules
 */
export const listInputRules: InputRule[] = /* @__PURE__ */ [
  bulletListInputRule,
  orderedListInputRule,
  taskListInputRule,
  toggleListInputRule,
].map(({ regexp, getAttrs }) => wrappingListInputRule(regexp, getAttrs))
