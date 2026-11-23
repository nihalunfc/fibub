// Class 11 Laws of Motion: Newton's third law and conservation of momentum. Two skaters at rest push each other. The forces are equal and opposite (action and reaction, on DIFFERENT bodies) and
// act for the same time, so the impulses are equal and opposite: m1 v1 = -m2 v2. The total momentum stays zero; the lighter skater ends up faster. The same idea is a gun and its bullet.
import { canvas, text, title, line, dot, arrow, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let m1 = 40, m2 = 60, J = 120, t = -0.6, run = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Two skaters pushing apart with momentum bars' });
  const ctl = row(host), out = readout(host);
  const anim = loop(host, (d) => { t += d; if (t > 3) t = -0.6; say(); }, { autoplay: false });
  slider(ctl, { label: 'Mass of skater 1 (kg)', min: 20, max: 100, step: 5, value: m1, fmt: (v) => v + ' kg', oninput: (v) => { m1 = v; t = -0.6; say(); } });
  slider(ctl, { label: 'Mass of skater 2 (kg)', min: 20, max: 100, step: 5, value: m2, fmt: (v) => v + ' kg', oninput: (v) => { m2 = v; t = -0.6; say(); } });
  anim.button(ctl); button(ctl, 'Reset', () => { t = -0.6; say(); });
  const v1 = () => -J / m1, v2 = () => J / m2;
  function say() { out.innerHTML = `Both get the same impulse ${J} N s in opposite directions: skater 1 leaves at <b>${Math.abs(v1()).toFixed(2)} m/s</b>, skater 2 at <b>${v2().toFixed(2)} m/s</b>. Speed ratio v₁/v₂ = m₂/m₁ = ${(m2 / m1).toFixed(2)}. Total momentum before = after = <b>0</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Push apart: equal and opposite impulses', col);
    const gy = h * 0.4, cx = w / 2, S = (w / 2 - 40) / 4, push = t > 0 ? 1 : 0, tt = Math.max(0, t);
    line(ctx, [[10, gy + 6], [w - 10, gy + 6]], col.ink, 2);
    const x1 = cx - 24 + v1() * tt * S * 0.9, x2 = cx + 24 + v2() * tt * S * 0.9;
    const body = (x, m, c, lab) => { const sz = 14 + m / 5; ctx.fillStyle = c; ctx.fillRect(x - sz / 2, gy - sz * 1.4, sz, sz * 1.4); text(ctx, lab, x, gy - sz * 1.4 - 10, { size: 11, weight: 700, color: c, align: 'center' }); };
    body(x1, m1, col.s[0], `${m1} kg`); body(x2, m2, col.s[3], `${m2} kg`);
    if (t > -0.6 && t < 0.25) { arrow(ctx, cx - 4, gy - 22, cx - 40, gy - 22, col.s[1], 3, 8); arrow(ctx, cx + 4, gy - 22, cx + 40, gy - 22, col.s[1], 3, 8); text(ctx, 'F and −F', cx, gy - 36, { size: 10.5, weight: 700, color: col.s[1], align: 'center' }); }
    const by = h * 0.62, bw = (w - 60) / 2; line(ctx, [[w / 2, by - 22], [w / 2, by + 76]], col.muted, 1);
    const P1 = t > 0 ? m1 * v1() : 0, P2 = t > 0 ? m2 * v2() : 0, sc = bw / 150;
    [['skater 1 momentum', P1, col.s[0], 0], ['skater 2 momentum', P2, col.s[3], 1], ['total', P1 + P2, col.s[2], 2]].forEach(([lab, p, c, i]) => { const y = by + i * 26; ctx.fillStyle = c; ctx.fillRect(w / 2 + Math.min(0, p * sc), y, Math.abs(p * sc), 16); text(ctx, `${lab}: ${p.toFixed(0)} kg m/s`, p >= 0 && i !== 2 ? w / 2 - 6 : w / 2 + 6, y + 8, { size: 10.5, weight: 700, color: col.ink, align: p >= 0 && i !== 2 ? 'right' : 'left' }); });
  };
  say();
}
