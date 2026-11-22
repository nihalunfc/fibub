// 6.5 Why the relic neutrinos are colder than the light. Each line is a temperature multiplied by the size of
// the universe, scaled to today's size: anything that simply cools as 1/a draws a flat line. Neutrinos let go
// near 1 MeV (about 1 second) and cool as 1/a ever after: flat at 1.95 K. Then electrons and positrons
// annihilate (most between about 2 and 100 seconds) and hand all their heat to the light, lifting its line by
// (11/4)^(1/3) = 1.40, to today's 2.7255 K. The heating comes from entropy conservation, worked out exactly from
// the e± share in temperature-and-time-lib.js (pairShare).
import { canvas, axes, text, title, line, row, slider, readout } from '../../kit.js';
import { tempAt, timeText, pairShare, nuRatio, MEV_K } from './temperature-and-time-lib.js';
import { T_CMB } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'Temperature times size for light and for neutrinos through the first minutes: the light is heated by electron-positron annihilation, the neutrinos are not' });
  const T0 = 0.01, T1 = 3000;
  const Tnu0 = Math.cbrt(4 / 11) * T_CMB;
  const scaled = (t) => { const T = tempAt(t) / MEV_K; return T_CMB * Math.cbrt(2 / (2 + 3.5 * pairShare(T))); };
  const pts = [];
  for (let l = -2; l <= Math.log10(T1) + 1e-9; l += 0.04) pts.push([10 ** l, scaled(10 ** l)]);
  let t = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Time since the start', min: T0, max: T1, value: t, log: true, fmt: (v) => timeText(v), oninput: (v) => { t = v; show(); cv.redraw(); } });
  const out = readout(host);
  const K = (v) => (v >= 1e5 ? `${(v / 10 ** Math.floor(Math.log10(v))).toFixed(2)}×10${String(Math.floor(Math.log10(v))).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d])} K` : `${v.toPrecision(3)} K`);
  const show = () => {
    const Tg = tempAt(t), T = Tg / MEV_K, Tn = Tg * nuRatio(T);
    out.innerHTML = `At <b>${timeText(t)}</b>: light ${K(Tg)}, neutrinos ${K(Tn)} (ratio <b>${(Tn / Tg).toFixed(3)}</b>). ${T > 1.5 ? 'Neutrinos still collide with electrons and share their heat.' : T > 0.15 ? 'Neutrinos fly free; electrons and positrons are annihilating and heating only the light.' : 'Annihilation is over: the ratio stays 0.714 forever, giving 1.95 K against 2.73 K today.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Light gets a boost; neutrinos miss it', col);
    const A = axes(ctx, w, h, col, {
      x: [T0, T1], y: [1.6, 3], xlog: true, t: top + 10, l: 50,
      xt: [0.01, 0.1, 1, 10, 100, 1000], fx: (v) => (v < 1 ? String(v) : v.toLocaleString('en-CA')) + ' s', yt: [1.6, 2, 2.4, 2.8],
      xlabel: 'Time since the start (log scale)', ylabel: 'Temperature × size (K)',
    });
    ctx.save(); A.clip();
    ctx.fillStyle = col.soft;
    ctx.fillRect(A.X(0.3), A.T, A.X(3) - A.X(0.3), A.B - A.T);
    line(ctx, pts.map(([x, y]) => [A.X(x), A.Y(y)]), col.s[1], 2.8);
    line(ctx, [[A.L, A.Y(Tnu0)], [A.R, A.Y(Tnu0)]], col.s[0], 2.8);
    line(ctx, [[A.X(t), A.T], [A.X(t), A.B]], col.ink, 1, [4, 3]);
    ctx.restore();
    text(ctx, 'neutrinos let go', A.X(1), A.T + 12, { color: col.ink, size: 11, weight: 600, align: 'center', halo: col.panel });
    text(ctx, 'light: 2.73 K today', A.R - 4, A.Y(T_CMB) - 12, { color: col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'neutrinos: 1.95 K today', A.R - 4, A.Y(Tnu0) + 13, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'e± annihilation', A.X(25), A.Y(2.13), { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'heats the light', A.X(25), A.Y(2.13) + 14, { color: col.muted, size: 11, halo: col.panel });
  };
  show(); cv.redraw();
}
