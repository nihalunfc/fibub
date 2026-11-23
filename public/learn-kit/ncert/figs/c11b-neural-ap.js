// Class 11 Biology, Neural control (step player): the action potential. At rest the inside of the axon is about -70 mV (K+ leaks out through open K+ channels; the Na+/K+ pump keeps Na+ outside).
// A stimulus past threshold opens voltage-gated Na+ channels: Na+ rushes in and the membrane reverses to about +30 mV (depolarisation). Then Na+ channels close and K+ channels open: K+ leaves
// (repolarisation), overshooting a little (hyperpolarisation), and the pump restores the resting ion balance.
import { canvas, text, title, axes, line, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 1.1, max: 440, min: 290, label: 'A membrane with sodium and potassium channels and a voltage trace of one action potential, shown in five stages' });
  const T = ['Resting potential: -70 mV', 'Depolarisation: Na⁺ rushes in', 'Repolarisation: K⁺ rushes out', 'Undershoot: K⁺ channels slow to close', 'Recovery: Na⁺/K⁺ pump restores ions'];
  const V = [-70, 30, -30, -80, -70], TM = [0.5, 1.6, 2.4, 3.2, 4.6];
  const TR = [[0, -70], [1, -70], [1.2, -55], [1.4, -10], [1.6, 30], [1.9, 10], [2.2, -20], [2.6, -60], [3, -78], [3.4, -80], [4, -75], [4.6, -70], [5, -70]];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), my = t0 + 70, mw = w - 40;
    ctx.fillStyle = col.soft; ctx.fillRect(20, t0 + 14, mw, 40); ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.22; ctx.fillRect(20, my + 18, mw, 40); ctx.globalAlpha = 1;
    text(ctx, 'OUTSIDE', 24, t0 + 24, { color: col.muted, size: 9.5, weight: 700 }); text(ctx, 'INSIDE', 24, my + 66, { color: col.muted, size: 9.5, weight: 700 });
    text(ctx, step === 1 ? 'Na⁺ Na⁺ Na⁺ (many)' : 'Na⁺ Na⁺ Na⁺ Na⁺', w * 0.55, t0 + 34, { color: col.s[0], size: 11, weight: 700 });
    text(ctx, step === 2 ? 'K⁺ K⁺ K⁺ (leaving)' : 'K⁺ K⁺ K⁺ K⁺', w * 0.55, my + 44, { color: col.s[3], size: 11, weight: 700 });
    ctx.fillStyle = col.ink; ctx.fillRect(20, my - 4, mw, 22);
    const na = step === 1, k = step === 2 || step === 3, gate = (x, open, c, nm) => { ctx.fillStyle = open ? c : col.bg; ctx.fillRect(x, my - 4, 22, 22); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.strokeRect(x, my - 4, 22, 22); text(ctx, nm, x + 11, my + 7, { color: open ? col.bg : c, size: 9.5, weight: 700, align: 'center' }); };
    gate(w * 0.28, na, col.s[0], 'Na'); gate(w * 0.42, k, col.s[3], 'K');
    if (step === 1) { line(ctx, [[w * 0.28 + 11, t0 + 56], [w * 0.28 + 11, my + 30]], col.s[0], 3); }
    if (step === 2 || step === 3) line(ctx, [[w * 0.42 + 11, my + 30], [w * 0.42 + 11, t0 + 56]], col.s[3], 3);
    if (step === 4) { ctx.fillStyle = col.s[2]; ctx.fillRect(w * 0.7, my - 8, 34, 30); text(ctx, 'pump', w * 0.7 + 17, my + 7, { color: col.bg, size: 10, weight: 700, align: 'center' }); text(ctx, '3 Na⁺ out, 2 K⁺ in', w * 0.7 + 17, my - 18, { color: col.s[2], size: 10, weight: 700, align: 'center' }); }
    text(ctx, step === 0 ? 'channels closed (K⁺ leaks a little)' : '', w / 2, my + 82, { color: col.muted, size: 10, align: 'center' });
    const A = axes(ctx, w, h, col, { x: [0, 5], y: [-90, 40], xlabel: 'time (ms)', ylabel: 'mV', l: 48, t: my + 92, b: 36, xt: [0, 1, 2, 3, 4, 5], yt: [-70, 0, 30], r: 12 });
    line(ctx, [[A.X(0), A.Y(-55)], [A.X(5), A.Y(-55)]], col.muted, 1, [4, 3]); text(ctx, 'threshold -55', A.X(5), A.Y(-55) - 8, { color: col.muted, size: 9.5, align: 'right' });
    line(ctx, TR.map(([a, b]) => [A.X(a), A.Y(b)]), col.s[0], 2.5); dot(ctx, A.X(TM[step]), A.Y(V[step]), 6, col.s[3], col.bg);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
