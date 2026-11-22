// Class 9 Reproduction (step player): from pollination to fertilisation in a flowering plant. A pollen grain lands on the
// stigma, germinates and grows a pollen tube down the style to the ovule in the ovary. The tube carries the male
// gametes in. One male gamete fuses with the egg cell (fertilisation) and forms the zygote, the first cell of a new plant.
import { canvas, text, title, dot, line, loop, font, ease } from '../../kit.js';

const T = ['Pollen lands on the stigma', 'The pollen grain germinates', 'The pollen tube grows down the style', 'The tube reaches the ovule', 'Fertilisation: the zygote'];
const CAP = ['A pollen grain carried by an insect or the wind sticks to the stigma, the sticky top of the carpel.', 'The grain takes in sugary fluid and a thin tube begins to grow out of it.', 'The tube grows down through the style, pushing through its tissue toward the ovary and the ovule.', 'The tip of the tube finds the tiny opening of the ovule and enters. The two male gametes travel in the tube.', 'One male gamete fuses with the egg cell. This is fertilisation. The fused cell is the zygote, which will become the embryo.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'A pollen tube growing down the style of a flower to the ovule' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, T[step], col);
    const cx = w / 2, sy = 66, ey = h * 0.42, oy = h * 0.44, ov = Math.min(w * 0.22, 78);
    // style walls + stigma
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(cx - 12, sy + 10); ctx.lineTo(cx - 12, ey); ctx.lineTo(cx - ov - 20, ey + 6); ctx.quadraticCurveTo(cx - ov - 24, oy + ov * 1.4, cx, oy + ov * 1.5); ctx.quadraticCurveTo(cx + ov + 24, oy + ov * 1.4, cx + ov + 20, ey + 6); ctx.lineTo(cx + 12, ey); ctx.lineTo(cx + 12, sy + 10); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.ellipse(cx, sy, 26, 11, 0, 0, 7); ctx.fill();
    text(ctx, 'stigma', cx + 34, sy, { color: col.ink, size: 10.5 }); text(ctx, 'style', cx + 18, (sy + ey) / 2, { color: col.ink, size: 10.5 }); text(ctx, 'ovary', cx - ov - 18, oy + ov * 0.9, { color: col.ink, size: 10.5, align: 'right' });
    // ovule
    const ox = cx, oyc = oy + ov * 0.8; ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.ellipse(ox, oyc, ov * 0.55, ov * 0.42, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.stroke();
    dot(ctx, ox, oyc + 8, 6, col.s[0]); text(ctx, 'egg cell', ox + 12, oyc + 20, { color: col.ink, size: 10.5 }); text(ctx, 'ovule', ox - ov * 0.55 - 6, oyc - 12, { color: col.ink, size: 10.5, align: 'right' });
    // pollen and tube
    const grow = step === 2 ? ease(Math.min(1, (t % 4) / 3)) : step >= 3 ? 1 : 0;
    const topY = sy - 6, tipY = oyc - ov * 0.4 - 2, yy = step < 2 ? topY : topY + (tipY - topY) * (step === 1 ? 0.04 * Math.min(1, (t % 3) / 2) * 3 : grow);
    if (step <= 1) { const lift = step === 0 ? Math.max(0, 40 - (t % 3) * 30) : 0; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cx, topY - 6 - lift, 8, 0, 7); ctx.fill(); }
    if (step >= 1) { if (step >= 2) { ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(cx, topY - 6, 8, 0, 7); ctx.fill(); } line(ctx, [[cx, topY], [cx, yy]], col.s[3], 3.5); if (step >= 2) dot(ctx, cx, yy, 4, col.s[3]); }
    if (step === 1) text(ctx, 'pollen grain germinates', cx + 20, topY - 20, { color: col.s[3], size: 10.5, weight: 700 });
    if (step === 2) text(ctx, 'pollen tube', cx - 18, (sy + ey) / 2 + 16, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    if (step === 3) { const f = (t * 0.5) % 1; dot(ctx, cx - 2, topY + (tipY - topY) * (0.3 + 0.7 * f), 3, col.s[1]); dot(ctx, cx + 3, topY + (tipY - topY) * (0.2 + 0.7 * ((f + 0.4) % 1)), 3, col.s[1]); text(ctx, 'male gametes inside', cx - 18, ey - 12, { color: col.s[1], size: 10.5, weight: 700, align: 'right' }); }
    if (step === 4) { const f = ease(Math.min(1, (t % 3) / 1.5)); dot(ctx, cx, tipY + (oyc + 8 - tipY) * f, 3.5, col.s[1]); if (f > 0.95) { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(cx, oyc + 8, 9, 0, 7); ctx.fill(); text(ctx, 'zygote', cx + 16, oyc + 34, { color: col.s[2], size: 11, weight: 700 }); } }
    ctx.font = font(10.5, 400); const L = []; let cur = ''; CAP[step].split(' ').forEach((wd) => { const s = cur ? cur + ' ' + wd : wd; if (ctx.measureText(s).width > w - 24) { L.push(cur); cur = wd; } else cur = s; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 4); t = 0; cv.redraw(); } };
}
