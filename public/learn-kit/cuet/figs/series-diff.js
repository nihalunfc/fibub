// 4.1 The difference table: write a series, then the gaps between terms, then the gaps of the gaps, until a row
// is constant (or shows a pattern). Pick an example series.
import { canvas, text, row, choice, readout } from '../../kit.js';

export const SERIES = {
  'squares + 1': [2, 5, 10, 17, 26, 37],
  'add 3, 5, 7...': [4, 7, 12, 19, 28, 39],
  'cubes': [1, 8, 27, 64, 125, 216],
  '× 2 + 1': [3, 7, 15, 31, 63, 127],
};
export const diffs = (a) => a.slice(1).map((v, i) => v - a[i]);
export default function (host) {
  const cv = canvas(host, { aspect: 0.46, max: 280, min: 200, label: 'A series with rows of differences underneath' });
  let pick = 'add 3, 5, 7...';
  const ctl = row(host);
  choice(ctl, 'Series', Object.keys(SERIES), pick, (v) => { pick = v; cv.redraw(); say(); });
  const out = readout(host);
  const say = () => {
    const a = SERIES[pick], d1 = diffs(a), d2 = diffs(d1);
    const msg = new Set(d1).size === 1 ? 'The first differences are constant: an arithmetic series.'
      : new Set(d2).size === 1 ? 'The second differences are constant: the gaps grow steadily (a square-type series).'
      : 'Differences keep growing fast: try ratios instead (× 2 + 1 here), or cubes.';
    out.innerHTML = msg;
  };
  cv.draw = (ctx, w, h, col) => {
    let rows = [SERIES[pick]]; while (rows.length < 4 && rows.at(-1).length > 1) rows.push(diffs(rows.at(-1)));
    const n = rows[0].length, cw = (w - 30) / n, rh = (h - 10) / rows.length;
    rows.forEach((r, k) => r.forEach((v, i) => {
      const x = 15 + cw * (i + 0.5 + k / 2), y = 10 + rh * (k + 0.5);
      text(ctx, String(v), x, y, { color: k === 0 ? col.ink : col.s[k - 1], size: k === 0 ? 15 : 13, weight: k === 0 ? 700 : 600, align: 'center' });
    }));
    text(ctx, 'terms', 4, 10 + rh * 0.5, { color: col.muted, size: 10 });
  };
  cv.redraw(); say();
}
