import { ThemeProvider } from '@remirror/react'
import React from 'react'

export const EditorPlaceholder: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="remirror-editor-wrapper">
        <div className="ProseMirror remirror-editor">
          <div>Loading...</div>
        </div>
      </div>
    </ThemeProvider>
  )
}
