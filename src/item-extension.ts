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

import { handleListMarkerMouseDown } from './dom-events'
import { patchRender } from './dom-render'
import { createListInputRules } from './input-rule'
import { createListKeymap } from './keymap'
import { createAutoJoinItemPlugin } from './plugins/auto-join-item-plugin'
import { createParseDomRules, listToDOM } from './schema'
import { ListDOMSerializer } from './utils/list-serializer'

export class ListExtension extends NodeExtension {
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
        return listToDOM(node, false, extra)
      },

      parseDOM: createParseDomRules(extra, override),
    }
  }

  // TODO: this is too hacky
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
    return createListKeymap(this.type)
  }

  createPlugin(): CreateExtensionPlugin {
    const schema = this.store.schema

    return {
      props: {
        handleDOMEvents: {
          mousedown: (view, event): boolean => {
            return handleListMarkerMouseDown(view, event, this.type)
          },
        },

        clipboardSerializer: new ListDOMSerializer(
          ListDOMSerializer.nodesFromSchema(schema),
          ListDOMSerializer.marksFromSchema(schema)
        ),
      },
    }
  }

  createExternalPlugins(): Plugin[] {
    return [createAutoJoinItemPlugin(this.type)]
  }

  createInputRules(): InputRule[] {
    return createListInputRules(this.type)
  }
}
