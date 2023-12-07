import './style.css'

import { exampleSetup } from 'prosemirror-example-setup'
import {
  ListAttributes,
  ListToDOMOptions,
  ProsemirrorNode,
  createListClipboardPlugin,
  createListRenderingPlugin,
  createListSpec,
  createSafariInputMethodWorkaroundPlugin,
  defaultListClickHandler,
  handleListMarkerMouseDown,
  listInputRules,
  listKeymap,
  listToDOM,
} from 'prosemirror-flat-list'
import { inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

const schema = new Schema({
  nodes: basicSchema.spec.nodes.append({ list: customCreateListSpec() }),
  marks: basicSchema.spec.marks,
})

const listKeymapPlugin = keymap(listKeymap)
const listInputRulePlugin = inputRules({ rules: listInputRules })
const listPlugins = customCreateListPlugins({ schema })

const view = new EditorView(document.querySelector('#editor'), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(
      document.querySelector('#content')!,
    ),
    plugins: [
      listKeymapPlugin,
      listInputRulePlugin,
      ...listPlugins,
      ...exampleSetup({ schema }),
    ],
  }),
})

function customCreateListPlugins({ schema }: { schema: Schema }) {
  return [
    customCreateListEventPlugin(),
    createListRenderingPlugin(),
    createListClipboardPlugin(schema),
    createSafariInputMethodWorkaroundPlugin(),
  ]
}

function customCreateListEventPlugin() {
  return new Plugin({
    props: {
      handleDOMEvents: {
        mousedown: (view, event) =>
          handleListMarkerMouseDown({
            view,
            event,
            onListClick: customListClickHandler,
          }),
      },
    },
  })
}

function customListClickHandler(node: ProsemirrorNode) {
  const attrs = node.attrs as ListAttributes
  if (attrs.kind !== 'ordered') {
    return defaultListClickHandler(node)
  }

  const collapsable = node.childCount >= 2
  const collapsed = collapsable ? !attrs.collapsed : false
  return { ...attrs, collapsed }
}

function customCreateListSpec() {
  const spec = createListSpec()
  spec.toDOM = (node) => {
    return customListToDOM({ node })
  }
  return spec
}

function customListToDOM(options: ListToDOMOptions) {
  if (options.nativeList) {
    return listToDOM(options)
  }

  const attrs = options.node.attrs as ListAttributes
  if (attrs.kind !== 'ordered') {
    return listToDOM(options)
  }

  return listToDOM({
    ...options,
    getMarkers: () => {
      // Return an empty array to render an empty marker container element.
      return []
    },
  })
}

;(window as any)._view = view
