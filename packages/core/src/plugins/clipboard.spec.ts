import { pasteContent } from 'jest-prosemirror'
import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('Clipboard', () => {
  const t = setupTestingEditor()

  it('can paste some deeply nested list nodes', () => {
    t.add(
      t.doc(
        t.bulletList(
          t.p('A1'),
          t.bulletList(
            t.p('B1'),
            t.bulletList(
              t.p('C1'),
              t.bulletList(t.p('<start>D1')),
              t.bulletList(t.p('D2<end>')),
            ),
          ),
        ),
      ),
    )

    const copied = t.editor.copied
    expect(copied.html).toMatchInlineSnapshot(
      '"<ul data-pm-slice=\\"2 2 []\\"><li class=\\"prosemirror-flat-list\\" data-list-kind=\\"bullet\\"><p>D1</p></li><li class=\\"prosemirror-flat-list\\" data-list-kind=\\"bullet\\"><p>D2</p></li></ul>"',
    )

    t.add(t.doc(t.p('')))

    pasteContent({
      view: t.editor.view,
      content: copied,
    })
    expect(t.editor.view.state).toEqualRemirrorState(
      t.doc(
        //
        t.bulletList(t.p('D1')),
        t.bulletList(t.p('D2')),
      ),
    )
  })

  it('can paste the text from a deeply nested list', () => {
    t.add(
      t.doc(
        t.bulletList(
          t.p('A1'),
          t.bulletList(
            t.p('B1'),
            t.bulletList(
              t.p('C1'),
              t.bulletList(t.p('<start>D1<end>')),
              t.bulletList(t.p('D2')),
            ),
          ),
        ),
      ),
    )

    const copied = t.editor.copied
    expect(copied.html).toMatchInlineSnapshot(
      '"<p data-pm-slice=\\"1 1 []\\">D1</p>"',
    )

    t.add(t.doc(t.p('')))

    pasteContent({
      view: t.editor.view,
      content: copied,
    })
    expect(t.editor.view.state).toEqualRemirrorState(t.doc(t.p('D1')))
  })
})
