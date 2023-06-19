import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { HeadingExtension } from '@remirror/extension-heading'
import { HorizontalRuleExtension } from '@remirror/extension-horizontal-rule'
import {
  OrderedListExtension,
  BulletListExtension,
} from '@remirror/extension-list'
import type { Transaction } from 'prosemirror-state'
import { renderEditor } from 'jest-remirror'
import type {
  TaggedProsemirrorNode,
  RemirrorTestChain,
  TaggedContentWithText,
} from 'jest-remirror'
import type { CorePreset } from '@remirror/preset-core'
import type { BuiltinPreset } from '@remirror/core'
import { describe, expect, it, beforeEach } from 'vitest'
import { ListExtension } from '../test/extension'
import { migrateDoc, migrateNode } from './migrate-pm-doc'

describe('migrateDoc', () => {
  let add: (
    taggedDocument: TaggedProsemirrorNode,
  ) => RemirrorTestChain<
    | ListExtension
    | BlockquoteExtension
    | HorizontalRuleExtension
    | HeadingExtension
    | OrderedListExtension
    | BulletListExtension
    | CorePreset
    | BuiltinPreset
  >
  let doc: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let p: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let blockquote: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let horizontalRule: (
    ...content: TaggedContentWithText[]
  ) => TaggedProsemirrorNode
  let ul: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let ol: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let li: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let bulletList: (...content: TaggedContentWithText[]) => TaggedProsemirrorNode
  let orderedList: (
    ...content: TaggedContentWithText[]
  ) => TaggedProsemirrorNode

  beforeEach(() => {
    const extensions = [
      new ListExtension(),
      new BlockquoteExtension(),
      new HorizontalRuleExtension(),
      new HeadingExtension(),
      new OrderedListExtension(),
      new BulletListExtension(),
    ]

    const editor = renderEditor(extensions, {})

    ;({
      add,
      nodes: {
        doc,
        p,
        blockquote,
        horizontalRule,
        bulletList: ul,
        orderedList: ol,
        listItem: li,
      },
    } = editor)

    bulletList = editor.attributeNodes.list({ kind: 'bullet' })
    orderedList = editor.attributeNodes.list({ kind: 'ordered' })
  })

  it('can migrate a ProseMirror Doc', () => {
    const editor = add(
      doc(
        p('Text'),
        ul(li(p('A1')), li(p('A2'), ul(li(p('B1'))))),
        blockquote(p('Quoted text')),
        ol(li(p('1')), li(p('2'), ol(li(p('2.1')), li(p('2.2'))))),
        horizontalRule(),
        p('More text'),
      ),
    )

    const tr = migrateDoc(editor.state)

    editor.view.dispatch(tr!)

    expect(editor.state).toEqualRemirrorState(
      doc(
        p('Text'),
        bulletList(p('A1')),
        bulletList(p('A2'), bulletList(p('B1'))),
        blockquote(p('Quoted text')),
        orderedList(p('1')),
        orderedList(p('2'), orderedList(p('2.1')), orderedList(p('2.2'))),
        horizontalRule(),
        p('More text'),
      ),
    )
  })

  it('leaves docs without old list types unchanged', () => {
    const editor = add(
      doc(
        p('Text'),
        blockquote(p('Quoted text')),
        horizontalRule(),
        p('More text'),
      ),
    )

    const tr = migrateDoc(editor.state)
    expect(tr).toBe(null)
  })

  it('accepts an existing Transaction', () => {
    const editor = add(
      doc(
        p('Text'),
        ul(li(p('A1')), li(p('A2'), ul(li(p('B1'))))),
        blockquote(p('Quoted text')),
        ol(li(p('1')), li(p('2'), ol(li(p('2.1')), li(p('2.2'))))),
        horizontalRule(),
        p('More text'),
      ),
    )

    const pos = 6
    const oldBulletList = editor.state.doc.nodeAt(pos)
    const newBulletList = migrateNode(
      oldBulletList!,
      editor.state.schema.nodes.list,
      'bullet',
    )

    let { tr } = editor.state
    tr = tr.replaceWith(pos, pos + oldBulletList!.nodeSize, newBulletList)
    tr = tr.insert(0, p('Even more text'))
    tr = migrateDoc(editor.state, { tr }) as Transaction

    editor.view.dispatch(tr)

    expect(editor.state).toEqualRemirrorState(
      doc(
        p('Even more text'),
        p('Text'),
        bulletList(p('A1')),
        bulletList(p('A2'), bulletList(p('B1'))),
        blockquote(p('Quoted text')),
        orderedList(p('1')),
        orderedList(p('2'), orderedList(p('2.1')), orderedList(p('2.2'))),
        horizontalRule(),
        p('More text'),
      ),
    )
  })
})
