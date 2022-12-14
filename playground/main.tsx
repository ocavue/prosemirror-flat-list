import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { Editor } from './editor'

function main() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Editor />
    </React.StrictMode>
  )
}

main()
