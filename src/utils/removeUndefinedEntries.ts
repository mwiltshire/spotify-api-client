export function removeUndefinedEntries(entries: any[][]) {
  return entries.filter(([, v]) => typeof v !== 'undefined');
}
