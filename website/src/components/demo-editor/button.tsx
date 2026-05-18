import type { ComponentChild, MouseEventHandler } from 'preact'

export default function Button(props: {
  pressed?: boolean
  disabled?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
  tooltip?: string
  children: ComponentChild
}) {
  return (
    <button
      type="button"
      title={props.tooltip}
      aria-label={props.tooltip}
      aria-pressed={props.pressed}
      data-state={props.pressed ? 'on' : 'off'}
      disabled={props.disabled}
      onClick={props.onClick}
      onMouseDown={(event) => {
        event.preventDefault()
      }}
      className="inline-flex h-8 cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent px-3 text-sm font-medium text-gray-700 transition-colors outline-none select-none hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent data-[state=on]:border-gray-300 data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-100/40 dark:data-[state=on]:border-gray-600 dark:data-[state=on]:bg-gray-700 dark:data-[state=on]:text-gray-50"
    >
      {props.children}
    </button>
  )
}
