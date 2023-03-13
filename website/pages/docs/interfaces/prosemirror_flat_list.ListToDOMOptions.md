# ListToDOMOptions

[prosemirror-flat-list](../modules/prosemirror_flat_list.md).ListToDOMOptions

## Properties

### getAttributes

 `Optional` **getAttributes**: (`node`: [`Node`]( https://prosemirror.net/docs/ref/#model.Node )) => `Record`<`string`, `undefined` \| `string`\>

#### Type declaration

(`node`): `Record`<`string`, `undefined` \| `string`\>

An optional function to get the attributes added to HTML element.

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

##### Returns

`Record`<`string`, `undefined` \| `string`\>

___

### getMarkers

 `Optional` **getMarkers**: (`node`: [`Node`]( https://prosemirror.net/docs/ref/#model.Node )) => ``null`` \| [`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )[]

#### Type declaration

(`node`): ``null`` \| [`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )[]

An optional function to get elements inside `<div class="list-marker">`.
Return `null` to hide the marker.

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

##### Returns

``null`` \| [`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )[]

___

### nativeList

 `Optional` **nativeList**: `boolean`

If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.
You might want to use [joinListElements](../modules/prosemirror_flat_list.md#joinlistelements) to join the list elements
afterward.

**`Default Value`**

false

___

### node

 **node**: [`Node`]( https://prosemirror.net/docs/ref/#model.Node )

The list node to be rendered.
