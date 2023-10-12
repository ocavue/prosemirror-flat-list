import type { Attrs, Node } from 'prosemirror-model'

/**
 * All default list node kinds.
 *
 * @public @group Schema
 */
export type ListKind = 'bullet' | 'ordered' | 'task' | 'toggle'

/** @public */
export interface ListAttributes {
  kind?: ListKind
  order?: number | null
  checked?: boolean
  collapsed?: boolean
}

/** @public */
export interface ProsemirrorNodeJSON {
  type: string
  marks?: Array<{ type: string; attrs?: Attrs } | string>
  text?: string
  content?: ProsemirrorNodeJSON[]
  attrs?: Attrs
}

export type { Node as ProsemirrorNode }
