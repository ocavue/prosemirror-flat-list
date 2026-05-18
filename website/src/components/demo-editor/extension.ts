import {
  defineCommands,
  insertNode,
  union,
  defineKeymap,
  defineNodeSpec,
  definePlugin,
  type PlainExtension,
  defineBaseCommands,
} from '@prosekit/core'
import { inputRules } from '@prosekit/pm/inputrules'
import type { Command } from '@prosekit/pm/state'
import { Plugin } from '@prosekit/pm/state'
import {
  backspaceCommand,
  createDedentListCommand,
  createIndentListCommand,
  createListEventPlugin,
  createListRenderingPlugin,
  createListSpec,
  createSafariInputMethodWorkaroundPlugin,
  createDedentListCommand as dedentList,
  deleteCommand,
  enterCommand,
  createIndentListCommand as indentList,
  listInputRules,
  createMoveListCommand as moveList,
  createSplitListCommand as splitList,
  createToggleCollapsedCommand as toggleCollapsed,
  createToggleListCommand as toggleList,
  createUnwrapListCommand as unwrapList,
  unwrapListSlice,
  createWrapInListCommand as wrapInList,
  type ListAttributes,
} from 'prosemirror-flat-list'

function defineDoc() {
  return defineNodeSpec({
    name: 'doc',
    content: 'block+',
    topNode: true,
  })
}

function defineText() {
  return defineNodeSpec({
    name: 'text',
    group: 'inline',
  })
}

function defineParagraphSpec() {
  return defineNodeSpec({
    name: 'paragraph',
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM() {
      return ['p', 0]
    },
  })
}

function insertList(attrs?: ListAttributes): Command {
  return insertNode({ type: 'list', attrs })
}

function defineListCommands() {
  return defineCommands({
    dedentList,
    indentList,
    moveList,
    splitList,
    toggleCollapsed,
    unwrapList,
    toggleList,
    wrapInList,
    insertList,
  })
}

function defineListSpec() {
  const spec = createListSpec()

  return defineNodeSpec<'list', ListAttributes>({
    ...spec,
    name: 'list',
  })
}

function createListClipboardPlugin(): Plugin {
  return new Plugin({
    props: {
      transformCopied: unwrapListSlice,
    },
  })
}

function createListPlugins(): Plugin[] {
  return [
    createListEventPlugin(),
    createListRenderingPlugin(),
    createListClipboardPlugin(),
    createSafariInputMethodWorkaroundPlugin(),
  ]
}

function defineListPlugins(): PlainExtension {
  return definePlugin(createListPlugins)
}

const dedentListCommand = createDedentListCommand()
const indentListCommand = createIndentListCommand()

const listKeymap = {
  Enter: enterCommand,
  Backspace: backspaceCommand,
  Delete: deleteCommand,
  'Mod-]': indentListCommand,
  'Mod-[': dedentListCommand,
  Tab: indentListCommand,
  'Shift-Tab': dedentListCommand,
}

function defineListKeymap(): PlainExtension {
  return defineKeymap(listKeymap)
}

function defineListInputRules() {
  const plugin = inputRules({ rules: listInputRules })
  return definePlugin(plugin)
}

export function defineExtension() {
  return union([

    defineListSpec(),
    defineListCommands(),
    defineListPlugins(),
    defineListKeymap(),
    defineListInputRules(),

    defineBaseCommands(),
    defineDoc(),
    defineText(),
    defineParagraphSpec(),

  ])
}

export type EditorExtension = ReturnType<typeof defineExtension>
