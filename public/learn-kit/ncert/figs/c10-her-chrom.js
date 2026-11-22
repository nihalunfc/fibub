// Class 10 Heredity: chromosomes come in pairs, one from each parent. When a gamete is made, it gets one chromosome from each
// pair, chosen at random. With 3 pairs there are 2^3 = 8 different gametes; with the 23 pairs of a human there are 2^23 = 8,388,608,
// which is one reason why brothers and sisters differ. (Crossing over adds even more variation.)
import { canvas, text, title, line, dot, row, button, readout, rng } from '../../kit.js';

export default function (host) {
  let pick = [0, 1, 0], R = rng(31), n = 0;
  const cv = canvas(host, { aspect: 0.88, max: 440, min: 300, label: 'Three chromosome pairs, each with one chromosome from the mother and one from the father, giving eight possible gametes' });
  const ctl = row(host);
  button(ctl, 'Make a gamete', () => { pick = [R() < 0.5 ? 0 : 1, R() < 0.5 ? 0 : 1, R() < 0.5 ? 0 : 1]; n++; say(); });
  const out = readout(host);
  function say() { const id = pick[0] * 4 + pick[1] * 2 + pick[2]; out.textContent = `Gamete type ${id + 1} of 8. Each pair gave one chromosome, chosen at random. In humans there are 23 pairs, so one person can make 2²³ = 8,388,608 kinds of gametes.`; cv.redraw(); }
  const chr = (ctx, col, x, y, len, c, on) => { ctx.save(); ctx.globalAlpha = on ? 1 : 0.35; ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - 6, y, 12, len, 6); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = on ? 2 : 1; ctx.stroke(); ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One chromosome from each pair', col) + 16, L = [62, 46, 32], cx = w * 0.32;
    text(ctx, 'body cell: 3 pairs', cx, top, { color: col.muted, size: 10.5, align: 'center' });
    [0, 1, 2].forEach((p) => { const x = cx - 54 + p * 54; chr(ctx, col, x - 8, top + 12, L[p], col.s[1], pick[p] === 0); chr(ctx, col, x + 8, top + 12, L[p], col.s[0], pick[p] === 1); });
    text(ctx, 'from mother (orange)   from father (blue)', cx, top + 90, { color: col.muted, size: 9.5, align: 'center' });
    const gx = w * 0.78; text(ctx, 'gamete: 1 of each', gx, top, { color: col.muted, size: 10.5, align: 'center' }); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(gx, top + 48, 46, 42, 0, 0, 7); ctx.stroke();
    [0, 1, 2].forEach((p) => chr(ctx, col, gx - 24 + p * 24, top + 48 - L[p] / 2 - 2, L[p], pick[p] === 0 ? col.s[1] : col.s[0], true));
    // list of 8 combos
    const ly = top + 128, id = pick[0] * 4 + pick[1] * 2 + pick[2]; text(ctx, 'all 8 possible gametes', w / 2, ly - 10, { color: col.ink, size: 11, weight: 700, align: 'center' });
    for (let k = 0; k < 8; k++) { const x = 20 + (k % 4) * ((w - 40) / 4), y = ly + 8 + Math.floor(k / 4) * 64, bits = [k >> 2 & 1, k >> 1 & 1, k & 1]; if (k === id) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, (w - 40) / 4 - 8, 56); } bits.forEach((b, p) => chr(ctx, col, x + 14 + p * 16, y + 8, L[p] * 0.7, b ? col.s[0] : col.s[1], true)); }
    text(ctx, `humans: 23 pairs → 2²³ = 8,388,608 gametes`, w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  say();
}
