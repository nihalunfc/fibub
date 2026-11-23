// Class 8 Science, Investigating: a fair test on a pendulum. The time of one swing is T = 2 pi sqrt(L / g) for small
// swings, with g = 9.8 m/s^2. It depends on the length L but NOT on the bob's mass (and hardly on the starting angle).
// Change one slider at a time and watch the time for 10 swings.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let L = 0.5, m = 50, ang = 20, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A swinging pendulum with sliders for length, mass and starting angle' });
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  anim.button(ctl);
  slider(ctl, { label: 'Length', min: 0.2, max: 1, step: 0.05, value: L, fmt: (v) => `${v.toFixed(2)} m`, oninput: (v) => { L = v; upd(); } });
  slider(ctl, { label: 'Mass', min: 20, max: 200, step: 10, value: m, fmt: (v) => `${v} g`, oninput: (v) => { m = v; upd(); } });
  slider(ctl, { label: 'Angle', min: 5, max: 30, step: 5, value: ang, fmt: (v) => `${v}°`, oninput: (v) => { ang = v; upd(); } });
  const out = readout(host);
  const T = () => 2 * Math.PI * Math.sqrt(L / 9.8);
  function upd() { out.innerHTML = `Time for 10 swings = <b>${(10 * T()).toFixed(1)} s</b> (one swing ${T().toFixed(2)} s). Change the mass: nothing happens. Change the length: the time changes. Only one variable at a time keeps the test fair.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Pendulum fair test', col);
    const px = w / 2, py = 48, len = 40 + L * 190, th = (ang * Math.PI / 180) * Math.cos(2 * Math.PI * t / T());
    const bx = px + len * Math.sin(th), by = py + len * Math.cos(th);
    line(ctx, [[px - 40, py], [px + 40, py]], col.ink, 4);
    line(ctx, [[px, py], [bx, by]], col.muted, 1.5);
    dot(ctx, bx, by, 6 + m / 20, col.s[1], col.ink);
    text(ctx, `${m} g`, bx, by + 20, { color: col.muted, size: 10.5, align: 'center' });
    const bars = (y, label, v, max, c) => { text(ctx, label, 12, y, { color: col.ink, size: 11 }); ctx.fillStyle = c; ctx.fillRect(12, y + 8, (w - 24) * v / max, 10); };
    bars(h - 52, 'time for 10 swings', 10 * T(), 20, col.s[2]);
  };
  upd();
}
