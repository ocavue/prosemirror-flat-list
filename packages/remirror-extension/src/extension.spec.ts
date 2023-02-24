import { describe, it } from 'vitest'

import { setupTestingEditor } from '../test/setup-editor'

describe('Keymap', () => {
  const t = setupTestingEditor()
  const { editor, apply } = t

  it('can increase the indentation by pressing Tab', () => {
    apply(
      () => editor.press('Tab'),
      t.doc(
        //
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('A2<cursor>')),
      ),
      t.doc(
        //
        t.bulletList(
          t.p('A1'),
          //
          t.bulletList(t.p('A2<cursor>')),
        ),
      ),
    )
  })

  it('can decrease the indentation by pressing Shift-Tab', () => {
    apply(
      () => editor.press('Shift-Tab'),
      t.doc(
        //
        t.bulletList(
          t.p('A1'),
          //
          t.bulletList(t.p('B1<cursor>')),
        ),
      ),
      t.doc(
        //
        t.bulletList(t.p('A1')),
        t.bulletList(t.p('B1<cursor>')),
      ),
    )
  })

  it('can split a list by pressing Enter', () => {
    apply(
      () => editor.press('Enter'),
      t.doc(
        //
        t.bulletList(t.p('Foo<cursor>Bar')),
      ),
      t.doc(
        //
        t.bulletList(t.p('Foo')),
        t.bulletList(t.p('<cursor>Bar')),
      ),
    )
  })
})
