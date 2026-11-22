// Class 10 Our Environment (step player): the ozone layer and how CFCs thin it. Ozone (O3) in the stratosphere (about 15 to 35 km up)
// absorbs most of the Sun's harmful ultraviolet (UV) light. UV splits O2 into O atoms, and O + O2 makes O3. Chlorofluorocarbons (CFCs)
// from old refrigerators, air conditioners, aerosol sprays and foams drift up; UV frees chlorine atoms from them; each chlorine atom
// destroys ozone in a repeating cycle (Cl + O3 -> ClO + O2, then ClO + O -> Cl + O2), so one chlorine atom can destroy many thousands of O3.
import { canvas, text, title, line, dot, arrow, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.94, max: 440, min: 310, label: 'Ultraviolet rays, the ozone layer, and chlorine from CFCs destroying ozone molecules' });
  const TITLES = ['The ozone layer is a UV shield', 'How ozone forms: O₂ + UV, then O + O₂', 'CFCs rise from the ground', 'UV frees a chlorine atom', 'One chlorine destroys many ozone molecules', 'A thinner layer lets more UV through'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const atom = (ctx, col, x, y, r, c, l) => { dot(ctx, x, y, r, c, col.ink); if (l) text(ctx, l, x, y, { color: col.panel, size: Math.max(8, r), weight: 700, align: 'center' }); };
  const o3 = (ctx, col, x, y, a = 1) => { ctx.save(); ctx.globalAlpha = a; atom(ctx, col, x - 7, y + 3, 5, col.s[0]); atom(ctx, col, x + 7, y + 3, 5, col.s[0]); atom(ctx, col, x, y - 5, 5, col.s[0]); ctx.restore(); };
  const o2 = (ctx, col, x, y) => { atom(ctx, col, x - 5, y, 5, col.s[0]); atom(ctx, col, x + 5, y, 5, col.s[0]); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 4, ly0 = top + 70, ly1 = top + 120, ground = h - 56;
    const band = () => { ctx.save(); ctx.globalAlpha = step === 5 ? 0.1 : 0.22; ctx.fillStyle = col.s[0]; ctx.fillRect(0, ly0, w, ly1 - ly0); ctx.restore(); text(ctx, 'ozone layer (stratosphere)', 8, ly0 + 10, { color: col.muted, size: 9.5 }); };
    const earth = () => { ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.4; ctx.fillRect(0, ground, w, h - ground); ctx.globalAlpha = 1; text(ctx, 'Earth: people, plants, animals', w / 2, ground + 14, { color: col.ink, size: 10.5, align: 'center' }); };
    const uv = (x, k, stopAt) => { const y = top + 18 + k * (stopAt - top - 18); ctx.save(); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 14; i++) { const yy = top + 18 + (y - top - 18) * i / 13; ctx[i ? 'lineTo' : 'moveTo'](x + Math.sin(yy * 0.5) * 4, yy); } ctx.stroke(); ctx.restore(); };
    if (step === 0 || step === 5) {
      band(); earth(); dot(ctx, w * 0.1, top + 12, 11, col.s[3], col.ink);
      const thin = step === 5; for (let i = 0; i < (thin ? 5 : 11); i++) o3(ctx, col, 22 + i * (thin ? 62 : 34) + (thin ? 30 : 0), ly0 + 28 + (i % 3) * 8, thin ? 0.9 : 1);
      [0.2, 0.34, 0.5, 0.66, 0.82].forEach((f, i) => { const k = (t * 0.4 + i * 0.17) % 1; const hole = thin && (i === 1 || i === 3 || i === 2); uv(w * f, 0, ly0 + 8); if (!thin) { ctx.save(); ctx.globalAlpha = Math.max(0, 1 - k * 1.2); dot(ctx, w * f, ly0 + 8 + k * 20, 3, col.s[4]); ctx.restore(); } else { uv(w * f, 1, hole ? ground - 4 : ly0 + 8); if (hole) { ctx.save(); ctx.globalAlpha = 1; dot(ctx, w * f + Math.sin(ly1) * 0, ly1 + k * (ground - ly1 - 10), 3, col.s[4]); ctx.restore(); } } });
      text(ctx, step === 0 ? 'UV from the Sun is mostly absorbed here' : 'more UV reaches the ground: ↑ skin cancer, cataract, crop damage', w / 2, step === 0 ? ground - 26 : ground - 14, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      if (step === 5) text(ctx, 'Montreal Protocol (1987): CFCs phased out worldwide', w / 2, ground - 44, { color: col.ink, size: 10, align: 'center' });
      if (step === 0) text(ctx, 'Without it, strong UV would harm living things.', w / 2, ground - 12, { color: col.muted, size: 10, align: 'center' });
    }
    if (step === 1) { const y = top + 70, k = Math.min(1, t / 3);
      o2(ctx, col, w * 0.16, y); text(ctx, 'O₂', w * 0.16, y + 18, { color: col.muted, size: 10, align: 'center' }); arrow(ctx, w * 0.26, y, w * 0.38, y, col.s[4], 2.4); text(ctx, 'UV', w * 0.32, y - 11, { color: col.ink, size: 10, align: 'center' });
      atom(ctx, col, w * 0.5, y - 8, 5, col.s[0]); atom(ctx, col, w * 0.5 + 16, y + 8, 5, col.s[0]); text(ctx, '2 O atoms', w * 0.52, y + 26, { color: col.muted, size: 10, align: 'center' });
      const y2 = y + 86; atom(ctx, col, w * 0.1, y2, 5, col.s[0]); text(ctx, '+', w * 0.17, y2, { color: col.ink, size: 14, align: 'center' }); o2(ctx, col, w * 0.28, y2); arrow(ctx, w * 0.4, y2, w * 0.52, y2, col.ink, 2); o3(ctx, col, w * 0.66, y2 + 2); text(ctx, 'O₃ ozone', w * 0.66, y2 + 22, { color: col.muted, size: 10, align: 'center' });
      text(ctx, 'O + O₂ → O₃', w / 2, y2 + 52, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'This happens all the time high up, and ozone absorbs UV again as it breaks.', w / 2, h - 14, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 2) { band(); earth(); text(ctx, 'old fridge, AC, aerosol spray, foam', w * 0.5, ground - 6, { color: col.muted, size: 10, align: 'center' }); for (let i = 0; i < 6; i++) { const k = (t * 0.1 + i / 6) % 1, x = w * (0.2 + (i % 3) * 0.3) + Math.sin(t + i) * 8, y = ground - 14 - k * (ground - ly0 - 20); atom(ctx, col, x, y, 7, col.s[3]); text(ctx, 'CFC', x + 18, y, { color: col.ink, size: 9 }); }
      text(ctx, 'Very stable: it does not wash out, so it drifts up for years.', w / 2, top + 24, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 3) { band(); const cy = ly0 + 28, k = Math.min(1, t / 2.4); uv(w * 0.3, 0.7, cy - 14); atom(ctx, col, w * 0.3, cy, 9, col.s[3]); text(ctx, 'CFC', w * 0.3, cy + 20, { color: col.ink, size: 9.5, align: 'center' }); atom(ctx, col, w * 0.3 + 20 + k * 80, cy - k * 10, 6, col.s[1], 'Cl'); text(ctx, 'free Cl atom', w * 0.3 + 100, cy - 24, { color: col.ink, size: 10.5, weight: 700, align: 'left' }); text(ctx, 'UV breaks the CFC and a chlorine atom flies off.', w / 2, h - 30, { color: col.muted, size: 10.5, align: 'center' });
      for (let i = 0; i < 4; i++) o3(ctx, col, w * (0.12 + i * 0.22), ly1 + 36); }
    if (step === 4) { const y = top + 60, ph = Math.floor(t * 0.6) % 4, a = 1; text(ctx, 'Cl + O₃ → ClO + O₂', w / 2, y, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); atom(ctx, col, w * 0.16, y + 32, 6, col.s[1], 'Cl'); text(ctx, '+', w * 0.24, y + 32, { color: col.ink, size: 14, align: 'center' }); o3(ctx, col, w * 0.34, y + 32); arrow(ctx, w * 0.45, y + 32, w * 0.56, y + 32, col.ink, 2); atom(ctx, col, w * 0.64, y + 32, 6, col.s[1], 'Cl'); atom(ctx, col, w * 0.7, y + 32, 5, col.s[0]); o2(ctx, col, w * 0.84, y + 32);
      text(ctx, 'ClO + O → Cl + O₂', w / 2, y + 74, { color: col.ink, size: 12.5, weight: 700, align: 'center' }); atom(ctx, col, w * 0.14, y + 104, 6, col.s[1], 'Cl'); atom(ctx, col, w * 0.2, y + 104, 5, col.s[0]); text(ctx, '+ O', w * 0.3, y + 104, { color: col.ink, size: 12, align: 'center' }); arrow(ctx, w * 0.4, y + 104, w * 0.52, y + 104, col.ink, 2); atom(ctx, col, w * 0.62, y + 104, 6, col.s[1], 'Cl'); o2(ctx, col, w * 0.78, y + 104);
      text(ctx, 'Cl comes back unchanged, so it can do it again and again:', w / 2, y + 140, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'one Cl atom can destroy tens of thousands of O₃ molecules', w / 2, y + 156, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
