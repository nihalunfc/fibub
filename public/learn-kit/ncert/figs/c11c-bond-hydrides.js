// Class 11 Chemistry, Chemical Bonding: boiling points of the hydrides of groups 14 to 17 against period. Group 14 (CH4 ... SnH4) rises smoothly with size (London forces).
// NH3, H2O and HF break the pattern because they form strong hydrogen bonds. Dashed line: where the first member would sit without hydrogen bonding.
// Boiling points (deg C): 14: CH4 -161, SiH4 -112, GeH4 -88, SnH4 -52; 15: NH3 -33, PH3 -88, AsH3 -62, SbH3 -17; 16: H2O 100, H2S -60, H2Se -41, H2Te -2; 17: HF 20, HCl -85, HBr -67, HI -35. (CRC Handbook)
import { canvas, text, title, row, choice, readout, line, dot } from '../../kit.js';

const D = {
  14: [['CH₄', -161], ['SiH₄', -112], ['GeH₄', -88], ['SnH₄', -52]], 15: [['NH₃', -33], ['PH₃', -88], ['AsH₃', -62], ['SbH₃', -17]],
  16: [['H₂O', 100], ['H₂S', -60], ['H₂Se', -41], ['H₂Te', -2]], 17: [['HF', 20], ['HCl', -85], ['HBr', -67], ['HI', -35]],
};
const COLS = { 14: 0, 15: 1, 16: 2, 17: 3 };
export default function (host) {
  let on = { 14: true, 15: true, 16: true, 17: true };
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Boiling points of group 14 to 17 hydrides against period showing hydrogen bonding anomalies' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'show group', [['all', 'all'], [14, '14'], [15, '15'], [16, '16'], [17, '17']], 'all', (v) => { on = { 14: v === 'all' || v === 14, 15: v === 'all' || v === 15, 16: v === 'all' || v === 16, 17: v === 'all' || v === 17 }; go(); });
  const go = () => { ro.textContent = on[14] && on[16] ? 'CH₄ follows the trend; H₂O, HF and NH₃ sit far above where their size predicts, because of hydrogen bonds.' : 'Pick a group, or all of them. The first member of groups 15, 16 and 17 is unusually high.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Boiling points of hydrides (°C) by period', col), L = 44, R = w - 14, T = t0 + 26, B = h - 48, ymin = -180, ymax = 120;
    const X = (i) => L + 20 + i * (R - L - 40) / 3, Y = (v) => T + (ymax - v) / (ymax - ymin) * (B - T);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (const v of [-150, -100, -50, 0, 50, 100]) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); text(ctx, String(v), L - 4, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    ['2', '3', '4', '5'].forEach((p, i) => text(ctx, 'period ' + p, X(i), B + 14, { color: col.muted, size: 10.5, align: 'center' }));
    for (const g of [14, 15, 16, 17]) {
      if (!on[g]) continue; const c = col.s[COLS[g]], d = D[g];
      if (g !== 14) { ctx.setLineDash([4, 4]); ctx.strokeStyle = c; ctx.lineWidth = 1.2; const ex = d[1][1] - (d[2][1] - d[1][1]); ctx.beginPath(); ctx.moveTo(X(0), Y(ex)); ctx.lineTo(X(1), Y(d[1][1])); ctx.stroke(); ctx.setLineDash([]); }
      line(ctx, d.map((p, i) => [X(i), Y(p[1])]), c, 2.2); d.forEach((p, i) => { dot(ctx, X(i), Y(p[1]), 4.5, c); if (i === 0 || on[g] && false) text(ctx, p[0], X(i) + 8, Y(p[1]) + (g === 15 ? 9 : g === 17 ? -9 : 0), { color: c, size: 10.5, weight: 700 }); });
      text(ctx, 'group ' + g, L + 6 + [14, 15, 16, 17].indexOf(g) * 62, T - 2, { color: c, size: 10.5, weight: 700 });
    }
  };
  go();
}
