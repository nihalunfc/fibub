// Build an essay in the right order: tap the pieces of a four-paragraph opinion essay (made-up example) from first to last.
// Try it, then switch the essay type to see how the middle changes. Check tells you how many are in the right place.
import { choice, row, canvas, text, title } from '../kit.js';
import { tapOrder, box } from './_lang.js';

const ESSAYS = {
  opinion: { prompt: 'Some people think cities should ban cars from the centre. To what extent do you agree?', parts: [
    'Introduction: paraphrase the question, then give your view in one clear sentence.',
    'Body 1: first reason (less pollution), explained, with one example.',
    'Body 2: second reason (safer streets), explained, with one example.',
    'Body 3 (short): the other side (shops may lose customers) and why it matters less.',
    'Conclusion: restate your view in new words. No new ideas.' ], notes: ['about 40 words', 'about 70 words', 'about 70 words', 'about 50 words', 'about 30 words'] },
  discuss: { prompt: 'Some say online learning is better; others prefer classrooms. Discuss both views and give your opinion.', parts: [
    'Introduction: say there are two views and say which you lean towards.',
    'Body 1: view A (online): two reasons with an example.',
    'Body 2: view B (classroom): two reasons with an example.',
    'Conclusion: sum up both views and state your own opinion clearly.' ], notes: ['about 45 words', 'about 90 words', 'about 90 words', 'about 35 words'] },
  problem: { prompt: 'Many young people leave rural areas. What problems does this cause and what can be done?', parts: [
    'Introduction: paraphrase the topic and say you will cover problems and solutions.',
    'Body 1: the main problems (ageing villages, fewer services), with an example.',
    'Body 2: solutions (better jobs and internet), with an example of how each helps.',
    'Conclusion: sum up the problems and the best solution.' ], notes: ['about 40 words', 'about 90 words', 'about 90 words', 'about 35 words'] },
};
export default function (host) {
  let k = 'opinion', slot;
  const ctl = row(host);
  const prompt = box(host, 'font-size:14px;font-weight:600;margin:6px 0;');
  const cv = canvas(host, { aspect: 0.3, max: 120, min: 100, label: 'Word budget of the essay' });
  let placed = 0, solved = false;
  cv.draw = (ctx, W, H, col) => {
    const e = ESSAYS[k], w = e.notes.map((n) => parseInt(n.replace(/\D/g, ''), 10)), tot = w.reduce((a, b) => a + b, 0), y0 = title(ctx, solved ? 'Shape of a 250-word essay: bar width is the words' : 'Place every piece, then Check, to see the shape', col) + 8;
    let x = 10; const bw = W - 20;
    w.forEach((n, i) => { const wd = bw * n / tot; ctx.fillStyle = solved ? col.s[i % 8] : col.line; ctx.globalAlpha = solved ? 0.85 : 1; ctx.fillRect(x, y0, wd - 2, 34); ctx.globalAlpha = 1; if (solved) text(ctx, String(n), x + wd / 2, y0 + 17, { color: '#fff', size: 12, weight: 700, align: 'center', fit: false }); x += wd; });
    text(ctx, `${placed} of ${e.parts.length} pieces placed`, 10, y0 + 54, { color: col.muted, size: 12 });
  };
  slot = box(host);
  const mount = () => { const e = ESSAYS[k]; prompt.textContent = 'Question: ' + e.prompt; slot.innerHTML = ''; placed = 0; solved = false; cv.redraw(); tapOrder(slot, { parts: e.parts, notes: e.notes, block: true, seed: 4, intro: 'Tap the pieces in the order they appear in the essay.', onChange: (l, s) => { placed = l.length; solved = s; cv.redraw(); } }); };
  choice(ctl, 'Essay type', [['opinion', 'Opinion'], ['discuss', 'Discuss both views'], ['problem', 'Problem and solution']], k, (v) => { k = v; mount(); });
  mount();
}
