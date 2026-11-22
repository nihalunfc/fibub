// Class 9 Work and Energy: a box pulled by a rope at an angle. Only the part of the force along the motion does
// work: W = F s cos(theta). Sliders change the force and the rope angle; the force is split into an along-the-floor
// part (does work) and an upward part (does none); Pull animates the box over a fixed distance and a bar fills with work.
import { canvas, text, title, line, arrow, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let F = 40, deg = 30, x = 0, moving = false;
  const S = 5; // metres the box is pulled
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 300, label: 'A box pulled by a rope at an angle with the force split into along-the-floor and upward parts' });
  const ctl = row(host);
  slider(ctl, { label: 'Pull F', min: 10, max: 80, step: 5, value: F, fmt: (v) => `${v} N`, oninput: (v) => { F = v; upd(); } });
  slider(ctl, { label: 'Rope angle', min: 0, max: 90, step: 5, value: deg, fmt: (v) => `${v}°`, oninput: (v) => { deg = v; upd(); } });
  button(ctl, '▶ Pull 5 m', () => { x = 0; moving = true; });
  const out = readout(host);
  const rad = () => (deg * Math.PI) / 180;
  function upd() {
    const Fx = F * Math.cos(rad()), Fy = F * Math.sin(rad());
    out.innerHTML = `Along the floor: F cos θ = <b>${Fx.toFixed(1)} N</b> · Upward: F sin θ = ${Fy.toFixed(1)} N (no work) · Work over ${S} m = <b>${(Fx * S).toFixed(0)} J</b>` + (deg === 90 ? '. At 90° the pull is straight up and the box does not move along the floor: zero work.' : '');
    cv.redraw();
  }
  loop(host, (dt) => { if (moving) { x += dt * 2; if (x >= S) { x = S; moving = false; } cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Only the along-motion part of the pull does work', col);
    const floor = h * 0.62, bw = 62, bh = 36, x0 = 24, run = w - 48 - bw, bx = x0 + (x / S) * run * 0.6;
    line(ctx, [[8, floor], [w - 8, floor]], col.ink, 2);
    for (let k = 0; k < 5; k++) line(ctx, [[x0 + k * 70 - ((x / S) * run * 0.6 * 0) , floor + 2], [x0 + k * 70 - 10, floor + 10]], col.line, 1);
    ctx.fillStyle = col.soft; ctx.fillRect(bx, floor - bh, bw, bh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, floor - bh, bw, bh);
    text(ctx, 'box', bx + bw / 2, floor - bh / 2, { color: col.ink, size: 12, align: 'center' });
    const k = 1.6, hx = bx + bw, hy = floor - bh / 2, L = F * k, ex = hx + L * Math.cos(rad()), ey = hy - L * Math.sin(rad());
    const sc = Math.min(1, (w - 12 - hx) / Math.max(1, L * Math.cos(rad())));
    const ex2 = hx + (ex - hx) * sc, ey2 = hy + (ey - hy) * sc;
    arrow(ctx, hx, hy, ex2, ey2, col.s[0], 3);
    text(ctx, 'F', (hx + ex2) / 2 - 6, (hy + ey2) / 2 - 10, { color: col.s[0], size: 13, weight: 700 });
    line(ctx, [[hx, hy], [ex2, hy]], col.s[2], 3); arrow(ctx, hx, hy, ex2, hy, col.s[2], 3);
    line(ctx, [[ex2, hy], [ex2, ey2]], col.s[1], 2, [4, 3]);
    text(ctx, 'F cos θ  (does work)', Math.max((hx + ex2) / 2, hx + 60), floor + 16, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    if (deg > 10) text(ctx, 'F sin θ  (lifts, no work)', ex2 - 4, (hy + ey2) / 2, { color: col.s[1], size: 10.5, align: 'right', halo: col.panel });
    // angle arc
    ctx.beginPath(); ctx.arc(hx, hy, 22, -rad(), 0); ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.stroke();
    text(ctx, `θ=${deg}°`, hx + 28, hy - 8, { color: col.muted, size: 10.5 });
    // work bar
    const Wf = F * Math.cos(rad()) * S, Wmax = 80 * S, bx0 = 14, bw2 = w - 28, by = h - 38, frac = (x / S);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(bx0, by, bw2, 14);
    ctx.fillStyle = col.s[3]; ctx.fillRect(bx0, by, bw2 * (Wf * frac) / Wmax, 14);
    text(ctx, `work done so far = ${(Wf * frac).toFixed(0)} J  (full pull: ${Wf.toFixed(0)} J)`, bx0, by - 10, { color: col.ink, size: 11 });
    text(ctx, 'W = F × s × cos θ', w / 2, h - 10, { color: col.muted, size: 11, align: 'center' });
  };
  upd();
}
