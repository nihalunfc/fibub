// 18.1 Doctor time on visit notes: 8 minutes by hand against 3 minutes reviewing a local AI draft. Steps: one note;
// the draft and review; 25 notes a day; a five-day week.
import { text, title } from '../../kit.js';
import { stepFig, rect } from './b-lib.js';

const VIEW = [
  { unit: 'one note', k: 1, max: 10, ai: false },
  { unit: 'one note', k: 1, max: 10, ai: true },
  { unit: 'one day, 25 notes', k: 25, max: 250, ai: true },
  { unit: 'one week, 125 notes', k: 125, max: 1250, ai: true },
];
const fmtMin = (m) => (m >= 120 ? `${(m / 60).toFixed(1)} h` : `${m} min`);

export default function (host) {
  return stepFig(host, {
    aspect: 0.56, max: 300, min: 230, label: 'Doctor minutes on notes by hand and with an AI draft, for one note, a day and a week',
    draw(ctx, w, h, col, s) {
      const v = VIEW[s.step];
      title(ctx, `Doctor time: ${v.unit}`, col);
      const L = 104, R = w - 70, X = (m) => L + (m / v.max) * (R - L);
      const rows = [['By hand', 8 * v.k, col.s[1]]];
      if (v.ai) rows.push(['AI draft + check', 3 * v.k, col.s[0]]);
      rows.forEach(([lab, m, c], i) => {
        const y = 50 + i * 52, k = i === rows.length - 1 && s.step <= 1 ? s.e : 1;
        text(ctx, lab, 12, y + 14, { color: col.ink, size: 11.5, weight: 650 });
        rect(ctx, L, y, (X(m) - L) * k, 28, c);
        text(ctx, fmtMin(m), X(m) * 1 + 6, y + 14, { color: col.ink, size: 12, weight: 700, halo: col.panel });
      });
      if (v.ai) text(ctx, `Saved: ${fmtMin(5 * v.k)}${s.step === 1 ? ' (the draft itself takes about 30 s of machine time)' : ''}`, 12, h - 26, { color: col.ink, size: 12, weight: 650 });
    },
  });
}
