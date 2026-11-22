// Class 9 Numbers: why sqrt2 is not p/q. If sqrt2 = p/q then p^2 = 2 q^2. For every q find the whole number p that makes p^2
// closest to 2 q^2: the two never match, the gap is always at least 1, so sqrt2 is never exactly a fraction of whole numbers.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let q = 5;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 260, label: 'A square of side p against two squares of side q: their areas never match exactly' });
  const ctl = row(host);
  slider(ctl, { label: 'q', min: 1, max: 30, step: 1, value: q, oninput: (v) => { q = v; upd(); } });
  const out = readout(host);
  const best = () => { const p = Math.round(q * Math.SQRT2); return [p, p * p, 2 * q * q]; };
  cv.draw = (ctx, w, h, col) => {
    const [p, A, B] = best(), t = title(ctx, 'Is p² = 2q²?  q = ' + q + ', best p = ' + p, col), top = t + 10, room = h - top - 40;
    const sc = Math.min((w - 40) / (p + 2 * q + 2), room / Math.max(p, q)), by = top + room;
    ctx.save(); ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.fillRect(12, by - p * sc, p * sc, p * sc); ctx.fillStyle = col.s[3]; ctx.fillRect(12 + p * sc + 12, by - q * sc, q * sc, q * sc); ctx.fillRect(12 + p * sc + 12 + q * sc + 6, by - q * sc, q * sc, q * sc); ctx.restore();
    ctx.save(); ctx.lineWidth = 2; ctx.strokeStyle = col.s[0]; ctx.strokeRect(12, by - p * sc, p * sc, p * sc); ctx.strokeStyle = col.s[3]; ctx.strokeRect(12 + p * sc + 12, by - q * sc, q * sc, q * sc); ctx.strokeRect(12 + p * sc + 12 + q * sc + 6, by - q * sc, q * sc, q * sc); ctx.restore();
    text(ctx, 'p² = ' + A, 12 + p * sc / 2, by - p * sc / 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'q² + q² = ' + B, 12 + p * sc + 12 + q * sc + 3, by + 14, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'difference ' + Math.abs(A - B) + ' (never 0)', w / 2, h - 8, { color: col.s[6], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const [p, A, B] = best(); out.innerHTML = `With q = ${q} the closest whole p is ${p}: p² = ${A} but 2q² = ${B}. They differ by <b>${Math.abs(A - B)}</b>. ${p}/${q} = ${(p / q).toFixed(6)} is close to √2 = 1.414214 but never equal, and no q ever makes the gap 0 (the proof for all q is in the lesson).`; cv.redraw(); }
  upd();
}
