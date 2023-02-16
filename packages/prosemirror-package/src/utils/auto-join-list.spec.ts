import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { autoJoinList } from './auto-join-list'

describe('autoJoinList', () => {
  const t = setupTestingEditor()

  it('should join two lists', () => {
    t.runCommand(
      () => {
        const view = t.view
        const tr = view.state.tr
        const schema = view.state.schema
        tr.replaceWith(8, 9, schema.text('C'))
        autoJoinList(tr)
        view.dispatch(tr)
      },

      t.doc(
        /*0*/
        t.bulletList(
          /*1*/
          t.p(/*2*/ 'A' /*3*/),
          /*4*/
        ),
        /*5*/
        t.bulletList(
          /*6*/
          t.bulletList(
            /*7*/
            t.p(/*8*/ 'B' /*9*/),
            /*10*/
          ),
        ),
      ),

      t.doc(
        t.bulletList(
          t.p('A'),
          t.bulletList(
            //
            t.p('C'),
          ),
        ),
      ),
    )
  })
})
