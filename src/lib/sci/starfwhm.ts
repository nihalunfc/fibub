// Star shapes for focus and tracking: find stars in an image, measure each one's FWHM, half-flux radius,
// elongation and its direction, and summarise them across the field (tilt, curvature, trailing).
import { nelderMead } from './rvfit.ts';

export type Star = { x: number; y: number; peak: number; flux: number; fwhm: number; fwhmMaj: number; fwhmMin: number; ecc: number; angle: number; hfr: number; beta: number };

/** Background level and noise (median and 1.4826 × median absolute deviation) from a sample of the pixels. */
export function background(d: ArrayLike<number>) {
  const step = Math.max(1, Math.floor(d.length / 200000)), s: number[] = [];
  for (let i = 0; i < d.length; i += step) { const v = d[i]; if (Number.isFinite(v)) s.push(v); }
  s.sort((a, b) => a - b);
  const med = s[Math.floor(s.length / 2)] ?? 0, dev = s.map((v) => Math.abs(v - med)).sort((a, b) => a - b);
  return { level: med, sigma: (dev[Math.floor(dev.length / 2)] ?? 0) * 1.4826 || 1e-9, max: s[s.length - 1] ?? 0 };
}

/** Moffat profile: amplitude A, width α, power β. Its FWHM is 2α√(2^(1/β) − 1). */
export const moffatFwhm = (alpha: number, beta: number) => 2 * alpha * Math.sqrt(2 ** (1 / beta) - 1);

/** Measure one star around (cx, cy): adaptive second moments for its shape, then a Moffat fit to the
 *  elliptical radial profile for its FWHM, and the half-flux radius. Returns null for anything unusable. */
export function measureStar(d: ArrayLike<number>, w: number, h: number, cx: number, cy: number, bg: number, R = 12): Star | null {
  const x0 = Math.max(0, Math.round(cx) - R), x1 = Math.min(w - 1, Math.round(cx) + R), y0 = Math.max(0, Math.round(cy) - R), y1 = Math.min(h - 1, Math.round(cy) + R);
  if (x1 - x0 < 6 || y1 - y0 < 6) return null;
  // Adaptive moments (Bernstein and Jarvis 2002): weight by a Gaussian matched to the star, iterate.
  let mx = cx, my = cy, a = 4, b = 0, c = 4;
  for (let it = 0; it < 40; it++) {
    const det = a * c - b * b; if (!(det > 0)) return null;
    const ia = c / det, ib = -b / det, ic = a / det;
    let s = 0, sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const v = d[y * w + x] - bg, dx = x - mx, dy = y - my, q = ia * dx * dx + 2 * ib * dx * dy + ic * dy * dy;
      if (q > 16) continue; const wt = v * Math.exp(-0.5 * q);
      s += wt; sx += wt * dx; sy += wt * dy; sxx += wt * dx * dx; sxy += wt * dx * dy; syy += wt * dy * dy;
    }
    if (!(s > 0)) return null;
    const nx = mx + sx / s, ny = my + sy / s;
    const ma = sxx / s - (sx / s) ** 2, mb = sxy / s - (sx / s) * (sy / s), mc = syy / s - (sy / s) ** 2;
    const na = Math.max(0.15, 2 * ma), nb = 2 * mb, nc = Math.max(0.15, 2 * mc);
    const done = Math.abs(na - a) < 1e-4 * a && Math.abs(nc - c) < 1e-4 * c && Math.abs(nx - mx) < 1e-4 && Math.abs(ny - my) < 1e-4;
    a = na; b = nb; c = nc; mx = nx; my = ny;
    if (Math.abs(mx - cx) > R / 2 || Math.abs(my - cy) > R / 2 || a > R * R || c > R * R) return null;
    if (done) break;
  }
  const tr = a + c, dd = Math.sqrt(Math.max(0, ((a - c) / 2) ** 2 + b * b)), l1 = tr / 2 + dd, l2 = Math.max(1e-6, tr / 2 - dd);
  const ecc = Math.sqrt(Math.max(0, 1 - l2 / l1)), ang = 0.5 * Math.atan2(2 * b, a - c), q = Math.sqrt(l2 / l1);
  // Elliptical radius scaled to the geometric-mean axis, so a round profile fit gives the mean FWHM.
  const ca = Math.cos(ang), sa = Math.sin(ang), pts: [number, number][] = [];
  let peak = -Infinity, flux = 0;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const dx = x - mx, dy = y - my, u = dx * ca + dy * sa, v = -dx * sa + dy * ca, r = Math.sqrt(u * u * q + (v * v) / q), val = d[y * w + x] - bg;
    if (r <= R) { pts.push([r, val]); if (val > peak) peak = val; }
  }
  if (!(peak > 0)) return null;
  // Moffat fit (amplitude, α, β, small background offset) to every pixel's value against its radius.
  const sig0 = Math.sqrt(Math.sqrt(l1 * l2));
  const model = (p: number[], r: number) => p[0] * (1 + (r / p[1]) ** 2) ** -p[2] + p[3];
  const cost = (x: number[]) => {
    const p = [Math.exp(x[0]), Math.exp(x[1]), 1.2 + Math.exp(x[2]), x[3] * peak * 0.01];
    if (p[2] > 60) return 1e30;
    let s = 0; for (const [r, v] of pts) s += (v - model(p, r)) ** 2; return s;
  };
  const x = nelderMead(cost, [Math.log(peak), Math.log(sig0 * 1.5), Math.log(1.8), 0], [0.2, 0.2, 0.5, 0.5], 600);
  const A = Math.exp(x[0]), alpha = Math.exp(x[1]), beta = 1.2 + Math.exp(x[2]);
  const fwhm = moffatFwhm(alpha, beta);
  if (!Number.isFinite(fwhm) || fwhm <= 0.5 || fwhm > R * 1.2) return null;
  // Half-flux radius inside an aperture of 3 FWHM (the focusing number used by most capture programs).
  const ap = Math.min(R, Math.max(4, 1.5 * fwhm * 2)), ring: [number, number][] = [];
  // Each pixel is split into 3 × 3 parts so the radius is not rounded to whole pixels.
  for (let y = y0; y <= y1; y++) for (let xx = x0; xx <= x1; xx++) {
    const v = (d[y * w + xx] - bg) / 9;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) { const r = Math.hypot(xx + i / 3 - mx, y + j / 3 - my); if (r <= ap) ring.push([r, v]); }
  }
  ring.sort((p1, p2) => p1[0] - p2[0]);
  for (const [, v] of ring) flux += v;
  let cum = 0, hfr = NaN;
  for (let i = 0; i < ring.length; i++) { const prev = cum; cum += ring[i][1]; if (cum >= flux / 2) { const r0 = i ? ring[i - 1][0] : 0, f = (flux / 2 - prev) / (ring[i][1] || 1); hfr = r0 + f * (ring[i][0] - r0); break; } }
  return { x: mx, y: my, peak: A, flux, fwhm, fwhmMaj: fwhm / Math.sqrt(q), fwhmMin: fwhm * Math.sqrt(q), ecc, angle: ((ang * 180) / Math.PI + 180) % 180, hfr, beta };
}

/** Find stars: local maxima above `k` σ, away from the edges, not saturated and not crowded, brightest first. */
export function findStars(d: ArrayLike<number>, w: number, h: number, opts: { k?: number; max?: number; sat?: number; R?: number } = {}) {
  const bg = background(d), k = opts.k ?? 8, R = opts.R ?? 12, sat = opts.sat ?? bg.max * 0.98, thr = bg.level + k * bg.sigma;
  const cands: { x: number; y: number; v: number }[] = [];
  for (let y = R; y < h - R; y++) for (let x = R; x < w - R; x++) {
    const v = d[y * w + x]; if (!(v > thr)) continue;
    let isMax = true;
    for (let j = -2; j <= 2 && isMax; j++) for (let i = -2; i <= 2; i++) { if (!i && !j) continue; const u = d[(y + j) * w + x + i]; if (u > v || (u === v && (j < 0 || (j === 0 && i < 0)))) { isMax = false; break; } }
    if (isMax) cands.push({ x, y, v });
  }
  cands.sort((p, q) => q.v - p.v);
  const stars: Star[] = [], max = opts.max ?? 300;
  let saturated = 0;
  for (const c of cands) {
    if (stars.length >= max) break;
    // Saturated: near the brightest level in the image and flat-topped (two or more equal neighbours at the peak).
    if (c.v >= sat) { let eq = 0; for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if ((i || j) && d[(c.y + j) * w + c.x + i] >= c.v) eq++; if (eq >= 2) { saturated++; continue; } }
    // Skip a candidate within 2R of a brighter one that was already measured or rejected for crowding.
    if (stars.some((s) => Math.abs(s.x - c.x) < R && Math.abs(s.y - c.y) < R)) continue;
    const s = measureStar(d, w, h, c.x, c.y, bg.level, R);
    if (s && s.peak > 3 * bg.sigma) stars.push(s);
  }
  // Blends of two stars, galaxies and hot-pixel clusters measure far wider or narrower than the rest: drop them.
  const sorted = stars.map((st) => st.fwhm).sort((p, q) => p - q), med = sorted[sorted.length >> 1];
  const kept = stars.filter((st) => st.fwhm < med * 2.2 && st.fwhm > med / 2.2);
  return { stars: kept, bg, saturated, odd: stars.length - kept.length, candidates: cands.length };
}

const median = (a: number[]) => { if (!a.length) return NaN; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export { median };

/** Summary across the field: medians, a 3 × 3 map of FWHM, tilt (corner to corner), curvature (centre vs edge)
 *  and whether elongations line up (tracking) or point to or across the centre (optics). */
export function fieldSummary(stars: Star[], w: number, h: number) {
  const grid = Array.from({ length: 3 }, (_, j) => Array.from({ length: 3 }, (_, i) => median(stars.filter((s) => Math.min(2, Math.floor((s.x / w) * 3)) === i && Math.min(2, Math.floor((s.y / h) * 3)) === j).map((s) => s.fwhm))));
  const corners = [grid[0][0], grid[0][2], grid[2][0], grid[2][2]].filter(Number.isFinite), centre = grid[1][1];
  const tilt = corners.length === 4 ? (Math.max(...corners) - Math.min(...corners)) / median(stars.map((s) => s.fwhm)) : NaN;
  const curv = Number.isFinite(centre) && corners.length ? (median(corners) - centre) / centre : NaN;
  // Mean direction of elongation in doubled angles (a line has no arrow), weighted by eccentricity².
  let sc = 0, ss = 0, sw = 0, rc = 0, rw = 0;
  for (const s of stars) {
    const wgt = s.ecc * s.ecc, t = (2 * s.angle * Math.PI) / 180; sc += wgt * Math.cos(t); ss += wgt * Math.sin(t); sw += wgt;
    const rx = s.x - w / 2, ry = s.y - h / 2, rr = Math.hypot(rx, ry);
    if (rr > Math.min(w, h) * 0.2) { const tr = 2 * Math.atan2(ry, rx); rc += wgt * Math.cos(t - tr); rw += wgt; }
  }
  const align = sw ? Math.hypot(sc, ss) / sw : 0, dir = ((Math.atan2(ss, sc) / 2) * 180) / Math.PI;
  return {
    fwhm: median(stars.map((s) => s.fwhm)), hfr: median(stars.map((s) => s.hfr)), ecc: median(stars.map((s) => s.ecc)), beta: median(stars.map((s) => s.beta)),
    grid, tilt, curvature: curv, align, direction: (dir + 180) % 180,
    radial: rw ? rc / rw : 0, // +1: stretched towards the centre, −1: stretched across it (around the centre)
  };
}

/** Arcseconds per pixel from pixel size (µm) and focal length (mm). */
export const plateScale = (pixUm: number, flMm: number) => (206.265 * pixUm) / flMm;

/** A simulated star field (w × h) with Moffat stars whose FWHM grows towards one corner (tilt) and that are
 *  slightly stretched along `trail` degrees (tracking), with sky noise. */
export function simulatedField(w = 640, h = 420, seed = 11) {
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(2 * Math.PI * rnd());
  const d = new Float32Array(w * h), sky = 500, beta = 3.5, trail = 30, stretch = 1.18;
  const ct = Math.cos((trail * Math.PI) / 180), st = Math.sin((trail * Math.PI) / 180);
  for (let n = 0; n < 160; n++) {
    const x = 14 + rnd() * (w - 28), y = 14 + rnd() * (h - 28), amp = 300 * Math.exp(rnd() * 3.2);
    const fw = 3.2 + 1.6 * (x / w) + 0.8 * (y / h), al = fw / (2 * Math.sqrt(2 ** (1 / beta) - 1));
    for (let j = -14; j <= 14; j++) for (let i = -14; i <= 14; i++) {
      const px = Math.round(x) + i, py = Math.round(y) + j; if (px < 0 || py < 0 || px >= w || py >= h) continue;
      const dx = px - x, dy = py - y, u = (dx * ct + dy * st) / Math.sqrt(stretch), v = (-dx * st + dy * ct) * Math.sqrt(stretch);
      d[py * w + px] += amp * (1 + (u * u + v * v) / (al * al)) ** -beta;
    }
  }
  for (let i = 0; i < d.length; i++) d[i] = Math.min(65535, Math.max(0, Math.round(d[i] + sky + 12 * gauss())));
  return { d, w, h };
}
