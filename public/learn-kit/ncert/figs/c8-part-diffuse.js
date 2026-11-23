// Class 8 Particles: diffusion. A drop of ink (or the smell of food) spreads by itself because particles keep moving
// at random and bump into each other; there are many more places to go away from the crowd than into it. It is faster
// when warm because particles move faster. Random walk with a seeded generator; the spread is measured live.
import { canvas, text, title, dot, row, button, choice, loop, readout, rng } from '../../kit.js';

export default function (host) {
  let warm = false, t = 0, R = rng(4), ps = [];
  const reset = () => { R = rng(4); t = 0; ps = Array.from({ length: 160 }, () => ({ x: 0.5 + (R() - 0.5) * 0.06, y: 0.12 + (R() - 0.5) * 0.06 })); };
  reset();
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Ink particles spreading out in a beaker of water over time' });
  loop(host, (dt) => {
    t += dt; const k = (warm ? 0.9 : 0.4) * 0.35 * Math.sqrt(dt * 4) * 0.2;
    ps.forEach((p) => { p.x += (R() - 0.5) * k * 2 * 0.9; p.y += (R() - 0.5) * k * 2 * 0.9; if (p.x < 0.02 || p.x > 0.98) p.x = Math.min(0.98, Math.max(0.02, p.x)); if (p.y < 0.02 || p.y > 0.98) p.y = Math.min(0.98, Math.max(0.02, p.y)); });
    out.innerHTML = `Time ${t.toFixed(0)} s. The average distance of ink particles from the drop: <b>${(ps.reduce((s, p) => s + Math.hypot(p.x - 0.5, p.y - 0.12), 0) / ps.length * 100).toFixed(0)}</b> units. ${warm ? 'Warm water: particles move faster, so it spreads faster.' : 'Cold water: slower spread.'}`;
    cv.redraw();
  });
  const ctl = row(host);
  choice(ctl, 'Water', [[false, 'Cold'], [true, 'Warm']], warm, (v) => { warm = v; reset(); });
  button(ctl, 'New drop', reset);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Diffusion of an ink drop', col);
    const bx = 14, by = 40, bw = w - 28, bh = h - 54;
    ctx.fillStyle = col.soft; ctx.fillRect(bx, by, bw, bh); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
    ps.forEach((p) => dot(ctx, bx + p.x * bw, by + p.y * bh, 3, col.s[2]));
    text(ctx, 'ink drop starts here', bx + 8, by + bh * 0.12 - 22, { color: col.muted, size: 10 });
  };
}
