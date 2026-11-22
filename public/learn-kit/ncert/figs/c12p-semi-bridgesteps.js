// Class 12 Semiconductors (step player): the bridge (full-wave) rectifier with four diodes. AC enters at the top and bottom corners; the load sits between the right (+) and left (-) corners.
// When the top terminal is positive, D1 and D4 conduct; when the bottom is positive, D2 and D3 conduct. Either way the current goes through the load in the SAME direction, so the output is pulsating DC.
// A capacitor across the load fills the gaps and smooths the pulses. Moving dots show the conventional current.
import { canvas, text, title, line, arrow, axes, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A bridge rectifier with four diodes showing which pair conducts in each half cycle' });
  const TITLES = ['Four diodes in a diamond', 'Top terminal positive: D1 and D4', 'Bottom terminal positive: D2 and D3', 'Same direction through the load', 'Add a smoothing capacitor'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col), cx = w * 0.4, cy = top + 78, d = Math.min(56, w * 0.14), Tp = [cx, cy - d], Bt = [cx, cy + d], Lf = [cx - d * 1.4, cy], Rg = [cx + d * 1.4, cy];
    const lx = cx + d * 1.4 + 52, wy = cy + d + 22, lxl = cx - d * 1.4 - 22;
    const on = (n) => (step === 1 && (n === 1 || n === 4)) || (step === 2 && (n === 2 || n === 3)) || step === 3 && false;
    const diode = (a, b, n, lab) => {
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), c = on(n) ? col.s[2] : col.ink;
      line(ctx, [a, b], on(n) ? col.s[2] : col.muted, on(n) ? 3 : 1.5);
      ctx.save(); ctx.translate(mx, my); ctx.rotate(ang); ctx.fillStyle = col.panel; ctx.fillRect(-9, -9, 18, 18); ctx.beginPath(); ctx.moveTo(-7, -7); ctx.lineTo(-7, 7); ctx.lineTo(6, 0); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); ctx.fillRect(6, -8, 2.5, 16); ctx.restore();
      const nx = -Math.sin(ang) * 17, ny = Math.cos(ang) * 17, sgn = (n === 1 || n === 3) ? -1 : 1;
      text(ctx, lab, mx + nx * sgn * 1.0, my + ny * sgn * 1.0, { color: col.muted, size: 10.5, weight: 700, align: 'center' });
    };
    diode(Tp, Rg, 1, 'D1'); diode(Bt, Rg, 2, 'D2'); diode(Lf, Tp, 3, 'D3'); diode(Lf, Bt, 4, 'D4');
    line(ctx, [Tp, [cx, cy - d - 18]], col.ink, 2); line(ctx, [Bt, [cx, cy + d + 8]], col.ink, 2);
    text(ctx, 'AC', cx + 14, cy - d - 18, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'AC', cx + 14, cy + d + 8, { color: col.ink, size: 11, weight: 700 });
    if (step === 1) text(ctx, '+', cx - 10, cy - d - 12, { color: col.s[2], size: 16, weight: 700, align: 'center' }), text(ctx, '−', cx - 10, cy + d + 10, { color: col.s[3], size: 16, weight: 700, align: 'center' });
    if (step === 2) text(ctx, '−', cx - 10, cy - d - 12, { color: col.s[3], size: 16, weight: 700, align: 'center' }), text(ctx, '+', cx - 10, cy + d + 10, { color: col.s[2], size: 16, weight: 700, align: 'center' });
    const path = [Rg, [lx, cy], [lx, wy], [lxl, wy], [lxl, cy], Lf];
    line(ctx, path, step >= 1 && step <= 3 ? col.muted : col.muted, 2);
    ctx.fillStyle = col.panel; ctx.fillRect(lx - 8, cy + 14, 16, 34); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(lx - 8, cy + 14, 16, 34); text(ctx, 'R', lx + 14, cy + 31, { color: col.ink, size: 11, weight: 700 });
    if (step === 4) { const kx = lx + 34; line(ctx, [[lx, cy], [kx, cy], [kx, cy + 18]], col.muted, 2); line(ctx, [[kx - 9, cy + 18], [kx + 9, cy + 18]], col.ink, 3); line(ctx, [[kx - 9, cy + 26], [kx + 9, cy + 26]], col.ink, 3); line(ctx, [[kx, cy + 26], [kx, wy], [lx, wy]], col.muted, 2); text(ctx, 'C', kx + 13, cy + 22, { color: col.ink, size: 11, weight: 700 }); }
    text(ctx, '+', lx + 14, cy - 8, { color: col.s[2], size: 14, weight: 700 }); text(ctx, '−', lx + 14, wy - 8, { color: col.s[3], size: 14, weight: 700 });
    if (step === 1 || step === 2) {
      const P = step === 1 ? [Tp, Rg, [lx, cy], [lx, wy], [lxl, wy], [lxl, cy], Lf, Bt] : [Bt, Rg, [lx, cy], [lx, wy], [lxl, wy], [lxl, cy], Lf, Tp];
      let tot = 0; const seg = P.slice(1).map((q, i) => { const l = Math.hypot(q[0] - P[i][0], q[1] - P[i][1]); tot += l; return l; });
      for (let k = 0; k < 6; k++) { let s = ((t * 70 + k * tot / 6) % tot), i = 0; while (s > seg[i]) { s -= seg[i]; i++; } const a = P[i], b = P[i + 1], f = s / seg[i]; ctx.beginPath(); ctx.arc(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, 4, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); }
    }
    const gy = cy + d + 56, L = (s, i, c = col.ink, wt = 400) => text(ctx, s, w / 2, gy + i * 17, { color: c, size: 11.5, weight: wt, align: 'center' });
    if (step === 0) { L('AC comes in at the top and bottom corners.', 0); L('Output is taken from the left and right corners.', 1, col.muted); }
    if (step === 1) { L('Current: top → D1 → load (top to bottom) → D4 → bottom.', 0, col.s[7], 700); L('D2 and D3 are reverse biased and block.', 1, col.muted); }
    if (step === 2) { L('Current: bottom → D2 → load (still top to bottom) → D3 → top.', 0, col.s[7], 700); L('D1 and D4 are now reverse biased.', 1, col.muted); }
    if (step === 3 || step === 4) {
      const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 11], xlabel: 'time (ms)', ylabel: 'V', l: 38, t: gy - 14, b: 38, yt: [0, 5, 10] }), pts = [], pf = [];
      let vc = 0; for (let x = 0; x <= 40; x += 0.2) { const v = Math.abs(10 * Math.sin(2 * Math.PI * 0.05 * x)); vc = Math.max(v, vc * Math.exp(-0.2 / 18)); pts.push([A.X(x), A.Y(v)]); pf.push([A.X(x), A.Y(vc)]); }
      ctx.save(); A.clip(); line(ctx, pts, step === 3 ? col.s[3] : col.line, step === 3 ? 3 : 1.5); if (step === 4) line(ctx, pf, col.s[3], 3); ctx.restore();
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
