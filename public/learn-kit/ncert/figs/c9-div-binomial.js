// Class 9 Diversity: binomial nomenclature. Every species gets a two-part Latin name (Linnaeus): the GENUS (capital
// first letter) then the SPECIES (all small letters), written in italics (underlined if handwritten), e.g. Panthera tigris.
// Pick two organisms and the figure compares their classification rank by rank: the more ranks they share, the more
// closely related they are. Tiger and lion share a genus; tiger and cat only the family; tiger and human only the class;
// tiger and mango share nothing. Ranks follow standard taxonomy; plants use the division of flowering plants.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const RANK = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'];
const ORG = {
  tiger: ['Tiger', ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'tigris']],
  lion: ['Lion', ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Panthera', 'leo']],
  cat: ['House cat', ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Felis', 'catus']],
  dog: ['Dog', ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Canidae', 'Canis', 'familiaris']],
  human: ['Human', ['Animalia', 'Chordata', 'Mammalia', 'Primates', 'Hominidae', 'Homo', 'sapiens']],
  mango: ['Mango', ['Plantae', 'Magnoliophyta', 'Magnoliopsida', 'Sapindales', 'Anacardiaceae', 'Mangifera', 'indica']],
  neem: ['Neem', ['Plantae', 'Magnoliophyta', 'Magnoliopsida', 'Sapindales', 'Meliaceae', 'Azadirachta', 'indica']],
  banyan: ['Banyan', ['Plantae', 'Magnoliophyta', 'Magnoliopsida', 'Rosales', 'Moraceae', 'Ficus', 'benghalensis']],
  peepal: ['Peepal', ['Plantae', 'Magnoliophyta', 'Magnoliopsida', 'Rosales', 'Moraceae', 'Ficus', 'religiosa']],
};
export default function (host) {
  let a = 'tiger', b = 'lion';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Two organisms compared rank by rank from kingdom to species' });
  const ctl = row(host);
  const opts = Object.entries(ORG).map(([k, v]) => [k, v[0]]);
  choice(ctl, 'First', opts, a, (v) => { a = v; upd(); });
  choice(ctl, 'Second', opts, b, (v) => { b = v; upd(); });
  const out = readout(host);
  const shared = () => { let s = 0; for (let i = 0; i < 7; i++) { if (ORG[a][1][i] === ORG[b][1][i]) s++; else break; } return s; };
  function upd() {
    const s = shared(), A = ORG[a][1], B = ORG[b][1];
    out.innerHTML = a === b ? 'Same organism, so all seven ranks are shared.' : s === 0 ? `Different kingdoms: ${A[0]} and ${B[0]} share nothing in this table.` : s === 7 ? 'Same species.' : `They share the ranks down to <b>${RANK[s - 1]}</b> and separate at ${RANK[s]}. Names: <i>${A[5]} ${A[6]}</i> and <i>${B[5]} ${B[6]}</i>${A[5] === B[5] ? ' (same genus: the first word is the same)' : ''}.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'How close are two living things?', col);
    const A = ORG[a][1], B = ORG[b][1], x0 = 12, c1 = w * 0.5, c2 = w - 12, top = 62, rh = (h - top - 30) / 7;
    text(ctx, ORG[a][0], c1, 48, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    text(ctx, ORG[b][0], c2, 48, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    const s = shared();
    for (let i = 0; i < 7; i++) {
      const y = top + i * rh + rh / 2, same = A[i] === B[i] && i < s;
      ctx.fillStyle = same ? col.s[2] : col.soft; ctx.globalAlpha = same ? 0.25 : 1; ctx.fillRect(x0 - 2, y - rh / 2 + 2, w - 2 * x0 + 4, rh - 4); ctx.globalAlpha = 1;
      text(ctx, RANK[i], x0 + 2, y, { color: col.muted, size: 10.5 });
      text(ctx, A[i], c1, y, { color: col.ink, size: 10.5, weight: same ? 700 : 400, align: 'right' });
      text(ctx, B[i], c2, y, { color: col.ink, size: 10.5, weight: same ? 700 : 400, align: 'right' });
    }
    text(ctx, `Binomial names: ${A[5]} ${A[6]}  |  ${B[5]} ${B[6]}`, w / 2, h - 14, { color: col.ink, size: 10.5, align: 'center' });
  };
  upd();
}
