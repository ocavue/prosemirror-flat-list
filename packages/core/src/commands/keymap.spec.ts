import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'

describe('Keymap', () => {
  const t = setupTestingEditor()
  describe('Backspace', () => {
    it('should delete the empty paragraph between two list nodes', () => {
      t.apply(
        () => t.editor.press('Backspace'),
        t.doc(
          t.bulletList(t.p('A1')),
          t.p('<cursor>'),
          t.bulletList(t.p('A2')),
        ),
        t.doc(t.bulletList(t.p('A1')), t.bulletList(t.p('A2'))),
      )
    })
  })
})
