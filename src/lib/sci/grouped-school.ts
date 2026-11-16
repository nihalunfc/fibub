// School maths: statistics of grouped data (Class 10 statistics): mean by the direct, assumed-mean and
// step-deviation methods, median and mode with the textbook formulas, and the points of the ogives. No DOM.

export type Row = { lo: number; hi: number; f: number };

/** Read lines like "10-20 5", "10 – 20, 5" or "10 to 20: 5". Returns rows and a message for the first bad line. */
export function parseClasses(text: string): { rows: Row[]; error?: string } {
  const rows: Row[] = [];
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  for (const [i, line] of lines.entries()) {
    const m = /^(-?\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(-?\d+(?:\.\d+)?)\s*[,:;\s]\s*(\d+(?:\.\d+)?)$/i.exec(line.replace(/−/g, '-'));
    if (!m) return { rows, error: `Line ${i + 1} ("${line}") should look like "10-20 5": a class and its frequency.` };
    const lo = Number(m[1]), hi = Number(m[2]), f = Number(m[3]);
    if (!(hi > lo)) return { rows, error: `Line ${i + 1}: the upper limit must be bigger than the lower limit.` };
    rows.push({ lo, hi, f });
  }
  if (rows.length < 2) return { rows, error: 'Enter at least two classes.' };
  for (let i = 1; i < rows.length; i++) if (Math.abs(rows[i].lo - rows[i - 1].hi) > 1e-9) return { rows, error: `Classes must follow on without gaps: ${rows[i - 1].hi} and ${rows[i].lo} do not meet. (For inclusive classes like 10-19, 20-29, use 9.5-19.5, 19.5-29.5.)` };
  if (!rows.some((r) => r.f > 0)) return { rows, error: 'At least one frequency must be more than 0.' };
  return { rows };
}

export function stats(rows: Row[], assumed?: number) {
  const x = rows.map((r) => (r.lo + r.hi) / 2), f = rows.map((r) => r.f), n = f.reduce((s, v) => s + v, 0);
  const widths = rows.map((r) => r.hi - r.lo), h = widths[0], equal = widths.every((w) => Math.abs(w - h) < 1e-9);
  const sfx = x.reduce((s, xi, i) => s + f[i] * xi, 0);
  // Assumed mean: the class mark of the middle class unless given.
  const a = assumed ?? x[Math.floor((x.length - 1) / 2)];
  const d = x.map((xi) => xi - a), sfd = d.reduce((s, di, i) => s + f[i] * di, 0);
  const u = d.map((di) => di / h), sfu = u.reduce((s, ui, i) => s + f[i] * ui, 0);
  const cf: number[] = []; f.reduce((s, v, i) => ((cf[i] = s + v), s + v), 0);
  // Median class: the first whose cumulative frequency is at least n/2.
  const mi = cf.findIndex((c) => c >= n / 2 - 1e-12);
  const cfBefore = mi > 0 ? cf[mi - 1] : 0;
  const median = rows[mi].lo + ((n / 2 - cfBefore) / f[mi]) * (rows[mi].hi - rows[mi].lo);
  // Modal class: the highest frequency (the first one if tied).
  const k = f.indexOf(Math.max(...f)), f0 = k > 0 ? f[k - 1] : 0, f1 = f[k], f2 = k < f.length - 1 ? f[k + 1] : 0;
  const denom = 2 * f1 - f0 - f2;
  const mode = denom === 0 ? NaN : rows[k].lo + ((f1 - f0) / denom) * (rows[k].hi - rows[k].lo);
  return {
    x, f, n, h, equal, a, d, u, cf, sfx, sfd, sfu,
    meanDirect: sfx / n, meanAssumed: a + sfd / n, meanStep: a + (sfu / n) * h,
    medianClass: mi, cfBefore, median, modalClass: k, f0, f1, f2, mode,
    lessThan: rows.map((r, i) => [r.hi, cf[i]] as [number, number]),
    moreThan: rows.map((r, i) => [r.lo, n - (i > 0 ? cf[i - 1] : 0)] as [number, number]),
  };
}

/** Made-up example (not from any book): minutes a class of 50 spent on homework one evening. */
export const EXAMPLE = '0-20 6\n20-40 9\n40-60 15\n60-80 12\n80-100 8';

// ---- Added 2026-11-16: inclusive classes (10-19, 20-29), spread (variance, SD, quartiles), more examples ----

/** Like parseClasses but lets classes have a gap (10-19, 20-29), which is then closed if `fixGaps` and all gaps are equal. */
export function parseClassesLoose(text: string, fixGaps = true): { rows: Row[]; error?: string; note?: string } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const raw: Row[] = [];
  for (const [i, line] of lines.entries()) {
    const m = /^(-?\d+(?:\.\d+)?)\s*(?:-|–|—|to)\s*(-?\d+(?:\.\d+)?)\s*[,:;\s]\s*(\d+(?:\.\d+)?)$/i.exec(line.replace(/−/g, '-'));
    if (!m) return { rows: raw, error: `Line ${i + 1} ("${line}") should look like "10-20 5": a class and its frequency.` };
    raw.push({ lo: Number(m[1]), hi: Number(m[2]), f: Number(m[3]) });
    if (!(raw[i].hi > raw[i].lo)) return { rows: raw, error: `Line ${i + 1}: the upper limit must be bigger than the lower limit.` };
  }
  if (raw.length < 2) return { rows: raw, error: 'Enter at least two classes.' };
  const gaps = raw.slice(1).map((r, i) => Math.round((r.lo - raw[i].hi) * 1e9) / 1e9);
  const g = gaps[0];
  if (fixGaps && g > 0 && gaps.every((x) => x === g)) {
    const rows = raw.map((r) => ({ lo: Math.round((r.lo - g / 2) * 1e9) / 1e9, hi: Math.round((r.hi + g / 2) * 1e9) / 1e9, f: r.f }));
    const res = parseClasses(rows.map((r) => `${r.lo}-${r.hi} ${r.f}`).join('\n'));
    return { ...res, note: `Your classes leave a gap of ${g} between them (like ${raw[0].lo}-${raw[0].hi}, ${raw[1].lo}-${raw[1].hi}), so they were closed the usual way: ${rows[0].lo}-${rows[0].hi}, ${rows[1].lo}-${rows[1].hi}, and so on. The answers use these class limits.` };
  }
  return parseClasses(text);
}

/** Variance, standard deviation, mean deviation about the mean, and the quartiles (same interpolation as the median). */
export function spread(rows: Row[], s: ReturnType<typeof stats>) {
  const mean = s.meanDirect;
  const variance = s.x.reduce((t, xi, i) => t + s.f[i] * (xi - mean) ** 2, 0) / s.n;
  const meanDev = s.x.reduce((t, xi, i) => t + s.f[i] * Math.abs(xi - mean), 0) / s.n;
  const quart = (p: number) => {
    const i = s.cf.findIndex((c) => c >= p * s.n - 1e-12), before = i > 0 ? s.cf[i - 1] : 0, h = rows[i].hi - rows[i].lo;
    return { i, before, value: rows[i].lo + ((p * s.n - before) / s.f[i]) * h };
  };
  const q1 = quart(0.25), q3 = quart(0.75);
  return { variance, sd: Math.sqrt(variance), meanDev, q1, q3, iqr: q3.value - q1.value, sumSq: s.x.reduce((t, xi, i) => t + s.f[i] * (xi - mean) ** 2, 0) };
}

/** Made-up examples for the preset buttons (not from any book). */
export const PRESETS: Record<string, string> = {
  marks: '0-10 3\n10-20 7\n20-30 12\n30-40 11\n40-50 7',
  heights: '150-154 6\n155-159 11\n160-164 14\n165-169 9',
  uneven: '0-5 4\n5-15 10\n15-30 12\n30-50 6',
};
