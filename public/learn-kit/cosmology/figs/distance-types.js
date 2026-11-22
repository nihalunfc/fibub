// 5.8 Distances in an expanding universe, for today's best model (Planck 2018, rounded). Three useful
// distances to a galaxy at redshift z: the comoving distance (how far it is now), the luminosity distance
// (what the inverse square law would say from its faintness, (1 + z) × comoving) and the angular-diameter
// distance (what its apparent size would say, comoving ÷ (1 + z)). The light-travel distance (lookback time ×
// c) is shown too. Slide z; a ruler shows the angular size of a galaxy 30,000 light-years across.
import { canvas, axes, text, title, line, dot, row, slider, readout } from '../../kit.js';
import { comovingMpc, luminosityMpc, angularMpc, lookbackGyr, PLANCK18 as P, MPC, LY, ARCSEC } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 300, label: 'Four kinds of distance against redshift' });
  let z = 1;
  const G = (mpc) => (mpc * MPC) / LY / 1e9; // Mpc to billion light-years
  const zs = []; for (let e = -2; e <= 1.0001; e += 0.04) zs.push(10 ** e);
  const curves = {
    lum: zs.map((x) => [x, G(luminosityMpc(x, P))]),
    com: zs.map((x) => [x, G(comovingMpc(x, P))]),
    lt: zs.map((x) => [x, lookbackGyr(x, P)]),
    ang: zs.map((x) => [x, G(angularMpc(x, P))]),
  };
  const ctl = row(host);
  slider(ctl, { label: 'Redshift z', min: 0.01, max: 10, value: z, log: true, fmt: (v) => v.toPrecision(2), oninput: (v) => { z = v; show(); cv.redraw(); } });
  const out = readout(host);
  const show = () => {
    const c = G(comovingMpc(z, P)), l = G(luminosityMpc(z, P)), d = G(angularMpc(z, P)), t = lookbackGyr(z, P);
    const size = (30000 * LY) / MPC / angularMpc(z, P) / ARCSEC;
    out.innerHTML = `At z = ${z.toPrecision(2)}: the light travelled <b>${t.toFixed(1)}</b> billion years; the galaxy is now <b>${c.toFixed(1)}</b> billion light-years away (comoving); its faintness says <b>${l.toFixed(1)}</b> (luminosity distance); its size says <b>${d.toFixed(1)}</b> (angular-diameter distance). A galaxy 30,000 light-years across looks <b>${size.toFixed(1)}″</b> wide.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0.01, 10], y: [0, 50], xlog: true, t: 40, xlabel: 'Redshift z', ylabel: 'Distance (billion light-years)', fx: (v) => String(v) });
    const cs = { lum: col.s[3], com: col.s[0], lt: col.s[1], ang: col.s[2] };
    ctx.save(); A.clip();
    for (const k of Object.keys(curves)) line(ctx, curves[k].map(([x, y]) => [A.X(x), A.Y(y)]), cs[k], 2.2);
    line(ctx, [[A.X(z), A.T], [A.X(z), A.B]], col.ink, 1, [4, 3]);
    ctx.restore();
    const names = [['lum', 'luminosity (faintness)'], ['com', 'comoving (now)'], ['lt', 'light-travel time × c'], ['ang', 'angular diameter (size)']];
    names.forEach(([k, n], i) => text(ctx, '— ' + n, A.L + 8, A.T + 12 + i * 16, { color: cs[k], size: 11.5, weight: 700, halo: col.panel }));
    title(ctx, 'One galaxy, four distances', col);
  };
  show(); cv.redraw();
}
