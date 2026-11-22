// Helpers for the Plus Two entrance banks (public/qbank/entrance-*/). Same names and behaviour as the shared
// public/qbank/_util.js described in /mnt/project-files/qbank/spec.md, plus a few physics/chemistry helpers.
/** A value from min to max in steps of `step` (inclusive). */
export const pick = (rng, min, max, step = 1) => +(min + Math.floor(rng() * (Math.round((max - min) / step) + 1)) * step).toFixed(10);
/** A whole number from min to max (inclusive). */
export const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1));
/** One element of a list. */
export const choose = (rng, list) => list[Math.floor(rng() * list.length)];
/** Short number text with `sig` significant figures (no trailing zeros); powers of ten for very big or small. */
export function fmt(x, sig = 3) {
  if (!isFinite(x)) return String(x);
  const a = Math.abs(x);
  if (a !== 0 && (a >= 1e5 || a < 1e-3)) {
    const e = Math.floor(Math.log10(a)); let m = +(x / 10 ** e).toPrecision(sig);
    if (Math.abs(m) >= 10) return fmt(x, sig - 1);
    return `${m} × 10<sup>${e}</sup>`;
  }
  return String(+x.toPrecision(sig));
}
/** Put the correct option among the wrong ones in a random order: { options, answer }. Wrong options equal to the
 *  correct one (as text) are dropped and replaced by a small change, so options stay distinct. */
export function shuffleOpts(rng, correct, wrongs) {
  const seen = new Set([String(correct)]);
  const ws = [];
  for (const w of wrongs) { const s = String(w); if (!seen.has(s)) { seen.add(s); ws.push(s); } }
  let k = 2;
  while (ws.length < 3) { const s = `${correct} (×${k++})`; if (!seen.has(s)) { seen.add(s); ws.push(s); } }
  const all = [String(correct), ...ws.slice(0, 3)];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return { options: all, answer: all.indexOf(String(correct)) };
}
/** Numeric options around a correct value: the right one plus typical-mistake values, formatted alike. */
export function numOpts(rng, correct, wrongs, unit = '', sig = 3) {
  const f = (v) => `${fmt(v, sig)}${unit ? ' ' + unit : ''}`;
  return shuffleOpts(rng, f(correct), wrongs.map(f));
}
export const g = 9.8;
