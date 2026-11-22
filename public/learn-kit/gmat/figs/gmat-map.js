// 1.1 The GMAT at a glance: three 45-minute sections in the order you choose, with what is in each one.
import { canvas, text, row, choice, readout, title } from '../../kit.js';
const S = [
  ['Quantitative Reasoning', 21, 'Problem Solving only: arithmetic, algebra, word problems, statistics, counting and probability. No calculator. No geometry.'],
  ['Verbal Reasoning', 23, 'Reading Comprehension (passages with 3 or 4 questions each) and Critical Reasoning (short arguments).'],
  ['Data Insights', 20, 'Data Sufficiency, Multi-Source Reasoning, Table Analysis, Graphics Interpretation and Two-Part Analysis. An on-screen calculator is allowed.'],
];
const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
export default function (host) {
  const cv = canvas(host, { aspect: 0.36, max: 220, min: 170, label: 'The three GMAT sections, 45 minutes each' });
  let order = 0, sel = 0;
  const ctl = row(host);
  choice(ctl, 'Section order', ORDERS.map((o, i) => [i, o.map((k) => 'QVD'[k]).join('-')]), 0, (v) => { order = v; cv.redraw(); });
  choice(ctl, 'Read about', S.map((s, i) => [i, s[0].split(' ')[0]]), 0, (v) => { sel = v; show(); cv.redraw(); });
  const out = readout(host);
  const show = () => { const [n, q, d] = S[sel]; out.innerHTML = `<b>${n}</b>: ${q} questions in 45 minutes, about ${(45 / q).toFixed(1)} minutes each. ${d}`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 14, R = w - 14, bw = (R - L - 2 * 26) / 3, y = h * 0.34, bh = h * 0.36;
    ORDERS[order].forEach((k, i) => {
      const x = L + i * (bw + 26), on = k === sel;
      ctx.fillStyle = on ? col.s[k] : col.soft; ctx.fillRect(x, y, bw, bh);
      ctx.strokeStyle = col.s[k]; ctx.lineWidth = 2; ctx.strokeRect(x, y, bw, bh);
      text(ctx, S[k][0], x + bw / 2, y + bh * 0.36, { color: on ? col.panel : col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, `${S[k][1]} questions · 45 min`, x + bw / 2, y + bh * 0.7, { color: on ? col.panel : col.muted, size: 11, align: 'center' });
      if (i < 2) text(ctx, '10 min break?', x + bw + 13, y + bh + 16, { color: col.muted, size: 9.5, align: 'center' });
    });
    text(ctx, 'Total: 64 questions, 2 h 15 min of testing, one optional 10-minute break', w / 2, h - 14, { color: col.muted, size: 11, align: 'center' });
    title(ctx, 'You choose the order before you start', col);
  };
  cv.redraw(); show();
}
