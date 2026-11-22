// Class 12 Electromagnetic Induction: a magnet swinging through a coil. The flux Φ(t) through the coil rises as the magnet comes close and falls as it goes away;
// the emf ε = −N dΦ/dt is the (negative) slope of the flux graph: zero where the flux is at its peak, biggest where it changes fastest, and it changes sign as the
// magnet passes. More turns or faster motion give a bigger emf. (A model: Φ = 0.2 mWb at the closest, falling off over about 3 cm.)
import { canvas, text, title, row, slider, button, readout, line, dot, axes, loop } from '../../kit.js';
import { barMagnet, si } from '../c12p-mmlib.js';

export default function (host) {
  let N = 100, f = 0.5, t = 0, x = 0, hist = [], play = true;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'A magnet moving through a coil with the flux and emf graphs' });
  const ctl = row(host);
  slider(ctl, { label: 'Turns N', min: 20, max: 300, step: 10, value: N, fmt: (v) => `${v}`, oninput: (v) => { N = v; hist = []; } });
  slider(ctl, { label: 'Swings per second', min: 0.2, max: 1.5, step: 0.1, value: f, fmt: (v) => `${v.toFixed(1)} Hz`, oninput: (v) => { f = v; hist = []; } });
  button(ctl, 'Pause / play', () => { play = !play; });
  const out = readout(host);
  const phi = (xx) => 2e-4 / Math.pow(1 + Math.pow(xx / 0.03, 2), 1.5);
  loop(host, (dt) => { if (play) { t += dt; x = 0.12 * Math.sin(2 * Math.PI * f * t); hist.push([t, phi(x), 0]); if (hist.length > 1) { const a = hist.at(-2), b = hist.at(-1); b[2] = -N * (b[1] - a[1]) / Math.max(1e-4, b[0] - a[0]); } while (hist.length && t - hist[0][0] > 3) hist.shift(); } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'ε = −N dΦ/dt: the slope of the flux graph', col);
    const ht = h * 0.3, cy = top + (ht - top) / 2 + 6, cx = w / 2, px = (w * 0.38) / 0.12;
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.ellipse(cx - 14 + k * 7, cy, 6, 26, 0, 0, 7); ctx.stroke(); } ctx.restore();
    barMagnet(ctx, cx + x * px, cy, 70, 18, col);
    const gh = (h - ht - 20) / 2;
    const g1 = axes(ctx, w, h, col, { x: [0, 3], y: [0, 2.4e-4], t: ht + 6, b: h - (ht + 6 + gh - 14), l: 52, r: 12, xt: [], yt: [0, 1e-4, 2e-4], fy: (v) => (v * 1e3).toFixed(1) });
    text(ctx, 'flux Φ (mWb)', g1.L + 6, g1.T + 8, { color: col.muted, size: 10.5 });
    const g2 = axes(ctx, w, h, col, { x: [0, 3], y: [-0.25, 0.25], t: ht + 14 + gh, b: 34, l: 52, r: 12, xt: [0, 1, 2, 3], fx: (v) => v, yt: [-0.2, 0, 0.2], fy: (v) => v, xlabel: 'time (last 3 s)' });
    text(ctx, 'emf ε (V)', g2.L + 6, g2.T + 8, { color: col.muted, size: 10.5 });
    const t0 = hist.length ? hist[0][0] : 0;
    for (const [g, k, c] of [[g1, 1, col.s[0]], [g2, 2, col.s[1]]]) { ctx.save(); ctx.beginPath(); ctx.rect(g.L, g.T, g.R - g.L, g.B - g.T); ctx.clip(); ctx.strokeStyle = c; ctx.lineWidth = 2.2; ctx.beginPath(); hist.forEach((p, i) => { const X = g.X(p[0] - t0), Y = g.Y(p[k]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.restore(); }
    const pk = hist.reduce((m, p) => Math.max(m, Math.abs(p[2])), 0);
    out.innerHTML = `With N = ${N} turns and ${f.toFixed(1)} swings a second, the emf peaks near <b>${si(pk, 'V')}</b>. It is zero when Φ is at its peak (magnet at the coil's centre, slope 0) and largest when Φ is changing fastest. The sign flips as the magnet comes in and goes out.`;
  };
  cv.redraw();
}
