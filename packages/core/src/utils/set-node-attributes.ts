import type { Attrs } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'

export function setNodeAttributes(
  tr: Transaction,
  pos: number,
  oldAttrs: Attrs,
  newAttrs: Attrs,
): boolean {
  let needUpdate = false
  for (const [key, newValue] of Object.entries(newAttrs)) {
    if (newValue !== oldAttrs[key]) {
      tr.setNodeAttribute(pos, key, newValue)
      needUpdate = true
    }
  }
  return needUpdate
}
