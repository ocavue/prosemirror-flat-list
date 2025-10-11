import { lazy } from 'preact/compat'

const Editor = lazy(() => import('./editor'))

export default function LazyEditor() {
  return <Editor />
}
