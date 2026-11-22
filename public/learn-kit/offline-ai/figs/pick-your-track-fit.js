// 1.4 Pick your track: packing a 16 GB laptop. Steps: system use, 12B weights at 4 bits, working room,
// the fit check, then a 27B model that overflows.
import { canvas, title, text, loop, calm, ease } from '../../kit.js';

const CAP = 16;
const STATES = [
  [['system and apps', 4, 0]],
  [['system and apps', 4, 0], ['12B weights', 6, 1]],
  [['system and apps', 4, 0], ['12B weights', 6, 1], ['working room', 2, 2]],
  [['system and apps', 4, 0], ['12B weights', 6, 1], ['working room', 2, 2]],
  [['system and apps', 4, 0], ['27B weights', 13.5, 3], ['working room', 2, 2]],
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.55, max: 330, min: 210, label: 'A 16 GB memory bar filling with the system, model weights and working room' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.7); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const blocks = STATES[step], used = blocks.reduce((s, b) => s + b[1], 0);
    title(ctx, step === 4 ? 'A 27B model on a 16 GB laptop' : 'A 12B model on a 16 GB laptop', col);
    const L = 14, R = w - 14, scale = (R - L) / 20, top = 64, bh = 54;
    ctx.fillStyle = col.soft; ctx.fillRect(L, top, CAP * scale, bh);
    let x = L;
    blocks.forEach(([name, gb, c], i) => {
      const last = i === blocks.length - 1 && step !== 3, ww = gb * scale * (last ? ease(k) : 1);
      ctx.fillStyle = col.s[c]; ctx.fillRect(x, top, ww, bh);
      text(ctx, `${name}`, x + 4, top + bh + 16 + i * 17, { color: col.s[c], size: 11.5, weight: 700 });
      text(ctx, `${gb} GB`, x + ww / 2, top + bh / 2, { color: '#fff', size: 11.5, weight: 700, align: 'center' });
      x += ww;
    });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(L + CAP * scale, top - 12); ctx.lineTo(L + CAP * scale, top + bh + 8); ctx.stroke();
    text(ctx, '16 GB', L + CAP * scale, top - 20, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    if (step >= 3 && k >= 1) {
      const fits = used <= CAP;
      text(ctx, fits ? `${used} GB of 16: it fits` : `${used} GB of 16: it does not fit`, w / 2, h - 16, { color: fits ? col.good || col.ink : col.bad || col.ink, size: 13, weight: 700, align: 'center' });
    }
  };
  cv.redraw();
  return { step(i) { step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
