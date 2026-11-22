// Class 12 Chemistry, Chemical Kinetics (step player): finding the activation energy from rate constants at two temperatures. Worked example: the rate constant doubles when T rises from 300 K to 310 K.
// log(k2/k1) = Ea (T2 - T1) / (2.303 R T1 T2). Ea = 2.303 x 8.314 x log 2 x (300 x 310) / 10 = 2.303 x 8.314 x 0.301 x 9300 = 53.6 kJ/mol. ln k against 1/T is a line of slope -Ea/R = -6.45e3 K.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Write the Arrhenius equation at two temperatures', 'Subtract to eliminate A', 'Substitute the data', 'Solve for Ea', 'Check on the Arrhenius plot'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Worked example finding activation energy from two rate constants with the Arrhenius line' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col) + 12, L = 14, P = (s, i, c = col.ink, sz = 12.5, wt = 700) => text(ctx, s, L, t0 + i * 22, { color: c, size: sz, weight: wt });
    if (step === 0) { P('ln k₁ = ln A − Ea/(R T₁)', 0); P('ln k₂ = ln A − Ea/(R T₂)', 1); P('Data: k₂ = 2k₁, T₁ = 300 K, T₂ = 310 K', 2, col.muted, 11.5, 400); }
    if (step === 1) { P('ln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)', 0); P('log(k₂/k₁) = Ea (T₂ − T₁) / (2.303 R T₁T₂)', 1, col.s[3]); P('ln A cancels: you need no value of A.', 2, col.muted, 11.5, 400); }
    if (step === 2) { P('log 2 = Ea × 10 / (2.303 × 8.314 × 300 × 310)', 0); P('0.301 = Ea × 10 / 1.777×10⁶', 1); }
    if (step === 3) { P('Ea = 0.301 × 1.777×10⁶ / 10', 0); P('Ea = 5.35×10⁴ J/mol', 1); P('Ea ≈ 53.6 kJ/mol', 2, col.s[2], 15); }
    if (step === 4) { P('slope of ln k against 1/T = −Ea/R = −6.45×10³ K', 0, col.s[3], 12); }
    const top = t0 + 4 * 22 + 12, A = axes(ctx, w, h, col, { x: [1 / 320, 1 / 290], y: [-1.5, 1.5], xlabel: '1/T (K⁻¹)', ylabel: 'ln k (relative)', l: 44, t: top, b: 38, xt: [1 / 310, 1 / 300], fx: (v) => (1000 * v).toFixed(2) + '×10⁻³', fy: (v) => v.toFixed(1) });
    const ln = (T) => -53600 / 8.314 * (1 / T - 1 / 300);
    if (step >= 2) { ctx.save(); A.clip(); line(ctx, [[A.X(1 / 320), A.Y(ln(320))], [A.X(1 / 290), A.Y(ln(290))]], col.s[0], 3); ctx.restore(); dot(ctx, A.X(1 / 300), A.Y(0), 5.5, col.s[3], col.panel); dot(ctx, A.X(1 / 310), A.Y(Math.LN2), 5.5, col.s[2], col.panel); text(ctx, 'k₁ at 300 K', A.X(1 / 300) + 8, A.Y(0) + 4, { color: col.s[3], size: 10.5, weight: 700, halo: col.panel }); text(ctx, 'k₂ = 2k₁ at 310 K', A.X(1 / 310) + 8, A.Y(Math.LN2) - 8, { color: col.s[2], size: 10.5, weight: 700, halo: col.panel }); }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
