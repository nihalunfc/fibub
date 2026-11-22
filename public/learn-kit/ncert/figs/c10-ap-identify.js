// Class 10 Arithmetic Progressions: is it an AP? Pick a list of numbers; the figure draws the difference between each
// pair of neighbours. If every difference is the same, the list is an arithmetic progression and that common
// difference is d. Otherwise it is not an AP.
import { canvas, text, title, arrow, row, choice, readout } from '../../kit.js';

const LISTS = { a: [2, 5, 8, 11, 14], b: [20, 17, 14, 11, 8], c: [3, 3, 3, 3, 3], d: [1, 2, 4, 8, 16], e: [1, 4, 9, 16, 25], f: [0.5, 1, 1.5, 2, 2.5] };
const NAMES = [['a', '2, 5, 8…'], ['b', '20, 17, 14…'], ['c', '3, 3, 3…'], ['d', '1, 2, 4, 8…'], ['e', '1, 4, 9…'], ['f', '½, 1, 1½…']];
export default function (host) {
  let k = 'a';
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 290, label: 'A list of numbers with the difference between neighbours marked' });
  const ctl = row(host);
  choice(ctl, 'List', NAMES, k, (v) => { k = v; go(); });
  const out = readout(host);
  const diffs = () => LISTS[k].slice(1).map((v, i) => +(v - LISTS[k][i]).toFixed(6));
  const isAP = () => diffs().every((x) => Math.abs(x - diffs()[0]) < 1e-9);
  const go = () => { out.innerHTML = isAP() ? `Every difference is ${diffs()[0]}, so it is an <b>AP</b> with a = ${LISTS[k][0]} and d = ${diffs()[0]}.` : `The differences ${diffs().join(', ')} are not all equal, so it is <b>not an AP</b>.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Subtract each term from the next one', col) + 16, L = 12, bw = (w - 24) / 5, y = top + 30, ap = isAP();
    LISTS[k].forEach((v, i) => {
      const x = L + i * bw;
      ctx.fillStyle = col.soft; ctx.fillRect(x + 6, y - 18, bw - 12, 36); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.strokeRect(x + 6, y - 18, bw - 12, 36);
      text(ctx, String(v), x + bw / 2, y, { color: col.ink, size: 15, weight: 700, align: 'center' });
    });
    diffs().forEach((dv, i) => {
      const x = L + (i + 1) * bw, c = ap ? col.good : (Math.abs(dv - diffs()[0]) < 1e-9 ? col.s[1] : col.bad);
      arrow(ctx, x - bw / 2 - 4 + 4, y + 34, x + bw / 2 - 12, y + 34, c, 2.5);
      text(ctx, (dv > 0 ? '+' : dv < 0 ? '−' : '') + Math.abs(dv), x, y + 52, { color: c, size: 14, weight: 700, align: 'center' });
    });
    text(ctx, ap ? 'same difference every time: an AP' : 'the differences change: not an AP', w / 2, y + 90, { color: ap ? col.good : col.bad, size: 13, weight: 700, align: 'center' });
  };
  go();
}
