/** @internal */
export function parseInteger(attr: string | null | undefined): number | null {
  if (attr == null) return null
  const int = Number.parseInt(attr, 10)
  if (Number.isSafeInteger(int)) return int
  return null
}
