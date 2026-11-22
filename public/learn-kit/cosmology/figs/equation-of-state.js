// 9.4 The equation of state w = p/(ρc²) of dark energy. Top: w against redshift for the common two-number
// description w(a) = w0 + wa(1 − a) (Chevallier-Polarski 2001, Linder 2003); w0 is today's value, wa how it
// changes. Bottom: what that does to the density of dark energy as the universe grows (today = 1):
// ρ ∝ a^(−3(1 + w0 + wa)) exp(−3 wa (1 − a)). The grey lines are matter (1/a³) and a cosmological constant
// (flat). The readout gives q0 for a flat universe with Ωm = 0.31: q0 = Ωm/2 + (1 + 3w0)(1 − Ωm)/2.
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';

const rhoDE = (a, w0, wa) => Math.pow(a, -3 * (1 + w0 + wa)) * Math.exp(-3 * wa * (1 - a));

export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 440, label: 'Dark energy equation of state w against redshift, and its density against the size of the universe' });
  let w0 = -1, wa = 0;
  const ctl = row(host);
  slider(ctl, { label: 'w₀ (today)', min: -1.6, max: -0.3, step: 0.01, value: w0, fmt: (v) => v.toFixed(2), oninput: (v) => { w0 = v; show(); cv.redraw(); } });
  slider(ctl, { label: 'wₐ (change)', min: -2, max: 1, step: 0.01, value: wa, fmt: (v) => v.toFixed(2), oninput: (v) => { wa = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const Om = 0.31, q = Om / 2 + ((1 + 3 * w0) * (1 - Om)) / 2;
    const kind = Math.abs(w0 + 1) < 0.005 && Math.abs(wa) < 0.005 ? 'a <b>cosmological constant</b> (w = −1 always)'
      : w0 < -1 ? 'today <b>phantom</b> (w below −1: its density grows as space grows)' : 'today <b>thinning slowly</b> (w above −1, like quintessence)';
    out.innerHTML = `This dark energy is ${kind}. With Ωm = 0.31: q₀ = <b>${q.toFixed(2)}</b>, so the expansion is ${q < 0 ? '<b>speeding up</b>' : '<b>not</b> speeding up (w₀ must be well below −1/3)'}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'How dark energy behaves over time', col);
    const mid = top + (h - top) * 0.46;
    // top panel: w(z)
    const A = axes(ctx, w, mid, col, { x: [0, 3], y: [-2.2, 0.2], t: top + 8, b: 34, l: 48, xlabel: 'Redshift z (back in time →)', ylabel: 'w', xt: [0, 1, 2, 3], yt: [-2, -1.5, -1, -0.5, 0] });
    ctx.save(); A.clip();
    line(ctx, [[A.L, A.Y(-1 / 3)], [A.R, A.Y(-1 / 3)]], col.muted, 1.2, [3, 3]);
    line(ctx, [[A.L, A.Y(-1)], [A.R, A.Y(-1)]], col.muted, 1.5, [7, 4]);
    const zs = []; for (let z = 0; z <= 3.0001; z += 0.03) zs.push(z);
    line(ctx, zs.map((z) => [A.X(z), A.Y(w0 + wa * z / (1 + z))]), col.s[0], 3);
    ctx.restore();
    text(ctx, 'w = −1 (constant Λ)', A.R - 4, A.Y(-1) + 11, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    text(ctx, 'w = −1/3: below this it pushes', A.R - 4, A.Y(-1 / 3) + 10, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    // bottom panel: density against size
    const B = axes(ctx, w, h, col, { x: [0.1, 10], y: [1e-3, 1e3], xlog: true, ylog: true, t: mid + 22, l: 48, xlabel: 'Size of the universe a (today = 1)', ylabel: 'Density', fx: (v) => (v < 1 ? String(v) : v.toFixed(0)), fy: (v) => (v < 1 ? String(v) : v.toFixed(0)) });
    ctx.save(); B.clip();
    const as = []; for (let e = -1; e <= 1.0001; e += 0.02) as.push(10 ** e);
    line(ctx, as.map((a) => [B.X(a), B.Y(1 / a ** 3)]), col.muted, 1.5, [7, 4]);
    line(ctx, as.map((a) => [B.X(a), B.Y(1)]), col.muted, 1.5, [2, 3]);
    line(ctx, as.map((a) => [B.X(a), B.Y(rhoDE(a, w0, wa))]), col.s[1], 3);
    ctx.restore();
    text(ctx, 'matter (1/a³)', B.X(0.5) + 8, B.Y(8), { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'dark energy (today = 1)', B.L + 6, B.B - 10, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
  };
  show(); cv.redraw();
}
