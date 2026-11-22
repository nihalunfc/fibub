// Class 10 Surface Areas and Volumes (step player): a toy that is a cone on a hemisphere, r = 3 cm and cone height 4 cm
// (slant height 5 cm). Surface = cone's curved surface πrl = 15π + hemisphere's curved surface 2πr² = 18π, total 33π ≈ 103.6 cm²
// (the cone's base and the hemisphere's flat face are joined and hidden). Volume = ⅓πr²h + ⅔πr³ = 12π + 18π = 30π ≈ 94.2 cm³.
import { canvas, text, title, loop, ease } from '../../kit.js';

const PI = Math.PI, T = 0.3; // T: how much the circles are squashed into ellipses (a view from slightly above)
const fillA = (ctx, c, a = 0.6) => { ctx.globalAlpha = a; ctx.fillStyle = c; ctx.fill(); ctx.globalAlpha = 1; };
const strk = (ctx, c, w = 2) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); };
/** Cylinder standing on y = yb: curved side colour `side`, lid colour `top` (null = open top, no lid). */
function cyl(ctx, col, cx, yb, r, h, side, top, a = 0.6) {
  const ry = r * T, yt = yb - h;
  ctx.beginPath(); ctx.moveTo(cx - r, yt); ctx.lineTo(cx - r, yb); ctx.ellipse(cx, yb, r, ry, 0, PI, 0, true); ctx.lineTo(cx + r, yt); ctx.ellipse(cx, yt, r, ry, 0, 0, PI, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  ctx.beginPath(); ctx.ellipse(cx, yt, r, ry, 0, 0, 2 * PI); if (top) fillA(ctx, top, a); strk(ctx, col.ink, 1.8);
}
/** Cone with its base on y = yb. */
function cone(ctx, col, cx, yb, r, h, side, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx, yb - h); ctx.lineTo(cx - r, yb); ctx.ellipse(cx, yb, r, ry, 0, PI, 0, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
}
/** Hemisphere, curved side DOWN, flat face (ellipse, colour `flat`) at y = yt. */
function bowl(ctx, col, cx, yt, r, side, flat, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx - r, yt); ctx.arc(cx, yt, r, PI, 0, true); ctx.ellipse(cx, yt, r, ry, 0, 0, PI, true); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  ctx.beginPath(); ctx.ellipse(cx, yt, r, ry, 0, 0, 2 * PI); if (flat) fillA(ctx, flat, a); strk(ctx, col.ink, 1.8);
}
/** Hemisphere, curved side UP (a dome), flat face at y = yb. */
function dome(ctx, col, cx, yb, r, side, flat, a = 0.6) {
  const ry = r * T;
  ctx.beginPath(); ctx.moveTo(cx - r, yb); ctx.arc(cx, yb, r, PI, 2 * PI); ctx.ellipse(cx, yb, r, ry, 0, 0, PI); ctx.closePath(); fillA(ctx, side, a); strk(ctx, col.ink, 1.8);
  if (flat) { ctx.beginPath(); ctx.ellipse(cx, yb, r, ry, 0, 0, 2 * PI); fillA(ctx, flat, a); strk(ctx, col.ink, 1.8); }
}

export default function (host) {
  let step = 0, p = 0, tp = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A toy made of a cone on a hemisphere, taken apart to find its surface area and volume' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 1.2) : Math.max(tp, p - dt * 1.2); cv.redraw(); } });
  const CAP = ['A toy: a cone sitting on a hemisphere, both of radius 3 cm, cone height 4 cm', 'Take it apart: a cone and a hemisphere', 'Only the outside is painted: cone side + hemisphere side. The joined circles are hidden.', 'Slant height l = √(3² + 4²) = 5. Cone side = πrl = π × 3 × 5 = 15π', 'Hemisphere side = 2πr² = 2π × 9 = 18π, so total surface = 15π + 18π = 33π ≈ 103.6 cm²', 'Volume: cone ⅓πr²h = 12π, hemisphere ⅔πr³ = 18π, total 30π ≈ 94.2 cm³'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Toy = cone + hemisphere', col);
    const r = Math.min(w * 0.2, 54), cx = w / 2, yt = h - 62 - r, e = ease(p), gap = e * 46, ch = 1.33 * r;
    const hl = step === 2 || step === 3 || step === 4;
    bowl(ctx, col, cx, yt, r, col.s[0], step === 1 ? col.s[3] : col.panel, hl || step >= 5 ? 0.7 : 0.55);
    cone(ctx, col, cx, yt - gap, r, ch, col.s[1], hl || step >= 5 ? 0.7 : 0.55);
    if (step === 1) { ctx.beginPath(); ctx.ellipse(cx, yt - gap, r, r * T, 0, 0, 2 * PI); fillA(ctx, col.s[3], 0.5); strk(ctx, col.ink, 1.5); text(ctx, 'joined: hidden', cx + r + 6, yt - gap * 0.5, { color: col.s[3], size: 11, weight: 700, halo: col.panel }); }
    text(ctx, 'cone', cx - r - 8, yt - gap - ch * 0.4, { color: col.s[1], size: 12, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'hemisphere', cx - r - 8, yt + r * 0.6, { color: col.s[0], size: 12, weight: 700, align: 'right', halo: col.panel });
    if (step >= 3 && step <= 4) { text(ctx, step === 3 ? 'l = 5' : '2πr² = 18π', cx + r * 0.6 + 14, step === 3 ? yt - gap - ch * 0.5 : yt + r * 0.5, { color: col.ink, size: 12, weight: 700, halo: col.panel }); }
    if (step >= 3) text(ctx, step === 3 ? '15π' : step === 4 ? '15π + 18π = 33π' : '30π', cx, h - 40, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); tp = step === 0 ? 0 : 1; cv.redraw(); } };
}
