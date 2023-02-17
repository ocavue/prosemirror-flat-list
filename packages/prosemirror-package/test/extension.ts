import {
  convertCommand,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  NodeViewMethod,
  ProsemirrorPlugin,
} from '@remirror/core'
import { NodeRange } from 'prosemirror-model'

import {
  createDedentListCommand,
  createIndentListCommand,
  createListInputRules,
  createListNodeView,
  createListPlugin,
  createListSpec,
  createMoveListCommand,
  createSplitListCommand,
  createWrapInListCommand,
  ListAttributes,
  listKeymap,
  protectCollapsed,
} from '../src/index'

export class ListExtension extends NodeExtension {
  static disableExtraAttributes = true

  get name() {
    return 'list'
  }

  createTags() {
    return [ExtensionTag.Block]
  }

  createNodeSpec(): NodeExtensionSpec {
    // @ts-expect-error: incompatible type
    return createListSpec()
  }

  createNodeViews(): NodeViewMethod {
    // @ts-expect-error: TODO: this need to be fixed on the remirror side
    return createListNodeView
  }

  createKeymap(): KeyBindings {
    const bindings: KeyBindings = {}
    for (const [key, command] of Object.entries(listKeymap)) {
      bindings[key] = convertCommand(command)
    }
    bindings['Tab'] = bindings['Mod-]']
    bindings['Shift-Tab'] = bindings['Mod-[']
    return bindings
  }

  createExternalPlugins(): ProsemirrorPlugin[] {
    return [createListPlugin(this.store.schema)]
  }

  createInputRules(): InputRule[] {
    return createListInputRules()
  }

  createCommands() {
    return {
      indentList: () => convertCommand(createIndentListCommand()),
      dedentList: () => convertCommand(createDedentListCommand()),

      wrapInList: (
        getAttrs:
          | ListAttributes
          | ((range: NodeRange) => ListAttributes | null),
      ) => {
        return convertCommand(createWrapInListCommand<ListAttributes>(getAttrs))
      },

      moveList: (direction: 'up' | 'down') => {
        return convertCommand(createMoveListCommand(direction))
      },

      splitList: () => convertCommand(createSplitListCommand()),

      protectCollapsed: () => convertCommand(protectCollapsed),
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
