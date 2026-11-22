// Class 10 Surface Areas and Volumes: a cone, a hemisphere and a cylinder with the same radius r and (for the cone and
// cylinder) height r. Volumes: cone ⅓πr³, hemisphere ⅔πr³, cylinder πr³. So 2 cones of water fill the hemisphere and
// 3 cones fill the cylinder: the volumes are in the ratio 1 : 2 : 3. Pour and see.
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
  let target = 'hem', n = 1, dir = 1;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Cones of water poured into a hemisphere or a cylinder of the same radius, filling it after 2 and 3 cones' });
  const ctl = row(host);
  choice(ctl, 'Pour into', [['hem', 'Hemisphere'], ['cyl', 'Cylinder']], 'hem', (v) => { target = v; n = Math.min(n, v === 'hem' ? 2 : 3); sn.set(n); say(); });
  const sn = slider(ctl, { label: 'Cones poured', min: 0, max: 3, step: 0.05, value: n, fmt: (v) => v.toFixed(1), oninput: (v) => { n = v; anim.pause(); say(); } });
  const anim = loop(host, (dt) => { const mx = target === 'hem' ? 2 : 3; n += dir * dt * 0.5; if (n > mx) { n = mx; dir = -1; } if (n < 0) { n = 0; dir = 1; } sn.set(n); say(); }, { autoplay: false });
  anim.button(ctl);
  const out = readout(host);
  const frac = () => Math.min(1, n / (target === 'hem' ? 2 : 3));
  function say() { const mx = target === 'hem' ? 2 : 3; out.innerHTML = frac() >= 0.999 ? `${mx} cones of water fill the ${target === 'hem' ? 'hemisphere: 2 × ⅓πr³ = <b>⅔πr³</b>' : 'cylinder: 3 × ⅓πr³ = <b>πr³</b>'}. Exactly full, so its volume is ${mx} times the cone's.` : `${n.toFixed(1)} cone(s) of water poured so far. The ${target === 'hem' ? 'hemisphere' : 'cylinder'} is ${Math.round(frac() * 100)}% full.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Cone : hemisphere : cylinder = 1 : 2 : 3', col);
    const r = Math.min(w * 0.17, (h - 100) / 2.4), yb = h - 34, cx1 = w * 0.25, cx2 = w * 0.68;
    // the cone as a measuring cup (point down), it is full all the time
    const ry = r * T, yt = yb - r;
    ctx.beginPath(); ctx.moveTo(cx1 - r, yt); ctx.lineTo(cx1, yb); ctx.lineTo(cx1 + r, yt); ctx.closePath(); fillA(ctx, col.s[2], 0.55); strk(ctx, col.ink, 2);
    ctx.beginPath(); ctx.ellipse(cx1, yt, r, ry, 0, 0, 2 * PI); fillA(ctx, col.s[2], 0.35); strk(ctx, col.ink, 1.5);
    text(ctx, 'cone: ⅓πr³', cx1, yb + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'r', cx1 + r + 8, yt, { color: col.muted, size: 11 }); text(ctx, 'h = r', cx1 + r * 0.5 + 8, yb - r * 0.5, { color: col.muted, size: 11 });
    const f = frac();
    if (target === 'cyl') {
      const top = yb - r - (r * T) * 0, hh = r; ctx.beginPath(); ctx.rect(cx2 - r, yb - hh, 2 * r, hh * f); void top;
      ctx.beginPath(); ctx.rect(cx2 - r, yb - hh * f, 2 * r, hh * f); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.rect(cx2 - r, yb - hh, 2 * r, hh); strk(ctx, col.ink, 2); text(ctx, 'cylinder: πr³', cx2, yb + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    } else {
      // water depth d in a bowl: V(d) = π(r d² − d³/3); find d by bisection for the target fraction of 2/3 π r³
      const Vt = (2 / 3) * f; let lo = 0, hi = 1; for (let i = 0; i < 30; i++) { const d = (lo + hi) / 2; (d * d - (d ** 3) / 3 < Vt ? (lo = d) : (hi = d)); } const d = (lo + hi) / 2 * r, yt2 = yb - r;
      ctx.save(); ctx.beginPath(); ctx.moveTo(cx2 - r, yt2); ctx.arc(cx2, yt2, r, PI, 0, true); ctx.closePath(); ctx.clip(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(cx2 - r, yb - d, 2 * r, d); ctx.restore(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(cx2, yt2, r, PI, 0, true); ctx.closePath(); strk(ctx, col.ink, 2); text(ctx, 'hemisphere: ⅔πr³', cx2, yb + 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    }
    text(ctx, n >= 0.05 ? '→' : '', (cx1 + cx2) / 2, yb - r, { color: col.s[0], size: 22, weight: 700, align: 'center' });
  };
  say();
}
