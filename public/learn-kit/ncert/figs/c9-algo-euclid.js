// Class 9 Algorithms: Euclid's algorithm as shrinking rectangles. To find the HCF of a and b, cut the largest squares you can from an
// a-by-b rectangle (side = the shorter side). What is left is a smaller rectangle; repeat. When nothing is left, the side of the last square
// is the HCF, because it fits an exact number of times into both sides. Each cut is one division step: a = q × b + r.
import { canvas, text, title, row, slider, button, readout } from '../../kit.js';

export default function (host) {
  let a = 48, b = 18, k = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'A rectangle cut into squares to find the highest common factor' });
  const c = row(host);
  slider(c, { label: 'Long side a', min: 2, max: 60, step: 1, value: a, oninput: (v) => { a = v; k = 0; upd(); } });
  slider(c, { label: 'Short side b', min: 2, max: 60, step: 1, value: b, oninput: (v) => { b = v; k = 0; upd(); } });
  const c2 = row(host); button(c2, 'Cut the squares', () => { k = Math.min(k + 1, chain().length); upd(); }); button(c2, 'Start again', () => { k = 0; upd(); });
  const out = readout(host);
  const chain = () => { let x = Math.max(a, b), y = Math.min(a, b); const o = []; while (y > 0) { const q = Math.floor(x / y), r = x % y; o.push({ x, y, q, r }); x = y; y = r; } return o; };
  const hcf = () => { const ch = chain(); return ch[ch.length - 1].y; };
  cv.draw = (ctx, w, h, col) => {
    const ch = chain(), A = Math.max(a, b), B = Math.min(a, b), t = title(ctx, 'HCF(' + A + ', ' + B + ') by cutting squares', col), sc = Math.min((w - 24) / A, (h - t - 56) / B), ox = (w - A * sc) / 2, oy = t + 10;
    ctx.save(); ctx.fillStyle = col.line; ctx.globalAlpha = 0.5; ctx.fillRect(ox, oy, A * sc, B * sc); ctx.restore();
    let x0 = 0, y0 = 0, W = A, H = B; const cols = [col.s[0], col.s[3], col.s[2], col.s[5], col.s[1]];
    for (let i = 0; i < Math.min(k, ch.length); i++) {
      const { y, q } = ch[i], horiz = W >= H; const side = y;
      for (let j = 0; j < q; j++) { const px = horiz ? x0 + j * side : x0, py = horiz ? y0 : y0 + j * side; ctx.save(); ctx.fillStyle = cols[i % 5]; ctx.globalAlpha = 0.6; ctx.fillRect(ox + px * sc, oy + py * sc, side * sc, side * sc); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(ox + px * sc, oy + py * sc, side * sc, side * sc); ctx.restore(); if (side * sc > 18) text(ctx, String(side), ox + (px + side / 2) * sc, oy + (py + side / 2) * sc, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
      if (horiz) { x0 += q * side; W -= q * side; } else { y0 += q * side; H -= q * side; }
      if (W === 0 || H === 0) { W = 0; H = 0; }
    }
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(ox, oy, A * sc, B * sc); ctx.restore();
    const done = k >= ch.length;
    text(ctx, done ? 'Nothing left: HCF = ' + hcf() : k ? 'Leftover rectangle: ' + ch[k - 1].r + ' by ' + ch[k - 1].y : 'A rectangle ' + A + ' by ' + B, w / 2, h - 34, { color: done ? col.s[2] : col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, k ? ch.slice(0, k).map((s) => s.x + ' = ' + s.q + '×' + s.y + ' + ' + s.r).join('   ') : 'Press “Cut the squares”', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  function upd() { const ch = chain(), done = k >= ch.length; out.innerHTML = k === 0 ? `The rectangle is ${Math.max(a, b)} by ${Math.min(a, b)}. Press <b>Cut the squares</b>: each press cuts the biggest squares possible.` : `Step ${k}: ${ch[k - 1].x} = ${ch[k - 1].q} × ${ch[k - 1].y} + ${ch[k - 1].r}. ` + (done ? `The remainder is 0, so the last divisor <b>${hcf()}</b> is the HCF. A square of side ${hcf()} tiles the whole rectangle exactly.` : `Left over: a ${ch[k - 1].y} by ${ch[k - 1].r} rectangle. Cut again.`); cv.redraw(); }
  upd();
}
