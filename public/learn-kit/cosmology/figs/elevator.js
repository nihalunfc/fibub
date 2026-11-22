// 3.4 Einstein's lift. Four steps: (1) on Earth a dropped ball falls; (2) in a rocket accelerating at 1 g it
// "falls" exactly the same, so you cannot tell which; (3) in a falling lift everything floats; (4) a light beam
// crossing an accelerating lift curves down, so gravity must bend light too (the curve is hugely exaggerated).
import { canvas, text, title, line, dot, arrow, loop, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 260, label: 'A person in a lift on Earth, in a rocket, in free fall, and a light beam crossing the lift' });
  let step = 0, t = 0;
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }, { autoplay: false });
  const person = (ctx, x, y, col, float = 0) => {
    ctx.save(); ctx.translate(x, y - float); ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -46, 7, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -39); ctx.lineTo(0, -16); ctx.moveTo(0, -16); ctx.lineTo(-8, 0); ctx.moveTo(0, -16); ctx.lineTo(8, 0);
    ctx.moveTo(0, -32); ctx.lineTo(14, -26); ctx.moveTo(0, -32); ctx.lineTo(-10, -24); ctx.stroke(); ctx.restore();
  };
  cv.draw = (ctx, w, h, col) => {
    const bw = Math.min(w * 0.5, 220), bh = h - 92, bx = (w - bw) / 2, by = 52;
    const ph = calm() ? 0.6 : (t % 2.2) / 1.6, p = Math.min(1, ph);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    const floor = by + bh;
    if (step === 0 || step === 1) {
      person(ctx, bx + bw * 0.35, floor, col);
      const y0 = floor - 34, y = y0 + (floor - 6 - y0) * p * p;
      dot(ctx, bx + bw * 0.35 + 22, y, 6, col.s[1]);
      if (step === 0) {
        line(ctx, [[0, floor + 2], [w, floor + 2]], col.s[2], 3);
        text(ctx, 'on the ground on Earth', w / 2, floor + 22, { color: col.ink, size: 12, weight: 600, align: 'center' });
        arrow(ctx, bx + bw + 24, by + 30, bx + bw + 24, by + 80, col.muted, 2);
        text(ctx, 'gravity', bx + bw + 30, by + 56, { color: col.muted, size: 11.5 });
      } else {
        for (let i = 0; i < 3; i++) { const fx = bx + bw * (0.3 + 0.2 * i), fl = 14 + 8 * Math.sin(t * 20 + i); line(ctx, [[fx, floor + 4], [fx, floor + 4 + fl]], col.s[3], 4); }
        text(ctx, 'in a rocket in space, speeding up at 9.8 m/s²', w / 2, h - 10, { color: col.ink, size: 12, weight: 600, align: 'center' });
        arrow(ctx, bx + bw + 24, by + 80, bx + bw + 24, by + 30, col.muted, 2);
        text(ctx, 'speeding up', bx + bw + 30, by + 56, { color: col.muted, size: 11.5 });
      }
      text(ctx, 'the ball falls exactly the same way', w / 2, by - 12, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
    } else if (step === 2) {
      const f = 10 + 6 * Math.sin(t * 1.5);
      person(ctx, bx + bw * 0.4, floor - 30, col, f);
      dot(ctx, bx + bw * 0.4 + 30, floor - 90 - f, 6, col.s[1]);
      arrow(ctx, bx + bw + 24, by + 30, bx + bw + 24, by + 80, col.muted, 2);
      text(ctx, 'falling', bx + bw + 30, by + 56, { color: col.muted, size: 11.5 });
      text(ctx, 'in a falling lift, you and the ball float together', w / 2, by - 12, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      text(ctx, 'astronauts in orbit are falling all the time', w / 2, h - 10, { color: col.muted, size: 12, align: 'center' });
    } else {
      const y0 = by + bh * 0.3, sag = bh * 0.45;
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40 * Math.min(1, p * 1.2); pts.push([bx + u * bw, y0 + sag * u * u]); }
      line(ctx, [[bx + 2, y0], [bx + bw - 2, y0]], col.line, 1, [4, 4]);
      line(ctx, pts, col.s[3], 3);
      dot(ctx, bx - 6, y0, 6, col.s[3]);
      text(ctx, 'torch', bx - 8, y0 - 14, { color: col.muted, size: 11, align: 'center' });
      text(ctx, 'speeding up (or standing in gravity): the beam curves down', w / 2, by - 12, { color: col.ink, size: 12.5, weight: 700, align: 'center' });
      text(ctx, 'hugely exaggerated: across a real lift the drop is smaller than an atom', w / 2, h - 10, { color: col.muted, size: 11.5, align: 'center' });
    }
    title(ctx, ['1. Standing on Earth', '2. In a rocket in space', '3. Falling is floating', '4. So gravity bends light'][step], col);
  };
  cv.redraw();
  return { step(i) { step = i; t = 0; cv.redraw(); anim.play(); } };
}
