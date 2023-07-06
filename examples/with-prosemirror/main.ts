import './style.css'

import { exampleSetup } from 'prosemirror-example-setup'
import {
  createListPlugins,
  createListSpec,
  listInputRules,
  listKeymap,
} from 'prosemirror-flat-list'
import { inputRules } from 'prosemirror-inputrules'
import { keymap } from 'prosemirror-keymap'
import { DOMParser, Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'


const schema = new Schema({
  nodes: basicSchema.spec.nodes.append({ list: createListSpec() }),
  marks: basicSchema.spec.marks,
})

const listKeymapPlugin = keymap(listKeymap)
const listInputRulePlugin = inputRules({ rules: listInputRules })
const listPlugins = createListPlugins({ schema })

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

;(window as any)._view = view
