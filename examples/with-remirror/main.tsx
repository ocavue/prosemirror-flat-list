import React from 'react'
import ReactDOM from 'react-dom/client'

import { Editor } from './editor'

function main() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <h1>ProseMirror Flat List</h1>

      <p>
        GitHub:
        <a href="https://github.com/ocavue/prosemirror-flat-list">
          https://github.com/ocavue/prosemirror-flat-list
        </a>
      </p>

      <Editor />
    </React.StrictMode>,
  )
}

main()
