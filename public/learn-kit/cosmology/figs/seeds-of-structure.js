// 10.1 From tiny ripples to lumps, in one dimension. 400 bits of matter start almost evenly spaced; the ripples
// are a sum of waves of many sizes with random phases (bigger waves a little stronger). Each bit then moves in
// a straight line, x = q + D ψ(q) (the Zel'dovich approximation), where D is how much the ripples have grown.
// Where neighbours move together the density rises, and where streams cross a lump has collapsed. The ripples at
// the start are drawn magnified: real ones were about 1 part in 100,000.
import { canvas, axes, text, title, line, dot, loop, rng, calm, clamp, ease } from '../../kit.js';

const N = 400, BINS = 100;

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 330, label: 'Bits of matter drifting from an almost even spread into lumps, with a graph of density underneath' });
  const r = rng(5);
  const modes = [];
  for (let m = 1; m <= 24; m++) modes.push({ k: 2 * Math.PI * m, ph: r() * 2 * Math.PI, a: Math.pow(m, -1.1) * (0.6 + 0.8 * r()) });
  const psi = (q) => modes.reduce((s, md) => s + (md.a / md.k) * Math.sin(md.k * q + md.ph), 0);
  const dpsi = (q) => modes.reduce((s, md) => s + md.a * Math.cos(md.k * q + md.ph), 0);
  let dmin = 0; for (let i = 0; i < 2000; i++) dmin = Math.min(dmin, dpsi(i / 2000));
  const Dc = -1 / dmin; // first shell crossing
  const jit = Array.from({ length: N }, () => r());
  let step = 0, t = 0;
  const target = [0, 0, 0.75 * Dc, 1.7 * Dc];
  const Dnow = () => {
    if (step < 2) return 0;
    const k = calm() ? 1 : ease(clamp(t / 4, 0, 1));
    return target[step - 1] + (target[step] - target[step - 1]) * k;
  };
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const D = Dnow();
    const top = title(ctx, ['380,000 years: smooth, almost', 'Ripples of every size', 'Gravity: the rich get richer', 'Lumps collapse, gaps empty'][step], col) + 6;
    // strip of matter
    const sT = top + 6, sB = sT + Math.min(90, h * 0.24);
    const L = 54, R = w - 14;
    ctx.fillStyle = col.soft; ctx.fillRect(L, sT, R - L, sB - sT);
    const xs = [];
    for (let i = 0; i < N; i++) {
      const q = (i + 0.5) / N; let x = q + D * psi(q); x = ((x % 1) + 1) % 1; xs.push(x);
      dot(ctx, L + x * (R - L), sT + 6 + jit[i] * (sB - sT - 12), 1.9, col.ink);
    }
    text(ctx, 'matter', L - 6, (sT + sB) / 2, { color: col.muted, size: 11, align: 'right' });
    // density
    const hist = new Float64Array(BINS);
    xs.forEach((x) => { hist[Math.min(BINS - 1, Math.floor(x * BINS))] += BINS / N; });
    const sm = hist.map((_, i) => (hist[(i + BINS - 1) % BINS] + 2 * hist[i] + hist[(i + 1) % BINS]) / 4);
    const ymax = step < 3 ? 2.2 : Math.max(4, Math.min(12, Math.max(...sm) * 1.1));
    const A = axes(ctx, w, h, col, { x: [0, 1], y: [0, ymax], t: sB + 22, xt: [], ylabel: 'Density ÷ average', xlabel: 'Position along a line through space' });
    line(ctx, [[A.L, A.Y(1)], [A.R, A.Y(1)]], col.muted, 1, [4, 4]);
    text(ctx, 'average', A.R - 4, A.Y(1) - 9, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
    if (step === 1) {
      // the ripples, magnified: δ = −D dψ/dq for small D
      const pts = []; for (let i = 0; i <= 300; i++) { const q = i / 300; pts.push([A.X(q), A.Y(1 - 0.6 * dpsi(q) / -dmin)]); }
      line(ctx, pts, col.s[0], 2);
      text(ctx, 'the same ripples, magnified 60,000 times', A.L + 6, A.T + 10, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    } else {
      const pts = Array.from(sm, (v, i) => [A.X((i + 0.5) / BINS), A.Y(Math.min(ymax, v))]);
      ctx.save(); A.clip(); line(ctx, pts, step >= 2 ? col.s[3] : col.s[0], 2); ctx.restore();
      if (step === 0) text(ctx, 'true size: flat to 1 part in 100,000', A.L + 6, A.T + 10, { color: col.muted, size: 11, weight: 600, halo: col.panel });
      if (step >= 2) text(ctx, `lumps have grown ${D < Dc ? 'but not yet collapsed' : 'and collapsed'}`, A.L + 6, A.T + 10, { color: col.s[3], size: 11, weight: 700, halo: col.panel });
    }
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); if (i >= 2) anim.play(); else anim.pause(); } };
}
