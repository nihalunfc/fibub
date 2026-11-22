// Helpers for question bank data files (public/qbank/<bank>/<topic>.js). Plain ES module, no dependencies.
// Format: /mnt/project-files/qbank/spec.md. `rng` is the seeded generator passed to a template's make(rng).

/** A random value from min to max (inclusive) in steps of `step`. */
export const pick = (rng, min, max, step = 1) => +(min + Math.floor(rng() * (Math.floor((max - min) / step + 1e-9) + 1)) * step).toFixed(10);
/** A random integer from min to max inclusive. */
export const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
/** One element of an array. */
export const choose = (rng, arr) => arr[Math.floor(rng() * arr.length)];
/** Shuffle with the seeded rng. */
export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
/** Friendly number: `sig` significant figures, scientific notation (as TeX) when very big or small. */
export function fmt(x, sig = 3) {
  if (!Number.isFinite(x)) return String(x);
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e5 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a)), m = +(x / 10 ** e).toPrecision(sig);
    return m === 1 ? `10^{${e}}` : `${m}\\times 10^{${e}}`;
  }
  return String(+x.toPrecision(sig));
}
/** Round to `d` decimal places (for answers). */
export const round = (x, d = 2) => Math.round(x * 10 ** d) / 10 ** d;
/**
 * Build MCQ options from the correct value and wrong values (numbers or strings), de-duplicated and shuffled.
 * `show` turns a value into option HTML. Returns { options, answer }.
 */
export function mcqOptions(rng, correct, wrongs, show = (v) => String(v)) {
  const seen = new Set([show(correct)]);
  const ws = [];
  for (const w of wrongs) { const s = show(w); if (!seen.has(s)) { seen.add(s); ws.push(s); } if (ws.length === 3) break; }
  let k = 2;
  while (ws.length < 3) { const v = typeof correct === 'number' ? correct * k : `${show(correct)} (${k})`; const s = show(v); if (!seen.has(s)) { seen.add(s); ws.push(s); } k++; }
  const all = shuffle(rng, [show(correct), ...ws]);
  return { options: all, answer: all.indexOf(show(correct)) };
}
/** Physical constants (CODATA 2018, SI). */
export const C = {
  c: 2.99792458e8, h: 6.62607015e-34, hbar: 1.054571817e-34, e: 1.602176634e-19, me: 9.1093837015e-31,
  mp: 1.67262192369e-27, mn: 1.67492749804e-27, kB: 1.380649e-23, NA: 6.02214076e23, R: 8.314462618,
  eps0: 8.8541878128e-12, mu0: 1.25663706212e-6, G: 6.6743e-11, sigma: 5.670374419e-8, a0: 5.29177210903e-11,
  u: 1.66053906660e-27, g: 9.8, Ry: 13.605693, hc_eVnm: 1239.84198,
};

/** Same as mcqOptions with the name used in the spec. */
export const shuffleOpts = (rng, correct, wrongs, show) => mcqOptions(rng, correct, wrongs, show);
