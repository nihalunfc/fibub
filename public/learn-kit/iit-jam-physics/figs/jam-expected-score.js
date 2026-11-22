// 8.1 Expected marks from answering a question you are not sure of, against your chance p of being right.
// JAM MCQs (Section A) lose one third of their marks when wrong; MSQ and NAT (Sections B and C) lose nothing.
// Break-even for an MCQ is p = 1/4: a pure guess among four options. Each option you can rule out raises p.
import { canvas, axes, line, dot, row, slider, choice, readout, fmt, title, text } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 250, label: 'Expected marks per question against the chance of being right, for JAM MCQs with negative marking and for MSQ and NAT questions without it' });
  let marks = 2, out4 = 0, n = 10;
  const ctl = row(host);
  choice(ctl, 'Question worth', [[1, '1 mark'], [2, '2 marks']], marks, (v) => { marks = v; cv.redraw(); show(); });
  choice(ctl, 'Options ruled out', [[0, 'none'], [1, 'one'], [2, 'two']], out4, (v) => { out4 = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Such questions', min: 1, max: 20, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; show(); } });
  const out = readout(host);
  const ev = (p) => p * marks - (1 - p) * marks / 3;
  const show = () => {
    const p = 1 / (4 - out4), e = ev(p);
    out.innerHTML = `Guessing at random among the <b>${4 - out4}</b> options left, p = <b>${fmt(p, 3)}</b>. One ${marks}-mark MCQ is worth <b>${e >= 0 ? '+' : ''}${fmt(e, 3)}</b> marks on average, so ${n} such guesses add about <b>${e >= 0 ? '+' : ''}${fmt(n * e, 3)}</b> marks (but any one paper can land well above or below that). An MSQ or NAT answer is never negative: a blank there throws away a free chance.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 1], y: [-marks / 3 - 0.1, marks + 0.1], xlabel: 'chance your answer is right, p', ylabel: 'expected marks', t: 34 });
    title(ctx, `Expected marks for one ${marks}-mark question`, col);
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(0)]], col.muted, 1.2);
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(marks)]], col.s[2], 2.2, [7, 5]);
    line(ctx, [[ax.X(0), ax.Y(ev(0))], [ax.X(1), ax.Y(ev(1))]], col.s[0], 2.8);
    [[0.25, 'blind guess'], [1 / 3, 'one ruled out'], [0.5, 'two ruled out']].forEach(([p, lab], i) => {
      const on = Math.abs(p - 1 / (4 - out4)) < 1e-9;
      dot(ctx, ax.X(p), ax.Y(ev(p)), on ? 7 : 4.5, on ? col.s[4] : col.s[0], col.panel);
      text(ctx, lab, ax.X(p) + 6, ax.Y(ev(p)) + 14 + i * 2, { color: on ? col.s[4] : col.muted, size: 11, weight: on ? 700 : 400, halo: col.panel });
    });
    text(ctx, 'MCQ (−1/3 when wrong)', ax.X(0.62), ax.Y(ev(0.62)) + 16, { color: col.s[0], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'MSQ / NAT (no negative)', ax.X(0.42), ax.Y(0.42 * marks) - 14, { color: col.s[2], size: 11.5, weight: 700, halo: col.panel });
    text(ctx, 'break-even p = 1/4', ax.X(0.25), ax.Y(0) - 12, { color: col.ink, size: 11, align: 'center', halo: col.panel });
    ctx.restore();
  };
  cv.redraw(); show();
}
