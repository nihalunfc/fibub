// Class 11 Chemistry, Classification of Elements: periodic trends as a heat map of Z = 1 to 54. Choose covalent radius (pm, Cordero 2008),
// first ionisation enthalpy (kJ/mol, NIST), electronegativity (Pauling scale) or electron gain enthalpy (kJ/mol, main-group values from the CRC Handbook).
// Darker = larger. Tap or hover a cell to read it; switch on the arrows to see the across-the-period and down-the-group directions.
import { canvas, text, title, row, choice, readout, arrow } from '../../kit.js';

const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe'.split(' ');
const D = {
  r: ['covalent radius', 'pm', [31, 28, 128, 96, 84, 76, 71, 66, 57, 58, 166, 141, 121, 111, 107, 105, 102, 106, 203, 176, 170, 160, 153, 139, 139, 132, 126, 124, 132, 122, 122, 120, 119, 120, 120, 116, 220, 195, 190, 175, 164, 154, 147, 146, 142, 139, 145, 144, 142, 139, 139, 138, 139, 140]],
  ie: ['first ionisation enthalpy', 'kJ/mol', [1312, 2372, 520, 900, 801, 1086, 1402, 1314, 1681, 2081, 496, 738, 578, 787, 1012, 1000, 1251, 1521, 419, 590, 633, 659, 651, 653, 717, 763, 760, 737, 745, 906, 579, 762, 947, 941, 1140, 1351, 403, 550, 600, 640, 652, 684, 702, 710, 720, 804, 731, 868, 558, 709, 834, 869, 1008, 1170]],
  en: ['electronegativity (Pauling)', '', [2.20, null, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, null, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, null, 0.82, 1.00, 1.36, 1.54, 1.63, 1.66, 1.55, 1.83, 1.88, 1.91, 1.90, 1.65, 1.81, 2.01, 2.18, 2.55, 2.96, 3.00, 0.82, 0.95, 1.22, 1.33, 1.6, 2.16, 1.9, 2.2, 2.28, 2.20, 1.93, 1.69, 1.78, 1.96, 2.05, 2.1, 2.66, 2.6]],
  ea: ['electron gain enthalpy (energy released)', 'kJ/mol', [73, null, 60, null, 27, 122, null, 141, 328, null, 53, null, 43, 134, 72, 200, 349, null, 48, null, ...Array(15).fill(null), 43, 119, 78, 195, 325, null, 47, null, ...Array(9).fill(null), 29, 107, 103, 190, 295, null]],
};
const pos = (Z) => (Z === 1 ? [1, 1] : Z === 2 ? [1, 18] : Z <= 4 ? [2, Z - 2] : Z <= 10 ? [2, Z + 8] : Z <= 12 ? [3, Z - 10] : Z <= 18 ? [3, Z] : Z <= 36 ? [4, Z - 18] : [5, Z - 36]);
export default function (host) {
  let k = 'ie', sel = 9, arrows = false;
  const cv = canvas(host, { aspect: 0.58, max: 440, min: 230, label: 'A heat map of the periodic table for a chosen trend' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'trend', [['r', 'radius'], ['ie', 'ionisation'], ['en', 'electroneg.'], ['ea', 'electron gain']], k, (v) => { k = v; go(); });
  choice(ctl, 'arrows', [[false, 'off'], [true, 'on']], arrows, (v) => { arrows = v; go(); });
  const geo = (w) => ({ cw: (w - 8) / 18, ch: Math.min(((w - 8) / 18) * 1.3, 30) });
  const go = () => { const v = D[k][2][sel - 1]; ro.textContent = `${SYM[sel - 1]} (Z = ${sel}): ${D[k][0]} = ${v === null ? 'no stable value (noble gas or not defined)' : v + ' ' + D[k][1]}. Tap another cell.`; cv.redraw(); };
  let lay = null;
  const hit = (e) => { if (!lay) return; const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top; for (let z = 1; z <= 54; z++) { const [r, c] = pos(z), X = 4 + (c - 1) * lay.cw, Y = lay.t0 + 4 + (r - 1) * lay.ch; if (x >= X && x < X + lay.cw && y >= Y && y < Y + lay.ch) { if (sel !== z) { sel = z; go(); } break; } } };
  cv.c.addEventListener('pointerdown', hit); cv.c.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') hit(e); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, D[k][0], col) + 12, { cw, ch } = geo(w), vals = D[k][2].filter((v) => v !== null), _l = (lay = { cw, ch, t0 }), lo = Math.min(...vals), hi = Math.max(...vals);
    for (let z = 1; z <= 54; z++) {
      const [r, c] = pos(z), X = 4 + (c - 1) * cw, Y = t0 + 4 + (r - 1) * ch, v = D[k][2][z - 1];
      if (v === null) { ctx.fillStyle = col.panel; ctx.fillRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); ctx.strokeStyle = col.line; ctx.strokeRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); }
      else { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.08 + 0.85 * (v - lo) / (hi - lo); ctx.fillRect(X + 0.5, Y + 0.5, cw - 1, ch - 1); ctx.globalAlpha = 1; }
      if (z === sel) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X + 1, Y + 1, cw - 2, ch - 2); }
      text(ctx, SYM[z - 1], X + cw / 2, Y + ch / 2, { color: col.ink, size: 10, weight: z === sel ? 700 : 400, align: 'center', fit: false });
    }
    const gy = t0 + 4 + 5 * ch + 16; ctx.fillStyle = col.s[0]; for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.08 + 0.85 * i / 39; ctx.fillRect(10 + i * ((w - 20) / 40), gy, (w - 20) / 40 + 1, 10); } ctx.globalAlpha = 1;
    text(ctx, `${lo}`, 10, gy + 22, { color: col.muted, size: 10 }); text(ctx, `${hi} ${D[k][1]}`, w - 10, gy + 22, { color: col.muted, size: 10, align: 'right' });
    if (arrows) { const dir = { r: ['←', '↓'], ie: ['→', '↑'], en: ['→', '↑'], ea: ['→', '↑'] }[k]; text(ctx, `across a period: ${dir[0] === '→' ? 'increases' : 'decreases'} →`, 10, t0 + 4 + 5 * ch + 6, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, `down a group: ${dir[1] === '↓' ? 'increases' : 'decreases'} ↓`, w - 10, t0 + 4 + 5 * ch + 6, { color: col.s[3], size: 10.5, weight: 700, align: 'right' }); }
  };
  go();
}
