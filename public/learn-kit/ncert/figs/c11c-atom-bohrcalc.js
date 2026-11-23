// Class 11 Chemistry, Structure of Atom (step player): the wavelength of the first Balmer line (n = 3 to n = 2) in hydrogen.
// E_n = -13.6 / n^2 eV; photon energy = E_3 - E_2 = 1.89 eV; wavelength = 1240 eV nm / 1.89 eV = 656 nm (red).
import { canvas, text, title, arrow } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Energy levels of hydrogen with the 3 to 2 jump and the wavelength worked out in steps' });
  const HEAD = ['Step 1: the two energy levels', 'Step 2: the energy of the photon', 'Step 3: from energy to colour'];
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, HEAD[st], col) + 12, E = (n) => -13.6 / (n * n), Y = (n) => t0 + 12 + (h - t0 - 80) * (1 / n);
    for (let n = 1; n <= 4; n++) { const hot = n === 2 || n === 3, y = Y(n); ctx.strokeStyle = hot ? col.s[n === 3 ? 3 : 0] : col.line; ctx.lineWidth = hot ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(w * 0.3, y); ctx.stroke(); text(ctx, `n = ${n}`, 6, y, { color: col.muted, size: 10.5 }); if (hot || st === 0) text(ctx, `${E(n).toFixed(2)} eV`, w * 0.3 + 6, y, { color: hot ? col.ink : col.muted, size: 11.5, weight: hot ? 700 : 400 }); }
    if (st >= 1) arrow(ctx, w * 0.25, Y(3), w * 0.25, Y(2), col.s[1], 2.5, 8);
    const x = w * 0.56, y = t0 + 24;
    if (st === 0) { text(ctx, 'E₃ = −13.6 / 9', x, y, { color: col.s[3], size: 12, weight: 700 }); text(ctx, '= −1.51 eV', x, y + 18, { color: col.s[3], size: 12, weight: 700 }); text(ctx, 'E₂ = −13.6 / 4', x, y + 46, { color: col.s[0], size: 12, weight: 700 }); text(ctx, '= −3.40 eV', x, y + 64, { color: col.s[0], size: 12, weight: 700 }); }
    if (st === 1) { text(ctx, 'ΔE = E₃ − E₂', x, y, { color: col.ink, size: 12, weight: 700 }); text(ctx, '= −1.51 − (−3.40)', x, y + 22, { color: col.ink, size: 12 }); text(ctx, '= 1.89 eV', x, y + 44, { color: col.s[1], size: 14, weight: 700 }); }
    if (st === 2) { text(ctx, 'λ = 1240 / ΔE', x, y, { color: col.ink, size: 12, weight: 700 }); text(ctx, '= 1240 / 1.89', x, y + 22, { color: col.ink, size: 12 }); text(ctx, '= 656 nm', x, y + 44, { color: col.s[1], size: 14, weight: 700 }); ctx.fillStyle = 'hsl(0,85%,50%)'; ctx.fillRect(x, y + 66, 90, 24); text(ctx, 'red, Balmer', x, y + 104, { color: col.muted, size: 11 }); }
    text(ctx, 'higher level = less negative energy', 8, h - 10, { color: col.muted, size: 10.5 });
  };
  return { step(i) { st = Math.min(i, 2); cv.redraw(); } };
}
