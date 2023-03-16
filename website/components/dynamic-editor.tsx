import '@remirror/styles/all.css'
import 'prosemirror-flat-list/style.css'

import dynamic from 'next/dynamic'
import React from 'react'
import { EditorPlaceholder } from './editor-placeholder'

export const DynamicEditor = dynamic(
  import('./editor').then((module) => module.Editor),
  {
    loading: () => <EditorPlaceholder />,
    ssr: false,
  },
)
