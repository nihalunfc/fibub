// Class 9 Sequences: a first look at geometric growth. A rumour spreads: each person who hears it tells r new
// people the next day. The number of new listeners multiplies by the common ratio r every day: 1, r, r x r, ...
import { canvas, text, title, row, slider, choice, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let r = 2, days = 3;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A rumour spreading as a tree where each person tells two or three new people' });
  const ctl = row(host);
  choice(ctl, 'Each person tells', [[2, '2 people'], [3, '3 people']], r, (v) => { r = v; days = Math.min(days, r === 3 ? 4 : 5); sl.set(days); sync(); });
  const sl = slider(ctl, { label: 'Days', min: 0, max: 5, step: 1, value: days, fmt: (v) => String(v), oninput: (v) => { days = r === 3 ? Math.min(v, 4) : v; if (days !== v) sl.set(days); sync(); } });
  const out = readout(host);
  const lvl = (k) => r ** k;
  function sync() {
    const t = Array.from({ length: days + 1 }, (_, k) => lvl(k)), tot = t.reduce((a, b) => a + b, 0);
    out.innerHTML = `New listeners each day: ${t.join(', ')}. Each is ${r} times the one before, so the <b>common ratio is ${r}</b> (not a common difference). On day ${days} there are ${lvl(days)} new listeners; ${tot} people know in all. Day 10 would give ${r ** 10}.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Geometric growth: multiply by ' + r + ' each day', col), rowH = (h - top - 40) / 6, y0 = top + 26;
    const pos = (k) => Array.from({ length: lvl(k) }, (_, i) => [((i + 0.5) / lvl(k)) * (w - 30) + 15, y0 + k * rowH]);
    for (let k = 0; k < days; k++) pos(k).forEach((p, i) => { for (let c = 0; c < r; c++) { const q = pos(k + 1)[i * r + c]; ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); } });
    for (let k = 0; k <= days; k++) pos(k).forEach((p) => dot(ctx, p[0], p[1], Math.max(2.5, Math.min(8, (w - 30) / lvl(k) / 2.4)), k === days ? col.s[2] : col.s[0], col.ink));
    for (let k = 0; k <= days; k++) text(ctx, 'day ' + k, 4, y0 + k * rowH - rowH * 0.34, { color: col.muted, size: 9, fit: true });
    text(ctx, lvl(days) + ' new on day ' + days, w / 2, h - 14, { color: col.ink, size: 14, weight: 700, align: 'center' });
  };
  sync();
}
