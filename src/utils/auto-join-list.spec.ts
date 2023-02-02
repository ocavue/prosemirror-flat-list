import { describe, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { autoJoinList2 } from './auto-join-list'

describe('autoJoinList', () => {
  const t = setupTestingEditor()

  it('should join two lists', () => {
    t.runCommand(
      () => {
        const view = t.view
        const tr = view.state.tr
        const schema = view.state.schema
        tr.replaceWith(8, 9, schema.text('C'))
        autoJoinList2(tr, schema.nodes['list'])
        view.dispatch(tr)
      },

      t.doc(
        /*0*/
        t.list(
          /*1*/
          t.p(/*2*/ 'A' /*3*/),
          /*4*/
        ),
        /*5*/
        t.list(
          /*6*/
          t.list(
            /*7*/
            t.p(/*8*/ 'B' /*9*/),
            /*10*/
          ),
        ),
      ),

      t.doc(
        t.list(
          t.p('A'),
          t.list(
            //
            t.p('C'),
          ),
        ),
      ),
    )
  })
})
