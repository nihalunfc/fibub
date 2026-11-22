// Weighing yourself in a lift: the scale reads N = m(g + a) when the lift's acceleration a points up. Drag the slider
// from big upward to free fall. Switch to the lift's own frame to see the pseudo-force −ma that makes everything balance.
// Try a = −g (cable cut): the scale reads zero, you feel weightless.
import { canvas, text, row, choice, slider, readout, loop, arrow, line } from '../kit.js';
import { G } from './_mech.js';

export default function (host) {
  let frame = 'ground', t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 400, min: 280, label: 'A person on a scale in an accelerating lift' });
  const c1 = row(host);
  choice(c1, 'Frame', [['ground', 'Ground frame'], ['lift', 'Lift frame (pseudo-force)']], frame, (v) => { frame = v; cv.redraw(); show(); });
  const sa = slider(c1, { label: 'Lift acceleration (up +)', min: -9.8, max: 10, step: 0.2, value: 2, fmt: (v) => v.toFixed(1) + ' m/s²', oninput: () => { t = 0; show(); } });
  const anim = loop(host, (dt) => { t += dt; if (t > 2) t = 0; cv.redraw(); });
  anim.button(c1);
  const out = readout(host), m = 60;
  function show() {
    const a = sa.value, N = m * (G + a);
    out.innerHTML = `m = 60 kg. Ground frame: N − mg = ma, so N = m(g + a) = <b>${N.toFixed(0)} N</b>, the scale shows <b>${(N / G).toFixed(1)} kg</b>.` + (frame === 'lift' ? ` In the lift frame you are at rest: N − mg − ma = 0, with the pseudo-force ma = ${(m * a).toFixed(0)} N ${a >= 0 ? 'down' : 'up'}.` : '') + (a <= -G + 0.1 ? ' Free fall: weightless.' : '');
  }
  cv.draw = (ctx, w, h, col) => {
    const a = sa.value, N = m * (G + a), shaft = 18, lw = Math.min(150, w * 0.42), lh = h - 90, lx = w * 0.3 - lw / 2;
    const off = Math.max(-40, Math.min(40, 0.5 * a * t * t * 6));
    if (frame === 'lift') for (let i = 0; i < 9; i++) { const y = (((i * 40 + off * 3) % (h - 20)) + h - 20) % (h - 20) + 10; line(ctx, [[lx - 12, y], [lx - 4, y]], col.muted, 2); }
    if (frame === 'ground') line(ctx, [[lx - 10, h - 14], [lx + lw + 10, h - 14]], col.muted, 2);
    const ty = 20 + (frame === 'ground' ? 20 - off : 20);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.strokeRect(lx, ty, lw, lh);
    const fy = ty + lh - 10;
    ctx.fillStyle = col.line; ctx.fillRect(lx + lw / 2 - 26, fy, 52, 10);
    const cx = lx + lw / 2, bot = fy;
    line(ctx, [[cx, bot], [cx, bot - 50]], col.ink, 4); ctx.beginPath(); ctx.arc(cx, bot - 60, 9, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
    line(ctx, [[cx - 14, bot - 36], [cx + 14, bot - 36]], col.ink, 3);
    const k = 0.1;
    arrow(ctx, cx + 8, bot - 28, cx + 8, bot - 28 + m * G * k * 0.45, col.s[2], 3);
    arrow(ctx, cx - 8, bot, cx - 8, bot - N * k * 0.45, col.bad, 3);
    if (frame === 'lift' && Math.abs(a) > 0.05) arrow(ctx, cx + 22, bot - 28, cx + 22, bot - 28 + m * a * k * 0.45, col.s[1], 3);
    text(ctx, 'N', cx - 18, bot - N * k * 0.45 / 2, { color: col.bad, size: 11, weight: 700, align: 'right' });
    text(ctx, 'mg', cx + 12, bot - 28 + m * G * k * 0.2, { color: col.s[2], size: 11, weight: 700 });
    if (frame === 'lift' && Math.abs(a) > 0.05) text(ctx, 'ma', cx + 26, bot - 20, { color: col.s[1], size: 11, weight: 700 });
    // scale display
    const sx = w * 0.62, sw = w * 0.34;
    ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.strokeRect(sx, 40, sw, 54);
    text(ctx, (N / G).toFixed(1) + ' kg', sx + sw / 2, 67, { color: col.ink, size: 20, weight: 700, align: 'center' });
    text(ctx, 'scale reads', sx + sw / 2, 108, { color: col.muted, size: 11, align: 'center' });
    text(ctx, a > 0.05 ? 'accelerating up (or slowing down going down)' : a < -0.05 ? 'accelerating down (or slowing going up)' : 'constant velocity', sx, 140, { color: col.muted, size: 10, fit: true });
  };
  show();
}
