// Retrieval-augmented generation, one stage at a time, with a tiny made-up company handbook: split into chunks, turn
// every chunk into a point (embedding), do the same for the question, pick the nearest chunks, paste them into the
// prompt, and let the model answer from them with a citation. Step through (or use Next).
import { canvas, text, row, button, readout, title, dot, line } from '../kit.js';
import { ownSteps, rr } from './_ai.js';

const CH = [['C1', 'Staff get 25 days of paid leave a year.', [0.30, 0.38]], ['C2', 'Leave requests go to your manager.', [0.45, 0.30]], ['C3', 'The office closes at 6 pm.', [0.80, 0.82]], ['C4', 'New staff have a 3-month probation.', [0.30, 0.62]], ['C5', 'Return your laptop on your last day.', [0.88, 0.50]], ['C6', 'Sick leave needs a note after 3 days.', [0.42, 0.45]]];
const Q = [0.36, 0.40], Qtext = 'How many days of leave do I get?';
const near = CH.map((c, i) => [i, Math.hypot(c[2][0] - Q[0], c[2][1] - Q[1])]).sort((a, b) => a[1] - b[1]);
const MSG = ['The handbook is a pile of text. The model has never seen it, so it cannot answer questions about it yet.',
  '1. Chunk: split the text into pieces small enough to be about one thing each.',
  '2. Embed: an embedding model turns each chunk into a list of numbers, a point on a map where similar meanings sit close. (Real maps have hundreds of dimensions; this has two.)',
  '3. Retrieve: the question is embedded too (star) and we take the 3 nearest chunks. Notice C1, C6 and C2 are all about leave; the unrelated ones stay far away.',
  '4. Augment: paste the retrieved chunks and the question into the prompt, with the instruction to answer only from them.',
  '5. Generate: the model reads the prompt and answers, pointing to the chunk it used. If no chunk helped, a good prompt lets it say "not in the handbook".'];
export default function (host) {
  let k = 0;
  const cv = canvas(host, { aspect: 1.25, max: 500, min: 400, label: 'A retrieval-augmented generation pipeline, stage by stage' });
  const out = readout(host);
  const draw = (i) => { k = Math.min(i, 5); out.innerHTML = MSG[k]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['The documents', 'Chunk', 'Embed', 'Retrieve', 'Augment the prompt', 'Generate'][k], col);
    const top = 38, rh = 21, top3 = near.slice(0, 3).map((n) => n[0]);
    CH.forEach(([id, t], i) => {
      const y = top + i * (rh + (k >= 1 ? 4 : 0)), hit = k >= 3 && top3.includes(i);
      if (k >= 1) { ctx.fillStyle = hit ? col.s[0] : col.soft; ctx.globalAlpha = hit ? 0.25 : 1; rr(ctx, 8, y, w - 16, rh, 4); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = hit ? col.s[0] : col.line; ctx.stroke(); }
      text(ctx, (k >= 1 ? id + ' ' : '') + t, 14, y + rh / 2, { color: hit || k < 3 ? col.ink : col.muted, size: 11, weight: hit ? 700 : 400 });
    });
    if (k >= 2) {
      const sy = top + 6 * (rh + 4) + 6, sh = Math.min(h - sy - (k >= 4 ? 120 : 14), 150), sx = 8, sw = k >= 4 ? w * 0.42 : w - 16;
      ctx.strokeStyle = col.line; ctx.strokeRect(sx, sy, sw, sh);
      const P = (p) => [sx + 14 + p[0] * (sw - 28), sy + sh - 14 - p[1] * (sh - 28)];
      if (k >= 3) near.slice(0, 3).forEach(([i]) => line(ctx, [P(Q), P(CH[i][2])], col.s[1], 1.5, [4, 3]));
      CH.forEach(([id, , p], i) => { const q = P(p), hit = k >= 3 && top3.includes(i); dot(ctx, q[0], q[1], hit ? 5 : 4, hit ? col.s[0] : col.muted); text(ctx, id, q[0] + 6, q[1] - 6, { color: hit ? col.ink : col.muted, size: 10, weight: hit ? 700 : 400, fit: false }); });
      if (k >= 3) { const q = P(Q); ctx.fillStyle = col.s[1]; ctx.beginPath(); for (let a = 0; a < 10; a++) { const r = a % 2 ? 4 : 9, an = (a * Math.PI) / 5 - Math.PI / 2; ctx.lineTo(q[0] + r * Math.cos(an), q[1] + r * Math.sin(an)); } ctx.fill(); text(ctx, 'question', q[0] + 10, q[1] + 10, { color: col.s[1], size: 10, weight: 700, fit: false }); }
      text(ctx, 'map of meanings', sx + 6, sy + 10, { color: col.muted, size: 9.5, fit: false });
    }
    if (k >= 4) {
      const px = w * 0.42 + 16, pw = w - px - 8, py = top + 6 * (rh + 4) + 6;
      ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; rr(ctx, px, py, pw, 128, 6); ctx.stroke();
      text(ctx, 'Prompt', px + 6, py + 11, { color: col.s[0], size: 11, weight: 700 });
      ['Answer only from these notes:', ...top3.map((i) => `[${CH[i][0]}] ${CH[i][1].split(' ').slice(0, 4).join(' ')}…`), 'Question: ' + Qtext.split(' ').slice(0, 5).join(' ') + '…'].forEach((s, j) => text(ctx, s, px + 6, py + 28 + j * 16, { color: col.ink, size: 10, weight: 400 }));
    }
    if (k >= 5) { const ay = h - 44; ctx.fillStyle = col.soft; rr(ctx, 8, ay, w - 16, 36, 6); ctx.fill(); ctx.strokeStyle = col.good; ctx.stroke(); text(ctx, 'Answer: 25 days of paid leave a year [C1].', 16, ay + 18, { color: col.ink, size: 12.5, weight: 700 }); }
    else if (k >= 3) text(ctx, 'Q: ' + Qtext, 8, h - 10, { color: col.s[1], size: 11, weight: 700 });
  };
  ownSteps(host, 6, draw, row, button);
  draw(0);
  return { step: (i) => draw(i) };
}
