import { Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { createListClipboardPlugin } from './clipboard'
import { createListRenderingPlugin } from './rendering'
import { createSafariInputMethodWorkaroundPlugin } from './safari-workaround'

/**
 * This function returns an array of plugins that are required for list to work.
 *
 * @remark
 *
 * The plugins are shown below. You can pick and choose which plugins you want
 * to use if you want to customize some behavior.
 *
 * - {@link createListRenderingPlugin}
 * - {@link createListClipboardPlugin}
 * - {@link createSafariInputMethodWorkaroundPlugin}
 *
 * @public
 */
export function createListPlugins({ schema }: { schema: Schema }): Plugin[] {
  return [
    createListRenderingPlugin(),
    createListClipboardPlugin(schema),
    createSafariInputMethodWorkaroundPlugin(),
  ]
}

export {
  createListClipboardPlugin,
  createListRenderingPlugin,
  createSafariInputMethodWorkaroundPlugin,
}
