import { describe, expect, it } from 'vitest'

import { setupTestingEditor } from '../test/setup-editor'

describe('createListNodeView', () => {
  const t = setupTestingEditor()

  it('keeps the list DOM when an attribute inside the marker changes', async () => {
    const editor = t.add(t.doc(t.uncheckedTaskList(t.p('A1<a>'))))
    const list = editor.view.dom.querySelector('.prosemirror-flat-list')
    const checkbox = list?.querySelector<HTMLElement>('.list-marker input')
    expect(checkbox).toBeTruthy()

    checkbox!.style.setProperty('caret-color', 'transparent')
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(list?.isConnected).toBe(true)
  })

  it('redraws the list when its attributes change', () => {
    const editor = t.add(t.doc(t.uncheckedTaskList(t.p('A1<a>'))))
    const list = editor.view.dom.querySelector('.prosemirror-flat-list')

    editor.view.dispatch(
      editor.view.state.tr.setNodeAttribute(0, 'checked', true),
    )

    expect(list?.isConnected).toBe(false)
    expect(
      editor.view.dom
        .querySelector('.list-marker input')
        ?.hasAttribute('checked'),
    ).toBe(true)
  })
})
