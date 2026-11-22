// Class 12 Electromagnetic Induction (step player): Faraday's experiments. A galvanometer joined to a coil shows a current ONLY while the magnet moves
// (or the coil moves, or the field through it changes). A still magnet, even inside the coil, gives nothing. Faster motion gives a bigger deflection;
// pulling out gives the opposite deflection to pushing in. What matters is how fast the flux through the coil changes.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { barMagnet, rad } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 280, label: 'A magnet moving in and out of a coil connected to a galvanometer' });
  const TITLES = ['A magnet at rest near a coil', 'Push the magnet in: the needle kicks', 'Hold it still inside: nothing', 'Pull it out: the needle kicks the other way', 'Move it faster: a bigger kick', 'Move the coil instead: the same effect'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ease = (p) => p * p * (3 - 2 * p);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const cy = top + (h - top) * 0.34, xc = w * 0.62, far = w * 0.2, near = w * 0.55, len = 84;
    const cyc = [0, 3.2, 3.2, 3.2, 1.8, 3.2][step], p = cyc ? (t % cyc) / cyc : 0, mv = [0, 0.5, 0, 0.5, 0.5, 0.5][step], q = Math.min(1, p / mv || 0);
    let mx = far, v = 0;
    if (step === 1 || step === 4) { mx = p < mv ? far + (near - far) * ease(q) : near; v = p < mv ? Math.sin(Math.PI * q) : 0; }
    if (step === 2) { mx = near; }
    if (step === 3) { mx = p < mv ? near - (near - far) * ease(q) : far; v = p < mv ? -Math.sin(Math.PI * q) : 0; }
    let coilx = xc; if (step === 5) { mx = far + 10; const dd = p < mv ? ease(q) : 1; coilx = xc - 60 * dd + 0; v = p < mv ? Math.sin(Math.PI * q) : 0; coilx = xc + 20 - 90 * dd; }
    const vmax = step === 4 ? 2.2 : 1, defl = Math.max(-1, Math.min(1, (step === 4 ? v * 2 : v) / 1.1));
    // coil
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.ellipse(coilx + k * 7, cy, 6, 30, 0, 0, 7); ctx.stroke(); } ctx.restore();
    barMagnet(ctx, mx + (step === 5 ? 0 : 0), cy, len, 22, col);
    // wires and meter
    const my = cy + 96, mxx = w * 0.5;
    line(ctx, [[coilx, cy + 30], [coilx, my], [mxx + 34, my]], col.ink, 1.8); line(ctx, [[coilx + 42, cy + 30], [coilx + 42, my + 24], [mxx - 34, my + 24], [mxx - 34, my]], col.ink, 1.8);
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mxx, my + 6, 34, Math.PI, 0); ctx.lineTo(mxx + 34, my + 22); ctx.lineTo(mxx - 34, my + 22); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    const a = rad(-90 + defl * 55); line(ctx, [[mxx, my + 20], [mxx + 28 * Math.cos(a), my + 20 + 28 * Math.sin(a)]], col.s[1], 3); dot(ctx, mxx, my + 20, 3, col.ink);
    text(ctx, 'G', mxx, my + 38, { color: col.muted, size: 11, weight: 700, align: 'center' });
    const msg = ['no motion, no current', 'flux through the coil is growing: current one way', 'flux is steady: no emf, even though the field is strong', 'flux is falling: current the other way', 'ε = −N dΦ/dt: twice as fast, twice the emf', 'only the relative motion matters'][step];
    text(ctx, msg, w / 2, h - 14, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
