[prosemirror-flat-list-monorepo](../README.md) / [Modules](../modules.md) / [remirror-extension-flat-list](../modules/remirror_extension_flat_list.md) / ListDOMSerializer

# Class: ListDOMSerializer

[remirror-extension-flat-list](../modules/remirror_extension_flat_list.md).ListDOMSerializer

## Hierarchy

- `DOMSerializer`

  ↳ **`ListDOMSerializer`**

## Table of contents

### Constructors

- [constructor](remirror_extension_flat_list.ListDOMSerializer.md#constructor)

### Properties

- [marks](remirror_extension_flat_list.ListDOMSerializer.md#marks)
- [nodes](remirror_extension_flat_list.ListDOMSerializer.md#nodes)

### Methods

- [serializeFragment](remirror_extension_flat_list.ListDOMSerializer.md#serializefragment)
- [serializeNode](remirror_extension_flat_list.ListDOMSerializer.md#serializenode)
- [fromSchema](remirror_extension_flat_list.ListDOMSerializer.md#fromschema)
- [marksFromSchema](remirror_extension_flat_list.ListDOMSerializer.md#marksfromschema)
- [nodesFromSchema](remirror_extension_flat_list.ListDOMSerializer.md#nodesfromschema)
- [renderSpec](remirror_extension_flat_list.ListDOMSerializer.md#renderspec)

## Constructors

### constructor

• **new ListDOMSerializer**(`nodes`, `marks`)

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | `Object` | The node serialization functions. |
| `marks` | `Object` | The mark serialization functions. |

#### Inherited from

DOMSerializer.constructor

## Properties

### marks

• `Readonly` **marks**: `Object`

The mark serialization functions.

#### Index signature

▪ [mark: `string`]: (`mark`: `Mark`, `inline`: `boolean`) => `DOMOutputSpec`

#### Inherited from

DOMSerializer.marks

___

### nodes

• `Readonly` **nodes**: `Object`

The node serialization functions.

#### Index signature

▪ [node: `string`]: (`node`: `Node`) => `DOMOutputSpec`

#### Inherited from

DOMSerializer.nodes

## Methods

### serializeFragment

▸ **serializeFragment**(`fragment`, `options?`, `target?`): `HTMLElement` \| `DocumentFragment`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fragment` | `Fragment` |
| `options?` | `Object` |
| `options.document?` | `Document` |
| `target?` | `HTMLElement` \| `DocumentFragment` |

#### Returns

`HTMLElement` \| `DocumentFragment`

#### Overrides

DOMSerializer.serializeFragment

___

### serializeNode

▸ **serializeNode**(`node`, `options?`): `Node`

Serialize this node to a DOM node. This can be useful when you
need to serialize a part of a document, as opposed to the whole
document. To serialize a whole document, use
[`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
its [content](https://prosemirror.net/docs/ref/#model.Node.content).

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |
| `options?` | `Object` |
| `options.document?` | `Document` |

#### Returns

`Node`

#### Inherited from

DOMSerializer.serializeNode

___

### fromSchema

▸ `Static` **fromSchema**(`schema`): `DOMSerializer`

Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
properties in a schema's node and mark specs.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`DOMSerializer`

#### Inherited from

DOMSerializer.fromSchema

___

### marksFromSchema

▸ `Static` **marksFromSchema**(`schema`): `Object`

Gather the serializers in a schema's mark specs into an object.

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`Object`

#### Inherited from

DOMSerializer.marksFromSchema

___

### nodesFromSchema

▸ `Static` **nodesFromSchema**(`schema`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`Object`

#### Overrides

DOMSerializer.nodesFromSchema

___

### renderSpec

▸ `Static` **renderSpec**(`doc`, `structure`, `xmlNS?`): `Object`

Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
the spec has a hole (zero) in it, `contentDOM` will point at the
node with the hole.

#### Parameters

| Name | Type |
| :------ | :------ |
| `doc` | `Document` |
| `structure` | `DOMOutputSpec` |
| `xmlNS?` | ``null`` \| `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `contentDOM?` | `HTMLElement` |
| `dom` | `Node` |

#### Inherited from

DOMSerializer.renderSpec
