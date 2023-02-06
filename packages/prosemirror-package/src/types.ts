export type ListType = 'bullet' | 'ordered' | 'task' | 'toggle'

export interface ListAttributes {
  type?: ListType
  order?: number | null
  checked?: boolean
  collapsed?: boolean
}

/**
 * All the literal types
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
 */
export interface ObjectMark {
  type: string
  attrs?: Record<string, Literal>
}

export interface ProsemirrorNodeJSON {
  type: string
  marks?: Array<ObjectMark | string>
  text?: string
  content?: ProsemirrorNodeJSON[]
  attrs?: Record<string, Literal>
}
