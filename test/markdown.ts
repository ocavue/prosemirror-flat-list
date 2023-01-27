import {
  AnyExtension,
  Fragment,
  htmlToProsemirrorNode,
  isProsemirrorNode,
  ProsemirrorNode,
} from '@remirror/core'
import dedent from 'dedent'
import {
  RemirrorTestChain,
  TaggedContentWithText,
  TaggedProsemirrorNode,
} from 'jest-remirror'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified, type Processor } from 'unified'

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
}

let processor: Processor | null = null

function markdownToHtml(markdown: string): string {
  if (!processor) {
    processor = createProcessor()
  }
  return String(processor.processSync(markdown))
}

function textNodeToTaggedTextNode(
  t: RemirrorTestChain<AnyExtension>,
  node: ProsemirrorNode,
): TaggedContentWithText {
  let tagged: TaggedContentWithText = node.text!
  if (node.marks?.length) {
    for (const mark of node.marks) {
      const withMark = t.attributeMarks[mark.type.name](mark.attrs)(tagged)
      if (withMark.length !== 1) {
        throw new Error('Unexpected length')
      }
      tagged = withMark[0]
    }
  }
  return tagged
}

function fragmentToArray(fragment: Fragment) {
  const content = []
  for (let i = 0; i < fragment.childCount; i++) {
    content.push(fragment.child(i))
  }
  return content
}

function nodeToTaggedNode(
  t: RemirrorTestChain<AnyExtension>,
  node: ProsemirrorNode,
): TaggedContentWithText {
  if (node.isText) {
    return textNodeToTaggedTextNode(t, node)
  }
  const content = fragmentToArray(node.content).map((node) =>
    nodeToTaggedNode(t, node),
  )
  return t.attributeNodes[node.type.name](node.attrs)(...content)
}

function docToTaggedDoc(
  t: RemirrorTestChain<AnyExtension>,
  doc: ProsemirrorNode,
): TaggedProsemirrorNode {
  const taggedDoc = nodeToTaggedNode(t, doc)
  if (!isProsemirrorNode(taggedDoc)) {
    throw new Error('Unexpected tagged doc type')
  }
  return taggedDoc
}

export function markdownToTaggedDoc(
  t: RemirrorTestChain<any>,
  markdown: string,
): TaggedProsemirrorNode {
  markdown = dedent(markdown).replaceAll('<', '\\<').replaceAll('>', '\\>')
  const html = markdownToHtml(markdown)
  const doc = htmlToProsemirrorNode({ content: html, schema: t.schema })
  return docToTaggedDoc(t, doc)
}
