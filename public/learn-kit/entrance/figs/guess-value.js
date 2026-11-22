// 1.4 Should you guess? Expected marks from a guess, as you cross out wrong options, for each marking scheme.
import { canvas, axes, line, dot, text, row, choice, readout, fmt } from '../../kit.js';
import { PATTERNS, guessValue } from '../exams.js';

export default function (host, { data } = {}) {
  const ids = (data?.exams ?? 'jee-main,keam,cusat,comedk').split(',');
  let cur = ids[0], left = 4;
  const cv = canvas(host, { aspect: 0.55, max: 340, min: 230, label: 'Expected marks from a guess against how many options are left' });
  const ctl = row(host);
  choice(ctl, 'Exam', ids.map((id) => [id, PATTERNS[id].name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  choice(ctl, 'Options left', [[4, '4'], [3, '3'], [2, '2']], left, (v) => { left = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const p = PATTERNS[cur], e = guessValue(p, left);
    out.innerHTML = `${p.name}, ${left} options left: a guess is worth <b>${e >= 0 ? '+' : ''}${fmt(e, 3)}</b> marks on average. ${e > 0.001 ? 'Guessing pays on average.' : Math.abs(e) <= 0.001 ? 'Guessing breaks even: no gain, more risk.' : 'Guessing loses marks on average.'}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const p = PATTERNS[cur];
    const { X, Y } = axes(ctx, w, h, col, { x: [1.8, 4.2], y: [-0.5, 2.2], xt: [2, 3, 4], yt: [-0.5, 0, 0.5, 1, 1.5, 2], xlabel: 'Options left after crossing out', ylabel: 'Marks per guess', fy: (v) => fmt(v, 2) });
    line(ctx, [[X(1.8), Y(0)], [X(4.2), Y(0)]], col.muted, 1, [4, 4]);
    const pts = [2, 3, 4].map((k) => [X(k), Y(guessValue(p, k))]);
    line(ctx, pts, col.s[0], 2);
    [2, 3, 4].forEach((k, i) => dot(ctx, pts[i][0], pts[i][1], k === left ? 6 : 4, k === left ? col.s[1] : col.s[0]));
    text(ctx, 'break-even', X(4.15), Y(0) - 9, { color: col.muted, size: 10, align: 'right' });
  };
  cv.redraw(); show();
}
