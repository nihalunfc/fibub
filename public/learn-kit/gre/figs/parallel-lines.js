// 4.1 Parallel lines cut by a transversal: turn the transversal and watch which angles stay equal.
import { canvas, row, slider, readout, text, title } from '../../kit.js';
export default function (host) {
  let a = 60;
  const cv = canvas(host, { aspect: 0.62, max: 320, min: 230, label: 'Two parallel lines cut by a slanted line, with the eight angles labelled' });
  const ctl = row(host); slider(ctl, { label: 'Angle x', min: 20, max: 160, step: 1, value: a, fmt: (v) => Math.round(v) + '°', oninput: (v) => { a = Math.round(v); go(); } });
  const out = readout(host);
  const go = () => { cv.redraw(); out.innerHTML = `The four angles marked <b>x</b> are all ${a}°; the four marked <b>y</b> are all ${180 - a}°. Any x and any y add to 180°.`; };
  cv.draw = (ctx, w, h, col) => {
    const y1 = h * 0.38, y2 = h * 0.72, cx = w / 2, t = (a * Math.PI) / 180, dx = Math.cos(t), dy = Math.sin(t), L = h * 0.6;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    [y1, y2].forEach((y) => { ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(w - 20, y); ctx.stroke(); });
    const xAt = (y) => cx + ((y1 + y2) / 2 - y) * dx / dy;
    ctx.strokeStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(xAt(y1 - L / 2), y1 - L / 2); ctx.lineTo(xAt(y2 + L / 2), y2 + L / 2); ctx.stroke(); ctx.lineWidth = 1;
    [y1, y2].forEach((y) => { const x = xAt(y), o = 18;
      text(ctx, 'x', x + o, y - 10, { color: col.s[1], size: 13, weight: 700, align: 'center' }); text(ctx, 'y', x - o, y - 10, { color: col.s[2], size: 13, weight: 700, align: 'center' });
      text(ctx, 'y', x + o, y + 12, { color: col.s[2], size: 13, weight: 700, align: 'center' }); text(ctx, 'x', x - o, y + 12, { color: col.s[1], size: 13, weight: 700, align: 'center' }); });
    title(ctx, `x = ${a}°, y = ${180 - a}°`, col);
  };
  go();
}
