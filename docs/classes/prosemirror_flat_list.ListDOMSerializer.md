# Class: ListDOMSerializer

[prosemirror-flat-list](../modules/prosemirror_flat_list.md).ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

## Hierarchy

- [`DOMSerializer`]( https://prosemirror.net/docs/ref/#model.DOMSerializer )

  ↳ **`ListDOMSerializer`**

## Table of contents

### Constructors

- [constructor](prosemirror_flat_list.ListDOMSerializer.md#constructor)

### Methods

- [serializeFragment](prosemirror_flat_list.ListDOMSerializer.md#serializefragment)
- [fromSchema](prosemirror_flat_list.ListDOMSerializer.md#fromschema)
- [nodesFromSchema](prosemirror_flat_list.ListDOMSerializer.md#nodesfromschema)

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

## Methods

### serializeFragment

▸ **serializeFragment**(`fragment`, `options?`, `target?`): [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment )

#### Parameters

| Name | Type |
| :------ | :------ |
| `fragment` | [`Fragment`]( https://prosemirror.net/docs/ref/#model.Fragment ) |
| `options?` | `Object` |
| `options.document?` | [`Document`]( https://developer.mozilla.org/en-US/docs/Web/API/Document ) |
| `target?` | [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment ) |

#### Returns

[`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment )

#### Overrides

DOMSerializer.serializeFragment

___

### fromSchema

▸ `Static` **fromSchema**(`schema`): [`ListDOMSerializer`](prosemirror_flat_list.ListDOMSerializer.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )<`any`, `any`\> |

#### Returns

[`ListDOMSerializer`](prosemirror_flat_list.ListDOMSerializer.md)

#### Overrides

DOMSerializer.fromSchema

___

### nodesFromSchema

▸ `Static` **nodesFromSchema**(`schema`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )<`any`, `any`\> |

#### Returns

`Object`

#### Overrides

DOMSerializer.nodesFromSchema
