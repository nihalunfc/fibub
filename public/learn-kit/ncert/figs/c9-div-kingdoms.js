// Class 9 Diversity: a sorting game for the five-kingdom classification (R. H. Whittaker, 1969). Monera: bacteria, no
// nucleus. Protista: single-celled with a nucleus (amoeba, Paramecium, Euglena). Fungi: cell wall, cannot make food,
// absorb it from dead matter (yeast, mushroom, bread mould). Plantae: many cells, cell wall, chloroplasts, make food by
// photosynthesis. Animalia: many cells, no cell wall, eat food. Each card gives clues; tap the kingdom, get feedback.
import { canvas, text, title, dot, row, button, readout, rng } from '../../kit.js';

const K = [['mon', 'Monera'], ['pro', 'Protista'], ['fun', 'Fungi'], ['pla', 'Plantae'], ['ani', 'Animalia']];
const CARDS = [
  ['Bacteria in curd', 'mon', 'One tiny cell with no nucleus.'],
  ['Cyanobacteria (blue-green algae)', 'mon', 'One cell, no nucleus, but they photosynthesise.'],
  ['Amoeba', 'pro', 'One cell with a nucleus; takes in food by engulfing it.'],
  ['Paramecium', 'pro', 'One cell with a nucleus, covered in tiny hairs (cilia) that move it.'],
  ['Euglena', 'pro', 'One cell with a nucleus; makes food in sunlight and can also feed on others.'],
  ['Yeast', 'fun', 'One cell with a nucleus and a cell wall; absorbs food from sugary matter.'],
  ['Mushroom', 'fun', 'Many cells, cell wall, no chlorophyll; gets food from dead matter.'],
  ['Bread mould', 'fun', 'Threads of cells with a cell wall; feeds on stale bread.'],
  ['Mango tree', 'pla', 'Many cells with a cell wall; makes food using chlorophyll.'],
  ['Moss on a wall', 'pla', 'Small many-celled green organism that makes its own food.'],
  ['Rohu fish', 'ani', 'Many cells with no cell wall; eats other organisms.'],
  ['Butterfly', 'ani', 'Many cells with no cell wall; feeds on nectar.'],
];
export default function (host) {
  let order = [], i = 0, score = 0, tries = 0, msg = '', fb = null, slip = false;
  const shuffle = () => { const r = rng(Date.now() % 9973 + 1); order = CARDS.map((c, k) => [r(), k]).sort((a, b) => a[0] - b[0]).map((x) => x[1]); i = 0; score = 0; tries = 0; msg = ''; fb = null; slip = false; };
  shuffle();
  const cv = canvas(host, { aspect: 0.72, max: 380, min: 280, label: 'A card with an organism and clues to sort into one of the five kingdoms' });
  const ctl = row(host);
  K.forEach(([k, n]) => button(ctl, n, () => answer(k)));
  const ctl2 = row(host);
  button(ctl2, '↺ Shuffle and restart', () => { shuffle(); upd(); });
  const out = readout(host);
  function answer(k) {
    if (i >= CARDS.length) return;
    const c = CARDS[order[i]]; tries++;
    if (k === c[1]) { if (!slip) score++; slip = false; fb = true; msg = `Correct: ${c[0]} is in ${K.find((x) => x[0] === k)[1]}.`; i++; }
    else { slip = true; fb = false; msg = `Not ${K.find((x) => x[0] === k)[1]}. Read the clue again.`; }
    upd();
  }
  function upd() { out.textContent = i >= CARDS.length ? `Finished: ${score} of ${CARDS.length} right on the first try (${tries} taps in all). Press shuffle to try again.` : msg || 'Read the card and tap the kingdom it belongs to.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Five-kingdom sorter: card ${Math.min(i + 1, CARDS.length)} of ${CARDS.length}`, col);
    ctx.beginPath(); ctx.roundRect(16, 44, w - 32, h - 70, 12); ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = fb === false ? col.bad : fb ? col.good : col.line; ctx.lineWidth = 2.5; ctx.stroke();
    if (i >= CARDS.length) { text(ctx, `${score} / ${CARDS.length}`, w / 2, h / 2, { color: col.ink, size: 26, weight: 700, align: 'center' }); text(ctx, 'all sorted', w / 2, h / 2 + 28, { color: col.muted, size: 12, align: 'center' }); return; }
    const c = CARDS[order[i]];
    text(ctx, c[0], w / 2, 80, { color: col.ink, size: 15, weight: 700, align: 'center' });
    const words = c[2].split(' '); const L = []; let cur = ''; ctx.font = '12px system-ui'; words.forEach((wd) => { const t = cur ? cur + ' ' + wd : wd; if (ctx.measureText(t).width > w - 70) { L.push(cur); cur = wd; } else cur = t; }); L.push(cur);
    L.forEach((l, k) => text(ctx, l, w / 2, 116 + k * 18, { color: col.ink, size: 12, align: 'center' }));
    text(ctx, 'Clue', w / 2, 100, { color: col.muted, size: 10, align: 'center' });
    for (let k = 0; k < CARDS.length; k++) dot(ctx, w / 2 - (CARDS.length - 1) * 7 + k * 14, h - 42, 3.5, k < i ? col.good : col.line);
  };
  upd();
}
