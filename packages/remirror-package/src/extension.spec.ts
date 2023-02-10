import { describe, it } from 'vitest'

import { setupTestingEditor } from '../test/setup-editor'

describe('Keymap', () => {
  const t = setupTestingEditor()
  const { editor, runCommand } = t

  it('can increase the indentation by pressing Tab', () => {
    runCommand(
      () => editor.press('Tab'),
      t.doc(
        //
        t.list(t.p('A1')),
        t.list(t.p('A2<cursor>')),
      ),
      t.doc(
        //
        t.list(
          t.p('A1'),
          //
          t.list(t.p('A2<cursor>')),
        ),
      ),
    )
  })

  it('can decrease the indentation by pressing Shift-Tab', () => {
    runCommand(
      () => editor.press('Shift-Tab'),
      t.doc(
        //
        t.list(
          t.p('A1'),
          //
          t.list(t.p('B1<cursor>')),
        ),
      ),
      t.doc(
        //
        t.list(t.p('A1')),
        t.list(t.p('B1<cursor>')),
      ),
    )
  })

  it('can split a list by pressing Enter', () => {
    runCommand(
      () => editor.press('Enter'),
      t.doc(
        //
        t.list(t.p('Foo<cursor>Bar')),
      ),
      t.doc(
        //
        t.list(t.p('Foo')),
        t.list(t.p('<cursor>Bar')),
      ),
    )
  })
})
