// Class 11 Biology, Breathing and Exchange of Gases: the oxygen-haemoglobin dissociation curve. Each haemoglobin has four haem groups and binds up to four O2; binding is co-operative, so the curve is S-shaped (Hill equation, n = 2.7).
// In the lungs (pO2 about 95-104 mm Hg) haemoglobin is nearly full; in the tissues (pO2 about 40) it gives up about 5 mL O2 per 100 mL of blood. More CO2, more acid (lower pH) or higher temperature shifts the curve right (Bohr effect), releasing more O2.
import { canvas, text, title, axes, line, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let po2 = 40, acid = false;
  const sat = (p, p50) => p ** 2.7 / (p ** 2.7 + p50 ** 2.7);
  const p50 = () => (acid ? 36 : 26);
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'The S-shaped oxygen haemoglobin dissociation curve with four haem sites and a shift with CO2 and acidity' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'pO₂', min: 0, max: 110, step: 1, value: po2, fmt: (v) => Math.round(v) + ' mm Hg', oninput: (v) => { po2 = v; go(); } });
  choice(ctl, 'Blood', [[false, 'Lungs-like (pH 7.4)'], [true, 'Active tissue (more CO₂, acid)']], acid, (v) => { acid = v; go(); });
  const go = () => { const s = sat(po2, p50()), lung = sat(95, 26), tis = sat(40, p50()); ro.textContent = `At pO₂ = ${Math.round(po2)} mm Hg the haemoglobin is ${(s * 100).toFixed(0)} % saturated (about ${(s * 4).toFixed(1)} of its 4 O₂ sites filled). From the lung (${(lung * 100).toFixed(0)} %) to a tissue at pO₂ 40 (${(tis * 100).toFixed(0)} %) the blood gives up about ${(20 * (lung - tis)).toFixed(1)} mL O₂ per 100 mL (full blood carries about 20 mL). ${acid ? 'The curve has moved right: haemoglobin lets go of more O₂ where CO₂ and acid are high (Bohr effect).' : ''}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Haemoglobin and oxygen', col);
    const A = axes(ctx, w, h, col, { x: [0, 110], y: [0, 100], xlabel: 'pO₂ (mm Hg)', ylabel: '% saturation', l: 48, t: t0 + 40, b: 44, xt: [0, 25, 50, 75, 100], yt: [0, 50, 100] });
    const cur = (p5) => { const p = []; for (let x = 0; x <= 110; x += 2) p.push([A.X(x), A.Y(100 * sat(x, p5))]); return p; };
    line(ctx, cur(26), acid ? col.line : col.s[0], acid ? 1.5 : 3); if (acid) line(ctx, cur(36), col.s[3], 3);
    const s = sat(po2, p50()); line(ctx, [[A.X(po2), A.B], [A.X(po2), A.Y(100 * s)], [A.L, A.Y(100 * s)]], col.muted, 1, [3, 3]); dot(ctx, A.X(po2), A.Y(100 * s), 5.5, col.s[1], col.bg);
    const n4 = s * 4;
    for (let i = 0; i < 4; i++) { const x = 16 + i * 26; ctx.beginPath(); ctx.arc(x, t0 + 16, 8, 0, 7); ctx.fillStyle = n4 >= i + 0.5 ? col.s[1] : col.panel; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = col.s[1]; ctx.stroke(); }
    text(ctx, 'haem sites (full = bound O₂)', 122, t0 + 16, { color: col.muted, size: 10 });
    text(ctx, 'lungs (95)', A.X(95), A.Y(100 * sat(95, 26)) + 18, { color: col.s[0], size: 10, weight: 700, align: 'center' }); text(ctx, 'tissues (40)', A.X(40) + 4, A.B - 10, { color: col.s[0], size: 10, weight: 700 });
  };
  go();
}
