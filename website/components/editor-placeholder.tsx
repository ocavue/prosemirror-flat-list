import { ThemeProvider } from '@remirror/react'
import type { FC } from 'react'
import React from 'react'

export const EditorPlaceholder: FC = () => {
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
