# Module: prosemirror-flat-list

## Table of contents

### Plugins

- [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md)
- [createListClipboardPlugin](prosemirror_flat_list.md#createlistclipboardplugin)
- [createListEventPlugin](prosemirror_flat_list.md#createlisteventplugin)
- [createListNodeView](prosemirror_flat_list.md#createlistnodeview)
- [createListPlugins](prosemirror_flat_list.md#createlistplugins)
- [createListRenderingPlugin](prosemirror_flat_list.md#createlistrenderingplugin)
- [createSafariInputMethodWorkaroundPlugin](prosemirror_flat_list.md#createsafariinputmethodworkaroundplugin)

### Interfaces

- [DedentListOptions](../interfaces/prosemirror_flat_list.DedentListOptions.md)
- [IndentListOptions](../interfaces/prosemirror_flat_list.IndentListOptions.md)
- [ListAttributes](../interfaces/prosemirror_flat_list.ListAttributes.md)
- [ListToDOMOptions](../interfaces/prosemirror_flat_list.ListToDOMOptions.md)
- [ProsemirrorNodeJSON](../interfaces/prosemirror_flat_list.ProsemirrorNodeJSON.md)
- [ToggleCollapsedOptions](../interfaces/prosemirror_flat_list.ToggleCollapsedOptions.md)

### Schema

- [ListKind](prosemirror_flat_list.md#listkind)
- [flatListGroup](prosemirror_flat_list.md#flatlistgroup)
- [createListSpec](prosemirror_flat_list.md#createlistspec)
- [createParseDomRules](prosemirror_flat_list.md#createparsedomrules)
- [listToDOM](prosemirror_flat_list.md#listtodom)

### Input Rules

- [listInputRules](prosemirror_flat_list.md#listinputrules)
- [wrappingListInputRule](prosemirror_flat_list.md#wrappinglistinputrule)

### Commands

- [listKeymap](prosemirror_flat_list.md#listkeymap)
- [backspaceCommand](prosemirror_flat_list.md#backspacecommand)
- [createDedentListCommand](prosemirror_flat_list.md#creatededentlistcommand)
- [createIndentListCommand](prosemirror_flat_list.md#createindentlistcommand)
- [createMoveListCommand](prosemirror_flat_list.md#createmovelistcommand)
- [createSplitListCommand](prosemirror_flat_list.md#createsplitlistcommand)
- [createToggleCollapsedCommand](prosemirror_flat_list.md#createtogglecollapsedcommand)
- [createWrapInListCommand](prosemirror_flat_list.md#createwrapinlistcommand)
- [deleteCommand](prosemirror_flat_list.md#deletecommand)
- [enterCommand](prosemirror_flat_list.md#entercommand)
- [joinCollapsedListBackward](prosemirror_flat_list.md#joincollapsedlistbackward)
- [joinListBackward](prosemirror_flat_list.md#joinlistbackward)
- [joinListUp](prosemirror_flat_list.md#joinlistup)
- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)

### Functions

- [findListsRange](prosemirror_flat_list.md#findlistsrange)
- [isListNode](prosemirror_flat_list.md#islistnode)
- [isListType](prosemirror_flat_list.md#islisttype)
- [joinListElements](prosemirror_flat_list.md#joinlistelements)
- [migrateDocJSON](prosemirror_flat_list.md#migratedocjson)

## Plugins

• **ListDOMSerializer**: `Object`

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

### createListClipboardPlugin

▸ **createListClipboardPlugin**(`schema`): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](../classes/prosemirror_flat_list.ListDOMSerializer.md).

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )<`any`, `any`\> |

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

___

### createListEventPlugin

▸ **createListEventPlugin**(): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

Handle DOM events for list.

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

___

### createListNodeView

▸ **createListNodeView**(`node`, `view`, `getPos`, `decorations`, `innerDecorations`): [`NodeView`]( https://prosemirror.net/docs/ref/#view.NodeView )

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |
| `view` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |
| `getPos` | () => `number` |
| `decorations` | readonly [`Decoration`]( https://prosemirror.net/docs/ref/#view.Decoration )[] |
| `innerDecorations` | [`DecorationSource`]( https://prosemirror.net/docs/ref/#view.DecorationSource ) |

#### Returns

[`NodeView`]( https://prosemirror.net/docs/ref/#view.NodeView )

___

### createListPlugins

▸ **createListPlugins**(`«destructured»`): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )[]

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](prosemirror_flat_list.md#createlisteventplugin)
- [createListRenderingPlugin](prosemirror_flat_list.md#createlistrenderingplugin)
- [createListClipboardPlugin](prosemirror_flat_list.md#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](prosemirror_flat_list.md#createsafariinputmethodworkaroundplugin)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )<`any`, `any`\> |

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )[]

___

### createListRenderingPlugin

▸ **createListRenderingPlugin**(): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

Handle the list node rendering.

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

___

### createSafariInputMethodWorkaroundPlugin

▸ **createSafariInputMethodWorkaroundPlugin**(): [`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

## Schema

### ListKind

Ƭ **ListKind**: ``"bullet"`` \| ``"ordered"`` \| ``"task"`` \| ``"toggle"``

All default list node kinds.

___

### flatListGroup

• `Const` **flatListGroup**: ``"flatList"``

The default group name for list nodes.

___

### createListSpec

▸ **createListSpec**(): [`NodeSpec`]( https://prosemirror.net/docs/ref/#model.NodeSpec )

Return the spec for list node.

#### Returns

[`NodeSpec`]( https://prosemirror.net/docs/ref/#model.NodeSpec )

___

### createParseDomRules

▸ **createParseDomRules**(): readonly [`ParseRule`]( https://prosemirror.net/docs/ref/#model.ParseRule )[]

Returns a set of rules for parsing HTML into ProseMirror list nodes.

#### Returns

readonly [`ParseRule`]( https://prosemirror.net/docs/ref/#model.ParseRule )[]

___

### listToDOM

▸ **listToDOM**(`«destructured»`): [`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )

Renders a list node to DOM output spec.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ListToDOMOptions`](../interfaces/prosemirror_flat_list.ListToDOMOptions.md) |

#### Returns

[`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )

## Input Rules

### listInputRules

• `Const` **listInputRules**: [`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

All input rules for lists.

___

### wrappingListInputRule

▸ **wrappingListInputRule**<`T`\>(`regexp`, `getAttrs`): [`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) = [`ListAttributes`](../interfaces/prosemirror_flat_list.ListAttributes.md) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `regexp` | [`RegExp`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp ) |
| `getAttrs` | `T` \| (`matches`: `RegExpMatchArray`) => `T` |

#### Returns

[`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )

## Commands

### listKeymap

• `Const` **listKeymap**: `Object`

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](prosemirror_flat_list.md#entercommand).
- `Backspace`: See [backspaceCommand](prosemirror_flat_list.md#backspacecommand).
- `Delete`: See [deleteCommand](prosemirror_flat_list.md#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](prosemirror_flat_list.md#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](prosemirror_flat_list.md#createindentlistcommand).

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Backspace` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Delete` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Enter` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-[` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-]` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |

___

### backspaceCommand

▸ **backspaceCommand**(`state`, `dispatch?`, `view?`): `boolean`

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](prosemirror_flat_list.md#joinlistup)
- [joinCollapsedListBackward](prosemirror_flat_list.md#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

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
| `getAttrs` | `T` \| (`range`: [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange )) => ``null`` \| `T` | The list node attributes or a callback function to take the current selection block range and return list node attributes. If this callback function returns null, the command won't do anything. |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

___

### deleteCommand

▸ **deleteCommand**(`state`, `dispatch?`, `view?`): `boolean`

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### enterCommand

▸ **enterCommand**(`state`, `dispatch?`, `view?`): `boolean`

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [createSplitListCommand](prosemirror_flat_list.md#createsplitlistcommand)

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### joinCollapsedListBackward

▸ **joinCollapsedListBackward**(`state`, `dispatch?`, `view?`): `boolean`

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### joinListBackward

▸ **joinListBackward**(`state`, `dispatch?`, `view?`): `boolean`

An alias to [joinListUp](prosemirror_flat_list.md#joinlistup)

**`Deprecated`**

use joinListUp instead

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

___

### joinListUp

▸ **joinListUp**(`state`, `dispatch?`, `view?`): `boolean`

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

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
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

## Functions

### findListsRange

▸ **findListsRange**(`$from`, `$to?`): [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange ) \| ``null``

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `$from` | [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) | `undefined` |
| `$to` | [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) | `$from` |

#### Returns

[`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange ) \| ``null``

___

### isListNode

▸ **isListNode**(`node`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `undefined` \| ``null`` \| [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

#### Returns

`boolean`

___

### isListType

▸ **isListType**(`type`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`NodeType`]( https://prosemirror.net/docs/ref/#model.NodeType ) |

#### Returns

`boolean`

___

### joinListElements

▸ **joinListElements**<`T`\>(`parent`): `T`

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends [`Element`]( https://developer.mozilla.org/en-US/docs/Web/API/Element ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment ) |

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | `T` |

#### Returns

`T`

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
