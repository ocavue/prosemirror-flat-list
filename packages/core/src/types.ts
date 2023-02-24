/** @public */
export type ListKind = 'bullet' | 'ordered' | 'task' | 'toggle'

/** @public */
export interface ListAttributes {
  kind?: ListKind
  order?: number | null
  checked?: boolean
  collapsed?: boolean
}

/**
 * All the literal types
 *
 * @public
 */
export declare type Literal =
  | string
  | number
  | boolean
  | undefined
  | null
  | void
  | object

/**
 * A JSON representation of a prosemirror Mark.
 *
 * @public
 */
export interface ObjectMark {
  type: string
  attrs?: Record<string, Literal>
}

/** @public */
export interface ProsemirrorNodeJSON {
  type: string
  marks?: Array<ObjectMark | string>
  text?: string
  content?: ProsemirrorNodeJSON[]
  attrs?: Record<string, Literal>
}
