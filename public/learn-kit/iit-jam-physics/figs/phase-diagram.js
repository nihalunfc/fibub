// 5.5 Pressure-temperature phase diagram (log pressure axis) for water or carbon dioxide. The vaporisation and
// sublimation curves follow the integrated Clausius-Clapeyron law with a constant latent heat (a model fitted to the
// real end points, so numbers are close but not exact); the melting line uses the Clapeyron slope. A temperature
// slider moves a point along the vaporisation curve and draws the tangent, with dP/dT = LP/(RT²) in the readout.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

const R = 8.314;
// Lv/R fitted through two real points on the liquid-vapour curve; Lf = latent heat of fusion (J/mol);
// melt = Clapeyron slope of the melting line (Pa/K).
const SUBS = {
  water: { name: 'Water', T1: 373.15, P1: 101325, Tc: 647.1, Pc: 22.06e6, Tt: 273.16, Lf: 6010, melt: -1.35e7, x: [180, 700], y: [1, 1e9] },
  co2: { name: 'Carbon dioxide', T1: 216.58, P1: 5.18e5, Tc: 304.13, Pc: 7.38e6, Tt: 216.58, Lf: 9020, melt: 5.0e6, x: [150, 340], y: [1e3, 1e9] },
};
const ATM = 101325;

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 270, label: 'Phase diagram: pressure on a log scale against temperature, with solid, liquid and gas regions, the triple and critical points, and the tangent to the boiling curve' });
  let key = 'water', T = 373;
  const ctl = row(host);
  const S = () => SUBS[key];
  const model = () => {
    const s = S(), Lv = R * Math.log(s.Pc / s.P1) / (1 / s.T1 - 1 / s.Tc);   // J/mol
    const Pv = (t) => s.P1 * Math.exp(-(Lv / R) * (1 / t - 1 / s.T1));
    const Pt = Pv(s.Tt), Ls = Lv + s.Lf;
    const Ps = (t) => Pt * Math.exp(-(Ls / R) * (1 / t - 1 / s.Tt));
    return { s, Lv, Ls, Pv, Ps, Pt };
  };
  const sl = slider(ctl, { label: 'Temperature on the boiling curve', min: 0, max: 1, step: 0.001, value: 0.5, fmt: () => fmt(T, 4) + ' K', oninput: (v) => { setT(v); } });
  const setT = (v) => { const s = S(); T = s.Tt + (s.Tc - s.Tt) * v; cv.redraw(); show(); };
  choice(ctl, 'Substance', [['water', 'Water'], ['co2', 'CO₂']], key, (v) => { key = v; const s = S(); sl.set(key === 'water' ? (373.15 - s.Tt) / (s.Tc - s.Tt) : 0.5); setT(sl.value); });
  const out = readout(host);
  const show = () => {
    const m = model(), P = m.Pv(T), slope = m.Lv * P / (R * T * T);
    out.innerHTML = `${m.s.name}, model with constant L<sub>vap</sub> = <b>${fmt(m.Lv / 1000, 3)} kJ/mol</b>. At <b>${fmt(T, 4)} K</b> the vapour pressure is <b>${fmt(P / 1000, 3)} kPa</b> (${fmt(P / ATM, 3)} atm), so this is the boiling point at that pressure. Clausius–Clapeyron slope dP/dT = LP/RT² = <b>${fmt(slope / 1000, 3)} kPa/K</b>. Melting line slope: <b>${fmt(m.s.melt / ATM, 3)} atm/K</b> (${m.s.melt < 0 ? 'negative: ice is less dense than water' : 'positive: the solid is denser'}).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const m = model(), s = m.s;
    const ax = axes(ctx, w, h, col, { x: s.x, y: s.y, ylog: true, xlabel: 'temperature T (K)', ylabel: 'pressure P (Pa)', t: 34, l: 50 });
    title(ctx, `${s.name}: phase diagram (log pressure)`, col);
    ctx.save(); ax.clip();
    const curve = (f, a, b) => { const pts = []; for (let i = 0; i <= 200; i++) { const t = a + (b - a) * i / 200, p = f(t); if (p > 0) pts.push([ax.X(t), ax.Y(p)]); } return pts; };
    // melting line: P = Pt + melt (T - Tt), up to the top of the plot
    const pts = []; for (let i = 0; i <= 200; i++) { const p = m.Pt * Math.pow(s.y[1] / m.Pt, i / 200); pts.push([ax.X(s.Tt + (p - m.Pt) / s.melt), ax.Y(p)]); }
    line(ctx, pts, col.s[2], 2.5);
    line(ctx, curve(m.Ps, s.x[0], s.Tt), col.s[3], 2.5);
    line(ctx, curve(m.Pv, s.Tt, s.Tc), col.s[0], 2.5);
    // 1 atm line
    line(ctx, [[ax.X(s.x[0]), ax.Y(ATM)], [ax.X(s.x[1]), ax.Y(ATM)]], col.muted, 1, [4, 4]);
    text(ctx, '1 atm', ax.R - 4, ax.Y(ATM) - 8, { color: col.muted, size: 11, align: 'right', halo: col.panel });
    // tangent at T, in log-pressure coordinates: d(log10 P)/dT = Lv/(R T^2 ln10)
    const P = m.Pv(T), k = m.Lv / (R * T * T * Math.LN10), dT = (s.x[1] - s.x[0]) * 0.12;
    line(ctx, [[ax.X(T - dT), ax.Y(P * Math.pow(10, -k * dT))], [ax.X(T + dT), ax.Y(P * Math.pow(10, k * dT))]], col.s[4], 2, [6, 4]);
    dot(ctx, ax.X(T), ax.Y(P), 6, col.s[4], col.panel);
    dot(ctx, ax.X(s.Tt), ax.Y(m.Pt), 5, col.ink);
    dot(ctx, ax.X(s.Tc), ax.Y(m.Pv(s.Tc)), 5, col.ink);
    text(ctx, 'triple point', ax.X(s.Tt) + 8, ax.Y(m.Pt) + 12, { color: col.ink, size: 11, halo: col.panel });
    text(ctx, 'critical point', ax.X(s.Tc) - 6, ax.Y(m.Pv(s.Tc)) - 12, { color: col.ink, size: 11, align: 'right', halo: col.panel });
    const yMid = (a, b) => Math.sqrt(a * b);
    text(ctx, 'SOLID', ax.X(s.x[0] + (s.Tt - s.x[0]) * 0.45), ax.Y(yMid(m.Pt, s.y[1])), { color: col.s[2], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'LIQUID', ax.X(s.Tt + (s.Tc - s.Tt) * 0.35), ax.Y(yMid(m.Pv(s.Tt + (s.Tc - s.Tt) * 0.35), s.y[1]) * 3), { color: col.s[0], size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'GAS', ax.X(s.Tt + (s.x[1] - s.Tt) * 0.7), ax.Y(yMid(s.y[0], m.Pv(s.Tt + (s.x[1] - s.Tt) * 0.5))), { color: col.s[3], size: 13, weight: 700, align: 'center', halo: col.panel });
    ctx.restore();
  };
  setT(sl.value);
  sl.set((373.15 - SUBS.water.Tt) / (SUBS.water.Tc - SUBS.water.Tt)); setT(sl.value);
}
