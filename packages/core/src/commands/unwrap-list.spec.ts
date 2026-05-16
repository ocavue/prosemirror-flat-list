import { NodeSelection } from 'prosemirror-state'
import { describe, expect, it } from 'vitest'

import { expectStateToEqual } from '../../test/markdown'
import { setupTestingEditor } from '../../test/setup-editor'
import type { ListAttributes } from '../types'

import { createUnwrapListCommand } from './unwrap-list'

describe('unwrapList', () => {
  const t = setupTestingEditor()
  const { doc, p, bulletList, orderedList, checkedTaskList } = t
  const unwrapList = createUnwrapListCommand()

  it('can unwrap a list node selection', () => {
    const doc1 = doc(bulletList(p('P1'), p('P2')))
    const doc2 = doc(p('P1'), p('P2'))

    t.add(doc1)
    const selection = new NodeSelection(t.view.state.doc.resolve(0))
    expect(selection.node.type.name).toEqual('list')
    t.view.dispatch(t.view.state.tr.setSelection(selection))

    expect(t.dispatchCommand(unwrapList)).toEqual(true)
    expectStateToEqual(t.editor.state, doc2)
  })

  it('can unwrap a list node selection in a nested list', () => {
    const doc1 = doc(orderedList(checkedTaskList(p('P1'), p('P2'))))
    const doc2 = doc(orderedList(p('P1'), p('P2')))

    t.add(doc1)
    const selection = new NodeSelection(t.view.state.doc.resolve(1))
    expect(selection.node.type.name).toEqual('list')
    const attrs = selection.node.attrs as ListAttributes
    expect(attrs.kind).toEqual('task')
    t.view.dispatch(t.view.state.tr.setSelection(selection))

    expect(t.dispatchCommand(unwrapList)).toEqual(true)
    expectStateToEqual(t.editor.state, doc2)
  })

  it('can unwrap a paragraph inside a list node', () => {
    const doc1 = doc(orderedList(p('P<a>1')))
    const doc2 = doc(p('P<a>1'))
    t.applyCommand(unwrapList, doc1, doc2)
  })

  it('can unwrap all paragraphs inside a list node event only part of them are selected', () => {
    const doc1 = doc(orderedList(p('P1'), p('P2<a>'), p('P3')))
    const doc2 = doc(p('P1'), p('P2<a>'), p('P3'))
    t.applyCommand(unwrapList, doc1, doc2)
  })

  it('can unwrap all paragraphs inside a list node', () => {
    const doc1 = doc(orderedList(p('<a>P1'), p('P2'), p('P3<b>')))
    const doc2 = doc(p('<a>P1'), p('P2'), p('P3<b>'))
    t.applyCommand(unwrapList, doc1, doc2)
  })

  it('can unwrap multiple lists', () => {
    const doc1 = doc(
      p('P1'),
      orderedList(p('P2<a>')),
      orderedList(p('P3')),
      orderedList(p('P4<b>'), p('P5')),
      orderedList(p('P6')),
    )
    const doc2 = doc(
      p('P1'),
      p('P2<a>'),
      p('P3'),
      p('P4<b>'),
      p('P5'),
      orderedList(p('P6')),
    )
    t.applyCommand(unwrapList, doc1, doc2)
  })
})
