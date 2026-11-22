// Class 10 Magnetic Effects: the force on a current-carrying conductor in a magnetic field, and Fleming's left-hand rule.
// A rod carrying current I across a field B feels a force F = B I L, at right angles to BOTH the current and the field:
// stretch the thumb, forefinger and middle finger of the LEFT hand at right angles. Forefinger = Field, middle finger =
// Current, thumb = Force (motion). Reverse either the current or the field and the force reverses; reverse both and it does not.
// Here x is to the right, y up and z out of the page: F is along I x B (right x out = down).
import { canvas, text, title, line, dot, arrow, row, slider, choice, readout, loop } from '../../kit.js';

export default function (host) {
  let cur = 1, fld = 1, I = 5, B = 0.5, y = 0, wait = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A current-carrying rod on rails in a magnetic field, moving in the direction given by Fleming’s left-hand rule' });
  const ctl = row(host);
  choice(ctl, 'Current in rod', [[1, 'Left → right'], [-1, 'Right → left']], cur, (v) => { cur = v; reset(); });
  choice(ctl, 'Magnetic field', [[1, 'Out of page (⊙)'], [-1, 'Into page (⊗)']], fld, (v) => { fld = v; reset(); });
  slider(ctl, { label: 'Current I', min: 1, max: 10, step: 1, value: I, fmt: (v) => `${v} A`, oninput: (v) => { I = v; update(); } });
  slider(ctl, { label: 'Field strength B', min: 0.1, max: 1, step: 0.1, value: B, fmt: (v) => `${v.toFixed(1)} T`, oninput: (v) => { B = v; update(); } });
  const out = readout(host);
  const dirY = () => -cur * fld; // +1 = up (screen), -1 = down: F is along I x B = (cur x̂) x (fld ẑ) = -cur*fld ŷ
  function reset() { y = 0; wait = 0; update(); }
  function update() { const F = B * I * 0.1; out.innerHTML = `Current ${cur > 0 ? '→' : '←'}, field ${fld > 0 ? 'out of the page' : 'into the page'}: the force on the rod is <b>${dirY() > 0 ? 'up' : 'down'}</b> (thumb of the left hand). Size: F = B I L = ${B.toFixed(1)} × ${I} × 0.1 m = <b>${F.toFixed(2)} N</b>. Change one of them and the push reverses; change both and it stays.`; }
  loop(host, (dt) => { t += dt; if (wait > 0) { wait -= dt; if (wait <= 0) y = 0; } else { y += dirY() * dt * (0.05 + (B * I) / 5) * 0.9; if (Math.abs(y) >= 1) { y = Math.sign(y); wait = 0.8; } } cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Force on a current-carrying rod', col);
    const L = w * 0.12, R = w * 0.62, top = 60, bot = h - 40, mid = (top + bot) / 2, rodY = mid + y * (bot - top) * 0.4;
    // field symbols
    for (let gx = L + 14; gx < R - 6; gx += 34) for (let gy = top + 6; gy < bot - 4; gy += 30) { ctx.save(); ctx.globalAlpha = 0.25 + 0.5 * B; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 7); ctx.stroke(); if (fld > 0) { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(gx, gy, 1.8, 0, 7); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(gx - 3.5, gy - 3.5); ctx.lineTo(gx + 3.5, gy + 3.5); ctx.moveTo(gx - 3.5, gy + 3.5); ctx.lineTo(gx + 3.5, gy - 3.5); ctx.stroke(); } ctx.restore(); }
    // rails, battery, rod
    line(ctx, [[L, top], [L, bot], [R, bot], [R, top]], col.ink, 3.5); dot(ctx, L, top, 3, col.ink); dot(ctx, R, top, 3, col.ink);
    const bx = (L + R) / 2; ctx.fillStyle = col.panel; ctx.fillRect(bx - 18, bot - 7, 36, 14); line(ctx, [[bx - 6, bot - 9], [bx - 6, bot + 9]], col.ink, 3); line(ctx, [[bx + 5, bot - 5], [bx + 5, bot + 5]], col.ink, 6);
    text(ctx, 'battery', bx, bot + 20, { color: col.muted, size: 10, align: 'center' });
    ctx.save(); ctx.strokeStyle = col.s[1]; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L, rodY); ctx.lineTo(R, rodY); ctx.stroke(); ctx.restore();
    arrow(ctx, cur > 0 ? L + 14 : R - 14, rodY - 14, cur > 0 ? L + 54 : R - 54, rodY - 14, col.s[1], 2.6, 9); text(ctx, 'I', (L + R) / 2, rodY - 22, { color: col.s[1], size: 12.5, weight: 700, align: 'center', halo: col.panel });
    const F = dirY(), fl = 20 + 30 * B * I / 10 * 1.2; arrow(ctx, (L + R) / 2, rodY, (L + R) / 2, rodY + (-F) * fl * 1 * -1 * -1 + 0, col.s[3], 4, 12); text(ctx, 'F', (L + R) / 2 + 12, rodY - F * fl * 0.6, { color: col.s[3], size: 13, weight: 700, halo: col.panel });
    // the three directions, as axes with the left-hand rule
    const ax = w * 0.85, ay = h * 0.5; text(ctx, 'Left-hand rule', ax, ay - 70, { color: col.ink, size: 11, weight: 700, align: 'center' });
    arrow(ctx, ax, ay, ax + cur * 32, ay, col.s[1], 3, 9); text(ctx, 'current', ax + cur * 18, ay + 14, { color: col.s[1], size: 10, weight: 700, align: 'center' });
    arrow(ctx, ax, ay, ax, ay - F * 34, col.s[3], 3, 9); text(ctx, 'force', ax + 18, ay - F * 34, { color: col.s[3], size: 10, weight: 700 });
    ctx.save(); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(ax, ay, 9, 0, 7); ctx.stroke(); if (fld > 0) { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(ax, ay, 2.6, 0, 7); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(ax - 5, ay - 5); ctx.lineTo(ax + 5, ay + 5); ctx.moveTo(ax - 5, ay + 5); ctx.lineTo(ax + 5, ay - 5); ctx.stroke(); } ctx.restore();
    text(ctx, 'field', ax, ay + 28, { color: col.s[0], size: 10, weight: 700, align: 'center' });
    text(ctx, 'thumb = Force', ax, ay + 50, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'forefinger = Field', ax, ay + 63, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'middle = Current', ax, ay + 76, { color: col.muted, size: 10, align: 'center' });
  };
  reset();
}
