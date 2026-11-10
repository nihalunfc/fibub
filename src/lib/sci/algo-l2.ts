// School maths (Class 9, the world of algorithms): bubble sort, linear and binary search and Euclid's algorithm as
// lists of steps a page can play one at a time, with the number of comparisons counted. No DOM.

export type SortStep = { arr: number[]; i: number; j: number; swapped: boolean; comparisons: number; swaps: number; done: number; pass: number; note: string };

/**
 * Bubble sort, smallest first. Each step compares positions j and j + 1 and swaps them if they are out of order.
 * After pass p the last p places are fixed (`done` = how many are fixed). With `early`, it stops after a pass
 * with no swaps.
 */
export function bubbleSteps(list: number[], early = true): SortStep[] {
  const a = [...list], n = a.length, out: SortStep[] = [];
  let comparisons = 0, swaps = 0;
  out.push({ arr: [...a], i: -1, j: -1, swapped: false, comparisons, swaps, done: 0, pass: 0, note: 'Start. Compare neighbours from the left and swap any pair in the wrong order.' });
  for (let p = 0; p < n - 1; p++) {
    let any = false;
    for (let j = 0; j < n - 1 - p; j++) {
      comparisons++;
      const sw = a[j] > a[j + 1];
      if (sw) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; any = true; }
      out.push({ arr: [...a], i: p, j, swapped: sw, comparisons, swaps, done: p, pass: p + 1,
        note: sw ? `${a[j + 1]} > ${a[j]}, so swap them.` : `${a[j]} ≤ ${a[j + 1]}, so leave them.` });
    }
    const last = out.at(-1)!;
    last.done = p + 1;
    if (early && !any) { last.done = n; last.note += ` No swaps in pass ${p + 1}, so the list is sorted.`; return out; }
  }
  out.at(-1)!.done = n;
  return out;
}

export type SearchStep = { lo: number; hi: number; mid: number; comparisons: number; found: boolean; note: string };

/** Binary search for `target` in a list sorted smallest first. Each step looks at the middle of lo..hi. */
export function binarySteps(sorted: number[], target: number): SearchStep[] {
  const out: SearchStep[] = [];
  let lo = 0, hi = sorted.length - 1, c = 0;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2); c++;
    const v = sorted[mid];
    if (v === target) { out.push({ lo, hi, mid, comparisons: c, found: true, note: `The middle is ${v}. Found it!` }); return out; }
    if (v < target) { out.push({ lo, hi, mid, comparisons: c, found: false, note: `The middle is ${v}, smaller than ${target}: throw away the left half.` }); lo = mid + 1; }
    else { out.push({ lo, hi, mid, comparisons: c, found: false, note: `The middle is ${v}, bigger than ${target}: throw away the right half.` }); hi = mid - 1; }
  }
  out.push({ lo, hi, mid: -1, comparisons: c, found: false, note: `Nothing is left to look at, so ${target} is not in the list.` });
  return out;
}

/** Linear search: check from the left until found. Returns the number of comparisons (n if not found). */
export function linearCount(list: number[], target: number): number {
  const i = list.indexOf(target);
  return i < 0 ? list.length : i + 1;
}

/** Worst-case comparisons for n items. */
export const worst = {
  bubble: (n: number) => (n * (n - 1)) / 2,
  linear: (n: number) => n,
  binary: (n: number) => (n < 1 ? 0 : Math.floor(Math.log2(n)) + 1),
};

export type EuclidStep = { a: number; b: number; q: number; r: number };

/** Euclid's algorithm: a = b × q + r, then (a, b) ← (b, r) until r = 0. The last b is the HCF. */
export function euclidSteps(x: number, y: number): EuclidStep[] {
  let a = Math.max(x, y), b = Math.min(x, y);
  const out: EuclidStep[] = [];
  if (b === 0) return [{ a, b: a, q: 1, r: 0 }];
  for (;;) { const q = Math.floor(a / b), r = a - b * q; out.push({ a, b, q, r }); if (r === 0) return out; a = b; b = r; }
}
