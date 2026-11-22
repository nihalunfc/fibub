// Class 9 Science, Chapter 6: conservation of momentum in a collision. Two trolleys (masses and speeds set by you) meet. The bars
// show momentum p = mv before and after: each trolley's bar can change, but the TOTAL never does. "Stick together" gives one
// final velocity v = (m1u1 + m2u2)/(m1 + m2); "Bounce" is an elastic collision (kinetic energy also kept; beyond the
// syllabus, shown only for fun).
import { canvas, text, title, line, dot, arrow, row, slider, choice, button, loop, readout } from '../../kit.js';

export default function (host) {
  let m1 = 3, u1 = 4, m2 = 2, u2 = -2, mode = 'stick', phase = 0, x1 = 0, x2 = 0, a1 = 0, a2 = 0, t = 0, hold = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two trolleys colliding on a track with momentum bars before and after' });
  const ctl = row(host);
  const rs = () => { phase = 0; t = 0; hold = 0; };
  slider(ctl, { label: 'Red mass', min: 1, max: 6, step: 1, value: m1, fmt: (q) => `${q} kg`, oninput: (q) => { m1 = q; rs(); } });
  slider(ctl, { label: 'Red speed →', min: 1, max: 6, step: 1, value: u1, fmt: (q) => `${q} m/s`, oninput: (q) => { u1 = q; rs(); } });
  slider(ctl, { label: 'Blue mass', min: 1, max: 6, step: 1, value: m2, fmt: (q) => `${q} kg`, oninput: (q) => { m2 = q; rs(); } });
  slider(ctl, { label: 'Blue velocity', min: -5, max: 0, step: 1, value: u2, fmt: (q) => `${q} m/s`, oninput: (q) => { u2 = q; rs(); } });
  choice(ctl, 'After', [['stick', 'Stick together'], ['bounce', 'Bounce']], mode, (q) => { mode = q; rs(); });
  button(ctl, 'Replay', rs);
  const out = readout(host);
  const fin = () => mode === 'stick' ? [(m1 * u1 + m2 * u2) / (m1 + m2), (m1 * u1 + m2 * u2) / (m1 + m2)] : [((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2), ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2)];
  loop(host, (dt) => {
    if (hold > 0) { hold -= dt; if (hold <= 0) rs(); cv.redraw(); return; }
    if (phase === 0) { x1 = -1 + 0 + u1 * t * 0.11; x2 = 1 + u2 * t * 0.11; if (x1 + 0.12 >= x2 - 0.12) { phase = 1; const [f1, f2] = fin(); a1 = f1; a2 = f2; t = 0; x1 = x2 = 0; x1 = -0.12; x2 = 0.12; } }
    else { x1 += a1 * dt * 0.11; x2 += a2 * dt * 0.11; if (Math.abs(x1) > 1.2 || Math.abs(x2) > 1.2) hold = 0.8; }
    t += dt; cv.redraw();
  });
  const upd = () => { const [f1, f2] = fin(), P = m1 * u1 + m2 * u2; out.innerHTML = `Before: p = ${m1}×${u1} + ${m2}×(${u2}) = <b>${P} kg m/s</b>. After: ${mode === 'stick' ? `v = ${P} ÷ ${m1 + m2} = <b>${f1.toFixed(2)} m/s</b> for both` : `red ${f1.toFixed(2)} m/s, blue ${f2.toFixed(2)} m/s`}; total p = <b>${(m1 * f1 + m2 * f2).toFixed(1)} kg m/s</b>. Same total: momentum is conserved.`; };
  host.addEventListener('input', upd); host.addEventListener('click', upd); upd();
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Momentum before and after: the total stays', col) + 8, ty = top + 36, cx = w / 2, sc = w * 0.34;
    ctx.fillStyle = col.line; ctx.fillRect(10, ty + 28, w - 20, 4);
    const draw = (x, m, c, nm, vel) => { const bw = 22 + m * 5; const px = cx + x * sc; ctx.fillStyle = c; ctx.globalAlpha = 0.5; ctx.fillRect(px - bw / 2, ty, bw, 24); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(px - bw / 2, ty, bw, 24); dot(ctx, px - bw / 2 + 6, ty + 28, 3, col.ink); dot(ctx, px + bw / 2 - 6, ty + 28, 3, col.ink); text(ctx, `${m} kg`, px, ty + 12, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); };
    draw(x1, m1, col.s[1], 'red'); draw(x2, m2, col.s[0], 'blue');
    text(ctx, phase === 0 ? 'before the collision' : 'after the collision', 12, ty - 14, { color: col.muted, size: 11 });
    // bars
    const [f1, f2] = fin(), P0 = [m1 * u1, m2 * u2, m1 * u1 + m2 * u2], P1 = [m1 * f1, m2 * f2, m1 * f1 + m2 * f2];
    const by = ty + 64, bh = h - by - 20, mid = by + bh / 2, S = (bh / 2 - 14) / Math.max(8, ...P0.map(Math.abs), ...P1.map(Math.abs));
    line(ctx, [[12, mid], [w - 12, mid]], col.muted, 1);
    const grp = (x0, P, lab, active) => { text(ctx, lab, x0 + 56, by - 2, { color: active ? col.ink : col.muted, size: 11.5, weight: 700, align: 'center' });
      P.forEach((p, i) => { const c = [col.s[1], col.s[0], col.s[2]][i], bw = 30, bx = x0 + i * 38; ctx.globalAlpha = active ? 1 : 0.5; ctx.fillStyle = c; ctx.fillRect(bx, p >= 0 ? mid - p * S : mid, bw, Math.abs(p) * S); ctx.globalAlpha = 1;
        text(ctx, p.toFixed(0), bx + bw / 2, p >= 0 ? mid - p * S - 9 : mid + Math.abs(p) * S + 9, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); text(ctx, ['red', 'blue', 'total'][i], bx + bw / 2, h - 8, { color: col.muted, size: 10, align: 'center' }); }); };
    grp(14, P0, 'p before', phase === 0); grp(w / 2 + 14, P1, 'p after', phase === 1);
  };
  cv.redraw();
}
