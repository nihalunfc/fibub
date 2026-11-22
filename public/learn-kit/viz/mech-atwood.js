// Pulley systems: an Atwood machine (two hanging masses) or one mass on a smooth table pulled by a hanging mass.
// Change the masses and watch the acceleration and the tension; equal masses stay put, a heavy side drops.
// Try m2 ≫ m1: a → g and the tension → 0 on the table; on the Atwood machine a → g and T → 2m1g.
import { canvas, text, row, choice, slider, readout, loop, button, line, arrow } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let mode = 'atwood', t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 400, min: 280, label: 'Two masses connected over a pulley' });
  const c1 = row(host), c2 = row(host);
  choice(c1, 'System', [['atwood', 'Atwood machine'], ['table', 'Mass on a table']], mode, (v) => { mode = v; t = 0; show(); cv.redraw(); });
  const anim = loop(host, (dt) => { t += dt; if (t > 2.2) t = 0; cv.redraw(); });
  anim.button(c1); button(c1, 'Restart', () => { t = 0; cv.redraw(); });
  const s1 = slider(c2, { label: 'm1', min: 0.5, max: 5, step: 0.1, value: 2, fmt: (v) => v.toFixed(1) + ' kg', oninput: () => { t = 0; show(); } });
  const s2 = slider(c2, { label: 'm2', min: 0.5, max: 5, step: 0.1, value: 3, fmt: (v) => v.toFixed(1) + ' kg', oninput: () => { t = 0; show(); } });
  const out = readout(host);
  const phys = () => { const a = s1.value, b = s2.value; return mode === 'atwood' ? { a: ((b - a) * G) / (a + b), T: (2 * a * b * G) / (a + b) } : { a: (b * G) / (a + b), T: (a * b * G) / (a + b) }; };
  function show() {
    const p = phys();
    out.innerHTML = mode === 'atwood'
      ? `a = (m2 − m1)g ⁄ (m1 + m2) = <b>${p.a.toFixed(2)} m/s²</b> (m2 goes ${p.a >= 0 ? 'down' : 'up'}). T = 2m1m2g ⁄ (m1 + m2) = <b>${p.T.toFixed(2)} N</b>, between m1g = ${(s1.value * G).toFixed(1)} N and m2g = ${(s2.value * G).toFixed(1)} N.`
      : `a = m2g ⁄ (m1 + m2) = <b>${p.a.toFixed(2)} m/s²</b>. T = m1m2g ⁄ (m1 + m2) = <b>${p.T.toFixed(2)} N</b>, always less than m2g = ${(s2.value * G).toFixed(1)} N because m2 is accelerating down.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const p = phys(), d = 0.5 * p.a * t * t * 22, px = mode === 'atwood' ? w / 2 : w * 0.72, py = 56, R = 18;
    const pul = (yy) => { ctx.beginPath(); ctx.arc(px, yy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.stroke(); };
    if (mode === 'atwood') pul(py);
    const box = (cx, cy, m, c, lab) => { const s = 16 + 7 * m; ctx.fillStyle = c; ctx.globalAlpha = 0.85; ctx.fillRect(cx - s / 2, cy, s, s); ctx.globalAlpha = 1; text(ctx, lab, cx, cy + s / 2, { color: col.panel, size: 11, weight: 700, align: 'center' }); return s; };
    const arrows = (cx, cy, m, T, c) => { arrow(ctx, cx, cy, cx, cy - T * 2.2, col.bad, 2.5); arrow(ctx, cx + 12, cy + 4, cx + 12, cy + 4 + m * G * 2.2, col.s[2], 2.5); };
    const dm = Math.max(-25, Math.min(25, d));
    if (mode === 'atwood') {
      const x1 = px - R, x2 = px + R, y1 = 150 - dm, y2 = 150 + dm;
      line(ctx, [[x1, py], [x1, y1]], col.ink, 2); line(ctx, [[x2, py], [x2, y2]], col.ink, 2);
      const s1_ = box(x1, y1, s1.value, col.s[0], 'm1'), s2_ = box(x2, y2, s2.value, col.s[1], 'm2');
      arrows(x1, y1, s1.value, p.T, 0); arrows(x2, y2, s2.value, p.T, 0);
    } else {
      const ty = 132, x1 = px - R - 4 - Math.max(-30, Math.min(60, d * 1.5)) - 40, y2 = 150 + dm;
      ctx.fillStyle = col.line; ctx.fillRect(0, ty, px - R + 2, 14);
      const s1_ = 16 + 7 * s1.value; const bx = Math.min(px - R - s1_ - 6, w * 0.3 + Math.max(0, d * 2.4));
      const by = ty - s1_; ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(bx, by, s1_, s1_); ctx.globalAlpha = 1;
      text(ctx, 'm1', bx + s1_ / 2, by + s1_ / 2, { color: col.panel, size: 11, weight: 700, align: 'center' });
      const ym = by + s1_ / 2, pyy = ym + R; pul(pyy);
      line(ctx, [[bx + s1_, ym], [px, ym]], col.ink, 2);
      const x2 = px + R; line(ctx, [[x2, pyy], [x2, y2]], col.ink, 2); box(x2, y2, s2.value, col.s[1], 'm2');
      arrow(ctx, bx + s1_, by + s1_ / 2, bx + s1_ + p.T * 2.2, by + s1_ / 2, col.bad, 2.5);
      arrows(x2, y2, s2.value, p.T, 0);
    }
    text(ctx, 'Red: tension. Green: weight.', 8, 14, { color: col.muted, size: 11 });
  };
  show();
}
