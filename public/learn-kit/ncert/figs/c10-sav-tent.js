// Class 10 Surface Areas and Volumes (step player): a tent that is a cylinder topped by a cone. r = 3 m, wall height 4 m, cone height 4 m
// (slant height 5 m). Canvas needed = cylinder side 2πrh = 24π + cone side πrl = 15π = 39π ≈ 122.5 m² (no floor, and the cone's base
// and cylinder's top are not cloth). Air inside = πr²h + ⅓πr²H = 36π + 12π = 48π ≈ 150.8 m³.
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
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A circus tent made of a cylinder and a cone, with the cloth surfaces highlighted' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 1.2) : Math.max(tp, p - dt * 1.2); cv.redraw(); } });
  const CAP = ['A tent: a cylinder (walls) with a cone (roof). r = 3 m, wall height 4 m, roof height 4 m', 'Split it into the walls and the roof', 'Cloth is needed for the walls: cylinder side 2πrh = 2π × 3 × 4 = 24π m². No floor, no top: the roof covers it.', 'Slant height of the roof l = √(3² + 4²) = 5 m. Roof cloth = πrl = π × 3 × 5 = 15π m²', 'Canvas = 24π + 15π = 39π ≈ 122.5 m² (π = 3.14). At ₹120 per m², that costs about ₹14,700', 'Air inside = cylinder πr²h + cone ⅓πr²H = 36π + 12π = 48π ≈ 150.8 m³'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Tent = cylinder + cone', col);
    const k = Math.min(w * 0.1, (h - 160) / 8), r = 3 * k, wh = 4 * k, ch = 4 * k, cx = w / 2, yb = h - 78, gap = ease(p) * 34;
    const hl = step >= 2;
    cyl(ctx, col, cx, yb, r, wh, col.s[0], null, hl ? 0.7 : 0.55);
    cone(ctx, col, cx, yb - wh - gap, r, ch, col.s[1], step >= 3 ? 0.7 : 0.55);
    ctx.beginPath(); ctx.ellipse(cx, yb, r, r * T, 0, 0, 2 * PI); fillA(ctx, col.line, 0.4); strk(ctx, col.muted, 1.2);
    text(ctx, 'roof (cone)', cx + r + 10, yb - wh - gap - ch * 0.4, { color: col.s[1], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'walls (cylinder)', cx + r + 10, yb - wh * 0.5, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    if (step >= 1) text(ctx, 'floor: no cloth', cx + r + 10, yb + 6, { color: col.muted, size: 10.5 });
    if (step === 3) text(ctx, 'l = 5', cx - r * 0.5 - 8, yb - wh - gap - ch * 0.5, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel });
    if (step >= 2) text(ctx, step === 2 ? '24π' : step === 3 ? '24π + 15π' : step === 4 ? '39π m²' : '48π m³', cx, h - 40, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 9.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); tp = step >= 1 ? 1 : 0; cv.redraw(); } };
}
