# prosemirror-flat-list

## Plugins

### ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

#### Hierarchy

- [`DOMSerializer`]( https://prosemirror.net/docs/ref/#model.DOMSerializer ).**ListDOMSerializer**

#### Constructors

#### constructor()

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

##### Signature

```ts
new ListDOMSerializer(nodes: object, marks: object): ListDOMSerializer;
```

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | {  } | The node serialization functions. |
| `marks` | {  } | The mark serialization functions. |

##### Returns

[`ListDOMSerializer`](prosemirror_flat_list.md#listdomserializer)

Inherited from: DOMSerializer.constructor

#### Methods

##### serializeFragment()

###### Signature

```ts
serializeFragment(fragment: Fragment, options?: object, target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment;
```

###### Parameters

| Name | Type |
| :------ | :------ |
| `fragment` | [`Fragment`]( https://prosemirror.net/docs/ref/#model.Fragment ) |
| `options?` | `object` |
| `options.document?` | [`Document`]( https://developer.mozilla.org/en-US/docs/Web/API/Document ) |
| `target?` | [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment ) |

###### Returns

[`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment )

Overrides: DOMSerializer.serializeFragment

##### fromSchema()

###### Signature

```ts
Static fromSchema(schema: Schema<any, any>): ListDOMSerializer;
```

###### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )\<`any`, `any`\> |

###### Returns

[`ListDOMSerializer`](prosemirror_flat_list.md#listdomserializer)

Overrides: DOMSerializer.fromSchema

##### nodesFromSchema()

###### Signature

```ts
Static nodesFromSchema(schema: Schema<any, any>): object;
```

###### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )\<`any`, `any`\> |

###### Returns

`object`

Overrides: DOMSerializer.nodesFromSchema

---

### createListClipboardPlugin()

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](prosemirror_flat_list.md#listdomserializer).

#### Signature

```ts
createListClipboardPlugin(schema: Schema<any, any>): Plugin;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )\<`any`, `any`\> |

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

---

### createListEventPlugin()

Handle DOM events for list.

#### Signature

```ts
createListEventPlugin(): Plugin;
```

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

---

### createListNodeView()

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

#### Signature

```ts
createListNodeView(
  node: Node, 
  view: EditorView, 
  getPos: Function, 
  decorations: readonly Decoration[], 
  innerDecorations: DecorationSource): NodeView;
```

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

---

### createListPlugins()

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](prosemirror_flat_list.md#createlisteventplugin)
- [createListRenderingPlugin](prosemirror_flat_list.md#createlistrenderingplugin)
- [createListClipboardPlugin](prosemirror_flat_list.md#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](prosemirror_flat_list.md#createsafariinputmethodworkaroundplugin)

#### Signature

```ts
createListPlugins(«destructured»: object): Plugin[];
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `object` |
| › `schema` | [`Schema`]( https://prosemirror.net/docs/ref/#model.Schema )\<`any`, `any`\> |

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )[]

---

### createListRenderingPlugin()

Handle the list node rendering.

#### Signature

```ts
createListRenderingPlugin(): Plugin;
```

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

---

### createSafariInputMethodWorkaroundPlugin()

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

#### Signature

```ts
createSafariInputMethodWorkaroundPlugin(): Plugin;
```

#### Returns

[`Plugin`]( https://prosemirror.net/docs/ref/#state.Plugin )

## Interfaces

### DedentListOptions

#### Properties

##### from?

> `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to?

> `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### IndentListOptions

#### Properties

##### from?

> `number`

A optional from position to indent.

###### Default Value

`state.selection.from`

##### to?

> `number`

A optional to position to indent.

###### Default Value

`state.selection.to`

---

### ListAttributes

#### Properties

##### checked?

> `boolean`

##### collapsed?

> `boolean`

##### kind?

> [`ListKind`](prosemirror_flat_list.md#listkind)

##### order?

> `null` \| `number`

---

### ListToDOMOptions

#### Properties

##### getAttributes?

> `Function`

###### Type declaration

An optional function to get the attributes added to HTML element.

####### Signature

```ts
(node: Node): Record<string, undefined | string>;
```

####### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

####### Returns

`Record`\<`string`, `undefined` \| `string`\>

##### getMarkers?

> `Function`

###### Type declaration

An optional function to get elements inside `<div class="list-marker">`.
Return `null` to hide the marker.

####### Signature

```ts
(node: Node): null | DOMOutputSpec[];
```

####### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

####### Returns

`null` \| [`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )[]

##### nativeList?

> `boolean`

If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.
You might want to use [joinListElements](prosemirror_flat_list.md#joinlistelements) to join the list elements
afterward.

###### Default Value

false

##### node

> [`Node`]( https://prosemirror.net/docs/ref/#model.Node )

The list node to be rendered.

---

### ProsemirrorNodeJSON

#### Properties

##### attrs?

> [`Attrs`]( https://prosemirror.net/docs/ref/#model.Attrs )

##### content?

> [`ProsemirrorNodeJSON`](prosemirror_flat_list.md#prosemirrornodejson)[]

##### marks?

> (`string` \| {
    `attrs`?: [`Attrs`]( https://prosemirror.net/docs/ref/#model.Attrs );
    `type`: `string`;
})[]

##### text?

> `string`

##### type

> `string`

---

### ToggleCollapsedOptions

#### Properties

##### collapsed?

> `boolean`

If this value exists, the command will set the `collapsed` attribute to
this value instead of toggle it.

##### isToggleable?

> `Function`

###### Type declaration

An optional function to accept a list node and return whether or not this
node can toggle its `collapsed` attribute.

####### Signature

```ts
(node: Node): boolean;
```

####### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

####### Returns

`boolean`

## Schema

### ListKind

> `"bullet"` \| `"ordered"` \| `"task"` \| `"toggle"`

All default list node kinds.

---

### flatListGroup

> **`Const`** `"flatList"`

The default group name for list nodes.

---

### createListSpec()

Return the spec for list node.

#### Signature

```ts
createListSpec(): NodeSpec;
```

#### Returns

[`NodeSpec`]( https://prosemirror.net/docs/ref/#model.NodeSpec )

---

### createParseDomRules()

Returns a set of rules for parsing HTML into ProseMirror list nodes.

#### Signature

```ts
createParseDomRules(): readonly ParseRule[];
```

#### Returns

readonly [`ParseRule`]( https://prosemirror.net/docs/ref/#model.ParseRule )[]

---

### listToDOM()

Renders a list node to DOM output spec.

#### Signature

```ts
listToDOM(«destructured»: ListToDOMOptions): DOMOutputSpec;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ListToDOMOptions`](prosemirror_flat_list.md#listtodomoptions) |

#### Returns

[`DOMOutputSpec`]( https://prosemirror.net/docs/ref/#model.DOMOutputSpec )

## Input Rules

### listInputRules

> **`Const`** [`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )[]

All input rules for lists.

---

### wrappingListInputRule()

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

#### Signature

```ts
wrappingListInputRule<T>(regexp: RegExp, getAttrs: T | (matches: RegExpMatchArray) => T): InputRule;
```

#### Type parameters

- `T` *extends* [`ListAttributes`](prosemirror_flat_list.md#listattributes) = [`ListAttributes`](prosemirror_flat_list.md#listattributes)

#### Parameters

| Name | Type |
| :------ | :------ |
| `regexp` | [`RegExp`]( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp ) |
| `getAttrs` | `T` \| (`matches`: `RegExpMatchArray`) => `T` |

#### Returns

[`InputRule`]( https://prosemirror.net/docs/ref/#inputrules.InputRule )

## Commands

### listKeymap

> **`Const`** `object`

```ts
{
    Backspace: Command;
    Delete: Command;
    Enter: Command;
    Mod-[: Command;
    Mod-]: Command;
}
```

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](prosemirror_flat_list.md#entercommand).
- `Backspace`: See [backspaceCommand](prosemirror_flat_list.md#backspacecommand).
- `Delete`: See [deleteCommand](prosemirror_flat_list.md#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](prosemirror_flat_list.md#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](prosemirror_flat_list.md#createindentlistcommand).

#### Type declaration

| Member | Type |
| :------ | :------ |
| `Backspace` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Delete` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Enter` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-[` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |
| `Mod-]` | [`Command`]( https://prosemirror.net/docs/ref/#state.Command ) |

---

### backspaceCommand()

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](prosemirror_flat_list.md#joinlistup)
- [joinCollapsedListBackward](prosemirror_flat_list.md#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

#### Signature

```ts
backspaceCommand(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

---

### createDedentListCommand()

Returns a command function that decreases the indentation of selected list nodes.

#### Signature

```ts
createDedentListCommand(options?: DedentListOptions): Command;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`DedentListOptions`](prosemirror_flat_list.md#dedentlistoptions) |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### createIndentListCommand()

Returns a command function that increases the indentation of selected list
nodes.

#### Signature

```ts
createIndentListCommand(options?: IndentListOptions): Command;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`IndentListOptions`](prosemirror_flat_list.md#indentlistoptions) |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### createMoveListCommand()

Returns a command function that moves up or down selected list nodes.

#### Signature

```ts
createMoveListCommand(direction: "up" | "down"): Command;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `direction` | `"up"` \| `"down"` |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### createSplitListCommand()

Returns a command that split the current list node.

#### Signature

```ts
createSplitListCommand(): Command;
```

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### createToggleCollapsedCommand()

Return a command function that toggle the `collapsed` attribute of the list node.

#### Signature

```ts
createToggleCollapsedCommand(«destructured»: ToggleCollapsedOptions = {}): Command;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`ToggleCollapsedOptions`](prosemirror_flat_list.md#togglecollapsedoptions) |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### createWrapInListCommand()

Returns a command function that wraps the selection in a list with the given
type an attributes.

#### Signature

```ts
createWrapInListCommand<T>(getAttrs: T | (range: NodeRange) => null | T): Command;
```

#### Type parameters

- `T` *extends* [`ListAttributes`](prosemirror_flat_list.md#listattributes) = [`ListAttributes`](prosemirror_flat_list.md#listattributes)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `getAttrs` | `T` \| (`range`: [`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange )) => `null` \| `T` | The list node attributes or a callback function to take the current selection block range and return list node attributes. If this callback function returns null, the command won't do anything. |

#### Returns

[`Command`]( https://prosemirror.net/docs/ref/#state.Command )

---

### deleteCommand()

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

#### Signature

```ts
deleteCommand(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

---

### enterCommand()

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](prosemirror_flat_list.md#protectcollapsed)
- [createSplitListCommand](prosemirror_flat_list.md#createsplitlistcommand)

#### Signature

```ts
enterCommand(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

---

### joinCollapsedListBackward()

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

#### Signature

```ts
joinCollapsedListBackward(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

---

### joinListUp()

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

#### Signature

```ts
joinListUp(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

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

#### Signature

```ts
protectCollapsed(state: EditorState, dispatch?: Function, view?: EditorView): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `state` | [`EditorState`]( https://prosemirror.net/docs/ref/#state.EditorState ) |
| `dispatch?` | (`tr`: [`Transaction`]( https://prosemirror.net/docs/ref/#state.Transaction )) => `void` |
| `view?` | [`EditorView`]( https://prosemirror.net/docs/ref/#view.EditorView ) |

#### Returns

`boolean`

## Functions

### findListsRange()

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

#### Signature

```ts
findListsRange($from: ResolvedPos, $to: ResolvedPos = $from): NodeRange | null;
```

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `$from` | [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) | `undefined` |
| `$to` | [`ResolvedPos`]( https://prosemirror.net/docs/ref/#model.ResolvedPos ) | `$from` |

#### Returns

[`NodeRange`]( https://prosemirror.net/docs/ref/#model.NodeRange ) \| `null`

---

### isListNode()

#### Signature

```ts
isListNode(node: undefined | null | Node): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | `undefined` \| `null` \| [`Node`]( https://prosemirror.net/docs/ref/#model.Node ) |

#### Returns

`boolean`

---

### isListType()

#### Signature

```ts
isListType(type: NodeType): boolean;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`NodeType`]( https://prosemirror.net/docs/ref/#model.NodeType ) |

#### Returns

`boolean`

---

### joinListElements()

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

#### Signature

```ts
joinListElements<T>(parent: T): T;
```

#### Type parameters

- `T` *extends* [`Element`]( https://developer.mozilla.org/en-US/docs/Web/API/Element ) \| [`DocumentFragment`]( https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment )

#### Parameters

| Name | Type |
| :------ | :------ |
| `parent` | `T` |

#### Returns

`T`

---

### migrateDocJSON()

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

#### Signature

```ts
migrateDocJSON(docJSON: ProsemirrorNodeJSON): ProsemirrorNodeJSON | null;
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `docJSON` | [`ProsemirrorNodeJSON`](prosemirror_flat_list.md#prosemirrornodejson) |

#### Returns

[`ProsemirrorNodeJSON`](prosemirror_flat_list.md#prosemirrornodejson) \| `null`
