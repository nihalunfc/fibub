// Sentence variety: each bar is one sentence, its length is the number of words, its colour is the type (simple, compound or
// complex). Switch between two made-up paragraphs on the same topic. Version A is all short and simple; version B mixes
// lengths and types, which is what "a range of structures" looks like.
import { canvas, text, title, row, choice, readout } from '../kit.js';

// [words, type]
const P = {
  a: { name: 'Version A', s: [['Cities are crowded.', 0], ['Traffic is heavy.', 0], ['Air is dirty.', 0], ['People are stressed.', 0], ['Rents are high.', 0], ['Many want to leave.', 0]] },
  b: { name: 'Version B', s: [['Cities are crowded.', 0], ['Traffic is heavy and the air is dirty, so many residents feel stressed.', 1], ['Although rents are high, people keep arriving because jobs are concentrated there.', 2], ['Some want to leave.', 0], ['If cities invested in transport, life there could improve.', 2]] },
};
const TYPES = ['Simple', 'Compound', 'Complex'];
export default function (host) {
  let k = 'b';
  const cv = canvas(host, { aspect: 0.7, max: 260, min: 220, label: 'Bars for each sentence, by length and type' });
  const ctl = row(host), out = readout(host);
  choice(ctl, 'Paragraph', [['a', 'Version A'], ['b', 'Version B']], k, (v) => { k = v; upd(); });
  const upd = () => { const s = P[k].s, w = s.map((x) => x[0].split(' ').length), avg = w.reduce((a, b) => a + b, 0) / w.length, types = new Set(s.map((x) => x[1])).size; out.textContent = `${s.length} sentences, ${avg.toFixed(1)} words on average, ${types} of 3 sentence types, longest ${Math.max(...w)} and shortest ${Math.min(...w)} words. ${types === 1 ? 'Every sentence is the same shape: it sounds choppy.' : 'A mix of short and longer sentences reads naturally and shows range.'}`; cv.redraw(); };
  cv.draw = (ctx, W, H, col) => {
    const y0 = title(ctx, P[k].name + ': one bar per sentence', col) + 4, s = P[k].s, n = s.length, rh = (H - y0 - 40) / n, mx = 14;
    s.forEach(([t, ty], i) => { const w = t.split(' ').length, y = y0 + i * rh + rh / 2; ctx.fillStyle = col.s[ty]; ctx.fillRect(34, y - rh * 0.3, (W - 50) * w / mx, rh * 0.6); text(ctx, String(i + 1), 12, y, { color: col.muted, size: 12 }); text(ctx, w + ' words', 40, y, { color: '#fff', size: 11, weight: 700, fit: false }); });
    TYPES.forEach((t, i) => { ctx.fillStyle = col.s[i]; ctx.fillRect(14 + i * ((W - 28) / 3), H - 26, 12, 12); text(ctx, t, 30 + i * ((W - 28) / 3), H - 20, { color: col.ink, size: 11.5, fit: false }); });
  };
  upd();
}
