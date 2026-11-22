// Alternation of generations across the plant groups. Choose a group: the bars show how much of the plant you see is the
// haploid gametophyte (makes gametes) and how much is the diploid sporophyte (makes spores). The gametophyte shrinks and
// ends up dependent on the sporophyte as plants move onto land: moss to fern to seed plants.
import { canvas, row, choice, readout, text, title, clamp } from '../kit.js';

const G = {
  alga: { n: 'Algae (Chlamydomonas, Spirogyra)', g: 90, s: 10, note: 'Mostly haploid: the zygote is the only diploid cell (haplontic).', ex: 'Free-living haploid body; zygote divides by meiosis.' },
  bryo: { n: 'Bryophytes (moss, liverwort)', g: 85, s: 15, note: 'Dominant, independent gametophyte; sporophyte grows on it and depends on it.', ex: 'Leafy moss plant is n; the capsule on a stalk is 2n.' },
  ptero: { n: 'Pteridophytes (fern)', g: 15, s: 85, note: 'Dominant, independent sporophyte; small free-living gametophyte (prothallus).', ex: 'The leafy fern is 2n; the heart-shaped prothallus is n.' },
  gymno: { n: 'Gymnosperms (pine, cycas)', g: 4, s: 96, note: 'Sporophyte dominates; the gametophyte is a few cells held inside the sporophyte.', ex: 'Pollen grain and embryo sac are the reduced male and female gametophytes.' },
  angio: { n: 'Angiosperms (flowering plants)', g: 2, s: 98, note: 'Sporophyte dominates; gametophytes are tiny (pollen grain and 7-celled embryo sac), dependent.', ex: 'Seeds protect the next generation; double fertilisation.' },
};

export default function (host) {
  let key = 'bryo', anim = 0;
  const cv = canvas(host, { aspect: 0.62, max: 330, min: 260, label: 'Bars of how much of each plant group is gametophyte and sporophyte' });
  const c = row(host);
  choice(c, 'Group', Object.entries(G).map(([k, v]) => [k, v.n.split(' (')[0]]), key, (v) => { key = v; show(); });
  const out = readout(host);
  function show() { const g = G[key]; out.innerHTML = `<b>${g.n}.</b> ${g.note} ${g.ex} Gametophyte = haploid (n), makes gametes by mitosis; sporophyte = diploid (2n), makes spores by meiosis.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'What you see is mostly...', col);
    Object.entries(G).forEach(([k, g], i) => {
      const y = 44 + i * ((h - 60) / 5), bw = w - 130, on = k === key, bh = 24 * 1;
      ctx.globalAlpha = on ? 1 : 0.45; text(ctx, g.n.split(' (')[0], 10, y + bh / 2, { color: col.ink, size: 11, weight: on ? 700 : 400, fit: false });
      ctx.fillStyle = col.s[2]; ctx.fillRect(110, y, bw * g.g / 100, bh); ctx.fillStyle = col.s[0]; ctx.fillRect(110 + bw * g.g / 100, y, bw * g.s / 100, bh);
      if (g.g >= 12) text(ctx, 'n', 110 + bw * g.g / 200, y + bh / 2, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
      if (g.s >= 12) text(ctx, '2n', 110 + bw * g.g / 100 + bw * g.s / 200, y + bh / 2, { color: '#fff', size: 11, weight: 700, align: 'center', fit: false });
      if (on) { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(109, y - 1, bw + 2, bh + 2); }
      ctx.globalAlpha = 1;
    });
    text(ctx, 'green: gametophyte (n)   blue: sporophyte (2n)', w / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
