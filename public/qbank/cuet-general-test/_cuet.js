// Helpers for the CUET banks' generators (shared by public/qbank/cuet-*). Plain ES module, no imports.
// rng() is the seeded uniform [0,1) the qbank engine passes to make(rng).

/** A value from min to max in steps of `step`. */
export const pick = (rng, min, max, step = 1) => +(min + Math.floor(rng() * ((max - min) / step + 1 - 1e-9)) * step).toFixed(6);
/** A whole number from min to max. */
export const int = (rng, min, max) => min + Math.floor(rng() * (max - min + 1 - 1e-9));
/** One item of a list. */
export const choose = (rng, list) => list[Math.floor(rng() * list.length * (1 - 1e-12))];
/** Friendly number text: 12,345.6 (Indian readers are used to both; we keep plain grouping). */
export const fmt = (x, d = 2) => (+(+x).toFixed(d)).toLocaleString('en-IN', { maximumFractionDigits: d });
/** Rupees. */
export const rs = (x, d = 2) => `₹${fmt(x, d)}`;

/**
 * Shuffle the right answer in with wrong ones. Wrong answers equal to the right one (or each other) are
 * dropped and replaced with nudged values, so the four options are always distinct.
 * Returns { options, answer } where answer is the index of the right option.
 */
export function shuffleOpts(rng, correct, wrongs, show = (v) => String(v)) {
  const seen = new Set([show(correct)]);
  const out = [];
  for (const w of wrongs) { const s = show(w); if (!seen.has(s)) { seen.add(s); out.push(s); } if (out.length === 3) break; }
  let k = 1;
  while (out.length < 3) {
    const v = typeof correct === 'number' ? correct + k * (Math.abs(correct) > 20 ? Math.ceil(Math.abs(correct) / 10) : 1) * (k % 2 ? 1 : -1) : `${correct} (${k})`;
    const s = show(v); if (!seen.has(s)) { seen.add(s); out.push(s); } k++;
  }
  const all = [show(correct), ...out];
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1) * (1 - 1e-12)); [all[i], all[j]] = [all[j], all[i]]; }
  return { options: all, answer: all.indexOf(show(correct)) };
}

/** Numbered steps for a worked solution. */
export const steps = (...ls) => '<ol>' + ls.map((l) => `<li>${l}</li>`).join('') + '</ol>';
