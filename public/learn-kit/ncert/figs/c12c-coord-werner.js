// Class 12 Chemistry, Coordination Compounds (step player): Werner's evidence. Four cobalt(III) chloride ammonia compounds, all with 6 ammonia/chloride groups bound to cobalt
// (secondary valence 6). Silver nitrate precipitates only the chloride ions that are free outside the complex (primary valence): 3, 2, 1 and 0 moles of AgCl per mole.
// Formulas: [Co(NH3)6]Cl3, [Co(NH3)5Cl]Cl2, [Co(NH3)4Cl2]Cl, [Co(NH3)3Cl3].
import { canvas, text, title, line, loop } from '../../kit.js';

const FORM = ['[Co(NH₃)₆]Cl₃', '[Co(NH₃)₅Cl]Cl₂', '[Co(NH₃)₄Cl₂]Cl', '[Co(NH₃)₃Cl₃]'], COLOUR = ['yellow', 'purple', 'green', 'green'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'Werner coordination sphere with chloride ions inside and outside, tested with silver nitrate' });
  loop(host, (dt) => { t += dt; if (step >= 2) cv.redraw(); });
  const TT = ['Four compounds, one puzzle', 'Secondary valence: always 6', 'CoCl₃·6NH₃: 3 free Cl⁻', 'CoCl₃·5NH₃: 2 free Cl⁻', 'CoCl₃·4NH₃: 1 free Cl⁻', 'CoCl₃·3NH₃: no free Cl⁻'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    if (step === 0) {
      const rows = [['CoCl₃·6NH₃', 'yellow', '3'], ['CoCl₃·5NH₃', 'purple', '2'], ['CoCl₃·4NH₃', 'green', '1'], ['CoCl₃·3NH₃', 'green', '0']], y0 = top + 36;
      text(ctx, 'compound', 18, y0 - 8, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'colour', w * 0.55, y0 - 8, { color: col.muted, size: 11, weight: 700 }); text(ctx, 'AgCl per mole', w - 14, y0 - 8, { color: col.muted, size: 11, weight: 700, align: 'right' });
      rows.forEach((r, i) => { const y = y0 + 20 + i * 34; line(ctx, [[14, y - 16], [w - 14, y - 16]], col.line, 1); text(ctx, r[0], 18, y, { color: col.ink, size: 14, weight: 700 }); text(ctx, r[1], w * 0.55, y, { color: col.ink, size: 13 }); text(ctx, r[2] + ' mol', w - 14, y, { color: col.s[3], size: 14, weight: 700, align: 'right' }); });
      text(ctx, 'Same elements, but different numbers of chloride', w / 2, y0 + 176, { color: col.ink, size: 12.5, align: 'center' }); text(ctx, 'are precipitated by AgNO₃. Why?', w / 2, y0 + 195, { color: col.ink, size: 12.5, align: 'center' });
      return;
    }
    const cx = w * 0.34, cy = top + (h - top) * 0.46, R = Math.min(w * 0.22, (h - top) * 0.24), k = step - 2;       // k = 0..3, step 1 is the empty frame
    const inside = [6, 5, 4, 3][Math.max(k, 0)], nCl = [0, 1, 2, 3][Math.max(k, 0)];
    ctx.strokeStyle = col.ink; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R + 24, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'coordination sphere', cx, cy + R + 40, { color: col.muted, size: 10.5, align: 'center' });
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3 - Math.PI / 2, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      if (step === 1) { ctx.strokeStyle = col.muted; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.stroke(); ctx.setLineDash([]); continue; }
      const isCl = i >= 6 - nCl; line(ctx, [[cx, cy], [x, y]], col.muted, 2);
      ctx.fillStyle = isCl ? col.s[2] : col.s[3]; ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill(); text(ctx, isCl ? 'Cl' : 'N', x, y, { color: col.panel, size: 10.5, weight: 700, align: 'center' });
    }
    ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(cx, cy, 15, 0, 7); ctx.fill(); text(ctx, 'Co', cx, cy, { color: col.panel, size: 11, weight: 700, align: 'center' });
    if (step === 1) { text(ctx, 'Co³⁺ always binds 6 groups', w * 0.34, top + 24, { color: col.ink, size: 12, align: 'center' }); text(ctx, 'AgNO₃ adds to', w - 14, top + 50, { color: col.muted, size: 11, align: 'right' }); return; }
    // free chloride outside
    const free = 3 - nCl, fx = w * 0.62;
    for (let i = 0; i < free; i++) { const x = fx + 14 + i * 28 - 6, y = top + 52 + Math.sin(t * 2 + i) * 4; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fill(); text(ctx, 'Cl⁻', x, y, { color: col.panel, size: 9.5, weight: 700, align: 'center' }); }
    text(ctx, free ? `${free} free Cl⁻ (primary valence)` : 'no free Cl⁻', w - 14, top + 82, { color: col.muted, size: 11, align: 'right' });
    // test tube
    const tx = w * 0.7, ty = top + 108, th = (h - ty) * 0.58, tw = 44;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty); ctx.lineTo(tx - tw / 2, ty + th); ctx.arc(tx, ty + th, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2, ty); ctx.stroke();
    for (let i = 0; i < free; i++) { ctx.fillStyle = '#eef0f2'; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(tx - 10 + (i % 2) * 20, ty + th + 6 - Math.floor(i / 2) * 14 - (i === 2 ? 0 : 0), 7, 0, 7); ctx.fill(); ctx.stroke(); }
    text(ctx, 'AgNO₃ added', tx, ty - 8, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, `${free} mol white AgCl`, tx, ty + th + 36, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, FORM[k], cx, top + 22, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, `(${COLOUR[k]})`, cx, top + 40, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
