// Class 9 Science, Chapter 6: tug of war. Each puller adds 60 N to her team's pull. The rope's net force is the difference of the two
// pulls. Equal teams: balanced forces, the flag stays still. Unequal teams: the stronger team wins and the rope accelerates
// towards it (a = net force ÷ total mass). By Newton's third law the rope pulls back on each team with the same force that
// the team pulls on it.
import { canvas, text, title, line, dot, arrow, row, slider, button, loop, readout, clamp } from '../../kit.js';

export default function (host) {
  let nl = 3, nr = 3, x = 0, v = 0;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 290, label: 'Two teams of stick figures pulling a rope with a flag in the middle that moves towards the stronger team' });
  const ctl = row(host);
  slider(ctl, { label: 'Left team', min: 1, max: 6, step: 1, value: nl, fmt: (q) => `${q} pullers`, oninput: (q) => { nl = q; } });
  slider(ctl, { label: 'Right team', min: 1, max: 6, step: 1, value: nr, fmt: (q) => `${q} pullers`, oninput: (q) => { nr = q; } });
  button(ctl, 'Reset flag', () => { x = 0; v = 0; });
  loop(host, (dt) => { const net = (nr - nl) * 60; if (net === 0) v *= Math.max(0, 1 - 2 * dt); v += (net / 400) * dt * 30; x = clamp(x + v * dt, -1, 1); if (Math.abs(x) >= 1) v = 0; show(); cv.redraw(); });
  const out = readout(host);
  const show = () => { const net = (nr - nl) * 60; out.innerHTML = `Left pull <b>${nl * 60} N</b>, right pull <b>${nr * 60} N</b>. Net force on the rope = <b>${Math.abs(net)} N</b> ${net === 0 ? '(balanced: no change in motion)' : net > 0 ? 'to the right' : 'to the left'}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Tug of war: add the two pulls', col) + 10, gy = h - 44, ry = gy - 52, fx = w / 2 + x * (w * 0.12);
    ctx.fillStyle = col.line; ctx.fillRect(0, gy, w, 5);
    line(ctx, [[w / 2, gy - 4], [w / 2, gy + 14]], col.muted, 2); text(ctx, 'centre line', w / 2, gy + 20, { color: col.muted, size: 10, align: 'center' });
    line(ctx, [[18, ry], [w - 18, ry]], col.ink, 3);
    // flag
    line(ctx, [[fx, ry], [fx, ry - 24]], col.ink, 1.5); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.moveTo(fx, ry - 24); ctx.lineTo(fx + 14, ry - 19); ctx.lineTo(fx, ry - 14); ctx.fill();
    const fig = (px, dir, c) => { const hx = px + dir * 16, hy = ry - 10; line(ctx, [[px, gy], [hx, hy]], c, 3.5); dot(ctx, hx + dir * 3, hy - 9, 6.5, c); line(ctx, [[px + dir * 9, ry + 2], [px - dir * 12, ry]], c, 2.5); };
    const sp = (w * 0.4) / 6;
    for (let i = 0; i < nl; i++) fig(34 + i * sp * 0.9 + (x * w * 0.04), -1, col.s[0]);
    for (let i = 0; i < nr; i++) fig(w - 34 - i * sp * 0.9 + (x * w * 0.04), 1, col.s[1]);
    const al = Math.min(w * 0.3, nl * 24), ar = Math.min(w * 0.3, nr * 24);
    arrow(ctx, w / 2 - 6, ry - 38, w / 2 - 6 - al, ry - 38, col.s[0], 4, 11); arrow(ctx, w / 2 + 6, ry - 38, w / 2 + 6 + ar, ry - 38, col.s[1], 4, 11);
    text(ctx, `${nl * 60} N`, w / 2 - 12 - al / 2, ry - 52, { color: col.s[0], size: 11, weight: 700, align: 'center' }); text(ctx, `${nr * 60} N`, w / 2 + 12 + ar / 2, ry - 52, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    if (nl === nr) text(ctx, 'balanced: the flag stays', w / 2, top + 6, { color: col.good, size: 12, weight: 700, align: 'center' });
  };
  show(); cv.redraw();
}
