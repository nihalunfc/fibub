// 6.2 Two expanding universes side by side, both stretching at the same rate. Big Bang: all galaxies were made
// together, so as space stretches they thin out and all grow old together. Steady State (Bondi, Gold and Hoyle,
// 1948): new matter appears in the gaps, just fast enough (3H per unit volume; 2H in this flat drawing) to keep
// the density fixed, so the view never changes: always the same mix of young and old galaxies. A schematic
// drawing; galaxy size shows age.
import { canvas, text, dot, row, loop, button, rng } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 250, label: 'Galaxies in a Big Bang universe thinning out next to a Steady State universe that makes new galaxies in the gaps' });
  const r = rng(11), H = 0.16; // stretch rate per second of animation
  let bb, ss, age;
  const reset = () => {
    age = 0;
    bb = Array.from({ length: 150 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, b: 0 }));
    ss = Array.from({ length: 60 }, () => ({ x: r() * 2 - 1, y: r() * 2 - 1, b: -r() * 12 }));
  };
  reset();
  const step = (dt) => {
    age += dt;
    const f = Math.exp(H * dt);
    for (const g of bb) { g.x *= f; g.y *= f; }
    for (const g of ss) { g.x *= f; g.y *= f; }
    bb = bb.filter((g) => Math.abs(g.x) < 1.05 && Math.abs(g.y) < 1.05);
    ss = ss.filter((g) => Math.abs(g.x) < 1.05 && Math.abs(g.y) < 1.05);
    // Steady State: new galaxies appear at random places at the rate that keeps the count fixed
    let want = 2 * H * dt * 60 * (1.05 * 1.05);
    while (want > 0) { if (r() < Math.min(1, want)) ss.push({ x: r() * 2 - 1, y: r() * 2 - 1, b: age }); want -= 1; }
    if (bb.length < 6) reset();
  };
  const L = loop(host, (dt) => { step(dt); cv.redraw(); });
  const ctl = row(host);
  L.button(ctl);
  button(ctl, 'Start again', () => { reset(); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const gap = 12, pw = (w - gap * 3) / 2, top = 30, ph = h - top - 54;
    const panels = [[gap, bb, 'Big Bang', col.s[1]], [gap * 2 + pw, ss, 'Steady State', col.s[0]]];
    for (const [x0, list, name, c] of panels) {
      ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0, top, pw, ph);
      text(ctx, name, x0, top - 14, { color: c, size: 13, weight: 700 });
      ctx.save(); ctx.beginPath(); ctx.rect(x0, top, pw, ph); ctx.clip();
      for (const g of list) {
        const a = age - g.b, rad = 1.2 + Math.min(1, a / 6) * 2.6;
        dot(ctx, x0 + pw / 2 + g.x * pw / 2, top + ph / 2 + g.y * ph / 2, rad, c);
      }
      ctx.restore();
      text(ctx, `${list.length} galaxies in view`, x0 + pw / 2, top + ph + 13, { color: col.ink, size: 11.5, weight: 600, align: 'center' });
      text(ctx, list === bb ? 'all born together' : 'young and old mixed', x0 + pw / 2, top + ph + 28, { color: col.ink, size: 11, align: 'center' });
    }
    text(ctx, 'Same stretching. Dot size shows a galaxy\'s age.', w / 2, h - 7, { color: col.muted, size: 11, align: 'center' });
  };
  cv.redraw();
}
