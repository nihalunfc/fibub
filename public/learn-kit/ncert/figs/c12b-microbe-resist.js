// Class 12 Microbes in Human Welfare: antibiotic resistance as natural selection. A bacterial population has a few resistant cells (here 2 %). Each day on the antibiotic kills 65 % of the sensitive cells and no resistant ones;
// between doses the survivors regrow to the full population. The longer the antibiotic is used (and the more often it is used wrongly), the more of the population is resistant. Illustrative numbers.
import { canvas, text, title, axes, line, dot, row, slider, button, readout, loop } from '../../kit.js';

export default function (host) {
  let course = 3, S, Rr, day, hist, acc = 0;
  const CAP = 1000;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A grid of bacteria, sensitive and resistant, and a graph of the resistant share over days of antibiotic treatment' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'Days on antibiotic', min: 0, max: 14, step: 1, value: course, fmt: (v) => String(v), oninput: (v) => { course = v; reset(); } });
  const anim = loop(host, (dt) => { acc += dt; if (acc > 0.6 && day < 24) { acc = 0; step(); } });
  anim.button(ctl); button(ctl, 'Restart', () => reset());
  const reset = () => { S = CAP * 0.98; Rr = CAP * 0.02; day = 0; hist = [2]; acc = 0; go(); };
  const step = () => { day++; if (day <= course) S *= 0.35; const f = Math.min(2, CAP / (S + Rr)); S *= f; Rr *= f; hist.push(100 * Rr / (S + Rr)); go(); };
  const go = () => {
    const fr = 100 * Rr / (S + Rr);
    ro.textContent = `Day ${day}: ${fr.toFixed(1)} % of the bacteria are resistant. ` + (day === 0 ? 'Press Play: the antibiotic kills the sensitive cells first.' : day <= course ? 'The drug is being taken: sensitive cells die, resistant ones are left to multiply.' : 'Treatment over: the survivors regrow, and now most of them are resistant. Medicine for that bug will work less well next time.');
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'Selection for resistance', col), n = 10, s = Math.min((w - 40) / n, 18), x0 = (w - s * n) / 2, y0 = t0 + 6, tot = n * n, nr = Math.round(tot * Rr / (S + Rr));
    for (let i = 0; i < tot; i++) { const x = x0 + (i % n + 0.5) * s, y = y0 + (Math.floor(i / n) + 0.5) * s; const res = ((i * 37) % tot) < nr; dot(ctx, x, y, s * 0.38, res ? col.s[3] : col.s[0], col.bg); }
    text(ctx, 'blue = sensitive, orange = resistant', w / 2, y0 + s * n + 12, { color: col.muted, size: 10.5, align: 'center' });
    const A = axes(ctx, w, h, col, { x: [0, 24], y: [0, 100], xlabel: 'day', ylabel: '% resistant', l: 48, t: y0 + s * n + 24, b: 36, xt: [0, 6, 12, 18, 24], yt: [0, 50, 100] });
    line(ctx, [[A.X(course), A.T], [A.X(course), A.B]], col.muted, 1, [3, 3]); text(ctx, 'last dose', A.X(course) + 4, A.T + 10, { color: col.muted, size: 10 });
    line(ctx, hist.map((v, i) => [A.X(i), A.Y(v)]), col.s[3], 3);
  };
  reset();
}
