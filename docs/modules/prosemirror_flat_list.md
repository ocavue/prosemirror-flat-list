[prosemirror-flat-list-monorepo](../README.md) / [Modules](../modules.md) / prosemirror-flat-list

# Module: prosemirror-flat-list

## Table of contents

### Classes

- [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md)

### Interfaces

- [ListAttributes](../interfaces/prosemirror_flat_list.ListAttributes.md)
- [ListToDOMProps](../interfaces/prosemirror_flat_list.ListToDOMProps.md)
- [ObjectMark](../interfaces/prosemirror_flat_list.ObjectMark.md)
- [ProsemirrorNodeJSON](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)

### Type Aliases

- [ListClickHandler](prosemirror_flat_list.md#listclickhandler)
- [ListType](prosemirror_flat_list.md#listtype)
- [Literal](prosemirror_flat_list.md#literal)

### Variables

- [flatListGroup](prosemirror_flat_list.md#flatlistgroup)
- [listKeymap](prosemirror_flat_list.md#listkeymap)

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
- [defaultAttributesGetter](prosemirror_flat_list.md#defaultattributesgetter)
- [defaultListClickHandler](prosemirror_flat_list.md#defaultlistclickhandler)
- [defaultMarkerGetter](prosemirror_flat_list.md#defaultmarkergetter)
- [doSplitList](prosemirror_flat_list.md#dosplitlist)
- [enterWithoutLift](prosemirror_flat_list.md#enterwithoutlift)
- [findListsRange](prosemirror_flat_list.md#findlistsrange)
- [getListType](prosemirror_flat_list.md#getlisttype)
- [handleListMarkerMouseDown](prosemirror_flat_list.md#handlelistmarkermousedown)
- [isListNode](prosemirror_flat_list.md#islistnode)
- [isListType](prosemirror_flat_list.md#islisttype)
- [joinListElements](prosemirror_flat_list.md#joinlistelements)
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

## Variables

### flatListGroup

• `Const` **flatListGroup**: ``"flatList"``

___

### listKeymap

• `Const` **listKeymap**: `Object`

Returns an object containing the keymap for the list commands.

- `Enter`: Split current list item or create a new paragraph.
- `Mod-[`: Decrease indentation.
- `Mod-]`: Increase indentation.
- `Delete`: Expand selected collapsed content, or fall back to the usually delete command.
- `Backspace`: Expand selected collapsed content, or fall back to the usually Backspace command.

Notice that `Delete` and `Backspace` use [`joinTextblockForward`](https://prosemirror.net/docs/ref/#commands.joinTextblockForward) and [`joinTextblockBackward`](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward) under the hood, which have slightly different behavior than the default [`joinForward`](https://prosemirror.net/docs/ref/#commands.joinForward) and [`joinBackward`](https://prosemirror.net/docs/ref/#commands.joinBackward) commands in the `prosemirror-commands` package.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Backspace` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Delete` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Enter` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-[` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-]` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |

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

▸ **createDedentListCommand**(): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that decreases the indentation of selected list nodes.

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createIndentListCommand

▸ **createIndentListCommand**(): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that increases the indentation of selected list
nodes.

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

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

▸ **createMoveListCommand**(`direction`): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that moves up or down selected list nodes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | ``"up"`` \| ``"down"`` |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createParseDomRules

▸ **createParseDomRules**(): readonly `ParseRule`[]

#### Returns

readonly `ParseRule`[]

___

### createSplitListCommand

▸ **createSplitListCommand**(): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command that split the current list node.

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createWrapInListCommand

▸ **createWrapInListCommand**<`T`\>(`getAttrs`): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that wraps the selection in a list with the given
type an attributes.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Attrs` = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `getAttrs` | `T` \| (`range`: `NodeRange`) => ``null`` \| `T` |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### defaultAttributesGetter

▸ **defaultAttributesGetter**(`node`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `class` | `string` |
| `data-list-checked` | `undefined` \| `string` |
| `data-list-collapsable` | `undefined` \| `string` |
| `data-list-collapsed` | `undefined` \| `string` |
| `data-list-order` | `undefined` \| `string` |
| `data-list-type` | `undefined` \| [`ListType`](prosemirror_flat_list.md#listtype) |
| `style` | `undefined` \| `string` |

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

### defaultMarkerGetter

▸ **defaultMarkerGetter**(`node`): `DOMOutputSpec`[] \| ``null``

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `Node` |

#### Returns

`DOMOutputSpec`[] \| ``null``

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

### findListsRange

▸ **findListsRange**(`$from`, `$to`): `NodeRange` \| ``null``

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `$from` | `ResolvedPos` |
| `$to` | `ResolvedPos` |

#### Returns

`NodeRange` \| ``null``

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

### joinListElements

▸ **joinListElements**<`T`\>(`parent`): `T`

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `Element` \| `DocumentFragment` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | `T` |

#### Returns

`T`

___

### listToDOM

▸ **listToDOM**(`«destructured»`): `DOMOutputSpec`

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ListToDOMProps`](../interfaces/prosemirror_flat_list.ListToDOMProps.md) |

#### Returns

`DOMOutputSpec`

___

### migrateDocJSON

▸ **migrateDocJSON**(`docJSON`): [`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md) \| ``null``

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `docJSON` | [`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md) |

#### Returns

[`ProsemirrorNodeJSON`](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md) \| ``null``

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
