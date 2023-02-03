import { describe, expect, it } from 'vitest'

import { setupTestingEditor, TestingEditor } from '../test/setup-editor'

// TODO: move these test to the command file
describe('Enter', () => {
  const { add, doc, p, list, blockquote } = setupTestingEditor()

  let editor: TestingEditor

  it('can split non-empty item', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('456<cursor>')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('456')),
        list(p('<cursor>')),
      ),
    )

    editor = add(
      doc(
        //
        list(p('123')),
        list(p('45<cursor>6')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        list(p('45')),
        list(p('<cursor>6')),
      ),
    )

    editor = add(
      doc(
        //
        list(p('1<cursor>23')),
        list(p('456')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('1')),
        list(p('<cursor>23')),
        list(p('456')),
      ),
    )
  })

  it('can split non-empty sub item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('456<cursor>')),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          list(p('456')),
          list(p('<cursor>')),
        ),
      ),
    )
  })

  it('can delete empty item', () => {
    editor = add(
      doc(
        //
        list(p('123')),
        list(p('<cursor>')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        p('<cursor>'),
      ),
    )

    editor = add(
      doc(
        //
        list(p('123')),
        list(p('<cursor>')),
        list(p('456')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('123')),
        p('<cursor>'),
        list(p('456')),
      ),
    )

    editor = add(
      doc(
        //
        list(p('<cursor>')),
        list(p('123')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        p('<cursor>'),
        list(p('123')),
      ),
    )
  })

  it('can dedent empty sub item', () => {
    editor = add(
      doc(
        list(
          //
          p('123'),
          list(p('<cursor>')),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('<cursor>'),
        ),
      ),
    )
  })

  it('can delete selected text', () => {
    editor = add(
      doc(
        //
        list(p('<start>123<end>')),
        list(p('456')),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        //
        list(p('')),
        list(p('<cursor>')),
        list(p('456')),
      ),
    )
  })

  it('escapes the item when the cursor is in the first paragraph of the item', () => {
    editor = add(
      doc(
        list(
          //
          p('123<cursor>'),
          p('456'),
          p('789'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
        ),
        list(
          //
          p('<cursor>'),
          p('456'),
          p('789'),
        ),
      ),
    )

    // Nested list item
    editor = add(
      doc(
        list(
          p('0'),
          list(
            //
            p('123<cursor>'),
            p('456'),
            p('789'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p('0'),
          list(
            //
            p('123'),
          ),
          list(
            //
            p('<cursor>'),
            p('456'),
            p('789'),
          ),
        ),
      ),
    )
  })

  it('does not escapes the item when the cursor is not in the first paragraph of the item', () => {
    // Cursor in the last paragraph of the item
    editor = add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p(''),
          p('<cursor>'),
        ),
      ),
    )

    // Cursor in the middle paragraph of the item
    editor = add(
      doc(
        list(
          //
          p('123'),
          p('456<cursor>'),
          p('789'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p('<cursor>'),
          p('789'),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          //
          p('123'),
          p('456'),
          p(''),
          p('<cursor>'),
          p('789'),
        ),
      ),
    )

    // Cursor in the last paragraph of the item (nested list item)
    editor = add(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456<cursor>'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p('<cursor>'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p(''),
            p('<cursor>'),
          ),
        ),
      ),
    )

    // Cursor in the middle paragraph of the item (nested list item)
    editor = add(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456<cursor>'),
            p('789'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p('<cursor>'),
            p('789'),
          ),
        ),
      ),
    )
    editor.press('Enter')
    expect(editor.state).toEqualRemirrorState(
      doc(
        list(
          p(),
          list(
            //
            p('123'),
            p('456'),
            p(''),
            p('<cursor>'),
            p('789'),
          ),
        ),
      ),
    )
  })

  describe('extra cases', () => {
    it("won't effect non-list document", () => {
      editor = add(
        doc(
          //
          p('1<cursor>23'),
        ),
      )
      editor.press('Enter')
      expect(editor.state).toEqualRemirrorState(
        doc(
          //
          p('1'),
          p('23'),
        ),
      )

      editor = add(
        doc(
          blockquote(
            p('123'),
            blockquote(
              //
              p('4<cursor>56'),
            ),
          ),
        ),
      )
      editor.press('Enter')
      expect(editor.state).toEqualRemirrorState(
        doc(
          blockquote(
            p('123'),
            blockquote(
              //
              p('4'),
              p('<cursor>56'),
            ),
          ),
        ),
      )
    })
  })
})

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
