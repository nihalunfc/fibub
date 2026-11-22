// Living world: the taxonomic hierarchy as a ladder. Pick an organism and a rank: the ladder shows its seven
// obligate ranks (kingdom to species); the readout says which ranks it shares with the other organisms. Going up the
// ladder, a rank holds more organisms that share fewer characters. Data follow the usual NCERT Class 11 examples.
import { canvas, text, row, choice, readout } from '../../kit.js';

const RANKS = ['Kingdom', 'Phylum / Division', 'Class', 'Order', 'Family', 'Genus', 'Species'];
const ORG = {
  man: { name: 'Human', sci: 'Homo sapiens', t: ['Animalia', 'Chordata', 'Mammalia', 'Primata', 'Hominidae', 'Homo', 'sapiens'] },
  fly: { name: 'Housefly', sci: 'Musca domestica', t: ['Animalia', 'Arthropoda', 'Insecta', 'Diptera', 'Muscidae', 'Musca', 'domestica'] },
  mango: { name: 'Mango', sci: 'Mangifera indica', t: ['Plantae', 'Angiospermae', 'Dicotyledonae', 'Sapindales', 'Anacardiaceae', 'Mangifera', 'indica'] },
  wheat: { name: 'Wheat', sci: 'Triticum aestivum', t: ['Plantae', 'Angiospermae', 'Monocotyledonae', 'Poales', 'Poaceae', 'Triticum', 'aestivum'] },
};
export default function (host) {
  let cur = 'man', rank = 0;
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'The seven taxonomic ranks from kingdom to species for one organism' });
  const ctl = row(host);
  choice(ctl, 'Organism', Object.entries(ORG).map(([k, o]) => [k, o.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const ctl2 = row(host);
  choice(ctl2, 'Rank', RANKS.map((r, i) => [i, r.split(' ')[0]]), rank, (v) => { rank = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const o = ORG[cur], same = Object.values(ORG).filter((x) => x !== o && x.t[rank] === o.t[rank]).map((x) => x.name);
    out.innerHTML = `<b>${o.name}</b> (<i>${o.sci}</i>), ${RANKS[rank].toLowerCase()}: <b>${o.t[rank]}</b>. ` +
      (same.length ? `Shares this rank with: ${same.join(', ')}.` : 'None of the other three organisms share this rank.') +
      ` Higher ranks hold more organisms with fewer characters in common.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const o = ORG[cur], top = 26, bot = h - 14, step = (bot - top) / 7;
    text(ctx, 'more organisms, fewer shared characters', w / 2, 12, { color: col.muted, size: 10, align: 'center' });
    for (let i = 0; i < 7; i++) {
      const bw = w * (0.94 - i * 0.085), x = (w - bw) / 2, y = top + i * step, on = i === rank;
      ctx.fillStyle = on ? col.s[1] : col.soft; ctx.strokeStyle = on ? col.s[1] : col.line; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x, y + 2, bw, step - 5, 6); ctx.fill(); ctx.stroke();
      const lab = i === 6 ? `${o.t[5]} ${o.t[6]}` : o.t[i];
      text(ctx, RANKS[i], x + 8, y + step / 2, { color: on ? col.panel : col.muted, size: 10 });
      text(ctx, lab, x + bw - 8, y + step / 2, { color: on ? col.panel : col.ink, size: 12, weight: 600, align: 'right' });
    }
  };
  cv.redraw(); show();
}
