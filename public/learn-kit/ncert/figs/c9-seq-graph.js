// Class 9 Sequences: plot the terms against their position n. An AP (add d each time) makes points on a straight line
// with slope d; a geometric progression (multiply by r each time) makes points on a curve that bends upwards (for r > 1).
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';

const mn = (v) => String(v).replace('-', '−');
export default function (host) {
  let kind = 'ap', a = 2, d = 3, r = 2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'The terms of an AP lying on a straight line or of a geometric progression on a curve' });
  const ctl = row(host);
  choice(ctl, 'Type', [['ap', 'AP (add d)'], ['gp', 'Geometric (multiply by r)']], kind, (v) => { kind = v; sync(); });
  const c2 = row(host);
  slider(c2, { label: 'First term a', min: 1, max: 6, step: 1, value: a, fmt: mn, oninput: (v) => { a = v; sync(); } });
  slider(c2, { label: 'd (AP)', min: -2, max: 6, step: 1, value: d, fmt: mn, oninput: (v) => { d = v; sync(); } });
  slider(c2, { label: 'r (geometric)', min: 1, max: 3, step: 0.5, value: r, fmt: (v) => String(v), oninput: (v) => { r = v; sync(); } });
  const out = readout(host);
  const t = (n) => (kind === 'ap' ? a + (n - 1) * d : a * r ** (n - 1));
  function sync() {
    const L = Array.from({ length: 6 }, (_, i) => +t(i + 1).toFixed(2)).map(mn).join(', ');
    out.innerHTML = kind === 'ap' ? `AP terms: ${L}, ... Equal steps along n give equal changes in height: the points lie on a <b>straight line</b> with slope d = ${mn(d)}.` : `Geometric terms: ${L}, ... Each step multiplies the height by ${r}: ${r === 1 ? 'with r = 1 the terms never change (a flat line)' : 'the points lie on a <b>curve</b> that gets steeper and steeper'}.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'ap' ? 'AP: points on a straight line' : 'Geometric: points on a curve', col), N = 10, vals = Array.from({ length: N }, (_, i) => t(i + 1)), lo = Math.min(0, ...vals), hi = Math.max(1, ...vals), gx0 = 38, gx1 = w - 14, gy0 = top + 12, gy1 = h - 28, X = (n) => gx0 + ((n - 0.5) / N) * (gx1 - gx0), Y = (v) => gy1 - ((v - lo) / (hi - lo)) * (gy1 - gy0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; [lo, (lo + hi) / 2, hi].forEach((v) => { ctx.beginPath(); ctx.moveTo(gx0, Y(v)); ctx.lineTo(gx1, Y(v)); ctx.stroke(); text(ctx, mn(+v.toFixed(0)), gx0 - 4, Y(v), { color: col.muted, size: 10, align: 'right' }); });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, Y(0)); ctx.lineTo(gx1, Y(0)); ctx.stroke();
    for (let n = 1; n <= N; n++) text(ctx, String(n), X(n), gy1 + 12, { color: col.muted, size: 10, align: 'center' });
    ctx.strokeStyle = col.s[0]; ctx.globalAlpha = 0.45; ctx.lineWidth = 2; ctx.beginPath(); vals.forEach((v, i) => (i ? ctx.lineTo(X(i + 1), Y(v)) : ctx.moveTo(X(1), Y(v)))); ctx.stroke(); ctx.globalAlpha = 1;
    vals.forEach((v, i) => dot(ctx, X(i + 1), Y(v), 5, col.s[2], col.ink));
  };
  sync();
}
