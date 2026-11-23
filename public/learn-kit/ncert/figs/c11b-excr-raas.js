// Class 11 Biology, Excretory products (step player): the renin-angiotensin-aldosterone loop. When blood pressure or flow to the glomerulus falls, the juxtaglomerular (JG) cells
// release renin; renin turns angiotensinogen into angiotensin I, which becomes angiotensin II. Angiotensin II narrows blood vessels and makes the adrenal cortex release aldosterone,
// which makes the distal tubule keep Na+ and water, so blood volume and pressure rise. A rise in pressure switches the loop off: negative feedback.
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 290, label: 'Flow chart of the renin-angiotensin-aldosterone loop that raises blood pressure, revealed one box at a time' });
  const B = [['Blood pressure or GFR falls', 'e.g. blood loss, dehydration'], ['JG cells release renin', 'kidney'], ['Angiotensinogen → angiotensin I → II', 'blood, lungs (ACE)'], ['Vessels narrow + adrenal cortex adds aldosterone', 'angiotensin II acts'], ['Distal tubule keeps Na⁺ and water', 'less urine, K⁺ lost'], ['Blood volume and pressure rise', 'the problem is fixed'], ['Renin release is switched off', 'negative feedback']];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Renin, angiotensin and aldosterone', col), bh = (h - t0 - 20) / 7, bw = w - 40;
    B.forEach(([a, b], i) => {
      const y = t0 + 10 + i * bh, on = i <= step, cur = i === step;
      ctx.fillStyle = cur ? col.s[0] : on ? col.soft : 'transparent'; ctx.globalAlpha = on ? 1 : 0.5; ctx.fillRect(20, y, bw, bh - 12);
      ctx.strokeStyle = on ? col.s[0] : col.line; ctx.lineWidth = cur ? 2.5 : 1.5; ctx.strokeRect(20, y, bw, bh - 12);
      text(ctx, a, w / 2, y + (bh - 12) / 2 - 6, { color: cur ? col.bg : col.ink, size: 11, weight: 700, align: 'center' });
      text(ctx, b, w / 2, y + (bh - 12) / 2 + 8, { color: cur ? col.bg : col.muted, size: 10, align: 'center' });
      ctx.globalAlpha = 1;
      if (i < 6) arrow(ctx, w / 2, y + bh - 12, w / 2, y + bh - 1, on && i < step ? col.s[0] : col.line, 2, 5);
    });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 6); cv.redraw(); } };
}
