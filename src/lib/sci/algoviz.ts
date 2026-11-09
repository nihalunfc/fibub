// Algorithm visualiser maths: sorting, searching and dynamic-programming algorithms written to record every
// step (a comparison, a swap, a write, a table cell), so a page can replay them one step at a time and count
// the work. Plain TypeScript, no DOM. The counting rules are stated next to each algorithm.

/** One recorded step. `x`/`y` are the values compared, so a step can be described without replaying. */
export type Op =
  | { k: 'cmp'; i: number; j: number; x: number; y: number; res: boolean; why: string }
  | { k: 'swap'; i: number; j: number }
  | { k: 'set'; i: number; v: number; why: string }
  | { k: 'read'; i: number; why: string }
  | { k: 'sorted'; from: number; to: number }
  | { k: 'range'; lo: number; hi: number; why: string }
  | { k: 'found'; i: number }
  | { k: 'none'; why: string };

export type Counts = { comparisons: number; swaps: number; writes: number; reads: number };
export type SortName = 'bubble' | 'insertion' | 'selection' | 'merge' | 'quick' | 'heap' | 'counting' | 'radix';
export const SORTS: { id: SortName; name: string; time: string; space: string; stable: boolean }[] = [
  { id: 'bubble', name: 'Bubble sort', time: 'O(n²), O(n) if already sorted', space: 'O(1)', stable: true },
  { id: 'insertion', name: 'Insertion sort', time: 'O(n²), O(n) if already sorted', space: 'O(1)', stable: true },
  { id: 'selection', name: 'Selection sort', time: 'O(n²) always', space: 'O(1)', stable: false },
  { id: 'merge', name: 'Merge sort', time: 'O(n log n) always', space: 'O(n)', stable: true },
  { id: 'quick', name: 'Quicksort (Lomuto, last pivot)', time: 'O(n log n) average, O(n²) worst', space: 'O(log n) average', stable: false },
  { id: 'heap', name: 'Heap sort', time: 'O(n log n) always', space: 'O(1)', stable: false },
  { id: 'counting', name: 'Counting sort', time: 'O(n + k), k = largest value', space: 'O(n + k)', stable: true },
  { id: 'radix', name: 'Radix sort (LSD, base 10)', time: 'O(d (n + 10)), d = digits', space: 'O(n)', stable: true },
];

export function countOps(ops: Op[], upTo = ops.length): Counts {
  const c: Counts = { comparisons: 0, swaps: 0, writes: 0, reads: 0 };
  for (let s = 0; s < upTo; s++) {
    const o = ops[s];
    if (o.k === 'cmp') c.comparisons++;
    else if (o.k === 'swap') c.swaps++;
    else if (o.k === 'set') c.writes++;
    else if (o.k === 'read') c.reads++;
  }
  return c;
}

/** The array after the first `upTo` steps. */
export function replay(init: number[], ops: Op[], upTo = ops.length): number[] {
  const a = init.slice();
  for (let s = 0; s < upTo; s++) {
    const o = ops[s];
    if (o.k === 'swap') { const t = a[o.i]; a[o.i] = a[o.j]; a[o.j] = t; }
    else if (o.k === 'set') a[o.i] = o.v;
  }
  return a;
}

/** Record a sort of `input`. Counting rules: a comparison is one test between two keys (a[i] > a[j], or a
 * key against a pivot); a swap exchanges two places (only counted when they differ); a write puts one value
 * into the array (merge, counting and radix sort copy values back instead of swapping). */
export function sortOps(name: SortName, input: number[]): Op[] {
  const a = input.slice(), n = a.length, ops: Op[] = [];
  const cmp = (i: number, j: number, x: number, y: number, res: boolean, why: string) => { ops.push({ k: 'cmp', i, j, x, y, res, why }); return res; };
  const swap = (i: number, j: number) => { if (i === j) return; ops.push({ k: 'swap', i, j }); const t = a[i]; a[i] = a[j]; a[j] = t; };
  const set = (i: number, v: number, why: string) => { ops.push({ k: 'set', i, v, why }); a[i] = v; };
  const done = (from: number, to: number) => ops.push({ k: 'sorted', from, to });
  if (name === 'bubble') {
    // Each pass bubbles the largest remaining value to the end; stops early after a pass with no swap.
    for (let end = n - 1; end > 0; end--) {
      let swapped = false;
      for (let j = 0; j < end; j++) if (cmp(j, j + 1, a[j], a[j + 1], a[j] > a[j + 1], 'left > right?')) { swap(j, j + 1); swapped = true; }
      done(end, end);
      if (!swapped) { done(0, end - 1); return ops; }
    }
    if (n) done(0, 0);
  } else if (name === 'insertion') {
    // Each new value moves left by swaps until the value on its left is not larger. Swaps = inversions.
    for (let i = 1; i < n; i++) for (let j = i; j > 0 && cmp(j - 1, j, a[j - 1], a[j], a[j - 1] > a[j], 'left > right?'); j--) swap(j - 1, j);
    if (n) done(0, n - 1);
  } else if (name === 'selection') {
    for (let i = 0; i < n - 1; i++) {
      let m = i;
      for (let j = i + 1; j < n; j++) if (cmp(j, m, a[j], a[m], a[j] < a[m], 'smaller than the smallest so far?')) m = j;
      swap(i, m); done(i, i);
    }
    if (n) done(n - 1, n - 1);
  } else if (name === 'merge') {
    // Top-down, copying each half pair to a spare array and merging back; ties take the left value (stable).
    const rec = (lo: number, hi: number) => {
      if (hi - lo < 1) return;
      const mid = (lo + hi) >> 1;
      rec(lo, mid); rec(mid + 1, hi);
      const aux = a.slice(lo, hi + 1);
      let i = 0, j = mid + 1 - lo;
      const L = mid + 1 - lo, R = hi + 1 - lo;
      for (let k = lo; k <= hi; k++) {
        if (i >= L) { set(k, aux[j++], 'copy the rest of the right half'); continue; }
        if (j >= R) { set(k, aux[i++], 'copy the rest of the left half'); continue; }
        if (cmp(lo + i, lo + j, aux[j], aux[i], aux[j] < aux[i], 'right < left?')) set(k, aux[j++], 'take from the right half');
        else set(k, aux[i++], 'take from the left half');
      }
      if (lo === 0 && hi === n - 1) done(0, n - 1);
    };
    rec(0, n - 1);
    if (n === 1) done(0, 0);
  } else if (name === 'quick') {
    // Lomuto partition with the last value as pivot (as in Cormen et al.).
    const rec = (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) { done(lo, lo); return; }
      const p = a[hi];
      let i = lo;
      for (let j = lo; j < hi; j++) if (cmp(j, hi, a[j], p, a[j] <= p, '≤ pivot?')) { swap(i, j); i++; }
      swap(i, hi); done(i, i);
      rec(lo, i - 1); rec(i + 1, hi);
    };
    rec(0, n - 1);
  } else if (name === 'heap') {
    // Build a max-heap (sift down from the last parent), then move the top to the end n - 1 times.
    const sift = (root: number, size: number) => {
      for (;;) {
        const l = 2 * root + 1, r = l + 1;
        if (l >= size) return;
        let c = l;
        if (r < size && cmp(r, l, a[r], a[l], a[r] > a[l], 'right child > left child?')) c = r;
        if (!cmp(c, root, a[c], a[root], a[c] > a[root], 'child > parent?')) return;
        swap(c, root); root = c;
      }
    };
    for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n);
    for (let end = n - 1; end > 0; end--) { swap(0, end); done(end, end); sift(0, end); }
    if (n) done(0, 0);
  } else if (name === 'counting' || name === 'radix') {
    if (a.some((v) => !Number.isInteger(v) || v < 0)) throw new Error(`${name === 'counting' ? 'Counting' : 'Radix'} sort works on whole numbers of 0 or more only.`);
    if (name === 'counting') {
      const max = Math.max(0, ...a);
      if (max > 100000) throw new Error('Counting sort needs a tally for every value up to the largest; keep values at 100,000 or less.');
      const cnt = new Array(max + 1).fill(0);
      for (let i = 0; i < n; i++) { ops.push({ k: 'read', i, why: `tally ${a[i]}` }); cnt[a[i]]++; }
      let k = 0;
      for (let v = 0; v <= max; v++) for (let c = 0; c < cnt[v]; c++) set(k++, v, `write ${v} (tally ${cnt[v]})`);
      if (n) done(0, n - 1);
    } else {
      const max = Math.max(0, ...a);
      for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        const d = (v: number) => Math.floor(v / exp) % 10, cnt = new Array(10).fill(0);
        const place = exp === 1 ? 'ones' : exp === 10 ? 'tens' : exp === 100 ? 'hundreds' : `${exp}s`;
        for (let i = 0; i < n; i++) { ops.push({ k: 'read', i, why: `${place} digit of ${a[i]} is ${d(a[i])}` }); cnt[d(a[i])]++; }
        for (let b = 1; b < 10; b++) cnt[b] += cnt[b - 1];
        const out = new Array(n);
        for (let i = n - 1; i >= 0; i--) out[--cnt[d(a[i])]] = a[i];
        for (let i = 0; i < n; i++) set(i, out[i], `place ${out[i]} by its ${place} digit`);
      }
      if (n) done(0, n - 1);
    }
  }
  return ops;
}

/** Linear search: one comparison per value looked at. Binary search (sorted input): one three-way comparison
 * per probe at mid = floor((lo + hi) / 2). */
export function searchOps(name: 'linear' | 'binary', a: number[], target: number): { ops: Op[]; index: number } {
  const ops: Op[] = [];
  if (name === 'linear') {
    for (let i = 0; i < a.length; i++) {
      const hit = a[i] === target;
      ops.push({ k: 'cmp', i, j: -1, x: a[i], y: target, res: hit, why: `is ${a[i]} the target?` });
      if (hit) { ops.push({ k: 'found', i }); return { ops, index: i }; }
    }
    ops.push({ k: 'none', why: `${target} is not in the list` });
    return { ops, index: -1 };
  }
  for (let i = 1; i < a.length; i++) if (a[i] < a[i - 1]) throw new Error('Binary search needs the list sorted from small to large. Tick "Sort the list first".');
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    ops.push({ k: 'range', lo, hi, why: `look between places ${lo} and ${hi}` });
    const v = a[mid];
    ops.push({ k: 'cmp', i: mid, j: -1, x: v, y: target, res: v === target, why: v === target ? 'found it' : v < target ? `${v} < ${target}: go right` : `${v} > ${target}: go left` });
    if (v === target) { ops.push({ k: 'found', i: mid }); return { ops, index: mid }; }
    if (v < target) lo = mid + 1; else hi = mid - 1;
  }
  ops.push({ k: 'none', why: `${target} is not in the list` });
  return { ops, index: -1 };
}

// ---------- Dynamic programming ----------
export type Cell = { r: number; c: number; v: number; from: [number, number][]; why: string };
export type DP = { rows: string[]; cols: string[]; cells: Cell[]; table: number[][]; path: [number, number][]; answer: string; detail: string[] };

/** Longest common subsequence. Ties in the traceback go up first (as most textbooks). */
export function lcs(s: string, t: string): DP {
  const m = s.length, n = t.length, d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0)), cells: Cell[] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    if (s[i - 1] === t[j - 1]) { d[i][j] = d[i - 1][j - 1] + 1; cells.push({ r: i, c: j, v: d[i][j], from: [[i - 1, j - 1]], why: `${s[i - 1]} = ${t[j - 1]}: diagonal + 1` }); }
    else {
      const up = d[i - 1][j], left = d[i][j - 1];
      d[i][j] = Math.max(up, left);
      cells.push({ r: i, c: j, v: d[i][j], from: [[i - 1, j], [i, j - 1]], why: `${s[i - 1]} ≠ ${t[j - 1]}: larger of above (${up}) and left (${left})` });
    }
  }
  const path: [number, number][] = [];
  let i = m, j = n, out = '';
  while (i > 0 && j > 0) {
    path.push([i, j]);
    if (s[i - 1] === t[j - 1]) { out = s[i - 1] + out; i--; j--; }
    else if (d[i - 1][j] >= d[i][j - 1]) i--; else j--;
  }
  path.push([i, j]);
  return { rows: ['', ...s], cols: ['', ...t], cells, table: d, path, answer: `Length ${d[m][n]}: "${out}"`, detail: [`One longest common subsequence: ${out || '(none)'}`] };
}

/** Edit (Levenshtein) distance: insert, delete or substitute one character, each costing 1. */
export function editDistance(s: string, t: string): DP {
  const m = s.length, n = t.length, d = Array.from({ length: m + 1 }, (_, i) => Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))), cells: Cell[] = [];
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const same = s[i - 1] === t[j - 1], diag = d[i - 1][j - 1] + (same ? 0 : 1), up = d[i - 1][j] + 1, left = d[i][j - 1] + 1;
    d[i][j] = Math.min(diag, up, left);
    cells.push({ r: i, c: j, v: d[i][j], from: [[i - 1, j - 1], [i - 1, j], [i, j - 1]], why: same ? `${s[i - 1]} = ${t[j - 1]}: smallest of diagonal (${diag}), above + 1 (${up}), left + 1 (${left})` : `${s[i - 1]} ≠ ${t[j - 1]}: smallest of diagonal + 1 (${diag}), above + 1 (${up}), left + 1 (${left})` });
  }
  const path: [number, number][] = [], steps: string[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    path.push([i, j]);
    if (i > 0 && j > 0 && s[i - 1] === t[j - 1] && d[i][j] === d[i - 1][j - 1]) { steps.unshift(`keep ${s[i - 1]}`); i--; j--; }
    else if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + 1) { steps.unshift(`change ${s[i - 1]} to ${t[j - 1]}`); i--; j--; }
    else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { steps.unshift(`delete ${s[i - 1]}`); i--; }
    else { steps.unshift(`insert ${t[j - 1]}`); j--; }
  }
  path.push([0, 0]);
  const edits = steps.filter((x) => !x.startsWith('keep'));
  return { rows: ['', ...s], cols: ['', ...t], cells, table: d, path, answer: `Distance ${d[m][n]}`, detail: [`${edits.length} edit${edits.length === 1 ? '' : 's'}: ${edits.join(', ') || 'none, the words are the same'}`, `All steps: ${steps.join(', ')}`] };
}

export type Item = { name: string; w: number; v: number };
/** 0/1 knapsack: best total value with total weight at most `cap`; each item used at most once. */
export function knapsack(items: Item[], cap: number): DP & { chosen: number[]; best: number } {
  const n = items.length, d = Array.from({ length: n + 1 }, () => new Array(cap + 1).fill(0)), cells: Cell[] = [];
  for (let i = 1; i <= n; i++) for (let w = 0; w <= cap; w++) {
    const it = items[i - 1], skip = d[i - 1][w];
    if (it.w > w) { d[i][w] = skip; cells.push({ r: i, c: w, v: skip, from: [[i - 1, w]], why: `${it.name} (weight ${it.w}) does not fit in ${w}: same as above (${skip})` }); continue; }
    const take = d[i - 1][w - it.w] + it.v;
    d[i][w] = Math.max(skip, take);
    cells.push({ r: i, c: w, v: d[i][w], from: [[i - 1, w], [i - 1, w - it.w]], why: `larger of leaving ${it.name} out (${skip}) and taking it (${d[i - 1][w - it.w]} + ${it.v} = ${take})` });
  }
  const chosen: number[] = [], path: [number, number][] = [];
  let w = cap;
  for (let i = n; i > 0; i--) { path.push([i, w]); if (d[i][w] !== d[i - 1][w]) { chosen.unshift(i - 1); w -= items[i - 1].w; } }
  path.push([0, w]);
  const tw = chosen.reduce((s, i) => s + items[i].w, 0);
  return { rows: ['none', ...items.map((x) => x.name)], cols: Array.from({ length: cap + 1 }, (_, i) => String(i)), cells, table: d, path, chosen, best: d[n][cap], answer: `Best value ${d[n][cap]}`, detail: [`Take: ${chosen.map((i) => items[i].name).join(', ') || 'nothing'} (total weight ${tw} of ${cap})`] };
}

/** "5, 3 8 1" → numbers. Throws a plain message on anything else. */
export function parseList(text: string, max = 100): number[] {
  const parts = text.split(/[\s,;]+/).filter(Boolean);
  if (!parts.length) throw new Error('Type some numbers, separated by commas or spaces.');
  if (parts.length > max) throw new Error(`That is ${parts.length} numbers; this tool shows up to ${max} so every step stays visible.`);
  return parts.map((p) => { const v = Number(p.replace(/[−–]/g, '-')); if (!Number.isFinite(v)) throw new Error(`"${p}" is not a number.`); return v; });
}

/** A repeatable pseudo-random list (mulberry32), so a "random" list can be shared and checked. */
export function makeList(n: number, kind: 'random' | 'sorted' | 'reversed' | 'nearly' | 'few', seed = 1, max = 99): number[] {
  let s = seed >>> 0;
  const rnd = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  let a = Array.from({ length: n }, () => 1 + Math.floor(rnd() * max));
  if (kind === 'few') a = a.map((v) => [10, 30, 50, 70, 90][v % 5]);
  if (kind === 'sorted' || kind === 'nearly') a.sort((x, y) => x - y);
  if (kind === 'reversed') a.sort((x, y) => y - x);
  if (kind === 'nearly') for (let k = 0; k < Math.max(1, Math.round(n / 10)); k++) { const i = Math.floor(rnd() * n), j = Math.min(n - 1, i + 1 + Math.floor(rnd() * 3)); const t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
