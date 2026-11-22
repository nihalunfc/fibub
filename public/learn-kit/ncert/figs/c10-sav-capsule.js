// Class 10 Surface Areas and Volumes (step player): a capsule (or gulab jamun): a cylinder with a hemisphere on each end.
// r = 2 cm, total length 9 cm, so the cylinder part is h = 9 − 2r = 5 cm. The two hemispheres make one sphere.
// Surface = 2πrh + 4πr² = 20π + 16π = 36π ≈ 113.1 cm². Volume = πr²h + ⁴⁄₃πr³ = 20π + 32π/3 = 92π/3 ≈ 96.3 cm³.
import { canvas, text, title, line, loop, ease } from '../../kit.js';

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
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A capsule shaped like a cylinder with two hemispherical ends, broken into three pieces' });
  loop(host, (dt) => { if (p !== tp) { p = p < tp ? Math.min(tp, p + dt * 1.2) : Math.max(tp, p - dt * 1.2); cv.redraw(); } });
  const CAP = ['A capsule: a cylinder with a hemisphere at each end. Total length 9 cm, radius 2 cm', 'Total length = h + r + r, so the cylinder part is h = 9 − 2 × 2 = 5 cm (not 9!)', 'Break it into a cylinder and two hemispheres. Two hemispheres make one sphere of radius 2', 'Surface: cylinder side 2πrh = 2π × 2 × 5 = 20π, plus sphere 4πr² = 16π, total 36π ≈ 113.1 cm²', 'Volume: cylinder πr²h = 20π, sphere ⁴⁄₃πr³ = 32π/3', 'Total volume = 20π + 32π/3 = 92π/3 ≈ 96.3 cm³'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Capsule = cylinder + 2 hemispheres', col);
    const k = Math.min((w - 90) / 9, 34), r = 2 * k, hl = 5 * k, cy = h / 2 - 24, e = ease(p), g = e * 22, cx = w / 2;
    const lens = (c, a) => { ctx.fillStyle = c; ctx.globalAlpha = a; ctx.fill(); ctx.globalAlpha = 1; };
    const al = step >= 3 ? 0.7 : 0.55;
    ctx.beginPath(); ctx.rect(cx - hl / 2, cy - r, hl, 2 * r); lens(col.s[0], al); strk(ctx, col.ink, 1.8);
    ctx.beginPath(); ctx.arc(cx - hl / 2 - g, cy, r, PI / 2, 1.5 * PI); lens(col.s[1], al); strk(ctx, col.ink, 1.8);
    ctx.beginPath(); ctx.arc(cx + hl / 2 + g, cy, r, -PI / 2, PI / 2); lens(col.s[1], al); strk(ctx, col.ink, 1.8);
    ctx.setLineDash([3, 3]); line(ctx, [[cx - hl / 2, cy - r], [cx - hl / 2, cy + r]], col.muted, 1.3); line(ctx, [[cx + hl / 2, cy - r], [cx + hl / 2, cy + r]], col.muted, 1.3); ctx.setLineDash([]);
    if (step >= 1) { const yy = cy + r + 20; line(ctx, [[cx - hl / 2 - r - g, yy], [cx + hl / 2 + r + g, yy]], col.muted, 1.5); text(ctx, step === 1 ? 'total 9 cm = r + h + r' : 'h = 5 cm', cx, yy + 13, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); }
    if (step >= 2) { text(ctx, 'hemisphere', cx - hl / 2 - r * 0.2 - g, cy - r - 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'hemisphere', cx + hl / 2 + r * 0.2 + g, cy - r - 12, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, 'cylinder h = 5', cx, cy, { color: col.panel, size: 12, weight: 700, align: 'center' }); }
    if (step === 3) text(ctx, '20π + 16π = 36π', cx, h - 40, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    if (step >= 4) text(ctx, step === 4 ? '20π + 32π/3' : '= 92π/3', cx, h - 40, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); tp = step >= 2 ? 1 : 0; cv.redraw(); } };
}
