// Helpers for the SAT bank's templated questions (same names as the shared qbank helpers, public/qbank/_util.js,
// so the bank can switch to those with one import change). Questions are written as plain HTML (no TeX), so the
// same generator also feeds the lesson kit's live problems (public/learn-kit/sat/problems.js).
export const int = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
export const pick = (rng, min, max, step = 1) => +(min + Math.floor(rng() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
export const choose = (rng, arr) => arr[Math.floor(rng() * arr.length)];
/** A non-zero whole number from a to b. */
export const nz = (rng, a, b) => { let v = 0, k = 0; while (v === 0 && k++ < 50) v = int(rng, a, b); return v || 1; };
/** A whole number from a to b that is not in `not`. */
export const other = (rng, a, b, not = []) => { for (let k = 0; k < 100; k++) { const v = int(rng, a, b); if (!not.includes(v)) return v; } return b + 1; };
/** Shuffle the right answer in among distinct wrong ones (duplicates and copies of the answer are dropped). */
export function shuffleOpts(rng, correct, wrongs) {
  const seen = new Set([String(correct)]), opts = [correct];
  for (const w of wrongs) { const s = String(w); if (!seen.has(s) && opts.length < 4) { seen.add(s); opts.push(w); } }
  for (let k = 1; opts.length < 4; k++) { const f = typeof correct === 'number' ? correct + k * (k % 2 ? 1 : -1) * 2 : `${correct} (${k})`; if (!seen.has(String(f))) { seen.add(String(f)); opts.push(f); } }
  const order = opts.map((o, i) => [rng(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  return { options: order.map((i) => String(opts[i])), answer: order.indexOf(0) };
}
/** A number as text: whole numbers plainly, others to `sig` significant figures, minus as a real minus sign. */
export const fmt = (x, sig = 6) => {
  const v = Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : +x.toPrecision(sig);
  return String(v).replace('-', '−');
};
/** Greatest common divisor. */
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
/** A fraction in lowest terms as HTML (a/b), or a whole number. */
export const frac = (n, d) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d); n /= g; d /= g;
  return d === 1 ? fmt(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
};
/** The variable in italics. */
export const v = (s = 'x') => `<i>${s}</i>`;
/** A term with its sign for the middle of an expression: term(3,'x') = "+ 3x", term(-1,'x') = "− x", term(0) = "". */
export const term = (c, x = '', first = false) => {
  if (c === 0) return '';
  const mag = Math.abs(c) === 1 && x ? '' : fmt(Math.abs(c));
  const body = mag + (x ? (x.startsWith('<') ? x : v(x)) : '');
  if (first) return (c < 0 ? '−' : '') + body;
  return (c < 0 ? ' − ' : ' + ') + body;
};
/** A linear expression ax + b as HTML. */
export const lin = (a, b, x = 'x') => (a === 0 ? fmt(b) : term(a, x, true) + term(b));
/** A quadratic ax² + bx + c as HTML. */
export const quad = (a, b, c, x = 'x') => {
  const parts = [[a, `${v(x)}<sup>2</sup>`], [b, v(x)], [c, '']].filter(([k]) => k !== 0);
  return parts.map(([k, s], i) => {
    const mag = Math.abs(k) === 1 && s ? '' : fmt(Math.abs(k));
    return (i === 0 ? (k < 0 ? '−' : '') : k < 0 ? ' − ' : ' + ') + mag + s;
  }).join('') || '0';
};
/** Dollars: $1,250 or $12.50. */
export const usd = (x) => '$' + (Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x).toLocaleString('en-US') : x.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
/** A numbered solution. */
export const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
