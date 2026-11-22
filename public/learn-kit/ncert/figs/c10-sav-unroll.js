// Class 10 Surface Areas and Volumes: why the curved surface formulas are what they are. Cut the curved side of a cylinder
// along its height and flatten it: a rectangle 2πr wide and h tall, so CSA = 2πrh. Cut a cone along a slant line and flatten it:
// a sector of radius l (the slant height) with arc 2πr, so CSA = ½ × l × 2πr = πrl.
import { canvas, text, title, line, row, slider, choice, readout, loop } from '../../kit.js';

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
  let kind = 'cyl', p = 0.6, r = 2, h = 4, dir = 1;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'The curved surface of a cylinder or cone cut open and flattened into a rectangle or a sector' });
  const ctl = row(host);
  choice(ctl, 'Solid', [['cyl', 'Cylinder'], ['cone', 'Cone']], 'cyl', (v) => { kind = v; say(); });
  const sp = slider(ctl, { label: 'Unroll', min: 0, max: 1, step: 0.02, value: p, fmt: (v) => Math.round(v * 100) + '%', oninput: (v) => { p = v; anim.pause(); say(); } });
  slider(ctl, { label: 'Radius r', min: 1, max: 3, step: 0.5, value: r, fmt: (v) => v + ' cm', oninput: (v) => { r = v; say(); } });
  const anim = loop(host, (dt) => { p += dir * dt * 0.4; if (p > 1) { p = 1; dir = -1; } if (p < 0) { p = 0; dir = 1; } sp.set(p); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  function say() { const l = Math.hypot(r, h), P = PI; out.innerHTML = kind === 'cyl' ? `Unrolled: a rectangle <b>2πr = ${(2 * P * r).toFixed(1)}</b> cm by <b>h = ${h}</b> cm. CSA = 2πrh = <b>${(2 * P * r * h).toFixed(1)} cm²</b>.` : `Unrolled: a sector of radius <b>l = ${l.toFixed(2)}</b> cm and arc <b>2πr = ${(2 * P * r).toFixed(1)}</b> cm. CSA = ½ × l × 2πr = πrl = <b>${(P * r * l).toFixed(1)} cm²</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, hh, col) => {
    title(ctx, kind === 'cyl' ? 'Cylinder: curved side → rectangle' : 'Cone: curved side → sector', col);
    const k = Math.min((w * 0.4) / 4.2, (hh - 70) / 5) * (kind === 'cyl' ? 1 : 0.95), cx = w * 0.2, yb = hh - 34, l = Math.hypot(r, h);
    if (kind === 'cyl') { cyl(ctx, col, cx, yb, r * k * 0.8, h * k * 0.8, col.s[0], col.s[1]); line(ctx, [[cx + r * k * 0.8, yb - h * k * 0.8], [cx + r * k * 0.8, yb]], col.s[3], 3); }
    else { cone(ctx, col, cx, yb, r * k * 0.8, h * k * 0.8, col.s[0]); line(ctx, [[cx, yb - h * k * 0.8], [cx + r * k * 0.8, yb]], col.s[3], 3); }
    const ox = w * 0.4, W = 2 * PI * r, e = p;
    if (kind === 'cyl') {
      const rw = (W * k * 0.8) * e, rh = h * k * 0.8; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(ox, yb - rh, rw, rh); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(ox, yb - rh, rw, rh);
      if (e > 0.5) { text(ctx, '2πr', ox + rw / 2, yb + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'h', ox - 6, yb - rh / 2, { color: col.ink, size: 12, weight: 700, align: 'right' }); }
    } else {
      const R = l * k * 0.95, full = W / l, ang = full * e, ax = ox + 4, ay = yb - 4, a0 = -ang / 2 - PI / 2 + 0; ctx.beginPath(); ctx.moveTo(ox + (w - ox) / 2, yb - 2); const X = ox + (w - ox) / 2, Y = yb - 2; ctx.moveTo(X, Y); ctx.arc(X, Y, R, -PI / 2 - ang / 2, -PI / 2 + ang / 2); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; strk(ctx, col.ink, 2); void ax; void ay; void a0;
      if (e > 0.5) { text(ctx, 'l = ' + l.toFixed(1), X - R * 0.18, Y - R * 0.5, { color: col.ink, size: 12, weight: 700, align: 'right', halo: col.panel }); text(ctx, 'arc = 2πr', X, Y - R - 6, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel }); }
    }
    text(ctx, 'cut here', cx + r * k * 0.8 + 8, yb - h * k * 0.4, { color: col.s[3], size: 11, weight: 700 });
  };
  say();
}
