// Build a sentence (an embedded or reported question): tap the chunks in order. Each chunk has a colour for its job, and
// the picture above shows the sentence as you build it. The rule to see: after "where", "if" or "what time" the subject comes
// before the verb ("where the library is"), not the question order ("where is the library").
import { choice, row, canvas, text, title } from '../kit.js';
import { box, tapOrder } from './_lang.js';

const S = {
  a: { parts: ['Could you tell me', 'where', 'the library', 'is?'], roles: ['Polite start', 'Question word', 'Subject', 'Verb'] },
  b: { parts: ['She asked', 'if', 'I', 'had finished.'], roles: ['Reporting', 'Link word', 'Subject', 'Verb'] },
  c: { parts: ['He wanted to know', 'what time', 'the train', 'leaves.'], roles: ['Reporting', 'Question words', 'Subject', 'Verb'] },
};
export default function (host) {
  let k = 'a', line = [];
  const cv = canvas(host, { aspect: 0.4, max: 150, min: 130, label: 'Chunks of a sentence coloured by job' });
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'Your sentence, by job', col);
    const s = S[k], n = s.parts.length, cw = (W - 24) / n;
    for (let i = 0; i < n; i++) { ctx.strokeStyle = col.line; ctx.setLineDash([4, 3]); ctx.strokeRect(12 + cw * i + 2, 38, cw - 4, 40); ctx.setLineDash([]); }
    line.forEach((p, i) => { ctx.fillStyle = col.s[p % 8]; ctx.globalAlpha = 0.3; ctx.fillRect(12 + cw * i + 2, 38, cw - 4, 40); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[p % 8]; ctx.lineWidth = 2; ctx.strokeRect(12 + cw * i + 2, 38, cw - 4, 40); text(ctx, s.parts[p], 12 + cw * (i + 0.5), 58, { color: col.ink, size: 11.5, weight: 600, align: 'center' }); text(ctx, s.roles[p], 12 + cw * (i + 0.5), 94, { color: col.s[p % 8], size: 10.5, weight: 700, align: 'center' }); });
  };
  const ctl = row(host), slot = box(host);
  const mount = () => { line = []; slot.innerHTML = ''; cv.redraw(); tapOrder(slot, { parts: S[k].parts, seed: 7, intro: 'Tap the chunks to make a correct sentence.', onChange: (l) => { line = l; cv.redraw(); } }); };
  choice(ctl, 'Sentence', [['a', 'Polite question'], ['b', 'Reported yes/no'], ['c', 'Reported wh-']], k, (v) => { k = v; mount(); });
  mount();
}
