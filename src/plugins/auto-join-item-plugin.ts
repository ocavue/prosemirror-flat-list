import { ProsemirrorNode, Transaction } from '@remirror/core'
import { autoJoin } from '@remirror/pm/commands'
import { NodeType } from '@remirror/pm/model'
import { Command, Plugin, PluginKey } from '@remirror/pm/state'
import { canJoin } from '@remirror/pm/transform'

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

export function appendTransaction(
  transactions: readonly Transaction[],
  newTr: Transaction,
  listType: NodeType,
): Transaction | null {
  const newDoc = transactions[transactions.length - 1]?.doc
  if (!newDoc) return null

  const ranges: number[] = []

  for (const tr of transactions) {
    if (!tr.isGeneric) {
      return null
    }

    for (const map of tr.mapping.maps) {
      for (let i = 0; i < ranges.length; i++) {
        ranges[i] = map.map(ranges[i])
      }

      map.forEach((_oldStart, _oldEnd, newStart, newEnd) =>
        ranges.push(newStart, newEnd),
      )
    }
  }

  const rangeMap = new Map<number, number>()

  for (let i = 0; i < ranges.length; i += 2) {
    rangeMap.set(ranges[i], ranges[i + 1])
  }

  // Add all node boundaries to the range map
  for (const pos of ranges) {
    const $pos = newDoc.resolve(pos)

    for (let depth = $pos.depth; depth >= 1; depth--) {
      const before = $pos.before(depth)
      const after = $pos.after(depth)

      if ((rangeMap.get(before) || -1) >= after) {
        break
      }

      rangeMap.set(before, after)
    }
  }

  // Figure out which joinable points exist inside those ranges,
  // by checking all node boundaries in their parent nodes.
  const joinDpeths: Map<number, number> = new Map()

  for (const [from, to] of rangeMap.entries()) {
    const $from = newDoc.resolve(from)

    const depth = $from.sharedDepth(to)

    const parent = $from.node(depth)

    for (
      let index = $from.indexAfter(depth), pos = $from.after(depth + 1);
      pos <= to;
      ++index
    ) {
      const after = parent.maybeChild(index)

      if (!after) {
        break
      }

      if (index && !joinDpeths.has(pos)) {
        const before = parent.child(index - 1)

        if (before.type === after.type) {
          const joinDepth = isListJoinable(before, after, listType)

          if (joinDepth) {
            joinDpeths.set(pos, joinDepth)
          }
        }
      }

      pos += after.nodeSize
    }
  }

  // Join the joinable points
  let joint = false
  const tr = newTr

  for (let [pos, joinDepth] of [...joinDpeths.entries()].sort()) {
    while (joinDepth) {
      if (!canJoin(tr.doc, pos)) {
        break
      }

      tr.join(pos)
      joint = true
      joinDepth--
      pos = tr.mapping.map(pos)
    }
  }

  return joint ? tr : null
}

// TODO: remove this plugin
export function createAutoJoinItemPlugin(listType: NodeType): Plugin {
  return new Plugin({
    key: new PluginKey('auto-join-item'),
    appendTransaction: (tr, oldState, newState) => {
      return appendTransaction(tr, newState.tr, listType)
    },
  })
}

function isListJoinable(
  before: ProsemirrorNode | null,
  after: ProsemirrorNode | null,
  listType: NodeType,
): number {
  let joinDepth = 0

  while (
    before?.type === listType &&
    after?.type === listType &&
    after?.firstChild?.type === listType
  ) {
    joinDepth++
    before = before.lastChild
    after = after.firstChild
  }

  return joinDepth
}
