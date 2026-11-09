// Eye-tracking analysis: fixation detection (I-VT and I-DT, Salvucci and Goldberg 2000), a duration-weighted
// Gaussian heat map, and area-of-interest (AOI) measures. Plain maths, no DOM.

export type Sample = { x: number; y: number; t: number };
export type Fixation = { x: number; y: number; start: number; end: number; dur: number; n: number };
export type Aoi = { name: string; x1: number; y1: number; x2: number; y2: number };

/** Point-to-point speed of each sample in px per second (time in ms). The first sample takes the second's speed. */
export function velocities(s: Sample[]): number[] {
  const v = new Array(s.length).fill(0);
  for (let i = 1; i < s.length; i++) {
    const dt = s[i].t - s[i - 1].t;
    v[i] = dt > 0 ? (Math.hypot(s[i].x - s[i - 1].x, s[i].y - s[i - 1].y) / dt) * 1000 : Infinity;
  }
  if (s.length > 1) v[0] = v[1];
  return v;
}

function fixOf(s: Sample[], a: number, b: number): Fixation {
  let x = 0, y = 0;
  for (let i = a; i <= b; i++) { x += s[i].x; y += s[i].y; }
  const n = b - a + 1;
  return { x: x / n, y: y / n, start: s[a].t, end: s[b].t, dur: s[b].t - s[a].t, n };
}

/**
 * I-VT: samples slower than `vMax` (px/s) are fixation samples; each run of them is one fixation at its centroid.
 * Runs shorter than `minDur` ms are dropped. A gap in time longer than `maxGap` ms ends a run.
 */
export function ivt(s: Sample[], vMax: number, minDur = 60, maxGap = 100): Fixation[] {
  const v = velocities(s), out: Fixation[] = [];
  let a = -1;
  const close = (b: number) => { if (a >= 0) { const f = fixOf(s, a, b); if (f.dur >= minDur) out.push(f); } a = -1; };
  for (let i = 0; i < s.length; i++) {
    if (a >= 0 && s[i].t - s[i - 1].t > maxGap) close(i - 1);
    if (v[i] < vMax) { if (a < 0) a = i; } else close(i - 1);
  }
  close(s.length - 1);
  return out;
}

/** Dispersion of samples a..b: (max x − min x) + (max y − min y). */
export function dispersion(s: Sample[], a: number, b: number): number {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = a; i <= b; i++) { const p = s[i]; if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
  return x1 - x0 + (y1 - y0);
}

/**
 * I-DT: a window covering at least `minDur` ms whose dispersion is at most `dMax` px is a fixation; it grows
 * while the dispersion stays within `dMax`, and its samples are then removed. Otherwise the first sample is
 * dropped and the window moves on.
 */
export function idt(s: Sample[], dMax: number, minDur = 100): Fixation[] {
  const out: Fixation[] = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (j < s.length && s[j].t - s[i].t < minDur) j++;
    if (j >= s.length) break;
    if (dispersion(s, i, j) <= dMax) {
      while (j + 1 < s.length && dispersion(s, i, j + 1) <= dMax) j++;
      out.push(fixOf(s, i, j));
      i = j + 1;
    } else i++;
  }
  return out;
}

/**
 * Heat map on a grid of `cols` × `rows` cells of `cell` px: the sum over fixations of
 * weight × exp(−d² / 2σ²), at each cell centre (fixations further than 5σ add less than 4 parts in a million and are skipped). Weight is the duration in ms, or 1 per fixation.
 */
export function heat(fx: Fixation[], cols: number, rows: number, cell: number, sigma: number, byDuration = true): Float64Array {
  const g = new Float64Array(cols * rows), R = 5 * sigma, k = 1 / (2 * sigma * sigma);
  for (const f of fx) {
    const w = byDuration ? f.dur : 1;
    const c0 = Math.max(0, Math.floor((f.x - R) / cell)), c1 = Math.min(cols - 1, Math.floor((f.x + R) / cell));
    const r0 = Math.max(0, Math.floor((f.y - R) / cell)), r1 = Math.min(rows - 1, Math.floor((f.y + R) / cell));
    for (let r = r0; r <= r1; r++) {
      const dy = (r + 0.5) * cell - f.y;
      for (let c = c0; c <= c1; c++) { const dx = (c + 0.5) * cell - f.x; g[r * cols + c] += w * Math.exp(-(dx * dx + dy * dy) * k); }
    }
  }
  return g;
}

export const inAoi = (a: Aoi, x: number, y: number) => x >= Math.min(a.x1, a.x2) && x <= Math.max(a.x1, a.x2) && y >= Math.min(a.y1, a.y2) && y <= Math.max(a.y1, a.y2);

export type AoiStat = { name: string; count: number; dwell: number; share: number; first: number; firstIndex: number; visits: number; meanFix: number };

/** AOI measures. Time to first fixation is from `t0` (the recording start) to the start of the first fixation inside. */
export function aoiStats(fx: Fixation[], aois: Aoi[], t0: number): AoiStat[] {
  const total = fx.reduce((s, f) => s + f.dur, 0);
  return aois.map((a) => {
    let count = 0, dwell = 0, first = NaN, firstIndex = -1, visits = 0, prev = false;
    fx.forEach((f, i) => {
      const inside = inAoi(a, f.x, f.y);
      if (inside) { count++; dwell += f.dur; if (firstIndex < 0) { firstIndex = i; first = f.start - t0; } if (!prev) visits++; }
      prev = inside;
    });
    return { name: a.name, count, dwell, share: total > 0 ? dwell / total : 0, first, firstIndex, visits, meanFix: count ? dwell / count : NaN };
  });
}

/** Scanpath summary: total saccade path length (px between successive fixations) and mean saccade amplitude. */
export function scanpath(fx: Fixation[]) {
  let len = 0;
  for (let i = 1; i < fx.length; i++) len += Math.hypot(fx[i].x - fx[i - 1].x, fx[i].y - fx[i - 1].y);
  return { length: len, saccades: Math.max(0, fx.length - 1), meanAmp: fx.length > 1 ? len / (fx.length - 1) : NaN };
}
