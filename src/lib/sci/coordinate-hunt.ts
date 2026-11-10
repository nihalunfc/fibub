// Coordinate games for school (Learn): which quadrant or axis a point is on, the distance between two grid points
// as √(dx² + dy²), and a single-player ships game on a grid from −N to N. No DOM.

export type Pt = [number, number];

/** "Quadrant I" ... "Quadrant IV", "the x-axis", "the y-axis" or "the origin". */
export function quadrant(x: number, y: number): string {
  if (x === 0 && y === 0) return 'the origin';
  if (y === 0) return 'the x-axis';
  if (x === 0) return 'the y-axis';
  return x > 0 ? (y > 0 ? 'Quadrant I' : 'Quadrant IV') : y > 0 ? 'Quadrant II' : 'Quadrant III';
}

/** Signs of the coordinates in a quadrant, e.g. "(+, −)". */
export const signs = (x: number, y: number) => `(${x > 0 ? '+' : x < 0 ? '−' : '0'}, ${y > 0 ? '+' : y < 0 ? '−' : '0'})`;

/** The squared distance (a whole number for grid points) and the distance. */
export function dist(a: Pt, b: Pt) {
  const dx = b[0] - a[0], dy = b[1] - a[1], sq = dx * dx + dy * dy;
  return { dx, dy, sq, d: Math.sqrt(sq) };
}

/** √n written simply when it is a whole number or k√m: 25 → "5", 8 → "2√2", 13 → "√13". */
export function surd(n: number): string {
  if (n === 0) return '0';
  let out = 1, rest = n;
  for (let k = 2; k * k <= rest; k++) while (rest % (k * k) === 0) { out *= k; rest /= k * k; }
  if (rest === 1) return String(out);
  return (out === 1 ? '' : String(out)) + '√' + rest;
}

/** Place ships of the given lengths on the grid −n..n, straight across or up, never touching each other's cells. */
export function placeShips(lengths: number[], n: number, rnd = Math.random): Pt[][] {
  for (let tries = 0; tries < 1000; tries++) {
    const ships: Pt[][] = [], used = new Set<string>();
    let ok = true;
    for (const L of lengths) {
      let placed = false;
      for (let t = 0; t < 200 && !placed; t++) {
        const across = rnd() < 0.5, span = 2 * n + 1;
        const x0 = -n + Math.floor(rnd() * (across ? span - L + 1 : span)), y0 = -n + Math.floor(rnd() * (across ? span : span - L + 1));
        const cells: Pt[] = Array.from({ length: L }, (_, i) => (across ? [x0 + i, y0] : [x0, y0 + i]) as Pt);
        if (cells.some(([x, y]) => used.has(`${x},${y}`))) continue;
        cells.forEach(([x, y]) => used.add(`${x},${y}`));
        ships.push(cells); placed = true;
      }
      if (!placed) { ok = false; break; }
    }
    if (ok) return ships;
  }
  throw new Error('Could not place ships');
}

/** Which ship (index) a shot hits, or −1. */
export const hitShip = (ships: Pt[][], x: number, y: number) => ships.findIndex((s) => s.some((c) => c[0] === x && c[1] === y));

/** Read a typed point such as "(3, −2)", "3,-2" or "3 −2". Null if it can't be read. */
export function readPoint(s: string): Pt | null {
  const m = /^\s*\(?\s*([-−+]?\d+(?:\.\d+)?)\s*[, ]\s*([-−+]?\d+(?:\.\d+)?)\s*\)?\s*$/.exec(s);
  if (!m) return null;
  return [Number(m[1].replace('−', '-')), Number(m[2].replace('−', '-'))];
}
