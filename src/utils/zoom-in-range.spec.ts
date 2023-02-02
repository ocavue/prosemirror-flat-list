import { NodeRange } from '@remirror/pm/model'
import { describe, it, expect } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { cutByIndex } from './cut-by-index'
import { zoomInRange } from './zoom-in-range'

describe('zoomInRange', () => {
  const t = setupTestingEditor()

  it('can zoom in range', () => {
    const doc = t.doc(
      /*0*/
      t.blockquote(
        /*1*/
        t.p(
          /*2*/
          'A',
          /*3*/
        ),
        /*4*/
        t.blockquote(
          /*5*/
          t.p(
            /*6*/
            'B',
            /*7*/
          ),
          /*8*/
        ),
        /*9*/
        t.blockquote(
          /*10*/
          t.p(
            /*11*/
            'C',
            /*12*/
          ),
          /*13*/
          t.p(
            /*14*/
            'D',
            /*15*/
          ),
          /*16*/
        ),
        /*17*/
        t.p(
          /*18*/
          'E',
          /*19*/
        ),
        /*20*/
      ),
      /*21*/
    )

    const range1 = new NodeRange(doc.resolve(1), doc.resolve(12), 1)
    expect(rangeToString(range1)).toMatchInlineSnapshot(
      '"<paragraph(\\"A\\"), blockquote(paragraph(\\"B\\")), blockquote(paragraph(\\"C\\"), paragraph(\\"D\\"))>"',
    )

    const range2 = zoomInRange(range1, 0)
    expect(range2.depth).toEqual(1)
    expect(range2.startIndex).toEqual(0)
    expect(range2.endIndex).toEqual(1)
    expect(rangeToString(range2)).toMatchInlineSnapshot(
      '"<paragraph(\\"A\\")>"',
    )

    const range3 = zoomInRange(range1, 1)
    expect(range3.depth).toEqual(2)
    expect(range3.parent.toString()).toMatchInlineSnapshot(
      '"blockquote(paragraph(\\"B\\"))"',
    )
    expect(range3.startIndex).toEqual(0)
    expect(range3.endIndex).toEqual(1)
    expect(rangeToString(range3)).toMatchInlineSnapshot(
      '"<paragraph(\\"B\\")>"',
    )

    const range4 = zoomInRange(range1, 2)
    expect(range4.depth).toEqual(2)
    expect(range4.startIndex).toEqual(0)
    expect(range4.endIndex).toEqual(1)
    expect(rangeToString(range4)).toMatchInlineSnapshot(
      '"<paragraph(\\"C\\")>"',
    )

    const range5 = zoomInRange(range4, 0)
    expect(range5.depth).toEqual(2)
    expect(rangeToString(range5)).toMatchInlineSnapshot(
      '"<paragraph(\\"C\\")>"',
    )
  })
})

function rangeToFragment(range: NodeRange) {
  return cutByIndex(range.parent.content, range.startIndex, range.endIndex)
}

function rangeToString(range: NodeRange) {
  return rangeToFragment(range).toString()
}
