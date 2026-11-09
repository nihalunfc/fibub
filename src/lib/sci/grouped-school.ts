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
