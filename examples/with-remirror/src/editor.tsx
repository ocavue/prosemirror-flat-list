import '@remirror/styles/all.css'
import 'prosemirror-flat-list/style.css'

import { BlockquoteExtension } from '@remirror/extension-blockquote'
import { HardBreakExtension } from '@remirror/extension-hard-break'
import { HeadingExtension } from '@remirror/extension-heading'
import { LinkExtension } from '@remirror/extension-link'
import {
  EditorComponent,
  Remirror,
  ThemeProvider,
  useCommands,
  useRemirror,
} from '@remirror/react'
import * as React from 'react'
import { FC, PropsWithChildren, useEffect } from 'react'

import { isListNode, ListAttributes, ListKind } from 'prosemirror-flat-list'
import { ListExtension } from 'remirror-extension-flat-list'

const Button: FC<PropsWithChildren<{ onClick: () => void }>> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onClick()}
    >
      {children}
    </button>
  )
}

const ButtonGroup = (): JSX.Element => {
  const commands = useCommands()

  const { indentList, dedentList } = commands
  const wrapInBulletList = () => commands.wrapInList({ kind: 'bullet' })
  const wrapInOrderedList = () => commands.wrapInList({ kind: 'ordered' })
  const wrapInTaskList = () => commands.wrapInList({ kind: 'task' })
  const wrapInToggleList = () => commands.wrapInList({ kind: 'toggle' })
  const changeListKind = () =>
    commands.wrapInList((range) => {
      const attrs = range.parent.child(range.startIndex).attrs as ListAttributes

      let kind: ListKind

      if (attrs.kind === 'bullet') {
        kind = 'ordered'
      } else if (attrs.kind === 'ordered') {
        kind = 'task'
      } else if (attrs.kind === 'task') {
        kind = 'toggle'
      } else {
        kind = 'bullet'
      }

      return { kind: kind }
    })

  const toggleChecked = () => {
    commands.wrapInList((range) => {
      const { parent, startIndex, endIndex } = range
      if (endIndex - startIndex === 1) {
        const listNode = parent.child(startIndex)
        if (isListNode(listNode)) {
          const attrs = listNode.attrs as ListAttributes
          if (attrs.kind === 'task') {
            return { checked: !attrs.checked }
          }
        }
      }
      return null
    })
  }

  const toggleCollapsed = () => {
    commands.wrapInList((range) => {
      const { parent, startIndex, endIndex } = range
      if (endIndex - startIndex === 1) {
        const listNode = parent.child(startIndex)
        if (isListNode(listNode)) {
          const attrs = listNode.attrs as ListAttributes
          if (attrs.kind === 'toggle') {
            return { collapsed: !attrs.collapsed }
          }
        }
      }
      return null
    })
  }

  const moveUp = () => commands.moveList('up')
  const moveDown = () => commands.moveList('down')

  return (
    <>
      <Button onClick={indentList}>Increase list indentation</Button>

      <Button onClick={dedentList}>Decrease list indentation</Button>

      <Button onClick={wrapInBulletList}>Wrap in bullet list</Button>

      <Button onClick={wrapInOrderedList}>Wrap in ordered list</Button>

      <Button onClick={wrapInTaskList}>Wrap in task list</Button>

      <Button onClick={wrapInToggleList}>Wrap in toggle list</Button>

      <Button onClick={changeListKind}>Change list kind</Button>

      <Button onClick={toggleChecked}>Toggle attribute checked</Button>

      <Button onClick={toggleCollapsed}>Toggle attribute collapsed</Button>

      <Button onClick={moveUp}>Move up</Button>

      <Button onClick={moveDown}>Move Down</Button>
    </>
  )
}

const Editor = (): JSX.Element => {
  const { manager, state } = useRemirror({
    extensions,
    content,
    stringHandler: 'html',
  })

  useEffect(() => {
    const view = manager.view
    // @ts-expect-error this is for debugging
    window._view = view
  }, [])

  return (
    <ThemeProvider>
      <Remirror manager={manager} initialContent={state}>
        <ButtonGroup />
        <EditorComponent />
      </Remirror>
    </ThemeProvider>
  )
}

const extensions = () => [
  new ListExtension(),
  new HeadingExtension(),
  new LinkExtension(),
  /**
   * `HardBreakExtension` allows us to create a newline inside paragraphs.
   *  e.g. in a list item
   */
  new HardBreakExtension(),
  new BlockquoteExtension(),
]

const html = String.raw // Just for better editor support

const content = html`
  <ul>
    <li>first unordered list item</li>
    <li>second unordered list item</li>
  </ul>
  <ol>
    <li>first ordered list item</li>
    <li>second ordered list item</li>
  </ol>
  <ul data-task-list>
    <li data-task-list-item>first task list item</li>
    <li data-task-list-item data-checked>second task list item</li>
  </ul>

  <ul data-toggle-list>
    <li data-toggle-list-item>empty toggle list item</li>
    <li data-toggle-list-item>
      expanded toggle list item
      <ul>
        <li>sub list item</li>
        <li>sub list item</li>
        <li>
          sub list item

          <ul data-task-list>
            <li data-task-list-item>
              list with multiple paragraphs
              <p>paragraph</p>
              <p>paragraph</p>
            </li>
          </ul>

          <ul data-task-list>
            <li data-task-list-item>
              list with multiple paragraphs
              <p>paragraph</p>
              <p>paragraph</p>
            </li>
          </ul>
        </li>
      </ul>
    </li>
    <li data-toggle-list-item data-list-collapsed>
      collapsed toggle list item
      <ul>
        <li>sub list item</li>
        <li>sub list item</li>
        <li>sub list item</li>
        <li>sub list item</li>
      </ul>
    </li>
  </ul>

  <h2>Nested bullet list:</h2>

  <ul>
    <li>A</li>
    <li>B</li>
    <li>
      C
      <ul>
        <li>C.A</li>
        <li>
          C.B
          <ul>
            <li>C.B.A</li>
            <li>C.B.B</li>
            <li>C.B.C</li>
          </ul>
        </li>
        <li>C.C</li>
      </ul>
    </li>
  </ul>

  <h2>Nested ordered list:</h2>

  <ol>
    <li>A</li>
    <li>B</li>
    <li>
      C
      <ol>
        <li>C.A</li>
        <li>
          C.B
          <ol>
            <li>C.B.A</li>
            <li>C.B.B</li>
            <li>C.B.C</li>
          </ol>
        </li>
        <li>C.C</li>
      </ol>
    </li>
  </ol>

  <h2>Nested task list:</h2>

  <ul data-task-list>
    <li data-task-list-item data-checked>A</li>
    <li data-task-list-item>B</li>
    <li data-task-list-item data-checked>
      C
      <ul data-checked data-task-list>
        <li data-task-list-item>C.A</li>
        <li data-task-list-item>
          C.B
          <ul data-task-list>
            <li data-task-list-item data-checked>C.B.A</li>
            <li data-task-list-item data-checked>C.B.B</li>
            <li data-task-list-item>C.B.C</li>
          </ul>
        </li>
        <li>C.C</li>
      </ul>
    </li>
  </ul>

  <h2>Nested mixed list:</h2>

  <ul>
    <li>A</li>
    <li>B</li>
    <li>
      C
      <ul data-task-list>
        <li data-task-list-item>C.A</li>
        <li data-task-list-item data-checked>
          C.B
          <ol>
            <li>C.B.A</li>
            <li>C.B.B</li>
            <li>C.B.C</li>
          </ol>
        </li>
        <li data-task-list-item data-checked>C.C</li>
      </ul>
    </li>
  </ul>

  <h2>Ordered list with custom counter number</h2>

  <ol>
    <li data-list-order="42">The counter number should be 42</li>
    <li>The counter number should be 43</li>
  </ol>
`

export { Editor }
