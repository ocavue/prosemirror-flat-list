import {
  ApplySchemaAttributes,
  convertCommand,
  CreateExtensionPlugin,
  DOMOutputSpec,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeSpecOverride,
  NodeViewMethod,
} from '@remirror/core'

import {
  createDedentListCommand,
  createIndentListCommand,
  createListInputRules,
  createListNodeView,
  createParseDomRules,
  createSplitListCommand,
  handleListMarkerMouseDown,
  ListDOMSerializer,
  listToDOM,
  alwaysTrue,
} from 'prosemirror-flat-list'

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
    override: NodeSpecOverride,
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
    return {
      Enter: convertCommand(createSplitListCommand(this.type)),

      'Shift-Tab': alwaysTrue(
        convertCommand(createDedentListCommand(this.type)),
      ),

      Tab: alwaysTrue(convertCommand(createIndentListCommand(this.type))),
    }
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
          ListDOMSerializer.marksFromSchema(schema),
        ),
      },
    }
  }

  createInputRules(): InputRule[] {
    return createListInputRules(this.type)
  }

  createCommands() {
    return {
      indentList: () => convertCommand(createIndentListCommand(this.type)),
      dedentList: () => convertCommand(createDedentListCommand(this.type)),
    } as const
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      list: ListExtension
    }
  }
}
