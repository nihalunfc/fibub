// Class 8 We Distribute: a(b + c) = ab + ac. A rectangle a tall and b + c wide is cut into an a-by-b and an a-by-c rectangle,
// so multiplying the whole equals adding the multiplied parts (the distributive property).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let a = 4, b = 5, c = 3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A rectangle of height a and width b plus c split into two rectangles' });
  const ctl = row(host);
  slider(ctl, { label: 'a (height)', min: 1, max: 9, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); upd(); } });
  slider(ctl, { label: 'b (width 1)', min: 1, max: 9, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); upd(); } });
  slider(ctl, { label: 'c (width 2)', min: 1, max: 9, step: 1, value: c, fmt: (v) => String(Math.round(v)), oninput: (v) => { c = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, a + ' × (' + b + ' + ' + c + ') = ' + a + ' × ' + b + ' + ' + a + ' × ' + c, col), s = Math.min((w - 50) / 18, (h - t - 56) / 9), ox = (w - (b + c) * s) / 2, oy = t + 30;
    [[0, b, col.s[0], 'a × b = ' + a * b], [b, c, col.s[2], 'a × c = ' + a * c]].forEach(([x, ww, cl, lab]) => {
      ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = cl; ctx.fillRect(ox + x * s, oy, ww * s, a * s); ctx.restore();
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(ox + x * s, oy, ww * s, a * s);
      for (let i = 1; i < ww; i++) { ctx.beginPath(); ctx.moveTo(ox + (x + i) * s, oy); ctx.lineTo(ox + (x + i) * s, oy + a * s); ctx.strokeStyle = col.line; ctx.lineWidth = 0.7; ctx.stroke(); }
      for (let i = 1; i < a; i++) { ctx.beginPath(); ctx.moveTo(ox + x * s, oy + i * s); ctx.lineTo(ox + (x + ww) * s, oy + i * s); ctx.strokeStyle = col.line; ctx.lineWidth = 0.7; ctx.stroke(); }
      text(ctx, lab, ox + (x + ww / 2) * s, oy + a * s / 2, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    });
    text(ctx, 'b + c = ' + (b + c), ox + (b + c) * s / 2, oy - 8, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'a = ' + a, ox - 6, oy + a * s / 2, { color: col.ink, size: 12, weight: 700, align: 'right' });
    text(ctx, 'whole = ' + a * (b + c), w / 2, h - 14, { color: col.s[5], size: 14, weight: 700, align: 'center' });
  };
  function upd() { out.innerHTML = `Whole rectangle: ${a} × ${b + c} = <b>${a * (b + c)}</b>. Two parts: ${a * b} + ${a * c} = <b>${a * b + a * c}</b>. Same number, so a(b + c) = ab + ac for any a, b, c.`; cv.redraw(); }
  upd();
}
