// Class 10 Surface Areas and Volumes (step player): a solid cylinder with a hemispherical hollow scooped out of the top, like a
// wooden pen stand (cross-section view). r = 3 cm, h = 8 cm. Outside: curved side 2πrh = 48π and base πr² = 9π. The top circle is
// completely removed by the hollow (nothing left), and the inside bowl adds 2πr² = 18π. Total surface = 75π ≈ 235.5 cm².
// Volume = πr²h − ⅔πr³ = 72π − 18π = 54π ≈ 169.6 cm³.
import { canvas, text, title, line } from '../../kit.js';

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
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'A cross-section of a cylinder with a hemispherical hollow scooped from the top' });
  const CAP = ['A solid wooden cylinder, r = 3 cm, height 8 cm (cross-section)', 'Scoop out a hemispherical hollow of radius 3 cm from the top', 'Outside surfaces: curved side 2πrh = 48π and the bottom πr² = 9π', 'The top face is gone: the hollow is as wide as the whole top, so no flat ring is left', 'The inside bowl is now a surface: 2πr² = 18π', 'Total surface = 48π + 9π + 18π = 75π ≈ 235.5 cm²', 'Volume = whole cylinder − hollow = 72π − 18π = 54π ≈ 169.6 cm³'];
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Cylinder with a hemispherical hollow', col);
    const k = Math.min((w - 90) / 6, (h - 110) / 8), r = 3 * k, H = 8 * k, cx = w / 2, yb = h - 52, yt = yb - H;
    ctx.beginPath(); ctx.rect(cx - r, yt, 2 * r, H); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; strk(ctx, col.ink, 2);
    if (step >= 1) { ctx.beginPath(); ctx.moveTo(cx - r, yt); ctx.arc(cx, yt, r, PI, 0, true); ctx.closePath(); ctx.fillStyle = col.panel; ctx.fill(); strk(ctx, step >= 4 ? col.s[3] : col.ink, step >= 4 ? 4 : 2); }
    if (step === 1) { ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(cx, yt, r, PI, 0, true); ctx.strokeStyle = col.muted; ctx.stroke(); ctx.setLineDash([]); }
    if (step >= 2 && step <= 5) { line(ctx, [[cx - r, yt], [cx - r, yb]], col.s[0], 5); line(ctx, [[cx + r, yt], [cx + r, yb]], col.s[0], 5); line(ctx, [[cx - r, yb], [cx + r, yb]], col.s[1], 5); }
    if (step === 3) { line(ctx, [[cx - r, yt], [cx + r, yt]], col.bad, 3, [5, 4]); text(ctx, 'no top face left', cx, yt - 12, { color: col.bad, size: 11.5, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'r = 3', cx, yt + 12 + (step >= 1 ? 0 : 0), { color: col.muted, size: 11, align: 'center' }); text(ctx, 'h = 8', cx + r + 6, yb - H / 2, { color: col.muted, size: 11 });
    if (step >= 2) text(ctx, step === 2 ? '48π + 9π' : step === 3 ? 'top: 0' : step === 4 ? 'bowl: 18π' : step === 5 ? '75π cm²' : '54π cm³', cx, h - 36, { color: col.ink, size: 14, weight: 700, align: 'center', halo: col.panel });
    text(ctx, CAP[step], w / 2, h - 14, { color: col.muted, size: 9.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(6, i); cv.redraw(); } };
}
