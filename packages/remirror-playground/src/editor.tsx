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
import { useEffect, FC, PropsWithChildren } from 'react'
import {
  ListAttributes,
  ListExtension,
  ListType,
  isListNode,
} from 'remirror-extension-flat-list'

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
  const wrapInBulletList = () => commands.wrapInList({ type: 'bullet' })
  const wrapInOrderedList = () => commands.wrapInList({ type: 'ordered' })
  const wrapInTaskList = () => commands.wrapInList({ type: 'task' })
  const wrapInToggleList = () => commands.wrapInList({ type: 'toggle' })
  const changeListType = () =>
    commands.wrapInList((range) => {
      const attrs = range.parent.child(range.startIndex).attrs as ListAttributes

      let type: ListType

      if (attrs.type === 'bullet') {
        type = 'ordered'
      } else if (attrs.type === 'ordered') {
        type = 'task'
      } else if (attrs.type === 'task') {
        type = 'toggle'
      } else {
        type = 'bullet'
      }

      return { type }
    })

  const toggleChecked = () => {
    commands.wrapInList((range) => {
      const { parent, startIndex, endIndex } = range
      if (endIndex - startIndex === 1) {
        const listNode = parent.child(startIndex)
        if (isListNode(listNode)) {
          const attrs = listNode.attrs as ListAttributes
          if (attrs.type === 'task') {
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
          if (attrs.type === 'toggle') {
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

      <Button onClick={changeListType}>Change list type</Button>

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
    <li>
      <p>A</p>
      <ul>
        <li>B</li>
      </ul>
    </li>
  </ul>
`

export { Editor }
