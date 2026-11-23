// Class 8 Fractions in Disguise: percent change depends on the base. From old to new the change is (new - old) / old x 100; going back
// from new to old the base is the new number, so the percent is different (a 25% rise needs a 20% fall to undo it).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let o = 80, nw = 100;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 250, label: 'Two bars for an old and a new value with the percent change each way' });
  const ctl = row(host);
  slider(ctl, { label: 'Old value', min: 20, max: 200, step: 5, value: o, fmt: (v) => String(Math.round(v)), oninput: (v) => { o = Math.round(v); upd(); } });
  slider(ctl, { label: 'New value', min: 20, max: 200, step: 5, value: nw, fmt: (v) => String(Math.round(v)), oninput: (v) => { nw = Math.round(v); upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const up = (nw - o) / o * 100, back = (o - nw) / nw * 100, t = title(ctx, 'Old → new: ' + (up >= 0 ? '+' : '') + +up.toFixed(1) + '%', col), x0 = 16, sc = (w - 32) / 200;
    [['Old ' + o, o, col.s[0], t + 22], ['New ' + nw, nw, up >= 0 ? col.s[2] : col.s[3], t + 66]].forEach(([lab, v, cl, y]) => { ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = cl; ctx.fillRect(x0, y, v * sc, 34); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.3; ctx.strokeRect(x0, y, v * sc, 34); text(ctx, lab, x0 + 6, y + 17, { color: col.ink, size: 13, weight: 700, halo: col.panel }); });
    text(ctx, 'New → old: ' + (back >= 0 ? '+' : '') + +back.toFixed(1) + '%', w / 2, t + 130, { color: col.s[5], size: 14, weight: 700, align: 'center' });
    text(ctx, 'Not the same, because the base changes.', w / 2, h - 14, { color: col.muted, size: 12, align: 'center' });
  };
  function upd() { out.innerHTML = `Old to new: (${nw} − ${o}) ÷ ${o} × 100 = <b>${+((nw - o) / o * 100).toFixed(1)}%</b>. New back to old: (${o} − ${nw}) ÷ ${nw} × 100 = <b>${+((o - nw) / nw * 100).toFixed(1)}%</b>.`; cv.redraw(); }
  upd();
}
