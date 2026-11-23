// Class 11 Anatomy: leaf sections. A dicot (dorsiventral) leaf has tall palisade cells under the upper skin, loose spongy cells below and more stomata underneath.
// A monocot (isobilateral) leaf looks alike on both sides, has stomata on both and bulliform cells that roll the leaf in dry air. A stoma opens when its guard cells take up water and swell.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

export default function (host) {
  let kind = 'di', turgor = 0.7;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Cross-section of a dicot or monocot leaf with a stoma whose opening follows the water in the guard cells' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Leaf', [['di', 'Dicot (dorsiventral)'], ['mo', 'Monocot (isobilateral)']], kind, (v) => { kind = v; go(); });
  slider(ctl, { label: 'Water in guard cells', min: 0, max: 1, step: 0.01, value: turgor, fmt: (v) => Math.round(v * 100) + ' %', oninput: (v) => { turgor = v; go(); } });
  const go = () => { ro.textContent = turgor > 0.5 ? 'Guard cells full of water are turgid and bend apart: the stoma opens, CO₂ comes in and water vapour goes out (transpiration).' : 'Guard cells that lose water go flaccid and straighten: the stoma closes and the leaf saves water.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, kind === 'di' ? 'Dicot leaf: two different faces' : 'Monocot leaf: both faces alike', col);
    const fy = footer(ctx, w, h, col, kind === 'di' ? 'Upper epidermis (cuticle), palisade, spongy with air spaces, vein with xylem above and phloem below, lower epidermis with more stomata.' : 'Same mesophyll on both sides (not split into palisade and spongy); stomata on both faces; big bulliform cells in the upper skin roll the leaf in dry weather.');
    const x0 = 14, x1 = w - 14, top = t0 + 24, hgt = Math.min(fy - top - 12, 190), bot = top + hgt, sp = 15;
    const rows = (a, b, ry, rx, fillc) => { for (let y = a + ry; y < b; y += ry * 2 + 2) for (let x = x0 + rx; x < x1 - rx + 1; x += rx * 2 + 3) ellipse(ctx, x + ((Math.round((y - a) / (ry * 2 + 2)) % 2) ? 0 : 0), y, rx, ry, fillc, col.s[2], 1); };
    ctx.fillStyle = col.soft; ctx.fillRect(x0, top, x1 - x0, hgt);
    const ep = 11;
    if (kind === 'di') {
      const pe = top + ep, pb = pe + hgt * 0.34;
      rows(pe, pb, hgt * 0.17, 5, col.s[2] + '99'); rows(pb + 2, bot - ep, 8, 9, col.soft);
      for (let x = x0 + 14; x < x1 - 14; x += 34) ellipse(ctx, x, (pb + bot) / 2 + 4, 14, 7, col.panel, col.line, 1);
      ctx.fillStyle = col.muted; ctx.fillRect(x0, top - 3, x1 - x0, 3);
      text(ctx, 'cuticle', x1, top - 12, { color: col.muted, size: 10, align: 'right' });
      ellipse(ctx, (x0 + x1) / 2 - 36, (pb + bot) / 2, 14, 11, col.s[3], col.ink, 1); ellipse(ctx, (x0 + x1) / 2 - 36, (pb + bot) / 2 + 6, 8, 4, col.s[2]);
      text(ctx, 'vein', (x0 + x1) / 2 - 36, (pb + bot) / 2 - 20, { color: col.ink, size: 10, align: 'center', halo: col.soft });
      text(ctx, 'palisade', x0 + 6, (pe + pb) / 2, { color: col.ink, size: 10.5, weight: 700, halo: col.soft }); text(ctx, 'spongy', x0 + 6, pb + 18, { color: col.ink, size: 10.5, weight: 700, halo: col.soft });
    } else {
      rows(top + ep, bot - ep, 8, 7, col.s[2] + '66');
      for (let x = x0 + 30; x < x1 - 30; x += 70) { ellipse(ctx, x, (top + bot) / 2, 11, 9, col.s[3], col.ink, 1); ellipse(ctx, x, (top + bot) / 2 + 3, 6, 3.5, col.s[2]); }
      for (let x = x0 + 14; x < x1 - 30; x += 44) ellipse(ctx, x + 10, top + ep + 4, 9, 9, col.panel, col.s[0], 1.2);
      text(ctx, 'bulliform cells', x0 + 6, top + ep + 24, { color: col.ink, size: 10, halo: col.soft });
    }
    ctx.fillStyle = col.s[1]; ctx.fillRect(x0, top, x1 - x0, ep - 3); ctx.fillRect(x0, bot - ep + 3, x1 - x0, ep - 3);
    text(ctx, 'upper epidermis', x0 + 4, top + 3.5, { color: col.panel, size: 9.5, weight: 700, fit: false });
    text(ctx, 'lower epidermis', x0 + 4, bot - 3.5, { color: col.panel, size: 9.5, weight: 700, fit: false });
    // a stoma on the lower epidermis (and on the upper too in the monocot)
    const stoma = (y, dir, sx) => {
      const gap = 1 + turgor * 8, gw = 9;
      ctx.fillStyle = col.panel; ctx.fillRect(sx - gap - gw, y - 7 * dir - 5, 2 * (gap + gw), 10);
      for (const s of [-1, 1]) { ctx.save(); ctx.translate(sx + s * (gap + gw * 0.5), y); ellipse(ctx, 0, 0, gw * 0.9, 7, col.s[4], col.ink, 1); ellipse(ctx, 0, 0, 2, 3, col.panel); ctx.restore(); }
      if (turgor > 0.5) for (let i = 0; i < 3; i++) { const ph = (Date.now() / 600 + i / 3) % 1; ellipse(ctx, sx, y + dir * (6 + ph * 18), 2.2, 2.2, col.s[0]); }
    };
    stoma(bot - 4, 1, x1 - 70); if (kind === 'mo') stoma(top + 4, -1, x1 - 140);
    text(ctx, 'stoma + guard cells', x1 - 70, bot + 16, { color: col.ink, size: 10, align: 'center' });
  };
  go();
}
