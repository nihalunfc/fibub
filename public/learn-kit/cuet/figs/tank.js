// 3.7 Time and work as rates: two pipes fill a tank, one drain empties it. Each does a fraction of the job per
// hour; add the fractions (drain counts as minus). Press play to watch it fill.
import { canvas, text, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 210, label: 'A tank filling from two pipes while a drain empties it' });
  let a = 6, b = 12, c = 0, level = 0, hour = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Pipe A fills alone in (h)', min: 2, max: 20, step: 1, value: a, fmt: (v) => `${v} h`, oninput: (v) => { a = v; reset(); } });
  slider(ctl, { label: 'Pipe B fills alone in (h)', min: 2, max: 30, step: 1, value: b, fmt: (v) => `${v} h`, oninput: (v) => { b = v; reset(); } });
  slider(ctl, { label: 'Drain empties in (h, 0 = closed)', min: 0, max: 30, step: 1, value: c, fmt: (v) => (v ? `${v} h` : 'closed'), oninput: (v) => { c = v; reset(); } });
  const out = readout(host);
  const rate = () => 1 / a + 1 / b - (c ? 1 / c : 0);
  const reset = () => { level = 0; hour = 0; show(); cv.redraw(); };
  const show = () => {
    const r = rate();
    out.innerHTML = r <= 0 ? 'The drain is at least as fast as both pipes together: the tank never fills.'
      : `Per hour: 1/${a} + 1/${b}${c ? ` − 1/${c}` : ''} = ${r.toFixed(4)} of the tank, so it fills in <b>${(1 / r).toFixed(2)} hours</b>.`;
  };
  loop(host, (dt) => { const r = rate(); if (r <= 0 || level >= 1) return; const k = (Math.min(dt, 0.05) / r) / 5; hour += k; level = Math.min(1, level + r * k); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const tw = Math.min(w * 0.4, 180), tx = (w - tw) / 2, ty = 30, th = h - 60;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(tx, ty + th * (1 - level), tw, th * level); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(tx, ty, tw, th);
    text(ctx, 'A', tx + tw * 0.25, 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, 'B', tx + tw * 0.75, 14, { color: col.ink, size: 13, weight: 700, align: 'center' });
    if (c) text(ctx, 'drain', tx + tw + 8, ty + th - 8, { color: col.s[1], size: 12, weight: 600 });
    text(ctx, `${Math.round(level * 100)}% full after ${hour.toFixed(1)} h`, w / 2, h - 12, { color: col.ink, size: 12, weight: 600, align: 'center' });
  };
  show(); cv.redraw();
}
