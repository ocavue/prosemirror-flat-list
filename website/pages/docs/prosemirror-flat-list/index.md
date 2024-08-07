# prosemirror-flat-list

## ListDOMSerializer

A custom DOM serializer class that can serialize flat list nodes into native
HTML list elements (i.e. `<ul>` and `<ol>`).

### Extends

- [`DOMSerializer`](https://prosemirror.net/docs/ref/#model.DOMSerializer)

### Constructors

#### new ListDOMSerializer()

```ts
new ListDOMSerializer(nodes: {}, marks: {}): ListDOMSerializer
```

Create a serializer. `nodes` should map node names to functions
that take a node and return a description of the corresponding
DOM. `marks` does the same for mark names, but also gets an
argument that tells it whether the mark's content is block or
inline content (for typical use, it'll always be inline). A mark
serializer may be `null` to indicate that marks of that type
should not be serialized.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `nodes` | `object` | The node serialization functions. |
| `marks` | `object` | The mark serialization functions. |

##### Returns

[`ListDOMSerializer`](index.md#listdomserializer)

##### Inherited from

`DOMSerializer.constructor`

### Methods

#### serializeFragment()

```ts
serializeFragment(
   fragment: Fragment, 
   options?: {
  document: Document;
 }, 
   target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment
```

Serialize the content of this fragment to a DOM fragment. When
not in the browser, the `document` option, containing a DOM
document, should be passed so that the serializer can create
nodes.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `fragment` | [`Fragment`](https://prosemirror.net/docs/ref/#model.Fragment) |
| `options`? | `object` |
| `options.document`? | [`Document`](https://developer.mozilla.org/docs/Web/API/Document) |
| `target`? | [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment) |

##### Returns

[`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment)

##### Overrides

`DOMSerializer.serializeFragment`

#### fromSchema()

```ts
static fromSchema(schema: Schema<any, any>): ListDOMSerializer
```

Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
properties in a schema's node and mark specs.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

##### Returns

[`ListDOMSerializer`](index.md#listdomserializer)

##### Overrides

`DOMSerializer.fromSchema`

#### nodesFromSchema()

```ts
static nodesFromSchema(schema: Schema<any, any>): {}
```

Gather the serializers in a schema's node specs into an object.
This can be useful as a base to build a custom serializer from.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

##### Returns

```ts
{}
```

##### Overrides

`DOMSerializer.nodesFromSchema`

***

## DedentListOptions

### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

## IndentListOptions

### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `from?` | `number` | `state.selection.from` | A optional from position to indent. |
| `to?` | `number` | `state.selection.to` | A optional to position to indent. |

***

## ListAttributes

### Properties

| Property | Type |
| ------ | ------ |
| `checked?` | `boolean` |
| `collapsed?` | `boolean` |
| `kind?` | `string` |
| `order?` | `null` \| `number` |

***

## ListToDOMOptions

### Properties

| Property | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `getAttributes?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => [`Record`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)\<`string`, `undefined` \| `string`\> | `undefined` | An optional function to get the attributes added to HTML element. |
| `getMarkers?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `null` \| [`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)[] | `undefined` | An optional function to get elements inside `<div class="list-marker">`. Return `null` to hide the marker. |
| `nativeList?` | `boolean` | `false` | If `true`, the list will be rendered as a native `<ul>` or `<ol>` element. You might want to use [joinListElements](index.md#joinlistelements) to join the list elements afterward. |
| `node` | [`Node`](https://prosemirror.net/docs/ref/#model.Node) | `undefined` | The list node to be rendered. |

***

## ProsemirrorNodeJSON

### Properties

| Property | Type |
| ------ | ------ |
| `attrs?` | [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs) |
| `content?` | [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson)[] |
| `marks?` | (`string` \| \{ `attrs`: [`Attrs`](https://prosemirror.net/docs/ref/#model.Attrs); `type`: `string`; \})[] |
| `text?` | `string` |
| `type` | `string` |

***

## ToggleCollapsedOptions

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `collapsed?` | `boolean` | If this value exists, the command will set the `collapsed` attribute to this value instead of toggle it. |
| `isToggleable?` | (`node`: [`Node`](https://prosemirror.net/docs/ref/#model.Node)) => `boolean` | An optional function to accept a list node and return whether or not this node can toggle its `collapsed` attribute. |

***

## UnwrapListOptions

### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| `kind?` | `string` | If given, only this kind of list will be unwrap. |

***

## ListInputRuleAttributesGetter()\<T\>

```ts
type ListInputRuleAttributesGetter<T>: (options: {
  attributes: T;
  match: RegExpMatchArray;
 }) => T;
```

A callback function to get the attributes for a list input rule.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | `object` | - |
| `options.attributes`? | `T` | The previous attributes of the existing list node, if it exists. |
| `options.match` | `RegExpMatchArray` | The match result of the regular expression. |

### Returns

`T`

***

## ListKind

```ts
type ListKind: "bullet" | "ordered" | "task" | "toggle";
```

All default list node kinds.

***

## WrapInListGetAttrs\<T\>

```ts
type WrapInListGetAttrs<T>: T | (range: NodeRange) => T | null;
```

The list node attributes or a callback function to take the current
selection block range and return list node attributes. If this callback
function returns null, the command won't do anything.

### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`ListAttributes`](index.md#listattributes) |

***

## listInputRules

```ts
const listInputRules: InputRule[];
```

All input rules for lists.

***

## listKeymap

```ts
const listKeymap: {
  Backspace: backspaceCommand;
  Delete: deleteCommand;
  Enter: enterCommand;
  Mod-[: Command;
  Mod-]: Command;
};
```

Returns an object containing the keymap for the list commands.

- `Enter`: See [enterCommand](index.md#entercommand).
- `Backspace`: See [backspaceCommand](index.md#backspacecommand).
- `Delete`: See [deleteCommand](index.md#deletecommand).
- `Mod-[`: Decrease indentation. See [createDedentListCommand](index.md#creatededentlistcommand).
- `Mod-]`: Increase indentation. See [createIndentListCommand](index.md#createindentlistcommand).

### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Backspace` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | backspaceCommand |
| `Delete` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | deleteCommand |
| `Enter` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | enterCommand |
| `Mod-[` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | - |
| `Mod-]` | [`Command`](https://prosemirror.net/docs/ref/#state.Command) | - |

***

## backspaceCommand()

```ts
function backspaceCommand(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

Keybinding for `Backspace`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinListUp](index.md#joinlistup)
- [joinCollapsedListBackward](index.md#joincollapsedlistbackward)
- [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
- [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## createDedentListCommand()

```ts
function createDedentListCommand(options?: DedentListOptions): Command
```

Returns a command function that decreases the indentation of selected list nodes.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`DedentListOptions`](index.md#dedentlistoptions) |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createIndentListCommand()

```ts
function createIndentListCommand(options?: IndentListOptions): Command
```

Returns a command function that increases the indentation of selected list
nodes.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`IndentListOptions`](index.md#indentlistoptions) |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createListClipboardPlugin()

```ts
function createListClipboardPlugin(schema: Schema<any, any>): Plugin
```

Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
clipboard. See [ListDOMSerializer](index.md#listdomserializer).

### Parameters

| Parameter | Type |
| ------ | ------ |
| `schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

## createListEventPlugin()

```ts
function createListEventPlugin(): Plugin
```

Handle DOM events for list.

### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

## createListNodeView()

```ts
function createListNodeView(
   node: Node, 
   view: EditorView, 
   getPos: () => undefined | number, 
   decorations: readonly Decoration[], 
   innerDecorations: DecorationSource): NodeView
```

A simple node view that is used to render the list node. It ensures that the
list node get updated when its marker styling should changes.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | [`Node`](https://prosemirror.net/docs/ref/#model.Node) |
| `view` | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |
| `getPos` | () => `undefined` \| `number` |
| `decorations` | readonly [`Decoration`](https://prosemirror.net/docs/ref/#view.Decoration)[] |
| `innerDecorations` | [`DecorationSource`](https://prosemirror.net/docs/ref/#view.DecorationSource) |

### Returns

[`NodeView`](https://prosemirror.net/docs/ref/#view.NodeView)

***

## createListPlugins()

```ts
function createListPlugins(__namedParameters: {
  schema: Schema<any, any>;
 }): Plugin[]
```

This function returns an array of plugins that are required for list to work.

The plugins are shown below. You can pick and choose which plugins you want
to use if you want to customize some behavior.

- [createListEventPlugin](index.md#createlisteventplugin)
- [createListRenderingPlugin](index.md#createlistrenderingplugin)
- [createListClipboardPlugin](index.md#createlistclipboardplugin)
- [createSafariInputMethodWorkaroundPlugin](index.md#createsafariinputmethodworkaroundplugin)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.schema` | [`Schema`](https://prosemirror.net/docs/ref/#model.Schema)\<`any`, `any`\> |

### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)[]

***

## createListRenderingPlugin()

```ts
function createListRenderingPlugin(): Plugin
```

Handle the list node rendering.

### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

## createListSpec()

```ts
function createListSpec(): NodeSpec
```

Return the spec for list node.

### Returns

[`NodeSpec`](https://prosemirror.net/docs/ref/#model.NodeSpec)

***

## createMoveListCommand()

```ts
function createMoveListCommand(direction: "up" | "down"): Command
```

Returns a command function that moves up or down selected list nodes.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `direction` | `"up"` \| `"down"` |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createParseDomRules()

```ts
function createParseDomRules(): readonly TagParseRule[]
```

Returns a set of rules for parsing HTML into ProseMirror list nodes.

### Returns

readonly [`TagParseRule`](https://prosemirror.net/docs/ref/#model.TagParseRule)[]

***

## createSafariInputMethodWorkaroundPlugin()

```ts
function createSafariInputMethodWorkaroundPlugin(): Plugin
```

Return a plugin as a workaround for a bug in Safari that causes the composition
based IME to remove the empty HTML element with CSS `position: relative`.

See also https://github.com/ProseMirror/prosemirror/issues/934

### Returns

[`Plugin`](https://prosemirror.net/docs/ref/#state.Plugin)

***

## createSplitListCommand()

```ts
function createSplitListCommand(): Command
```

Returns a command that split the current list node.

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createToggleCollapsedCommand()

```ts
function createToggleCollapsedCommand(__namedParameters: ToggleCollapsedOptions): Command
```

Return a command function that toggle the `collapsed` attribute of the list node.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`ToggleCollapsedOptions`](index.md#togglecollapsedoptions) |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createToggleListCommand()

```ts
function createToggleListCommand<T>(attrs: T): Command
```

Returns a command function that wraps the selection in a list with the given
type and attributes, or change the list kind if the selection is already in
another kind of list, or unwrap the selected list if otherwise.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `attrs` | `T` | **`Public`** The list node attributes to toggle. |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createUnwrapListCommand()

```ts
function createUnwrapListCommand(options?: UnwrapListOptions): Command
```

Returns a command function that unwraps the list around the selection.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `options`? | [`UnwrapListOptions`](index.md#unwraplistoptions) |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## createWrapInListCommand()

```ts
function createWrapInListCommand<T>(getAttrs: WrapInListGetAttrs<T>): Command
```

Returns a command function that wraps the selection in a list with the given
type and attributes.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `getAttrs` | [`WrapInListGetAttrs`](index.md#wrapinlistgetattrst)\<`T`\> |

### Returns

[`Command`](https://prosemirror.net/docs/ref/#state.Command)

***

## deleteCommand()

```ts
function deleteCommand(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

Keybinding for `Delete`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
- [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
- [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## enterCommand()

```ts
function enterCommand(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

Keybinding for `Enter`. It's chained with following commands:

- [protectCollapsed](index.md#protectcollapsed)
- [createSplitListCommand](index.md#createsplitlistcommand)

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## findListsRange()

```ts
function findListsRange($from: ResolvedPos, $to: ResolvedPos): NodeRange | null
```

Returns a minimal block range that includes the given two positions and
represents one or multiple sibling list nodes.

### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `$from` | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | `undefined` |
| `$to` | [`ResolvedPos`](https://prosemirror.net/docs/ref/#model.ResolvedPos) | `$from` |

### Returns

[`NodeRange`](https://prosemirror.net/docs/ref/#model.NodeRange) \| `null`

***

## isListNode()

```ts
function isListNode(node: undefined | null | Node): boolean
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `node` | `undefined` \| `null` \| [`Node`](https://prosemirror.net/docs/ref/#model.Node) |

### Returns

`boolean`

***

## isListType()

```ts
function isListType(type: NodeType): boolean
```

### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | [`NodeType`](https://prosemirror.net/docs/ref/#model.NodeType) |

### Returns

`boolean`

***

## joinCollapsedListBackward()

```ts
function joinCollapsedListBackward(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

If the selection is empty and at the start of a block, and there is a
collapsed list node right before the cursor, move current block and append it
to the first child of the collapsed list node (i.e. skip the hidden content).

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## joinListElements()

```ts
function joinListElements<T>(parent: T): T
```

Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.

### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`Element`](https://developer.mozilla.org/docs/Web/API/Element) \| [`DocumentFragment`](https://developer.mozilla.org/docs/Web/API/DocumentFragment) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `parent` | `T` |

### Returns

`T`

***

## joinListUp()

```ts
function joinListUp(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

If the text cursor is at the start of the first child of a list node, lift
all content inside the list. If the text cursor is at the start of the last
child of a list node, lift this child.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## listToDOM()

```ts
function listToDOM(__namedParameters: ListToDOMOptions): DOMOutputSpec
```

Renders a list node to DOM output spec.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | [`ListToDOMOptions`](index.md#listtodomoptions) |

### Returns

[`DOMOutputSpec`](https://prosemirror.net/docs/ref/#model.DOMOutputSpec)

***

## migrateDocJSON()

```ts
function migrateDocJSON(docJSON: ProsemirrorNodeJSON): ProsemirrorNodeJSON | null
```

Migrate a ProseMirror document JSON object from the old list structure to the
new. A new document JSON object is returned if the document is updated,
otherwise `null` is returned.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `docJSON` | [`ProsemirrorNodeJSON`](index.md#prosemirrornodejson) |

### Returns

[`ProsemirrorNodeJSON`](index.md#prosemirrornodejson) \| `null`

***

## protectCollapsed()

```ts
function protectCollapsed(
   state: EditorState, 
   dispatch?: (tr: Transaction) => void, 
   view?: EditorView): boolean
```

This command will protect the collapsed items from being deleted.

If current selection contains a collapsed item, we don't want the user to
delete this selection by pressing Backspace or Delete, because this could
be unintentional.

In such case, we will stop the delete action and expand the collapsed items
instead. Therefore the user can clearly know what content he is trying to
delete.

### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | [`EditorState`](https://prosemirror.net/docs/ref/#state.EditorState) |
| `dispatch`? | (`tr`: [`Transaction`](https://prosemirror.net/docs/ref/#state.Transaction)) => `void` |
| `view`? | [`EditorView`](https://prosemirror.net/docs/ref/#view.EditorView) |

### Returns

`boolean`

***

## wrappingListInputRule()

```ts
function wrappingListInputRule<T>(regexp: RegExp, getAttrs: T | ListInputRuleAttributesGetter<T>): InputRule
```

Build an input rule for automatically wrapping a textblock into a list node
when a given string is typed.

### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* [`ListAttributes`](index.md#listattributes) | [`ListAttributes`](index.md#listattributes) |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `regexp` | [`RegExp`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/RegExp) |
| `getAttrs` | `T` \| [`ListInputRuleAttributesGetter`](index.md#listinputruleattributesgettert)\<`T`\> |

### Returns

[`InputRule`](https://prosemirror.net/docs/ref/#inputrules.InputRule)
