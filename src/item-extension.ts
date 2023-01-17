import {
  ApplySchemaAttributes,
  CreateExtensionPlugin,
  DOMOutputSpec,
  EditorView,
  ExtensionTag,
  invariant,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
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
        const attrs = node.attrs as ListAttributes

        let marker: DOMOutputSpec | null = null

        switch (attrs.type) {
          case 'task':
            // Use a `label` element here so that the area around the checkbox is also checkable.
            marker = [
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
            break
          case 'toggle':
            marker = ['span']
            break
        }

        const domAttrs = {
          class: 'flat-list',
          'data-list': '',
          'data-list-type': attrs.type || 'bullet',
          'data-list-order':
            attrs.type === 'ordered' && attrs.order != null
              ? String(attrs.order)
              : undefined,
          'data-list-checked':
            attrs.type === 'task' && attrs.checked ? '' : undefined,
          'data-list-collapsed':
            attrs.type === 'toggle' && attrs.collapsed ? '' : undefined,
          ...extra.dom(node),
        }

        const contentContainer: DOMOutputSpec = [
          'div',
          { class: 'item-content-container' },
          0,
        ]
        if (marker) {
          const markerContainer: DOMOutputSpec = [
            'div',
            {
              class: 'item-mark-container',
              // Set `contenteditable` to `false` so that the cursor won't be
              // moved into the mark container when clicking on it.
              contenteditable: 'false',
            },
            marker,
          ]

          return ['div', domAttrs, markerContainer, contentContainer]
        } else {
          return ['div', domAttrs, contentContainer]
        }
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

              if (element.hasAttribute('data-toggle-list-item')) {
                return {
                  type: 'toggle',
                  collapsed: element.hasAttribute('data-list-collapsed'),
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
          mousedown: (view, event): boolean => {
            const target = event.target as HTMLElement | null

            if (
              target?.classList.contains('item-mark') ||
              target?.classList.contains('item-mark-container')
            ) {
              event.preventDefault()

              const pos = view.posAtDOM(target, -10, -10)
              const tr = view.state.tr
              const $pos = tr.doc.resolve(pos)
              const list = $pos.parent
              if (list.type !== this.type) {
                return false
              }

              const attrs = list.attrs as ListAttributes
              const listPos = $pos.before($pos.depth)
              if (attrs.type === 'task') {
                tr.setNodeAttribute(listPos, 'checked', !attrs.checked)
              } else if (attrs.type === 'toggle') {
                tr.setNodeAttribute(listPos, 'collapsed', !attrs.collapsed)
              }
              view.dispatch(tr)
              return true
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
