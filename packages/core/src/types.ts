import type { Attrs, Node } from 'prosemirror-model'

declare module 'prosemirror-model' {
  interface AttributeSpec {
    /**
     * When `true`, a new list node created by splitting an existing one (e.g.
     * by pressing `Enter`) inherits this attribute from the node being split.
     * This follows the same convention as the `prosemirror-splittable`
     * package.
     */
    splittable?: boolean
  }
}

/**
 * All default list node kinds.
 *
 * @public @group Schema
 */
export type ListKind = 'bullet' | 'ordered' | 'task' | 'toggle'

/**
 * @public @group Schema
 */
export interface ListAttributes {
  kind?: string
  order?: number | null
  checked?: boolean
  collapsed?: boolean
}

/**
 * @public @group Schema
 */
export interface ProsemirrorNodeJSON {
  type: string
  marks?: Array<{ type: string; attrs?: Attrs } | string>
  text?: string
  content?: ProsemirrorNodeJSON[]
  attrs?: Attrs
}

export type { Node as ProsemirrorNode }
