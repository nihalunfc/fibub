// Backfocus: the spacer stack needed between a reducer or flattener and the camera sensor.

/** How far a flat filter of thickness t (mm) and refractive index n pushes the focus back: t(1 − 1/n). */
export const filterShift = (t: number, n = 1.5) => (t > 0 ? t * (1 - 1 / n) : 0);

/** Read a list of spacer lengths such as "10, 5, 2 x2, 0.5". */
export function readSpacers(text: string): number[] {
  const out: number[] = [];
  for (const raw of text.split(/[,;\n]+/)) {
    const s = raw.trim().replace(/mm$/i, '').trim(); if (!s) continue;
    const m = s.match(/^(\d+(?:[.,]\d+)?)\s*(?:mm)?\s*(?:[x×*]\s*(\d+))?$/i);
    if (!m) throw new Error(`"${raw.trim()}" is not a spacer length: type lengths in mm, such as 10, 5, 2 x2`);
    const len = Number(m[1].replace(',', '.')), n = m[2] ? Number(m[2]) : 1;
    if (!(len > 0)) throw new Error('Spacer lengths must be above zero');
    if (n > 50) throw new Error('Up to 50 of one spacer');
    for (let i = 0; i < n; i++) out.push(len);
  }
  return out;
}

/** The spacers (from those owned) whose total is closest to gap, using the fewest pieces among equally close stacks. */
export function solveSpacers(gap: number, owned: number[], step = 0.01) {
  if (!(gap >= 0)) throw new Error('The parts already add up to more than the backfocus: remove a part or use a thinner adapter');
  const U = owned.map((x) => Math.round(x / step)), target = Math.round(gap / step);
  const max = Math.min(U.reduce((s, x) => s + x, 0), target * 2 + 1);
  // 0/1 knapsack over each owned piece: for every reachable sum keep the stack with the fewest pieces.
  const best = new Int32Array(max + 1).fill(1e9);
  best[0] = 0;
  const sets: (number[] | null)[] = new Array(max + 1).fill(null); sets[0] = [];
  for (let i = 0; i < U.length; i++) {
    const u = U[i];
    for (let s = max; s >= u; s--) {
      const from = sets[s - u];
      if (from && from.length + 1 < best[s]) { best[s] = from.length + 1; sets[s] = [...from, i]; }
    }
  }
  let pick = -1;
  for (let d = 0; d <= max; d++) {
    const cands = [target - d, target + d].filter((s) => s >= 0 && s <= max && sets[s]);
    if (cands.length) { pick = cands.sort((a, b) => best[a] - best[b])[0]; break; }
  }
  const idx = pick >= 0 ? sets[pick]! : [];
  const pieces = idx.map((i) => owned[i]).sort((a, b) => b - a);
  const total = pieces.reduce((s, x) => s + x, 0);
  return { pieces, total, error: total - gap };
}
