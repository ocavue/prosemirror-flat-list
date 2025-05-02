import {
  convertCommand,
  ExtensionTag,
  type InputRule,
  type KeyBindings,
  NodeExtension,
  type NodeExtensionSpec,
  type ProsemirrorPlugin,
} from '@remirror/core'
import type { NodeRange } from '@remirror/pm/model'
import {
  createDedentListCommand,
  createIndentListCommand,
  createListPlugins,
  createListSpec,
  createMoveListCommand,
  createSplitListCommand,
  createToggleCollapsedCommand,
  createToggleListCommand,
  createUnwrapListCommand,
  createWrapInListCommand,
  type DedentListOptions,
  type IndentListOptions,
  type ListAttributes,
  listInputRules,
  listKeymap,
  protectCollapsed,
  type ToggleCollapsedOptions,
  type UnwrapListOptions,
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
    return createListPlugins({ schema: this.store.schema })
  }

  createInputRules(): InputRule[] {
    return listInputRules
  }

  createCommands() {
    return {
      indentList: (props?: IndentListOptions) => {
        return convertCommand(createIndentListCommand(props))
      },
      dedentList: (props?: DedentListOptions) => {
        return convertCommand(createDedentListCommand(props))
      },

      unwrapList: (options?: UnwrapListOptions) => {
        return convertCommand(createUnwrapListCommand(options))
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

      toggleList: (attrs: ListAttributes) => {
        return convertCommand(createToggleListCommand(attrs))
      },
    } as const
  }
}

/**
 * Wrap the giving command function so that it always returns `true`. This is
 * useful when we want pressing `Tab` and `Shift-Tab` won't blur the editor even
 * if the keybinding command returns `false`
 *
 * @public
 */
export function alwaysTrue<T extends unknown[]>(
  func: (...args: T) => boolean,
): (...args: T) => boolean {
  return (...args) => {
    func(...args)
    return true
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Remirror {
    interface AllExtensions {
      list: ListExtension
    }
  }
}
