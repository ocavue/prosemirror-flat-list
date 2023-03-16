import { ThemeProvider } from '@remirror/react'
import React, { FC } from 'react'

export const EditorPlaceholder: FC = () => {
  return (
    <ThemeProvider>
      <div className="remirror-editor-wrapper">
        <div className="ProseMirror remirror-editor" />
      </div>
    </ThemeProvider>
  )
}
