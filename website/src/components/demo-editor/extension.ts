import { union } from '@prosekit/core'
import { defineBasicExtension } from 'prosekit/basic'

export function defineExtension() {
  return union([defineBasicExtension()])
}

export type EditorExtension = ReturnType<typeof defineExtension>
