import { describe, expect, it } from 'vitest'

import { expectStateToEqual } from '../../test/markdown'
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
              t.bulletList(t.p('<a>D1')),
              t.bulletList(t.p('D2<b>')),
            ),
          ),
        ),
      ),
    )

    const copied = t.copy()
    expect(copied.html).toMatchInlineSnapshot(
      `"<ul data-pm-slice="2 2 []"><li class="prosemirror-flat-list" data-list-kind="bullet"><p>D1</p></li><li class="prosemirror-flat-list" data-list-kind="bullet"><p>D2</p></li></ul>"`,
    )

    t.add(t.doc(t.p('')))

    t.pasteHTML(copied.html)
    expectStateToEqual(
      t.editor.state,
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
              t.bulletList(t.p('<a>D1<b>')),
              t.bulletList(t.p('D2')),
            ),
          ),
        ),
      ),
    )

    const copied = t.copy()
    expect(copied.html).toMatchInlineSnapshot(
      `"<p data-pm-slice="1 1 []">D1</p>"`,
    )

    t.add(t.doc(t.p('')))

    t.pasteHTML(copied.html)
    expectStateToEqual(t.editor.state, t.doc(t.p('D1')))
  })

  it('can keep the checkbox state when pasting into a bullet list', () => {
    t.add(
      t.doc(
        t.bulletList(t.p('Bullet 1')),
        t.checkedTaskList(t.p('<a>Task 1')),
        t.uncheckedTaskList(t.p('Task 2<b>')),
        t.bulletList(t.p('Bullet 2')),
      ),
    )

    const copied = t.copy()

    t.add(
      t.doc(
        t.bulletList(t.p('Bullet 1')),
        t.bulletList(t.p('Bullet 2')),
        t.bulletList(t.p('<a>')),
      ),
    )

    t.pasteHTML(copied.html)
    expectStateToEqual(
      t.editor.state,
      t.doc(
        t.bulletList(t.p('Bullet 1')),
        t.bulletList(t.p('Bullet 2')),
        t.checkedTaskList(t.p('Task 1')),
        t.uncheckedTaskList(t.p('Task 2')),
      ),
    )
  })

  it('can keep the checkbox state when pasting into a sub bullet list', () => {
    t.add(
      t.doc(
        t.bulletList(t.p('Bullet 1')),
        t.checkedTaskList(t.p('<a>Task 1')),
        t.uncheckedTaskList(t.p('Task 2<b>')),
        t.bulletList(t.p('Bullet 2')),
      ),
    )

    const copied = t.copy()

    t.add(
      t.doc(
        t.bulletList(
          t.p('Bullet 1'),
          t.bulletList(t.p('Sub Bullet 1')),
          t.bulletList(t.p('<a>')),
        ),
      ),
    )

    t.pasteHTML(copied.html)
    expectStateToEqual(
      t.editor.state,
      t.doc(
        t.bulletList(
          t.p('Bullet 1'),
          t.bulletList(t.p('Sub Bullet 1')),
          t.checkedTaskList(t.p('Task 1')),
          t.uncheckedTaskList(t.p('Task 2')),
        ),
      ),
    )
  })
})
