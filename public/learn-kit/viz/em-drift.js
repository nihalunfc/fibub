// Electrons in a wire. Without a field they zig-zag at random (thermal speed ~10⁶ m/s) and bounce off the lattice
// ions. Switch on a field with the current slider: between collisions each electron speeds up against E, so the whole
// crowd creeps along (drift velocity v_d = I/nAe). The picture exaggerates the drift; the readout gives the real
// copper value, which is a fraction of a millimetre per second.
import { canvas, text, row, slider, readout, loop, rng, arrow, dot } from '../kit.js';

export default function (host) {
  let I = 2, d = 1, W = 300, H = 90;
  const R = rng(11), N = 34, e = Array.from({ length: N }, () => { const a = R() * 6.28; return { x: R() * 300, y: R() * 80 + 5, vx: 60 * Math.cos(a), vy: 60 * Math.sin(a) }; });
  const ions = []; for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) ions.push([20 + i * 33, 18 + j * 27]);
  const cv = canvas(host, { aspect: 0.5, max: 260, min: 190, label: 'Free electrons in a wire drifting slowly while moving randomly' });
  const ctl = row(host);
  slider(ctl, { label: 'Current I', min: 0, max: 5, value: I, step: 0.1, fmt: (v) => v.toFixed(1) + ' A', oninput: (v) => { I = v; show(); } });
  slider(ctl, { label: 'Wire diameter', min: 0.5, max: 3, value: d, step: 0.1, fmt: (v) => v.toFixed(1) + ' mm', oninput: (v) => { d = v; show(); } });
  const out = readout(host);
  let mean = 0, avg = 0;
  const anim = loop(host, (dt) => {
    let s = 0;
    for (const p of e) {
      p.vx -= I * 30 * dt; // electrons accelerate against E (field points right)
      if (Math.random() < dt * 2.2) { const a = Math.random() * 6.28; p.vx = 60 * Math.cos(a); p.vy = 60 * Math.sin(a); }
      p.x += p.vx * dt; p.y += p.vy * dt; s += p.vx;
      if (p.y < 4 || p.y > 86) p.vy *= -1; p.y = Math.min(86, Math.max(4, p.y)); p.x = ((p.x % 300) + 300) % 300;
    }
    avg += (s / N - avg) * 0.05; cv.redraw();
  });
  anim.button(ctl);
  function show() { const A = Math.PI * (d * 1e-3 / 2) ** 2, vd = I / (8.5e28 * A * 1.6e-19); out.innerHTML = `Copper: n = 8.5×10²⁸ per m³. v<sub>d</sub> = I/(nAe) = <b>${(vd * 1e3).toFixed(3)} mm/s</b> (about ${vd > 0 ? (1 / vd / 3600).toFixed(1) : '∞'} hours to travel 1 m). Yet the bulb lights at once, because the field reaches every electron at nearly the speed of light. Drawn drift is exaggerated about ${(60 * 1e0 / Math.max(vd * 1e3, 1e-6)).toFixed(0)}×.`; }
  cv.draw = (ctx, w, h, col) => {
    const sx = w / 300, sy = (h - 50) / 90, oy = 34;
    ctx.fillStyle = col.soft; ctx.fillRect(0, oy, w, 90 * sy);
    ions.forEach(([x, y]) => { ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(x * sx, oy + y * sy, 7, 0, 7); ctx.fill(); ctx.globalAlpha = 1; text(ctx, '+', x * sx, oy + y * sy, { color: col.ink, size: 10, align: 'center' }); });
    e.forEach((p) => dot(ctx, p.x * sx, oy + p.y * sy, 3, col.s[0]));
    if (I > 0) { arrow(ctx, 20, 20, 90, 20, col.s[5], 2.2); text(ctx, 'E and conventional current', 98, 20, { color: col.s[5], size: 11, weight: 600 }); arrow(ctx, w - 20, oy + 90 * sy + 14, w - 20 - Math.min(90, Math.abs(avg) * 3), oy + 90 * sy + 14, col.s[0], 2.2); text(ctx, 'average electron velocity', w - 20, oy + 90 * sy + 28, { color: col.s[0], size: 10.5, weight: 600, align: 'right' }); }
    text(ctx, I > 0 ? `mean v = ${(avg).toFixed(1)} px/s (random part ≈ 60)` : 'No field: random motion, mean v ≈ 0', 10, h - 8, { color: col.muted, size: 10.5 });
  };
  show();
}
