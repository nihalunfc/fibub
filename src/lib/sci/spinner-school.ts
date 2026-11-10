// #1282 Probability spinner designer: a spinner split into sectors of chosen sizes (whole-number "shares"), the
// theoretical probability of each colour, sector angles, random spins and how far the experiment is from the
// theory. Pure maths, no DOM.

export type Sector = { name: string; share: number };

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
/** Simplest fraction p/q as [p, q]. */
export function simplify(p: number, q: number): [number, number] { const g = gcd(p, q) || 1; return [p / g, q / g]; }
export const total = (s: Sector[]) => s.reduce((t, x) => t + x.share, 0);
/** Theoretical probability of each sector (share ÷ total). */
export const probs = (s: Sector[]) => { const T = total(s); return s.map((x) => (T > 0 ? x.share / T : 0)); };
/** Probability as a simplified fraction string, e.g. "1/3", "0", "1". */
export function fracText(share: number, T: number): string {
  if (T <= 0 || share <= 0) return '0';
  const [p, q] = simplify(share, T);
  return q === 1 ? String(p) : `${p}/${q}`;
}
/** Start and end angle (degrees, clockwise from the top) of each sector. */
export function angles(s: Sector[]): [number, number][] {
  const T = total(s); let a = 0;
  return s.map((x) => { const w = T > 0 ? (360 * x.share) / T : 0; const r: [number, number] = [a, a + w]; a += w; return r; });
}
/** Which sector the pointer at the top lands on when the wheel has turned `turn` degrees clockwise. */
export function sectorAt(s: Sector[], turn: number): number {
  const a = (((360 - (turn % 360)) % 360) + 360) % 360;   // the wheel's own angle now under the pointer
  const ang = angles(s);
  for (let i = 0; i < ang.length; i++) if (a >= ang[i][0] && a < ang[i][1]) return i;
  return ang.length - 1;
}
/** Spin n times; returns how many times each sector came up. */
export function spin(s: Sector[], n: number, rand: () => number): number[] {
  const counts = s.map(() => 0), p = probs(s);
  for (let k = 0; k < n; k++) {
    let u = rand(), i = 0;
    while (i < p.length - 1 && u >= p[i]) { u -= p[i]; i++; }
    while (i > 0 && s[i].share === 0) i--;
    counts[i]++;
  }
  return counts;
}
/** Do the shares give exactly the target probabilities (as fractions [p, q])? */
export function meets(s: Sector[], target: [number, number][]): boolean {
  const T = total(s);
  return T > 0 && target.length === s.length && s.every((x, i) => x.share * target[i][1] === target[i][0] * T);
}
