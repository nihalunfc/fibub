// Torque on a wrench (or a door, seen from above): τ = r F sin α = F × (lever arm). Slide the point where you push and
// the angle of the push; the dashed line is the lever arm, the perpendicular distance from the pivot to the line of
// the force. Press play: α_angular = τ/I spins it up. Try pushing along the handle (α = 0°): no torque at all.
import { canvas, text, row, slider, readout, loop, button, line, arrow } from '../kit.js';

export default function (host) {
  let th = 0, w = 0;
  const cv = canvas(host, { aspect: 0.8, max: 380, min: 270, label: 'A bar pivoted at one end with a force applied at a chosen point and angle' });
  const c1 = row(host);
  const sr = slider(c1, { label: 'Push at r', min: 0.1, max: 1, step: 0.05, value: 0.8, fmt: (v) => v.toFixed(2) + ' m', oninput: reset });
  const sa = slider(c1, { label: 'Force angle α', min: 0, max: 180, step: 5, value: 90, fmt: (v) => v + '°', oninput: reset });
  const sf = slider(c1, { label: 'Force F', min: 5, max: 40, step: 1, value: 20, fmt: (v) => v + ' N', oninput: reset });
  const anim = loop(host, (dt) => { const tq = torque(), I = 1; w += (tq / I) * dt; th += w * dt; if (Math.abs(th) > 12) reset(); cv.redraw(); }, { autoplay: false });
  anim.button(c1); button(c1, 'Reset', reset);
  const out = readout(host);
  const torque = () => sr.value * sf.value * Math.sin((sa.value * Math.PI) / 180);
  function reset() { th = 0; w = 0; cv.redraw(); show(); }
  function show() {
    const r = sr.value, F = sf.value, a = (sa.value * Math.PI) / 180, arm = r * Math.sin(a);
    out.innerHTML = `Lever arm = r sin α = ${arm.toFixed(3)} m. Torque τ = F × lever arm = ${F} × ${arm.toFixed(3)} = <b>${(F * arm).toFixed(2)} N m</b>${F * arm > 0.001 ? ' (anticlockwise, out of the page)' : ' (zero: the line of force passes through the pivot)'}. For a bar with I = 1 kg m², α = τ/I = ${(F * arm).toFixed(2)} rad/s². Same torque from a small force far out or a large force near the pivot: r × F is what counts.`;
  }
  cv.draw = (ctx, W, H, col) => {
    const px = W * 0.14, py = H * 0.62, L = (W - px - 20) / 1.1, k = L, r = sr.value, a = (sa.value * Math.PI) / 180;
    const ux = Math.cos(-th), uy = Math.sin(-th); // bar direction (screen y down)
    const P = (s) => [px + ux * s * k, py + uy * s * k];
    ctx.lineCap = 'round'; line(ctx, [P(0), P(1.05)], col.s[7] || col.muted, 12);
    line(ctx, [P(0), P(1.05)], col.line, 8);
    ctx.beginPath(); ctx.arc(px, py, 8, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    const q = P(r), F = sf.value, s = 3.2;
    // force direction: angle a measured from the bar direction, anticlockwise on screen
    const fd = [Math.cos(-th - a), Math.sin(-th - a)], tip = [q[0] + fd[0] * F * s, q[1] + fd[1] * F * s];
    // lever arm: from pivot perpendicular to the line of force
    const t0 = [-fd[0], -fd[1]], pq = [px - q[0], py - q[1]], dd = pq[0] * fd[0] + pq[1] * fd[1], foot = [q[0] + fd[0] * dd, q[1] + fd[1] * dd];
    ctx.save(); ctx.setLineDash([4, 4]); line(ctx, [[q[0] - fd[0] * 120, q[1] - fd[1] * 120], [q[0] + fd[0] * 120, q[1] + fd[1] * 120]], col.line, 1); ctx.restore();
    line(ctx, [[px, py], foot], col.s[2], 3);
    text(ctx, 'lever arm', (px + foot[0]) / 2 + 6, (py + foot[1]) / 2 - 8, { color: col.s[2], size: 11, weight: 700 });
    arrow(ctx, q[0], q[1], tip[0], tip[1], col.bad, 3.5);
    text(ctx, 'F', tip[0] + fd[0] * 8, tip[1] + fd[1] * 8 - 4, { color: col.bad, size: 13, weight: 700 });
    ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(px, py, 38, -th - a > -th ? -th : -th - a, -th - a > -th ? -th - a : -th, false); ctx.stroke(); ctx.restore();
    text(ctx, `ω = ${w.toFixed(1)} rad/s`, 10, H - 12, { color: col.muted, size: 11 });
    text(ctx, 'pivot', px, py + 20, { color: col.muted, size: 10, align: 'center' });
  };
  reset();
}
