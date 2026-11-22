// 5.5 How each ingredient thins out as the universe grows. Matter: the same particles in a bigger box, so its
// density falls as 1/a³. Radiation: fewer per volume (1/a³) and each photon stretched (another 1/a), so 1/a⁴.
// Dark energy (a cosmological constant): the same density whatever the size. Log-log plot from the early
// universe to the far future with today's mix (Planck 2018, rounded); the dots mark when each took over.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { PLANCK18 as P } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 300, label: 'Density of radiation, matter and dark energy against the size of the universe' });
  let a = 1;
  const ctl = row(host);
  slider(ctl, { label: 'Size of the universe a', min: 1e-5, max: 10, value: a, log: true, fmt: (v) => (v >= 0.01 ? v.toFixed(v < 1 ? 3 : 2) : v.toExponential(1)), oninput: (v) => { a = v; show(); cv.redraw(); } });
  const out = readout(host);
  const rho = { r: (x) => P.Or / x ** 4, m: (x) => P.Om / x ** 3, L: () => P.OL };
  const show = () => {
    const r = rho.r(a), m = rho.m(a), L = rho.L(), s = r + m + L;
    out.innerHTML = `At a = ${a < 0.01 ? a.toExponential(1) : a.toPrecision(3)} (z = ${a < 1 ? (1 / a - 1).toPrecision(3) : 'future'}): radiation <b>${(100 * r / s).toFixed(1)}%</b>, matter <b>${(100 * m / s).toFixed(1)}%</b>, dark energy <b>${(100 * L / s).toFixed(1)}%</b> of the total.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Each ingredient thins out at its own rate', col);
    const A = axes(ctx, w, h, col, { x: [1e-5, 10], y: [1e-3, 1e15], xlog: true, ylog: true, t: top + 10, l: 58, xlabel: 'Size of the universe, a (today = 1)', ylabel: 'Density (today\'s total = 1)', yt: [1e-3, 1, 1e3, 1e6, 1e9, 1e12, 1e15] });
    const xs = []; for (let e = -5; e <= 1.0001; e += 0.05) xs.push(10 ** e);
    const cs = { r: col.s[3], m: col.s[0], L: col.s[1] };
    ctx.save(); A.clip();
    for (const k of ['r', 'm', 'L']) line(ctx, xs.map((x) => [A.X(x), A.Y(rho[k](x))]), cs[k], 2.2);
    const aEq = P.Or / P.Om, aL = Math.cbrt(P.Om / P.OL);
    dot(ctx, A.X(aEq), A.Y(rho.m(aEq)), 5, col.ink, col.panel);
    dot(ctx, A.X(aL), A.Y(rho.L()), 5, col.ink, col.panel);
    line(ctx, [[A.X(a), A.T], [A.X(a), A.B]], col.ink, 1, [4, 3]);
    ctx.restore();
    text(ctx, 'radiation ∝ 1/a⁴', A.X(2e-5), A.Y(rho.r(2e-5) / 2e3), { color: cs.r, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'matter ∝ 1/a³', A.X(2e-4), A.Y(rho.m(2e-4) * 3e2), { color: cs.m, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'dark energy: constant', A.X(1.5e-3), A.Y(P.OL) - 12, { color: cs.L, size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'matter takes over', A.X(aEq) + 8, A.Y(rho.m(aEq)) + 14, { color: col.ink, size: 11, halo: col.panel });
    text(ctx, 'dark energy takes over', A.X(aL), A.Y(P.OL) + 16, { color: col.ink, size: 11, align: 'center', halo: col.panel });
  };
  show(); cv.redraw();
}
