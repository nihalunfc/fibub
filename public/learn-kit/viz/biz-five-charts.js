// One small data set (made-up monthly sales for three product lines), five chart types, three questions. Pick a question,
// then try each chart: the note under it says whether that chart answers the question well, and why. The best chart is the
// one that makes the answer the easiest thing to see.
import { canvas, axes, line, text, title, row, choice, readout } from '../kit.js';

const CATS = ['Home', 'Outdoor', 'Kitchen'], MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const D = [[40, 42, 45, 50, 58, 64], [20, 24, 35, 52, 60, 66], [30, 29, 31, 28, 30, 27]];
const Q = {
  rank: ['Which line sold most in June?', { bars: [2, 'Best: bars sit on one baseline, so lengths compare instantly.'], lines: [1, 'OK: the line ends show it, but you read heights at one spot.'], pie: [1, 'Weak: a pie of one month hides the other five, and angles are hard to compare.'], stack: [1, 'Weak: only the bottom block shares a baseline.'], table: [1, 'Works, but you must read and compare numbers.'] }],
  trend: ['How did each line change over time?', { bars: [1, 'Crowded: 18 bars and no slope to follow.'], lines: [2, 'Best: lines show direction and speed; Outdoor\'s jump is obvious.'], pie: [0, 'Fails: a pie has no time axis.'], stack: [1, 'Only the bottom block has a readable trend.'], table: [1, 'All the numbers are there, but no shape.'] }],
  share: ['What share of June sales is each line?', { bars: [1, 'Fine for amounts; the share needs mental division.'], lines: [0, 'Fails: lines do not show parts of a whole.'], pie: [2, 'Good with only 3 parts: the whole circle is 100%. Label the slices.'], stack: [2, 'Good: one bar is the whole, blocks are parts (a 100% bar is better still).'], table: [1, 'Add a share column and it works.'] }],
};
const TY = [['bars', 'Bars'], ['lines', 'Lines'], ['pie', 'Pie'], ['stack', 'Stacked'], ['table', 'Table']];
export default function (host) {
  let q = 'rank', ty = 'bars';
  const cv = canvas(host, { aspect: 0.7, max: 380, min: 290, label: 'The same sales data drawn as five chart types' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Question', Object.entries(Q).map(([k, v]) => [k, v[0]]), q, (v) => { q = v; cv.redraw(); show(); });
  choice(c2, 'Chart', TY, ty, (v) => { ty = v; cv.redraw(); show(); });
  const out = readout(host);
  function show() { const [s, why] = Q[q][1][ty]; out.innerHTML = `<b style="color:${['var(--bad)', 'var(--warn)', 'var(--good)'][s]}">${['Poor fit', 'Usable', 'Good fit'][s]}.</b> ${why}`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, Q[q][0], col);
    const top = 36, B = h - 26, L = 40, R = w - 12;
    if (ty === 'bars') {
      const a = axes(ctx, w, h, col, { t: 40, x: [0, 6], y: [0, 70], xt: [], l: 36, b: 24 });
      MO.forEach((m, j) => { text(ctx, m, a.X(j + 0.5), a.B + 12, { color: col.muted, size: 10, align: 'center', fit: false }); CATS.forEach((c, i) => { const bw = (a.X(1) - a.X(0)) / 3.6; ctx.fillStyle = col.s[i]; ctx.fillRect(a.X(j) + 2 + i * bw, a.Y(D[i][j]), bw - 1, a.B - a.Y(D[i][j])); }); });
    } else if (ty === 'lines') {
      const a = axes(ctx, w, h, col, { t: 40, x: [0, 5], y: [0, 70], xt: [], l: 36, b: 24 });
      MO.forEach((m, j) => text(ctx, m, a.X(j), a.B + 12, { color: col.muted, size: 10, align: 'center', fit: false }));
      CATS.forEach((c, i) => { line(ctx, D[i].map((v, j) => [a.X(j), a.Y(v)]), col.s[i], 3); text(ctx, c, a.X(5) - 4, a.Y(D[i][5]) - 9, { color: col.s[i], size: 10, weight: 700, align: 'right', halo: col.panel }); });
    } else if (ty === 'pie') {
      const tot = D.reduce((a, r) => a + r[5], 0), cx = w * 0.36, cy = (top + B) / 2 + 4, r = Math.min(w * 0.3, (B - top) / 2); let a0 = -Math.PI / 2;
      CATS.forEach((c, i) => { const a1 = a0 + (D[i][5] / tot) * Math.PI * 2; ctx.fillStyle = col.s[i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, a0, a1); ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); text(ctx, `${c} ${Math.round((D[i][5] / tot) * 100)}%`, cx + r + 14, cy - 22 + i * 22, { color: col.ink, size: 12, weight: 700, fit: false }); a0 = a1; });
      text(ctx, '(June only)', cx, B + 8, { color: col.muted, size: 10, align: 'center' });
    } else if (ty === 'stack') {
      const a = axes(ctx, w, h, col, { t: 40, x: [0, 6], y: [0, 170], xt: [], l: 36, b: 24 });
      MO.forEach((m, j) => { text(ctx, m, a.X(j + 0.5), a.B + 12, { color: col.muted, size: 10, align: 'center', fit: false }); let base = 0; CATS.forEach((c, i) => { ctx.fillStyle = col.s[i]; const bw = a.X(1) - a.X(0) - 6; ctx.fillRect(a.X(j) + 3, a.Y(base + D[i][j]), bw, a.Y(base) - a.Y(base + D[i][j])); base += D[i][j]; }); });
    } else {
      const cw = (R - L) / 7; text(ctx, '', 0, 0, { color: col.ink });
      MO.forEach((m, j) => text(ctx, m, L + (j + 1.5) * cw, top + 12, { color: col.muted, size: 10.5, weight: 700, align: 'center', fit: false }));
      CATS.forEach((c, i) => { const y = top + 38 + i * 30; text(ctx, c, 10, y, { color: col.s[i], size: 11, weight: 700, fit: false }); D[i].forEach((v, j) => text(ctx, v, L + (j + 1.5) * cw, y, { color: col.ink, size: 12, align: 'center', fit: false })); });
    }
    if (ty !== 'pie' && ty !== 'table') CATS.forEach((c, i) => { text(ctx, c, 40 + i * 78, h - 4, { color: col.s[i], size: 10, weight: 700, fit: false }); });
  };
  show(); cv.redraw();
}
