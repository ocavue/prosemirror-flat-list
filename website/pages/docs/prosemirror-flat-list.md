# prosemirror-flat-list

## Interfaces

### DedentListOptions

#### Properties

| Property | Type     | Description                                                                                      |
| :------- | :------- | :----------------------------------------------------------------------------------------------- |
| from?    | `number` | A optional from position to indent.<br /><br />`Default Value`<br /><br />`state.selection.from` |
| to?      | `number` | A optional to position to indent.<br /><br />`Default Value`<br /><br />`state.selection.to`     |

---

### IndentListOptions

#### Properties

| Property | Type     | Description                                                                                      |
| :------- | :------- | :----------------------------------------------------------------------------------------------- |
| from?    | `number` | A optional from position to indent.<br /><br />`Default Value`<br /><br />`state.selection.from` |
| to?      | `number` | A optional to position to indent.<br /><br />`Default Value`<br /><br />`state.selection.to`     |

---

### ListAttributes

#### Properties

| Property   | Type                            |
| :--------- | :------------------------------ |
| checked?   | `boolean`                       |
| collapsed? | `boolean`                       |
| kind?      | [`ListKind`](index.md#listkind) |
| order?     | `null` \| `number`              |

---

### ListToDOMOptions

#### Properties

| Property       | Type                                                                                                                                                   | Description                                                                                                                                                                                                                               |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getAttributes? | (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `Record`\<`string`, `undefined` \| `string`\>                                        | An optional function to get the attributes added to HTML element.                                                                                                                                                                         |
| getMarkers?    | (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `null` \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[] | An optional function to get elements inside `<div class="list-marker">`.<br />Return `null` to hide the marker.                                                                                                                           |
| nativeList?    | `boolean`                                                                                                                                              | If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.<br />You might want to use [joinListElements](index.md#joinlistelements) to join the list elements<br />afterward.<br /><br />`Default Value`<br /><br />false |
| node           | [`Node`](https://prosemirror.net/docs/ref/#model.Node)                                                                                                 | The list node to be rendered.                                                                                                                                                                                                             |

---

### ProsemirrorNodeJSON

#### Properties

| Property | Type                                                                                                |
| :------- | :-------------------------------------------------------------------------------------------------- |
| attrs?   | [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs)                                            |
| content? | [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson)[]                                             |
| marks?   | (`string` \| \{attrs: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs); type: `string`;})[] |
| text?    | `string`                                                                                            |
| type     | `string`                                                                                            |

---

### ToggleCollapsedOptions

#### Properties

| Property      | Type                                                                        | Description                                                                                                               |
| :------------ | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| collapsed?    | `boolean`                                                                   | If this value exists, the command will set the `collapsed` attribute to<br />this value instead of toggle it.             |
| isToggleable? | (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `boolean` | An optional function to accept a list node and return whether or not this<br />node can toggle its `collapsed` attribute. |

---

## Functions

### findListsRange()

> **findListsRange**($from: [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ), $to: [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) = `$from`): [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange ) \| `null`

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Parameters

| Parameter | Type                                                                 | Default value |
| :-------- | :------------------------------------------------------------------- | :------------ |
| $from     | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | undefined     |
| $to       | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | $from         |

#### Returns

[`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange) \| `null`

---

### isListNode()

> **isListNode**(node: `undefined` \| `null` \| [`Node`](https://prosemirror.net/docs/ref/#model.Node)): `boolean`

#### Parameters

| Parameter | Type                                                                            |
| :-------- | :------------------------------------------------------------------------------ |
| node      | `undefined` \| `null` \| [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

#### Returns

`boolean`

---

### isListType()

> **isListType**(type: [`NodeType`](https://prosemirror.net/docs/ref/#model.NodeType)): `boolean`

#### Parameters

| Parameter | Type                                                           |
| :-------- | :------------------------------------------------------------- |
| type      | [`NodeType`](https://prosemirror.net/docs/ref/#model.NodeType) |

#### Returns

`boolean`

---

### joinListElements()

> **joinListElements**\<T\>(parent: `T`): `T`

Merge adjacent \<ul\> elements or adjacent \<ol\> elements into a single list element.

#### Type parameters

| Parameter                                                                                                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T _extends_ [`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element) \| [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) |

#### Parameters

| Parameter | Type |
| :-------- | :--- |
| parent    | `T`  |

#### Returns

`T`

---

### migrateDocJSON()

> **migrateDocJSON**(docJSON: [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson)): [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson) \| `null`

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

#### Parameters

| Parameter | Type                                                  |
| :-------- | :---------------------------------------------------- |
| docJSON   | [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson) |

#### Returns

[`ProsemirrorNodeJSON`](index.md#prosemirrornodejson) \| `null`

---

## Commands

### listKeymap

> `const` **listKeymap**: `object`

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](index.md#entercommand).
- `Backspace`: See [backspaceCommand](index.md#backspacecommand).
- `Delete`: See [deleteCommand](index.md#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](index.md#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](index.md#createindentlistcommand).

#### Type declaration

| Member    | Type                                                         |
| :-------- | :----------------------------------------------------------- |
| Backspace | [`Command`](https://prosemirror.net/docs/ref/#state.Command) |
| Delete    | [`Command`](https://prosemirror.net/docs/ref/#state.Command) |
| Enter     | [`Command`](https://prosemirror.net/docs/ref/#state.Command) |
| Mod-[     | [`Command`](https://prosemirror.net/docs/ref/#state.Command) |
| Mod-]     | [`Command`](https://prosemirror.net/docs/ref/#state.Command) |

---

### backspaceCommand()

> **backspaceCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](index.md#joinlistup)
- [joinCollapsedListBackward](index.md#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

### createDedentListCommand()

> **createDedentListCommand**(options?: [`DedentListOptions`](index.md#dedentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Returns a command function that decreases the indentation of selected list nodes.

#### Parameters

| Parameter | Type                                              |
| :-------- | :------------------------------------------------ |
| options?  | [`DedentListOptions`](index.md#dedentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createIndentListCommand()

> **createIndentListCommand**(options?: [`IndentListOptions`](index.md#indentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Returns a command function that increases the indentation of selected list
nodes.

#### Parameters

| Parameter | Type                                              |
| :-------- | :------------------------------------------------ |
| options?  | [`IndentListOptions`](index.md#indentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createMoveListCommand()

> **createMoveListCommand**(direction: "up" \| "down"): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Returns a command function that moves up or down selected list nodes.

#### Parameters

| Parameter | Type           |
| :-------- | :------------- |
| direction | "up" \| "down" |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createSplitListCommand()

> **createSplitListCommand**(): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Returns a command that split the current list node.

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createToggleCollapsedCommand()

> **createToggleCollapsedCommand**(\_\_namedParameters: [`ToggleCollapsedOptions`](index.md#togglecollapsedoptions) = `{}`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Return a command function that toggle the `collapsed` attribute of the list node.

#### Parameters

| Parameter           | Type                                                        |
| :------------------ | :---------------------------------------------------------- |
| \_\_namedParameters | [`ToggleCollapsedOptions`](index.md#togglecollapsedoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createWrapInListCommand()

> **createWrapInListCommand**\<T\>(getAttrs: `T` \| (range: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| `T`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

Returns a command function that wraps the selection in a list with the given
type an attributes.

#### Type parameters

| Parameter                                               | Default                                     |
| :------------------------------------------------------ | :------------------------------------------ |
| T _extends_ [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

#### Parameters

| Parameter | Type                                                                                              | Description                                                                                                                                                                                                 |
| :-------- | :------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getAttrs  | `T` \| (range: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| `T` | The list node attributes or a callback function to take the current<br />selection block range and return list node attributes. If this callback<br />function returns null, the command won't do anything. |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### deleteCommand()

> **deleteCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

### enterCommand()

> **enterCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [createSplitListCommand](index.md#createsplitlistcommand)

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

### joinCollapsedListBackward()

> **joinCollapsedListBackward**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

### joinListUp()

> **joinListUp**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

### protectCollapsed()

> **protectCollapsed**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

#### Parameters

| Parameter | Type                                                                                 |
| :-------- | :----------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                 |
| dispatch? | (tr: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                    |

#### Returns

`boolean`

---

## Input Rules

### listInputRules

> `const` **listInputRules**: [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

All input rules for lists.

---

### wrappingListInputRule()

> **wrappingListInputRule**\<T\>(regexp: [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), getAttrs: `T` \| (matches: `RegExpMatchArray`) => `T`): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

#### Type parameters

| Parameter                                               | Default                                     |
| :------------------------------------------------------ | :------------------------------------------ |
| T _extends_ [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

#### Parameters

| Parameter | Type                                                                                                |
| :-------- | :-------------------------------------------------------------------------------------------------- |
| regexp    | [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) |
| getAttrs  | `T` \| (matches: `RegExpMatchArray`) => `T`                                                         |

#### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)

---

## Plugins

### ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

#### Constructors

##### constructor()

> **new ListDOMSerializer**(nodes: `object`, marks: `object`): [`ListDOMSerializer`](index.md#listdomserializer)

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

###### Parameters

| Parameter | Type | Description                       |
| :-------- | :--- | :-------------------------------- |
| nodes     | \{}  | The node serialization functions. |
| marks     | \{}  | The mark serialization functions. |

###### Returns

[`ListDOMSerializer`](index.md#listdomserializer)

###### Inherited from

DOMSerializer.constructor

#### Methods

##### serializeFragment()

> **serializeFragment**(
> fragment: [`Fragment`](https://prosemirror.net/docs/ref/#model.Fragment),
> options?: `object`,
> target?: [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)): [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)

###### Parameters

| Parameter | Type                                                                                                                                                                     |
| :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fragment  | [`Fragment`](https://prosemirror.net/docs/ref/#model.Fragment)                                                                                                           |
| options?  | `object`                                                                                                                                                                 |
| target?   | [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) |

###### Returns

[`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)

###### Overrides

DOMSerializer.serializeFragment

##### fromSchema()

> `Static` **fromSchema**(schema: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\>): [`ListDOMSerializer`](index.md#listdomserializer)

###### Parameters

| Parameter | Type                                                                       |
| :-------- | :------------------------------------------------------------------------- |
| schema    | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

###### Returns

[`ListDOMSerializer`](index.md#listdomserializer)

###### Overrides

DOMSerializer.fromSchema

##### nodesFromSchema()

> `Static` **nodesFromSchema**(schema: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\>): `object`

###### Parameters

| Parameter | Type                                                                       |
| :-------- | :------------------------------------------------------------------------- |
| schema    | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

###### Returns

`object`

###### Overrides

DOMSerializer.nodesFromSchema

---

### createListClipboardPlugin()

> **createListClipboardPlugin**(schema: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\>): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](index.md#listdomserializer).

#### Parameters

| Parameter | Type                                                                       |
| :-------- | :------------------------------------------------------------------------- |
| schema    | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createListEventPlugin()

> **createListEventPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

Handle DOM events for list.

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createListNodeView()

> **createListNodeView**(
> node: [`Node`](https://prosemirror.net/docs/ref/#model.Node),
> view: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView),
> getPos: `Function`,
> decorations: _readonly_ [`Decoration`](https://prosemirror.net/docs/ref/#view.Decoration)[],
> innerDecorations: [`DecorationSource`](https://prosemirror.net/docs/ref/#view.DecorationSource)): [`NodeView`](https://prosemirror.net/docs/ref/#view.NodeView)

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

#### Parameters

| Parameter        | Type                                                                           |
| :--------------- | :----------------------------------------------------------------------------- |
| node             | [`Node`](https://prosemirror.net/docs/ref/#model.Node)                         |
| view             | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)              |
| getPos           | () => `undefined` \| `number`                                                  |
| decorations      | _readonly_ [`Decoration`](https://prosemirror.net/docs/ref/#view.Decoration)[] |
| innerDecorations | [`DecorationSource`](https://prosemirror.net/docs/ref/#view.DecorationSource)  |

#### Returns

[`NodeView`](https://prosemirror.net/docs/ref/#view.NodeView)

---

### createListPlugins()

> **createListPlugins**(\_\_namedParameters: `object`): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)[]

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](index.md#createlisteventplugin)
- [createListRenderingPlugin](index.md#createlistrenderingplugin)
- [createListClipboardPlugin](index.md#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](index.md#createsafariinputmethodworkaroundplugin)

#### Parameters

| Parameter           | Type     |
| :------------------ | :------- |
| \_\_namedParameters | `object` |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)[]

---

### createListRenderingPlugin()

> **createListRenderingPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

Handle the list node rendering.

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createSafariInputMethodWorkaroundPlugin()

> **createSafariInputMethodWorkaroundPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

## Schema

### ListKind

> **ListKind**: "bullet" \| "ordered" \| "task" \| "toggle"

All default list node kinds.

---

### createListSpec()

> **createListSpec**(): [`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

Return the spec for list node.

#### Returns

[`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

---

### createParseDomRules()

> **createParseDomRules**(): _readonly_ [`ParseRule`](https://prosemirror.net/docs/ref/#model.ParseRule)[]

Returns a set of rules for parsing HTML into ProseMirror list nodes.

#### Returns

_readonly_ [`ParseRule`](https://prosemirror.net/docs/ref/#model.ParseRule)[]

---

### listToDOM()

> **listToDOM**(\_\_namedParameters: [`ListToDOMOptions`](index.md#listtodomoptions)): [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)

Renders a list node to DOM output spec.

#### Parameters

| Parameter           | Type                                            |
| :------------------ | :---------------------------------------------- |
| \_\_namedParameters | [`ListToDOMOptions`](index.md#listtodomoptions) |

#### Returns

[`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)

---
