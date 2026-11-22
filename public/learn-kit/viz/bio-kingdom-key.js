// Five kingdoms by elimination. Answer the questions about an organism (or leave "any") and the kingdoms that still fit light
// up; the rest fade. Whittaker's five kingdoms use cell type, body organisation, cell wall and mode of nutrition. Viruses
// are not in any kingdom because they are not cellular.
import { canvas, row, choice, readout, text, title } from '../kit.js';

const K = [
  { n: 'Monera', ex: 'bacteria, cyanobacteria', cell: 'pro', body: 'uni', wall: 'yes', nut: ['auto', 'hetero'], note: 'prokaryotes; wall of peptidoglycan' },
  { n: 'Protista', ex: 'Amoeba, Paramecium, diatoms, Euglena', cell: 'eu', body: 'uni', wall: 'some', nut: ['auto', 'hetero'], note: 'unicellular eukaryotes' },
  { n: 'Fungi', ex: 'yeast, mushroom, Penicillium', cell: 'eu', body: 'both', wall: 'yes', nut: ['hetero'], note: 'chitin wall; absorb food' },
  { n: 'Plantae', ex: 'moss, fern, pine, mango', cell: 'eu', body: 'multi', wall: 'yes', nut: ['auto'], note: 'cellulose wall; photosynthesis' },
  { n: 'Animalia', ex: 'sponge, insect, fish, human', cell: 'eu', body: 'multi', wall: 'no', nut: ['hetero'], note: 'no cell wall; ingest food' },
];

export default function (host) {
  const ans = { cell: 'any', body: 'any', wall: 'any', nut: 'any' };
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 290, label: 'The five kingdoms that still fit the answers chosen' });
  const c = row(host), c2 = row(host);
  choice(c, 'Cell type', [['any', 'Any'], ['pro', 'No nucleus'], ['eu', 'True nucleus']], 'any', (v) => { ans.cell = v; show(); });
  choice(c, 'Body', [['any', 'Any'], ['uni', 'One cell'], ['multi', 'Many cells']], 'any', (v) => { ans.body = v; show(); });
  choice(c2, 'Cell wall', [['any', 'Any'], ['yes', 'Has one'], ['no', 'None']], 'any', (v) => { ans.wall = v; show(); });
  choice(c2, 'Food', [['any', 'Any'], ['auto', 'Makes its own'], ['hetero', 'Eats or absorbs']], 'any', (v) => { ans.nut = v; show(); });
  const out = readout(host);
  const fits = (k) => (ans.cell === 'any' || k.cell === ans.cell) && (ans.body === 'any' || k.body === ans.body || k.body === 'both') && (ans.wall === 'any' || k.wall === ans.wall || (k.wall === 'some')) && (ans.nut === 'any' || k.nut.includes(ans.nut));
  function show() { const f = K.filter(fits); out.innerHTML = f.length === 0 ? 'No kingdom fits these answers: a combination that does not occur. (Viruses and viroids have no cells at all, so they are placed outside the five kingdoms.)' : f.length === 1 ? `Only <b>${f[0].n}</b> fits: ${f[0].note}. Examples: ${f[0].ex}.` : `${f.length} kingdoms still fit: <b>${f.map((k) => k.n).join(', ')}</b>. Answer more questions to narrow it down.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Which kingdom fits?', col);
    const bh = (h - 56) / 5;
    K.forEach((k, i) => { const y = 40 + i * bh, ok = fits(k); ctx.globalAlpha = ok ? 1 : 0.25; ctx.fillStyle = col.s[i]; ctx.globalAlpha = ok ? 0.22 : 0.06; ctx.fillRect(10, y, w - 20, bh - 6); ctx.globalAlpha = ok ? 1 : 0.3; ctx.strokeStyle = col.s[i]; ctx.lineWidth = ok ? 2.5 : 1; ctx.strokeRect(10, y, w - 20, bh - 6); text(ctx, k.n, 18, y + 16, { color: col.ink, size: 13, weight: 700 }); text(ctx, k.note, 18, y + 32, { color: col.ink, size: 10.5 }); text(ctx, 'e.g. ' + k.ex, 18, y + 46, { color: col.muted, size: 10, fit: true }); ctx.globalAlpha = 1; });
  };
  show();
}
