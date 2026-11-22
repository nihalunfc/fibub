// Class 12 Chemistry, d- and f-block (step player): why chromium is 3d5 4s1 and copper is 3d10 4s1 instead of the "expected" 3d4 4s2 and 3d9 4s2.
// 3d and 4s are very close in energy. A half-filled (d5) or full (d10) subshell gains extra stability from exchange energy (more parallel-spin electrons can swap places) and from symmetry.
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'An electron moves from 4s to 3d in chromium and copper' });
  const TT = ['Aufbau gives Cr 3d⁴ 4s²', '3d and 4s are almost level', 'Move one 4s electron into 3d', 'Cr is 3d⁵ 4s¹: six unpaired', 'Copper: 3d⁹ 4s² → 3d¹⁰ 4s¹'];
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); if (step === 2 || step === 4) cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), cu = step === 4, bs = Math.min(40, (w - 30) / 7.4), x0 = (w - bs * 7.4) / 2, y0 = top + 40;
    const mv = step === 2 || step === 4 ? ease(t) : step >= 3 ? 1 : 0;
    const dEl = cu ? 9 : 4, box = (x, i, label, ups, dns) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.6; ctx.fillStyle = col.soft; ctx.fillRect(x, y0, bs, bs); ctx.strokeRect(x, y0, bs, bs); if (ups) arrow(ctx, x + bs * 0.3, y0 + bs * 0.85, x + bs * 0.3, y0 + bs * 0.15, col.s[2], 2.4, 6); if (dns) arrow(ctx, x + bs * 0.7, y0 + bs * 0.15, x + bs * 0.7, y0 + bs * 0.85, col.s[2], 2.4, 6); text(ctx, label, x + bs / 2, y0 + bs + 12, { color: col.muted, size: 11, align: 'center' }); };
    const done = step >= 3 || (step === 4), dFinal = cu ? 10 : 5, sFinal = 1;
    const showFinal = mv >= 1, d = showFinal ? dFinal : dEl, s = showFinal ? sFinal : 2;
    box(x0, 0, '4s', s >= 1, s === 2);
    for (let i = 0; i < 5; i++) box(x0 + bs * 2.4 + i * bs, i, '3d', i < d, d > 5 && i < d - 5);
    if (mv > 0 && mv < 1) { // the moving electron
      const sx = x0 + bs * 0.7, tx = x0 + bs * 2.4 + (cu ? 4 : 4) * bs + bs * 0.3 + (cu ? 0.4 * bs : 0), px = sx + (tx - sx) * mv, py = y0 - 30 * Math.sin(Math.PI * mv);
      ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(px, py + 6, 6, 0, 7); ctx.fill();
    }
    const L = (s2, i, c = col.ink, wt = 400) => text(ctx, s2, w / 2, y0 + bs + 44 + i * 20, { color: c, size: 12.5, weight: wt, align: 'center' });
    if (step === 0) { L('3d⁴ 4s²: four unpaired electrons', 0); L('This is what the simple filling order predicts, but it is not what we find.', 1, col.muted); }
    if (step === 1) { L('The 3d and 4s levels are only a little apart,', 0); L('so an electron can move between them for a small cost.', 1); }
    if (step === 2) { L(cu ? 'a 4s electron joins the nine 3d electrons' : 'a 4s electron hops into the empty 3d box', 0, col.s[3], 700); L('the energy paid is less than the energy gained', 1, col.muted); }
    if (step === 3) { L('3d⁵ 4s¹: six unpaired electrons, all parallel spin', 0, col.s[2], 700); L('half-filled d: extra exchange energy and symmetry', 1); }
    if (step === 4) { L(t >= 1 ? '3d¹⁰ 4s¹: full d subshell, one unpaired electron (in 4s)' : 'one 4s electron fills the last 3d place', 0, col.s[2], 700); L('same reason: a full d subshell is extra stable', 1, col.muted); }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
