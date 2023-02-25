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
import { NodeRange } from '@remirror/pm/model'

import {
  alwaysTrue,
  createDedentListCommand,
  createIndentListCommand,
  createListInputRules,
  createListNodeView,
  createListPlugin,
  createListSpec,
  createMoveListCommand,
  createSplitListCommand,
  createToggleCollapsedCommand,
  createWrapInListCommand,
  DedentListProps,
  IndentListProps,
  ListAttributes,
  listKeymap,
  protectCollapsed,
  ToggleCollapsedProps,
} from 'prosemirror-flat-list'

/**
 * A Remirror extension for creating lists. It's a simple wrapper around the API from `prosemirror-flat-list`.
 *
 * @public
 */
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

  createNodeViews(): NodeViewMethod {
    // @ts-expect-error: TODO: this need to be fixed on the remirror side
    return createListNodeView
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
    return [createListPlugin(this.store.schema)]
  }

  createInputRules(): InputRule[] {
    return createListInputRules()
  }

  createCommands() {
    return {
      indentList: (props?: IndentListProps) => {
        return convertCommand(createIndentListCommand(props))
      },
      dedentList: (props?: DedentListProps) => {
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

      toggleCollapsed: (props?: ToggleCollapsedProps) => {
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
