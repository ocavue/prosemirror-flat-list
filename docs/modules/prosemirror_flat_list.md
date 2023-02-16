[prosemirror-flat-list-monorepo](../README.md) / [Modules](../modules.md) / prosemirror-flat-list

# Module: prosemirror-flat-list

## Table of contents

### Classes

- [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md)

### Interfaces

- [ListAttributes](../interfaces/prosemirror_flat_list.ListAttributes.md)
- [ObjectMark](../interfaces/prosemirror_flat_list.ObjectMark.md)
- [ProsemirrorNodeJSON](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)

### Type Aliases

- [ListClickHandler](prosemirror_flat_list.md#listclickhandler)
- [ListType](prosemirror_flat_list.md#listtype)
- [Literal](prosemirror_flat_list.md#literal)
- [MarkerToDOM](prosemirror_flat_list.md#markertodom)

### Variables

- [flatListGroup](prosemirror_flat_list.md#flatlistgroup)

### Functions

- [alwaysTrue](prosemirror_flat_list.md#alwaystrue)
- [createDedentListCommand](prosemirror_flat_list.md#creatededentlistcommand)
- [createIndentListCommand](prosemirror_flat_list.md#createindentlistcommand)
- [createListInputRules](prosemirror_flat_list.md#createlistinputrules)
- [createListNodeView](prosemirror_flat_list.md#createlistnodeview)
- [createListPlugin](prosemirror_flat_list.md#createlistplugin)
- [createListSpec](prosemirror_flat_list.md#createlistspec)
- [createMoveListCommand](prosemirror_flat_list.md#createmovelistcommand)
- [createParseDomRules](prosemirror_flat_list.md#createparsedomrules)
- [createSplitListCommand](prosemirror_flat_list.md#createsplitlistcommand)
- [createWrapInListCommand](prosemirror_flat_list.md#createwrapinlistcommand)
- [defaultListClickHandler](prosemirror_flat_list.md#defaultlistclickhandler)
- [defaultMarkerToDOM](prosemirror_flat_list.md#defaultmarkertodom)
- [doSplitList](prosemirror_flat_list.md#dosplitlist)
- [enterWithoutLift](prosemirror_flat_list.md#enterwithoutlift)
- [getListType](prosemirror_flat_list.md#getlisttype)
- [handleListMarkerMouseDown](prosemirror_flat_list.md#handlelistmarkermousedown)
- [isListNode](prosemirror_flat_list.md#islistnode)
- [isListType](prosemirror_flat_list.md#islisttype)
- [listToDOM](prosemirror_flat_list.md#listtodom)
- [migrateDocJSON](prosemirror_flat_list.md#migratedocjson)
- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [wrappingListInputRule](prosemirror_flat_list.md#wrappinglistinputrule)

## Type Aliases

### ListClickHandler

Ƭ **ListClickHandler**: (`node`: `ProsemirrorNode`) => [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)

#### Type declaration

▸ (`node`): [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)

##### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `ProsemirrorNode` |

##### Returns

[`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)

___

### ListType

Ƭ **ListType**: ``"bullet"`` \| ``"ordered"`` \| ``"task"`` \| ``"toggle"``

___

### Literal

Ƭ **Literal**: `string` \| `number` \| `boolean` \| `undefined` \| ``null`` \| `void` \| `object`

All the literal types

___

### MarkerToDOM

Ƭ **MarkerToDOM**: (`attrs`: [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)) => `DOMOutputSpec`[] \| ``null``

#### Type declaration

▸ (`attrs`): `DOMOutputSpec`[] \| ``null``

##### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

##### Returns

`DOMOutputSpec`[] \| ``null``

## Variables

### flatListGroup

• `Const` **flatListGroup**: ``"flatList"``

## Functions

### alwaysTrue

▸ **alwaysTrue**<`T`\>(`func`): `T`

Wrap the giving command function so that it always returns `true`. This is
useful when we want pressing `Tab` and `Shift-Tab` won't blur the editor even
if the keybinding command returns `false`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends (...`args`: `any`[]) => `boolean` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `T` |

#### Returns

`T`

___

### createDedentListCommand

▸ **createDedentListCommand**(): `Command`

#### Returns

`Command`

___

### createIndentListCommand

▸ **createIndentListCommand**(): `Command`

#### Returns

`Command`

___

### createListInputRules

▸ **createListInputRules**(): `InputRule`[]

#### Returns

`InputRule`[]

___

### createListNodeView

▸ **createListNodeView**(`node`, `view`, `getPos`, `decorations`, `innerDecorations`): `NodeView`

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |
| `view` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |
| `getPos` | () => `number` |
| `decorations` | readonly `Decoration`[] |
| `innerDecorations` | `DecorationSource` |

#### Returns

`NodeView`

___

### createListPlugin

▸ **createListPlugin**(`schema`): `Plugin`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`Plugin`

___

### createListSpec

▸ **createListSpec**(): `NodeSpec`

#### Returns

`NodeSpec`

___

### createMoveListCommand

▸ **createMoveListCommand**(`direction`): `Command`

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | ``"up"`` \| ``"down"`` |

#### Returns

`Command`

___

### createParseDomRules

▸ **createParseDomRules**(): readonly `ParseRule`[]

#### Returns

readonly `ParseRule`[]

___

### createSplitListCommand

▸ **createSplitListCommand**(): `Command`

#### Returns

`Command`

___

### createWrapInListCommand

▸ **createWrapInListCommand**<`T`\>(`getAttrs`): `Command`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Attrs` = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `getAttrs` | `T` \| (`range`: `NodeRange`) => ``null`` \| `T` |

#### Returns

`Command`

___

### defaultListClickHandler

▸ **defaultListClickHandler**(`node`): [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

[`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md)

___

### defaultMarkerToDOM

▸ **defaultMarkerToDOM**(`attrs`): ``null`` \| `DOMOutputSpec`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `attrs` | [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Returns

``null`` \| `DOMOutputSpec`[]

___

### doSplitList

▸ **doSplitList**(`state`, `listNode`, `dispatch?`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |
| `listNode` | `Node` |
| `dispatch?` | (`tr`: `Transaction`) => `void` |

#### Returns

`boolean`

___

### enterWithoutLift

▸ **enterWithoutLift**(`state`, `dispatch?`, `view?`): `boolean`

This command has the same behavior as the `Enter` keybinding from
`prosemirror-commands`, but without the `liftEmptyBlock` command.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |
| `dispatch?` | (`tr`: `Transaction`) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### getListType

▸ **getListType**(`schema`): `NodeType`

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`NodeType`

___

### handleListMarkerMouseDown

▸ **handleListMarkerMouseDown**(`view`, `event`, `onListClick?`): `boolean`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `view` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) | `undefined` |
| `event` | `MouseEvent` | `undefined` |
| `onListClick` | [`ListClickHandler`](prosemirror_flat_list.md#listclickhandler) | `defaultListClickHandler` |

#### Returns

`boolean`

___

### isListNode

▸ **isListNode**(`node`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `undefined` \| ``null`` \| `Node` |

#### Returns

`boolean`

___

### isListType

▸ **isListType**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `NodeType` |

#### Returns

`boolean`

___

### listToDOM

▸ **listToDOM**(`node`, `nativeList`, `markerToDOM?`): `DOMOutputSpec`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `node` | `Node` | `undefined` |
| `nativeList` | `boolean` | `undefined` |
| `markerToDOM` | [`MarkerToDOM`](prosemirror_flat_list.md#markertodom) | `defaultMarkerToDOM` |

#### Returns

`DOMOutputSpec`

___

### migrateDocJSON

▸ **migrateDocJSON**(`docJSON`): [`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `docJSON` | [`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md) |

#### Returns

[`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)

___

### protectCollapsed

▸ **protectCollapsed**(`state`, `dispatch?`, `view?`): `boolean`

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `EditorState` |
| `dispatch?` | (`tr`: `Transaction`) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### wrappingListInputRule

▸ **wrappingListInputRule**<`T`\>(`re`, `getAttrs`): `InputRule`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Attrs` = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `re` | `RegExp` |
| `getAttrs` | `T` \| (`matches`: `RegExpMatchArray`) => `T` |

#### Returns

`InputRule`
