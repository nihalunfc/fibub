// Class 10 Circles: a wheel rolling on a straight road. The road touches the wheel at exactly one point, so the road is a
// tangent to the wheel. The spoke to that contact point stays perpendicular to the road all the time, however far it rolls.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let x = 0, rad = 44;
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 220, label: 'A wheel rolling on a road, with the spoke to the contact point always perpendicular to the road' });
  const ctl = row(host);
  slider(ctl, { label: 'Wheel radius', min: 24, max: 70, step: 1, value: rad, fmt: (v) => v + ' px', oninput: (v) => { rad = v; cv.redraw(); } });
  const anim = loop(host, (dt) => { x += dt * 50; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  out.innerHTML = 'The road is a <b>tangent</b> to the wheel. The red spoke goes to the contact point and stays at <b>90°</b> to the road all the way.';
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'A rolling wheel: road = tangent', col);
    const gy = h - 36, cy = gy - rad, span = w + 2 * rad, cx = ((x % span) + span) % span - rad, rot = cx / rad;
    ctx.fillStyle = col.soft; ctx.fillRect(0, gy, w, 26);
    line(ctx, [[0, gy], [w, gy]], col.s[2], 3);
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.stroke();
    for (let i = 0; i < 6; i++) { const t = rot + (i * Math.PI) / 3; line(ctx, [[cx, cy], [cx + Math.cos(t) * rad, cy + Math.sin(t) * rad]], col.line, 1.5); }
    line(ctx, [[cx, cy], [cx, gy]], col.s[3], 3.5); dot(ctx, cx, cy, 4, col.ink); dot(ctx, cx, gy, 5.5, col.s[3], col.panel);
    line(ctx, [[cx - 10, gy - 10], [cx - 10, gy], [cx, gy]].map((p, i) => (i === 0 ? [cx - 10, gy - 10] : i === 1 ? [cx - 10, gy] : [cx, gy])), col.ink, 1.3);
    text(ctx, 'contact point', Math.min(w - 60, Math.max(60, cx)), gy + 16, { color: col.s[3], size: 11, weight: 700, align: 'center' });
  };
  cv.redraw();
}
