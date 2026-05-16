import {
  type MarkAction,
  type NodeAction,
  type NodeChild,
  nodeFromHTML,
} from '@prosekit/core'
import { extractSelection } from '@prosekit/core/test'
import type { ProseMirrorNode, Schema } from '@prosekit/pm/model'
import type { Selection } from '@prosekit/pm/state'
import dedent from 'dedent'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { expect } from 'vitest'

export { extractSelection }

const SELECTION_TAGS = ['a', 'b'] as const

let processor: ReturnType<typeof createProcessor> | null = null

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
}

function markdownToHtml(markdown: string): string {
  processor ??= createProcessor()
  return String(processor.processSync(markdown))
}

function rebuildThroughActions(
  node: ProseMirrorNode,
  nodes: Record<string, NodeAction>,
  marks: Record<string, MarkAction>,
): NodeChild {
  if (node.isText) {
    const text = node.text ?? ''
    if (node.marks.length === 0) return text
    let result: NodeChild = text
    for (const mark of node.marks) {
      result = marks[mark.type.name](mark.attrs, result)
    }
    return result
  }

  const builder = nodes[node.type.name]
  if (!builder) {
    throw new Error(`No test-editor builder for node type "${node.type.name}"`)
  }
  const children: NodeChild[] = []
  node.content.forEach((child) => {
    children.push(rebuildThroughActions(child, nodes, marks))
  })
  return builder(node.attrs, ...children)
}

export function markdownToTaggedDoc(
  schema: Schema,
  nodes: Record<string, NodeAction>,
  marks: Record<string, MarkAction>,
  markdown: string,
): ProseMirrorNode {
  let src = dedent(markdown)
  for (const tag of SELECTION_TAGS) {
    src = src.replaceAll(`<${tag}>`, String.raw`\<${tag}\>`)
  }
  const html = markdownToHtml(src)
  const plain = nodeFromHTML(html, { schema })
  const rebuilt = rebuildThroughActions(plain, nodes, marks)
  if (typeof rebuilt === 'string' || Array.isArray(rebuilt)) {
    throw new TypeError(
      'Expected the top-level rebuild to return a single node',
    )
  }
  return rebuilt
}

export function expectStateToEqual(
  state: { doc: ProseMirrorNode; selection: Selection },
  expected: ProseMirrorNode,
): void {
  expect(state.doc.toJSON()).toEqual(expected.toJSON())
  const expectedSelection = extractSelection(expected)
  if (expectedSelection) {
    expect(state.selection.toJSON()).toEqual(expectedSelection.toJSON())
  }
}
