// Class 12 Alternating Current (step player): the transformer. Alternating current in the primary makes an alternating
// magnetic flux in the iron core; the same flux threads the secondary, so the emf per turn is the same in both coils:
// Vs/Vp = Ns/Np. For an ideal transformer Vp Ip = Vs Is, so the currents change in the opposite ratio. Real ones lose
// a few percent (copper, eddy current, hysteresis, flux leakage). Example: Np = 100, Ns = 200, Vp = 230 V.
import { canvas, line, text, title, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 290, label: 'A transformer with primary and secondary coils on an iron core and alternating flux' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const TT = ['1. AC in the primary makes a changing flux', '2. The same flux threads the secondary', '3. Same emf per turn: Vs/Vp = Ns/Np', '4. Energy is conserved: VpIp = VsIs', '5. Real transformers lose a little'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const L = 40, R = w - 40, T = top + 22, B = h - 78, lim = 22;
    // core: rectangle ring
    ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.rect(L, T, R - L, B - T); ctx.rect(L + lim, T + lim, R - L - 2 * lim, B - T - 2 * lim); ctx.fill('evenodd'); ctx.stroke(); ctx.restore();
    if (step === 4) for (let k = 1; k < 6; k++) line(ctx, [[L + (lim * k) / 6, T + 2], [L + (lim * k) / 6, B - 2]], col.muted, 1);
    const coil = (x, n, c, lab) => {
      for (let k = 0; k < n; k++) { const y = T + 20 + (k * (B - T - 40)) / (n - 1); line(ctx, [[x - 14, y - 4], [x + 14, y + 6]], c, 3); }
      text(ctx, lab, x, B + 18, { color: c, size: 12, weight: 700, align: 'center' });
    };
    coil(L + lim / 2, 7, col.s[0], 'primary Np = 100'); coil(R - lim / 2, step >= 2 ? 11 : 7, col.s[1], 'secondary Ns = 200');
    // flux: alternating direction
    const s = Math.sin(t * 3), cx = (L + R) / 2, cy = (T + B) / 2;
    if (step >= 0) {
      const dir = s >= 0 ? 1 : -1, a = Math.abs(s);
      ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * a;
      const pts = [[cx - 60, T + lim / 2], [cx + 60, T + lim / 2]];
      if (dir > 0) arrow(ctx, pts[0][0], pts[0][1], pts[1][0], pts[1][1], col.s[2], 3, 9); else arrow(ctx, pts[1][0], pts[1][1], pts[0][0], pts[0][1], col.s[2], 3, 9);
      const q = [[cx + 60, B - lim / 2], [cx - 60, B - lim / 2]];
      if (dir > 0) arrow(ctx, q[0][0], q[0][1], q[1][0], q[1][1], col.s[2], 3, 9); else arrow(ctx, q[1][0], q[1][1], q[0][0], q[0][1], col.s[2], 3, 9);
      ctx.restore();
      text(ctx, 'flux Φ', cx, cy - 6, { color: col.s[2], size: 12, weight: 700, align: 'center' });
      text(ctx, 'reverses each half cycle', cx, cy + 12, { color: col.muted, size: 10.5, align: 'center' });
    }
    const info = [
      ['Current in the primary coil sets up a flux that', 'rises, falls and reverses with the supply.'],
      ['The iron core guides almost all of the flux', 'through the secondary coil too.'],
      ['Vs/Vp = Ns/Np = 200/100: 230 V in, 460 V out.', 'More turns on the secondary means step-up.'],
      ['Vp Ip = Vs Is. Voltage doubles, so current halves:', 'Ip = 2 A in, Is = 1 A out (ideal case).'],
      ['Laminated core: less eddy current. Thick wire: less', 'heating. Soft iron: less hysteresis. Efficiency 95 to 99 %.'],
    ][step];
    text(ctx, info[0], 12, h - 38, { color: col.ink, size: 11.5, weight: 600 }); text(ctx, info[1], 12, h - 20, { color: col.ink, size: 11.5, weight: 600 });
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
