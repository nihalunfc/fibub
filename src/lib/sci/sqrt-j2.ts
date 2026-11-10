// Square root finder maths (#1232): four school methods, step by step: pairing prime factors (with the simplest surd
// form), subtracting odd numbers, estimating between two squares then improving the guess (Heron's method), and the
// long division method digit by digit. Exact integer arithmetic where it matters; no DOM.

/** Prime factors of a whole number, smallest first, with repeats. */
export function primes(n: number): number[] {
  const out: number[] = [];
  for (let p = 2; p * p <= n; p++) while (n % p === 0) { out.push(p); n /= p; }
  if (n > 1) out.push(n);
  return out;
}

/** Pair equal primes. root = product of one from each pair; rest = product of the unpaired; √n = root √rest. */
export function pairUp(n: number): { pairs: number[]; single: number[]; root: number; rest: number; perfect: boolean } {
  const ps = primes(n), pairs: number[] = [], single: number[] = [];
  for (let i = 0; i < ps.length; ) { if (ps[i + 1] === ps[i]) { pairs.push(ps[i]); i += 2; } else { single.push(ps[i]); i++; } }
  const root = pairs.reduce((a, b) => a * b, 1), rest = single.reduce((a, b) => a * b, 1);
  return { pairs, single, root, rest, perfect: rest === 1 };
}

/** Subtract 1, 3, 5, ... from n while possible. Perfect square when it reaches exactly 0; the count is the root. */
export function oddSubtract(n: number, max = 1e6): { steps: { odd: number; left: number }[]; perfect: boolean; count: number } {
  const steps: { odd: number; left: number }[] = [];
  let left = n, odd = 1;
  while (left >= odd && steps.length < max) { left -= odd; steps.push({ odd, left }); odd += 2; }
  return { steps, perfect: left === 0, count: steps.length };
}

/** The two whole-number squares n sits between, and a first estimate by sharing the gap (k + (n − k²)/(2k + 1)). */
export function between(n: number): { k: number; lo: number; hi: number; first: number } {
  const k = Math.floor(Math.sqrt(n) + 1e-12);
  const kk = k * k > n ? k - 1 : k;
  return { k: kk, lo: kk * kk, hi: (kk + 1) ** 2, first: kk + (n - kk * kk) / (2 * kk + 1) };
}

/** Heron's (Babylonian) method: x → (x + n/x)/2, starting from x0. */
export function heron(n: number, x0: number, steps: number): number[] {
  const xs = [x0];
  for (let i = 0; i < steps; i++) { const x = xs[xs.length - 1]; xs.push((x + n / x) / 2); }
  return xs;
}

export type LDStep = { bring: string; current: bigint; trial: bigint; digit: number; take: bigint; rem: bigint; afterPoint: boolean };

/**
 * Long division method for the square root of a non-negative decimal written as a string (e.g. "529", "2", "12.25"),
 * to `decimals` places. Returns each step and the root as a string (cut, not rounded).
 */
export function longDivision(s: string, decimals: number): { steps: LDStep[]; root: string; exact: boolean } | null {
  const m = /^(\d+)(?:\.(\d+))?$/.exec(s.trim());
  if (!m) return null;
  let int = m[1].replace(/^0+(?=\d)/, ''), frac = m[2] ?? '';
  if (int.length % 2) int = '0' + int;
  const need = Math.max(decimals, Math.ceil(frac.length / 2));
  frac = frac.padEnd(2 * need, '0');
  const groups = [...int.match(/../g)!.map((g) => ({ g, after: false })), ...(frac.match(/../g) ?? []).map((g) => ({ g, after: true }))];
  let p = 0n, r = 0n, digits = '', point = false;
  const steps: LDStep[] = [];
  for (const { g, after } of groups) {
    if (after && !point) { digits += '.'; point = true; }
    const c = r * 100n + BigInt(g);
    let d = 9n; while ((20n * p + d) * d > c) d--;
    const take = (20n * p + d) * d;
    steps.push({ bring: g, current: c, trial: 20n * p + d, digit: Number(d), take, rem: c - take, afterPoint: after });
    r = c - take; p = p * 10n + d; digits += String(d);
  }
  digits = digits.replace(/^0+(?=\d)/, '');
  return { steps, root: digits, exact: r === 0n };
}
