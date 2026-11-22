// 2.1 An equation is a balance: whatever you do to one side, do to the other. Used inside a "Watch it happen"
// player; each <div class="step" data-l="3x + 5" data-r="20" data-op="− 5 from both sides"> sets the two pans.
import { canvas, text, line, dot } from '../../kit.js';

export default function (host) {
  const steps = [...(host.parentElement?.querySelectorAll('.step') || [])].map((s) => s.dataset);
  const cv = canvas(host, { aspect: 0.42, max: 250, min: 190, label: 'A balance with the two sides of an equation on its pans' });
  let i = 0;
  cv.draw = (ctx, w, h, col) => {
    const st = steps[i] || { l: 'left', r: 'right' };
    const cx = w / 2, top = h * 0.3, arm = Math.min(w * 0.36, 230);
    line(ctx, [[cx, top], [cx, h - 26]], col.muted, 4);
    line(ctx, [[cx - 40, h - 26], [cx + 40, h - 26]], col.muted, 4);
    line(ctx, [[cx - arm, top], [cx + arm, top]], col.ink, 4);
    dot(ctx, cx, top, 7, col.ink);
    for (const [sx, s, c] of [[-1, st.l, col.s[0]], [1, st.r, col.s[1]]]) {
      const px = cx + sx * arm;
      line(ctx, [[px, top], [px - 50, top + 46]], col.muted, 1.5); line(ctx, [[px, top], [px + 50, top + 46]], col.muted, 1.5);
      ctx.fillStyle = col.soft; ctx.strokeStyle = c; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(px - 70, top + 46, 140, 38, 8); ctx.fill(); ctx.stroke();
      text(ctx, s || '', px, top + 65, { color: col.ink, size: 16, weight: 700, align: 'center' });
    }
    if (st.op) text(ctx, st.op, cx, 16, { color: col.s[2], size: 13, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(k) { i = k; cv.redraw(); } };
}
