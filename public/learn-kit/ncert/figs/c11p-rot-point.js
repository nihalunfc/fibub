// Class 11 Rotational Motion: rotational kinematics. A point at distance r on a wheel with angular speed w and angular acceleration alpha has speed v = w r (along the tangent),
// tangential acceleration a_t = alpha r (along the tangent) and centripetal acceleration a_c = w^2 r (towards the centre). w = w0 + alpha t, theta = w0 t + 1/2 alpha t^2.
import { canvas, line, text, title, dot, arrow, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let w0 = 2, al = 1, r = 1, t = 0, th = 0, om = 2;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A rotating wheel with arrows for the velocity, tangential and centripetal acceleration of a point on it' });
  const ctl = row(host);
  slider(ctl, { label: 'Starting speed ω₀', min: 0, max: 6, step: 0.5, value: 2, fmt: (v) => v + ' rad/s', oninput: (v) => { w0 = v; t = 0; th = 0; om = v; } });
  slider(ctl, { label: 'Angular acceleration α', min: 0, max: 2, step: 0.25, value: 1, fmt: (v) => v + ' rad/s²', oninput: (v) => { al = v; t = 0; th = 0; om = w0; } });
  slider(ctl, { label: 'Distance of the point from the axis', min: 0.3, max: 1, step: 0.1, value: 1, fmt: (v) => v.toFixed(1) + ' m', oninput: (v) => { r = v; } });
  const b2 = row(host); const lp = loop(host, (dt) => { t += dt; om = w0 + al * t; th += om * dt; if (t > 4) { t = 0; th = 0; om = w0; } cv.redraw(); }); lp.button(b2);
  const ro = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'v = ωr, a_t = αr, a_c = ω²r', col), cx = w / 2, cy = top + (h - top) / 2 + 2, R0 = Math.min(w, h - top) * 0.3, rr = R0 * r;
    ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 6.3); ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 6.3); ctx.setLineDash([3, 4]); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    for (let k = 0; k < 4; k++) line(ctx, [[cx, cy], [cx + R0 * Math.cos(th + k * Math.PI / 2), cy + R0 * Math.sin(th + k * Math.PI / 2)]], col.line, 1);
    const sx = cx + rr * Math.cos(th), sy = cy - rr * Math.sin(th);
    const tx = -Math.sin(th), ty = -Math.cos(th), nx = -Math.cos(th), ny = Math.sin(th);
    const v = om * r, at = al * r, ac = om * om * r, kv = 16, kt = 30, kc = 5;
    line(ctx, [[cx, cy], [sx, sy]], col.ink, 2); dot(ctx, cx, cy, 4, col.ink);
    const lv = Math.min(100, v * kv), la = Math.min(90, at * kt), lc = Math.min(110, ac * kc);
    arrow(ctx, sx, sy, sx + tx * lv, sy + ty * lv, col.s[0], 3);
    if (la > 3) arrow(ctx, sx, sy, sx + tx * la + nx * 0, sy + ty * la, col.s[3], 2);
    arrow(ctx, sx, sy, sx + nx * lc, sy + ny * lc, col.s[1], 2.5);
    dot(ctx, sx, sy, 7, col.s[2], col.panel);
    ctx.fillStyle = col.s[0]; ctx.fillRect(10, h - 22, 10, 10); text(ctx, 'v', 24, h - 17, { color: col.ink, size: 11 });
    ctx.fillStyle = col.s[3]; ctx.fillRect(48, h - 22, 10, 10); text(ctx, 'a_t', 62, h - 17, { color: col.ink, size: 11 });
    ctx.fillStyle = col.s[1]; ctx.fillRect(92, h - 22, 10, 10); text(ctx, 'a_c (to the centre)', 106, h - 17, { color: col.ink, size: 11 });
    ro.textContent = `t = ${t.toFixed(1)} s: ω = ${om.toFixed(2)} rad/s, angle turned θ = ${(th / (2 * Math.PI)).toFixed(2)} turns. Point at r = ${r.toFixed(1)} m: speed v = ωr = ${v.toFixed(2)} m/s (blue), tangential acceleration αr = ${at.toFixed(2)} m/s², centripetal ω²r = ${ac.toFixed(2)} m/s² (towards the axis). A point twice as far out goes twice as fast.`;
  };
  cv.redraw();
}
