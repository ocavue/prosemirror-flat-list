export type ListType = 'bullet' | 'ordered' | 'task' | 'toggle'

export interface ListAttributes {
  type?: ListType
  order?: number | null
  checked?: boolean
  collapsed?: boolean
}
