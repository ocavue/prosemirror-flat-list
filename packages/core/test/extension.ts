import {
  convertCommand,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  ProsemirrorPlugin,
} from '@remirror/core'
import { NodeRange } from 'prosemirror-model'
import {
  alwaysTrue,
  createDedentListCommand,
  createIndentListCommand,
  createListInputRules,
  createListPlugin,
  createListSpec,
  createMoveListCommand,
  createSafariInputMethodWorkaroundPlugin,
  createSplitListCommand,
  createToggleCollapsedCommand,
  createWrapInListCommand,
  DedentListOptions,
  IndentListOptions,
  ListAttributes,
  listKeymap,
  protectCollapsed,
  ToggleCollapsedOptions,
} from '../src/index'

export class ListExtension extends NodeExtension {
  static disableExtraAttributes = true

  get name() {
    return 'list' as const
  }

  createTags() {
    return [ExtensionTag.Block]
  }

  createNodeSpec(): NodeExtensionSpec {
    // @ts-expect-error: incompatible type
    return createListSpec()
  }

  createKeymap(): KeyBindings {
    const bindings: KeyBindings = {}
    for (const [key, command] of Object.entries(listKeymap)) {
      bindings[key] = convertCommand(command)
    }
    bindings['Tab'] = alwaysTrue(bindings['Mod-]'])
    bindings['Shift-Tab'] = alwaysTrue(bindings['Mod-['])
    return bindings
  }

  createExternalPlugins(): ProsemirrorPlugin[] {
    return [
      createListPlugin(this.store.schema),
      createSafariInputMethodWorkaroundPlugin(),
    ]
  }

  createInputRules(): InputRule[] {
    return createListInputRules()
  }

  createCommands() {
    return {
      indentList: (props?: IndentListOptions) => {
        return convertCommand(createIndentListCommand(props))
      },
      dedentList: (props?: DedentListOptions) => {
        return convertCommand(createDedentListCommand(props))
      },

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

      toggleCollapsed: (props?: ToggleCollapsedOptions) => {
        return convertCommand(createToggleCollapsedCommand(props))
      },
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
