// Class 12 Chemistry, Amines: the Hinsberg test (step player with a choice of amine). The amine is shaken with benzenesulphonyl chloride in aqueous NaOH.
// 1 deg amine: forms RNH-SO2Ph, which still has an acidic N-H and dissolves in NaOH (clear); acid then precipitates it. 2 deg: forms R2N-SO2Ph with no N-H, so it is insoluble in NaOH (precipitate that stays after acid).
// 3 deg: does not react; it remains as an oily layer, and dissolves when HCl is added (it forms the ammonium salt).
import { canvas, text, title, row, choice, loop } from '../../kit.js';

const TT = ['Three amines, one reagent', 'Shake with C₆H₅SO₂Cl in NaOH(aq)', 'Acidify with HCl'];
export default function (host) {
  let step = 0, k = 'p', t = 0;
  const cv = canvas(host, { aspect: 0.88, max: 360, min: 300, label: 'Test tubes in the Hinsberg test for primary, secondary and tertiary amines' });
  const ctl = row(host);
  choice(ctl, 'amine', [['p', '1° (RNH₂)'], ['s', '2° (R₂NH)'], ['t', '3° (R₃N)']], k, (v) => { k = v; t = 0; cv.redraw(); });
  loop(host, (dt) => { t = Math.min(1, t + dt); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cx = w * 0.3, tw = 54, ty = top + 14, th = h * 0.5;
    const tube = (x, fill, a, ppt, oil) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - tw / 2, ty); ctx.lineTo(x - tw / 2, ty + th - tw / 2); ctx.arc(x, ty + th - tw / 2, tw / 2, Math.PI, 0, true); ctx.lineTo(x + tw / 2, ty); ctx.stroke(); ctx.save(); ctx.beginPath(); ctx.moveTo(x - tw / 2 + 2, ty + th * 0.3); ctx.lineTo(x - tw / 2 + 2, ty + th - tw / 2); ctx.arc(x, ty + th - tw / 2, tw / 2 - 2, Math.PI, 0, true); ctx.lineTo(x + tw / 2 - 2, ty + th * 0.3); ctx.closePath(); ctx.clip(); ctx.fillStyle = fill; ctx.globalAlpha = a; ctx.fillRect(x - tw, ty + th * 0.3, tw * 2, th); ctx.globalAlpha = 1; if (oil) { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.65; ctx.fillRect(x - tw / 2, ty + th * 0.3, tw, th * 0.12); ctx.globalAlpha = 1; } if (ppt) for (let i = 0; i < 70; i++) { ctx.fillStyle = col.ink; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.arc(x + (((i * 53) % 100) / 100 - 0.5) * (tw - 8), ty + th * 0.5 + ((i * 37) % 100) / 100 * th * 0.45, 1.8, 0, 7); ctx.fill(); } ctx.globalAlpha = 1; ctx.restore(); };
    const TX = { p: ['', 'The amine reacts and RNH–SO₂C₆H₅ forms. It still has an acidic N–H, so NaOH dissolves it: a CLEAR solution.', 'Acid removes the charge and the sulphonamide comes out of solution again: a PRECIPITATE.'], s: ['', 'The amine reacts and R₂N–SO₂C₆H₅ forms. It has no N–H, so NaOH cannot dissolve it: it stays as a PRECIPITATE.', 'The precipitate stays: the sulphonamide is not basic and does not dissolve in acid.'], t: ['', 'No reaction. The amine stays as an OILY LAYER (it has no N–H to lose).', 'HCl turns the amine into a soluble ammonium salt R₃NH⁺Cl⁻: the oil DISSOLVES.'] }[k];
    const CON = { p: '1° amine: product dissolves in NaOH', s: '2° amine: product insoluble in NaOH', t: '3° amine: no reaction with the reagent' }[k];
    const lab = ['alone: ' + (k === 'p' ? 'RNH₂' : k === 's' ? 'R₂NH' : 'R₃N'), '+ C₆H₅SO₂Cl + NaOH(aq)', '+ HCl'][step];
    const ppt = step === 1 ? k === 's' && t > 0.3 : step === 2 ? k !== 't' : false, oil = step === 1 ? k === 't' : false;
    tube(cx, col.soft, 0.55, ppt, oil); text(ctx, lab, cx, ty + th + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    const rx = w * 0.52, wrap = (s2, x, y, n, c, sz = 12, wt = 400) => { const ws = s2.split(' '); let l = '', yy = y; ws.forEach((wd) => { if ((l + ' ' + wd).length > n) { text(ctx, l, x, yy, { color: c, size: sz, weight: wt }); yy += sz + 5; l = wd; } else l = l ? l + ' ' + wd : wd; }); text(ctx, l, x, yy, { color: c, size: sz, weight: wt }); };
    if (step === 0) wrap('Primary, secondary and tertiary amines all look alike. We shake each with benzenesulphonyl chloride in aqueous NaOH and watch.', rx, ty + 14, 22, col.ink);
    else wrap(TX[step], rx, ty + 14, 22, col.ink);
    if (step === 2) wrap(CON, 14, h - 24, 60, col.s[0], 12, 700);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 2); t = 0; cv.redraw(); } };
}
