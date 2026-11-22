// Class 12 Magnetism and Matter (step player): magnetisation M and magnetic intensity H. A solenoid carrying current gives B0 = μ0 n I (H = nI).
// A material in it has atomic dipoles that line up and add their own field μ0 M: B = μ0 (H + M). With M = χH, B = μ0 (1+χ) H = μ0 μr H = μ H.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { rng } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A solenoid with a material inside: B from the current and from the magnetisation' });
  const TITLES = ['A solenoid in empty space', 'Put a material inside: its atoms are tiny magnets', 'The field lines up the atoms: magnetisation M', 'B = B0 + μ0 M: the two fields add', 'Define H = nI (the part the current makes)', 'M = χ H, so B = μ0 (1 + χ) H = μ H'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const R = rng(5), ang = Array.from({ length: 24 }, () => R() * 2 * Math.PI), u = Array.from({ length: 24 }, () => R());
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    const x0 = 12, x1 = w * 0.58, cy = (top + h) / 2 - 14, hr = Math.min(56, (h - top) * 0.22);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, cy - hr, x1 - x0, 2 * hr); ctx.lineWidth = 1; for (let k = 1; k < 10; k++) { const x = x0 + ((x1 - x0) * k) / 10; ctx.beginPath(); ctx.moveTo(x, cy - hr); ctx.lineTo(x + 5, cy + hr); ctx.stroke(); } ctx.restore();
    text(ctx, 'current I, n turns per metre', (x0 + x1) / 2, cy - hr - 12, { color: col.muted, size: 10.5, align: 'center' });
    const align = [0, 0, 0.55, 0.55, 0.55, 0.55][step], showAt = step >= 1;
    if (showAt) for (let i = 0; i < 24; i++) { const gx = x0 + 22 + (i % 6) * ((x1 - x0 - 44) / 5), gy = cy - hr + 20 + Math.floor(i / 6) * ((2 * hr - 40) / 3); const a = u[i] < align ? 0 : ang[i] + Math.sin(t * 2 + i) * (step === 1 ? 0.5 : 0.1); arrow(ctx, gx - Math.cos(a) * 9, gy + Math.sin(a) * 9, gx + Math.cos(a) * 9, gy - Math.sin(a) * 9, u[i] < align ? col.s[1] : col.s[2], 2, 7); }
    if (!showAt) for (let k = -1; k <= 1; k++) arrow(ctx, x0 + 14, cy + k * hr * 0.5, x1 - 14, cy + k * hr * 0.5, col.s[0], 1.8, 8);
    // bars
    const bx = w * 0.7, bw = 34, base = h - 44, unit = (h - top - 100) / 3, B0 = 1, M = showAt && step >= 2 ? 1.4 : 0;
    line(ctx, [[bx - 20, base], [w - 10, base]], col.line, 1);
    ctx.fillStyle = col.s[0]; ctx.fillRect(bx, base - B0 * unit, bw, B0 * unit);
    if (M) { ctx.fillStyle = col.s[1]; ctx.fillRect(bx, base - (B0 + M) * unit, bw, M * unit); }
    text(ctx, 'μ0 H' + (step < 4 ? ' = B0' : ''), bx + bw + 4, base - (B0 * unit) / 2, { color: col.s[0], size: 11, weight: 700 });
    if (M) text(ctx, 'μ0 M', bx + bw + 4, base - (B0 + M / 2) * unit, { color: col.s[1], size: 11, weight: 700 });
    text(ctx, M ? 'B total' : 'B', bx + bw / 2, base + 14, { color: col.ink, size: 11, weight: 700, align: 'center' });
    const msg = [['B0 = μ0 n I', 'with nothing inside'], ['atoms: dia, para or ferro', 'random orientations, no net field'], ['M = magnetic moment per unit volume', 'unit: A/m'], ['B = B0 + μ0 M', 'B = μ0 (H + M)'], ['H = nI, so B0 = μ0 H', 'H: set by the current alone (A/m)'], ['χ = M/H, μr = 1 + χ', 'paramagnet: tiny +χ   diamagnet: tiny −χ   ferromagnet: huge, not constant']][step];
    text(ctx, msg[0], 10, h - 28, { color: col.ink, size: 12.5, weight: 700 }); text(ctx, msg[1], 10, h - 10, { color: col.muted, size: 10.5 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
