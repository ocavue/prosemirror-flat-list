import {
  convertCommand,
  ExtensionTag,
  type InputRule,
  type KeyBindings,
  NodeExtension,
  type NodeExtensionSpec,
  type ProsemirrorPlugin,
} from '@remirror/core'

import {
  listInputRules,
  createListPlugins,
  createListSpec,
  listKeymap,
} from '../src/index'

export class ListExtension extends NodeExtension {
  static override disableExtraAttributes = true

  get name() {
    return 'list' as const
  }

  override createTags() {
    return [ExtensionTag.Block]
  }

  override createNodeSpec(): NodeExtensionSpec {
    // @ts-expect-error: incompatible type
    return createListSpec()
  }

  override createKeymap(): KeyBindings {
    const bindings: KeyBindings = {}
    for (const [key, command] of Object.entries(listKeymap)) {
      bindings[key] = convertCommand(command)
    }
    return bindings
  }

  override createExternalPlugins(): ProsemirrorPlugin[] {
    return createListPlugins({ schema: this.store.schema })
  }

  override createInputRules(): InputRule[] {
    return listInputRules
  }
}
