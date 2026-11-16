// Password generator helpers. Plain TypeScript, no DOM. Randomness comes from the caller (crypto.getRandomValues in the page).
export const SETS: Record<string, string> = {
  lower: 'abcdefghijklmnopqrstuvwxyz', upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', digit: '0123456789', symbol: '!@#$%^&*()-_=+[]{};:,.<>/?~',
};
export const EASY_SYMBOLS = '!@#$%&*?-_';
export const SIMILAR = '0Oo1lI';
export type RandInt = (n: number) => number;

/** log2 of a big whole number, accurate to many decimals. */
export const log2Big = (b: bigint) => { const s = b.toString(2); const k = Math.min(53, s.length); return s.length - k + Math.log2(parseInt(s.slice(0, k), 2)); };
/** Bits of randomness for length L from sets of the given sizes; with `each`, only passwords that use every set count (inclusion-exclusion). */
export function bitsFor(sizes: number[], L: number, each: boolean) {
  const P = sizes.reduce((a, b) => a + b, 0);
  if (!each) return L * Math.log2(P);
  let total = 0n;
  for (let m = 0; m < 1 << sizes.length; m++) {
    let left = P, odd = false;
    sizes.forEach((s, i) => { if (m & (1 << i)) { left -= s; odd = !odd; } });
    const t = BigInt(left) ** BigInt(L); total += odd ? -t : t;
  }
  return log2Big(total);
}
export const rate = (b: number) => (b >= 100 ? 'very strong' : b >= 80 ? 'strong' : b >= 60 ? 'fair' : 'weak');

/** Sets after removing look-alikes, user-excluded characters and (optionally) the less common symbols. Empty sets are dropped. */
export function buildSets(on: string[], opts: { similar: boolean; exclude: string; easySymbols: boolean }) {
  const ex = new Set([...(opts.similar ? SIMILAR : ''), ...opts.exclude]);
  return on.map((k) => [...(k === 'symbol' && opts.easySymbols ? EASY_SYMBOLS : SETS[k])].filter((c) => !ex.has(c)).join('')).filter((s) => s.length > 0);
}
/** One password: draw again until every set is used (when `each`), so all allowed passwords are equally likely. */
export function makePassword(sets: string[], len: number, each: boolean, randInt: RandInt) {
  const pool = sets.join(''); let pw: string, guard = 0;
  do { pw = ''; for (let i = 0; i < len; i++) pw += pool[randInt(pool.length)]; }
  while (each && guard++ < 10000 && !sets.every((s) => [...pw].some((ch) => s.includes(ch))));
  return pw;
}
/** Passphrase of random words. Bits = words × log2(list size), plus log2(10) per added digit. */
export function makePassphrase(words: string[], count: number, sep: string, capitalise: boolean, digit: boolean, randInt: RandInt) {
  const picked = Array.from({ length: count }, () => { const w = words[randInt(words.length)]; return capitalise ? w[0].toUpperCase() + w.slice(1) : w; });
  let out = picked.join(sep);
  if (digit) out += sep.length === 1 ? sep : '' ; // keep one separator before the digit when there is one
  if (digit) out += String(randInt(10));
  return out;
}
export const phraseBits = (listSize: number, count: number, digit: boolean) => count * Math.log2(listSize) + (digit ? Math.log2(10) : 0);
export const pinBits = (len: number) => len * Math.log2(10);

/** Plain-words time to try every possibility at a guess rate (an example rate, not a measurement). */
export function timeText(bits: number, perSecond: number) {
  const l10 = bits * Math.log10(2) - Math.log10(perSecond);
  if (l10 < 0) return 'less than a second';
  if (l10 > Math.log10(31557600 * 1e6)) return 'more than a million years';
  const s = 10 ** l10;
  const units: [number, string][] = [[1, 'second'], [60, 'minute'], [3600, 'hour'], [86400, 'day'], [2629800, 'month'], [31557600, 'year'], [3155760000, 'century']];
  let u = units[0]; for (const x of units) if (s >= x[0]) u = x;
  const v = Math.floor(s / u[0]);
  return `${v.toLocaleString('en-US')} ${u[1] === 'century' ? (v === 1 ? 'century' : 'centuries') : u[1] + (v === 1 ? '' : 's')}`;
}
