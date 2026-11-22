// Class 12 Chemistry, Solutions: elevation of boiling point and depression of freezing point. A non-volatile solute lowers the vapour pressure, so the solution
// must be heated more to reach atmospheric pressure: dTb = Kb m. The solution freezes below the pure solvent: dTf = Kf m. Both depend only on the NUMBER of solute
// particles per kg of solvent (molality), not on what they are. Constants (K kg/mol): water Kb 0.52 Kf 1.86; benzene Kb 2.53 Kf 5.12; camphor Kb 5.95 Kf 39.7 (CRC Handbook).
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

const SOLV = { water: ['water', 100, 0, 0.52, 1.86, 40], benzene: ['benzene', 80.1, 5.5, 2.53, 5.12, 40], camphor: ['camphor', 207, 179, 5.95, 39.7, 40] };
export default function (host) {
  let s = 'water', m = 1;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 330, label: 'Vapour pressure curves of a solvent and a solution showing the rise in boiling point and the fall in freezing point' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'solvent', [['water', 'water'], ['benzene', 'benzene'], ['camphor', 'camphor']], s, (v) => { s = v; go(); });
  slider(ctl, { label: 'molality of solute (mol/kg)', min: 0, max: 3, step: 0.1, value: m, fmt: (v) => v.toFixed(1), oninput: (v) => { m = v; go(); } });
  const go = () => { const [n, tb, tf, kb, kf] = SOLV[s]; ro.textContent = `${n}: ΔTb = Kb m = ${kb} × ${m.toFixed(1)} = ${(kb * m).toFixed(2)} K, boils at ${(tb + kb * m).toFixed(2)} °C.  ΔTf = Kf m = ${kf} × ${m.toFixed(1)} = ${(kf * m).toFixed(2)} K, freezes at ${(tf - kf * m).toFixed(2)} °C.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const [n, tb, tf, kb, kf] = SOLV[s], dB = kb * m, dF = kf * m, t0 = title(ctx, `Vapour pressure of ${n} and of its solution`, col);
    const lo = tb - 2.5 * kb, hi = tb + 5 * kb;
    const A = axes(ctx, w, h * 0.72, col, { x: [lo, hi], y: [50, 360], xlabel: 'temperature (°C)', ylabel: 'pressure (schematic)', l: 52, t: t0 + 6, b: 38, yt: [101.3, 200, 300], fy: (v) => (v === 101.3 ? '101.3' : v), xt: [tb - 2 * kb, tb, tb + 2 * kb, tb + 4 * kb], fx: (v) => v.toFixed(1) });
    const p0 = (T) => 101.325 * Math.exp(0.25 * (T - tb) / kb);
    const f = (sh) => Array.from({ length: 80 }, (_, i) => { const T = lo + (hi - lo) * i / 79; return [A.X(T), A.Y(Math.min(400, p0(T - sh)))]; });
    ctx.save(); A.clip(); line(ctx, f(0), col.s[0], 3); line(ctx, f(dB), col.s[2], 3); ctx.restore();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(A.L, A.Y(101.325)); ctx.lineTo(A.R, A.Y(101.325)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, '1 atm', A.R - 4, A.Y(101.325) + 11, { color: col.muted, size: 10.5, align: 'right' });
    dot(ctx, A.X(tb), A.Y(101.325), 5, col.s[0], col.panel); dot(ctx, A.X(tb + dB), A.Y(101.325), 5, col.s[2], col.panel);
    text(ctx, 'solvent', A.X(tb - 0.5 * kb), A.Y(p0(tb - 1.5 * kb)) - 10, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'solution', A.X(tb + dB + 1.5 * kb), A.Y(p0(tb + 1.5 * kb)) + 14, { color: col.s[2], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    // number line for the freezing point and boiling point shifts
    const y0 = h * 0.72 + 14, x0 = 20, x1 = w - 20;
    text(ctx, 'both shifts on a thermometer line (not to the same scale)', x0, y0 + 2, { color: col.muted, size: 10.5 });
    const bar = (y, a, b, lab, c) => { const ww = x1 - x0, ps = (v) => x0 + ww * (0.12 + 0.76 * v); ctx.fillStyle = c; ctx.fillRect(ps(a), y, Math.max(2, ps(b) - ps(a)), 10); text(ctx, lab, x0, y + 24, { color: c, size: 11.5, weight: 700 }); };
    const bF = Math.min(1, dF / (kf * 3)) * 0.5, bB = Math.min(1, dB / (kb * 3)) * 0.5;
    bar(y0 + 16, 0.5 - bF, 0.5, `freezing point falls by ${dF.toFixed(2)} K`, col.s[3]); bar(y0 + 56, 0.5, 0.5 + bB, `boiling point rises by ${dB.toFixed(2)} K`, col.s[2]);
  };
  go();
}
