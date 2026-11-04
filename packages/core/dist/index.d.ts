import { Attrs, DOMOutputSpec, DOMSerializer, Fragment, Node, Node as Node$1, NodeRange, NodeSpec, NodeType, ResolvedPos, Schema, Slice, TagParseRule } from "prosemirror-model";
import { Command, EditorState, Plugin, Transaction } from "prosemirror-state";
import { InputRule } from "prosemirror-inputrules";
import { EditorView, NodeViewConstructor } from "prosemirror-view";
/**
 * @public
 *
 * @group Commands
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
  /**
   * When `true`, the command never leaves a list node whose first child is a
   * list node (a list node with a hidden marker). The blocks after the
   * dedented block move one level up with it instead of keeping their depth
   * inside such a node, so a block is never more than one level deeper than
   * the block before it.
   *
   * @defaultValue `false`
   */
  strict?: boolean;
}
/**
 * Returns a command function that decreases the indentation of selected list nodes.
 *
 * @public
 *
 * @group Commands
 */
export declare function createDedentListCommand(options?: DedentListOptions): Command;
/**
 * This command has the same behavior as the `Enter` keybinding from
 * `prosemirror-commands`, but without the `liftEmptyBlock` command.
 *
 * @internal
 */
export declare const enterWithoutLift: Command;
/**
 * @public
 *
 * @group Commands
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
  /**
   * When `true`, the command never leaves a list node whose first child is a
   * list node (a list node with a hidden marker). It returns `false` instead
   * of indenting a block that has no previous list sibling to move into, so a
   * block is never more than one level deeper than the block before it.
   *
   * @defaultValue `false`
   */
  strict?: boolean;
}
/**
 * Returns a command function that increases the indentation of selected list
 * nodes.
 *
 * @public
 *
 * @group Commands
 */
export declare function createIndentListCommand(options?: IndentListOptions): Command;
/**
 * If the selection is empty and at the start of a block, and there is a
 * collapsed list node right before the cursor, move current block and append it
 * to the first child of the collapsed list node (i.e. skip the hidden content).
 *
 * @public
 *
 * @group Commands
 */
export declare const joinCollapsedListBackward: Command;
/**
 * If the text cursor is at the start of the first child of a list node, lift
 * all content inside the list. If the text cursor is at the start of the last
 * child of a list node, lift this child.
 *
 * @public
 *
 * @group Commands
 */
export declare const joinListUp: Command;
/**
 * Keybinding for `Enter`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - {@link createSplitListCommand}
 *
 * @public
 *
 * @group Commands
 */
export declare const enterCommand: Command;
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
 * @public
 *
 * @group Commands
 *
 */
export declare const backspaceCommand: Command;
/**
 * Keybinding for `Delete`. It's chained with following commands:
 *
 * - {@link protectCollapsed}
 * - [deleteSelection](https://prosemirror.net/docs/ref/#commands.deleteSelection)
 * - [joinTextblockForward](https://prosemirror.net/docs/ref/#commands.joinTextblockForward)
 * - [selectNodeForward](https://prosemirror.net/docs/ref/#commands.selectNodeForward)
 *
 * @public
 *
 * @group Commands
 *
 */
export declare const deleteCommand: Command;
/**
 * @public
 *
 * @group Commands
 */
interface ListKeymapOptions {
  /**
   * The `strict` option passed to {@link createSplitListCommand},
   * {@link createDedentListCommand} and {@link createIndentListCommand}.
   *
   * @defaultValue `false`
   */
  strict?: boolean;
}
/**
 * Returns an object containing the keymap for the list commands.
 *
 * - `Enter`: See {@link enterCommand}.
 * - `Backspace`: See {@link backspaceCommand}.
 * - `Delete`: See {@link deleteCommand}.
 * - `Mod-[`: Decrease indentation. See {@link createDedentListCommand}.
 * - `Mod-]`: Increase indentation. See {@link createIndentListCommand}.
 *
 * @public
 *
 * @group Commands
 */
export declare function createListKeymap(options?: ListKeymapOptions): Record<string, Command>;
/**
 * The keymap returned by {@link createListKeymap} with the default options.
 *
 * @public
 *
 * @group Commands
 */
export declare const listKeymap: Record<string, Command>;
/**
 * Returns a command function that moves up or down selected list nodes.
 *
 * @public
 *
 * @group Commands
 *
 */
export declare function createMoveListCommand(direction: 'up' | 'down'): Command;
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
 * An explicit select-all (an `AllSelection`) is not protected: it covers the
 * whole document, hidden content included, so deleting it is intentional.
 *
 * @public
 *
 * @group Commands
 *
 */
export declare const protectCollapsed: Command;
/**
 * If one of the selection's end points is inside a collapsed node, move the selection outside of it
 *
 * @internal
 */
export declare function setSafeSelection(tr: Transaction): Transaction;
/**
 * @public
 *
 * @group Commands
 */
interface SplitListOptions {
  /**
   * When `true`, the command never leaves a list node whose first child is a
   * list node (a list node with a hidden marker). `Enter` in an empty list
   * node dedents it, so this is the `strict` option of
   * `createDedentListCommand`.
   *
   * @defaultValue `false`
   */
  strict?: boolean;
}
/**
 * Returns a command that split the current list node.
 *
 * @public
 *
 * @group Commands
 *
 */
export declare function createSplitListCommand(options?: SplitListOptions): Command;
/**
 * @internal
 */
export declare function doSplitList(state: EditorState, listNode: Node$1, dispatch?: (tr: Transaction) => void): boolean;
/**
 * All default list node kinds.
 *
 * @public
 *
 * @group Schema
 */
type ListKind = 'bullet' | 'ordered' | 'task' | 'toggle';
/**
 * @public
 *
 * @group Schema
 */
interface ListAttributes {
  kind?: string;
  order?: number | null;
  checked?: boolean;
  collapsed?: boolean;
}
/**
 * @public
 *
 * @group Schema
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
/**
 * @public
 *
 * @group Commands
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
 * @public
 *
 * @group Commands
 */
export declare function createToggleCollapsedCommand(options?: ToggleCollapsedOptions): Command;
/**
 * Returns a command function that wraps the selection in a list with the given
 * type and attributes, or change the list kind if the selection is already in
 * another kind of list, or unwrap the selected list if otherwise.
 *
 * @public
 *
 * @group Commands
 */
export declare function createToggleListCommand<T extends ListAttributes = ListAttributes>(
/**
 * The list node attributes to toggle.
 */
attrs: T): Command;
/**
 * @public
 *
 * @group Commands
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
 * @public
 *
 * @group Commands
 */
export declare function createUnwrapListCommand(options?: UnwrapListOptions): Command;
/**
 * The list node attributes or a callback function to take the current
 * selection block range and return list node attributes. If this callback
 * function returns null, the command won't do anything.
 *
 * @public
 *
 * @group Commands
 */
type WrapInListGetAttrs<T extends ListAttributes> = T | ((range: NodeRange) => T | null);
/**
 * Returns a command function that wraps the selection in a list with the given
 * type and attributes.
 *
 * @public
 *
 * @group Commands
 */
export declare function createWrapInListCommand<T extends ListAttributes = ListAttributes>(getAttrs: WrapInListGetAttrs<T>): Command;
/** @internal */
export declare function handleListMarkerMouseDown({ view, event, onListClick }: {
  view: EditorView;
  event: MouseEvent;
  onListClick?: ListClickHandler;
}): boolean;
/** @internal */
type ListClickHandler = (node: Node$1) => ListAttributes;
/** @internal */
export declare const defaultListClickHandler: ListClickHandler;
/**
 * A callback function to get the attributes for a list input rule.
 *
 * @public
 *
 * @group Input Rules
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
 * The handler of a list input rule.
 *
 * @internal
 */
type ListInputRuleHandler = (state: EditorState, match: RegExpMatchArray, start: number, end: number) => Transaction | null;
/**
 * Build the handler behind {@link wrappingListInputRule}: it deletes the
 * matched text, then updates the attributes of the list node the textblock
 * already starts, or wraps the textblock into a new list node.
 *
 * @internal
 */
export declare function createListInputRuleHandler<T extends ListAttributes = ListAttributes>(getAttrs: T | ListInputRuleAttributesGetter<T>): ListInputRuleHandler;
/**
 * Build an input rule for automatically wrapping a textblock into a list node
 * when a given string is typed.
 *
 * @public
 *
 * @group Input Rules
 */
export declare function wrappingListInputRule<T extends ListAttributes = ListAttributes>(regexp: RegExp, getAttrs: T | ListInputRuleAttributesGetter<T>): InputRule;
/**
 * The pattern and attributes of one built-in list input rule.
 *
 * @internal
 */
interface ListInputRuleOptions<T extends ListAttributes = ListAttributes> {
  regexp: RegExp;
  getAttrs: T | ListInputRuleAttributesGetter<T>;
}
/**
 * `- ` or `* ` opens a bullet list.
 *
 * @internal
 */
export declare const bulletListInputRule: ListInputRuleOptions;
/**
 * `1. ` opens an ordered list; a number above 1 becomes the start order.
 *
 * @internal
 */
export declare const orderedListInputRule: ListInputRuleOptions;
/**
 * `[ ] ` or `[x] ` opens a task list.
 *
 * @internal
 */
export declare const taskListInputRule: ListInputRuleOptions;
/**
 * `>> ` opens a toggle list.
 *
 * @internal
 */
export declare const toggleListInputRule: ListInputRuleOptions;
/**
 * All input rules for lists.
 *
 * @public
 *
 * @group Input Rules
 */
export declare const listInputRules: InputRule[];
/**
 * Migrate a ProseMirror document JSON object from the old list structure to the
 * new. A new document JSON object is returned if the document is updated,
 * otherwise `null` is returned.
 *
 * @public
 */
export declare function migrateDocJSON(docJSON: ProsemirrorNodeJSON): ProsemirrorNodeJSON | null;
/**
 * A simple node view that is used to render the list node. It ensures that the
 * list node get updated when its marker styling should changes.
 *
 * @public
 *
 * @group Plugins
 */
export declare const createListNodeView: NodeViewConstructor;
/**
 * Serialize list nodes into native HTML list elements (i.e. `<ul>`, `<ol>`) to
 * clipboard. See {@link ListDOMSerializer}.
 *
 * @public
 *
 * @group Plugins
 */
export declare function createListClipboardPlugin(schema: Schema): Plugin;
/**
 * Handle DOM events for list.
 *
 * @public
 *
 * @group Plugins
 */
export declare function createListEventPlugin(): Plugin;
/**
 * Handle the list node rendering.
 *
 * @public
 *
 * @group Plugins
 */
export declare function createListRenderingPlugin(): Plugin;
/**
 * Return a plugin as a workaround for a bug in Safari that causes the composition
 * based IME to remove the empty HTML element with CSS `position: relative`.
 *
 * See also https://github.com/ProseMirror/prosemirror/issues/934
 *
 * @public
 *
 * @group Plugins
 */
export declare function createSafariInputMethodWorkaroundPlugin(): Plugin;
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
 * @public
 *
 * @group Plugins
 */
export declare function createListPlugins(options: {
  schema: Schema;
}): Plugin[];
/**
 * The default group name for list nodes. This is used to find the list node
 * type from the schema.
 *
 * @internal
 *
 * @group Schema
 */
export declare const flatListGroup = "flatList";
/**
 * Return the spec for list node.
 *
 * @public
 *
 * @group Schema
 */
export declare function createListSpec(): NodeSpec;
/**
 * Returns a set of rules for parsing HTML into ProseMirror list nodes.
 *
 * @public
 *
 * @group Schema
 */
export declare function createParseDomRules(): readonly TagParseRule[];
/**
 * @public
 *
 * @group Schema
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
 * @public
 *
 * @group Schema
 */
export declare function listToDOM(options: ListToDOMOptions): DOMOutputSpec;
/** @internal */
export declare function defaultMarkerGetter(node: Node$1): DOMOutputSpec[] | null;
/** @internal */
export declare function defaultAttributesGetter(node: Node$1): {
  class: string;
  'data-list-kind': string | undefined;
  'data-list-order': string | undefined;
  'data-list-checked': string | undefined;
  'data-list-collapsed': string | undefined;
  'data-list-collapsable': string | undefined;
  style: string | undefined;
};
/**
 * Finds a `<input type="checkbox">` element from a `<li>` element. It will stop
 * searching if it reaches a sub-list.
 *
 * @internal
 */
export declare function findCheckboxInListItem(node: Element, depth?: number, maxDepth?: number): HTMLInputElement | void;
/** @internal */
export declare function getListType(schema: Schema): NodeType;
/**
 * @internal
 */
export declare function isCollapsedListNode(node: Node): boolean;
/**
 * @public
 */
export declare function isListNode(node: Node$1 | null | undefined): boolean;
/**
 * @public
 */
export declare function isListType(type: NodeType): boolean;
/**
 * Returns a minimal block range that includes the given two positions and
 * represents one or multiple sibling list nodes.
 *
 * @public
 */
export declare function findListsRange($from: ResolvedPos, $to?: ResolvedPos): NodeRange | null;
/** @internal */
export declare function isListsRange(range: NodeRange): boolean;
/**
 * A custom DOM serializer class that can serialize flat list nodes into native
 * HTML list elements (i.e. `<ul>` and `<ol>`).
 *
 * @public
 *
 * @group Plugins
 */
export declare class ListDOMSerializer extends DOMSerializer {
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
export declare function joinListElements<T extends Element | DocumentFragment>(parent: T): T;
/** @internal */
export declare function parseInteger(attr: string | null | undefined): number | null;
/**
 * Return a debugging string that describes this range.
 *
 * @internal
 */
export declare function rangeToString(range: NodeRange): string;
/**
 * Reduce the open depth of a slice if it only contains a single list node. When
 * copying some text from a deep nested list node, we don't want to paste the
 * entire list structure into the document later.
 *
 * @internal
 */
export declare function unwrapListSlice(slice: Slice): Slice;
export type { DedentListOptions, IndentListOptions, ListAttributes, ListClickHandler, ListInputRuleAttributesGetter, ListInputRuleHandler, ListInputRuleOptions, ListKeymapOptions, ListKind, ListToDOMOptions, Node as ProsemirrorNode, ProsemirrorNodeJSON, SplitListOptions, ToggleCollapsedOptions, UnwrapListOptions, WrapInListGetAttrs };
//# sourceMappingURL=index.d.ts.map