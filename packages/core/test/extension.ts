import {
  convertCommand,
  ExtensionTag,
  InputRule,
  KeyBindings,
  NodeExtension,
  NodeExtensionSpec,
  ProsemirrorPlugin,
} from '@remirror/core'
import {
  alwaysTrue,
  createListInputRules,
  createListPlugins,
  createListSpec,
  listKeymap,
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
    return createListPlugins({ schema: this.store.schema })
  }

  createInputRules(): InputRule[] {
    return createListInputRules()
  }

  createCommands() {
    return {} as const
  }
}

declare global {
  namespace Remirror {
    interface AllExtensions {
      list: ListExtension
    }
  }
}
