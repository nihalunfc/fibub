// Class 10 Surface Areas and Volumes: the slant height of a cone. The height h, the radius r and the slant height l form a right
// triangle, so l = √(r² + h²). Use l (not h) in the curved surface area πrl. Slide r and h.
import { canvas, text, title, line, row, slider, readout } from '../../kit.js';

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
  let r = 3, h = 4;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A cone with its height, radius and slant height forming a right triangle' });
  const ctl = row(host);
  slider(ctl, { label: 'Radius r', min: 1, max: 6, step: 0.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  slider(ctl, { label: 'Height h', min: 1, max: 8, step: 0.5, value: h, fmt: (v) => v + ' cm', oninput: (v) => { h = v; say(); } });
  const out = readout(host);
  function say() { const l = Math.hypot(r, h); out.innerHTML = `l² = r² + h² = ${r * r} + ${h * h} = ${r * r + h * h}, so <b>l = ${l.toFixed(2)} cm</b>. Curved surface πrl = <b>${(PI * r * l).toFixed(1)} cm²</b>; total πr(r + l) = <b>${(PI * r * (r + l)).toFixed(1)} cm²</b>; volume ⅓πr²h = <b>${(PI * r * r * h / 3).toFixed(1)} cm³</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, 'Slant height l = √(r² + h²)', col);
    const k = Math.min((w - 60) / (2 * r), (hh - 80) / (h + r * T)), cx = w / 2, yb = hh - 34 - r * T * k;
    cone(ctx, col, cx, yb, r * k, h * k, col.s[0], 0.4);
    ctx.beginPath(); ctx.moveTo(cx, yb - h * k); ctx.lineTo(cx, yb); ctx.lineTo(cx + r * k, yb); ctx.closePath(); fillA(ctx, col.s[2], 0.5); strk(ctx, col.s[2], 2.2);
    line(ctx, [[cx, yb - h * k], [cx + r * k, yb]], col.s[3], 3.5);
    const m = 9; line(ctx, [[cx, yb - m], [cx + m, yb - m], [cx + m, yb]], col.ink, 1.3);
    text(ctx, 'h', cx - 8, yb - (h * k) / 2, { color: col.ink, size: 13, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'r', cx + (r * k) / 2, yb + 13, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
    text(ctx, 'l', cx + (r * k) / 2 + 12, yb - (h * k) / 2 - 4, { color: col.s[3], size: 14, weight: 700, halo: col.panel });
  };
  say();
}
