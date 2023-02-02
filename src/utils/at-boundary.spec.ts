import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { atEndBoundary, atStartBoundary } from './at-boundary'

describe('boundary', () => {
  const t = setupTestingEditor()

  const doc = t.doc(
    /*0*/
    t.list(
      /*1*/
      t.p(/*2*/ 'A1' /*4*/),
      /*5*/
      t.p(/*6*/ 'A2' /*8*/),
      /*9*/
    ),
    /*10*/
    t.list(
      /*11*/
      t.list(
        /*12*/
        t.p(/*13*/ 'B1' /*15*/),
        /*16*/
      ),
    ),
  )

  it('atStartBoundary', () => {
    expect(atStartBoundary(doc.resolve(14), 3)).toBe(true)
    expect(atStartBoundary(doc.resolve(14), 2)).toBe(true)
    expect(atStartBoundary(doc.resolve(14), 1)).toBe(true)
    expect(atStartBoundary(doc.resolve(14), 0)).toBe(false)

    expect(atStartBoundary(doc.resolve(6), 2)).toBe(true)
    expect(atStartBoundary(doc.resolve(6), 1)).toBe(false)
    expect(atStartBoundary(doc.resolve(6), 0)).toBe(false)
  })

  it('atEndBoundary', () => {
    expect(atEndBoundary(doc.resolve(14), 3)).toBe(true)
    expect(atEndBoundary(doc.resolve(14), 2)).toBe(true)
    expect(atEndBoundary(doc.resolve(14), 1)).toBe(true)
    expect(atEndBoundary(doc.resolve(14), 0)).toBe(true)

    expect(atEndBoundary(doc.resolve(6), 2)).toBe(true)
    expect(atEndBoundary(doc.resolve(6), 1)).toBe(true)
    expect(atEndBoundary(doc.resolve(6), 0)).toBe(false)
  })
})
