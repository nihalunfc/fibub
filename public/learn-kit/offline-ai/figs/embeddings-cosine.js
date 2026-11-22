// 12.2 Embeddings: three sentences as 2-D arrows (a toy; real ones have hundreds of numbers).
// Steps: raw arrows, scaled to length 1, vacation vs leave (dot 0.96), vacation vs printer (dot 0), the question finds its match.
import { canvas, title, text, line, dot, arrow, loop, calm, ease } from '../../kit.js';

const RAW = [[1.2, 1.6], [2.4, 1.8], [1.6, -1.2]];
const UNIT = RAW.map(([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; });
const NAME = ['vacation days', 'annual leave?', 'printer toner'];
const T = ['Each sentence becomes an arrow', 'Scale every arrow to length 1', 'vacation · leave = 0.96: close', 'vacation · printer = 0: unrelated', 'The question finds the vacation rule'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.75, max: 340, min: 250, label: 'Three sentence embeddings drawn as arrows; similar meanings point the same way' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.8); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const e = ease(k);
    title(ctx, T[step], col);
    const ox = w * 0.14, oy = h * 0.56;
    const scRaw = Math.min((w - ox - 100) / 2.4, (oy - 48) / 1.8, (h - oy - 28) / 1.2), scUnit = Math.min(w - ox - 110, oy - 52, h - oy - 30);
    const sc = step === 0 ? scRaw : step === 1 ? scRaw + (scUnit - scRaw) * e : scUnit;
    line(ctx, [[ox - 10, oy], [w - 10, oy]], col.line, 1); line(ctx, [[ox, 40], [ox, h - 10]], col.line, 1);
    const scale = step === 0 ? 1 : step === 1 ? 1 - e : 0;
    const pts = RAW.map((r, i) => [UNIT[i][0] + (r[0] - UNIT[i][0]) * scale, UNIT[i][1] + (r[1] - UNIT[i][1]) * scale]);
    if (step >= 1) { ctx.strokeStyle = col.line; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(ox, oy, sc, -Math.PI / 2, Math.PI / 2); ctx.stroke(); ctx.setLineDash([]); }
    const hi = step === 2 ? [0, 1] : step === 3 ? [0, 2] : step === 4 ? [0, 1] : [0, 1, 2];
    pts.forEach(([x, y], i) => {
      const X = ox + x * sc, Y = oy - y * sc, on = hi.includes(i);
      arrow(ctx, ox, oy, X, Y, on ? col.s[i] : col.line, on ? 2.5 : 1.5);
      const lx = i === 0 ? X - 4 : X + 7, ly = i === 0 ? Y - 12 : i === 1 ? Y + 2 : Y + 12;
      text(ctx, NAME[i], lx, ly, { color: on ? col.ink : col.muted, size: 12, weight: 600, align: i === 0 ? 'center' : 'left' });
    });
    if (step === 2 || step === 3) {
      const j = step === 2 ? 1 : 2, a0 = Math.atan2(-UNIT[0][1], UNIT[0][0]), a1 = Math.atan2(-UNIT[j][1], UNIT[j][0]);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ox, oy, sc * 0.3, Math.min(a0, a1), Math.min(a0, a1) + Math.abs(a1 - a0) * e); ctx.stroke();
      const d = UNIT[0][0] * UNIT[j][0] + UNIT[0][1] * UNIT[j][1];
      text(ctx, `${UNIT[0][0].toFixed(1)} × ${UNIT[j][0].toFixed(1)} + ${UNIT[0][1].toFixed(1)} × ${UNIT[j][1] < 0 ? '(' + UNIT[j][1].toFixed(1).replace('-', '−') + ')' : UNIT[j][1].toFixed(1)} = ${Math.abs(d) < 1e-9 ? '0' : d.toFixed(2)}`, 10, h - 14, { color: col.ink, size: 12, weight: 600 });
    }
    if (step === 4) { dot(ctx, ox + UNIT[0][0] * sc, oy - UNIT[0][1] * sc, 6, col.s[0]); text(ctx, 'best match: 0.96', 10, h - 14, { color: col.ink, size: 12, weight: 600 }); }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
