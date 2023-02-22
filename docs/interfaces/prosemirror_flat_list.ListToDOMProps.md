[prosemirror-flat-list-monorepo](../README.md) / [Modules](../modules.md) / [prosemirror-flat-list](../modules/prosemirror_flat_list.md) / ListToDOMProps

# Interface: ListToDOMProps

[prosemirror-flat-list](../modules/prosemirror_flat_list.md).ListToDOMProps

## Table of contents

### Properties

- [getAttributes](prosemirror_flat_list.ListToDOMProps.md#getattributes)
- [getMarkers](prosemirror_flat_list.ListToDOMProps.md#getmarkers)
- [nativeList](prosemirror_flat_list.ListToDOMProps.md#nativelist)
- [node](prosemirror_flat_list.ListToDOMProps.md#node)

## Properties

### getAttributes

• `Optional` **getAttributes**: (`node`: `Node`) => `Record`<`string`, `undefined` \| `string`\>

#### Type declaration

▸ (`node`): `Record`<`string`, `undefined` \| `string`\>

An optional function to get the attributes added to HTML element.

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

##### Returns

`Record`<`string`, `undefined` \| `string`\>

___

### getMarkers

• `Optional` **getMarkers**: (`node`: `Node`) => ``null`` \| `DOMOutputSpec`[]

#### Type declaration

▸ (`node`): ``null`` \| `DOMOutputSpec`[]

An optional function to get elements inside `<div class="list-marker">`.
Return `null` to hide the marker.

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

##### Returns

``null`` \| `DOMOutputSpec`[]

___

### nativeList

• `Optional` **nativeList**: `boolean`

If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.
You might want to use [joinListElements](../modules/prosemirror_flat_list.md#joinlistelements) to join the list elements
afterward.

**`Default Value`**

false

___

### node

• **node**: `Node`

The list node to be rendered.
