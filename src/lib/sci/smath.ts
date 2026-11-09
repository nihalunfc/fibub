// Small pure helpers shared by the school maths (Learn) tools: number formatting with a real minus sign,
// fractions, gcd, prime factors and reading a typed answer. No DOM.

/** Format a number for school pages: up to `dp` decimals, trailing zeros dropped, a real minus sign. */
export function fmt(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
  let s = x.toFixed(dp);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  if (/^-0$/.test(s)) s = '0';
  return s.replace('-', '−');
}

/** Signed term for building expressions: sgn(3) = "+ 3", sgn(-2) = "− 2". */
export const sgn = (x: number, dp = 2) => (x < 0 ? `− ${fmt(-x, dp)}` : `+ ${fmt(x, dp)}`);

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a;
}
export const lcm = (a: number, b: number) => (a && b ? Math.abs(Math.round(a) * Math.round(b)) / gcd(a, b) : 0);

/** Prime factors with repeats, smallest first: 60 -> [2, 2, 3, 5]. */
export function primeFactors(n: number): number[] {
  n = Math.abs(Math.round(n));
  const out: number[] = [];
  for (let p = 2; p * p <= n; p++) while (n % p === 0) { out.push(p); n /= p; }
  if (n > 1) out.push(n);
  return out;
}

/** A fraction p/q in lowest terms (q > 0), as text: "3/2", "−1/4", "5". */
export function fracText(p: number, q: number): string {
  if (q === 0) return '—';
  if (q < 0) { p = -p; q = -q; }
  const g = gcd(p, q) || 1; p /= g; q /= g;
  return (q === 1 ? String(p) : `${p}/${q}`).replace('-', '−');
}

/** Read a number someone typed: "3", "-2.5", "−2", "3/4", "1 1/2" is not accepted. NaN if unreadable. */
export function readNum(s: string): number {
  const t = s.trim().replace(/[−–]/g, '-').replace(/\s+/g, '').replace(',', '.');
  if (!t) return NaN;
  const m = /^(-?\d*\.?\d+)\/(\d*\.?\d+)$/.exec(t);
  if (m) return Number(m[1]) / Number(m[2]);
  if (/^[-+]?(\d+\.?\d*|\.\d+)$/.test(t)) return Number(t);
  if (/^-?√\d+(\.\d+)?$/.test(t)) return (t.startsWith('-') ? -1 : 1) * Math.sqrt(Number(t.replace(/^-?√/, '')));
  return NaN;
}

/** Read a list of numbers separated by commas, "and", semicolons or spaces. */
export function readNums(s: string): number[] {
  return s.replace(/\band\b/gi, ',').split(/[,;]+|\s{1,}(?=[-−+]?\d)/).map((x) => x.trim()).filter(Boolean).map(readNum);
}

/** Does the typed answer match, to a tolerance (relative for big numbers)? Lists match in any order if `anyOrder`. */
export function answerMatches(typed: string, want: number[], tol = 0.01, anyOrder = true): boolean {
  const got = readNums(typed);
  if (got.length !== want.length || got.some((x) => !Number.isFinite(x))) return false;
  const close = (a: number, b: number) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
  if (!anyOrder) return got.every((g, i) => close(g, want[i]));
  const left = [...want];
  for (const g of got) { const i = left.findIndex((w) => close(g, w)); if (i < 0) return false; left.splice(i, 1); }
  return true;
}

/** Random integer in [lo, hi], optionally never zero. `rnd` can be swapped for tests. */
export function randInt(lo: number, hi: number, nonZero = false, rnd = Math.random): number {
  for (;;) { const v = lo + Math.floor(rnd() * (hi - lo + 1)); if (!nonZero || v !== 0) return v; }
}
