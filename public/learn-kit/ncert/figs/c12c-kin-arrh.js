// Class 12 Chemistry, Chemical Kinetics: the Arrhenius equation k = A e^(-Ea/RT), ln k = ln A - Ea/(R T), log k = log A - Ea/(2.303 R T). A plot of ln k against 1/T is a straight line of slope -Ea/R.
// Two temperatures give Ea: log(k2/k1) = (Ea / (2.303 R)) (T2 - T1)/(T1 T2). Here A = 1e9 per second. Slide Ea and T: a bigger Ea makes the rate more sensitive to temperature.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let Ea = 60, T1 = 300, T2 = 320, view = 'lin';
  const A0 = 1e9, Rg = 8.314;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Rate constant against temperature and the straight line of ln k against 1 over T' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'graph', [['lin', 'ln k against 1/T'], ['k', 'k against T']], view, (v) => { view = v; go(); });
  slider(ctl, { label: 'activation energy Ea (kJ/mol)', min: 20, max: 120, step: 5, value: Ea, fmt: (v) => v.toFixed(0), oninput: (v) => { Ea = v; go(); } });
  slider(ctl, { label: 'T₁ (K)', min: 280, max: 400, step: 5, value: T1, fmt: (v) => v.toFixed(0), oninput: (v) => { T1 = v; go(); } });
  slider(ctl, { label: 'T₂ (K)', min: 290, max: 420, step: 5, value: T2, fmt: (v) => v.toFixed(0), oninput: (v) => { T2 = v; go(); } });
  const k = (T) => A0 * Math.exp(-Ea * 1000 / (Rg * T));
  const go = () => { const k1 = k(T1), k2 = k(T2), ea = T2 === T1 ? NaN : 2.303 * Rg * Math.log10(k2 / k1) * T1 * T2 / (T2 - T1) / 1000; ro.textContent = `k(T₁) = ${k1.toExponential(2)} s⁻¹, k(T₂) = ${k2.toExponential(2)} s⁻¹, ratio ${(k2 / k1).toFixed(2)}.  Two-point method: Ea = 2.303 R log(k₂/k₁) × T₁T₂/(T₂ − T₁) = ${isNaN(ea) ? '–' : ea.toFixed(1)} kJ/mol.${T2 - T1 === 10 ? '  For a 10 K rise the rate is often doubled or tripled.' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, view === 'lin' ? 'Arrhenius plot: slope = −Ea/R' : 'k rises steeply with temperature', col);
    if (view === 'lin') {
      const A = axes(ctx, w, h, col, { x: [1 / 420, 1 / 280], y: [-30, 22], xlabel: '1/T  (K⁻¹)', ylabel: 'ln k', l: 44, t: t0 + 6, b: 40, xt: [1 / 400, 1 / 350, 1 / 300], fx: (v) => (1000 * v).toFixed(2) + '×10⁻³', fy: (v) => v.toFixed(0) });
      const ln = (T) => Math.log(k(T)); ctx.save(); A.clip(); line(ctx, [[A.X(1 / 420), A.Y(ln(420))], [A.X(1 / 280), A.Y(ln(280))]], col.s[0], 3); ctx.restore();
      for (const [T, c] of [[T1, col.s[3]], [T2, col.s[2]]]) { ctx.strokeStyle = c; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(A.X(1 / T), A.B); ctx.lineTo(A.X(1 / T), A.Y(ln(T))); ctx.stroke(); ctx.setLineDash([]); dot(ctx, A.X(1 / T), A.Y(ln(T)), 5.5, c, col.panel); }
      text(ctx, `slope = −Ea/R = ${(-Ea * 1000 / Rg).toFixed(0)} K`, A.R - 4, A.T + 12, { color: col.s[3], size: 11, weight: 700, align: 'right' });
      text(ctx, 'hot ← → cold', A.R - 4, A.B - 10, { color: col.muted, size: 10, align: 'right' });
    } else {
      const kmax = k(420), A = axes(ctx, w, h, col, { x: [280, 420], y: [0, kmax * 1.05], xlabel: 'temperature T (K)', ylabel: 'k (s⁻¹)', l: 50, t: t0 + 6, b: 40, fx: (v) => v.toFixed(0), fy: (v) => v.toExponential(0) });
      ctx.save(); A.clip(); line(ctx, Array.from({ length: 71 }, (_, i) => { const T = 280 + 2 * i; return [A.X(T), A.Y(k(T))]; }), col.s[0], 3); ctx.restore();
      for (const [T, c] of [[T1, col.s[3]], [T2, col.s[2]]]) dot(ctx, A.X(T), A.Y(k(T)), 5.5, c, col.panel);
    }
  };
  go();
}
