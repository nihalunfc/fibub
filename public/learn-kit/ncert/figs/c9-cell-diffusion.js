// Class 9 Cell: diffusion. A removable partition separates a left box of coloured particles from an empty right box.
// Each particle moves randomly (more with higher temperature). After the partition is lifted the particles spread
// until they are evenly mixed: net movement from high to low concentration. The graph shows left and right counts.
import { canvas, text, title, dot, line, row, slider, button, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let temp = 1, open = false, R = rng(5), P = [], hist = [];
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Particles spreading from a crowded left box to an empty right box after a partition is removed' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 0.3, max: 3, step: 0.1, value: temp, fmt: (v) => v.toFixed(1) + '×', oninput: (v) => { temp = v; } });
  button(ctl, 'Lift the partition', () => { open = true; });
  button(ctl, 'Reset', () => reset());
  const out = readout(host);
  function reset() { open = false; hist = []; P = []; for (let i = 0; i < 70; i++) P.push({ x: R() * 0.5, y: R(), vx: 0, vy: 0 }); }
  reset();
  loop(host, (dt) => {
    P.forEach((p) => { p.vx += (R() - 0.5) * 3 * temp * dt * 6; p.vy += (R() - 0.5) * 3 * temp * dt * 6; const s = Math.hypot(p.vx, p.vy), mx = 0.25 * temp; if (s > mx) { p.vx *= mx / s; p.vy *= mx / s; }
      p.x += p.vx * dt * 2; p.y += p.vy * dt * 2;
      if (p.y < 0 || p.y > 1) { p.vy *= -1; p.y = Math.min(1, Math.max(0, p.y)); }
      if (p.x < 0 || p.x > 1) { p.vx *= -1; p.x = Math.min(1, Math.max(0, p.x)); }
      if (!open && p.x > 0.496) { p.x = 0.496; p.vx = -Math.abs(p.vx); } });
    const l = P.filter((p) => p.x < 0.5).length; hist.push(l); if (hist.length > 240) hist.shift();
    out.innerHTML = `Left box: <b>${l}</b> particles, right box: <b>${P.length - l}</b>. ` + (!open ? 'The partition is down: nothing can cross. Lift it.' : Math.abs(l - P.length / 2) < 6 ? 'Evenly spread: still moving, but equal numbers cross each way (dynamic balance).' : 'More particles cross from the crowded side than back, so the crowded side empties: net flow from high to low concentration.');
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Diffusion in a box', col);
    const X = 10, Y = 40, W = w - 20, H = h * 0.56;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(X, Y, W, H);
    if (!open) line(ctx, [[X + W / 2, Y], [X + W / 2, Y + H]], col.bad, 4);
    P.forEach((p) => dot(ctx, X + p.x * W, Y + p.y * H, 3.4, col.s[1]));
    // history graph
    const gy = Y + H + 22, gh = h - gy - 12; text(ctx, 'particles in the left box over time', X, gy - 6, { color: col.muted, size: 10 });
    ctx.strokeStyle = col.line; ctx.strokeRect(X, gy, W, gh); line(ctx, [[X, gy + gh / 2], [X + W, gy + gh / 2]], col.line, 1, [3, 3]);
    if (hist.length > 1) line(ctx, hist.map((v, i) => [X + (i / 240) * W, gy + gh - (v / P.length) * gh]), col.s[2], 2);
  };
}
