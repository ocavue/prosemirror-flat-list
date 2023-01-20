import {
  ApplySchemaAttributes,
  CreateExtensionPlugin,
  DOMOutputSpec,
  ExtensionTag,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeViewMethod,
} from '@remirror/core'
import { InputRule } from '@remirror/pm/inputrules'
import { Plugin } from '@remirror/pm/state'

import { handleListMarkerMouseDown } from './dom-events'
import { createListInputRules } from './input-rule'
import { createListKeymap } from './keymap'
import { createListNodeView } from './node-view'
import { createAutoJoinItemPlugin } from './plugins/auto-join-item-plugin'
import { createParseDomRules } from './schema/parse-dom'
import { listToDOM } from './schema/to-dom'
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

  createNodeViews(): NodeViewMethod {
    // @ts-expect-error: TODO: this need to be fixed on the remirror side
    return createListNodeView
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
