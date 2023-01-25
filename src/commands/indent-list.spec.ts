import { describe, it, expect } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('indentList', () => {
  const t = setupTestingEditor()

  it('can indent a list node', () => {
    const editor = t.add(
      t.doc(
        //
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A<cursor>2'))
      )
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.doc(
        t.bulletList(
          //
          t.p('A1'),
          t.bulletList(t.p('A<cursor>2'))
        )
      )
    )
  })

  it('can indent multiple list nodes', () => {
    const editor = t.add(
      t.doc(
        //
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A<start>2')),
        t.bulletList(t.p('A<end>3'))
      )
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.doc(
        t.bulletList(
          //
          t.p('A1'),
          t.bulletList(t.p('A<start>2')),
          t.bulletList(t.p('A<end>3'))
        )
      )
    )
  })

  it('can add ambitious indentations', () => {
    const editor = t.add(
      t.doc(
        //
        t.bulletList(
          //
          t.p('A1'),
          t.bulletList(t.p('A<cursor>2'))
        )
      )
    )
    editor.commands.indentList()
    expect(editor.state).toEqualRemirrorState(
      t.doc(
        //
        t.bulletList(
          //
          t.p('A1'),
          t.bulletList(
            //
            t.bulletList(t.p('A<cursor>2'))
          )
        )
      )
    )
  })
})
