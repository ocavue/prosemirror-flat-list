import { ProsemirrorNode } from '@remirror/core'
import { autoJoin } from '@remirror/pm/commands'
import { NodeType } from '@remirror/pm/model'
import { Command } from '@remirror/pm/state'

/**
 * Wrap a command so that it can join two adjacent lists when necessary.
 */
export function autoJoinList(command: Command, listType: NodeType): Command {
  const isListJoinable = (before: ProsemirrorNode, after: ProsemirrorNode) => {
    return (
      before.type === listType &&
      after.type === listType &&
      after.firstChild?.type === listType
    )
  }
  return autoJoin(command, isListJoinable)
}
