// Class 10 Surface Areas and Volumes: the cuboid. Length l, breadth b, height h. Total surface area TSA = 2(lb + bh + hl),
// lateral (four walls) LSA = 2h(l + b), volume = lbh, and the longest line inside (the space diagonal) = √(l² + b² + h²).
// A cube is the case l = b = h = a (TSA = 6a², V = a³). Choose what to highlight.
import { canvas, text, title, line, row, slider, choice, readout } from '../../kit.js';

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
  let L = 4, B = 3, Hh = 2, mode = 'tsa';
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'A cuboid with sliders for length, breadth and height, highlighting the total surface, the four walls or the space diagonal' });
  const ctl = row(host);
  slider(ctl, { label: 'Length l', min: 1, max: 6, step: 1, value: L, fmt: (v) => v + ' cm', oninput: (v) => { L = v; say(); } });
  slider(ctl, { label: 'Breadth b', min: 1, max: 6, step: 1, value: B, fmt: (v) => v + ' cm', oninput: (v) => { B = v; say(); } });
  slider(ctl, { label: 'Height h', min: 1, max: 6, step: 1, value: Hh, fmt: (v) => v + ' cm', oninput: (v) => { Hh = v; say(); } });
  choice(ctl, 'Show', [['tsa', 'Total surface'], ['lsa', 'Four walls'], ['diag', 'Diagonal']], 'tsa', (v) => { mode = v; say(); });
  const out = readout(host);
  function say() {
    out.innerHTML = { tsa: `TSA = 2(lb + bh + hl) = 2(${L * B} + ${B * Hh} + ${Hh * L}) = <b>${2 * (L * B + B * Hh + Hh * L)} cm²</b> (all six faces). Volume = lbh = <b>${L * B * Hh} cm³</b>.`, lsa: `Lateral surface (the four walls) = 2h(l + b) = 2 × ${Hh} × ${L + B} = <b>${2 * Hh * (L + B)} cm²</b>. The top and bottom are left out, like the walls of a room.`, diag: `Space diagonal = √(l² + b² + h²) = √${L * L + B * B + Hh * Hh} = <b>${Math.sqrt(L * L + B * B + Hh * Hh).toFixed(2)} cm</b>. It is the longest straight line that fits inside.` }[mode]; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Cuboid: l × b × h', col);
    const k = Math.min((w - 70) / (L + B * 0.5), (h - 80) / (Hh + B * 0.35)), dx = B * 0.5 * k, dy = -B * 0.35 * k, x0 = (w - L * k - dx) / 2, y0 = h - 28 - 4;
    const A = [x0, y0], Bp = [x0 + L * k, y0], C = [x0 + L * k, y0 - Hh * k], D = [x0, y0 - Hh * k], sh = (p) => [p[0] + dx, p[1] + dy];
    const poly = (pts, c, a) => { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); fillA(ctx, c, a); strk(ctx, col.ink, 1.8); };
    const top = [D, C, sh(C), sh(D)], right = [Bp, sh(Bp), sh(C), C], front = [A, Bp, C, D];
    const all = mode === 'tsa';
    // hidden edges
    line(ctx, [sh(A), sh(Bp)], col.muted, 1.2, [4, 4]); line(ctx, [sh(A), sh(D)], col.muted, 1.2, [4, 4]); line(ctx, [A, sh(A)], col.muted, 1.2, [4, 4]);
    poly(front, all ? col.s[0] : mode === 'lsa' ? col.s[0] : col.soft, mode === 'diag' ? 0.2 : 0.6);
    poly(right, all ? col.s[1] : mode === 'lsa' ? col.s[1] : col.soft, mode === 'diag' ? 0.2 : 0.6);
    poly(top, all ? col.s[2] : col.soft, all ? 0.6 : 0.3);
    if (all) { text(ctx, 'top + bottom', sh(D)[0] - L * k / 2 + 8, sh(D)[1] + 12 * 0 - 9, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel }); }
    text(ctx, 'l = ' + L, (A[0] + Bp[0]) / 2, A[1] + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); text(ctx, 'h = ' + Hh, A[0] - 6, (A[1] + D[1]) / 2, { color: col.ink, size: 11.5, weight: 700, align: 'right' }); text(ctx, 'b = ' + B, (Bp[0] + sh(Bp)[0]) / 2 + 12, (Bp[1] + sh(Bp)[1]) / 2 + 12, { color: col.ink, size: 11.5, weight: 700 });
    if (mode === 'diag') { line(ctx, [A, sh(C)], col.s[3], 3.5); text(ctx, 'diagonal', (A[0] + sh(C)[0]) / 2 - 24, (A[1] + sh(C)[1]) / 2 - 6, { color: col.s[3], size: 12, weight: 700, halo: col.panel }); }
  };
  say();
}
