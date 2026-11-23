// Class 11 Kinetic Theory: the gas laws from PV = nRT for 1 mol. Boyle (T fixed): P V = constant, a hyperbola (isotherm). Charles (P fixed): V is
// proportional to absolute T, a straight line reaching V = 0 at -273 C. Gay-Lussac (V fixed): P proportional to T. Move the dot and the family member.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const R = 0.0821;
const MODES = {
  boyle: { name: 'Boyle: P–V at fixed T', xr: [0, 50], yr: [0, 8], xl: 'volume V (litre)', yl: 'pressure P (atm)', par: ['temperature T (K)', 200, 600, 50, 300], x: ['volume V (L)', 5, 50, 1, 20] },
  charles: { name: 'Charles: V–T at fixed P', xr: [0, 500], yr: [0, 80], xl: 'temperature T (K)', yl: 'volume V (litre)', par: ['pressure P (atm)', 0.5, 4, 0.5, 1], x: ['temperature T (K)', 50, 500, 10, 300] },
  gay: { name: 'Gay-Lussac: P–T at fixed V', xr: [0, 500], yr: [0, 8], xl: 'temperature T (K)', yl: 'pressure P (atm)', par: ['volume V (L)', 5, 50, 5, 25], x: ['temperature T (K)', 50, 500, 10, 300] },
};
export default function (host) {
  let mode = 'boyle', par = 300, xv = 20;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'Pressure, volume and temperature of one mole of ideal gas' });
  const ctl = row(host), ro = readout(host);
  let s1, s2;
  const reset = () => { const m = MODES[mode]; par = m.par[4]; xv = m.x[4]; s1.set(par); s2.set(xv); };
  choice(ctl, 'Law', [['boyle', 'Boyle'], ['charles', 'Charles'], ['gay', 'Gay-Lussac']], mode, (v) => { mode = v; relabel(); reset(); go(); });
  const holder = document.createElement('div'); holder.className = 'lk-controls'; host.appendChild(holder);
  const build = () => { holder.innerHTML = ''; const m = MODES[mode];
    s1 = slider(holder, { label: m.par[0], min: m.par[1], max: m.par[2], step: m.par[3], value: par, fmt: (v) => +v.toFixed(1), oninput: (v) => { par = v; go(); } });
    s2 = slider(holder, { label: m.x[0], min: m.x[1], max: m.x[2], step: m.x[3], value: xv, fmt: (v) => +v.toFixed(1), oninput: (v) => { xv = v; go(); } }); };
  const relabel = () => { const m = MODES[mode]; par = m.par[4]; xv = m.x[4]; build(); };
  build(); host.insertBefore(holder, ro);
  const val = (x, p) => (mode === 'boyle' ? R * p / x : mode === 'charles' ? R * x / p : R * x / p);
  const go = () => { const m = MODES[mode], y = val(xv, par);
    ro.innerHTML = mode === 'boyle' ? `P V = ${(y * xv).toFixed(1)} L·atm every point on this curve (= nRT). At V = ${xv} L, P = <b>${y.toFixed(2)} atm</b>.` : mode === 'charles' ? `V/T = ${(y / xv).toFixed(3)} L/K stays the same. At T = ${xv} K (${(xv - 273.15).toFixed(0)} °C), V = <b>${y.toFixed(1)} L</b>.` : `P/T = ${(y / xv).toFixed(4)} atm/K stays the same. At T = ${xv} K, P = <b>${y.toFixed(2)} atm</b>.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const m = MODES[mode], top = title(ctx, m.name, col);
    const A = axes(ctx, w, h, col, { x: m.xr, y: m.yr, xlabel: m.xl, ylabel: m.yl, l: 46, t: top + 8, b: 40 });
    const xs = Array.from({ length: 101 }, (_, i) => m.xr[0] + (m.xr[1] - m.xr[0]) * i / 100).filter((x) => mode !== 'boyle' || x > 2);
    const curve = (p, c, wd, dash) => { const pts = xs.map((x) => [A.X(x), A.Y(val(x, p))]); ctx.save(); A.clip(); line(ctx, pts, c, wd, dash); ctx.restore(); };
    const fam = mode === 'boyle' ? [200, 300, 400, 500, 600] : mode === 'charles' ? [0.5, 1, 2, 4] : [5, 15, 25, 40, 50];
    fam.forEach((p) => curve(p, col.line, 1.5, [4, 3]));
    curve(par, col.s[0], 3);
    const y = val(xv, par); line(ctx, [[A.X(xv), A.B], [A.X(xv), A.Y(y)], [A.L, A.Y(y)]], col.s[2], 1.2, [3, 3]); dot(ctx, A.X(xv), A.Y(y), 6, col.s[2], col.ink);
    if (mode === 'charles') text(ctx, 'line points to V = 0 at T = 0 K (−273 °C)', A.L + 8, A.B - 12, { color: col.muted, size: 10.5 });
  };
  go();
}
