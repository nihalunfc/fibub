// Class 12 Chemistry, Amines: why aniline is a much weaker base than methylamine, and why its ring is so reactive (step player).
// The lone pair on N overlaps with the pi cloud of the ring. It spreads onto the ortho and para carbons (resonance), so it is less available to pick up H+ (weaker base, pKb 9.4 against 3.4),
// and the ring is electron-rich at ortho and para (bromine water gives 2,4,6-tribromoaniline at once).
import { canvas, text, title, arrow, loop, ease } from '../../kit.js';

const TT = ['Aniline: lone pair on N', 'The lone pair joins the ring', 'Charge on an ortho carbon', 'Charge on the para carbon', 'What this means'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 400, min: 310, label: 'Resonance in aniline: the nitrogen lone pair delocalised into the ring' });
  loop(host, (dt) => { t = Math.min(1, t + dt * 0.8); cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col), r = Math.min(w, h) * 0.2, cx = w / 2, cy = top + (h - top) * 0.45 + 4;
    const P = (i) => [cx + r * Math.cos(-Math.PI / 2 + i * Math.PI / 3), cy + r * Math.sin(-Math.PI / 2 + i * Math.PI / 3)];
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 6; i++) { const [x, y] = P(i); ctx[i ? 'lineTo' : 'moveTo'](x, y); } ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.58, 0, 7); ctx.stroke();
    const O = P(0), Nx = O[0], Ny = O[1] - 36;
    ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(O[0], O[1]); ctx.lineTo(Nx, Ny + 10); ctx.stroke();
    text(ctx, 'NH₂', Nx, Ny, { color: col.s[3], size: 15, weight: 700, align: 'center', halo: col.panel });
    if (step === 0) { ctx.fillStyle = col.s[0]; [-5, 5].forEach((d) => { ctx.beginPath(); ctx.arc(Nx + 30 + d * 0.2, Ny - 6 + d, 2.8, 0, 7); ctx.fill(); }); text(ctx, 'lone pair', Nx + 56, Ny - 4, { color: col.s[0], size: 10.5, align: 'center' }); }
    if (step >= 1 && step <= 3) arrow(ctx, Nx - 12, Ny + 10, O[0] - 3, O[1] + 3, col.s[3], 2.4, 8);
    if (step >= 1 && step <= 3) text(ctx, '+', Nx + 26, Ny + 2, { color: col.s[0], size: 15, weight: 700, align: 'center' });
    const mk = [[], [1, 3, 5], [1], [3]][Math.min(step, 3)] || [];
    [1, 3, 5].forEach((i) => { const on = step === 4 || mk.includes(i); if (!on) return; const [x, y] = P(i); ctx.globalAlpha = step === 1 ? 0.45 : 1; text(ctx, '−', x + (x - cx) * 0.32, y + (y - cy) * 0.32, { color: col.s[3], size: 24, weight: 700, align: 'center' }); ctx.globalAlpha = 1; });
    const L = (a, b) => { text(ctx, a, w / 2, h - 40, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, b, w / 2, h - 22, { color: col.muted, size: 11, align: 'center' }); };
    if (step === 0) L('N has a lone pair that makes an amine a base.', 'But here N is bonded to the ring, and the lone pair lies next to the π cloud.');
    if (step === 1) L('The lone pair is drawn into the ring.', 'It spreads to the ortho and para positions.');
    if (step === 2) L('Resonance structure with − on an ortho carbon.', 'N now carries a partial +.');
    if (step === 3) L('Another with − on the para carbon.', 'Three such structures, all with N⁺.');
    if (step === 4) L('Result: weaker base (pKb 9.4), reactive ring.', 'A delocalised lone pair is not free to take H⁺; ortho and para carbons are electron-rich.');
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
