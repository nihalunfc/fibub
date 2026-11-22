// Class 12 Biology, Biotechnology and its Applications (step player): how Bt toxin kills a cotton bollworm and spares people.
// The cry genes of Bacillus thuringiensis make an inactive crystal protein (protoxin). In the alkaline gut of the insect the crystal dissolves and
// proteases cut it to the active toxin, which binds receptors on the gut lining, forms pores and bursts the cells, so the insect dies.
// Human guts are acidic and lack the receptors, so the protein is not toxic to us.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'The gut of an insect larva: Bt protoxin crystals dissolve, the toxin binds to gut cells and makes holes' });
  const TITLES = ['1. Bacterium makes protoxin crystals', '2. The larva eats Bt cotton', '3. Alkaline gut activates the toxin', '4. Toxin binds to gut receptors', '5. Pores form, cells burst', '6. The insect dies'];
  const NOTES = ['The cry gene (cryIAc, cryIIAb) of Bacillus thuringiensis makes a crystal of inactive protein. In Bt cotton the plant cells make the same protein.', 'The pest eats leaf tissue that contains the protoxin crystal.', 'The gut is alkaline (pH about 9.5): the crystal dissolves and gut proteases cut the protoxin into active toxin.', 'The active toxin fits receptors on the cells that line the gut.', 'Toxin molecules gather into pores. The cells swell and burst; the gut wall is ruined.', 'The larva stops feeding and dies. Our stomach is acidic and our gut lacks the receptors, so Bt protein does not harm us.'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 6, gx = 16, gw = w - 32, gy = top + 14, lum = 70;
    ctx.fillStyle = col.soft; ctx.fillRect(gx, gy, gw, lum); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(gx, gy, gw, lum);
    text(ctx, 'gut lumen (inside)', gx + 6, gy + 10, { color: col.muted, size: 10 });
    const n = 7, cw = gw / n, ey = gy + lum;
    for (let i = 0; i < n; i++) {
      const burst = st >= 4 && i % 2 === 0, gone = st === 5;
      ctx.fillStyle = gone ? col.bad : burst ? col.warn : col.s[0]; ctx.globalAlpha = gone ? 0.4 : 0.35; ctx.fillRect(gx + i * cw + 2, ey, cw - 4, 40); ctx.globalAlpha = 1; ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.strokeRect(gx + i * cw + 2, ey, cw - 4, 40);
      if (!burst && !gone) dot(ctx, gx + i * cw + cw / 2, ey + 24, 5, col.panel, col.muted);
      if (st >= 3 && st < 5) { const mx = gx + i * cw + cw / 2; line(ctx, [[mx, ey - 1], [mx, ey - 7]], col.ink, 2); }
      if (st >= 4 && i % 2 === 0) { ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(gx + i * cw + cw / 2, ey, 6, 0, 7); ctx.fill(); }
    }
    for (let k = 0; k < 6; k++) {
      const x = gx + 20 + k * (gw / 6.3), y = gy + 24 + (k % 2) * 22;
      if (st === 0) { ctx.fillStyle = col.s[2]; ctx.fillRect(x - 6, y - 6, 12, 12); }
      else if (st === 1) { ctx.fillStyle = col.s[2]; ctx.fillRect(x - 6, y - 6, 12, 12); }
      else if (st === 2) { const k2 = k < 3 ? 1 : 0; ctx.fillStyle = k2 ? col.s[3] : col.s[2]; if (k2) dot(ctx, x, y, 5, col.s[3]); else ctx.fillRect(x - 6 + 2, y - 6 + 2, 8, 8); }
      else if (st >= 3 && st <= 4) { const tx = gx + (k % n + 0.5) * cw, ty = ey - 10 - (k % 2) * 3; dot(ctx, st === 3 ? x : tx, st === 3 ? y : ty, 5, col.s[3]); }
      else if (st === 5) dot(ctx, x, y, 3, col.muted);
    }
    if (st === 4) text(ctx, 'holes', gx + cw * 0.5, ey + 60, { color: col.bad, size: 10.5, weight: 700, align: 'center' });
    if (st === 2) text(ctx, 'pH about 9.5', w - 20, gy + 10, { color: col.s[3], size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'gut lining cells (with receptors)', gx + 6, ey + 54, { color: col.muted, size: 10 });
    text(ctx, st < 2 ? '■ protoxin crystal (inactive)' : '● active toxin   ■ protoxin', gx + 6, ey + 72, { color: col.s[2], size: 10.5, weight: 700 });
    NOTES[st].match(/.{1,48}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), w / 2, ey + 100 + i * 15, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 5); cv.redraw(); } };
}
