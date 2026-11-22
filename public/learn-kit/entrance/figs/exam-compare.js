// 1.1 Exams side by side: pick an exam and see its questions per subject, time per question and marking.
import { canvas, text, row, choice, readout, fmt } from '../../kit.js';
import { PATTERNS } from '../exams.js';

export default function (host, { data } = {}) {
  const ids = (data?.exams ?? 'keam,cusat,comedk,jee-main,jee-adv').split(',');
  let cur = ids[0];
  const cv = canvas(host, { aspect: 0.5, max: 320, min: 220, label: 'Bar chart of questions per subject for the chosen exam' });
  const ctl = row(host);
  choice(ctl, 'Exam', ids.map((id) => [id, PATTERNS[id].name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const p = PATTERNS[cur], n = Object.values(p.q).reduce((a, b) => a + b, 0);
    out.innerHTML = `<b>${p.name}</b>: ${n} questions in ${p.min / 60} hours, about <b>${fmt((p.min * 60) / n, 2)} seconds</b> each. Right +${p.plus}, wrong ${p.minus ? '−' + p.minus : '0'}. Full marks ${n * p.plus}. ${p.note}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const p = PATTERNS[cur], subs = Object.entries(p.q), max = 90;
    const L = 86, R = w - 40, T = 30, rowH = (h - T - 16) / subs.length;
    text(ctx, `${p.name}: questions per subject`, 12, 14, { color: col.ink, size: 13, weight: 600 });
    subs.forEach(([s, q], i) => {
      const y = T + i * rowH + rowH / 2, bw = ((R - L) * q) / max;
      text(ctx, s, L - 8, y, { color: col.ink, size: 12, align: 'right' });
      ctx.fillStyle = col.s[i % 8]; ctx.fillRect(L, y - rowH * 0.32, bw, rowH * 0.64);
      text(ctx, `${q} (${q * p.plus} marks)`, L + bw + 6, y, { color: col.muted, size: 11 });
    });
  };
  cv.redraw(); show();
}
