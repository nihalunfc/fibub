// Class 11 Biology, Plant Kingdom: which groups have which feature? Pick a feature and the five plant groups light up in order from simple to complex.
// Algae: no vascular tissue, no seeds; bryophytes: no vascular tissue; pteridophytes: vascular tissue, no seeds; gymnosperms: naked seeds; angiosperms: seeds inside fruits, flowers.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { rr } from '../c11b-lib.js';

const G = ['Algae', 'Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'];
const F = {
  vasc: ['Vascular tissue (xylem and phloem)', [0, 0, 1, 1, 1], 'Vascular tissue first appears in pteridophytes; it carries water and food and lets plants grow tall.'],
  seed: ['Seeds', [0, 0, 0, 1, 1], 'Seeds appear in gymnosperms (naked) and angiosperms (inside a fruit). Seeds protect the embryo and store food.'],
  flower: ['Flowers and fruits', [0, 0, 0, 0, 1], 'Only angiosperms make flowers; the ovary becomes the fruit around the seeds.'],
  water: ['Water needed for fertilisation', [1, 1, 1, 0, 0], 'Mosses, ferns and most algae need water for the antherozoids to swim. Seed plants use pollen tubes, so they do not.'],
  spo: ['Sporophyte is the dominant body', [0, 0, 1, 1, 1], 'In algae (mostly) and bryophytes the gametophyte (n) dominates; from the ferns upward the sporophyte (2n) does.'],
  root: ['True roots, stem and leaves', [0, 0, 1, 1, 1], 'Algae have a thallus; mosses have root-like rhizoids and simple leaf-like parts; true organs start in ferns.'],
};
export default function (host) {
  let f = 'vasc';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Five plant groups with a chosen feature present or absent' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Feature', Object.entries(F).map(([v, a]) => [v, a[0].split(' (')[0]]), f, (v) => { f = v; ro.textContent = F[f][2]; cv.redraw(); });
  ro.textContent = F[f][2];
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, F[f][0], col) + 8, rh = (h - y0 - 36) / 5;
    G.forEach((g, i) => { const y = y0 + i * rh, on = F[f][1][i]; rr(ctx, 10, y, w - 20, rh - 8, 8, on ? col.s[1] : col.soft, on ? col.ink : col.line, on ? 1.8 : 1); text(ctx, g, 20, y + (rh - 8) / 2, { color: on ? col.panel : col.ink, size: 13, weight: 700 }); text(ctx, on ? 'YES' : 'no', w - 22, y + (rh - 8) / 2, { color: on ? col.panel : col.muted, size: 13, weight: 700, align: 'right' }); });
    text(ctx, 'simple  →  complex', w / 2, h - 16, { color: col.muted, size: 11, align: 'center' });
  };
}
