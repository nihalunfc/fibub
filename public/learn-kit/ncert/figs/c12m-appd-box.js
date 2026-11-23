// Class 12 Maxima and minima (optimisation): cut a square of side x from each corner of an 18 cm square sheet and fold up the sides to make an open
// box. Base (18 - 2x) by (18 - 2x), height x, so V(x) = x(18 - 2x)^2. V'(x) = 12(x - 3)(x - 9) = 0 gives x = 3 (x = 9 leaves no base), and V'' < 0 there:
// a maximum, V = 432 cm^3. Slide x and see the box and the volume curve together.
import { canvas, text, title, line, dot, axes, row, slider, button, readout } from '../../kit.js';
import { plot } from '../c12m-lib.js';

const V = (x) => x * (18 - 2 * x) ** 2;
export default function (host) {
  let x = 1.5;
  const cv = canvas(host, { aspect: 1.0, max: 450, min: 330, label: 'A square sheet with corners cut out, the box it makes, and the volume plotted against the cut size' });
  const ctl = row(host), out = readout(host);
  const sx = slider(ctl, { label: 'cut x (cm)', min: 0.25, max: 8.75, step: 0.25, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; say(); } });
  button(ctl, 'Find the best x', () => { x = 3; sx.set(3); say(); });
  function say() {
    out.innerHTML = `Cut x = ${x.toFixed(2)} cm: base ${(18 - 2 * x).toFixed(1)} × ${(18 - 2 * x).toFixed(1)}, height ${x.toFixed(2)}. V = x(18 − 2x)² = <b>${V(x).toFixed(1)} cm³</b>. ${Math.abs(x - 3) < 0.01 ? '<b>Maximum: V′ = 12(x − 3)(x − 9) = 0 at x = 3, and V″ = 24x − 144 < 0 there.</b>' : 'Try x = 3.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Open box from a sheet: choose the cut', col);
    const S = Math.min(w * 0.36, 130) / 18, ox = 14, oy = 50;
    ctx.fillStyle = col.soft; ctx.fillRect(ox, oy, 18 * S, 18 * S); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(ox, oy, 18 * S, 18 * S);
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.45;
    for (const [a, b] of [[0, 0], [18 - x, 0], [0, 18 - x], [18 - x, 18 - x]]) ctx.fillRect(ox + a * S, oy + b * S, x * S, x * S);
    ctx.globalAlpha = 1; text(ctx, 'cut out', ox + 9 * S, oy + 9 * S, { color: col.muted, size: 11, align: 'center' });
    // the box, drawn in a simple oblique view
    const bx = ox + 18 * S + 34, bw = (18 - 2 * x) * S * 0.55, bh = x * S, dx = bw * 0.45, dy = -bw * 0.35, by = oy + 14 * S;
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by - bh); ctx.lineTo(bx, by - bh); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw + dx, by + dy); ctx.lineTo(bx + bw + dx, by + dy - bh); ctx.lineTo(bx + bw, by - bh); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by - bh); ctx.lineTo(bx, by - bh); ctx.closePath(); ctx.moveTo(bx + bw, by); ctx.lineTo(bx + bw + dx, by + dy); ctx.lineTo(bx + bw + dx, by + dy - bh); ctx.lineTo(bx + bw, by - bh); ctx.moveTo(bx, by - bh); ctx.lineTo(bx + dx, by - bh + dy); ctx.lineTo(bx + bw + dx, by - bh + dy); ctx.stroke();
    text(ctx, `V = ${V(x).toFixed(0)} cm³`, bx, oy + 18 * S + 2, { color: col.s[0], size: 13, weight: 800 });
    const A = axes(ctx, w, h, col, { x: [0, 9], y: [0, 500], l: 54, r: 14, t: oy + 18 * S + 22, b: 34, xlabel: 'cut x (cm)', ylabel: 'volume (cm³)', xt: [0, 3, 6, 9], yt: [0, 200, 400] });
    plot(ctx, A.X, A.Y, V, 0, 9, col.s[0], 3);
    line(ctx, [[A.X(3), A.Y(0)], [A.X(3), A.Y(432)]], col.line, 1.2, [3, 3]);
    dot(ctx, A.X(3), A.Y(432), 4, col.muted); text(ctx, 'max 432', A.X(3) + 6, A.Y(432) - 8, { color: col.muted, size: 11, weight: 700 });
    dot(ctx, A.X(x), A.Y(V(x)), 6.5, col.s[3], col.ink);
  };
  say();
  // as a step player the figure still has its slider and button; the steps move the cut to 1.5, then 3
  return { step(i) { x = i >= 3 ? 3 : 1.5; sx.set(x); say(); } };
}
