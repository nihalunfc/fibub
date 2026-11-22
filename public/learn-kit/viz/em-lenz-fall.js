// A magnet dropped through a coil. The graph records the induced EMF as it falls. Approaching, the flux through the coil
// grows and the EMF has one sign; leaving, the flux shrinks and it flips, with a taller, narrower peak because the magnet is
// moving faster. With the coil closed the induced current makes the coil push back on the magnet (Lenz's law) and the fall
// is slower; with the coil open there is no current and no braking. Press Drop again to compare.
import { canvas, axes, line, text, row, slider, choice, button, readout, loop, dot } from '../kit.js';

const g = 4, phi = (z) => 1 / Math.pow(1 + z * z, 1.5), dphi = (z) => -3 * z / Math.pow(1 + z * z, 2.5);
export default function (host) {
  let closed = true, kap = 6, z, v, tt, hist, wait = 0, done = false, tfall = 0;
  const cv = canvas(host, { aspect: 1.05, max: 420, min: 330, label: 'A magnet falling through a coil and the EMF it induces' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Coil', [[true, 'Closed (current flows)'], [false, 'Open (no current)']], closed, (x) => { closed = x; drop(); });
  slider(c2, { label: 'Coil strength N²Φ₀²/R', min: 1, max: 12, value: kap, step: 0.5, fmt: (x) => x.toFixed(1), oninput: (x) => { kap = x; drop(); } });
  button(c2, 'Drop again', () => drop());
  const out = readout(host);
  const anim = loop(host, (dt) => { if (done) { wait += dt; if (wait > 1.6) drop(); cv.redraw(); return; } for (let i = 0; i < 10; i++) { const h = dt / 10, br = closed ? kap * dphi(z) ** 2 * v : 0; v += (g - br) * h; z -= v * h; tt += h; }
    hist.push([tt, dphi(z) * v]); if (z < -3.2) { done = true; wait = 0; tfall = tt; show(); } cv.redraw(); });
  anim.button(ctl);
  function drop() { z = 3.2; v = 0; tt = 0; hist = []; done = false; wait = 0; cv.redraw(); show(); }
  function show() { const free = Math.sqrt(2 * 6.4 / g), pk = hist.length ? [Math.min(...hist.map((p) => p[1])), Math.max(...hist.map((p) => p[1]))] : [0, 0];
    out.innerHTML = `EMF = −N dΦ/dt. ${done ? `Fall took <b>${tfall.toFixed(2)}</b> time units; free fall would take ${free.toFixed(2)}. Peaks: ${pk[0].toFixed(2)} and ${pk[1].toFixed(2)} (in units of NΦ₀): the second is bigger because the magnet is faster.` : 'Dropping... the EMF changes sign as the magnet passes through the middle of the coil.'} ${closed ? 'Closed coil: the induced current opposes the change, so it repels the approaching magnet and attracts the leaving one, braking both times.' : 'Open coil: the EMF is still there but no current flows, so there is no force.'}`; }
  cv.draw = (ctx, w, h, col) => {
    const cx = 56, top = 20, bot = 160, Z = (zz) => (top + bot) / 2 - zz * (bot - top) / 7.2;
    line(ctx, [[cx + 40, Z(3.4)], [cx + 40, Z(-3.4)]], col.line, 1);
    ctx.strokeStyle = closed ? col.s[2] : col.muted; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, Z(0), 28, 8, 0, 0, 7); ctx.stroke(); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.2; ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, closed ? 'closed coil' : 'open coil', cx + 36, Z(0) + 18, { color: col.muted, size: 10.5 });
    const my = Z(z); ctx.fillStyle = col.s[5]; ctx.fillRect(cx - 9, my - 16, 18, 16); ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 9, my, 18, 16); text(ctx, 'N', cx, my - 8, { color: '#fff', size: 11, weight: 700, align: 'center' }); text(ctx, 'S', cx, my + 8, { color: '#fff', size: 11, weight: 700, align: 'center' });
    text(ctx, 'Lenz: induced current opposes the change', 100, 28, { color: col.ink, size: 11, weight: 600 });
    const G = axes(ctx, w, h, col, { x: [0, 3.2], y: [-3, 3], xlabel: 'time', ylabel: 'EMF (units of NΦ₀)', l: 42, t: 180, b: 36, xt: [0, 1, 2, 3], yt: [-3, 0, 3], fy: (v) => v });
    G.clip && (ctx.save(), G.clip()); line(ctx, hist.map(([a, b]) => [G.X(a), G.Y(b)]), col.s[0], 2.4); ctx.restore();
    if (hist.length) { const l = hist[hist.length - 1]; dot(ctx, G.X(l[0]), G.Y(l[1]), 4.5, col.s[5], col.panel); }
  };
  drop();
}
