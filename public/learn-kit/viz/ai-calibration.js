// Calibration: when a model says "90% sure", is it right 90% of the time? The bars (orange: worse than it claims; blue: better) compare stated confidence with how often
// the answers were really right (made-up data). Slide "Confidence style": 1 is honest (bars sit on the diagonal), above 1
// is over-confident (bars fall below it, the hallucination pattern), below 1 is under-confident. ECE is the average gap.
import { canvas, text, row, slider, readout, title, axes, line, dot } from '../kit.js';

const sig = (x) => 1 / (1 + Math.exp(-x)), logit = (p) => Math.log(p / (1 - p));
export default function (host) {
  let a = 2;
  const cv = canvas(host, { aspect: 1.0, max: 400, min: 300, label: 'Reliability diagram: stated confidence against real accuracy' });
  const ctl = row(host);
  slider(ctl, { label: 'Confidence style', min: 0.4, max: 3.5, value: a, fmt: (v) => (v < 0.9 ? 'under-confident ' : v > 1.1 ? 'over-confident ' : 'honest ') + v.toFixed(1), oninput: (v) => { a = v; show(); } });
  const out = readout(host);
  function bins() {
    const B = Array.from({ length: 10 }, () => ({ w: 0, c: 0, p: 0 }));
    for (let i = 0; i < 400; i++) { const p = 0.5 + 0.495 * (i / 399), c = sig(a * logit(p)), b = Math.min(9, Math.floor(c * 10)); B[b].w++; B[b].c += c; B[b].p += p; }
    return B.map((b) => ({ n: b.w, conf: b.w ? b.c / b.w : 0, acc: b.w ? b.p / b.w : 0 }));
  }
  function show() {
    const B = bins(), tot = B.reduce((s, b) => s + b.n, 0), ece = B.reduce((s, b) => s + (b.n / tot) * Math.abs(b.conf - b.acc), 0), top = B[9];
    out.innerHTML = `Average gap (ECE): <b>${(ece * 100).toFixed(1)}%</b>. ${top.n ? `When it says about ${(top.conf * 100).toFixed(0)}% sure, it is really right ${(top.acc * 100).toFixed(0)}% of the time.` : ''} ${a > 1.2 ? 'Over-confident: it sounds sure when it should not, which is how confident wrong answers (hallucinations) happen.' : a < 0.85 ? 'Under-confident: it is better than it admits.' : 'Well calibrated: confidence can be trusted.'}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Stated confidence vs real accuracy', col);
    const ax = axes(ctx, w, h, col, { x: [0, 1], y: [0, 1], xlabel: 'confidence the model states', ylabel: 'actual accuracy', t: 40, b: 38, l: 46, r: 14, fx: (v) => v.toFixed(1), fy: (v) => v.toFixed(1) });
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(1)]], col.muted, 1.5, [5, 4]);
    bins().forEach((b, i) => { if (!b.n) return; const x0 = ax.X(i / 10) + 2, bw = ax.X(0.1) - ax.X(0) - 4; ctx.fillStyle = b.acc < b.conf ? col.s[1] : col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(x0, ax.Y(b.acc), bw, ax.B - ax.Y(b.acc)); ctx.globalAlpha = 1; dot(ctx, ax.X(b.conf), ax.Y(b.conf), 3, col.ink); });
    text(ctx, 'perfect honesty', ax.X(0.12), ax.Y(0.2), { color: col.muted, size: 10.5 });
  };
  show();
}
