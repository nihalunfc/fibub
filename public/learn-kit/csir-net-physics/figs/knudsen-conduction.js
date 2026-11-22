// 6.4 Kinetic transport. View 1: heat conducted by a gas between plates a distance L apart against pressure (log-log),
// interpolating between the free-molecular regime (flux ~ P) and the continuum (flux independent of P), with the
// mean free path of nitrogen at 300 K. View 2: the free-path survival law exp(-x/lambda) with mean and median marked.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const LAM1 = 6.81e-3; // mean free path of N2 at 300 K and 1 Pa, in m

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Heat conduction through a gas against pressure, and the distribution of free paths' });
  let view = 'k', Lmm = 5, P = 3;
  const ctl = row(host);
  choice(ctl, 'View', [['k', 'Conduction vs pressure'], ['s', 'Free-path law']], view, (v) => { view = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Gap L (mm)', min: 0.1, max: 50, value: Lmm, log: true, fmt: (v) => v.toPrecision(2), oninput: (v) => { Lmm = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Pressure (Pa)', min: 0.001, max: 1e5, value: P, log: true, fmt: (v) => v.toPrecision(2), oninput: (v) => { P = v; cv.redraw(); show(); } });
  const out = readout(host);
  const flux = (p) => { const lam = LAM1 / p, Kn = lam / (Lmm * 1e-3); return 1 / (1 + 2 * Kn); }; // continuum value = 1
  const show = () => {
    const lam = LAM1 / P, Kn = lam / (Lmm * 1e-3);
    out.innerHTML = view === 'k'
      ? `N₂ at 300 K and ${P.toPrecision(2)} Pa: mean free path λ = <b>${(lam * 1e3).toPrecision(3)} mm</b>, Knudsen number λ/L = <b>${Kn.toPrecision(3)}</b>. Conducted heat = <b>${(flux(P) * 100).toFixed(1)}%</b> of the continuum value: ${Kn > 3 ? 'free-molecular, rising in proportion to P' : Kn < 0.03 ? 'continuum, independent of P' : 'transition region'}.`
      : 'Probability of flying a distance x without a collision: e<sup>−x/λ</sup>. The mean free path is λ, the median only 0.693λ, and 13.5% of molecules fly farther than 2λ.';
  };
  cv.draw = (ctx, W, H, col) => {
    if (view === 's') {
      const ax = axes(ctx, W, H, col, { x: [0, 4], y: [0, 1.05], xlabel: 'distance x/λ', ylabel: 'survival probability', t: 34 });
      title(ctx, 'Free paths are exponentially distributed', col);
      const pts = []; for (let i = 0; i <= 200; i++) { const x = (i / 200) * 4; pts.push([ax.X(x), ax.Y(Math.exp(-x))]); }
      line(ctx, pts, col.s[0], 2.5);
      line(ctx, [[ax.X(Math.LN2), ax.Y(0)], [ax.X(Math.LN2), ax.Y(0.5)]], col.s[2], 1.2, [4, 3]);
      line(ctx, [[ax.X(1), ax.Y(0)], [ax.X(1), ax.Y(Math.exp(-1))]], col.s[3], 1.2, [4, 3]);
      text(ctx, 'median 0.693λ', ax.X(Math.LN2) + 4, ax.Y(0.55), { color: col.s[2], size: 11, halo: col.panel });
      text(ctx, 'mean λ', ax.X(1) + 4, ax.Y(0.42), { color: col.s[3], size: 11, halo: col.panel });
      return;
    }
    const ax = axes(ctx, W, H, col, { x: [1e-3, 1e5], y: [1e-4, 2], xlog: true, ylog: true, xlabel: 'pressure (Pa)', ylabel: 'heat flux / continuum value', t: 34 });
    title(ctx, 'From Knudsen (flux ∝ P) to continuum (flux constant)', col);
    ctx.save(); ax.clip();
    const pts = []; for (let i = 0; i <= 300; i++) { const p = Math.pow(10, -3 + (i / 300) * 8); pts.push([ax.X(p), ax.Y(flux(p))]); }
    line(ctx, pts, col.s[0], 2.6);
    dot(ctx, ax.X(P), ax.Y(flux(P)), 5, col.s[3]);
    ctx.restore();
  };
  cv.redraw(); show();
}
