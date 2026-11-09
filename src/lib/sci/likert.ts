// Likert-scale summaries and the diverging stacked bar chart: counts and percentages per answer, % agree,
// % neutral, % disagree, median and mean per item, sorting by agreement, and a chart drawn through the
// shared painter (canvas, SVG). Plain functions, no DOM.
import type { Painter } from './plot.ts';

export const DEFAULT_LABELS: Record<number, string[]> = {
  4: ['Strongly disagree', 'Disagree', 'Agree', 'Strongly agree'],
  5: ['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree'],
  6: ['Strongly disagree', 'Disagree', 'Slightly disagree', 'Slightly agree', 'Agree', 'Strongly agree'],
  7: ['Strongly disagree', 'Disagree', 'Somewhat disagree', 'Neither agree nor disagree', 'Somewhat agree', 'Agree', 'Strongly agree'],
};

export type Item = {
  name: string; counts: number[]; n: number; pct: number[];
  agree: number; neutral: number; disagree: number;
  /** Median of the codes 1..k (the mean of the two middle answers when n is even), mean and SD. */
  median: number; mean: number; sd: number;
};

/** Summaries of one item from its counts per category (category 1 = most negative). */
export function summarise(name: string, counts: number[]): Item {
  const k = counts.length, n = counts.reduce((s, c) => s + c, 0);
  if (!(n > 0)) throw new Error(`"${name}" has no answers.`);
  const pct = counts.map((c) => (100 * c) / n);
  const half = Math.floor(k / 2), mid = k % 2 ? half : -1;
  const disagree = pct.slice(0, half).reduce((s, x) => s + x, 0), agree = pct.slice(k - half).reduce((s, x) => s + x, 0);
  // The value at 1-based position p in the sorted answers.
  const at = (p: number) => { let c = 0; for (let j = 0; j < k; j++) { c += counts[j]; if (c >= p) return j + 1; } return k; };
  const median = n % 2 ? at((n + 1) / 2) : (at(n / 2) + at(n / 2 + 1)) / 2;
  const mean = counts.reduce((s, c, j) => s + c * (j + 1), 0) / n;
  const sd = n > 1 ? Math.sqrt(counts.reduce((s, c, j) => s + c * (j + 1 - mean) ** 2, 0) / (n - 1)) : NaN;
  return { name, counts, n, pct, agree, neutral: mid >= 0 ? pct[mid] : 0, disagree, median, mean, sd };
}

/**
 * Counts per category from raw answers. Answers may be the codes 1..k or the labels themselves (any case).
 * Blanks are skipped; anything else is an error naming the item and the value.
 */
export function countRaw(name: string, answers: string[], labels: string[]): number[] {
  const k = labels.length, counts = new Array(k).fill(0), low = labels.map((l) => l.trim().toLowerCase());
  for (const a0 of answers) {
    const a = a0.trim();
    if (a === '') continue;
    let j = low.indexOf(a.toLowerCase());
    if (j < 0 && /^\d+$/.test(a)) j = Number(a) - 1;
    if (j < 0 || j >= k) throw new Error(`"${name}" has the answer "${a}", which is not 1 to ${k} or one of the scale labels.`);
    counts[j]++;
  }
  return counts;
}

export function sortItems(items: Item[], by: 'none' | 'agree' | 'disagree' | 'mean') {
  if (by === 'none') return items.slice();
  const key = (i: Item) => (by === 'agree' ? i.agree + i.neutral / 1000 : by === 'disagree' ? i.disagree : i.mean);
  return items.slice().sort((a, b) => key(b) - key(a));
}

/** Left and right ends (in %) of each answer's segment, centred so that the neutral answer straddles 0. */
export function segments(it: Item): [number, number][] {
  const k = it.pct.length, half = Math.floor(k / 2), odd = k % 2 === 1;
  let left = -(it.pct.slice(0, half).reduce((s, x) => s + x, 0) + (odd ? it.pct[half] / 2 : 0));
  return it.pct.map((p) => { const s: [number, number] = [left, left + p]; left += p; return s; });
}

/** A colour-blind safe diverging palette (orange for disagree, purple for agree, grey for neutral). */
export function palette(k: number): string[] {
  const neg = ['#b35806', '#e08214', '#fdb863'], pos = ['#b2abd2', '#8073ac', '#542788'], half = Math.floor(k / 2);
  const n = neg.slice(3 - half), p = pos.slice(0, half);
  return k % 2 ? [...n, '#c8c8c8', ...p] : [...n, ...p];
}

export type LikertChart = { w: number; h: number; items: Item[]; labels: string[]; title?: string; ink: string; muted: string; grid: string; colors?: string[]; font?: number };

/** Height a chart needs for its items and legend at a given width. */
export function chartHeight(nItems: number, k: number, w: number, font = 13) {
  const legendRows = Math.ceil(k / Math.max(1, Math.floor(w / 190)));
  return 30 + nItems * (font * 2.6) + 40 + legendRows * (font * 1.7) + 16;
}

/** Draw the diverging stacked bars. Item names wrap on the left; % agree is printed on the right. */
export function drawLikert(P: Painter, c: LikertChart) {
  const font = c.font ?? 13, k = c.labels.length, cols = c.colors ?? palette(k);
  const nameW = Math.min(c.w * 0.32, Math.max(...c.items.map((i) => P.measure(i.name, font))) + 10);
  const rightW = P.measure('100 %', font) + 12;
  const x0 = nameW + 8, x1 = c.w - rightW - 6, top = c.title ? 34 : 14, rowH = font * 2.6;
  const maxL = Math.max(50, ...c.items.map((i) => -segments(i)[0][0])), maxR = Math.max(50, ...c.items.map((i) => segments(i)[k - 1][1]));
  const lo = -Math.ceil(maxL / 25) * 25, hi = Math.ceil(maxR / 25) * 25;
  const X = (v: number) => x0 + ((v - lo) / (hi - lo)) * (x1 - x0);
  if (c.title) P.text(c.w / 2, 16, c.title, font + 2, c.ink, 'middle', 'middle', 0, true);
  const bottom = top + c.items.length * rowH;
  for (let v = lo; v <= hi; v += 25) {
    P.line([[X(v), top - 4], [X(v), bottom]], v === 0 ? c.ink : c.grid, v === 0 ? 1.2 : 1);
    P.text(X(v), bottom + 6, `${Math.abs(v)} %`, font - 2, c.muted, 'middle', 'top');
  }
  P.text(x1 + 6, top - 6, 'Agree', font - 2, c.muted, 'start', 'bottom');
  c.items.forEach((it, r) => {
    const y = top + r * rowH + rowH * 0.18, h = rowH * 0.64;
    segments(it).forEach(([a, b], j) => {
      if (b - a <= 0) return;
      P.poly([[X(a), y], [X(b), y], [X(b), y + h], [X(a), y + h]], cols[j], null);
      if (X(b) - X(a) > font * 2.4) P.text((X(a) + X(b)) / 2, y + h / 2, `${Math.round(b - a)}`, font - 2, j === Math.floor(k / 2) && k % 2 ? '#111111' : lum(cols[j]) > 0.55 ? '#111111' : '#ffffff', 'middle', 'middle');
    });
    // Item name, cut to fit.
    let name = it.name;
    while (name.length > 4 && P.measure(name, font) > nameW) name = name.slice(0, -2);
    if (name !== it.name) name = name.slice(0, -1) + '…';
    P.text(nameW, y + h / 2, name, font, c.ink, 'end', 'middle');
    P.text(x1 + 6, y + h / 2, `${Math.round(it.agree)} %`, font, c.ink, 'start', 'middle', 0, true);
  });
  // Legend.
  const per = Math.max(1, Math.floor(c.w / 190)), ly = bottom + font + 18;
  c.labels.forEach((l, j) => {
    const cx = 10 + (j % per) * (c.w / per), cy = ly + Math.floor(j / per) * font * 1.7;
    P.poly([[cx, cy], [cx + font, cy], [cx + font, cy + font], [cx, cy + font]], cols[j], null);
    P.text(cx + font + 6, cy + font / 2, l, font - 1, c.ink, 'start', 'middle');
  });
}
const lum = (hex: string) => { const v = parseInt(hex.slice(1), 16); return (0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255; };
