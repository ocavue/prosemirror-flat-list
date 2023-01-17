import {
  ApplySchemaAttributes,
  CreateExtensionPlugin,
  DOMOutputSpec,
  EditorView,
  ExtensionTag,
  findParentNodeOfType,
  invariant,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeType,
  NodeView,
  NodeViewMethod,
  ProsemirrorNode,
} from '@remirror/core'
import { InputRule } from '@remirror/pm/inputrules'
import { DOMSerializer } from '@remirror/pm/model'
import { Plugin } from '@remirror/pm/state'

import { createAutoJoinItemPlugin } from './auto-join-item-plugin'
import { patchRender } from './dom-utils'
import { wrappingItemInputRule } from './item-input-rule'
import { createListItemKeymap } from './item-keymap'
import { ListAttributes, ListType } from './item-types'
import { parseIntAttribute } from './utils/parse-int-attribute'

export class ExperimentalItemExtension extends NodeExtension {
  static disableExtraAttributes = true

  get name() {
    return 'list'
  }

  createTags() {
    return [ExtensionTag.Block]
  }

  createNodeSpec(
    extra: ApplySchemaAttributes,
    override: NodeSpecOverride
  ): NodeExtensionSpec {
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
        const isNested = node.content.firstChild?.type === this.type

        const attrs = node.attrs as ListAttributes

        // TODO: rename
        const itemClassNames: string[] = ['remirror-flat-list']

        if (!isNested && node.childCount >= 2 && attrs.type === 'bullet') {
          itemClassNames.push('collapsable')

          if (node.attrs.collapsed) {
            itemClassNames.push('collapsed')
          }
        }

        let mark: DOMOutputSpec | null = null

        if (!isNested) {
          switch (attrs.type) {
            case 'ordered':
              mark = ['span', { class: `item-mark item-mark-ordered` }]
              break
            case 'bullet':
              mark = ['span', { class: `item-mark item-mark-bullet` }]
              break
            case 'task':
              // Use a `label` element here so that the area around the checkbox is also checkable.
              mark = [
                'label',
                { class: `item-mark item-mark-task` },
                [
                  'input',
                  {
                    type: 'checkbox',
                    checked: attrs.checked ? '' : undefined,
                  },
                ],
              ]
          }
        }

        return [
          'div',
          {
            class: itemClassNames.join(' '),
            'data-list': '',
            'data-list-type': attrs.type == null ? attrs.type : undefined,
            'data-list-order':
              attrs.order != null ? String(attrs.order) : undefined,
            'data-list-checked': attrs.checked ? '' : undefined,
            'data-list-collapsed': attrs.collapsed ? '' : undefined,
            ...extra.dom(node),
          },

          // the container for the list item markers
          [
            'div',
            {
              class: `item-mark-container`,
              // Set `contenteditable` to `false` so that the cursor won't be
              // moved into the mark container when clicking on it.
              contenteditable: 'false',
            },
            ...(mark ? [mark] : []),
          ],

          // the container for the list item content
          ['div', { class: `item-content-container` }, 0],
        ]
      },

      parseDOM: [
        {
          tag: 'div[data-list]',
          getAttrs: (element): ListAttributes => {
            if (typeof element === 'string') {
              return {}
            }

            return {
              type: (element.getAttribute('data-list-type') ||
                'bullet') as ListType,
              order: parseIntAttribute(element.getAttribute('data-list-order')),
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
                  ...extra.parse(element),
                }
              }

              if (element.hasAttribute('data-task-list-item')) {
                return {
                  type: 'task',
                  checked: element.hasAttribute('data-checked'),
                  ...extra.parse(element),
                }
              }
            }

            return {
              type: 'bullet',
              ...extra.parse(element),
            }
          },
        },
        {
          tag: 'ol > li',
          getAttrs: (element) => {
            return {
              type: 'ordered',
              ...extra.parse(element),
            }
          },
        },
        ...(override.parseDOM ?? []),
      ],
    }
  }

  createNodeViews(): NodeViewMethod {
    return (
      node: ProsemirrorNode,
      _view: EditorView,
      _getPos: (() => number) | boolean
    ): NodeView => {
      const spec = this.type.spec.toDOM?.(node) as DOMOutputSpec
      invariant(spec, { message: "Couldn't find a spec for the node" })
      let { dom, contentDOM } = DOMSerializer.renderSpec(document, spec)

      let prevSpec = spec

      const update = (node: ProsemirrorNode) => {
        if (node.type !== this.type) {
          return false
        }

        const nextSpec = this.type.spec.toDOM?.(node) as DOMOutputSpec
        invariant(nextSpec, { message: "Couldn't find a spec for the node" })
        const rendered = patchRender(prevSpec, nextSpec, dom as Element)

        if (rendered) {
          dom = rendered.dom
          contentDOM = rendered.contentDOM
        }

        prevSpec = nextSpec
        return true
      }

      return {
        dom,
        contentDOM,
        update,
      }
    }
  }

  createKeymap(): KeyBindings {
    return createListItemKeymap(this.type)
  }

  createPlugin(): CreateExtensionPlugin {
    return {
      props: {
        handleDOMEvents: {
          mousedown: (_view, event): boolean => {
            const target = event.target as HTMLElement

            if (
              target.classList.contains('item-mark') ||
              target.classList.contains('item-mark-container')
            ) {
              event.preventDefault()
              return true
            }

            return false
          },
          mouseup: (_view, event): boolean => {
            const target = event.target as HTMLElement

            if (
              target.classList.contains('item-mark') ||
              target.classList.contains('item-mark-container')
            ) {
              event.preventDefault()
              return true
            }

            return false
          },
          click: (view, event): boolean => {
            const target = event.target as HTMLElement

            if (
              target.classList.contains('item-mark') ||
              target.classList.contains('item-mark-container')
            ) {
              event.preventDefault()
              const pos = view.posAtCoords(eventCoords(event))

              if (pos && pos.pos > 0) {
                return handleClick(view, event, pos.pos, this.type)
              }
            }

            return false
          },
        },
      },
    }
  }

  createExternalPlugins(): Plugin[] {
    return [createAutoJoinItemPlugin(this.type)]
  }

  createInputRules(): InputRule[] {
    const bulletRegexp = /^\s?([*+-])\s$/
    const orderedRegexp = /^\s?(\d+)\.\s$/
    const taskRegexp = /^\s?\[([\sXx]?)]\s$/

    return [
      wrappingItemInputRule(bulletRegexp, this.type, { type: 'bullet' }),
      wrappingItemInputRule(orderedRegexp, this.type, { type: 'ordered' }),
      wrappingItemInputRule(taskRegexp, this.type, (match) => ({
        type: 'task',
        checked: ['x', 'X'].includes(match[1]),
      })),
    ]
  }
}

function handleClick(
  view: EditorView,
  event: MouseEvent,
  pos: number,
  itemType: NodeType
): boolean {
  const target = event.target as HTMLElement

  const found = findParentNodeOfType({
    selection: view.state.doc.resolve(pos),
    types: itemType,
  })

  if (!found) {
    return false
  }

  const attrs = found.node.attrs as ListAttributes

  if (found.node.childCount >= 2 && attrs.type === 'bullet') {
    event.preventDefault()
    view.dispatch(
      view.state.tr.setNodeMarkup(found.pos, null, {
        ...attrs,
        collapsed: !attrs.collapsed,
      })
    )

    return true
  } else if (attrs.type === 'task' && target.classList.contains('item-mark')) {
    view.dispatch(
      view.state.tr.setNodeMarkup(found.pos, null, {
        ...attrs,
        checked: !attrs.checked,
      })
    )
  }

  return false
}

function eventCoords(event: MouseEvent) {
  return { left: event.clientX, top: event.clientY }
}
