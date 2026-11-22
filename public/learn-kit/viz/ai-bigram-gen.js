// The smallest language model: count which word follows which in a tiny text, then generate by picking each next word
// by those counts. Press Next word to see the options and their odds; "Generate 20" runs it. Switch the memory from
// 1 word to 2 words: text gets more sensible but starts copying the source, the trade-off every language model faces.
import { canvas, text, row, choice, button, readout, title } from '../kit.js';
import { rng } from '../kit.js';

const TEXTS = {
  rhyme: ['Rain', 'the sun is up and the sky is blue and the bird is up and the bird is in the sky and the sun is in the sky and the rain is on the roof and the cat is on the roof and the cat is in the sun'],
  cook: ['Cooking', 'add the rice to the pot and add the water to the pot then stir the rice and cover the pot then cook the rice for ten minutes and add the salt to the water and stir the pot and serve the rice with the dal'],
  net: ['Networks', 'a neural network is a function and a function maps inputs to outputs and a neural network learns the function from data and the data has inputs and outputs and a model learns from the data and a model predicts the next word'],
};
export default function (host) {
  let tx = 'rhyme', ctxN = 1, gen = [], seed = 1, R = rng(1);
  const cv = canvas(host, { aspect: 0.75, max: 360, min: 270, label: 'Next-word odds for a tiny word-pair language model and the text it generates' });
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'Source', Object.entries(TEXTS).map(([k, v]) => [k, v[0]]), tx, (v) => { tx = v; reset(); });
  choice(ctl, 'Memory', [[1, '1 word'], [2, '2 words']], ctxN, (v) => { ctxN = v; reset(); });
  button(ctl2, 'Next word', () => add(1)); button(ctl2, 'Generate 20', () => add(20)); button(ctl2, 'Restart', () => reset());
  const out = readout(host);
  const words = () => TEXTS[tx][1].split(' ');
  const table = () => { const w = words(), m = new Map(); for (let i = ctxN; i < w.length; i++) { const k = w.slice(i - ctxN, i).join(' '); const o = m.get(k) || new Map(); o.set(w[i], (o.get(w[i]) || 0) + 1); m.set(k, o); } return m; };
  function reset() { seed++; R = rng(seed * 7); gen = words().slice(0, ctxN); show(); }
  function opts() { return [...(table().get(gen.slice(-ctxN).join(' ')) || [])].sort((a, b) => b[1] - a[1]); }
  function add(n) { for (let i = 0; i < n; i++) { const o = opts(); if (!o.length) { gen = words().slice(0, ctxN); continue; } let tot = o.reduce((s, a) => s + a[1], 0), r = R() * tot, c = 0; for (const [wd, k] of o) { c += k; if (r <= c) { gen.push(wd); break; } } } show(); }
  function show() {
    const o = opts(), tot = o.reduce((s, a) => s + a[1], 0);
    out.innerHTML = `After "<b>${gen.slice(-ctxN).join(' ')}</b>" the source text continued ${o.length === 1 ? 'only one way' : o.length + ' ways'}${o.length === 1 ? ', so the next word is certain: this is how copying happens' : ''}. Generated: <i>${gen.slice(-24).join(' ')}</i>`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const o = opts(), tot = o.reduce((s, a) => s + a[1], 0) || 1; title(ctx, `Next word after "${gen.slice(-ctxN).join(' ')}"`, col);
    const top = 40, rh = Math.min(24, (h - top - 10) / Math.max(1, Math.min(o.length, 8)));
    o.slice(0, 8).forEach(([wd, k], i) => { const y = top + i * rh; text(ctx, wd, 78, y + rh / 2, { color: col.ink, size: 12, align: 'right', weight: 700, fit: false }); ctx.fillStyle = col.s[0]; ctx.fillRect(84, y + 3, ((w - 150) * k) / tot, rh - 6); text(ctx, `${Math.round((100 * k) / tot)}%  (${k} of ${tot})`, 90 + ((w - 150) * k) / tot, y + rh / 2, { color: col.muted, size: 10.5, fit: false }); });
    if (!o.length) text(ctx, 'never seen: restarts', 20, top + 12, { color: col.muted, size: 12 });
  };
  reset();
}
