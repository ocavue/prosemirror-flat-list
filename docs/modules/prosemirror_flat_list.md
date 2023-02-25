# Module: prosemirror-flat-list

## Table of contents

### Classes

- [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md)

### Interfaces

- [DedentListOptions](../interfaces/prosemirror_flat_list.DedentListOptions.md)
- [IndentListOptions](../interfaces/prosemirror_flat_list.IndentListOptions.md)
- [ListAttributes](../interfaces/prosemirror_flat_list.ListAttributes.md)
- [ListToDOMOptions](../interfaces/prosemirror_flat_list.ListToDOMOptions.md)
- [ObjectMark](../interfaces/prosemirror_flat_list.ObjectMark.md)
- [ProsemirrorNodeJSON](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)
- [ToggleCollapsedOptions](../interfaces/prosemirror_flat_list.ToggleCollapsedOptions.md)

### Type Aliases

- [ListKind](prosemirror_flat_list.md#listkind)
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
- [createSafariInputMethodWorkaroundPlugin](prosemirror_flat_list.md#createsafariinputmethodworkaroundplugin)
- [createSplitListCommand](prosemirror_flat_list.md#createsplitlistcommand)
- [createToggleCollapsedCommand](prosemirror_flat_list.md#createtogglecollapsedcommand)
- [createWrapInListCommand](prosemirror_flat_list.md#createwrapinlistcommand)
- [findListsRange](prosemirror_flat_list.md#findlistsrange)
- [isListNode](prosemirror_flat_list.md#islistnode)
- [isListType](prosemirror_flat_list.md#islisttype)
- [joinListElements](prosemirror_flat_list.md#joinlistelements)
- [listToDOM](prosemirror_flat_list.md#listtodom)
- [migrateDocJSON](prosemirror_flat_list.md#migratedocjson)
- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [wrappingListInputRule](prosemirror_flat_list.md#wrappinglistinputrule)

## Type Aliases

### ListKind

Ƭ **ListKind**: ``"bullet"`` \| ``"ordered"`` \| ``"task"`` \| ``"toggle"``

All default list node kinds.

___

### Literal

Ƭ **Literal**: `string` \| `number` \| `boolean` \| `undefined` \| ``null`` \| `void` \| `object`

All the literal types

## Variables

### flatListGroup

• `Const` **flatListGroup**: ``"flatList"``

The default group name for list nodes.

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

▸ **createDedentListCommand**(`options?`): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that decreases the indentation of selected list nodes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`DedentListOptions`](../interfaces/prosemirror_flat_list.DedentListOptions.md) |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createIndentListCommand

▸ **createIndentListCommand**(`options?`): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command function that increases the indentation of selected list
nodes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`IndentListOptions`](../interfaces/prosemirror_flat_list.IndentListOptions.md) |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createListInputRules

▸ **createListInputRules**(): `InputRule`[]

Return all input rules for lists.

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

Return a ProseMirror plugin for list.

**`Remarks`**

This plugin is responsible for the following:

1. Handling DOM events for clicking on list markers.
2. Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`)
   to clipboard. See [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md).
3. Create a custom node view for list nodes. See [createListNodeView](prosemirror_flat_list.md#createlistnodeview).

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`<`any`, `any`\> |

#### Returns

`Plugin`

___

### createListSpec

▸ **createListSpec**(): `NodeSpec`

Return the spec for list node.

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

Returns a set of rules for parsing HTML into ProseMirror list nodes.

#### Returns

readonly `ParseRule`[]

___

### createSafariInputMethodWorkaroundPlugin

▸ **createSafariInputMethodWorkaroundPlugin**(): `Plugin`

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

#### Returns

`Plugin`

___

### createSplitListCommand

▸ **createSplitListCommand**(): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Returns a command that split the current list node.

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### createToggleCollapsedCommand

▸ **createToggleCollapsedCommand**(`«destructured»?`): [`Command`]( https://prosemirror.net/docs/ref/#state.Command )

Return a command function that toggle the `collapsed` attribute of the list node.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ToggleCollapsedOptions`](../interfaces/prosemirror_flat_list.ToggleCollapsedOptions.md) |

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
| `T` | extends [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAttrs` | `T` \| (`range`: `NodeRange`) => ``null`` \| `T` | The list node attributes or a callback function to take the current selection block range and return list node attributes. If this callback function returns null, the command won't do anything. |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### findListsRange

▸ **findListsRange**(`$from`, `$to?`): `NodeRange` \| ``null``

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `$from` | `ResolvedPos` | `undefined` |
| `$to` | `ResolvedPos` | `$from` |

#### Returns

`NodeRange` \| ``null``

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

Renders a list node to DOM output spec.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ListToDOMOptions`](../interfaces/prosemirror_flat_list.ListToDOMOptions.md) |

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

▸ **wrappingListInputRule**<`T`\>(`regexp`, `getAttrs`): `InputRule`

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `regexp` | `RegExp` |
| `getAttrs` | `T` \| (`matches`: `RegExpMatchArray`) => `T` |

#### Returns

`InputRule`
