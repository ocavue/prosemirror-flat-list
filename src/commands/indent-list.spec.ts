import { describe, it, expect } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('indentList', () => {
  const t = setupTestingEditor()

  it('can indent a list node', () => {
    const editor = t.add(
      t.markdown`
        - A1
        - A<cursor>2
        `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - A1
          - A<cursor>2
        `
    )
  })

  it('can indent multiple list nodes', () => {
    const editor = t.add(
      t.markdown`
        - A1
        - A<start>2
        - A<end>3
      `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - A1
          - A<start>2
          - A<end>3
      `
    )
  })

  it('can add ambitious indentations', () => {
    const editor = t.add(
      t.markdown`
        - A1
          - A<cursor>2
      `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - A1
          - - A<cursor>2
      `
    )
  })

  it('can keep attributes', () => {
    const editor = t.add(
      t.markdown`
        - [ ] A1
        - [x] A<cursor>2
      `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - [ ] A1
          - [x] A<cursor>2
      `
    )
  })

  it.skip('can keep the indentation of sub list nodes', () => {
    const editor = t.add(
      t.markdown`
        - A1
        - A2
        - A3<cursor>
          - B1 
          - B2 
          - B3
      `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - A1
        - A2
          - A3<cursor>
          - B1 
          - B2 
          - B3 
      `
    )
  })

  it.skip('can keep the indentation of sub list nodes when moving multiple list', () => {
    const editor = t.add(
      t.markdown`
        - A1
        - <start>A2
        - A3<end>
          - B1 
          - B2 
          - B3 
      `
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.markdown`
        - A1
          - <start>A2
          - A3<end>
          - B1 
          - B2 
          - B3 
      `
    )
  })
})
