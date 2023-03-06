import { ParseRule } from 'prosemirror-model'
import { ListAttributes, ListKind } from '../types'
import { parseInteger } from '../utils/parse-integer'

/**
 * Returns a set of rules for parsing HTML into ProseMirror list nodes.
 *
 * @public @group Schema 
 */
export function createParseDomRules(): readonly ParseRule[] {
  return [
    {
      tag: 'div[data-list]',
      getAttrs: (element): ListAttributes => {
        if (typeof element === 'string') {
          return {}
        }

        return {
          kind: (element.getAttribute('data-list-kind') ||
            'bullet') as ListKind,
          order: parseInteger(element.getAttribute('data-list-order')),
          checked: element.hasAttribute('data-list-checked'),
          collapsed: element.hasAttribute('data-list-collapsed'),
        }
      },
    },
    {
      tag: 'ul > li',
      getAttrs: (element): ListAttributes => {
        if (typeof element !== 'string') {
          const checkbox = element.firstChild as HTMLElement | null

          if (
            checkbox &&
            checkbox.nodeName === 'INPUT' &&
            checkbox.getAttribute('type') === 'checkbox'
          ) {
            return {
              kind: 'task',
              checked: checkbox.hasAttribute('checked'),
            }
          }

          if (
            element.hasAttribute('data-task-list-item') ||
            element.getAttribute('data-list-kind') === 'task'
          ) {
            return {
              kind: 'task',
              checked: element.hasAttribute('data-checked'),
            }
          }

          if (
            element.hasAttribute('data-toggle-list-item') ||
            element.getAttribute('data-list-kind') === 'toggle'
          ) {
            return {
              kind: 'toggle',
              collapsed: element.hasAttribute('data-list-collapsed'),
            }
          }
        }

        return {
          kind: 'bullet',
        }
      },
    },
    {
      tag: 'ol > li',
      getAttrs: (element): ListAttributes => {
        if (typeof element === 'string') {
          return {
            kind: 'ordered',
          }
        }

        return {
          kind: 'ordered',
          order: parseInteger(element.getAttribute('data-list-order')),
        }
      },
    },
  ]
}
