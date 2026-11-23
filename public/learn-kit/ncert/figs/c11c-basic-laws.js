// Class 11 Chemistry, Some Basic Concepts: laws of chemical combination. Conservation of mass (mass in = mass out),
// constant proportions (same compound, same ratio), multiple proportions (CO and CO2: 12 g C with 16 g or 32 g O, ratio 1:2),
// Gay-Lussac (volumes of gases combine in small whole numbers: 2 H2 + O2 -> 2 H2O).
import { canvas, text, title, row, slider, choice, readout, clamp } from '../../kit.js';

export default function (host) {
  let law = 'mass', x = 12;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Demonstrations of the laws of chemical combination' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'law', [['mass', 'mass kept'], ['prop', 'fixed ratio'], ['multi', 'multiple'], ['vol', 'gas volumes']], law, (v) => { law = v; sl.style.display = law === 'mass' ? '' : 'none'; go(); });
  slider(ctl, { label: 'amount (g)', min: 4, max: 40, step: 2, value: x, fmt: (v) => v.toFixed(0), oninput: (v) => { x = v; go(); } });
  const go = () => {
    ro.textContent = { mass: `Burn ${x} g of magnesium: it joins ${(x * 16 / 24.3).toFixed(1)} g of oxygen and the oxide weighs ${(x * 40.3 / 24.3).toFixed(1)} g. Nothing is lost, nothing is made.`, prop: 'Water from any river or tap: 8 g of oxygen for every 1 g of hydrogen, always. The ratio never changes.', multi: 'Same carbon (12 g), two compounds: CO has 16 g of oxygen, CO₂ has 32 g. 16 : 32 = 1 : 2, a small whole-number ratio.', vol: '2 L of H₂ + 1 L of O₂ → 2 L of steam: the gas volumes are in the ratio 2 : 1 : 2 at the same temperature and pressure.' }[law]; cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, { mass: 'conservation of mass', prop: 'constant proportions', multi: 'multiple proportions', vol: "Gay-Lussac's law of volumes" }[law], col) + 14;
    const bar = (lab, v, max, y, c, unit = ' g') => { const L = 76, W = w - L - 52; text(ctx, lab, 8, y, { color: col.ink, size: 11, weight: 700 }); ctx.fillStyle = c; ctx.fillRect(L, y - 9, Math.max(2, W * v / max), 18); text(ctx, v.toFixed(1) + unit, L + Math.max(2, W * v / max) + 4, y, { color: col.ink, size: 11 }); };
    if (law === 'mass') { const o = x * 16 / 24.3, mo = x + o, M = 40 * 1.65; bar('Mg', x, M, t0 + 20, col.s[0]); bar('O₂', o, M, t0 + 50, col.s[1]); bar('before', x + o, M, t0 + 90, col.s[2]); bar('MgO after', mo, M, t0 + 120, col.s[2]); text(ctx, 'the two black bars are equal', w / 2, t0 + 160, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (law === 'prop') { [['river', 1, 8], ['tap', 3, 24], ['rain', 0.5, 4], ['sea', 2, 16]].forEach(([n, a, b], i) => { bar(n + ' H', a, 3, t0 + 14 + i * 50, col.s[0]); bar(n + ' O', b, 24, t0 + 34 + i * 50, col.s[1]); }); }
    if (law === 'multi') { bar('CO: C', 12, 32, t0 + 20, col.s[0]); bar('CO: O', 16, 32, t0 + 46, col.s[1]); bar('CO₂: C', 12, 32, t0 + 92, col.s[0]); bar('CO₂: O', 32, 32, t0 + 118, col.s[1]); text(ctx, 'O per 12 g of C: 16 : 32 = 1 : 2', w / 2, t0 + 158, { color: col.s[2], size: 12, weight: 700, align: 'center' }); }
    if (law === 'vol') { const u = clamp((h - t0 - 40) / 3, 24, 50), draw = (x0, n, lab, c) => { for (let i = 0; i < n; i++) { ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(x0, h - 36 - (i + 1) * u, 52, u - 2); ctx.globalAlpha = 1; } ctx.strokeStyle = c; ctx.strokeRect(x0, h - 36 - n * u, 52, n * u - 2); text(ctx, lab, x0 + 26, h - 20, { color: col.ink, size: 12, weight: 700, align: 'center' }); }; const s = (w - 3 * 52) / 4; draw(s, 2, '2 L H₂', col.s[0]); draw(2 * s + 52, 1, '1 L O₂', col.s[1]); draw(3 * s + 104, 2, '2 L H₂O', col.s[2]); text(ctx, '+', s + 52 + s / 2, h - 60, { color: col.ink, size: 20, align: 'center' }); text(ctx, '→', 2 * s + 104 + s / 2, h - 60, { color: col.ink, size: 20, align: 'center' }); }
  };
  const sl = ctl.lastElementChild; go();
}
