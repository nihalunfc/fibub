// Population pyramids: male and female counts by age group, summary measures (dependency ratios, median age
// by interpolation within the group, sex ratios) and a drawing routine that works with any chart painter
// (canvas, SVG or PDF), so the picture on the page and the downloads are the same.
import type { Painter } from './plot.ts';

export type Pyr = { labels: string[]; ages: number[]; widths: number[]; male: number[]; female: number[]; name: string };

/** A table with a header: Age, Male, Female (in any order; also "Men"/"Women", "M"/"F"). */
export function parsePyramid(rows: string[][], name = ''): Pyr {
  if (rows.length < 3) throw new Error('Paste a header row and at least two age groups.');
  const h = rows[0].map((c) => c.trim().toLowerCase());
  const col = (re: RegExp) => h.findIndex((c) => re.test(c));
  const ai = Math.max(0, col(/^age/)), mi = col(/^(males?|men|m|boys)$/), fi = col(/^(females?|women|f|girls)$/);
  if (mi < 0 || fi < 0) throw new Error('Head the columns Age, Male and Female.');
  const labels: string[] = [], ages: number[] = [], male: number[] = [], female: number[] = [];
  const n = (s: string | undefined, line: number, what: string) => { const v = Number(String(s ?? '').trim().replace(/[, ]/g, '')); if (!Number.isFinite(v) || v < 0) throw new Error(`Row ${line}: ${what} "${s ?? ''}" must be a number of 0 or more.`); return v; };
  rows.slice(1).forEach((r, i) => {
    if (r.every((c) => !c.trim())) return;
    const lab = (r[ai] ?? '').trim(), m = lab.match(/\d+(?:\.\d+)?/);
    if (!m) throw new Error(`Row ${i + 2}: "${lab}" is not an age group like 0-4 or 85+.`);
    labels.push(lab); ages.push(Number(m[0])); male.push(n(r[mi], i + 2, 'the male count')); female.push(n(r[fi], i + 2, 'the female count'));
  });
  if (ages.length < 2) throw new Error('Enter at least two age groups.');
  // Youngest at the bottom of the pyramid, but accept either order.
  if (ages[0] > ages[ages.length - 1]) { labels.reverse(); ages.reverse(); male.reverse(); female.reverse(); }
  for (let i = 1; i < ages.length; i++) if (!(ages[i] > ages[i - 1])) throw new Error(`Age groups must not repeat or jump back: ${labels[i]} after ${labels[i - 1]}.`);
  const widths = ages.map((a, i) => (i < ages.length - 1 ? ages[i + 1] - a : Infinity));
  if (male.concat(female).reduce((s, x) => s + x, 0) <= 0) throw new Error('All the counts are 0.');
  return { labels, ages, widths, male, female, name };
}

/** Median by linear interpolation inside its group: L + (N/2 − below) ÷ f × width. In the open group, only "at least L". */
export function groupedMedian(ages: number[], widths: number[], f: number[]) {
  const N = f.reduce((s, x) => s + x, 0);
  let below = 0;
  for (let i = 0; i < f.length; i++) {
    if (below + f[i] >= N / 2 && f[i] > 0) {
      if (!Number.isFinite(widths[i])) return { value: ages[i], open: true };
      return { value: ages[i] + ((N / 2 - below) / f[i]) * widths[i], open: false };
    }
    below += f[i];
  }
  return { value: NaN, open: false };
}

export function pyramidStats(p: Pyr, oldAge = 65, youngEnd = 15) {
  const tot = p.male.map((m, i) => m + p.female[i]);
  const T = tot.reduce((s, x) => s + x, 0), M = p.male.reduce((s, x) => s + x, 0), F = p.female.reduce((s, x) => s + x, 0);
  const i15 = p.ages.indexOf(youngEnd), i65 = p.ages.indexOf(oldAge);
  let dep: { young: number; old: number; total: number; youngN: number; workN: number; oldN: number } | null = null;
  let depNote = '';
  if (p.ages[0] !== 0) depNote = 'Dependency ratios need the table to start at age 0.';
  else if (i15 < 0 || i65 < 0) depNote = `Dependency ratios need age groups that start at ${youngEnd} and ${oldAge}.`;
  else {
    const sum = (a: number, b: number) => tot.slice(a, b).reduce((s, x) => s + x, 0);
    const youngN = sum(0, i15), workN = sum(i15, i65), oldN = sum(i65, tot.length);
    dep = { young: (youngN / workN) * 100, old: (oldN / workN) * 100, total: ((youngN + oldN) / workN) * 100, youngN, workN, oldN };
  }
  return {
    total: T, males: M, females: F, sexRatio: (M / F) * 100,
    groupSexRatio: p.male.map((m, i) => (p.female[i] > 0 ? (m / p.female[i]) * 100 : NaN)),
    median: groupedMedian(p.ages, p.widths, tot), medianMale: groupedMedian(p.ages, p.widths, p.male), medianFemale: groupedMedian(p.ages, p.widths, p.female),
    dep, depNote, oldShare: i65 >= 0 ? (tot.slice(i65).reduce((s, x) => s + x, 0) / T) * 100 : NaN,
  };
}

export type DrawOpts = { w: number; h: number; pct: boolean; ink: string; muted: string; grid: string; bg: string | null; male: string; female: string; over: string; title?: string; font?: number };

const niceStep = (max: number) => { const raw = max / 3, mag = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw * 0.999)!; };
const fmt = (v: number, pct: boolean) => (pct ? `${+v.toFixed(1)} %` : v >= 1e6 ? `${+(v / 1e6).toFixed(2)}M` : v >= 1e4 ? `${+(v / 1e3).toFixed(1)}k` : String(+v.toFixed(0)));

/**
 * Draw a pyramid: males to the left, females to the right, youngest at the bottom. A second population B
 * is drawn as outlines on top (same age groups required). In % mode, each bar is a share of its own total.
 */
export function drawPyramid(P: Painter, A: Pyr, B: Pyr | null, o: DrawOpts) {
  const fs = o.font ?? 12;
  if (o.bg) P.poly([[0, 0], [o.w, 0], [o.w, o.h], [0, o.h]], o.bg, null);
  const val = (p: Pyr, side: 'male' | 'female') => { const T = o.pct ? p.male.reduce((s, x) => s + x, 0) + p.female.reduce((s, x) => s + x, 0) : 1; return p[side].map((x) => (o.pct ? (x / T) * 100 : x)); };
  const am = val(A, 'male'), af = val(A, 'female'), bm = B ? val(B, 'male') : [], bf = B ? val(B, 'female') : [];
  const max = Math.max(...am, ...af, ...bm, ...bf) || 1;
  const k = A.labels.length;
  const labW = Math.max(...A.labels.map((l) => P.measure(l, fs * 0.9))) + 12;
  const top = (o.title ? fs * 2.2 : fs * 0.8) + fs * 1.5, bottom = fs * 3.4 + (B ? fs * 1.6 : 0);
  const side = (o.w - labW - 16) / 2;
  const cx0 = 8 + side, cx1 = cx0 + labW; // centre column between the halves
  const rowH = (o.h - top - bottom) / k;
  const step = niceStep(max), lim = Math.ceil(max / step - 1e-9) * step;
  const sx = (v: number) => (v / lim) * side;
  if (o.title) P.text(8, fs * 0.4, o.title, fs * 1.08, o.ink, 'start', 'top', 0, true);
  P.text(cx0 - side / 2, top - fs * 1.4, 'Male', fs, o.ink, 'middle', 'top', 0, true);
  P.text(cx1 + side / 2, top - fs * 1.4, 'Female', fs, o.ink, 'middle', 'top', 0, true);
  const y0 = top, y1 = top + rowH * k;
  for (let v = step; v <= lim + 1e-9; v += step) {
    for (const x of [cx0 - sx(v), cx1 + sx(v)]) { P.line([[x, y0], [x, y1]], o.grid, 1); P.line([[x, y1], [x, y1 + 4]], o.ink, 1); P.text(x, y1 + 6, fmt(v, o.pct), fs * 0.82, o.ink, 'middle', 'top'); }
  }
  P.text(cx0, y1 + 6, '0', fs * 0.82, o.ink, 'middle', 'top'); P.text(cx1, y1 + 6, '0', fs * 0.82, o.ink, 'middle', 'top');
  P.text(o.w / 2, y1 + fs * 1.9, o.pct ? 'Share of total population' : 'People', fs * 0.9, o.muted, 'middle', 'top');
  for (let i = 0; i < k; i++) {
    const yTop = y1 - (i + 1) * rowH + rowH * 0.08, hh = rowH * 0.84;
    P.poly([[cx0 - sx(am[i]), yTop], [cx0, yTop], [cx0, yTop + hh], [cx0 - sx(am[i]), yTop + hh]], o.male, null);
    P.poly([[cx1, yTop], [cx1 + sx(af[i]), yTop], [cx1 + sx(af[i]), yTop + hh], [cx1, yTop + hh]], o.female, null);
    P.text((cx0 + cx1) / 2, yTop + hh / 2, A.labels[i], Math.min(fs * 0.9, rowH * 0.9), o.ink, 'middle', 'middle');
  }
  if (B) {
    // Step outlines of B: up each age group at its value, across at the group boundaries.
    const ml: [number, number][] = [[cx0, y1]], fl: [number, number][] = [[cx1, y1]];
    for (let i = 0; i < k; i++) {
      const yb = y1 - i * rowH, yt = y1 - (i + 1) * rowH;
      ml.push([cx0 - sx(bm[i]), yb], [cx0 - sx(bm[i]), yt]); fl.push([cx1 + sx(bf[i]), yb], [cx1 + sx(bf[i]), yt]);
    }
    ml.push([cx0, y0]); fl.push([cx1, y0]);
    P.line(ml, o.over, 2); P.line(fl, o.over, 2);
    const ly = o.h - fs * 1.2;
    P.poly([[8, ly - 5], [20, ly - 5], [20, ly + 5], [8, ly + 5]], o.male, null);
    P.text(24, ly, A.name || 'Bars', fs * 0.9, o.ink, 'start', 'middle');
    const x2 = 40 + P.measure(A.name || 'Bars', fs * 0.9);
    P.line([[x2, ly - 6], [x2, ly + 6]], o.over, 2);
    P.text(x2 + 6, ly, B.name || 'Outline', fs * 0.9, o.ink, 'start', 'middle');
  }
}
