// Helpers for the LSAT bank's templated questions. LSAT questions have five options (A to E).
export const int = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
export const choose = (rng, arr) => arr[Math.floor(rng() * arr.length)];
/** Two (or n) different items from a list. */
export const sample = (rng, arr, n) => { const a = arr.slice(), out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(rng() * a.length), 1)[0]); return out; };
/** Shuffle the right answer in among wrong ones, keeping 5 distinct options. */
export function shuffle5(rng, correct, wrongs) {
  const seen = new Set([correct]), opts = [correct];
  for (const w of wrongs) if (!seen.has(w) && opts.length < 5) { seen.add(w); opts.push(w); }
  const order = opts.map((o, i) => [rng(), i]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  return { options: order.map((i) => opts[i]), answer: order.indexOf(0) };
}
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
/** Authored LSAT items are written with letters in the solution as {A}..{E}. This turns the options round so the
 *  right answer sits at a spread-out position (fixed per id, so it never changes between visits) and rewrites the
 *  letters in the solution and trap to match. */
export function place(item) {
  const n = item.options.length; let h = 0;
  for (const ch of item.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const k = ((item.answer - (h % n)) % n + n) % n; // rotate left by k: old index i goes to (i - k) mod n
  const L = 'ABCDE', to = (i) => L[((i - k) % n + n) % n];
  const fix = (s) => (s || '').replace(/\{([A-E])\}/g, (_, c) => to(L.indexOf(c)));
  return { ...item, options: item.options.map((_, j) => item.options[(j + k) % n]), answer: ((item.answer - k) % n + n) % n, sol: fix(item.sol), trap: fix(item.trap) || undefined };
}
