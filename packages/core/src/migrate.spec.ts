import { createTestEditor } from '@prosekit/core/test'
import { describe, expect, it } from 'vitest'

import { defineListTestExtension } from '../test/extension'

import { migrateDocJSON } from './migrate'

describe('migrateDocJSON', () => {
  const editor = createTestEditor({ extension: defineListTestExtension() })
  const schema = editor.schema

  const checkJSON = (json: unknown) => {
    const node = schema.nodeFromJSON(json)
    node.check()
  }

  it('can migrate document JSON', () => {
    const input = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Hello world',
            },
          ],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              attrs: {
                closed: false,
                nested: false,
              },
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Hello',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
        },
      ],
    }

    const output = migrateDocJSON(input)
    checkJSON(output)
    expect(output).toMatchInlineSnapshot(`
      {
        "content": [
          {
            "attrs": {
              "level": 1,
            },
            "content": [
              {
                "text": "Hello world",
                "type": "text",
              },
            ],
            "type": "heading",
          },
          {
            "attrs": {
              "closed": false,
              "collapsed": false,
              "kind": "bullet",
              "nested": false,
            },
            "content": [
              {
                "content": [
                  {
                    "text": "Hello",
                    "type": "text",
                  },
                ],
                "type": "paragraph",
              },
            ],
            "type": "list",
          },
          {
            "type": "paragraph",
          },
        ],
        "type": "doc",
      }
    `)

    const output2 = migrateDocJSON(output!)
    expect(output2).toBe(null)
  })
})
