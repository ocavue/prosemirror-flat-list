import { NodeType } from 'prosemirror-model'
import { getListType } from './get-list-type'

export function isListType(type: NodeType): boolean {
  return getListType(type.schema) === type
}
