// Totals for a batch of compressed files. Plain maths, no DOM.
export function batchTotals(items: { before: number; after: number }[]) {
  const before = items.reduce((n, i) => n + i.before, 0);
  const after = items.reduce((n, i) => n + i.after, 0);
  const savedPct = before > 0 ? Math.max(0, Math.round((1 - after / before) * 100)) : 0;
  return { before, after, savedPct };
}
