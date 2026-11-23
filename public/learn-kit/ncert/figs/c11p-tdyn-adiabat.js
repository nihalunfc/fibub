// Class 11 Thermodynamics (step player): the adiabatic relation. No heat flows (dQ = 0), so the first law gives 0 = n Cv dT + P dV. With P = nRT/V: Cv dT/T = -R dV/V. Integrate: Cv ln T = -R ln V + const, and R = Cp - Cv,
// so T V^(gamma - 1) = constant, with gamma = Cp/Cv; with P V = nRT this is P V^gamma = constant. An adiabat is steeper than an isotherm because P falls both from the larger V and from the cooling. Plotted for gamma = 5/3.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 340, label: 'The derivation of PV to the gamma equals constant, ending with an adiabat steeper than an isotherm' });
  const T = ['Adiabatic: no heat in or out', 'First law with dQ = 0', 'Put in P = nRT/V', 'Integrate both sides', 'Use R = Cp − Cv and γ = Cp/Cv', 'Adiabats are steeper than isotherms'];
  const L = [['Thermally insulated cylinder, or a very fast change.', 'dQ = 0 for every small step.'], ['dQ = dU + dW', '0 = n C_v dT + P dV'], ['0 = n C_v dT + (nRT/V) dV', '⇒  C_v dT/T = −R dV/V'], ['C_v ln T = −R ln V + constant', '⇒  ln T + (R/C_v) ln V = constant'], ['R/C_v = (C_p − C_v)/C_v = γ − 1', 'T V^(γ−1) = constant'], ['With T = PV/nR:  P V^γ = constant', 'adiabat: P ∝ 1/V^γ (γ = 1.67), isotherm: P ∝ 1/V']];
  const g = 5 / 3;
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col);
    L[step].forEach((s, i) => text(ctx, s, w / 2, top + 24 + i * 22, { color: i === L[step].length - 1 && step > 0 ? col.s[1] : col.ink, size: 13, weight: 700, align: 'center' }));
    const A = axes(ctx, w, h, col, { x: [0, 5], y: [0, 10], xlabel: 'volume V', ylabel: 'pressure P', l: 40, t: top + 80, b: 36, xt: [], yt: [] }), V0 = 1, P0 = 8;
    ctx.save(); A.clip(); const iso = [], adi = []; for (let V = 1; V <= 5; V += 0.05) { iso.push([A.X(V), A.Y(P0 * V0 / V)]); adi.push([A.X(V), A.Y(P0 * (V0 / V) ** g)]); }
    line(ctx, iso, col.s[0], step >= 5 ? 3 : 2, step >= 5 ? undefined : [4, 3]); if (step >= 4) line(ctx, adi, col.s[1], 3.5); ctx.restore();
    dot(ctx, A.X(V0), A.Y(P0), 5, col.ink); text(ctx, 'start', A.X(V0) + 8, A.Y(P0) - 8, { color: col.ink, size: 10.5 });
    if (step >= 5) { text(ctx, 'isotherm  PV = c', A.X(3.2), A.Y(P0 / 3.2) - 14, { color: col.s[0], size: 11, weight: 700 }); text(ctx, 'adiabat  PV^γ = c', A.X(2.3), A.Y(P0 * (1 / 2.3) ** g) + 22, { color: col.s[1], size: 11, weight: 700 }); }
    else text(ctx, 'isotherm for comparison', A.X(3), A.Y(P0 / 3) - 12, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
