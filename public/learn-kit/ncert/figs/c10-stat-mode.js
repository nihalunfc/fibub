// Class 10 Statistics: the mode of grouped data. The modal class is the class with the highest frequency f1. Its
// neighbours have f0 (before) and f2 (after). Draw a line from the top-right corner of the class before to the
// top-right corner of the modal bar, and another from the top-left corner of the modal bar to the top-left corner of
// the class after: they cross above x = l + h(f1 - f0)/(2f1 - f0 - f2), the mode. Exported drawMode is reused by the step player.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export function modeOf(f0, f1, f2, l, h) { return l + h * (f1 - f0) / (2 * f1 - f0 - f2); }

/** stage 0 bars, 1 modal class, 2 labels, 3 lines and mode. */
export function drawMode(ctx, w, h, col, { f0, f1, f2, l = 40, hw = 20, stage = 3 }) {
  const top = title(ctx, 'The mode from the three tallest bars', col);
  const L = 30, R = w - 14, B = h - 40, T = top + 22, fmax = Math.max(f1, f0, f2) + 2, u = (B - T) / fmax, bw = (R - L) / 3;
  const X = (v) => L + ((v - (l - hw)) / (3 * hw)) * (R - L), Y = (f) => B - f * u;
  ctx.strokeStyle = col.line; ctx.lineWidth = 1;
  for (let g = 0; g <= fmax; g += 2) { ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(R, Y(g)); ctx.stroke(); text(ctx, String(g), L - 6, Y(g), { color: col.muted, size: 10, align: 'right' }); }
  [[f0, 0, 'before'], [f1, 1, 'modal class'], [f2, 2, 'after']].forEach(([f, i, nm]) => {
    const x = L + i * bw, hi = stage >= 1 && i === 1;
    ctx.fillStyle = hi ? col.s[2] : col.s[0]; ctx.globalAlpha = hi ? 0.85 : 0.55; ctx.fillRect(x, Y(f), bw, f * u); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, Y(f), bw, f * u);
    text(ctx, `${l + (i - 1) * hw}–${l + i * hw}`, x + bw / 2, B + 12, { color: col.ink, size: 11, align: 'center' });
    if (stage >= 2) text(ctx, `f${i} = ${f}`, x + bw / 2, Y(f) + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    if (stage >= 1 && i === 1) text(ctx, nm, x + bw / 2, B - 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
  });
  if (stage >= 2) { text(ctx, 'l = ' + l, L + bw - 4, B + 27, { color: col.s[3], size: 11, weight: 700, align: 'right' }); }
  if (stage >= 3) {
    const t = (f1 - f0) / (2 * f1 - f0 - f2), xm = L + bw + t * bw, ym = Y(f0 + (f1 - f0) * t);
    ctx.lineWidth = 2.5; ctx.strokeStyle = col.s[3];
    ctx.beginPath(); ctx.moveTo(L + bw, Y(f0)); ctx.lineTo(L + 2 * bw, Y(f1)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(L + bw, Y(f1)); ctx.lineTo(L + 2 * bw, Y(f2)); ctx.stroke();
    ctx.setLineDash([4, 4]); ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(xm, ym); ctx.lineTo(xm, B); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col.s[1]; ctx.beginPath(); ctx.arc(xm, ym, 5, 0, 7); ctx.fill();
    text(ctx, 'mode ≈ ' + modeOf(f0, f1, f2, l, hw).toFixed(2), xm + 4, B + 27, { color: col.s[1], size: 12, weight: 700, align: xm > R - 100 ? 'right' : 'left' });
  }
}

export default function (host) {
  let f0 = 9, f1 = 14, f2 = 8;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 290, label: 'Three histogram bars with lines whose crossing gives the mode' });
  const ctl = row(host);
  const s0 = slider(ctl, { label: 'f0 (class before)', min: 1, max: 18, step: 1, value: f0, oninput: (v) => { f0 = v; fix(); } });
  const s1 = slider(ctl, { label: 'f1 (modal class)', min: 4, max: 18, step: 1, value: f1, oninput: (v) => { f1 = v; fix(); } });
  const s2 = slider(ctl, { label: 'f2 (class after)', min: 1, max: 18, step: 1, value: f2, oninput: (v) => { f2 = v; fix(); } });
  const out = readout(host);
  function fix() {
    if (f0 > f1) { f0 = f1; s0.set(f0); } if (f2 > f1) { f2 = f1; s2.set(f2); }
    if (f0 === f1 && f2 === f1) { f1++; s1.set(f1); }
    const m = modeOf(f0, f1, f2, 40, 20);
    out.innerHTML = `mode = l + h × (f1 − f0) ÷ (2f1 − f0 − f2) = 40 + 20 × (${f1} − ${f0}) ÷ (${2 * f1} − ${f0} − ${f2}) = <b>${m.toFixed(2)}</b>. ` + (f0 > f2 ? 'The earlier class is fuller, so the mode is pulled left.' : f0 < f2 ? 'The later class is fuller, so the mode is pulled right.' : 'Both neighbours are equal, so the mode is the middle of the class.');
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => drawMode(ctx, w, h, col, { f0, f1, f2 });
  fix();
}
