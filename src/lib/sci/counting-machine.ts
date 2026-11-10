// Counting for school (Class 11 permutations and combinations): exact factorials, nPr, nCr, arrangements of a
// word with repeated letters, and lists of every arrangement or selection for small cases. Plain TypeScript, no DOM.

/** n! exactly, as a BigInt. */
export function fact(n: number): bigint {
  let f = 1n;
  for (let i = 2; i <= n; i++) f *= BigInt(i);
  return f;
}

/** nPr = n! / (n − r)!: ordered arrangements of r things out of n different things. 0 if r > n. */
export function nPr(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  let p = 1n;
  for (let i = n - r + 1; i <= n; i++) p *= BigInt(i);
  return p;
}

/** nCr = n! / (r! (n − r)!): unordered selections of r things out of n. 0 if r > n. */
export function nCr(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  r = Math.min(r, n - r);
  let c = 1n;
  for (let i = 1; i <= r; i++) c = (c * BigInt(n - r + i)) / BigInt(i);
  return c;
}

/** Every ordered arrangement of r items from `items`, in dictionary order (stops after `limit`). */
export function arrangements<T>(items: T[], r: number, limit = Infinity): T[][] {
  const out: T[][] = [], used = new Array(items.length).fill(false), cur: T[] = [];
  const go = () => {
    if (out.length >= limit) return;
    if (cur.length === r) { out.push([...cur]); return; }
    for (let i = 0; i < items.length; i++) {
      if (used[i]) continue;
      used[i] = true; cur.push(items[i]); go(); cur.pop(); used[i] = false;
    }
  };
  if (r >= 0 && r <= items.length) go();
  return out;
}

/** Every selection of r items from `items` (order does not matter), in dictionary order (stops after `limit`). */
export function selections<T>(items: T[], r: number, limit = Infinity): T[][] {
  const out: T[][] = [], cur: T[] = [];
  const go = (start: number) => {
    if (out.length >= limit) return;
    if (cur.length === r) { out.push([...cur]); return; }
    for (let i = start; i <= items.length - (r - cur.length); i++) { cur.push(items[i]); go(i + 1); cur.pop(); }
  };
  if (r >= 0 && r <= items.length) go(0);
  return out;
}

/** How often each letter appears, in order of first appearance. Spaces and non-letters are dropped. */
export function letterCounts(word: string): [string, number][] {
  const m = new Map<string, number>();
  for (const ch of word.toUpperCase()) if (/\p{L}/u.test(ch)) m.set(ch, (m.get(ch) ?? 0) + 1);
  return [...m.entries()];
}

/** Distinct arrangements of all letters of a word: n! / (p! q! ...). */
export function wordArrangements(word: string): bigint {
  const counts = letterCounts(word);
  const n = counts.reduce((s, [, c]) => s + c, 0);
  return counts.reduce((v, [, c]) => v / fact(c), fact(n));
}

/** Every distinct arrangement of a word's letters, in dictionary order (stops after `limit`). */
export function distinctWords(word: string, limit = Infinity): string[] {
  const counts = letterCounts(word).sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const n = counts.reduce((s, [, c]) => s + c, 0), left = counts.map(([, c]) => c), out: string[] = [];
  const cur: string[] = [];
  const go = () => {
    if (out.length >= limit) return;
    if (cur.length === n) { out.push(cur.join('')); return; }
    for (let i = 0; i < counts.length; i++) {
      if (!left[i]) continue;
      left[i]--; cur.push(counts[i][0]); go(); cur.pop(); left[i]++;
    }
  };
  if (n) go();
  return out;
}

/** A BigInt with thin thousands separators. */
export function big(x: bigint): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
