// Class 11 Biology, Biological Classification: a five-kingdom sorting game (Whittaker, 1969). Each organism card shows four clues: cell type (prokaryote or eukaryote), cell wall, body (single cell or many cells) and food.
// Pick the kingdom: Monera (prokaryotes), Protista (single-celled eukaryotes), Fungi (chitin wall, absorb food), Plantae (cellulose wall, photosynthesis) or Animalia (no wall, eat food). Fixed order of 12 cards, so the score is repeatable.
import { canvas, text, title, row, button, readout } from '../../kit.js';
import { rr, note } from '../c11b-lib.js';

const K = ['Monera', 'Protista', 'Fungi', 'Plantae', 'Animalia'];
// name, kingdom index, nucleus, wall, body, food, why
const C = [
  ['Bacillus (a rod-shaped bacterium)', 0, 'no (prokaryote)', 'peptidoglycan', 'one cell', 'absorbs or makes food', 'No true nucleus: prokaryote, so Monera.'],
  ['Nostoc (cyanobacterium)', 0, 'no (prokaryote)', 'peptidoglycan', 'chain of cells', 'photosynthesis', 'It photosynthesises but has no nucleus, so it is Monera, not Plantae.'],
  ['Amoeba', 1, 'yes', 'none', 'one cell', 'engulfs food', 'A single-celled eukaryote: Protista.'],
  ['Euglena', 1, 'yes', 'flexible pellicle', 'one cell', 'photosynthesis or eats', 'Single-celled eukaryote with both modes of nutrition: Protista.'],
  ['Diatom', 1, 'yes', 'silica shell', 'one cell', 'photosynthesis', 'A single-celled eukaryote (chrysophyte): Protista.'],
  ['Yeast', 2, 'yes', 'chitin', 'one cell', 'absorbs food', 'Chitin wall and absorptive nutrition: a Fungus, even though it is single-celled.'],
  ['Mushroom (Agaricus)', 2, 'yes', 'chitin', 'many cells (hyphae)', 'absorbs food', 'Hyphae with chitin walls, no chlorophyll: Fungi.'],
  ['Mango tree', 3, 'yes', 'cellulose', 'many cells', 'photosynthesis', 'Cellulose wall, photosynthesis: Plantae.'],
  ['Fern', 3, 'yes', 'cellulose', 'many cells', 'photosynthesis', 'A multicellular, photosynthetic eukaryote: Plantae.'],
  ['Hydra', 4, 'yes', 'none', 'many cells', 'eats other organisms', 'Multicellular, no wall, heterotroph: Animalia.'],
  ['Paramecium', 1, 'yes', 'none (pellicle)', 'one cell', 'engulfs food', 'Single-celled with a nucleus: Protista (not Animalia).'],
  ['Frog', 4, 'yes', 'none', 'many cells', 'eats other organisms', 'Multicellular, no wall, heterotroph: Animalia.'],
];
export default function (host) {
  let i = 0, ans = -1, score = 0, done = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 310, label: 'An organism card with four clues; choose its kingdom' });
  const ctl = row(host), ro = readout(host);
  const bs = K.map((k, j) => button(ctl, k, () => { if (ans >= 0) return; ans = j; done++; if (j === C[i][1]) score++; show(); }));
  const nx = button(ctl, 'Next organism ▶', () => { i = (i + 1) % C.length; ans = -1; if (i === 0) { score = 0; done = 0; } show(); });
  const show = () => { ro.textContent = ans < 0 ? `Score so far: ${score} of ${done}. Choose a kingdom.` : `${ans === C[i][1] ? 'Correct.' : 'Not quite: it is ' + K[C[i][1]] + '.'} ${C[i][6]} Score: ${score} of ${done}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, `Card ${i + 1} of ${C.length}`, col) + 6, c = C[i];
    rr(ctx, 10, y0, w - 20, h - y0 - 12, 10, col.soft, col.line);
    text(ctx, c[0], w / 2, y0 + 24, { color: col.ink, size: 15, weight: 700, align: 'center' });
    [['Nucleus', c[2]], ['Cell wall', c[3]], ['Body', c[4]], ['Food', c[5]]].forEach(([a, b], r) => { const y = y0 + 58 + r * 38; rr(ctx, 22, y - 14, w - 44, 30, 8, col.panel, col.line); text(ctx, a, 32, y, { color: col.muted, size: 11.5, weight: 700 }); text(ctx, b, w - 32, y, { color: col.ink, size: 12, weight: 600, align: 'right' }); });
    const yy = y0 + 58 + 4 * 38 + 6;
    if (ans >= 0) { const ok = ans === c[1]; rr(ctx, 22, yy, w - 44, 40, 8, ok ? col.s[1] : col.s[3], null); text(ctx, ok ? `✓ ${K[c[1]]}` : `✗ You chose ${K[ans]}; it is ${K[c[1]]}`, w / 2, yy + 20, { color: col.panel, size: 13, weight: 700, align: 'center' }); }
    else note(ctx, 'Read the four clues, then pick the kingdom below.', 22, yy + 14, w - 44, col, { size: 12, color: col.muted });
  };
  show();
}
