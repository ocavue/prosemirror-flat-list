import { NodeType } from '@remirror/pm/model'
import { getListType } from './get-list-type'

export function isListType(type: NodeType): boolean {
  return getListType(type.schema) === type
}
