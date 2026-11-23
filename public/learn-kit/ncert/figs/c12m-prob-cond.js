// Class 12 Maths, Probability: conditional probability. 200 equally likely outcomes are dots; A and B are two events (blue = A only, orange = B only, green = both).
// P(A | B) = P(A and B) / P(B): once we KNOW B happened, B is the whole sample space, so we count the green dots among the B dots. Switch "given B" on to see the sample space shrink.
import { canvas, text, title, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let nA = 80, nB = 70, sh = 50, given = false;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'A grid of 200 outcomes with events A and B marked, showing conditional probability as a shrunken sample space' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'size of A', min: 10, max: 190, step: 10, value: nA, fmt: (v) => v + ' dots', oninput: (v) => { nA = v; go(); } });
  slider(ctl, { label: 'size of B', min: 10, max: 190, step: 10, value: nB, fmt: (v) => v + ' dots', oninput: (v) => { nB = v; go(); } });
  slider(ctl, { label: 'slide B along', min: 0, max: 190, step: 10, value: sh, fmt: (v) => String(v), oninput: (v) => { sh = v; go(); } });
  choice(ctl, 'look at', [[false, 'everything'], [true, 'given B']], false, (v) => { given = v; go(); });
  const stat = () => { let a = 0, b = 0, ab = 0; for (let i = 0; i < 200; i++) { const inA = i < nA, inB = i >= sh && i < Math.min(200, sh + nB); a += inA; b += inB; ab += inA && inB; } return { a, b, ab }; };
  const go = () => {
    const { a, b, ab } = stat();
    ro.textContent = given ? (b ? `Given B, only the ${b} B dots remain. P(A | B) = n(A∩B)/n(B) = ${ab}/${b} = ${(ab / b).toFixed(3)}.  Compare P(A) = ${a}/200 = ${(a / 200).toFixed(3)}.` : 'B is empty: P(A | B) is not defined.')
      : `P(A) = ${a}/200 = ${(a / 200).toFixed(3)},  P(B) = ${b}/200 = ${(b / 200).toFixed(3)},  P(A∩B) = ${ab}/200 = ${(ab / 200).toFixed(3)}.  P(A | B) = P(A∩B)/P(B) = ${b ? (ab / b).toFixed(3) : 'not defined'}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, given ? 'Given B: the sample space is B' : 'Sample space of 200 equally likely outcomes', col) + 6;
    const cols = 20, rows = 10, gx = (w - 24) / cols, gy = Math.min(gx, (h - top - 36) / rows), r = Math.min(gx, gy) * 0.36, x0 = 12 + gx / 2, y0 = top + 14;
    for (let i = 0; i < 200; i++) {
      const inA = i < nA, inB = i >= sh && i < Math.min(200, sh + nB), c = inA && inB ? col.s[2] : inA ? col.s[0] : inB ? col.s[1] : col.line;
      ctx.globalAlpha = given && !inB ? 0.12 : 1;
      dot(ctx, x0 + (i % cols) * gx, y0 + Math.floor(i / cols) * gy, r, c);
    }
    ctx.globalAlpha = 1;
    const ly = y0 + rows * gy + 8;
    [['A only', col.s[0]], ['B only', col.s[1]], ['A and B', col.s[2]], ['neither', col.muted]].forEach(([t, c], i) => { dot(ctx, 16 + i * (w - 20) / 4, ly + 6, 5, c); text(ctx, t, 26 + i * (w - 20) / 4, ly + 6, { color: col.ink, size: 11 }); });
  };
  go();
}
