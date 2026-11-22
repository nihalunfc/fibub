// Class 9 Propositions (step player): proof that vertically opposite angles are equal. Two lines cross. Each pair of neighbouring
// angles lies on a straight line, so adds to 180°. A + B = 180° and B + C = 180°, so A = C. Slide the crossing angle to see it never fails.
import { canvas, text, title, row, slider } from '../../kit.js';

const T = ['Two straight lines cross. Four angles form: A, B, C, D', 'A and B sit on one straight line, so A + B = 180°', 'B and C sit on the other straight line, so B + C = 180°', 'Both equal 180°, so A + B = B + C', 'Take B away from both sides: A = C', 'The same argument gives B = D. Vertically opposite angles are equal'];
export default function (host) {
  let s = 0, th = 60;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'Two crossing lines with the four angles marked, used in a proof that vertically opposite angles are equal' });
  const c = row(host); slider(c, { label: 'Crossing angle A (°)', min: 30, max: 150, step: 1, value: th, oninput: (v) => { th = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, T[s], col, 16), cx = w / 2, cy = t + (h - t - 52) / 2 + 10, L = Math.min(w * 0.44, (h - t - 44) / 2), r = L * 0.4, a = th * Math.PI / 180;
    const rad = (deg) => deg * Math.PI / 180;
    const wedge = (a0, a1, rr, c, al) => { ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, rr, -rad(a1), -rad(a0)); ctx.closePath(); ctx.globalAlpha = al; ctx.fillStyle = c; ctx.fill(); ctx.restore(); };
    const hi = { A: s === 1 || s >= 3, B: s === 1 || s === 2 || s === 3, C: s === 2 || s >= 3, D: s === 5 };
    const eq = s >= 4;
    const R = { A: [0, th], B: [th, 180], C: [180, 180 + th], D: [180 + th, 360] }, colr = { A: col.s[0], B: col.s[3], C: col.s[0], D: col.s[3] };
    for (const k of 'ABCD') { const on = k === 'A' || k === 'C' ? (s === 0 ? 0.12 : hi[k] ? 0.5 : 0.12) : (s === 0 ? 0.12 : hi[k] ? 0.5 : 0.1); wedge(R[k][0], R[k][1], r * (k === 'B' || k === 'D' ? 0.8 : 1), colr[k], on); }
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(cx - L, cy); ctx.lineTo(cx + L, cy); ctx.moveTo(cx - L * Math.cos(a), cy + L * Math.sin(a)); ctx.lineTo(cx + L * Math.cos(a), cy - L * Math.sin(a)); ctx.stroke(); ctx.restore();
    const mid = (k) => (R[k][0] + R[k][1]) / 2, lab = { A: 'A', B: 'B', C: 'C', D: 'D' }, num = { A: th, B: 180 - th, C: th, D: 180 - th };
    for (const k of 'ABCD') { const m = rad(mid(k)), rr = r * (k === 'B' || k === 'D' ? 0.8 : 1) * 0.62; text(ctx, lab[k] + (s === 5 || s === 4 ? ' = ' + num[k] + '°' : ''), cx + Math.cos(m) * Math.max(rr, 24 + (k === 'A' || k === 'C' ? 0 : 0)), cy - Math.sin(m) * Math.max(rr, 24), { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel }); }
    const eqn = ['', 'A + B = 180°', 'B + C = 180°', 'A + B = B + C', 'A = C', 'A = C and B = D'][s];
    text(ctx, eqn, w / 2, h - 14, { color: col.s[2], size: 15, weight: 700, align: 'center' });
    if (s === 1) { ctx.save(); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, L * 0.75, -Math.PI, 0); ctx.stroke(); ctx.restore(); }
    if (s === 2) { ctx.save(); ctx.strokeStyle = col.s[5]; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(cx, cy, L * 0.75, -rad(180 + th), -rad(th)); ctx.stroke(); ctx.restore(); }
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
