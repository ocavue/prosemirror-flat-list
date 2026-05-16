import { nodeFromHTML } from '@prosekit/core'
import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../../test/setup-editor'

describe('createParseDomRules', () => {
  const t = setupTestingEditor()
  const schema = t.schema

  it('can parse bullet list HTML', () => {
    const html = /*html*/ `
      <ul>
        <li>A1</li>
        <li>A2</li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })

    expect(node.toJSON()).toEqual(
      t.doc(t.bulletList(t.p('A1')), t.bulletList(t.p('A2'))).toJSON(),
    )
  })

  it('can parse nested list HTML', () => {
    const html = /*html*/ `
      <ul>
        <li>
          <span>A1</span>
        </li>
        <li>
          <span>A2</span>
          <ol>
            <li><span>B1</span></li>
            <li><span>B2</span></li>
          </ol>
        </li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })

    expect(node.toJSON()).toEqual(
      t
        .doc(
          t.bulletList(t.p('A1')),
          t.bulletList(
            t.p('A2'),
            t.orderedList(t.p('B1')),
            t.orderedList(t.p('B2')),
          ),
        )
        .toJSON(),
    )
  })

  it('can parse invalid nested list HTML copied from Dropbox Paper', () => {
    const html = /*html*/ `
      <meta charset='utf-8'>
      <ul class="listtype-bullet listindent1 list-bullet1">
          <li>
            <span>A1</span>
          </li>
          <li>
            <span>A2</span>
          </li>
          <ol start="1" class="listtype-number listindent2 list-number2" style="list-style-type: lower-latin;">
              <li><span>B1</span></li>
              <li><span>B2</span></li>
          </ol>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })

    expect(node.toJSON()).toEqual(
      t
        .doc(
          t.bulletList(t.p('A1')),
          t.bulletList(t.p('A2')),
          t.bulletList(
            //
            t.orderedList(t.p('B1')),
            t.orderedList(t.p('B2')),
          ),
        )
        .toJSON(),
    )
  })

  it('can parse checkbox', () => {
    const html = /*html*/ `
      <ul>
        <li><input type="checkbox" checked><span>A1</span></li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse checkbox in label', () => {
    const html = /*html*/ `
      <ul>
        <li><label><input type="checkbox" checked>A1</label></li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse checkbox in span', () => {
    const html = /*html*/ `
      <ul>
        <li><span><input type="checkbox" checked>A1</span></li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse checkbox in paragraph', () => {
    const html = /*html*/ `<ul><li><p><input type="checkbox" checked disabled>A1</p></li></ul>`
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse checkbox after a newline', () => {
    const html = /*html*/ `<ul><li><p>\n<input type="checkbox" checked disabled>A1</p></li></ul>`
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse checkbox in span and label', () => {
    const html = /*html*/ `
      <ul>
        <li><span><label><input type="checkbox" checked>A1</label></span></li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(t.doc(t.checkedTaskList(t.p('A1'))).toJSON())
  })

  it('can parse TODO copied from Notion', () => {
    const html = /*html*/ `
      <meta charset='utf-8'>
      <ul>
      <li>[ ]  Unchecked</li>
      <li>[x]  Checked</li>
      </ul>
    `
    const node = nodeFromHTML(html, { schema })
    expect(node.toJSON()).toEqual(
      t
        .doc(
          t.uncheckedTaskList(t.p('Unchecked')),
          t.checkedTaskList(t.p('Checked')),
        )
        .toJSON(),
    )
  })
})
