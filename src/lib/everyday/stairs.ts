// Stair maths and tape-measure style length entry. Plain TypeScript, no DOM.

/** Read a length. Imperial accepts 108, 9' 6", 9 ft 6 in, 6 3/4, 9'6 3/4" (result in inches). Metric accepts 2700, 2.7 m, 270 cm (result in mm).
 *  Returns NaN when it cannot be read. */
export function parseLength(text: string, metric: boolean): number {
  let s = text.trim().toLowerCase().replace(/,/g, '.');
  if (!s) return NaN;
  if (metric) {
    const m = /^(\d*\.?\d+)\s*(mm|cm|m)?$/.exec(s);
    if (!m) return NaN;
    const v = parseFloat(m[1]);
    return m[2] === 'm' ? v * 1000 : m[2] === 'cm' ? v * 10 : v;
  }
  s = s.replace(/feet|foot|ft/g, "'").replace(/inches|inch|in/g, '"').replace(/″/g, '"').replace(/′/g, "'");
  const m = /^(?:(\d*\.?\d+)\s*')?\s*(?:(\d*\.?\d+)?(?:\s+)?(?:(\d+)\s*\/\s*(\d+))?)\s*"?$/.exec(s);
  if (!m) return NaN;
  const ft = m[1] ? parseFloat(m[1]) : 0, wholeIn = m[2] ? parseFloat(m[2]) : 0;
  const fr = m[3] && m[4] ? (+m[4] > 0 ? +m[3] / +m[4] : NaN) : 0;
  if (!m[1] && !m[2] && !m[3]) return NaN;
  return ft * 12 + wholeIn + fr;
}

/** Number of risers so no riser is taller than `target`. A fixed count may be forced. */
export function risersFor(rise: number, target: number, forced?: number) {
  return forced && forced > 0 ? Math.floor(forced) : Math.max(1, Math.ceil(rise / target - 1e-9));
}

/** Height above the lower floor and distance from the first riser for each step. */
export function stepTable(risers: number, R: number, T: number) {
  const rows: { n: number; height: number; run: number }[] = [];
  for (let i = 1; i <= risers; i++) rows.push({ n: i, height: i * R, run: i === 1 ? 0 : (i - 1) * T });
  return rows;
}

/** Stringers needed for a given stair width: one at each edge plus one every `spacing`. */
export const stringers = (width: number, spacing: number) => (width > 0 && spacing > 0 ? Math.max(2, Math.ceil(width / spacing - 1e-9) + 1) : NaN);

/** Side view as SVG path points (x to the right, y up) for risers and treads, scaled to a box. */
export function sidePath(risers: number, R: number, T: number, w: number, h: number, pad = 8) {
  const run = Math.max(1e-9, (risers - 1) * T + T), rise = risers * R;
  const sc = Math.min((w - 2 * pad) / run, (h - 2 * pad) / rise);
  const pts: [number, number][] = [[0, 0]];
  let x = 0, y = 0;
  for (let i = 0; i < risers; i++) { y += R; pts.push([x, y]); if (i < risers - 1) { x += T; pts.push([x, y]); } }
  return pts.map(([a, b]) => `${(pad + a * sc).toFixed(1)},${(h - pad - b * sc).toFixed(1)}`).join(' ');
}
