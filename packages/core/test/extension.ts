import '@prosekit/pm/view/style/prosemirror.css'

import {
  defineBaseCommands,
  defineBaseKeymap,
  defineKeymap,
  defineNodeAttr,
  defineNodeSpec,
  definePlugin,
  Priority,
  union,
  withPriority,
  type BaseCommandsExtension,
  type Extension,
  type Union,
} from '@prosekit/core'
import { inputRules } from '@prosekit/pm/inputrules'

import {
  createListPlugins,
  createListSpec,
  listInputRules,
  listKeymap,
} from '../src/index'
import type { ListAttributes } from '../src/types'

// Mirrors a schema consumer extending the list node with a custom attribute
// marked `splittable`, e.g. ProseKit's `defineNodeAttr({ splittable: true })`.
export type TestListAttributes = ListAttributes & { marker?: string | null }

type ListSpecExtension = Extension<{
  Nodes: { list: ListAttributes }
}>
type ListMarkerExtension = Extension<{
  Nodes: { list: { marker?: string | null } }
}>

type DocExtension = Extension<{ Nodes: { doc: Record<string, never> } }>
type ParagraphExtension = Extension<{
  Nodes: { paragraph: Record<string, never> }
}>
type TextExtension = Extension<{ Nodes: { text: Record<string, never> } }>
type BlockquoteExtension = Extension<{
  Nodes: { blockquote: Record<string, never> }
}>
type HeadingAttrs = { level: number }
type HeadingExtension = Extension<{ Nodes: { heading: HeadingAttrs } }>
type HorizontalRuleExtension = Extension<{
  Nodes: { horizontalRule: Record<string, never> }
}>
type ListTestExtension = Union<
  [
    DocExtension,
    TextExtension,
    ParagraphExtension,
    BlockquoteExtension,
    HeadingExtension,
    HorizontalRuleExtension,
    ListSpecExtension,
    ListMarkerExtension,
    BaseCommandsExtension,
  ]
>

function defineDoc(): DocExtension {
  return defineNodeSpec({ name: 'doc', content: 'block+', topNode: true })
}

function defineText(): TextExtension {
  return defineNodeSpec({ name: 'text', group: 'inline' })
}

function defineParagraph(): ParagraphExtension {
  return defineNodeSpec({
    name: 'paragraph',
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0],
  })
}

function defineBlockquote(): BlockquoteExtension {
  return defineNodeSpec({
    name: 'blockquote',
    content: 'block+',
    group: 'block',
    defining: true,
    parseDOM: [{ tag: 'blockquote' }],
    toDOM: () => ['blockquote', 0],
  })
}

function defineHeading(): HeadingExtension {
  return defineNodeSpec<'heading', HeadingAttrs>({
    name: 'heading',
    content: 'inline*',
    group: 'block',
    defining: true,
    attrs: { level: { default: 1, validate: 'number' } },
    parseDOM: [1, 2, 3, 4, 5, 6].map((level) => ({
      tag: `h${level}`,
      attrs: { level },
    })),
    toDOM: (node) => [`h${(node.attrs as HeadingAttrs).level}`, 0],
  })
}

function defineHorizontalRule(): HorizontalRuleExtension {
  return defineNodeSpec({
    name: 'horizontalRule',
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr'],
  })
}

function defineListSpec(): ListSpecExtension {
  const spec = createListSpec()
  return defineNodeSpec<'list', ListAttributes>({
    ...spec,
    name: 'list',
  })
}

function defineListMarkerAttr(): ListMarkerExtension {
  return defineNodeAttr<'list', 'marker', string | null>({
    type: 'list',
    attr: 'marker',
    default: null,
    splittable: true,
  })
}

function defineListPlugins() {
  return definePlugin((ctx) => createListPlugins({ schema: ctx.schema }))
}

function defineListInputRules() {
  return definePlugin(() => inputRules({ rules: listInputRules }))
}

function defineListKeymap() {
  return defineKeymap(listKeymap)
}

export function defineListTestExtension(): ListTestExtension {
  return union(
    withPriority(defineParagraph(), Priority.high),
    defineDoc(),
    defineText(),
    defineBlockquote(),
    defineHeading(),
    defineHorizontalRule(),
    defineListSpec(),
    defineListMarkerAttr(),
    defineListPlugins(),
    defineListInputRules(),
    defineListKeymap(),
    defineBaseKeymap(),
    defineBaseCommands(),
  )
}
