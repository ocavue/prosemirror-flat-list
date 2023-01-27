import { describe, it, expect } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { findListsRange, isLeftOpenRange, isRightOpenRange } from './list-range'

describe('list range', () => {
  const t = setupTestingEditor()
  const listType = t.schema.nodes.list

  const doc = t.doc(
    /*0*/
    t.bulletList(
      /*1*/
      t.bulletList(
        /*2*/
        t.bulletList(
          /*3*/
          t.p(/*4*/ 'AB' /*6*/),
          /*7*/
          t.p(/*8*/ 'CD' /*10*/),
          /*11*/
          t.p(/*12*/ 'CD' /*14*/),
          /*15*/
        ),
        /*16*/

        t.bulletList(
          /*17*/
          t.p(/*18*/ 'AB' /*20*/),
          /*21*/
        ),
        /*22*/
      ),
      /*23*/
    ),
    /*24*/
  )

  it('isLeftOpenRange', () => {
    const isLeftOpen = (from: number, to = from) => {
      const range = findListsRange(
        doc.resolve(from),
        doc.resolve(to),
        listType,
      )!
      return isLeftOpenRange(range)
    }

    expect(isLeftOpen(3)).toBe(false)
    expect(isLeftOpen(4)).toBe(false)
    expect(isLeftOpen(5)).toBe(false)
    expect(isLeftOpen(6)).toBe(false)
    expect(isLeftOpen(7)).toBe(1)
    expect(isLeftOpen(8)).toBe(1)
    expect(isLeftOpen(11)).toBe(2)
    expect(isLeftOpen(12)).toBe(2)
    expect(isLeftOpen(14)).toBe(2)
    expect(isLeftOpen(15)).toBe(3)
  })

  it('isRightOpenRange', () => {
    const isRightOpen = (from: number, to = from) => {
      const range = findListsRange(
        doc.resolve(from),
        doc.resolve(to),
        listType,
      )!
      return isRightOpenRange(range)
    }

    expect(isRightOpen(3)).toBe(true)
    expect(isRightOpen(7)).toBe(true)
    expect(isRightOpen(9)).toBe(true)
    expect(isRightOpen(10)).toBe(true)
    expect(isRightOpen(11)).toBe(true)
    expect(isRightOpen(12)).toBe(false)
    expect(isRightOpen(15)).toBe(false)
  })
})
