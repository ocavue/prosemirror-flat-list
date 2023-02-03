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
  useRemirror,
} from '@remirror/react'
import * as React from 'react'
import { useEffect } from 'react'
import { ListExtension } from 'remirror-extension-flat-list'

const Button = (): JSX.Element => {
  // const commands = useCommands();

  return (
    <>
      {/* <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.toggleTaskList()}
      >
        toggleTaskList
      </button>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.toggleBulletList()}
      >
        toggleBulletList
      </button>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.toggleOrderedList()}
      >
        toggleOrderedList
      </button>
      <button
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => commands.liftListItemOutOfList()}
      >
        liftListItemOutOfList
      </button> */}
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
        <Button />
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
  <h1>
    <code>Remirror Flat List</code>
  </h1>

  <ul>
    <li>
      <p>A1</p>
      <ul>
        <li>
          <p>B1</p>
          <ul>
            <li>
              <p>C1</p>
              <p>C1</p>
            </li>
          </ul>
          <p>B1</p>
        </li>
        <li>
          <p>B2</p>
          <ul>
            <li>
              <p>C2</p>
              <p>C2</p>
            </li>
          </ul>
          <p>B2</p>
        </li>

        <li>
          <p>B3</p>
        </li>
      </ul>
    </li>
  </ul>

  <h1></h1>

  <ul>
    <li>
      <p>A1</p>
    </li>
    <li>
      <p>A2</p>
    </li>
    <li>
      A3
      <ul>
        <li>
          <p>B1</p>
        </li>
        <li>
          B2
          <ul>
            <li>
              <p>C1</p>
            </li>
            <li>
              <p>C2</p>
            </li>
          </ul>
        </li>
        <li>
          <p>B3</p>
          <p>B3</p>
        </li>
        <li>
          B4
          <ul>
            <li>
              <p>C3</p>
            </li>
            <li>
              <p>C4</p>
            </li>
          </ul>
        </li>
        <li>
          <p>B5</p>
        </li>
      </ul>
    </li>
    <li>
      <p>A4</p>
    </li>
  </ul>

  <h1>
    <code>For test</code>
  </h1>

  <p>
    <a href="https://github.com/ocavue/remirror-extension-flat-list"
      >https://github.com/ocavue/remirror-extension-flat-list</a
    >
  </p>

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
`

export { Editor }
