// Class 9 Identities: (a + b + c)^2 = a^2 + b^2 + c^2 + 2ab + 2bc + 2ca. A square of side a + b + c is a 3-by-3 grid of rectangles:
// three squares on the diagonal and six rectangles (two for each pair) off it.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let v = [3, 2, 1.5];
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A square of side a plus b plus c split into three squares and six rectangles' });
  const ctl = row(host);
  ['a', 'b', 'c'].forEach((n, i) => slider(ctl, { label: n, min: 0.5, max: 4, step: 0.5, value: v[i], oninput: (x) => { v[i] = x; upd(); } }));
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [a, b, c] = v, S = a + b + c, t = title(ctx, '(a + b + c)² = ' + S * S, col), sc = Math.min((w - 60) / 12, (h - t - 44) / 12) * (12 / 12) * (Math.min(12, 12) / S) * 1, side = Math.min(w - 60, h - t - 44), u = side / S, ox = (w - side) / 2 + 6, oy = t + 22;
    const sz = [a, b, c], nm = ['a', 'b', 'c'];
    let y = 0;
    for (let r = 0; r < 3; r++) { let x = 0; for (let q = 0; q < 3; q++) {
      const sq = r === q, cc = sq ? col.s[r] : col.s[3 + ((r + q) % 3 === 0 ? 0 : 1)], lab = sq ? nm[r] + '²' : nm[Math.min(r, q)] + nm[Math.max(r, q)];
      ctx.save(); ctx.globalAlpha = sq ? 0.5 : 0.3; ctx.fillStyle = sq ? col.s[r] : col.s[5]; ctx.fillRect(ox + x * u, oy + y * u, sz[q] * u, sz[r] * u); ctx.restore();
      ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(ox + x * u, oy + y * u, sz[q] * u, sz[r] * u); ctx.restore();
      text(ctx, lab, ox + (x + sz[q] / 2) * u, oy + (y + sz[r] / 2) * u, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
      x += sz[q]; } y += sz[r]; }
    let x = 0; sz.forEach((s2, i) => { text(ctx, nm[i], ox + (x + s2 / 2) * u, oy - 8, { color: col.ink, size: 13, weight: 700, align: 'center' }); x += s2; });
    y = 0; sz.forEach((s2, i) => { text(ctx, nm[i], ox - 9, oy + (y + s2 / 2) * u, { color: col.ink, size: 13, weight: 700, align: 'center' }); y += s2; });
  };
  function upd() { const [a, b, c] = v; out.innerHTML = `a² + b² + c² = ${a * a + b * b + c * c}, and the six rectangles are 2ab + 2bc + 2ca = ${2 * (a * b + b * c + c * a)}. Total ${a * a + b * b + c * c + 2 * (a * b + b * c + c * a)} = (${a + b + c})² = <b>${(a + b + c) ** 2}</b>.`; cv.redraw(); }
  upd();
}
