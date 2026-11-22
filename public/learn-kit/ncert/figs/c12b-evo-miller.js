// Class 12 Evolution (step player): the Miller-Urey experiment of 1953. A closed glass apparatus holds the early-Earth gases methane, ammonia, hydrogen and water vapour
// Electric sparks (lightning) drive reactions; the products are cooled, collect in a trap, and after a few days amino acids are found: organic molecules can form from simple gases.
import { canvas, text, title, line, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.98, max: 440, min: 290, label: 'Steps of the Miller-Urey experiment: gases, heated water, electric sparks, cooling and collection of amino acids' });
  const T = ['The set-up: a closed glass loop', 'Heat the water', 'Sparks: the lightning', 'Cool and condense', 'After a week: amino acids'];
  const NOTE = ['Miller and Urey filled a sealed apparatus with CH₄, NH₃, H₂ and water vapour, thought to be the gases of the early atmosphere. There was no oxygen.',
    'The water in the lower flask (the “ocean”) is heated; vapour rises and carries the gases round the loop.',
    'Two electrodes in the upper flask give electric sparks, like lightning, which gave the energy for new reactions.',
    'A condenser cools the gas mixture, so water with the new compounds drips into a trap and back to the ocean flask. The cycle runs for days.',
    'After about a week the liquid had turned brown-red and held amino acids (glycine, alanine and others). Organic molecules can form from non-living matter.'];
  const wrap = (ctx, s, x, y, wd, col) => { let l = '', yy = y; s.split(' ').forEach((word) => { const t = l ? l + ' ' + word : word; ctx.font = '11px system-ui'; if (ctx.measureText(t).width > wd && l) { text(ctx, l, x, yy, { color: col.ink, size: 11 }); yy += 14; l = word; } else l = t; }); text(ctx, l, x, yy, { color: col.ink, size: 11 }); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[step], col), L = 40, R = w - 50, top = t0 + 24, bot = t0 + 170;
    ctx.lineWidth = 3; ctx.strokeStyle = col.muted;
    // loop of tubing
    ctx.beginPath(); ctx.moveTo(L + 20, top + 30); ctx.lineTo(L + 20, bot - 50); ctx.moveTo(R - 20, top + 30); ctx.lineTo(R - 20, bot - 50); ctx.moveTo(L + 20, top + 30); ctx.lineTo((L + R) / 2 - 38, top + 30); ctx.moveTo(R - 20, top + 30); ctx.lineTo((L + R) / 2 + 38, top + 30); ctx.stroke();
    // upper flask
    const uc = (L + R) / 2; ctx.beginPath(); ctx.arc(uc, top + 30, 38, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.stroke();
    // lower flask
    ctx.beginPath(); ctx.arc(L + 20, bot - 14, 30, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.stroke(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(L + 20, bot - 8, 24, 0, Math.PI); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'ocean (water)', L + 20, bot + 28, { color: col.muted, size: 10.5, align: 'center' });
    // heater
    if (step >= 1) { ctx.fillStyle = col.s[3]; ctx.fillRect(L + 4, bot + 8 - 4, 32, 6); text(ctx, 'heat', L + 52, bot + 8 - 1, { color: col.s[3], size: 10.5, weight: 700 }); for (let k = 0; k < 3; k++) arrow(ctx, L + 36, bot - 56 - k * 22, L + 36, bot - 70 - k * 22, col.s[3], 2, 6); }
    // gases
    text(ctx, 'CH₄  NH₃  H₂  H₂O', uc, top + 30, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
    // sparks
    line(ctx, [[uc - 22, top + 8], [uc - 22, top + 18]], col.ink, 4); line(ctx, [[uc + 22, top + 8], [uc + 22, top + 18]], col.ink, 4);
    if (step === 2) { line(ctx, [[uc - 22, top + 18], [uc - 8, top + 26], [uc - 14, top + 32], [uc + 2, top + 36], [uc + 22, top + 44]], col.s[3], 3); text(ctx, 'sparks', uc, top - 10, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    // condenser and trap
    ctx.strokeStyle = col.muted; ctx.lineWidth = 12; ctx.globalAlpha = step >= 3 ? 0.45 : 0.15; line(ctx, [[R - 20, top + 36], [R - 20, top + 90]], col.s[0], 12); ctx.globalAlpha = 1;
    text(ctx, 'condenser', R - 14, top + 66, { color: col.muted, size: 10.5, align: 'right' }); if (step >= 3) text(ctx, 'cold water', R - 14, top + 80, { color: col.s[0], size: 10, align: 'right' });
    ctx.lineWidth = 3; ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(R - 20, bot - 50); ctx.lineTo(R - 20, bot - 6); ctx.lineTo(L + 54, bot - 6); ctx.stroke();
    const dr = step >= 3 ? Math.min(1, 0.3 + 0.2 * (step - 3)) : 0; ctx.fillStyle = step === 4 ? col.s[3] : col.s[0]; ctx.globalAlpha = 0.6; ctx.fillRect(R - 30, bot - 6 - 22 * dr, 20, 22 * dr); ctx.globalAlpha = 1; ctx.strokeStyle = col.muted; ctx.strokeRect(R - 30, bot - 28, 20, 22); text(ctx, 'trap', R - 20, bot + 12, { color: col.muted, size: 10.5, align: 'center' });
    if (step === 4) { text(ctx, 'amino acids:', R - 20, bot + 30, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'glycine, alanine...', R - 20, bot + 44, { color: col.s[3], size: 10.5, align: 'center' }); }
    wrap(ctx, NOTE[step], 12, h - 62, w - 24, col);
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
