// Helpers for the grad-quant bank (GMAT + GRE quantitative questions). Plain ES module, no imports, so it runs in
// the browser, in the lesson kit and in Node tests. Money is written as &#36; so no "$" reaches the TeX renderer.
export const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
export const pick = (r, a, b, step = 1) => +(a + Math.floor(r() * (Math.round((b - a) / step) + 1)) * step).toFixed(6);
export const choose = (r, arr) => arr[Math.floor(r() * arr.length)];
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const D = '&#36;';
/** Number as text: commas, at most 4 decimals, no trailing zeros. */
export function fmt(x, dp = 4) {
  if (!Number.isFinite(x)) return String(x);
  const v = +x.toFixed(dp);
  return (v < 0 ? '−' : '') + Math.abs(v).toLocaleString('en-US', { maximumFractionDigits: dp });
}
export const money = (x, dp = 2) => (x < 0 ? '−' : '') + D + Math.abs(x).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(+x.toFixed(2)) ? 0 : dp, maximumFractionDigits: dp });
/** A fraction a/b in lowest terms as HTML. */
export function frac(a, b) {
  const g = gcd(a, b) || 1; let n = a / g, d = b / g; if (d < 0) { n = -n; d = -d; }
  return d === 1 ? fmt(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
}
export const steps = (...ls) => '<ol>' + ls.filter(Boolean).map((l) => `<li>${l}</li>`).join('') + '</ol>';
/** Fisher-Yates with the seeded rng. */
export function shuffle(r, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
/**
 * Five numeric answer choices in increasing order, as the GMAT and GRE list them. `traps` are the answers the usual
 * mistakes give; more are made near the right answer until there are five distinct choices.
 * Returns { options, answer } where answer is the index of the right value.
 */
export function numOpts(r, value, traps = [], show = fmt, n = 5) {
  const seen = new Map([[show(value), value]]);
  for (const t of traps) if (Number.isFinite(t) && seen.size < n && !seen.has(show(t)) && t !== value) seen.set(show(t), t);
  const step = Number.isInteger(value) ? Math.max(1, Math.round(Math.abs(value) * 0.1)) : Math.abs(value) * 0.1 || 1;
  let k = 1;
  while (seen.size < n && k < 60) {
    const sign = (k % 2 ? 1 : -1) * (r() < 0.5 ? 1 : -1);
    const t = value + sign * step * Math.ceil(k / 2) * (1 + (k > 6 ? 1 : 0));
    if (!seen.has(show(t)) && !(value > 0 && t <= value * 0.05)) seen.set(show(t), t);
    k++;
  }
  const vals = [...seen.values()].sort((a, b) => a - b);
  return { options: vals.map((v) => show(v)), answer: vals.indexOf(value) };
}
/** Choices that are not numbers: right one plus wrongs, shuffled. */
export function textOpts(r, right, wrongs, n = 5) {
  const all = shuffle(r, [right, ...wrongs.filter((w, i) => w !== right && wrongs.indexOf(w) === i).slice(0, n - 1)]);
  return { options: all, answer: all.indexOf(right) };
}
/** Fixed choices for GRE Quantitative Comparison. */
export const QC = ['Quantity A is greater.', 'Quantity B is greater.', 'The two quantities are equal.', 'The relationship cannot be determined from the information given.'];
export const qc = (a, b) => `<table class="qb-qc"><tr><th>Quantity A</th><th>Quantity B</th></tr><tr><td>${a}</td><td>${b}</td></tr></table>`;
/** Fixed choices for GMAT Data Sufficiency. */
export const DS = [
  'Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient.',
  'Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient.',
  'BOTH statements TOGETHER are sufficient, but NEITHER statement ALONE is sufficient.',
  'EACH statement ALONE is sufficient.',
  'Statements (1) and (2) TOGETHER are NOT sufficient.',
];
/** Five single-digit choices (0-9) in order, including the right one and the traps. */
export function digitOpts(r, value, traps = []) {
  const set = new Set([value, ...traps.filter((t) => t >= 0 && t <= 9)].map(Number));
  while (set.size < 5) set.add(Math.floor(r() * 10));
  const vals = [...set].slice(0, 5).sort((a, b) => a - b);
  if (!vals.includes(value)) vals[0] = value, vals.sort((a, b) => a - b);
  return { options: vals.map(String), answer: vals.indexOf(value) };
}
/** Fractions near a/b (for padding wrong choices). */
export const nearFracs = (a, b) => [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1], [a + 2, b], [a * 2, b], [a, b * 2], [b - a, b]].filter(([x, y]) => x > 0 && y > 0 && x * b !== a * y).map(([x, y]) => frac(x, y));
