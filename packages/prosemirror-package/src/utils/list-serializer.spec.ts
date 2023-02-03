import { describe, expect, it } from 'vitest'
import { setupTestingEditor } from '../../test/setup-editor'
import { ListDOMSerializer } from './list-serializer'

describe('ListDOMSerializer', () => {
  const {
    add,
    doc,
    p,
    bulletList,
    orderedList,
    uncheckedTaskList: taskList,
    expandedToggleList: toggleList,
    schema,
  } = setupTestingEditor()

  let editor: ReturnType<typeof add>

  it('can serialize list nodes into <ul>', () => {
    editor = add(doc(bulletList(p('A')), bulletList(p('B'))))

    const serializer = new ListDOMSerializer(
      ListDOMSerializer.nodesFromSchema(schema),
      ListDOMSerializer.marksFromSchema(schema),
    )

    const serialized = serializer.serializeFragment(editor.state.doc.content)

    expect(serialized.querySelectorAll('UL').length).toBe(1)
    expect(serialized.querySelectorAll('OL').length).toBe(0)
    expect(serialized.querySelectorAll('UL > LI').length).toBe(2)
    expect(serialized).toMatchSnapshot()
  })

  it('can serialize list nodes into <ol>', () => {
    editor = add(doc(orderedList(p('A')), orderedList(p('B'))))

    const serializer = new ListDOMSerializer(
      ListDOMSerializer.nodesFromSchema(schema),
      ListDOMSerializer.marksFromSchema(schema),
    )

    const serialized = serializer.serializeFragment(editor.state.doc.content)

    expect(serialized.querySelectorAll('UL').length).toBe(0)
    expect(serialized.querySelectorAll('OL').length).toBe(1)
    expect(serialized.querySelectorAll('OL > LI').length).toBe(2)
    expect(serialized).toMatchSnapshot()
  })

  it('can serialize list nodes with different types into a single <ul>', () => {
    editor = add(
      doc(
        bulletList(p('A')),
        taskList(p('B')),
        toggleList(p('C')),

        orderedList(p('D')),

        bulletList(p('D')),
        taskList(p('E')),
        toggleList(p('D')),
      ),
    )

    const serializer = new ListDOMSerializer(
      ListDOMSerializer.nodesFromSchema(schema),
      ListDOMSerializer.marksFromSchema(schema),
    )

    const serialized = serializer.serializeFragment(editor.state.doc.content)

    expect(serialized.querySelectorAll('UL').length).toBe(2)
    expect(serialized.querySelectorAll('OL').length).toBe(1)
    expect(serialized.querySelectorAll('UL > LI').length).toBe(6)
    expect(serialized.querySelectorAll('OL > LI').length).toBe(1)
    expect(serialized).toMatchSnapshot()
  })

  it('can serialize nested list node ', () => {
    editor = add(
      doc(
        bulletList(p('A'), orderedList(p('B')), orderedList(p('C'))),
        bulletList(p('D'), orderedList(p('E')), orderedList(p('F'))),
      ),
    )

    const serializer = new ListDOMSerializer(
      ListDOMSerializer.nodesFromSchema(schema),
      ListDOMSerializer.marksFromSchema(schema),
    )

    const serialized = serializer.serializeFragment(editor.state.doc.content)

    expect(serialized.querySelectorAll('UL').length).toBe(1)
    expect(serialized.querySelectorAll('OL').length).toBe(2)
    expect(serialized.querySelectorAll('UL > LI').length).toBe(2)
    expect(serialized.querySelectorAll('OL > LI').length).toBe(4)
    expect(serialized).toMatchSnapshot()
  })
})
