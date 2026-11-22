// Lenz's law in five steps (a step player; the slider moves the magnet yourself). A bar magnet, north end down, is dropped
// through a coil. Flux grows as it approaches: the coil makes a field of its own pointing UP to oppose the growth, so its top
// face acts as a north pole and pushes the magnet away. When the magnet leaves, flux shrinks: the coil now makes a field
// pointing DOWN to keep it up, its lower face is a north pole, which pulls the magnet back. Either way the coil fights the change.
import { canvas, axes, line, text, row, slider, readout, arrow } from '../kit.js';

const phi = (z) => 1 / Math.pow(1 + z * z, 1.5);
const TXT = ['Far above: no change, no current.', 'Approaching: flux through the coil (downward) is growing.', 'The induced current makes a field that points UP inside the coil: it opposes the growth.', 'That field makes the coil\'s top face a north pole: it repels the magnet, and the magnet must be pushed against it (work → energy of the current).', 'Leaving: the flux now shrinks, so the current reverses: field DOWN, lower face north, the magnet is pulled back.'];
const Z = [3, 1.6, 1.0, 0.7, -1.4];
export default function (host) {
  let z = 3, st = 0;
  const cv = canvas(host, { aspect: 1.0, max: 420, min: 330, label: 'A magnet moving through a coil and the induced current that opposes it' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Magnet height', min: -3, max: 3, value: z, step: 0.05, fmt: (x) => x.toFixed(2), oninput: (x) => { z = x; st = z > 2.5 ? 0 : z > 0 ? (z > 0.85 ? 1 : 3) : 4; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = `${TXT[st]} Flux Φ ∝ ${phi(z).toFixed(2)} (relative). ${z > 0.3 && st >= 1 ? 'Falling toward the coil: dΦ/dt &gt; 0, induced EMF opposes it (EMF = −dΦ/dt).' : z < -0.3 ? 'Falling away: dΦ/dt &lt; 0, so the induced EMF has the opposite sign.' : ''}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = Math.round(w * 0.36), cy = 90, Y = (zz) => cy - zz * 26, app = z > 0.3, lv = z < -0.3, I = (z > 0.05 ? 1 : z < -0.05 ? -1 : 0) * (st >= 2 || z < -0.3 ? 1 : st === 1 ? 1 : 0);
    ctx.strokeStyle = col.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(cx, cy, 34, 11, 0, 0, 7); ctx.stroke();
    if (I) { const up = I > 0; ctx.strokeStyle = col.s[5]; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, cy, 34, 11, 0, up ? 0.2 : Math.PI + 0.2, (up ? 0.2 : Math.PI + 0.2) + 2.1); ctx.stroke(); text(ctx, up ? 'current anticlockwise (from above)' : 'current clockwise (from above)', cx + 44, cy + 20, { color: col.s[5], size: 10.5, weight: 700 }); }
    const my = Y(z); ctx.fillStyle = col.s[5]; ctx.fillRect(cx - 10, my - 20, 20, 20); ctx.fillStyle = col.s[0]; ctx.fillRect(cx - 10, my, 20, 20); text(ctx, 'S', cx, my - 10, { color: '#fff', size: 12, weight: 700, align: 'center' }); text(ctx, 'N', cx, my + 10, { color: '#fff', size: 12, weight: 700, align: 'center' });
    // flux lines through the coil: number ∝ flux
    const n = Math.round(1 + 6 * phi(z)); for (let k = 0; k < n; k++) { const dx = (k - (n - 1) / 2) * 6; arrow(ctx, cx + dx, cy - 14, cx + dx, cy + 14, col.s[0], 1.2, 4); }
    // induced field and poles
    if (I) { const up = I > 0; arrow(ctx, cx + 60, cy + (up ? 20 : -20), cx + 60, cy + (up ? -20 : 20), col.s[5], 2.4, 8); text(ctx, 'induced B', cx + 66, cy, { color: col.s[5], size: 10.5, weight: 700 }); text(ctx, up ? 'N' : 'S', cx - 52, cy - 20, { color: col.s[5], size: 13, weight: 700 }); text(ctx, up ? 'S' : 'N', cx - 52, cy + 22, { color: col.s[5], size: 13, weight: 700 }); }
    text(ctx, st === 3 || (st === 2 && false) ? '' : '', 10, 10, { color: col.ink });
    if (st === 3 || z > 0.3) arrow(ctx, cx + 30, my + 10, cx + 30, my - 10, col.s[2], 2.2, 7);
    const G = axes(ctx, w, h, col, { x: [3, -3], y: [-1.2, 1.2], xlabel: 'magnet height (it falls to the right)', ylabel: 'EMF (falling)', l: 40, t: 190, b: 36, xt: [-3, 0, 3], yt: [-1, 0, 1], fy: (v) => v });
    line(ctx, Array.from({ length: 121 }, (_, i) => { const zz = 3 - i * 0.05, dphi = -3 * zz / Math.pow(1 + zz * zz, 2.5); return [G.X(zz), G.Y(-(-dphi) * 1.15 * (1 + 0))]; }).map(([x, y]) => [x, y]), col.s[0], 2.2);
    const dz = -3 * z / Math.pow(1 + z * z, 2.5); ctx.fillStyle = col.s[5]; ctx.beginPath(); ctx.arc(G.X(z), G.Y(dz * 1.15), 5, 0, 7); ctx.fill();
    text(ctx, `Step ${st + 1} of 5`, w - 10, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  upd();
  return { step(i, n) { st = Math.max(0, Math.min(4, Math.round(i * 4 / Math.max(1, n - 1)))); z = Z[st]; sl.set(z); upd(); } };
}
