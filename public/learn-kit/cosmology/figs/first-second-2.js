// 6.4 The neutron-to-proton ratio player. Dashed: the balance the hot soup would keep if weak reactions were
// instant, n/p = e^(−Q/kT) with Q = 1.293 MeV, which falls towards zero. Solid: the ratio from a simple rate
// model (temperature-and-time-lib.js: Bernstein, Brown and Feinberg's weak rates plus free neutron decay,
// τ = 879 s). Below about 0.8 MeV (about 1 second) the swaps cannot keep up and the ratio levels off near 1/6,
// then neutron decay pulls it down slowly to about 1/7 by the time deuterium survives (kT ≈ 0.08 MeV, about
// 3 minutes), when the neutrons are locked into helium.
import { canvas, axes, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';
import { neutronHistory, timeText, Q, MEV_K } from './temperature-and-time-lib.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'Neutrons per proton against time in the first minutes, compared with the balance the hot soup would keep' });
  const hist = neutronHistory().map((o) => ({ ...o, np: o.X / (1 - o.X) }));
  const tD = hist.find((o) => o.T <= 0.08).t;
  const T0 = 0.01, T1 = 1000;
  let lt = 0; // log10 t
  const at = (t) => hist.find((o) => o.t >= t) || hist[hist.length - 1];
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Time since the start', min: T0 * 2, max: 600, value: 1, log: true, fmt: (v) => timeText(v), oninput: (v) => { lt = Math.log10(v); show(); cv.redraw(); } });
  const L = loop(host, (dt) => { lt += dt * 0.55; if (lt > Math.log10(600)) lt = Math.log10(T0 * 2); sl.set(10 ** lt); show(); cv.redraw(); }, { autoplay: false });
  L.button(ctl);
  const out = readout(host);
  const kelvin = (v) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(1)}×10${String(e).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])} K`; };
  const show = () => {
    const o = at(10 ** lt), eq = Math.exp(-Q / o.T);
    const locked = o.t >= tD;
    out.innerHTML = `<b>${timeText(o.t)}</b> · kT = ${o.T.toPrecision(2)} MeV (${kelvin(o.T * MEV_K)}) · balance e<sup>−Q/kT</sup> = ${eq < 0.001 ? eq.toExponential(1) : eq.toFixed(3)} · actual <b>n/p = ${o.np.toFixed(3)}</b>, 1 neutron for every <b>${(1 / o.np).toFixed(1)}</b> protons${locked ? '. Deuterium now survives and the neutrons are built into helium.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Neutrons per proton, the first minutes', col);
    const A = axes(ctx, w, h, col, {
      x: [T0, T1], y: [0, 1], xlog: true, t: top + 10, l: 46,
      xt: [0.01, 0.1, 1, 10, 100, 1000], fx: (v) => (v < 1 ? String(v) : v.toLocaleString('en-CA')) + ' s',
      xlabel: 'Time since the start (log scale)', ylabel: 'Neutrons per proton, n/p',
    });
    ctx.save(); A.clip();
    // after the bottleneck: shade
    ctx.fillStyle = col.soft; ctx.fillRect(A.X(tD), A.T, A.R - A.X(tD), A.B - A.T);
    const eqPts = hist.map((o) => [A.X(o.t), A.Y(Math.exp(-Q / o.T))]);
    line(ctx, eqPts, col.s[1], 2, [6, 4]);
    line(ctx, hist.filter((o) => o.t <= tD).map((o) => [A.X(o.t), A.Y(o.np)]), col.s[0], 2.8);
    line(ctx, hist.filter((o) => o.t >= tD).map((o) => [A.X(o.t), A.Y(o.np)]), col.s[0], 1.5, [2, 3]);
    for (const [v, s] of [[1 / 6, '1/6'], [1 / 7, '1/7']]) { line(ctx, [[A.L, A.Y(v)], [A.R, A.Y(v)]], col.muted, 0.8, [2, 4]); text(ctx, s, A.L + 4, A.Y(v) + (s === '1/6' ? -7 : 8), { color: col.muted, size: 10.5 }); }
    ctx.restore();
    text(ctx, 'balance if swaps were instant', A.X(0.012), A.Y(0.93), { color: col.s[1], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'actual: frozen, then decaying', A.X(1.6), A.Y(0.36), { color: col.s[0], size: 11, weight: 600, halo: col.panel });
    text(ctx, 'deuterium survives', A.X(tD) - 4, A.Y(0.72), { color: col.ink, size: 11, weight: 600, align: 'right', halo: col.panel });
    text(ctx, '≈ 3 min', A.X(tD) - 4, A.Y(0.72) + 14, { color: col.ink, size: 11, align: 'right', halo: col.panel });
    const o = at(10 ** lt);
    line(ctx, [[A.X(o.t), A.T], [A.X(o.t), A.B]], col.ink, 1, [4, 3]);
    dot(ctx, A.X(o.t), A.Y(o.np), 6, col.s[0], col.panel);
  };
  show(); cv.redraw();
}
