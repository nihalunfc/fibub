// Why LoRA is small: a big grid of numbers (here a 24×24 "weight change") can often be rebuilt from just a few
// stripes, each one a column times a row. Slide the rank r. Rank 1 gets the broad shape; each extra rank adds detail;
// the stored numbers are r × (24 + 24) instead of 24 × 24. The grid is made up; the maths (SVD) is the real thing.
import { canvas, text, row, slider, readout, title } from '../kit.js';
import { rng } from '../kit.js';
import { gauss } from './_ai.js';

const N = 24, R = rng(4);
const A0 = Array.from({ length: N }, (_, i) => Array.from({ length: N }, (_, j) => {
  const x = j / (N - 1), y = i / (N - 1); let v = 0.5 * x + 0.3 * Math.sin(3 * Math.PI * y) * Math.cos(2 * Math.PI * x) + 0.8 * Math.exp(-((x - 0.65) ** 2 + (y - 0.35) ** 2) / 0.02) + 0.4 * (Math.floor(i / 4) % 2) * (j > 12 ? 1 : 0); return v + 0.03 * gauss(R); }));
const COMP = [];
(function svd() {
  let A = A0.map((r) => [...r]);
  for (let k = 0; k < 12; k++) {
    let v = Array.from({ length: N }, () => R() - 0.5);
    for (let it = 0; it < 150; it++) { const u = A.map((r) => r.reduce((s, a, j) => s + a * v[j], 0)); const nv = Array.from({ length: N }, (_, j) => A.reduce((s, r, i) => s + r[j] * u[i], 0)); const nn = Math.hypot(...nv) || 1; v = nv.map((a) => a / nn); }
    const u = A.map((r) => r.reduce((s, a, j) => s + a * v[j], 0)), sg = Math.hypot(...u) || 1;
    COMP.push({ sg, u: u.map((a) => a / sg), v }); A = A.map((r, i) => r.map((a, j) => a - sg * (u[i] / sg) * v[j]));
  }
})();
export default function (host) {
  let r = 2;
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 200, label: 'A grid of numbers and its low-rank rebuild' });
  const ctl = row(host);
  slider(ctl, { label: 'Rank r', min: 1, max: 12, step: 1, value: r, fmt: (v) => Math.round(v), oninput: (v) => { r = Math.round(v); show(); } });
  const out = readout(host);
  const rec = () => A0.map((_, i) => A0[0].map((_, j) => COMP.slice(0, r).reduce((s, c) => s + c.sg * c.u[i] * c.v[j], 0)));
  function show() {
    const B = rec(), err = Math.sqrt(A0.flat().reduce((s, a, k) => s + (a - B.flat()[k]) ** 2, 0) / A0.flat().length), tot = Math.sqrt(A0.flat().reduce((s, a) => s + a * a, 0) / 576);
    out.innerHTML = `Rank <b>${r}</b>: stores <b>${r * 48}</b> numbers instead of 576 (${(r * 48 / 5.76).toFixed(0)}%). Average error ${err.toFixed(3)} against a typical value of ${tot.toFixed(2)}. A LoRA adapter does exactly this to a weight-change matrix of a real model, where 4096 × 4096 = 16.8 million numbers become r × 8192.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Original (left) and rank-' + r + ' rebuild (right)', col);
    const B = rec(), c = Math.floor(Math.min((w - 36) / 2 / N, (h - 54) / N)), mn = Math.min(...A0.flat()), mx = Math.max(...A0.flat());
    [[A0, 10], [B, 10 + N * c + 16]].forEach(([M, x0]) => M.forEach((rw, i) => rw.forEach((v, j) => { ctx.fillStyle = col.soft; ctx.fillRect(x0 + j * c, 40 + i * c, c, c); ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, (v - mn) / (mx - mn))); ctx.fillStyle = col.s[0]; ctx.fillRect(x0 + j * c, 40 + i * c, c, c); ctx.restore(); })));
    text(ctx, '576 numbers', 10 + (N * c) / 2, 40 + N * c + 12, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, `${r * 48} numbers`, 10 + N * c + 16 + (N * c) / 2, 40 + N * c + 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
