// Class 9 Sequences: finding the rule. Look at the differences between neighbouring terms and the ratios of
// neighbouring terms. A constant difference means an arithmetic progression (AP); a constant ratio means a geometric one;
// the square numbers have differences 3, 5, 7 ... which themselves form an AP.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const SEQ = {
  ap: { name: '2, 5, 8, 11 ...', t: [2, 5, 8, 11, 14, 17, 20], kind: 'AP' },
  gp: { name: '3, 6, 12, 24 ...', t: [3, 6, 12, 24, 48, 96, 192], kind: 'geometric' },
  sq: { name: '1, 4, 9, 16 ...', t: [1, 4, 9, 16, 25, 36, 49], kind: 'neither' },
  fib: { name: '1, 1, 2, 3, 5 ...', t: [1, 1, 2, 3, 5, 8, 13], kind: 'neither' },
};
export default function (host) {
  let k = 'ap', showD = true, showR = false;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'A sequence with the differences and ratios between its terms to decide what kind it is' });
  const ctl = row(host);
  choice(ctl, 'Sequence', Object.entries(SEQ).map(([i, d]) => [i, d.name]), k, (v) => { k = v; sync(); });
  const c2 = row(host);
  choice(c2, 'Show', [['d', 'Differences'], ['r', 'Ratios'], ['b', 'Both']], 'd', (v) => { showD = v !== 'r'; showR = v !== 'd'; cv.redraw(); });
  const out = readout(host);
  const diffs = (t) => t.slice(1).map((v, i) => v - t[i]);
  const note = () => {
    const t = SEQ[k].t, d = diffs(t), dd = diffs(d);
    if (new Set(d).size === 1) return `The differences are all ${d[0]}: constant, so this is an <b>arithmetic progression</b> with a = ${t[0]} and d = ${d[0]}.`;
    if (new Set(t.slice(1).map((v, i) => v / t[i])).size === 1) return `The ratios are all ${t[1] / t[0]}: constant, so this is a <b>geometric progression</b> with a = ${t[0]} and r = ${t[1] / t[0]}.`;
    if (new Set(dd).size === 1) return `Neither the differences nor the ratios are constant, so it is not an AP or a GP. But the differences ${d.join(', ')} go up by ${dd[0]} each time: this is the pattern of square numbers, n × n.`;
    return `Neither differences nor ratios are constant. This is the Fibonacci pattern: each term is the sum of the two before it, 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5 ...`;
  };
  function sync() { out.innerHTML = note(); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Find the rule: differences and ratios', col), t = SEQ[k].t, d = diffs(t), r = t.slice(1).map((v, i) => v / t[i]), cw = (w - 30) / t.length, x = (i) => 16 + cw * (i + 0.5), fmt = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
    text(ctx, 'terms', 4, top + 20, { color: col.muted, size: 10 });
    t.forEach((v, i) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(x(i) - cw / 2 + 2, top + 28, cw - 4, 30); ctx.globalAlpha = 1; text(ctx, String(v), x(i), top + 43, { color: col.ink, size: 14, weight: 700, align: 'center' }); });
    let y = top + 84;
    if (showD) {
      text(ctx, 'difference (add)', 4, y - 12, { color: col.s[2], size: 10, weight: 700 });
      d.forEach((v, i) => { const mid = (x(i) + x(i + 1)) / 2, same = new Set(d).size === 1; text(ctx, '+' + v, mid, y + 4, { color: same ? col.s[2] : col.ink, size: 12, weight: same ? 700 : 400, align: 'center' }); });
      y += 52;
    }
    if (showR) {
      text(ctx, 'ratio (multiply)', 4, y - 12, { color: col.s[3], size: 10, weight: 700 });
      const same = new Set(r.map((v) => +v.toFixed(6))).size === 1;
      r.forEach((v, i) => { const mid = (x(i) + x(i + 1)) / 2; text(ctx, '×' + fmt(v), mid, y + 4, { color: same ? col.s[3] : col.ink, size: 12, weight: same ? 700 : 400, align: 'center' }); });
      y += 52;
    }
    text(ctx, 'It is: ' + (SEQ[k].kind === 'neither' ? 'not an AP or a GP' : SEQ[k].kind === 'AP' ? 'an AP (constant difference)' : 'a geometric progression (constant ratio)'), w / 2, h - 16, { color: col.ink, size: 13, weight: 700, align: 'center' });
  };
  sync();
}
