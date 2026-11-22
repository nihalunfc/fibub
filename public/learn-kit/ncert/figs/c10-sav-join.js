// Class 10 Surface Areas and Volumes: when two solids are joined, the faces where they touch disappear. Slide "Join" from
// apart (0) to joined (1). Cone on hemisphere (r = 3, h = 4): separate pieces have TSA 24π + 27π = 51π; joining hides the cone's base
// and the hemisphere's flat face (2 × 9π = 18π), so the toy's surface is 33π. Cylinder + hemisphere (r = 3, h = 4): 42π + 27π − 18π = 51π.
import { canvas, text, title, row, slider, choice, readout, loop } from '../../kit.js';

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
  let kind = 'cone', j = 0, dir = 1;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Two solids moving together, with the touching faces that disappear highlighted' });
  const ctl = row(host);
  choice(ctl, 'Combine', [['cone', 'Cone on hemisphere'], ['cyl', 'Cylinder on hemisphere']], 'cone', (v) => { kind = v; say(); });
  const sj = slider(ctl, { label: 'Join', min: 0, max: 1, step: 0.02, value: j, fmt: (v) => (v > 0.98 ? 'joined' : Math.round(v * 100) + '%'), oninput: (v) => { j = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { j += dir * dt * 0.4; if (j > 1) { j = 1; dir = -1; } if (j < 0) { j = 0; dir = 1; } sj.set(j); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  function say() {
    const a = kind === 'cone' ? 24 : 42; // top solid's total surface in units of π (r = 3, h = 4)
    out.innerHTML = j > 0.98 ? `Joined: ${a}π + 27π − 18π = <b>${a + 9}π ≈ ${((a + 9) * PI).toFixed(1)} cm²</b>. Two circles of area 9π each are now inside, hidden. Only the outside is painted.` : `Apart: ${kind === 'cone' ? 'cone 24π' : 'cylinder 42π'} + hemisphere 27π = ${a + 27}π. The two <b>touching circles</b> (shaded) count here but vanish when joined: −18π.`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Hidden surfaces when solids join', col);
    const r = Math.min(w * 0.2, 56), hh = kind === 'cone' ? 1.33 * r : 1.33 * r, gap = (1 - j) * 52, cx = w / 2, yt = h - 34 - r - 6;
    const topH = hh;
    bowl(ctx, col, cx, yt, r, col.s[0], j < 0.98 ? col.s[3] : null);
    if (kind === 'cone') cone(ctx, col, cx, yt - gap, r, topH, col.s[1]); else cyl(ctx, col, cx, yt - gap, r, topH, col.s[1], null);
    if (j < 0.98) { ctx.beginPath(); ctx.ellipse(cx, yt - gap, r, r * T, 0, 0, 2 * PI); fillA(ctx, col.s[3], 0.6); strk(ctx, col.ink, 1.5); text(ctx, 'hidden when joined', cx + r + 8, yt - gap / 2, { color: col.s[3], size: 11, weight: 700, halo: col.panel }); }
    if (kind === 'cyl') { ctx.beginPath(); ctx.ellipse(cx, yt - gap - topH, r, r * T, 0, 0, 2 * PI); fillA(ctx, col.s[1], 0.3); strk(ctx, col.ink, 1.5); }
    text(ctx, kind === 'cone' ? 'cone' : 'cylinder (open top)', cx - r - 8, yt - gap - topH * 0.5, { color: col.s[1], size: 11.5, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'hemisphere', cx - r - 8, yt + r * 0.6, { color: col.s[0], size: 11.5, weight: 700, align: 'right', halo: col.panel });
  };
  say();
}
