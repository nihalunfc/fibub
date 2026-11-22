// 10.2 Expected score of guessing in GATE PH. MCQs lose one third of their marks when wrong (1/3 or 2/3); MSQ and NAT
// lose nothing. Top: expected marks per question against the chance p of being right. Bottom: the full spread of marks
// from a batch of n such answers (binomial), with its mean and the chance of ending below zero.
import { canvas, row, slider, choice, readout, axes, line, dot, text, title, fmt } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.86, max: 560, min: 380, label: 'Expected marks against chance of being right for GATE MCQs with negative marking and MSQ or NAT without it, and the spread of marks from a batch of guesses' });
  let marks = 2, out4 = 1, n = 8, kind = 'mcq';
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Type', [['mcq', 'MCQ'], ['msq', 'MSQ (random pick)'], ['nat', 'NAT (unsure)']], kind, (v) => { kind = v; re(); });
  choice(ctl, 'Marks', [[1, '1 mark'], [2, '2 marks']], marks, (v) => { marks = v; re(); });
  choice(ctl, 'Options ruled out (MCQ)', [[0, 'none'], [1, 'one'], [2, 'two']], out4, (v) => { out4 = v; re(); });
  slider(ctl, { label: 'Number of such answers', min: 1, max: 20, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; re(); } });
  const pen = () => (kind === 'mcq' ? marks / 3 : 0);
  // chance of being right: MCQ random among remaining options; MSQ blind pick among the 15 non-empty subsets
  // (raised by ruling options in or out is not modelled); NAT: an unsure estimate, taken as 10%.
  const p = () => (kind === 'mcq' ? 1 / (4 - out4) : kind === 'msq' ? 1 / 15 : 0.1);
  const binom = (N, k, q) => { let c = 1; for (let i = 0; i < k; i++) c = c * (N - i) / (i + 1); return c * q ** k * (1 - q) ** (N - k); };
  const show = () => {
    const q = p(), e = q * marks - (1 - q) * pen();
    let below = 0; for (let k = 0; k <= n; k++) if (k * marks - (n - k) * pen() < -1e-9) below += binom(n, k, q);
    out.innerHTML = `Chance right p = <b>${fmt(q, 3)}</b>. One answer is worth <b>${e >= 0 ? '+' : ''}${fmt(e, 3)}</b> marks on average, so ${n} of them add <b>${e >= 0 ? '+' : ''}${fmt(n * e, 3)}</b> (standard deviation ${fmt(Math.sqrt(n * q * (1 - q)) * (marks + pen()), 3)}). ${kind === 'mcq' ? `Chance of losing marks overall: ${fmt(100 * below, 3)}%.` : 'MSQ and NAT answers can never cost marks: a blank throws away a free chance.'}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const split = H * 0.5;
    ctx.save();
    const ax = axes(ctx, W, split, col, { x: [0, 1], y: [-0.8, 2.1], xlabel: 'chance of being right, p', ylabel: 'expected marks', t: 32, b: 38 });
    title(ctx, 'Expected marks per question (GATE marking)', col);
    ctx.save(); ax.clip();
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(0)]], col.muted, 1.1);
    line(ctx, [[ax.X(0), ax.Y(-1 / 3)], [ax.X(1), ax.Y(1)]], col.s[0], 2);
    line(ctx, [[ax.X(0), ax.Y(-2 / 3)], [ax.X(1), ax.Y(2)]], col.s[1], 2);
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(2)]], col.s[2], 2, [7, 5]);
    line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(1), ax.Y(1)]], col.s[2], 1.4, [3, 4]);
    const q = p(); dot(ctx, ax.X(q), ax.Y(q * marks - (1 - q) * pen()), 6.5, col.s[4], col.panel);
    ctx.restore();
    text(ctx, '2-mark MCQ', ax.X(0.86), ax.Y(0.86 * 2 - 0.14 * 2 / 3) + 14, { color: col.s[1], size: 10.5, weight: 700, halo: col.panel });
    text(ctx, '1-mark MCQ', ax.X(0.86), ax.Y(0.86 - 0.14 / 3) + 14, { color: col.s[0], size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'MSQ / NAT (dashed)', ax.X(0.3), ax.Y(0.6) - 16, { color: col.s[2], size: 10.5, weight: 700, halo: col.panel });
    text(ctx, 'break-even p = 1/4', ax.X(0.25), ax.Y(0) + 12, { color: col.ink, size: 10.5, align: 'center', halo: col.panel });
    ctx.restore();
    ctx.save(); ctx.translate(0, split);
    const lo = -n * pen(), hi = n * marks, qq = p();
    const probs = []; let pmax = 0; for (let k = 0; k <= n; k++) { const pr = binom(n, k, qq); probs.push([k * marks - (n - k) * pen(), pr]); pmax = Math.max(pmax, pr); }
    const bx = axes(ctx, W, H - split, col, { x: [lo - 1, hi + 1], y: [0, pmax * 1.15], xlabel: `total marks from ${n} answers`, ylabel: 'probability', t: 16 });
    ctx.save(); bx.clip();
    const bw = Math.max(2, (bx.X(marks + pen()) - bx.X(0)) * 0.6);
    probs.forEach(([m, pr]) => { ctx.fillStyle = m < 0 ? (col.bad || col.s[3]) : col.s[0]; ctx.globalAlpha = 0.75; ctx.fillRect(bx.X(m) - bw / 2, bx.Y(pr), bw, bx.B - bx.Y(pr)); });
    ctx.globalAlpha = 1;
    const mean = n * (qq * marks - (1 - qq) * pen());
    line(ctx, [[bx.X(mean), bx.T], [bx.X(mean), bx.B]], col.ink, 1.6, [5, 4]);
    line(ctx, [[bx.X(0), bx.T], [bx.X(0), bx.B]], col.muted, 1);
    ctx.restore();
    text(ctx, `mean ${fmt(mean, 3)}`, bx.X(mean) + 5, bx.T + 8, { color: col.ink, size: 10.5, halo: col.panel });
    ctx.restore();
  };
  re();
}
