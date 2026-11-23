// Class 11 Biology, The Living World: the taxonomic hierarchy. Seven ranks (kingdom, phylum or division, class, order, family, genus, species) nest like boxes in boxes.
// Each step down is a smaller group whose members share more features. Pick an organism and slide down the ranks, or press Play to zoom in.
import { canvas, text, title, row, slider, choice, readout, loop, rng } from '../../kit.js';
import { rr, note } from '../c11b-lib.js';

const RANKS = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
const ORG = {
  human: ['Human', ['Animalia', 'Chordata', 'Mammalia', 'Primata', 'Hominidae', 'Homo', 'sapiens']],
  mango: ['Mango', ['Plantae', 'Angiospermae', 'Dicotyledonae', 'Sapindales', 'Anacardiaceae', 'Mangifera', 'indica']],
  fly: ['House fly', ['Animalia', 'Arthropoda', 'Insecta', 'Diptera', 'Muscidae', 'Musca', 'domestica']],
  tiger: ['Tiger', ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'tigris']],
};
const MEMBERS = ['everything with cells that eat (or make) food in this way', 'animals with a body plan in common', 'animals sharing key traits', 'a smaller group of related families', 'close relatives with common features', 'very close species, sharing a first name', 'one kind of organism that can breed together'];
export default function (host) {
  let org = 'human', k = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'The seven ranks of the taxonomic hierarchy drawn as narrowing bars for the chosen organism' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Organism', Object.entries(ORG).map(([v, a]) => [v, a[0]]), org, (v) => { org = v; go(); });
  const sl = slider(ctl, { label: 'rank', min: 0, max: 6, step: 1, value: 0, fmt: (v) => RANKS[v], oninput: (v) => { k = v; go(); } });
  let acc = 0; const a2 = loop(host, (dt) => { acc += dt; if (acc > 0.9) { acc = 0; k = (k + 1) % 7; sl.set(k); go(); } }, { autoplay: false });
  a2.button(ctl);
  const go = () => { const c = ORG[org][1]; ro.textContent = `${ORG[org][0]}: ${RANKS[k]} ${k === 0 ? '' : ''}${c[k]}. At this level the group holds ${MEMBERS[k]}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, 'From kingdom down to species', col) + 6, bh = Math.min(34, (h - y0 - 44) / 7 - 4), c = ORG[org][1];
    for (let i = 0; i < 7; i++) {
      const frac = 1 - i * 0.115, bw = (w - 24) * frac, x = (w - bw) / 2, y = y0 + i * (bh + 4), on = i === k, past = i < k;
      rr(ctx, x, y, bw, bh, 6, on ? col.s[0] : past ? col.line : col.soft, on ? col.ink : col.line, on ? 2 : 1);
      const rank = i === 1 && org === 'mango' ? 'Division' : RANKS[i];
      text(ctx, `${rank}: ${c[i]}`, w / 2, y + bh / 2, { color: on ? col.panel : col.ink, size: 12, weight: on ? 700 : 500, align: 'center' });
    }
    note(ctx, 'Going down the bars: fewer organisms, more shared features.', 14, y0 + 7 * (bh + 4) + 8, w - 28, col, { size: 11, color: col.muted });
  };
  go();
}
