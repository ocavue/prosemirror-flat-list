import { ParseRule } from 'prosemirror-model'
import { ListAttributes, ListType } from '../types'
import { parseInteger } from '../utils/parse-integer'

/** @public */
export function createParseDomRules(): readonly ParseRule[] {
  return [
    {
      tag: 'div[data-list]',
      getAttrs: (element): ListAttributes => {
        if (typeof element === 'string') {
          return {}
        }

        return {
          type: (element.getAttribute('data-list-type') ||
            'bullet') as ListType,
          order: parseInteger(element.getAttribute('data-list-order')),
          checked: element.hasAttribute('data-list-checked'),
          collapsed: element.hasAttribute('data-list-collapsed'),
        }
      },
    },
    {
      tag: 'ul > li',
      getAttrs: (element) => {
        if (typeof element !== 'string') {
          const checkbox = element.firstChild as HTMLElement | null

          if (
            checkbox &&
            checkbox.nodeName === 'INPUT' &&
            checkbox.getAttribute('type') === 'checkbox'
          ) {
            return {
              type: 'task',
              checked: checkbox.hasAttribute('checked'),
              // ...extra.parse(element),
            }
          }

          if (
            element.hasAttribute('data-task-list-item') ||
            element.getAttribute('data-list-type') === 'task'
          ) {
            return {
              type: 'task',
              checked: element.hasAttribute('data-checked'),
              // ...extra.parse(element),
            }
          }

          if (
            element.hasAttribute('data-toggle-list-item') ||
            element.getAttribute('data-list-type') === 'toggle'
          ) {
            return {
              type: 'toggle',
              collapsed: element.hasAttribute('data-list-collapsed'),
              // ...extra.parse(element),
            }
          }
        }

        return {
          type: 'bullet',
          // ...extra.parse(element),
        }
      },
    },
    {
      tag: 'ol > li',
      getAttrs: (_element) => {
        return {
          type: 'ordered',
          // ...extra.parse(element),
        }
      },
    },
    // ...(override.parseDOM ?? []),
  ]
}
