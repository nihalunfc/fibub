// Class 11 Chemistry, Equilibrium: how temperature changes K (van't Hoff): ln(K2/K1) = -(dH/R)(1/T2 - 1/T1). Take K = 1 at 298 K and dH = +/-60 kJ/mol.
// Endothermic (dH > 0): heating raises K, more products. Exothermic (dH < 0): heating lowers K, fewer products. Temperature is the ONLY change that alters K itself; concentration and pressure only shift the position.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

export default function (host) {
  let sign = -1, T = 400;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Equilibrium constant against temperature for exothermic and endothermic reactions' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'reaction', [[-1, 'exothermic (ΔH = −60)'], [1, 'endothermic (ΔH = +60)']], sign, (v) => { sign = v; go(); });
  slider(ctl, { label: 'temperature (K)', min: 250, max: 700, step: 10, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; go(); } });
  const lk = (t) => -(sign * 60000 / 8.314) * (1 / t - 1 / 298) / Math.LN10;
  const go = () => { const k = Math.pow(10, lk(T)); ro.textContent = `At ${T} K: K = ${k < 0.01 || k > 1000 ? k.toExponential(2) : k.toPrecision(3)}, so ${(100 * k / (1 + k)).toFixed(1)} % of A ⇌ B is B. ${sign < 0 ? 'Heating an exothermic reaction lowers K: the forward reaction is disfavoured.' : 'Heating an endothermic reaction raises K: the forward reaction is favoured.'}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'K against T: temperature changes K itself', col), L = 44, R = w - 14, Tp = t0 + 16, B = h - 50;
    const X = (t) => L + (t - 250) / 450 * (R - L), Y = (v) => Tp + (4 - Math.max(-4, Math.min(4, v))) / 8 * (B - Tp);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Tp); ctx.lineTo(L, B); ctx.stroke(); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(R, Y(0)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'K = 1', R - 2, Y(0) - 8, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'log K', L + 6, Tp + 6, { color: col.muted, size: 10 });
    [300, 400, 500, 600, 700].forEach((t) => text(ctx, String(t), X(t), B + 12, { color: col.muted, size: 10, align: 'center' })); text(ctx, 'T (K)', R - 2, B + 28, { color: col.muted, size: 10.5, align: 'right' });
    const pts = []; for (let t = 250; t <= 700; t += 10) pts.push([X(t), Y(lk(t))]); line(ctx, pts, sign < 0 ? col.s[1] : col.s[3], 3);
    dot(ctx, X(T), Y(lk(T)), 6, col.s[2], col.ink);
    text(ctx, sign < 0 ? 'exothermic: K falls as T rises' : 'endothermic: K rises as T rises', w / 2, h - 12, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  go();
}
