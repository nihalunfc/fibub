// Work of a pull at an angle: W = F d cos φ. Pull a crate along a rough floor with a rope; only the part of the pull
// along the floor does work, while the upward part lightens the crate and cuts friction. Slide the angle: the graph
// shows the net push along the floor, best when tan φ = μ. Try μ = 0 (best angle 0°) and μ = 0.6 (best about 31°).
import { canvas, text, row, slider, readout, loop, button, line, arrow } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let t = 0;
  const m = 10, F = 50, d = 10;
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 290, label: 'A crate pulled by a rope at an angle, and a graph of the net push against angle' });
  const c1 = row(host);
  const sp = slider(c1, { label: 'Rope angle φ', min: 0, max: 80, step: 1, value: 30, fmt: (v) => v + '°', oninput: () => { t = 0; show(); } });
  const sm = slider(c1, { label: 'μ (floor)', min: 0, max: 0.8, step: 0.05, value: 0.3, fmt: (v) => v.toFixed(2), oninput: () => { t = 0; show(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > 3) t = 0; cv.redraw(); });
  anim.button(c1);
  const out = readout(host);
  const rad = (v) => (v * Math.PI) / 180;
  const net = (phi, mu) => { const N = Math.max(0, m * G - F * Math.sin(rad(phi))); return F * Math.cos(rad(phi)) - mu * N; };
  function show() {
    const phi = sp.value, mu = sm.value, N = Math.max(0, m * G - F * Math.sin(rad(phi))), W = F * Math.cos(rad(phi)) * d;
    out.innerHTML = `F = 50 N, d = 10 m. Work by the rope W = F d cos φ = <b>${W.toFixed(0)} J</b>. Normal force N = mg − F sin φ = ${N.toFixed(1)} N, friction μN = ${(mu * N).toFixed(1)} N, so friction does ${(-mu * N * d).toFixed(0)} J and the net work ${(net(phi, mu) * d).toFixed(0)} J (the crate's gain in kinetic energy). Best angle: ${((Math.atan(mu) * 180) / Math.PI).toFixed(0)}°.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const phi = sp.value, mu = sm.value, split = h * 0.5, gy = split - 26, k = (w - 90) / d;
    const a = Math.max(0, net(phi, mu)) / m, x = 30 + Math.min(d, 0.5 * a * Math.min(t, 3) ** 2 * 1.2) * k * 0.9;
    line(ctx, [[0, gy], [w, gy]], col.muted, 3);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x, gy - 30, 54, 30); ctx.globalAlpha = 1;
    const fx = F * Math.cos(rad(phi)), fy = F * Math.sin(rad(phi)), s = 0.9, ox = x + 54, oy = gy - 22;
    arrow(ctx, ox, oy, ox + fx * s, oy - fy * s, col.bad, 3);
    text(ctx, 'F', ox + fx * s + 4, oy - fy * s - 6, { color: col.bad, size: 12, weight: 700 });
    ctx.save(); ctx.setLineDash([4, 3]); line(ctx, [[ox, oy], [ox + fx * s, oy]], col.s[2], 2); line(ctx, [[ox + fx * s, oy], [ox + fx * s, oy - fy * s]], col.s[1], 2); ctx.restore();
    text(ctx, `F cos φ = ${fx.toFixed(0)}`, Math.max(60, ox + fx * s / 2), oy + 14, { color: col.s[2], size: 10, align: 'center' });
    text(ctx, `F sin φ = ${fy.toFixed(0)}`, ox + fx * s + 4, oy - fy * s / 2, { color: col.s[1], size: 10 });
    // graph
    const gx0 = 44, gx1 = w - 14, gy0 = split + 24, gy1 = h - 24, ymax = 50;
    const X = (p) => gx0 + (p / 85) * (gx1 - gx0), Y = (v) => gy1 - ((v + 10) / (ymax + 10)) * (gy1 - gy0);
    line(ctx, [[gx0, Y(0)], [gx1, Y(0)]], col.muted, 1); line(ctx, [[gx0, gy0], [gx0, gy1]], col.muted, 1);
    const pts = []; for (let p = 0; p <= 85; p += 1) pts.push([X(p), Y(net(p, mu))]);
    line(ctx, pts, col.s[0], 2.5);
    ctx.beginPath(); ctx.arc(X(phi), Y(net(phi, mu)), 6, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
    const best = (Math.atan(mu) * 180) / Math.PI; ctx.beginPath(); ctx.arc(X(best), Y(net(best, mu)), 4, 0, 7); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
    text(ctx, 'net push along floor (N) vs angle φ', gx0, gy0 - 8, { color: col.muted, size: 11 });
    text(ctx, '0°', gx0, gy1 + 12, { color: col.muted, size: 10, align: 'center' }); text(ctx, '80°', X(80), gy1 + 12, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'green ring = best angle', gx1, gy1 - 4, { color: col.s[2], size: 10, align: 'right' });
  };
  show();
}
