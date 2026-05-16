import {
  defineBaseCommands,
  defineBaseKeymap,
  defineKeymap,
  defineNodeSpec,
  definePlugin,
  union,
  type Extension,
} from '@prosekit/core'
import { inputRules } from '@prosekit/pm/inputrules'

import {
  createListPlugins,
  createListSpec,
  listInputRules,
  listKeymap,
} from '../src/index'
import type { ListAttributes } from '../src/types'

type ListSpecExtension = Extension<{
  Nodes: { list: ListAttributes }
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

function defineListPlugins() {
  return definePlugin((ctx) => createListPlugins({ schema: ctx.schema }))
}

function defineListInputRules() {
  return definePlugin(() => inputRules({ rules: listInputRules }))
}

function defineListKeymap() {
  return defineKeymap(listKeymap)
}

export function defineListTestExtension() {
  return union(
    defineDoc(),
    defineText(),
    defineParagraph(),
    defineBlockquote(),
    defineHeading(),
    defineHorizontalRule(),
    defineListSpec(),
    defineListPlugins(),
    defineListInputRules(),
    defineListKeymap(),
    defineBaseKeymap(),
    defineBaseCommands(),
  )
}

export type ListTestExtension = ReturnType<typeof defineListTestExtension>
