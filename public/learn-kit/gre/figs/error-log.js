// 9.3 Error log: sort sample misses into four kinds; the bars and the plan follow your sorting.
import { canvas, row, button, readout, text, title } from '../../kit.js';
import { stack, card, clear } from '../../gmat/figs/_verbal.js';
const K = { content: 'Content', method: 'Method', careless: 'Careless', timing: 'Timing' };
const FIX = { content: 'redo the lessons for those topics, with their practice sets', method: 'study the worked solutions and redo each question a day later', careless: 'add a checking step: re-read what the question asks before you choose', timing: 'use the pacing checkpoints from lesson 9.1 and guess earlier' };
const M = [
  { s: 'Probability question: I did not know to multiply for "and".', k: 'content' },
  { s: 'I found x = 6 but the question asked for x + 2.', k: 'careless' },
  { s: 'Assumption question: I picked a choice that was too strong.', k: 'method' },
  { s: 'Ran out of time on the last three questions of Quant 2.', k: 'timing' },
  { s: 'Median of an even list: I took one middle number, not the average of two.', k: 'content' },
  { s: 'Solved a rate question with long algebra when a table was faster, then rushed the next one.', k: 'method' },
  { s: 'Misread 15% as 1.5% in a table.', k: 'careless' },
  { s: 'Combinations: I did not know when order matters.', k: 'content' },
];
export default function (host) {
  let i = 0; const got = { content: 0, method: 0, careless: 0, timing: 0 };
  const box = stack(host), ctl = row(host);
  const cv = canvas(host, { aspect: 0.35, max: 170, min: 140, label: 'Misses by kind of error' });
  const out = readout(host);
  const show = () => { clear(box); if (i < M.length) card(box, `Miss ${i + 1} of ${M.length}: what kind?`, M[i].s); else card(box, 'All sorted', 'Your plan is below the chart.', 'good'); };
  const go = () => { cv.redraw(); const top = Object.entries(got).sort((a, b) => b[1] - a[1])[0];
    out.innerHTML = Object.values(got).some((v) => v) ? `Biggest kind so far: <b>${K[top[0]]}</b> (${top[1]}). First fix: ${FIX[top[0]]}.` : 'Sort each miss with the buttons.'; };
  Object.entries(K).forEach(([k, name]) => button(ctl, name, () => { if (i >= M.length) return; const ok = M[i].k === k; got[M[i].k]++;
    const note = ok ? '' : ` (most people would call this ${K[M[i].k]})`; i++; show(); go(); if (note) out.innerHTML += `<br>Last one${note}.`; }));
  button(row(host), 'Start again', () => { i = 0; Object.keys(got).forEach((k) => (got[k] = 0)); show(); go(); });
  cv.draw = (ctx, w, h, col) => { const ks = Object.keys(K), bw = (w - 40) / ks.length, max = 4;
    ks.forEach((k, j) => { const bh = (h - 60) * Math.min(got[k], max) / max, x = 20 + j * bw + bw * 0.2; ctx.fillStyle = col.s[j]; ctx.fillRect(x, h - 24 - bh, bw * 0.6, bh);
      text(ctx, `${K[k]} ${got[k]}`, x + bw * 0.3, h - 12, { color: col.ink, size: 11, align: 'center' }); });
    title(ctx, 'Misses by kind', col); };
  show(); go();
}
