export function stringifyEntries(
  entries: any[][],
  join: (arr: any[]) => string = (arr) => arr.join()
) {
  return entries.map(([k, v]) => [
    String(k),
    Array.isArray(v) ? join(v) : String(v)
  ]);
}
