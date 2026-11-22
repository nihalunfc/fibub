// Class 10 Areas Related to Circles: a car wiper. The blade runs from distance a to distance b from the pivot, and the arm
// swings through an angle θ. The cleaned patch is part of a ring: area = θ/360 × π(b² − a²), the difference of two sectors
// of the same angle. Slide the sweep angle and the blade, and press Play to watch the glass clear.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let th = 120, a = 10, b = 20, t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'A car wiper swinging through an angle and clearing a ring-shaped patch of the windscreen' });
  const ctl = row(host);
  slider(ctl, { label: 'Sweep angle', min: 30, max: 180, step: 10, value: th, fmt: (v) => v + '°', oninput: (v) => { th = v; say(); } });
  slider(ctl, { label: 'Blade starts at', min: 0, max: 15, step: 5, value: a, fmt: (v) => v + ' cm', oninput: (v) => { a = v; say(); } });
  const anim = loop(host, (dt) => { t = (t + dt * 0.5) % 2; cv.redraw(); });
  anim.button(ctl);
  const out = readout(host);
  function say() { const P = 22 / 7; out.innerHTML = `Area cleaned = ${th}/360 × π × (${b}² − ${a}²) = <b>${(th / 360 * P * (b * b - a * a)).toFixed(1)} cm²</b>. It is a big sector (radius ${b}) minus a small one (radius ${a}).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Wiper: area of a part of a ring', col);
    const k = Math.min((w - 40) / 2.2 / b, (h - 80) / b) * 1.0, cx = w / 2, cy = h - 28, T = (th * Math.PI) / 180, s0 = -Math.PI / 2 - T / 2, s1 = -Math.PI / 2 + T / 2;
    ctx.beginPath(); ctx.arc(cx, cy, b * k, s0, s1); ctx.arc(cx, cy, a * k, s1, s0, true); ctx.closePath(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.35; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke();
    const ph = t < 1 ? t : 2 - t, ang = s0 + (s1 - s0) * ph;
    line(ctx, [[cx + Math.cos(ang) * a * k, cy + Math.sin(ang) * a * k], [cx + Math.cos(ang) * b * k, cy + Math.sin(ang) * b * k]], col.s[3], 5);
    line(ctx, [[cx, cy], [cx + Math.cos(ang) * a * k, cy + Math.sin(ang) * a * k]], col.muted, 2);
    dot(ctx, cx, cy, 5, col.ink); text(ctx, 'pivot', cx + 10, cy - 8, { color: col.muted, size: 11 });
    text(ctx, `θ = ${th}°`, cx, cy - (a * k + b * k) / 2 * 0.35 - 2, { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    text(ctx, `b = ${b}`, cx + Math.cos(s1) * b * k * 0.55 + 14, cy + Math.sin(s1) * b * k * 0.55, { color: col.ink, size: 11, weight: 700, halo: col.panel });
  };
  say();
}
