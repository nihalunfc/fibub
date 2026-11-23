// Class 11 Chemistry, Thermodynamics: delta G standard and the equilibrium constant, delta G = -RT ln K (A <=> B). K = exp(-delta G / RT). At equilibrium the fraction of B is K/(1+K).
// delta G < 0 gives K > 1 (products favoured); delta G = 0 gives K = 1; delta G > 0 gives K < 1. A change of 5.7 kJ/mol at 298 K moves K by a factor of 10. R = 8.314 J/(K mol).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let g = -10, T = 298;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Equilibrium mixture of reactant and product against standard Gibbs energy change' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'ΔG° (kJ/mol)', min: -40, max: 40, step: 1, value: g, fmt: (v) => v.toFixed(0), oninput: (v) => { g = v; go(); } });
  slider(ctl, { label: 'temperature (K)', min: 250, max: 600, step: 5, value: T, fmt: (v) => v.toFixed(0), oninput: (v) => { T = v; go(); } });
  const K = () => Math.exp(-g * 1000 / (8.314 * T));
  const go = () => { const k = K(); ro.textContent = `K = e^(−ΔG°/RT) = ${k < 0.001 || k > 1e5 ? k.toExponential(2) : k.toPrecision(3)}. At equilibrium ${(100 * k / (1 + k)).toFixed(k > 1e3 || k < 1e-3 ? 3 : 1)} % is product B.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const k = K(), fB = k / (1 + k), t0 = title(ctx, 'A ⇌ B at equilibrium: ΔG° = ' + g + ' kJ/mol', col), bx = 24, bw = w - 48, by = t0 + 30;
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, by, bw * (1 - fB), 40); ctx.fillStyle = col.s[2]; ctx.fillRect(bx + bw * (1 - fB), by, bw * fB, 40); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, 40);
    text(ctx, 'A ' + (100 * (1 - fB)).toFixed(1) + ' %', bx + 6, by + 56, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'B ' + (100 * fB).toFixed(fB > 0.999 || fB < 0.001 ? 3 : 1) + ' %', bx + bw - 6, by + 56, { color: col.s[2], size: 11.5, weight: 700, align: 'right' });
    const ly = by + 110, lx0 = bx, lx1 = bx + bw, lg = Math.log10(k), px = lx0 + (Math.max(-7, Math.min(7, lg)) + 7) / 14 * (lx1 - lx0);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(lx1, ly); ctx.stroke();
    [-6, -3, 0, 3, 6].forEach((e) => { const x = lx0 + (e + 7) / 14 * (lx1 - lx0); ctx.beginPath(); ctx.moveTo(x, ly - 5); ctx.lineTo(x, ly + 5); ctx.stroke(); text(ctx, '10' + (e < 0 ? '⁻' : '') + String(Math.abs(e)).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]), x, ly + 18, { color: col.muted, size: 10, align: 'center' }); });
    ctx.beginPath(); ctx.arc(px, ly, 7, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); text(ctx, 'K', px, ly - 16, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    text(ctx, 'K on a log scale', w / 2, ly + 38, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, g < 0 ? 'ΔG° < 0: K > 1, products favoured' : g > 0 ? 'ΔG° > 0: K < 1, reactants favoured' : 'ΔG° = 0: K = 1', w / 2, h - 16, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
  };
  go();
}
