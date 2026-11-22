// 2.6 The rolling race. A solid sphere, a disc, a hollow sphere and a ring are let go together on identical slopes
// (one lane each) and roll without slipping. Each accelerates at g sin θ / (1 + I/mR²): the less of its mass is far
// from the axis, the faster it goes. Mass and radius make no difference.
import { canvas, text, line, row, slider, readout, fmt, loop, button, title } from '../../kit.js';

const BODIES = [
  { name: 'solid sphere', k: 0.4 }, { name: 'disc', k: 0.5 }, { name: 'hollow sphere', k: 2 / 3 }, { name: 'ring', k: 1 },
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 400, min: 280, label: 'Four round bodies rolling down identical slopes side by side' });
  let th = 20, t = 0;
  const L = 2; // slope length, m
  const ctl = row(host);
  slider(ctl, { label: 'Slope angle θ (°)', min: 5, max: 45, step: 1, value: th, fmt: (x) => fmt(x, 2) + '°', oninput: (x) => { th = x; t = 0; show(); cv.redraw(); } });
  const acc = (k) => 9.8 * Math.sin(th * Math.PI / 180) / (1 + k);
  const tEnd = () => Math.sqrt(2 * L / acc(1));
  const lp = loop(host, (dt) => { t += dt * 0.6; if (t > tEnd() + 1.5) t = 0; cv.redraw(); });
  lp.button(ctl);
  button(ctl, 'Restart', () => { t = 0; cv.redraw(); });
  const out = readout(host);
  const show = () => {
    out.innerHTML = 'Time to roll 2 m: ' + BODIES.map((b) => `${b.name} <b>${fmt(Math.sqrt(2 * L / acc(b.k)), 3)} s</b>`).join(', ') +
      `. A block sliding without friction: ${fmt(Math.sqrt(2 * L / (9.8 * Math.sin(th * Math.PI / 180))), 3)} s. Only the shape, through I/mR², decides the order.`;
  };
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Released together, rolling without slipping', col);
    const a = th * Math.PI / 180, lanes = BODIES.length, top = 40, laneH = (H - top - 8) / lanes;
    const x0 = 112, avail = W - x0 - 16;
    BODIES.forEach((b, i) => {
      const yTop = top + i * laneH, drop = Math.min(laneH - 18, avail * Math.tan(a)), run = drop / Math.tan(a);
      const sx = x0, sy = yTop + 8, ex = x0 + run, ey = sy + drop;
      ctx.fillStyle = col.line; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(sx, ey); ctx.closePath(); ctx.fill();
      const len = Math.hypot(run, drop), rr = Math.max(4, Math.min(9, laneH * 0.14));
      const f = Math.min(1, 0.5 * acc(b.k) * t * t / L);
      const cx = sx + f * run + Math.sin(a) * rr, cy = sy + f * drop - Math.cos(a) * rr;
      ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.globalAlpha = b.k === 1 ? 0 : 0.35; ctx.fillStyle = col.s[i]; ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = b.k === 1 ? 3 : 2; ctx.strokeStyle = col.s[i]; ctx.stroke();
      const phi = (f * len) / rr; // angle turned while rolling
      line(ctx, [[cx, cy], [cx + rr * Math.cos(phi), cy + rr * Math.sin(phi)]], col.ink, 1.3);
      text(ctx, b.name, 8, yTop + laneH / 2, { color: col.s[i], size: 11.5, weight: 600 });
      if (f >= 1) text(ctx, 'down', ex - 2, ey - 4, { color: col.muted, size: 10, align: 'right', base: 'bottom' });
    });
  };
  cv.redraw(); show();
}
