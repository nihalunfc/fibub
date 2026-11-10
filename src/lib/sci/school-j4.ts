// Small number-writing helpers for the j4 school maths tools: superscripts, standard form and digit grouping.
// Plain TypeScript, no DOM.

const SUP: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };

/** An integer written as a superscript, e.g. sup(-12) = "⁻¹²". */
export const sup = (n: number | bigint) => String(n).split('').map((c) => SUP[c] ?? c).join('');

/** Split x (non-zero, finite) into mantissa m (1 ≤ |m| < 10, rounded to `sig` figures) and exponent e. */
export function stdParts(x: number, sig = 3): { m: number; e: number } {
  if (x === 0 || !Number.isFinite(x)) return { m: 0, e: 0 };
  let e = Math.floor(Math.log10(Math.abs(x)));
  let m = Number((x / 10 ** e).toPrecision(sig));
  if (Math.abs(m) >= 10) { m = Number((m / 10).toPrecision(sig)); e += 1; }
  if (Math.abs(m) < 1) { m = Number((m * 10).toPrecision(sig)); e -= 1; }
  return { m, e };
}

/** x in standard form, e.g. stdForm(384400000) = "3.84 × 10⁸". Small exponents (0) are written plainly. */
export function stdForm(x: number, sig = 3): string {
  if (x === 0) return '0';
  const { m, e } = stdParts(x, sig);
  const ms = String(m).replace('-', '−');
  return e === 0 ? ms : `${ms} × 10${sup(e)}`;
}

/** Group the digits of a whole number (string or bigint) in threes: 1234567 → "1,234,567". */
export function group3(n: bigint | number | string): string {
  const s = String(n), neg = s.startsWith('-'), d = neg ? s.slice(1) : s;
  return (neg ? '−' : '') + d.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/** Indian grouping: last three digits, then pairs: 1234567 → "12,34,567". */
export function groupIndian(n: bigint | number | string): string {
  const s = String(n), neg = s.startsWith('-'), d = neg ? s.slice(1) : s;
  if (d.length <= 3) return (neg ? '−' : '') + d;
  const head = d.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return (neg ? '−' : '') + head + ',' + d.slice(-3);
}

/** Round to `dp` decimals and drop trailing zeros; minus sign as "−". */
export function nice(x: number, dp = 3): string {
  const s = String(Number(x.toFixed(dp)));
  return s.replace('-', '−');
}
