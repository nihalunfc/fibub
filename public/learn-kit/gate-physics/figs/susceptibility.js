// 7.9 Magnetism. Mean-field susceptibility of a paramagnet (Curie), a ferromagnet (Curie-Weiss above T_C) and a
// two-sublattice antiferromagnet (C/(T + theta) above T_N, parallel and perpendicular branches below), drawn as
// chi(T) or 1/chi(T). A third view solves the mean-field equation m = tanh(m T_C / T) for the spontaneous
// magnetisation of spin-1/2 moments. Units: C = 1 K, temperatures in kelvin.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

// spontaneous m(T) for spin 1/2: m = tanh(m Tc / T), by iteration from m = 1 (converges monotonically)
export function mfM(t) {
  if (t >= 1) return 0;
  let m = 1;
  for (let i = 0; i < 400; i++) m = Math.tanh(m / t);
  return m;
}
// parallel susceptibility of the antiferromagnet below T_N (spin 1/2, mean field), relative to chi(T_N):
// chi_par = (1 - m²) / (t + (1 - m²)) * 2 in units where chi(T_N) = 1, with t = T/T_N
const chiPar = (t) => { const m = mfM(t), s = 1 - m * m; return t <= 0 ? 0 : 2 * s / (t + s); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.68, max: 450, min: 300, label: 'Magnetic susceptibility against temperature for para-, ferro- and antiferromagnets, and the mean-field magnetisation' });
  let th = 100, mode = 'inv';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const m = mfM(0.5);
    out.innerHTML = mode === 'mft'
      ? `Mean field for spin ½: M/M<sub>s</sub> = tanh[(M/M<sub>s</sub>)(T<sub>C</sub>/T)]. At T = T<sub>C</sub>/2 it is <b>${fmt(m, 3)}</b>; near T<sub>C</sub>, M ≈ √3 (1 − T/T<sub>C</sub>)<sup>1/2</sup>, the exponent β = ½.`
      : `Ordering temperature ${th} K (Curie constant 1 K). Para: 1/χ = T (through the origin). Ferro: 1/χ = T − ${th}, hitting zero at T<sub>C</sub>. Antiferro: 1/χ = T + ${th} above T<sub>N</sub> = ${th} K, so the line extrapolates to <b>−${th} K</b>; below T<sub>N</sub>, χ<sub>⊥</sub> stays flat and χ<sub>∥</sub> falls to zero.`;
  };
  slider(ctl, { label: 'T_C, T_N (K)', min: 20, max: 200, step: 5, value: th, fmt: (v) => String(Math.round(v)), oninput: (v) => { th = v; cv.redraw(); show(); } });
  choice(ctl, 'View', [['inv', '1/χ'], ['chi', 'χ'], ['mft', 'M(T)']], mode, (v) => { mode = v; cv.redraw(); show(); });

  cv.draw = (ctx, w, h, col) => {
    const T1 = 400, Ts = Array.from({ length: 401 }, (_, i) => 0.5 + (T1 - 0.5) * i / 400);
    if (mode === 'mft') {
      const a = axes(ctx, w, h, col, { x: [0, 1.2], y: [0, 1.1], xlabel: 'T / T_C', ylabel: 'M / M_s', t: 24 });
      const xs = Array.from({ length: 241 }, (_, i) => 0.005 + 1.195 * i / 240);
      ctx.save(); a.clip();
      line(ctx, xs.map((t) => [a.X(t), a.Y(mfM(t))]), col.s[0], 2.6);
      line(ctx, xs.filter((t) => t < 1).map((t) => [a.X(t), a.Y(Math.min(1.1, Math.sqrt(3 * (1 - t))))]), col.muted, 1.2, [5, 4]);
      ctx.restore();
      text(ctx, 'mean field, spin ½', a.L + 8, a.B - 40, { color: col.s[0], size: 12, weight: 700 });
      text(ctx, 'dashed: √3 (1 − T/T_C)^½', a.L + 8, a.B - 22, { color: col.muted, size: 11 });
      return;
    }
    const para = (T) => 1 / T, ferro = (T) => (T > th ? 1 / (T - th) : NaN);
    const afm = (T) => (T >= th ? 1 / (T + th) : NaN);
    const chiN = 1 / (2 * th), perp = () => chiN, par = (T) => chiN * chiPar(T / th);
    if (mode === 'inv') {
      const a = axes(ctx, w, h, col, { x: [-200, T1], y: [0, T1 + 200], xlabel: 'temperature T (K)', ylabel: '1 / χ (K)', t: 24 });
      ctx.save(); a.clip();
      line(ctx, [[a.X(0), a.Y(0)], [a.X(T1), a.Y(T1)]], col.ink, 2);
      line(ctx, Ts.filter((T) => T > th).map((T) => [a.X(T), a.Y(T - th)]), col.s[0], 2.4);
      line(ctx, Ts.filter((T) => T >= th).map((T) => [a.X(T), a.Y(T + th)]), col.s[2], 2.4);
      line(ctx, [[a.X(-th), a.Y(0)], [a.X(th), a.Y(2 * th)]], col.s[2], 1.2, [5, 4]);
      line(ctx, Ts.filter((T) => T < th).map((T) => [a.X(T), a.Y(1 / perp())]), col.s[2], 1.6, [2, 3]);
      line(ctx, [[a.X(0), a.T], [a.X(0), a.B]], col.muted, 1);
      ctx.restore();
      text(ctx, 'paramagnet: 1/χ = T/C', a.L + 8, a.T + 10, { color: col.ink, size: 12, weight: 700 });
      text(ctx, 'ferromagnet: (T − T_C)/C', a.L + 8, a.T + 27, { color: col.s[0], size: 12, weight: 700 });
      text(ctx, 'antiferromagnet: (T + θ)/C', a.L + 8, a.T + 44, { color: col.s[2], size: 12, weight: 700 });
      return;
    }
    const top = 3 / th;
    const a = axes(ctx, w, h, col, { x: [0, T1], y: [0, top], xlabel: 'temperature T (K)', ylabel: 'susceptibility χ (C = 1 K)', t: 24, fy: (v) => fmt(v, 2) });
    ctx.save(); a.clip();
    line(ctx, Ts.map((T) => [a.X(T), a.Y(Math.min(top * 2, para(T)))]), col.ink, 2);
    line(ctx, Ts.filter((T) => T > th + 0.5).map((T) => [a.X(T), a.Y(Math.min(top * 2, ferro(T)))]), col.s[0], 2.4);
    line(ctx, Ts.filter((T) => T >= th).map((T) => [a.X(T), a.Y(afm(T))]), col.s[2], 2.4);
    line(ctx, Ts.filter((T) => T <= th).map((T) => [a.X(T), a.Y(perp())]), col.s[2], 2, [6, 4]);
    line(ctx, Ts.filter((T) => T <= th).map((T) => [a.X(T), a.Y(par(T))]), col.s[2], 2);
    line(ctx, Ts.filter((T) => T <= th).map((T) => [a.X(T), a.Y(par(T) / 3 + 2 * perp() / 3)]), col.muted, 1.4, [2, 3]);
    ctx.restore();
    text(ctx, 'para (black), ferro above T_C (blue)', a.L + 8, a.T + 10, { color: col.ink, size: 12, weight: 700 });
    text(ctx, 'antiferro: χ⊥ dashed, χ∥ solid, powder dotted', a.L + 8, a.T + 27, { color: col.s[2], size: 12, weight: 700 });
  };
  cv.redraw(); show();
}
