// Kaprekar's routine and magic squares (#1240). Plain TypeScript, no DOM.

/** One Kaprekar step on a number with `w` digits (leading zeros kept): biggest arrangement − smallest. */
export function kStep(n: number, w: number) {
  const ds = String(n).padStart(w, '0').split('');
  const big = Number([...ds].sort((a, b) => b.localeCompare(a)).join('')), small = Number([...ds].sort().join(''));
  return { big, small, diff: big - small };
}

/** Kaprekar's routine until the number stops changing (6174 for 4 digits, 495 for 3) or repeats. */
export function kChain(n: number, w: number) {
  const steps: { n: number; big: number; small: number; diff: number }[] = [];
  const seen = new Set<number>([n]);
  let x = n;
  for (let i = 0; i < 20; i++) {
    const s = kStep(x, w);
    steps.push({ n: x, ...s });
    if (s.diff === x || seen.has(s.diff)) break;
    seen.add(s.diff); x = s.diff;
  }
  return steps;
}

/** All digits the same (1111, 555): the routine goes straight to 0. */
export const repdigit = (n: number, w: number) => new Set(String(n).padStart(w, '0')).size === 1;

/** For every w-digit start (leading zeros allowed, repdigits left out): how many steps to reach the constant. */
export function stepCounts(w: number): number[] {
  const target = w === 4 ? 6174 : 495, counts: number[] = [];
  for (let n = 0; n < 10 ** w; n++) {
    if (repdigit(n, w)) continue;
    let x = n, k = 0;
    while (x !== target && k < 20) { x = kStep(x, w).diff; k++; }
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return Array.from(counts, (c) => c ?? 0);
}

/** Odd n: the up-and-right (Siamese) method. Returns the grid of 1..n² and the order cells were filled in. */
export function siamese(n: number): { grid: number[][]; order: [number, number][] } {
  const g = Array.from({ length: n }, () => Array(n).fill(0)), order: [number, number][] = [];
  let r = 0, c = (n - 1) / 2;
  for (let k = 1; k <= n * n; k++) {
    g[r][c] = k; order.push([r, c]);
    const nr = (r - 1 + n) % n, nc = (c + 1) % n;
    if (g[nr][nc]) r = (r + 1) % n; else { r = nr; c = nc; }
  }
  return { grid: g, order };
}

/** n = 4: write 1..16 in order, then replace every number on the two diagonals by 17 − it. */
export function four(): { plain: number[][]; grid: number[][] } {
  const plain = Array.from({ length: 4 }, (_, r) => Array.from({ length: 4 }, (_, c) => 4 * r + c + 1));
  const grid = plain.map((row, r) => row.map((v, c) => (r === c || r + c === 3 ? 17 - v : v)));
  return { plain, grid };
}

/** Magic constant for 1..n²: n(n² + 1)/2. */
export const magicConstant = (n: number) => (n * (n * n + 1)) / 2;

/** Row, column and diagonal sums of a square grid. */
export function lineSums(g: number[][]) {
  const n = g.length;
  return {
    rows: g.map((r) => r.reduce((a, b) => a + b, 0)),
    cols: g[0].map((_, c) => g.reduce((a, r) => a + r[c], 0)),
    diag: g.reduce((a, r, i) => a + r[i], 0),
    anti: g.reduce((a, r, i) => a + r[n - 1 - i], 0),
  };
}

export function isMagic(g: number[][]): boolean {
  const s = lineSums(g), t = s.rows[0];
  return [...s.rows, ...s.cols, s.diag, s.anti].every((x) => x === t);
}
