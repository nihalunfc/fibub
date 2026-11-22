// Choosing plant conditions: equilibrium yield and relative rate against temperature for the Haber process (N₂ + 3H₂ ⇌ 2NH₃)
// or the contact process (2SO₂ + O₂ ⇌ 2SO₃). Both are exothermic and lose gas moles, so yield falls with T and rises with P,
// but the rate needs heat. Slide T and P, switch the catalyst, and see why industry settles on a compromise.
import { canvas, axes, line, dot, text, row, slider, choice, readout, title } from '../kit.js';

const R = 8.314;
const RX = {
  haber: { name: 'Haber: N₂ + 3H₂ ⇌ 2NH₃', dH: -105000, dS: -245, std: -92.4, Ea: [335, 176], Tmin: 400, Tmax: 900, P: [1, 400], p0: 200, note: 'Industry: about 700 K (450 °C), 200 atm, iron catalyst: a compromise.', unit: 'NH₃' },
  contact: { name: 'Contact: 2SO₂ + O₂ ⇌ 2SO₃', dH: -197800, dS: -188, std: -197.8, Ea: [250, 80], Tmin: 500, Tmax: 1000, P: [1, 20], p0: 2, note: 'Industry: about 720 K (450 °C), 1-2 atm, V₂O₅ catalyst. K is big enough that high pressure is not worth the cost.', unit: 'SO₃' },
};
function yieldOf(id, T, P) {
  const r = RX[id], Kp = Math.exp(-(r.dH - T * r.dS) / (R * T));
  const f = (x) => id === 'haber' ? 4 * x * x * (4 - 2 * x) ** 2 / (27 * (1 - x) ** 4) / (P * P) - Kp : x * x * (3 - x) / (1 - x) ** 3 / P - Kp;
  let lo = 0, hi = 0.999999; for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; f(m) > 0 ? (hi = m) : (lo = m); }
  const x = (lo + hi) / 2; return id === 'haber' ? 2 * x / (4 - 2 * x) : x; // mole fraction of NH3, or fraction of SO2 converted
}
export default function (host) {
  let id = 'haber', T = 700, P = 200, cat = true;
  const cv = canvas(host, { aspect: 0.85, max: 450, min: 310, label: 'Equilibrium yield and relative rate against temperature for an industrial gas reaction' });
  choice(row(host), 'Process', [['haber', 'Haber (NH₃)'], ['contact', 'Contact (SO₃)']], id, (v) => { id = v; T = v === 'haber' ? 700 : 720; P = RX[v].p0; sT.set(T); sP.set(P); set(); });
  const c1 = row(host);
  const sT = slider(c1, { label: 'Temperature (K)', min: 400, max: 900, step: 10, value: T, oninput: (v) => { T = v; set(); } });
  const sP = slider(c1, { label: 'Pressure (atm)', min: 1, max: 400, step: 1, value: P, log: true, fmt: (v) => v.toFixed(0), oninput: (v) => { P = v; set(); } });
  choice(row(host), 'Catalyst', [[false, 'None'], [true, 'Iron / V₂O₅']], cat, (v) => { cat = v; set(); });
  const out = readout(host);
  const rate = (r, t) => Math.exp((-r.Ea[cat ? 1 : 0] * 1000 / R) * (1 / t - 1 / 700)); // relative to 700 K with the same catalyst
  function set() {
    const r = RX[id], y = yieldOf(id, T, P), k = rate(r, T);
    out.innerHTML = `<b>${r.name}</b>, exothermic (standard ΔH = ${r.std || -197.8} kJ per mole of reaction; the curves use effective values near plant temperatures). At ${T} K and ${P.toFixed(0)} atm: ${id === 'haber' ? 'NH₃ in the exit gas' : 'SO₂ converted'} = <b>${(y * 100).toFixed(1)}%</b>; relative rate (vs 700 K, same catalyst) = <b>${k < 0.01 ? k.toExponential(1) : k.toFixed(2)}</b>. ${r.note}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const r = RX[id]; title(ctx, `${id === 'haber' ? 'Haber' : 'Contact'}: yield and rate against T`, col);
    const A = axes(ctx, w, h, col, { x: [400, 900], y: [0, 100], xlabel: 'temperature (K)', ylabel: 'equilibrium yield (%)', t: 44, fx: (v) => v });
    const yp = [], rp = []; for (let t = 400; t <= 900; t += 10) { yp.push([A.X(t), A.Y(yieldOf(id, t, P) * 100)]); rp.push([A.X(t), A.Y(Math.min(100, 100 * Math.log10(1 + rate(r, t) * 20) / Math.log10(1 + 20 * rate(r, 900))))]); }
    line(ctx, yp, col.s[0], 3); line(ctx, rp, col.s[1], 2.5, [6, 4]);
    dot(ctx, A.X(T), A.Y(yieldOf(id, T, P) * 100), 6, col.s[0], col.panel);
    ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(T), A.T); ctx.lineTo(A.X(T), A.B); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'yield (solid)', A.L + 6, A.T + 10, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'rate (dashed, log scale)', A.L + 6, A.T + 26, { color: col.s[1], size: 11, weight: 700 });
  };
  set();
}
