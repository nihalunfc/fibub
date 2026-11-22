// 13.8 Guard rails: 10,000 tasks pass three layers (model 1 in 20, approval 1 in 10, backup 1 in 50).
// Bars on a log scale; the last step shows what happens when approvals stop being read.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const ROWS = [['Tasks', 10000], ['Model goes wrong', 500], ['Approval missed', 50], ['No backup', 1]];
const SKIP = [['Tasks', 10000], ['Model goes wrong', 500], ['Approval (unread)', 500], ['No backup', 10]];
const HEAD = ['10,000 tasks', 'Layer 1: the model, 1 in 20', 'Layer 2: approval, 1 in 10', 'Layer 3: backup, 1 in 50', 'Approvals not read: 10 times worse'];

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 320, min: 220, label: 'Bars showing 10,000 tasks shrinking to 1 through three independent guard rails' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.7); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, HEAD[step], col);
    const rows = step === 4 ? SKIP : ROWS, show = step === 4 ? 4 : step + 1;
    const L = Math.min(130, w * 0.36), R = w - 56, top = 44, gap = (h - top - 30) / 4;
    const sc = (v) => (Math.log10(v) + 0.3) / 4.3 * (R - L);
    rows.slice(0, show).forEach(([name, v], i) => {
      const y = top + i * gap, grow = (i === show - 1 && step < 4) || (step === 4 && i >= 2) ? ease(k) : 1;
      text(ctx, name, 8, y + 12, { color: col.ink, size: 11.5, weight: 600 });
      ctx.fillStyle = step === 4 && i === 2 ? col.warn || col.s[3] : col.s[i];
      ctx.fillRect(L, y, Math.max(3, sc(v) * grow), 24);
      text(ctx, v.toLocaleString('en-CA'), L + Math.max(3, sc(v) * grow) + 6, y + 12, { color: col.ink, size: 12, weight: 700 });
    });
    text(ctx, 'log scale, so 10,000 and 1 both fit', 8, h - 12, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
