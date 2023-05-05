# prosemirror-flat-list

## Interfaces

### DedentListOptions

#### Properties

##### from

> `optional` **from**: `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to

> `optional` **to**: `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### IndentListOptions

#### Properties

##### from

> `optional` **from**: `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to

> `optional` **to**: `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### ListAttributes

#### Properties

##### checked

> `optional` **checked**: `boolean`

##### collapsed

> `optional` **collapsed**: `boolean`

##### kind

> `optional` **kind**: [`ListKind`](prosemirror-flat-list.md#listkind)

##### order

> `optional` **order**: `null` \| `number`

---

### ListToDOMOptions

#### Properties

##### getAttributes

> `optional` **getAttributes**: `Function`

###### Type declaration

An optional function to get the attributes added to HTML element.

> (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)): `Record`\<`string`, `undefined` \| `string`\>

####### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| node      | [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

####### Returns

`Record`\<`string`, `undefined` \| `string`\>

##### getMarkers

> `optional` **getMarkers**: `Function`

###### Type declaration

An optional function to get elements inside `<div class="list-marker">`.
Return `null` to hide the marker.

> (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)): `null` \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[]

####### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| node      | [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

####### Returns

`null` \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[]

##### nativeList

> `optional` **nativeList**: `boolean`

If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.
You might want to use [joinListElements](prosemirror-flat-list.md#joinlistelements) to join the list elements
afterward.

###### Default Value

false

##### node

> **node**: [`Node`](https://prosemirror.net/docs/ref/#model.Node)

The list node to be rendered.

---

### ProsemirrorNodeJSON

#### Properties

##### attrs

> `optional` **attrs**: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs)

##### content

> `optional` **content**: [`ProsemirrorNodeJSON`](prosemirror-flat-list.md#prosemirrornodejson)[]

##### marks

> `optional` **marks**: (`string` \| \{attrs: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs);
> type: `string`;})[]

##### text

> `optional` **text**: `string`

##### type

> **type**: `string`

---

### ToggleCollapsedOptions

#### Properties

##### collapsed

> `optional` **collapsed**: `boolean`

If this value exists, the command will set the `collapsed` attribute to
this value instead of toggle it.

##### isToggleable

> `optional` **isToggleable**: `Function`

###### Type declaration

An optional function to accept a list node and return whether or not this
node can toggle its `collapsed` attribute.

> (node: [`Node`](https://prosemirror.net/docs/ref/#model.Node)): `boolean`

####### Parameters

| Parameter | Type                                                   |
| :-------- | :----------------------------------------------------- |
| node      | [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

####### Returns

`boolean`

---

## Functions

### findListsRange()

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

> **findListsRange**($from: [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ), $to: [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) = `$from`): [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange ) \| `null`

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

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

> **joinListElements**\<T\>(parent: `T`): `T`

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

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

> **migrateDocJSON**(docJSON: [`ProsemirrorNodeJSON`](prosemirror-flat-list.md#prosemirrornodejson)): [`ProsemirrorNodeJSON`](prosemirror-flat-list.md#prosemirrornodejson) \| `null`

#### Parameters

| Parameter | Type                                                                  |
| :-------- | :-------------------------------------------------------------------- |
| docJSON   | [`ProsemirrorNodeJSON`](prosemirror-flat-list.md#prosemirrornodejson) |

#### Returns

[`ProsemirrorNodeJSON`](prosemirror-flat-list.md#prosemirrornodejson) \| `null`

---

## Commands

### listKeymap

> `const` **listKeymap**: `object`

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](prosemirror-flat-list.md#entercommand).
- `Backspace`: See [backspaceCommand](prosemirror-flat-list.md#backspacecommand).
- `Delete`: See [deleteCommand](prosemirror-flat-list.md#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](prosemirror-flat-list.md#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](prosemirror-flat-list.md#createindentlistcommand).

#### Type declaration

> **Backspace**: [`Command`](https://prosemirror.net/docs/ref/#state.Command) = `backspaceCommand`
>
> **Delete**: [`Command`](https://prosemirror.net/docs/ref/#state.Command) = `deleteCommand`
>
> **Enter**: [`Command`](https://prosemirror.net/docs/ref/#state.Command) = `enterCommand`
>
> **Mod-[**: [`Command`](https://prosemirror.net/docs/ref/#state.Command)
>
> **Mod-]**: [`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### backspaceCommand()

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](prosemirror-flat-list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](prosemirror-flat-list.md#joinlistup)
- [joinCollapsedListBackward](prosemirror-flat-list.md#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

> **backspaceCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

### createDedentListCommand()

Returns a command function that decreases the indentation of selected list nodes.

> **createDedentListCommand**(options?: [`DedentListOptions`](prosemirror-flat-list.md#dedentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Parameters

| Parameter | Type                                                              |
| :-------- | :---------------------------------------------------------------- |
| options?  | [`DedentListOptions`](prosemirror-flat-list.md#dedentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createIndentListCommand()

Returns a command function that increases the indentation of selected list
nodes.

> **createIndentListCommand**(options?: [`IndentListOptions`](prosemirror-flat-list.md#indentlistoptions)): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Parameters

| Parameter | Type                                                              |
| :-------- | :---------------------------------------------------------------- |
| options?  | [`IndentListOptions`](prosemirror-flat-list.md#indentlistoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createMoveListCommand()

Returns a command function that moves up or down selected list nodes.

> **createMoveListCommand**(direction: "up" \| "down"): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Parameters

| Parameter | Type           |
| :-------- | :------------- |
| direction | "up" \| "down" |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createSplitListCommand()

Returns a command that split the current list node.

> **createSplitListCommand**(): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createToggleCollapsedCommand()

Return a command function that toggle the `collapsed` attribute of the list node.

> **createToggleCollapsedCommand**(\_\_namedParameters: [`ToggleCollapsedOptions`](prosemirror-flat-list.md#togglecollapsedoptions) = `{}`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Parameters

| Parameter           | Type                                                                        |
| :------------------ | :-------------------------------------------------------------------------- |
| \_\_namedParameters | [`ToggleCollapsedOptions`](prosemirror-flat-list.md#togglecollapsedoptions) |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### createWrapInListCommand()

Returns a command function that wraps the selection in a list with the given
type an attributes.

> **createWrapInListCommand**\<T\>(getAttrs: `T` \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| `T`): [`Command`](https://prosemirror.net/docs/ref/#state.Command)

#### Type parameters

| Parameter                                                               | Default                                                     |
| :---------------------------------------------------------------------- | :---------------------------------------------------------- |
| T _extends_ [`ListAttributes`](prosemirror-flat-list.md#listattributes) | [`ListAttributes`](prosemirror-flat-list.md#listattributes) |

#### Parameters

| Parameter | Type                                                                                                | Description                                                                                                                                                                                                 |
| :-------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getAttrs  | `T` \| (`range`: [`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange)) => `null` \| `T` | The list node attributes or a callback function to take the current<br />selection block range and return list node attributes. If this callback<br />function returns null, the command won't do anything. |

#### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

---

### deleteCommand()

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](prosemirror-flat-list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

> **deleteCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

### enterCommand()

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](prosemirror-flat-list.md#protectcollapsed)
- [createSplitListCommand](prosemirror-flat-list.md#createsplitlistcommand)

> **enterCommand**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

### joinCollapsedListBackward()

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

> **joinCollapsedListBackward**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

### joinListUp()

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

> **joinListUp**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

### protectCollapsed()

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

> **protectCollapsed**(
> state: [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState),
> dispatch?: `Function`,
> view?: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)): `boolean`

#### Parameters

| Parameter | Type                                                                                   |
| :-------- | :------------------------------------------------------------------------------------- |
| state     | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState)                   |
| dispatch? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| view?     | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView)                      |

#### Returns

`boolean`

---

## Input Rules

### listInputRules

> `const` **listInputRules**: [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)[]

All input rules for lists.

---

### wrappingListInputRule()

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

> **wrappingListInputRule**\<T\>(regexp: [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), getAttrs: `T` \| (`matches`: `RegExpMatchArray`) => `T`): [`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)

#### Type parameters

| Parameter                                                               | Default                                                     |
| :---------------------------------------------------------------------- | :---------------------------------------------------------- |
| T _extends_ [`ListAttributes`](prosemirror-flat-list.md#listattributes) | [`ListAttributes`](prosemirror-flat-list.md#listattributes) |

#### Parameters

| Parameter | Type                                                                                                |
| :-------- | :-------------------------------------------------------------------------------------------------- |
| regexp    | [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) |
| getAttrs  | `T` \| (`matches`: `RegExpMatchArray`) => `T`                                                       |

#### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)

---

## Plugins

### ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

#### Hierarchy

- [`DOMSerializer`](https://prosemirror.net/docs/ref/#model.DOMSerializer).**ListDOMSerializer**

#### Constructors

#### constructor()

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

> **new ListDOMSerializer**(nodes: `object`, marks: `object`): [`ListDOMSerializer`](prosemirror-flat-list.md#listdomserializer)

##### Parameters

| Parameter | Type | Description                       |
| :-------- | :--- | :-------------------------------- |
| nodes     | \{}  | The node serialization functions. |
| marks     | \{}  | The mark serialization functions. |

##### Returns

[`ListDOMSerializer`](prosemirror-flat-list.md#listdomserializer)

##### Inherited from

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

> `Static` **fromSchema**(schema: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\>): [`ListDOMSerializer`](prosemirror-flat-list.md#listdomserializer)

###### Parameters

| Parameter | Type                                                                       |
| :-------- | :------------------------------------------------------------------------- |
| schema    | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

###### Returns

[`ListDOMSerializer`](prosemirror-flat-list.md#listdomserializer)

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

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](prosemirror-flat-list.md#listdomserializer).

> **createListClipboardPlugin**(schema: [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\>): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

#### Parameters

| Parameter | Type                                                                       |
| :-------- | :------------------------------------------------------------------------- |
| schema    | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createListEventPlugin()

Handle DOM events for list.

> **createListEventPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createListNodeView()

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

> **createListNodeView**(
> node: [`Node`](https://prosemirror.net/docs/ref/#model.Node),
> view: [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView),
> getPos: `Function`,
> decorations: _readonly_ [`Decoration`](https://prosemirror.net/docs/ref/#view.Decoration)[],
> innerDecorations: [`DecorationSource`](https://prosemirror.net/docs/ref/#view.DecorationSource)): [`NodeView`](https://prosemirror.net/docs/ref/#view.NodeView)

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

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](prosemirror-flat-list.md#createlisteventplugin)
- [createListRenderingPlugin](prosemirror-flat-list.md#createlistrenderingplugin)
- [createListClipboardPlugin](prosemirror-flat-list.md#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](prosemirror-flat-list.md#createsafariinputmethodworkaroundplugin)

> **createListPlugins**(\_\_namedParameters: `object`): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)[]

#### Parameters

| Parameter           | Type     |
| :------------------ | :------- |
| \_\_namedParameters | `object` |

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)[]

---

### createListRenderingPlugin()

Handle the list node rendering.

> **createListRenderingPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

### createSafariInputMethodWorkaroundPlugin()

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

> **createSafariInputMethodWorkaroundPlugin**(): [`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

#### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

---

## Schema

### ListKind

> **ListKind**: "bullet" \| "ordered" \| "task" \| "toggle"

All default list node kinds.

---

### createListSpec()

Return the spec for list node.

> **createListSpec**(): [`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

#### Returns

[`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

---

### createParseDomRules()

Returns a set of rules for parsing HTML into ProseMirror list nodes.

> **createParseDomRules**(): _readonly_ [`ParseRule`](https://prosemirror.net/docs/ref/#model.ParseRule)[]

#### Returns

_readonly_ [`ParseRule`](https://prosemirror.net/docs/ref/#model.ParseRule)[]

---

### listToDOM()

Renders a list node to DOM output spec.

> **listToDOM**(\_\_namedParameters: [`ListToDOMOptions`](prosemirror-flat-list.md#listtodomoptions)): [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)

#### Parameters

| Parameter           | Type                                                            |
| :------------------ | :-------------------------------------------------------------- |
| \_\_namedParameters | [`ListToDOMOptions`](prosemirror-flat-list.md#listtodomoptions) |

#### Returns

[`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)

---
