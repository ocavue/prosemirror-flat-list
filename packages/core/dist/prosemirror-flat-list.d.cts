import { Attrs, DOMOutputSpec, DOMSerializer, Fragment, Node, Node as Node$1, NodeRange, NodeSpec, NodeType, ResolvedPos, Schema, Slice, TagParseRule } from "prosemirror-model";
import * as prosemirror_state0 from "prosemirror-state";
import { Command, EditorState, Plugin, Transaction } from "prosemirror-state";
import { EditorView, NodeViewConstructor } from "prosemirror-view";
import { InputRule } from "prosemirror-inputrules";

//#region src/commands/dedent-list.d.ts
/**
 * @public @group Commands
 */
interface DedentListOptions {
  /**
   * A optional from position to indent.
   *
   * @defaultValue `state.selection.from`
   */
  from?: number;
  /**
   * A optional to position to indent.
   *
   * @defaultValue `state.selection.to`
   */
  to?: number;
}
/**
 * Returns a command function that decreases the indentation of selected list nodes.
 *
 * @public @group Commands
 */
declare function createDedentListCommand(options?: DedentListOptions): Command;
//#endregion
//#region src/commands/enter-without-lift.d.ts
/**
 * This command has the same behavior as the `Enter` keybinding from
 * `prosemirror-commands`, but without the `liftEmptyBlock` command.
 *
 * @internal
 */
declare const enterWithoutLift: Command;
//#endregion
//#region src/commands/indent-list.d.ts
/**
 * @public @group Commands
 */
interface IndentListOptions {
  /**
   * A optional from position to indent.
   *
   * @defaultValue `state.selection.from`
   */
  from?: number;
  /**
   * A optional to position to indent.
   *
   * @defaultValue `state.selection.to`
   */
  to?: number;
}
/**
 * Returns a command function that increases the indentation of selected list
 * nodes.
 *
 * @public @group Commands
 */
declare function createIndentListCommand(options?: IndentListOptions): Command;
//#endregion
//#region src/commands/join-collapsed-backward.d.ts
/**
 * If the selection is empty and at the start of a block, and there is a
 * collapsed list node right before the cursor, move current block and append it
 * to the first child of the collapsed list node (i.e. skip the hidden content).
 *
 * @public @group Commands
 */
declare const joinCollapsedListBackward: Command;
//#endregion
//#region src/commands/join-list-up.d.ts
/**
 * If the text cursor is at the start of the first child of a list node, lift
 * all content inside the list. If the text cursor is at the start of the last
 * child of a list node, lift this child.
 *
 * @public @group Commands
 */
declare const joinListUp: Command;
//#endregion
//#region src/commands/keymap.d.ts
/**
 * Keybinding for `Enter`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - {@link createSplitListCommand}
 *
 * @public @group Commands
 */
declare const enterCommand: prosemirror_state0.Command;
/**
 * Keybinding for `Backspace`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - {@link joinListUp}
 * - {@link joinCollapsedListBackward}
 * - [joinTextblockBackward](https://prosemirror.net/docs/ref/#commands.joinTextblockBackward)
 * - [selectNodeBackward](https://prosemirror.net/docs/ref/#commands.selectNodeBackward)
 *
 * @public @group Commands
 *
 */
declare const backspaceCommand: prosemirror_state0.Command;
/**
 * Keybinding for `Delete`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
 * - [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)
 *
 * @public @group Commands
 *
 */
declare const deleteCommand: prosemirror_state0.Command;
/**
 * Returns an object containing the keymap for the list commands.
 *
 * - `Enter`: See {@link enterCommand}.
 * - `Backspace`: See {@link backspaceCommand}.
 * - `Delete`: See {@link deleteCommand}.
 * - `Mod-[`: Decrease indentation. See {@link createDedentListCommand}.
 * - `Mod-]`: Increase indentation. See {@link createIndentListCommand}.
 *
 * @public @group Commands
 */
declare const listKeymap: {
  Enter: prosemirror_state0.Command;
  Backspace: prosemirror_state0.Command;
  Delete: prosemirror_state0.Command;
  'Mod-[': prosemirror_state0.Command;
  'Mod-]': prosemirror_state0.Command;
};
//#endregion
//#region src/commands/move-list.d.ts
/**
 * Returns a command function that moves up or down selected list nodes.
 *
 * @public @group Commands
 *
 */
declare function createMoveListCommand(direction: 'up' | 'down'): Command;
//#endregion
//#region src/commands/protect-collapsed.d.ts
/**
 * This command will protect the collapsed items from being deleted.
 *
 * If current selection contains a collapsed item, we don't want the user to
 * delete this selection by pressing Backspace or Delete, because this could
 * be unintentional.
 *
 * In such case, we will stop the delete action and expand the collapsed items
 * instead. Therefore the user can clearly know what content he is trying to
 * delete.
 *
 * @public @group Commands
 *
 */
declare const protectCollapsed: Command;
//#endregion
//#region src/commands/set-safe-selection.d.ts
/**
 * If one of the selection's end points is inside a collapsed node, move the selection outside of it
 *
 * @internal
 */
declare function setSafeSelection(tr: Transaction): Transaction;
//#endregion
//#region src/commands/split-list.d.ts
/**
 * Returns a command that split the current list node.
 *
 * @public @group Commands
 *
 */
declare function createSplitListCommand(): Command;
/**
 * @internal
 */
declare function doSplitList(state: EditorState, listNode: Node$1, dispatch?: (tr: Transaction) => void): boolean;
//#endregion
//#region src/types.d.ts
/**
 * All default list node kinds.
 *
 * @public @group Schema
 */
type ListKind = 'bullet' | 'ordered' | 'task' | 'toggle';
/**
 * @public @group Schema
 */
interface ListAttributes {
  kind?: string;
  order?: number | null;
  checked?: boolean;
  collapsed?: boolean;
}
/**
 * @public @group Schema
 */
interface ProsemirrorNodeJSON {
  type: string;
  marks?: Array<{
    type: string;
    attrs?: Attrs;
  } | string>;
  text?: string;
  content?: ProsemirrorNodeJSON[];
  attrs?: Attrs;
}
//#endregion
//#region src/commands/toggle-collapsed.d.ts
/**
 * @public @group Commands
 */
interface ToggleCollapsedOptions {
  /**
   * If this value exists, the command will set the `collapsed` attribute to
   * this value instead of toggle it.
   */
  collapsed?: boolean;
  /**
   * An optional function to accept a list node and return whether or not this
   * node can toggle its `collapsed` attribute.
   */
  isToggleable?: (node: Node) => boolean;
}
/**
 * Return a command function that toggle the `collapsed` attribute of the list node.
 *
 * @public @group Commands
 */
declare function createToggleCollapsedCommand(options?: ToggleCollapsedOptions): Command;
//#endregion
//#region src/commands/toggle-list.d.ts
/**
 * Returns a command function that wraps the selection in a list with the given
 * type and attributes, or change the list kind if the selection is already in
 * another kind of list, or unwrap the selected list if otherwise.
 *
 * @public @group Commands
 */
declare function createToggleListCommand<T extends ListAttributes = ListAttributes>(
/**
 * The list node attributes to toggle.
 */
attrs: T): Command;
//#endregion
//#region src/commands/unwrap-list.d.ts
/**
 * @public @group Commands
 */
interface UnwrapListOptions {
  /**
   * If given, only this kind of list will be unwrap.
   */
  kind?: string;
}
/**
 * Returns a command function that unwraps the list around the selection.
 *
 * @public @group Commands
 */
declare function createUnwrapListCommand(options?: UnwrapListOptions): Command;
//#endregion
//#region src/commands/wrap-in-list.d.ts
/**
 * The list node attributes or a callback function to take the current
 * selection block range and return list node attributes. If this callback
 * function returns null, the command won't do anything.
 *
 * @public @group Commands
 */
type WrapInListGetAttrs<T extends ListAttributes> = T | ((range: NodeRange) => T | null);
/**
 * Returns a command function that wraps the selection in a list with the given
 * type and attributes.
 *
 * @public @group Commands
 */
declare function createWrapInListCommand<T extends ListAttributes = ListAttributes>(getAttrs: WrapInListGetAttrs<T>): Command;
//#endregion
//#region src/dom-events.d.ts
/** @internal */
declare function handleListMarkerMouseDown({
  view,
  event,
  onListClick
}: {
  view: EditorView;
  event: MouseEvent;
  onListClick?: ListClickHandler;
}): boolean;
/** @internal */
type ListClickHandler = (node: Node$1) => ListAttributes;
/** @internal */
declare const defaultListClickHandler: ListClickHandler;
//#endregion
//#region src/input-rule.d.ts
/**
 * A callback function to get the attributes for a list input rule.
 *
 * @public @group Input Rules
 */
type ListInputRuleAttributesGetter<T extends ListAttributes = ListAttributes> = (options: {
  /**
   * The match result of the regular expression.
   */
  match: RegExpMatchArray;
  /**
   * The previous attributes of the existing list node, if it exists.
   */
  attributes?: T;
}) => T;
/**
 * Build an input rule for automatically wrapping a textblock into a list node
 * when a given string is typed.
 *
 * @public @group Input Rules
 */
declare function wrappingListInputRule<T extends ListAttributes = ListAttributes>(regexp: RegExp, getAttrs: T | ListInputRuleAttributesGetter<T>): InputRule;
/**
 * All input rules for lists.
 *
 * @public @group Input Rules
 */
declare const listInputRules: InputRule[];
//#endregion
//#region src/migrate.d.ts
/**
 * Migrate a ProseMirror document JSON object from the old list structure to the
 * new. A new document JSON object is returned if the document is updated,
 * otherwise `null` is returned.
 *
 * @public
 */
declare function migrateDocJSON(docJSON: ProsemirrorNodeJSON): ProsemirrorNodeJSON | null;
//#endregion
//#region src/node-view.d.ts
/**
 * A simple node view that is used to render the list node. It ensures that the
 * list node get updated when its marker styling should changes.
 *
 * @public @group Plugins
 */
declare const createListNodeView: NodeViewConstructor;
//#endregion
//#region src/plugins/clipboard.d.ts
/**
 * Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
 * clipboard. See {@link ListDOMSerializer}.
 *
 * @public @group Plugins
 */
declare function createListClipboardPlugin(schema: Schema): Plugin;
//#endregion
//#region src/plugins/event.d.ts
/**
 * Handle DOM events for list.
 *
 * @public @group Plugins
 */
declare function createListEventPlugin(): Plugin;
//#endregion
//#region src/plugins/rendering.d.ts
/**
 * Handle the list node rendering.
 *
 * @public @group Plugins
 */
declare function createListRenderingPlugin(): Plugin;
//#endregion
//#region src/plugins/safari-workaround.d.ts
/**
 * Return a plugin as a workaround for a bug in Safari that causes the composition
 * based IME to remove the empty HTML element with CSS `position: relative`.
 *
 * See also https://github.com/ProseMirror/prosemirror/issues/934
 *
 * @public @group Plugins
 */
declare function createSafariInputMethodWorkaroundPlugin(): Plugin;
//#endregion
//#region src/plugins/index.d.ts
/**
 * This function returns an array of plugins that are required for list to work.
 *
 * The plugins are shown below. You can pick and choose which plugins you want
 * to use if you want to customize some behavior.
 *
 * - {@link createListEventPlugin}
 * - {@link createListRenderingPlugin}
 * - {@link createListClipboardPlugin}
 * - {@link createSafariInputMethodWorkaroundPlugin}
 *
 * @public @group Plugins
 */
declare function createListPlugins(options: {
  schema: Schema;
}): Plugin[];
//#endregion
//#region src/schema/node-spec.d.ts
/**
 * The default group name for list nodes. This is used to find the list node
 * type from the schema.
 *
 * @internal Schema
 */
declare const flatListGroup = "flatList";
/**
 * Return the spec for list node.
 *
 *  @public @group Schema
 */
declare function createListSpec(): NodeSpec;
//#endregion
//#region src/schema/parse-dom.d.ts
/**
 * Returns a set of rules for parsing HTML into ProseMirror list nodes.
 *
 * @public @group Schema
 */
declare function createParseDomRules(): readonly TagParseRule[];
//#endregion
//#region src/schema/to-dom.d.ts
/**
 * @public @group Schema
 */
interface ListToDOMOptions {
  /**
   * The list node to be rendered.
   */
  node: Node$1;
  /**
   * If `true`, the list will be rendered as a native `<ul>` or `<ol>` element.
   * You might want to use {@link joinListElements} to join the list elements
   * afterward.
   *
   * @defaultValue false
   */
  nativeList?: boolean;
  /**
   * An optional function to get elements inside `<div class="list-marker">`.
   * Return `null` to hide the marker.
   */
  getMarkers?: (node: Node$1) => DOMOutputSpec[] | null;
  /**
   * An optional function to get the attributes added to HTML element.
   */
  getAttributes?: (node: Node$1) => Record<string, string | undefined>;
}
/**
 * Renders a list node to DOM output spec.
 *
 * @public @group Schema
 */
declare function listToDOM(options: ListToDOMOptions): DOMOutputSpec;
/** @internal */
declare function defaultMarkerGetter(node: Node$1): DOMOutputSpec[] | null;
/** @internal */
declare function defaultAttributesGetter(node: Node$1): {
  class: string;
  'data-list-kind': string | undefined;
  'data-list-order': string | undefined;
  'data-list-checked': string | undefined;
  'data-list-collapsed': string | undefined;
  'data-list-collapsable': string | undefined;
  style: string | undefined;
};
//#endregion
//#region src/utils/find-checkbox-in-list-item.d.ts
/**
 * Finds a `<input type="checkbox">` element from a `<li>` element. It will stop
 * searching if it reaches a sub-list.
 *
 * @internal
 */
declare function findCheckboxInListItem(node: Element, depth?: number, maxDepth?: number): HTMLInputElement | void;
//#endregion
//#region src/utils/get-list-type.d.ts
/** @internal */
declare function getListType(schema: Schema): NodeType;
//#endregion
//#region src/utils/is-collapsed-list-node.d.ts
/**
 * @internal
 */
declare function isCollapsedListNode(node: Node): boolean;
//#endregion
//#region src/utils/is-list-node.d.ts
/** @public */
declare function isListNode(node: Node$1 | null | undefined): boolean;
//#endregion
//#region src/utils/is-list-type.d.ts
/** @public */
declare function isListType(type: NodeType): boolean;
//#endregion
//#region src/utils/list-range.d.ts
/**
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list nodes.
 *
 * @public
 */
declare function findListsRange($from: ResolvedPos, $to?: ResolvedPos): NodeRange | null;
/** @internal */
declare function isListsRange(range: NodeRange): boolean;
//#endregion
//#region src/utils/list-serializer.d.ts
/**
 * A custom DOM serializer class that can serialize flat list nodes into native
 * HTML list elements (i.e. `<ul>` and `<ol>`).
 *
 * @public @group Plugins
 */
declare class ListDOMSerializer extends DOMSerializer {
  static nodesFromSchema(schema: Schema): {
    [node: string]: (node: Node$1) => DOMOutputSpec;
  };
  static fromSchema(schema: Schema): ListDOMSerializer;
  serializeFragment(fragment: Fragment, options?: {
    document?: Document;
  }, target?: HTMLElement | DocumentFragment): HTMLElement | DocumentFragment;
}
/**
 * Merge adjacent <ul> elements or adjacent <ol> elements into a single list element.
 *
 * @public
 */
declare function joinListElements<T extends Element | DocumentFragment>(parent: T): T;
//#endregion
//#region src/utils/parse-integer.d.ts
/** @internal */
declare function parseInteger(attr: string | null | undefined): number | null;
//#endregion
//#region src/utils/range-to-string.d.ts
/**
 * Return a debugging string that describes this range.
 *
 * @internal
 */
declare function rangeToString(range: NodeRange): string;
//#endregion
//#region src/utils/unwrap-list-slice.d.ts
/**
 * Reduce the open depth of a slice if it only contains a single list node. When
 * copying some text from a deep nested list node, we don't want to paste the
 * entire list structure into the document later.
 *
 * @internal
 */
declare function unwrapListSlice(slice: Slice): Slice;
//#endregion
export { type DedentListOptions, type IndentListOptions, type ListAttributes, type ListClickHandler, ListDOMSerializer, type ListInputRuleAttributesGetter, type ListKind, type ListToDOMOptions, type Node as ProsemirrorNode, type ProsemirrorNodeJSON, type ToggleCollapsedOptions, type UnwrapListOptions, type WrapInListGetAttrs, backspaceCommand, createDedentListCommand, createIndentListCommand, createListClipboardPlugin, createListEventPlugin, createListNodeView, createListPlugins, createListRenderingPlugin, createListSpec, createMoveListCommand, createParseDomRules, createSafariInputMethodWorkaroundPlugin, createSplitListCommand, createToggleCollapsedCommand, createToggleListCommand, createUnwrapListCommand, createWrapInListCommand, defaultAttributesGetter, defaultListClickHandler, defaultMarkerGetter, deleteCommand, doSplitList, enterCommand, enterWithoutLift, findCheckboxInListItem, findListsRange, flatListGroup, getListType, handleListMarkerMouseDown, isCollapsedListNode, isListNode, isListType, isListsRange, joinCollapsedListBackward, joinListElements, joinListUp, listInputRules, listKeymap, listToDOM, migrateDocJSON, parseInteger, protectCollapsed, rangeToString, setSafeSelection, unwrapListSlice, wrappingListInputRule };
//# sourceMappingURL=prosemirror-flat-list.d.cts.map