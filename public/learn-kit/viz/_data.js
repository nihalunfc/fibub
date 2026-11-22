// Helpers for the data and statistics figures (data-*): normal and t distributions, a small table drawer for canvas,
// and a Back/Next stepper so a step figure also works on its own, outside a step player.
import { text, row, button, put } from '../kit.js';

export const nPdf = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
export function nCdf(z) { // Abramowitz-Stegun 7.1.26 on erf
  const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
export function invN(p) { let a = -8, b = 8; for (let i = 0; i < 60; i++) { const m = (a + b) / 2; nCdf(m) < p ? (a = m) : (b = m); } return (a + b) / 2; }
export function lgamma(x) {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x, t = x + 5.5; t -= (x + 0.5) * Math.log(t); let s = 1.000000000190015;
  for (const k of c) s += k / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
}
export const tPdf = (t, v) => Math.exp(lgamma((v + 1) / 2) - lgamma(v / 2)) / Math.sqrt(v * Math.PI) * Math.pow(1 + t * t / v, -(v + 1) / 2);
export function tTail(t, v) { // P(T > t) by integration (Simpson), t >= 0
  const hi = 60, n = 1200, h = (hi - t) / n; let s = tPdf(t, v) + tPdf(hi, v);
  for (let i = 1; i < n; i++) s += tPdf(t + i * h, v) * (i % 2 ? 4 : 2);
  return Math.min(0.5, s * h / 3);
}
export const gauss = (r) => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());

/** Draw a table on the canvas. rows: array of cell arrays, or { c: [...], bg, alpha, color, bold, strike, dx, dy }. */
export function tbl(ctx, col, x, y, head, rows, w, o = {}) {
  const rh = o.rh || 17, size = o.size || 11, tw = w.reduce((a, b) => a + b, 0);
  ctx.save();
  if (head) {
    ctx.fillStyle = col.soft; ctx.fillRect(x, y, tw, rh);
    let cx = x; head.forEach((s, i) => { text(ctx, s, cx + 4, y + rh / 2, { color: col.ink, size, weight: 700, fit: false }); cx += w[i]; });
    y += rh;
  }
  rows.forEach((r, k) => {
    const R = Array.isArray(r) ? { c: r } : r, yy = y + k * rh + (R.dy || 0), xx = x + (R.dx || 0);
    ctx.globalAlpha = R.alpha ?? 1;
    if (R.bg) { ctx.fillStyle = R.bg; ctx.fillRect(xx, yy, tw, rh); }
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(xx + 0.5, yy + 0.5, tw - 1, rh - 1);
    let cx = xx;
    R.c.forEach((s, i) => {
      const cc = R.cc && R.cc[i] ? R.cc[i] : R.color || col.ink;
      ctx.save(); ctx.beginPath(); ctx.rect(cx, yy, w[i], rh); ctx.clip();
      text(ctx, String(s), cx + 4, yy + rh / 2, { color: cc, size, weight: R.bold ? 700 : 400, fit: false });
      ctx.restore();
      if (R.strike) { ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(cx + 3, yy + rh / 2); ctx.lineTo(cx + w[i] - 3, yy + rh / 2); ctx.stroke(); }
      cx += w[i];
    });
  });
  ctx.restore();
  return y + rows.length * rh;
}

/** Back / Next buttons and a label, only when the figure is NOT inside a step player (opts.steps is then undefined). */
export function stepper(host, opts, labels, on, start = 0) {
  let i = start;
  const api = { i, set(k) { i = Math.max(0, Math.min(labels.length - 1, k)); api.i = i; if (lab) lab.textContent = `${i + 1} / ${labels.length}: ${labels[i]}`; on(i); } };
  let lab = null;
  if (!(opts && opts.steps)) {
    const r = row(host);
    button(r, 'Back', () => api.set(i - 1)); button(r, 'Next', () => api.set(i + 1));
    lab = document.createElement('span'); lab.className = 'lk-note'; lab.style.fontSize = '0.85rem'; r.appendChild(lab);
  }
  return api;
}
