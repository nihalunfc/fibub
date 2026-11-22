// Class 12 Biology, Sexual Reproduction in Flowering Plants: how the agent of pollination shapes the flower.
// Wind (maize, grasses): small dull flowers, huge numbers of light dry pollen, feathery stigma. Insects (many showy flowers): colour, scent, nectar,
// sticky spiny pollen. Water (Vallisneria): male flowers or pollen float to the female flower on the surface.
import { canvas, text, title, row, choice, readout, loop, dot, line } from '../../kit.js';

export default function (host) {
  let mode = 'wind', t = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 280, label: 'Pollen carried from one flower to another by wind, an insect or water' });
  const ctl = row(host), ro = readout(host);
  const INFO = {
    wind: 'Wind (anemophily), e.g. maize, rice, grasses: flowers are small, dull and without scent or nectar; pollen is light, dry and made in huge numbers (a maize plant makes millions); the stigma is large and feathery to catch it.',
    insect: 'Insects (entomophily), e.g. mustard, sunflower, rose: flowers are showy, scented, with nectar; pollen is sticky or spiny so it clings to the animal. Bees, butterflies, beetles and birds are common visitors.',
    water: 'Water (hydrophily) is rare: it is found in a few water plants such as Vallisneria and Hydrilla. The female flower rises to the surface; the male flowers or their pollen float to it. Most water plants, like water lily, are pollinated by insects or wind.',
  };
  choice(ctl, 'Agent', [['wind', 'Wind'], ['insect', 'Insect'], ['water', 'Water']], 'wind', (v) => { mode = v; go(); });
  const go = () => { ro.textContent = INFO[mode]; cv.redraw(); };
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, { wind: 'Wind carries light dry pollen', insect: 'An insect carries sticky pollen', water: 'Water carries pollen on its surface' }[mode], col) + 6;
    const gy = h - 34, L = w * 0.18, R = w * 0.78, fy = gy - 105;
    const flower = (x, y, c, big) => { line(ctx, [[x, gy], [x, y]], col.s[2], 3); const n = big ? 6 : 4, pr = big ? 15 : 7; for (let i = 0; i < n; i++) { const a = i / n * 6.283; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * pr, y + Math.sin(a) * pr, pr * 0.8, pr * 0.5, a, 0, 7); ctx.fillStyle = c; ctx.fill(); } dot(ctx, x, y, big ? 6 : 4, col.s[3]); };
    if (mode === 'wind') {
      line(ctx, [[0, gy], [w, gy]], col.line, 1);
      flower(L, fy, col.s[2], false); flower(R, fy, col.s[2], false);
      for (let i = -3; i <= 3; i++) line(ctx, [[R, fy], [R + i * 6, fy - 22 - Math.abs(i) * 1.5]], col.muted, 1);
      text(ctx, 'feathery stigma', R, fy - 38, { color: col.muted, size: 10.5, align: 'center' });
      for (let k = 0; k < 26; k++) { const p = ((t * 0.18 + k * 0.137) % 1), x = L + p * (R - L), y = fy - 4 + Math.sin(k * 5 + p * 9) * 18 - p * 6 + (k % 5) * 3; dot(ctx, x, y, 2, col.s[3]); }
      for (let k = 0; k < 4; k++) { const y = top + 24 + k * 18, p = (t * 0.25 + k * 0.23) % 1; line(ctx, [[L + p * 40, y], [L + 60 + p * 40, y]], col.line, 2); }
      text(ctx, 'many tiny pollen grains', (L + R) / 2, fy + 28, { color: col.s[3], size: 11, weight: 700, align: 'center' });
    } else if (mode === 'insect') {
      line(ctx, [[0, gy], [w, gy]], col.line, 1);
      flower(L, fy, col.s[5], true); flower(R, fy, col.s[5], true);
      const p = (Math.sin(t * 1.1) + 1) / 2, bx = L + p * (R - L), by = fy - 36 - Math.sin(p * 3.14) * 22;
      ctx.beginPath(); ctx.ellipse(bx, by, 11, 7, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(bx - 3, by - 9, 8, 4, -0.5, 0, 7); ctx.fillStyle = col.panel; ctx.globalAlpha = 0.7; ctx.fill(); ctx.globalAlpha = 1; ctx.stroke();
      const carry = p > 0.5 ? 1 : 0; for (let k = 0; k < 3; k++) dot(ctx, bx - 5 + k * 5, by + 5, 1.8, carry ? col.s[1] : col.s[3]);
      text(ctx, p < 0.5 ? 'pollen sticks to the insect' : 'pollen rubs off on the new stigma', w / 2, top + 22, { color: col.ink, size: 11, weight: 600, align: 'center' });
      text(ctx, 'colour + scent + nectar', L, gy + 14, { color: col.s[5], size: 10.5, weight: 700, align: 'center' }); text(ctx, 'colour + scent + nectar', R, gy + 14, { color: col.s[5], size: 10.5, weight: 700, align: 'center' });
    } else {
      const wy = gy - 52;
      ctx.beginPath(); ctx.moveTo(0, wy); for (let x = 0; x <= w; x += 8) ctx.lineTo(x, wy + Math.sin(x / 18 + t * 2) * 3); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1;
      line(ctx, [[L, h - 10], [L, wy + 8]], col.s[2], 2); line(ctx, [[R, h - 10], [R, wy + 40]], col.s[2], 2);
      dot(ctx, L, wy - 3 + Math.sin(L / 18 + t * 2) * 3, 9, col.s[3], col.ink); text(ctx, 'male flower', L, wy - 20, { color: col.muted, size: 10.5, align: 'center' });
      line(ctx, [[R, wy + 40], [R + 0, wy + 6]], col.s[2], 2); dot(ctx, R, wy - 3 + Math.sin(R / 18 + t * 2) * 3, 11, col.s[5], col.ink); text(ctx, 'female flower', R, wy - 20, { color: col.muted, size: 10.5, align: 'center' });
      for (let k = 0; k < 8; k++) { const p = (t * 0.12 + k * 0.13) % 1, x = L + p * (R - L); dot(ctx, x, wy - 2 + Math.sin(x / 18 + t * 2) * 3, 2.4, col.s[3]); }
    }
  };
  go();
}
