export function parseIntAttribute(attr: string | null): number | null {
  if (attr == null) return null
  const int = Number.parseInt(attr, 10)
  if (Number.isInteger(int)) return int
  return null
}
