// 12.7 Where the 21 cm line comes from, and how it maps the universe in 3D. A hydrogen atom's proton and electron
// are tiny magnets; with spins parallel the atom has 5.9 µeV more energy than with spins opposite. Flipping
// releases a photon of 1,420.4 MHz (21.1 cm). Each atom flips on average once in about 11 million years
// (A = 2.9 × 10⁻¹⁵ per second), but there is so much hydrogen that the line is bright. Expansion stretches it by
// (1 + z), so every frequency is a different distance and time: radio maps at many frequencies stack into a 3D map.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 290, label: 'A hydrogen atom flipping its spin, the 21 cm wave being stretched, and slices of the universe at different frequencies' });
  let step = 0;
  const spin = (ctx, x, y, r, up, c, lab, col, below) => {
    dot(ctx, x, y, r, c);
    arrow(ctx, x, y + (up ? r * 0.9 : -r * 0.9), x, y + (up ? -r * 1.9 : r * 1.9), col.ink, 2.5, 8);
    text(ctx, lab, x, below ? y + 2.2 * r + 16 : y - 2.2 * r - 14, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, ['Two tiny magnets', 'The flip: a 21 cm photon', 'Stretched on the way', 'A map in slices'][step], col) + 8;
    const cy = (top + h) / 2;
    if (step <= 1) {
      const flipped = step === 1;
      const x1 = Math.max(40, w * 0.16), x2 = x1 + 52, s = Math.min(1, w / 520);
      spin(ctx, x1, cy, 20 * s + 6, true, col.s[0], 'proton', col, true);
      spin(ctx, x2, cy, 10, !flipped, col.s[1], 'electron', col, false);
      text(ctx, flipped ? 'spins opposite: lower energy' : 'spins parallel: 5.9 µeV more energy', 12, top + 6, { color: col.muted, size: 11.5, halo: col.panel });
      if (flipped) {
        const pts = []; const x0 = x2 + 26, x3 = w - 16;
        for (let x = x0; x <= x3; x += 1) pts.push([x, cy + 12 * Math.sin(((x - x0) / 36) * Math.PI * 2)]);
        line(ctx, pts, col.s[3], 2.5);
        text(ctx, '21.1 cm · 1,420.4 MHz', (x0 + x3) / 2, cy - 30, { color: col.s[3], size: 12, weight: 700, align: 'center', halo: col.panel });
        text(ctx, 'once per atom every ~11 million years', (x0 + x3) / 2, cy + 36, { color: col.muted, size: 11, align: 'center', halo: col.panel });
      }
    } else if (step === 2) {
      const L = 20, R = w - 20;
      const rows = [[0, 'z = 0: 21 cm'], [6, 'z = 6: 1.5 m'], [17, 'z = 17: 3.8 m']];
      rows.forEach(([z, lab], i) => {
        const y = top + 26 + i * ((h - top - 40) / 3), lam = 9 * (1 + z) ** 0.75; // display wavelength (squashed)
        const pts = []; for (let x = L; x <= R; x += 1) pts.push([x, y + 12 + 10 * Math.sin(((x - L) / lam) * Math.PI * 2)]);
        line(ctx, pts, col.s[[0, 2, 3][i]], 2.2);
        text(ctx, lab, L, y - 6, { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
      });
      text(ctx, '(waves drawn squashed)', R, top + 4, { color: col.muted, size: 10.5, align: 'right' });
    } else {
      const ox = 24, oy = h - 26;
      dot(ctx, ox, oy, 6, col.ink);
      text(ctx, 'us', ox + 2, oy + 14, { color: col.ink, size: 11, weight: 700 });
      const R0 = Math.min(w - 60, (h - top) * 1.3);
      [[0.33, 'z = 6 · 203 MHz'], [0.58, 'z = 10 · 129 MHz'], [0.82, 'z = 17 · 79 MHz']].forEach(([f, lab], i) => {
        const r = R0 * f;
        ctx.save(); ctx.strokeStyle = col.s[[2, 1, 3][i]]; ctx.lineWidth = 7; ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(ox, oy, r, -Math.PI / 2 + 0.05, -0.05); ctx.stroke(); ctx.restore();
        const a = -0.55;
        text(ctx, lab, ox + r * Math.cos(a) + 8, oy + r * Math.sin(a), { color: col.ink, size: 11.5, weight: 700, halo: col.panel });
      });
      text(ctx, 'each frequency = one shell of space and time', w - 12, top + 4, { color: col.muted, size: 11, align: 'right' });
    }
  };
  cv.redraw();
  return { step(i) { step = Math.min(3, i); cv.redraw(); } };
}
