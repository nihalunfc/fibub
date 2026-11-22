// Completing the square with areas. x² + bx is a square of side x plus two strips b/2 wide. Move the strips round the
// square and a corner of area (b/2)² is missing: add it and you have (x + b/2)². Step through, then change b and x.
// That missing corner is the whole idea behind the quadratic formula and the vertex of a parabola.
import { canvas, row, slider, readout, text, line } from '../kit.js';
import { f2 } from './_math.js';

export default function (host) {
  let b = 4, x = 3, st = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 260, label: 'Areas showing how a square is completed' });
  const c = row(host);
  slider(c, { label: 'b', min: 1, max: 8, step: 0.5, value: b, fmt: (v) => f2(v, 1), oninput: (v) => { b = v; cv.redraw(); show(); } });
  slider(c, { label: 'x (side)', min: 1, max: 6, step: 0.5, value: x, fmt: (v) => f2(v, 1), oninput: (v) => { x = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => { out.innerHTML = `x² + bx = ${f2(x * x)} + ${f2(b * x)} = <b>${f2(x * x + b * x)}</b>. Add (b/2)² = ${f2((b / 2) ** 2)} to get (x + b/2)² = (${f2(x + b / 2)})² = <b>${f2((x + b / 2) ** 2)}</b>. So x² + bx = (x + b/2)² − (b/2)², and the lowest value of x² + bx is −(b/2)² = ${f2(-((b / 2) ** 2))} at x = −b/2.`; };
  cv.draw = (ctx, w, h, col) => {
    const tot = x + b, s = Math.min((w - 30) / (tot + 1), (h - 70) / (tot + 0.5)), ox = (w - (x + b) * s) / 2, oy = 34, hb = b / 2;
    const rect = (X, Y, W, H, c2, lab, a = 0.55) => { ctx.globalAlpha = a; ctx.fillStyle = c2; ctx.fillRect(ox + X * s, oy + Y * s, W * s, H * s); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.2; ctx.strokeRect(ox + X * s, oy + Y * s, W * s, H * s); if (lab) text(ctx, lab, ox + (X + W / 2) * s, oy + (Y + H / 2) * s, { color: col.ink, size: 11, weight: 700, align: 'center' }); };
    // step 0: x² and one strip b × x (cut in two halves, laid beside); 1: halves go right and below; 2+: corner added
    rect(0, 0, x, x, col.s[0], 'x²');
    if (st === 0) { rect(x, 0, b, x, col.s[1], 'bx'); }
    else { rect(x, 0, hb, x, col.s[1], 'b/2 · x'); rect(0, x, x, hb, col.s[1], 'b/2 · x'); }
    if (st >= 2) rect(x, x, hb, hb, col.s[2], '(b/2)²', 0.7); else if (st === 1) { ctx.setLineDash([4, 4]); ctx.strokeStyle = col.muted; ctx.strokeRect(ox + x * s, oy + x * s, hb * s, hb * s); ctx.setLineDash([]); text(ctx, 'missing corner', ox + (x + hb) * s, oy + (x + hb) * s + 12, { color: col.muted, size: 10, align: 'center' }); }
    const msg = ['x² plus a strip of area bx', 'cut the strip in half and wrap it round two sides', 'add the missing corner (b/2)²', 'now a perfect square: (x + b/2)²'][st];
    text(ctx, `Step ${st + 1}: ${msg}`, 10, 14, { color: col.ink, size: 12, weight: 700 });
    if (st >= 3) { ctx.strokeStyle = col.s[3]; ctx.lineWidth = 3; ctx.strokeRect(ox, oy, (x + hb) * s, (x + hb) * s); }
  };
  show();
  return { step(i) { st = Math.min(3, Math.max(0, i)); cv.redraw(); } };
}
