// Class 12 Electromagnetic Induction (step player): the emf across a rod of length l moving at speed v across a field B, ε = B l v, derived from the magnetic force on
// its free electrons; then the current I = Blv/R, the opposing force F = B²l²v/R and the energy balance P = Fv = I²R.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';
import { bgrid, into } from '../c12p-mmlib.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'A rod sliding on rails in a magnetic field' });
  const TITLES = ['A rod of length l slides at speed v across a field B', 'The magnetic force pushes its free charges along the rod', 'Charge piles up: an emf ε = B l v', 'Close the circuit: current I = B l v / R', 'The field pushes back on the rod: F = I l B', 'All the work you do becomes heat'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4;
    bgrid(ctx, 0, top, w, h - 46, true, col.line, 36, 5);
    const yT = top + 36, yB = yT + Math.min(120, (h - top) * 0.4), xL = 40, xR = w - 24, rx = xL + 60 + (((t * 0.12) % 1) * (xR - xL - 120));
    line(ctx, [[xL, yT], [xR, yT]], col.ink, 3); line(ctx, [[xL, yB], [xR, yB]], col.ink, 3);
    if (step >= 3) { line(ctx, [[xL, yT], [xL, yB]], col.ink, 3); ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.fillRect(xL - 12, (yT + yB) / 2 - 16, 24, 32); ctx.strokeRect(xL - 12, (yT + yB) / 2 - 16, 24, 32); ctx.restore(); text(ctx, 'R', xL + 18, (yT + yB) / 2, { color: col.s[1], size: 12, weight: 700 }); }
    line(ctx, [[rx, yT - 4], [rx, yB + 4]], col.s[2], 6);
    arrow(ctx, rx + 6, (yT + yB) / 2, rx + 44, (yT + yB) / 2, col.s[3], 3, 9); text(ctx, 'v', rx + 52, (yT + yB) / 2, { color: col.s[3], size: 13, weight: 700 });
    if (step >= 1 && step <= 2) {
      for (let k = 0; k < 5; k++) { const yy = yB - 8 - k * ((yB - yT - 20) / 4) * (step === 2 ? 0.25 : 1); dot(ctx, rx - 14, yy, 3.5, col.s[1]); }
      for (let k = 0; k < 4; k++) arrow(ctx, rx + 14, yB - 10 - k * 24, rx + 14, yB - 28 - k * 24, col.s[1], 2, 7);
      text(ctx, 'F = qvB, up', rx + 20, yT + 22, { color: col.s[1], size: 10.5, weight: 700 });
    }
    if (step === 2) { text(ctx, '+', rx - 8, yT + 4, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, '−', rx - 8, yB - 2, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, 'electrons gather at the − end', rx - 14, yB + 16, { color: col.muted, size: 10, align: 'center' }); }
    if (step >= 3) { for (let k = 0; k < 8; k++) { const s = ((t * 0.5 + k / 8) % 1) * 2 * ((xR) - xL + (yB - yT)); } const per = [[rx, yB], [rx, yT], [xL, yT], [xL, yB], [rx, yB]]; const segs = [(yB - yT), (rx - xL), (yB - yT), (rx - xL)], tot = segs.reduce((a, b) => a + b, 0); for (let k = 0; k < 10; k++) { let d = ((t * 0.4 + k / 10) % 1) * tot, i = 0; while (d > segs[i]) { d -= segs[i]; i++; } const f = d / segs[i], A = per[i], Bp = per[i + 1]; dot(ctx, A[0] + (Bp[0] - A[0]) * f, A[1] + (Bp[1] - A[1]) * f, 3, col.s[1]); } text(ctx, 'I', rx - 14, (yT + yB) / 2 - 20, { color: col.s[1], size: 13, weight: 700 }); }
    if (step >= 4) { arrow(ctx, rx - 6, (yT + yB) / 2 + 22, rx - 44, (yT + yB) / 2 + 22, col.bad, 3.5, 10); text(ctx, 'F = BIl', rx - 48, (yT + yB) / 2 + 38, { color: col.bad, size: 11.5, weight: 700, align: 'right' }); }
    const m = [['v ⟂ B ⟂ rod', 'B into the page'], ['force on an electron (charge −e): along the rod', 'F = q v B  (for a positive charge: up the page)'], ['work per unit charge: ε = F l / q = (qvB) l / q = B l v', 'a battery with no wires'], ['I = ε/R = B l v / R', 'direction: anticlockwise, from Lenz’s law'], ['F = I l B = B² l² v / R', 'opposes the motion: Lenz’s law again'], ['P_you = F v = B² l² v² / R', '= ε²/R = I²R: heat in the resistor. Energy is conserved.']][step];
    text(ctx, m[0], w / 2, h - 30, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); text(ctx, m[1], w / 2, h - 12, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(5, i); t = 0; cv.redraw(); } };
}
