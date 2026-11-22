// 6.6 Watch it happen: a reconciliation bridge drawn as a waterfall. Start from the store's September figure,
// apply each evidenced difference (tax, business-day timing, refunds) and arrive at the explained BI figure.
// The gap between that and the dashboard is the residual: the part still to investigate.
import { canvas, axes, text, title, line, calm, ease, loop } from '../../kit.js';
import { box, wrap } from './c-draw.js';

const BARS = [
  { lab: 'store', v: 412880, total: true },
  { lab: 'tax', v: -47500 },
  { lab: 'timing', v: -1240 },
  { lab: 'refunds', v: 2150 },
  { lab: 'explained', v: 366290, total: true },
  { lab: 'BI', v: 366140, total: true },
];
const UPTO = [1, 2, 3, 5, 6];
const NOTE = [
  'Store system, September: $412,880. It includes tax, uses calendar dates and nets refunds.',
  'Remove sales tax the store figure includes: −$47,500 (from the tax lines).',
  'Late-night sales on 30 Sept belong to 1 Oct by the business-day rule: −$1,240.',
  'The store nets refunds; the BI figure is before refunds: +$2,150. Explained: $366,290.',
  'The dashboard shows $366,140. Residual: −$150, traced to 2 receipts in quarantine.',
];
const money = (v) => (v < 0 ? '−' : '') + '$' + Math.abs(v).toLocaleString('en-CA');
export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 360, min: 300, label: 'A waterfall chart bridging a store figure to a BI figure' });
  let step = 0, k = 1;
  const anim = loop(host, (dt) => { if (k < 1) { k = Math.min(1, k + dt / 0.6); cv.redraw(); } }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Bridge: store to dashboard', col);
    const A = axes(ctx, w, h - 36, col, { x: [0, 6], y: [360000, 416000], xt: [], yt: [360000, 380000, 400000], fy: (v) => '$' + v / 1000 + 'k', l: 46, r: 8, t: 50, b: 24 });
    const bw = (A.R - A.L) / 6, a = ease(k);
    let run = 0;
    BARS.slice(0, UPTO[step]).forEach((b, i) => {
      const fresh = i >= (step ? UPTO[step - 1] : 0), al = fresh ? a : 1;
      let lo, hi, c;
      if (b.total) { lo = 360000; hi = b.v; run = b.v; c = i === 5 ? col.s[6] : col.s[0]; }
      else { const nxt = run + b.v; lo = Math.min(run, nxt); hi = Math.max(run, nxt); c = b.v < 0 ? col.s[1] : col.s[2]; run = nxt; }
      const x = A.L + i * bw + bw * 0.15, yT = A.Y(hi), yB = A.Y(lo);
      box(ctx, x, yT + (yB - yT) * (1 - al), bw * 0.7, Math.max(2, (yB - yT) * al), { fill: c + 'aa', stroke: c, width: 1, r: 2 });
      text(ctx, b.total ? '$' + Math.round(b.v / 100) / 10 + 'k' : money(b.v), x + bw * 0.35, yT - 9, { color: col.ink, size: 9.5, weight: 700, align: 'center', halo: col.panel, fit: false });
      text(ctx, b.lab, x + bw * 0.35, A.B + 10, { color: col.muted, size: 9.5, align: 'center', fit: false });
      if (i < 5 && i + 1 < UPTO[step]) line(ctx, [[x + bw * 0.7, A.Y(run)], [x + bw, A.Y(run)]], col.muted, 1, [2, 2]);
    });
    if (step === 4) text(ctx, 'residual −$150', A.R - 2, A.Y(366140) - 24, { color: col.bad || col.s[7], size: 11, weight: 700, align: 'right', halo: col.panel });
    text(ctx, 'axis starts at $360k so small steps show', A.R, A.T - 22, { color: col.muted, size: 9.5, align: 'right', fit: false });
    wrap(ctx, NOTE[step], 8, h - 26, w - 16, { color: col.ink, size: 11, weight: 600 });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); k = calm() ? 1 : 0; cv.redraw(); anim.play(); } };
}
