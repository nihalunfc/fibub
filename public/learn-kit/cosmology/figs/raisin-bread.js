// 4.3 The raisin loaf. Galaxies (raisins) sit in dough that rises evenly: every distance grows by the same
// factor. Pick any raisin as "home": every other raisin moves away from it, and the arrows (speeds) grow in
// proportion to distance. That is Hubble's law, seen identically from every raisin, so there is no centre.
import { canvas, text, title, line, dot, arrow, row, choice, loop, rng, calm } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 300, label: 'Raisins in rising dough moving apart, seen from any raisin you pick' });
  const r = rng(7);
  const pts = [];
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) pts.push([i + (r() - 0.5) * 0.6, j + (r() - 0.5) * 0.6]);
  const homes = { A: 24, B: 9, C: 40 };
  let home = 'A', t = 0;
  const ctl = row(host);
  const anim = loop(host, (dt) => { t = (t + dt * 0.25) % 1; cv.redraw(); });
  anim.button(ctl);
  choice(ctl, 'Watch from', [['A', 'Raisin A'], ['B', 'Raisin B'], ['C', 'Raisin C']], home, (v) => { home = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const a = calm() && !anim.playing ? 1.5 : 1 + t; // the dough grows from 1x to 2x, then starts again
    const hp = pts[homes[home]], cx = w / 2, cy = h / 2 + 12, S = Math.min(w, h) / 9.5;
    // dough edge would be off screen: the loaf is bigger than the view
    for (const [k, idx] of Object.entries(homes)) {
      const p = pts[idx];
      const x = cx + (p[0] - hp[0]) * a * S, y = cy + (p[1] - hp[1]) * a * S;
      if (k !== home && x > 0 && x < w && y > 40 && y < h) text(ctx, k, x + 8, y - 8, { color: col.muted, size: 11, weight: 700 });
    }
    pts.forEach((p, i) => {
      const dx = (p[0] - hp[0]) * a, dy = (p[1] - hp[1]) * a;
      const x = cx + dx * S, y = cy + dy * S;
      if (x < -20 || x > w + 20 || y < 52 || y > h - 34) return;
      if (i !== homes[home]) {
        const sc = 0.22 * S; // arrow length ∝ distance (speed = H × distance)
        if (Math.hypot(dx, dy) > 0.2) arrow(ctx, x, y, x + dx * sc / a * 0.9, y + dy * sc / a * 0.9, col.s[0], 1.5, 6);
        dot(ctx, x, y, 4.5, col.ink);
      }
    });
    ctx.fillStyle = col.panel; ctx.fillRect(0, 0, w, 40); ctx.fillRect(0, h - 26, w, 26);
    dot(ctx, cx, cy, 7, col.s[3], col.panel);
    text(ctx, `home: raisin ${home}`, cx, cy + 18, { color: col.ink, size: 11.5, weight: 700, align: 'center', halo: col.panel });
    text(ctx, `dough has grown ${a.toFixed(2)}×: every gap is ${a.toFixed(2)}× its starting size`, w / 2, h - 10, { color: col.ink, size: 11.5, align: 'center', halo: col.panel });
    title(ctx, 'From any raisin, the rest move away, faster the farther', col);
  };
  cv.redraw();
}
