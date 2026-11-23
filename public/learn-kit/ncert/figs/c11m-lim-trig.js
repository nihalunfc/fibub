// Class 11 Maths, Limits and Derivatives: lim sin x / x = 1 (x in radians). On the unit circle, for 0 < x < pi/2: sin x < x < tan x (the triangle inside the sector inside the bigger triangle).
// Dividing by sin x gives 1 < x/sin x < 1/cos x, and as x -> 0, cos x -> 1, so x/sin x is squeezed to 1. Slide x towards 0 and watch the three lengths merge.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let x = 1.0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 310, label: 'A unit circle with the lengths sin x, x and tan x for a small angle x' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'angle x (radians)', min: 0.02, max: 1.5, step: 0.01, value: x, fmt: (v) => v.toFixed(2), oninput: (v) => { x = v; cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Squeeze: sin x < x < tan x', col), R = Math.min((w - 70) / 2, (h - top - 60) / 1.6), ox = 24 + 0 * w, oy = h - 52 - 0;
    const X0 = ox + 14, Y0 = h - 40, px = (c) => X0 + R * c * 1.0, py = (s) => Y0 - R * s;
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X0 - 8, Y0); ctx.lineTo(w - 8, Y0); ctx.moveTo(X0, Y0 + 8); ctx.lineTo(X0, top + 4); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.arc(X0, Y0, R, 0, -Math.PI / 2, true); ctx.stroke(); ctx.restore();
    const c = Math.cos(x), s = Math.sin(x), t = Math.tan(x);
    ctx.save(); ctx.globalAlpha = 0.14; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(X0, Y0); ctx.arc(X0, Y0, R, 0, -x, true); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(X0, Y0, R, 0, -x, true); ctx.stroke(); ctx.restore();
    line(ctx, [[X0, Y0], [px(1), py(t)]], col.muted, 1.4, [4, 3]);
    line(ctx, [[px(1), Y0], [px(1), py(t)]], col.s[3], 3.5);
    line(ctx, [[px(c), Y0], [px(c), py(s)]], col.s[1], 3.5);
    line(ctx, [[X0, Y0], [px(c), py(s)]], col.ink, 1.6);
    dot(ctx, px(c), py(s), 5, col.ink); dot(ctx, px(1), Y0, 3, col.ink);
    text(ctx, 'tan x', px(1) + 6, py(t / 2), { color: col.s[3], size: 12, weight: 800, halo: col.panel });
    text(ctx, 'sin x', px(c) - 6, py(s / 2), { color: col.s[1], size: 12, weight: 800, align: 'right', halo: col.panel });
    text(ctx, 'x (arc)', px(Math.cos(x / 2)) + 8, py(Math.sin(x / 2)) - 10, { color: col.s[2], size: 12, weight: 800, halo: col.panel });
    ro.innerHTML = `sin x = <b>${s.toFixed(5)}</b>, x = <b>${x.toFixed(5)}</b>, tan x = <b>${t.toFixed(5)}</b>. So sin x < x < tan x, and <b>sin x / x = ${(s / x).toFixed(5)}</b>${x < 0.15 ? ': almost exactly 1.' : '. Slide x towards 0.'}`;
  };
  cv.redraw();
}
