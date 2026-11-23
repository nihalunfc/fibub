// Class 11 Biology, The Living World: biodiversity as 100 dots. Of every 100 species scientists have named (about 1.7 to 1.8 million in the NCERT figure), roughly half are insects.
// The shares are rounded teaching values, not exact counts; the real numbers change every year as new species are named. Pick a group to light up its dots.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr, note } from '../c11b-lib.js';

const G = [['Insects', 50, 0], ['Other animals', 20, 1], ['Plants', 20, 2], ['Fungi', 8, 3], ['Bacteria and others', 2, 4]];
export default function (host) {
  let pick = 'all';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A grid of 100 dots coloured by group of named species: insects, other animals, plants, fungi and others' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Show', [['all', 'All groups'], ...G.map((g) => [g[0], g[0]])], pick, (v) => { pick = v; upd(); cv.redraw(); });
  const upd = () => { const g = G.find((x) => x[0] === pick); ro.textContent = g ? `${g[0]}: about ${g[1]} of every 100 named species. Many more are still unnamed, so these shares will change.` : 'Of every 100 named species, about half are insects: the largest part of the diversity of life on Earth.'; };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, '100 named species (rounded)', col) + 8, size = Math.min(w - 40, h - y0 - 96), cell = size / 10, x0 = (w - size) / 2;
    let i = 0;
    G.forEach(([name, cnt, c]) => { for (let k = 0; k < cnt; k++, i++) { const gx = i % 10, gy = Math.floor(i / 10), on = pick === 'all' || pick === name; ctx.beginPath(); ctx.arc(x0 + gx * cell + cell / 2, y0 + gy * cell + cell / 2, cell * 0.38, 0, 7); ctx.fillStyle = col.s[c]; ctx.globalAlpha = on ? 1 : 0.15; ctx.fill(); ctx.globalAlpha = 1; } });
    G.forEach(([name, cnt, c], j) => { const lx = 12 + (j % 3) * ((w - 24) / 3), ly = y0 + size + 16 + Math.floor(j / 3) * 20; rr(ctx, lx, ly - 6, 12, 12, 3, col.s[c], null); text(ctx, `${name} ${cnt}`, lx + 17, ly, { color: col.ink, size: 10.5 }); });
  };
  upd();
}
