// How a language model picks the next word. Made-up scores for "I went to the ___". Temperature reshapes the
// probabilities, top-k keeps the k most likely words, top-p keeps the smallest group whose probabilities add to p;
// everything else is cut and the rest renormalised. Press "Draw 200" to see how often each word would really be chosen.
import { canvas, text, row, slider, button, readout, title } from '../kit.js';
import { softmax } from './_ai.js';
import { rng } from '../kit.js';

const W = [['park', 3.1], ['shop', 2.9], ['gym', 2.2], ['beach', 2.0], ['doctor', 1.6], ['library', 1.4], ['cinema', 1.1], ['office', 0.9], ['moon', -0.6], ['banana', -1.8]];
export default function (host) {
  let T = 1, K = 10, P = 1, counts = new Array(W.length).fill(0), total = 0, last = []; const R = rng(21);
  const cv = canvas(host, { aspect: 0.88, max: 400, min: 290, label: 'Next-word probabilities with temperature, top-k and top-p cuts' });
  const ctl = row(host);
  slider(ctl, { label: 'Temperature', min: 0.1, max: 2.5, value: 1, fmt: (v) => v.toFixed(2), oninput: (v) => { T = v; counts.fill(0); total = 0; show(); } });
  slider(ctl, { label: 'Top-k', min: 1, max: 10, step: 1, value: 10, fmt: (v) => Math.round(v), oninput: (v) => { K = Math.round(v); counts.fill(0); total = 0; show(); } });
  slider(ctl, { label: 'Top-p', min: 0.1, max: 1, step: 0.01, value: 1, fmt: (v) => v.toFixed(2), oninput: (v) => { P = v; counts.fill(0); total = 0; show(); } });
  const ctl2 = row(host);
  button(ctl2, 'Draw 1 word', () => draw(1));
  button(ctl2, 'Draw 200', () => draw(200));
  const out = readout(host);
  function dist() {
    const p = softmax(W.map((w) => w[1]), T), idx = p.map((_, i) => i).sort((a, b) => p[b] - p[a]);
    let cum = 0; const keep = new Set();
    idx.forEach((i, r) => { if (r < K && (cum < P || r === 0)) { keep.add(i); } cum += p[i]; });
    const s = [...keep].reduce((a, i) => a + p[i], 0);
    return { p, idx, keep, q: p.map((v, i) => (keep.has(i) ? v / s : 0)) };
  }
  function draw(n) {
    const { q } = dist();
    for (let k = 0; k < n; k++) { let r = R(), i = 0; for (; i < q.length - 1; i++) { r -= q[i]; if (r <= 0) break; } counts[i]++; total++; last.push(W[i][0]); }
    last = last.slice(-8); show();
  }
  function show() {
    const d = dist();
    out.innerHTML = `${d.keep.size} word${d.keep.size > 1 ? 's' : ''} stay in the running (top ${(d.idx.filter((i) => d.keep.has(i)).reduce((s, i) => s + d.p[i], 0) * 100).toFixed(0)}% of the raw probability). ${d.keep.size === 1 ? 'Only one choice left: it is always the same word (greedy).' : T < 0.4 ? 'Low temperature: the leader dominates.' : T > 1.5 ? 'High temperature: unlikely words get real chances.' : ''}${last.length ? ` Latest draws: ${last.join(', ')}.` : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const d = dist(); title(ctx, 'I went to the ___', col);
    const top = 40, rowH = (h - top - 14) / W.length, lab = 62, bw = w - lab - 54;
    const sc = Math.max(...d.p, ...d.q);
    d.idx.forEach((i, r) => {
      const y = top + r * rowH, kept = d.keep.has(i), v = d.p[i];
      text(ctx, W[i][0], lab - 6, y + rowH / 2, { color: kept ? col.ink : col.muted, size: 11.5, align: 'right', weight: kept ? 700 : 400, fit: false });
      ctx.fillStyle = col.line; ctx.fillRect(lab, y + 2, bw * v / sc, rowH - 4);
      if (kept) { ctx.fillStyle = col.s[0]; ctx.fillRect(lab, y + 5, bw * d.q[i] / sc, rowH - 10); }
      const edge = Math.max(v, d.q[i]) / sc * bw;
      text(ctx, kept ? (d.q[i] * 100).toFixed(0) + '%' : 'cut', lab + 6 + edge, y + rowH / 2, { color: kept ? col.s[0] : col.muted, size: 10.5, weight: kept ? 700 : 400, fit: false });
      if (total) { ctx.fillStyle = col.s[1]; ctx.fillRect(lab + Math.min(bw, bw * counts[i] / total / sc) - 2, y + 1, 4, rowH - 2); }
    });
    text(ctx, total ? `grey: raw probability · blue: after cuts · orange tick: ${total} draws` : 'grey: raw probability · blue: after the cuts, renormalised', 10, h - 6, { color: col.muted, size: 10 });
  };
  show();
}
