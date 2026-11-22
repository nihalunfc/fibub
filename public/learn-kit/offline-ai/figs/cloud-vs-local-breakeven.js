// 1.2 Cloud vs local: total cost over the months for a plan at 20 a month against hardware at 600 plus
// 4 a month of electricity. Steps: month 0, after a year, the gap closing, the crossing at 37.5 months, after it.
import { canvas, title, text, axes, line, dot, loop, calm, ease } from '../../kit.js';

const P = 20, H = 600, E = 4, BE = H / (P - E), MAX = 60;
const MARK = [0, 12, 24, BE, MAX];

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 240, label: 'Cloud cost and local cost over 60 months, crossing at 37.5 months' });
  let step = 0, k = 1, from = 0;
  const anim = loop(host, (dt) => { k = Math.min(1, k + dt / 0.9); cv.redraw(); if (k >= 1) anim.pause(); }, { autoplay: false });
  cv.draw = (ctx, w, h, col) => {
    const m = from + (MARK[step] - from) * ease(k);
    title(ctx, 'Total cost so far', col);
    const { X, Y } = axes(ctx, w, h, col, { x: [0, MAX], y: [0, 1400], t: 40, l: 48, xt: [0, 12, 24, 36, 48, 60], xlabel: 'months' });
    const upto = Math.max(m, 0.001), pts = (f) => Array.from({ length: 41 }, (_, i) => { const t = (upto * i) / 40; return [X(t), Y(f(t))]; });
    line(ctx, pts((t) => P * t), col.s[0], 2.5);
    line(ctx, pts((t) => H + E * t), col.s[1], 2.5);
    dot(ctx, X(m), Y(P * m), 5, col.s[0]);
    dot(ctx, X(m), Y(H + E * m), 5, col.s[1]);
    text(ctx, `cloud ${Math.round(P * m)}`, X(m) + 8, Y(P * m) + (P * m > H + E * m || m < 6 ? -12 : 12), { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    text(ctx, `local ${Math.round(H + E * m)}`, X(m) + 8, Y(H + E * m) + (P * m > H + E * m ? 12 : -10), { color: col.s[1], size: 12, weight: 700, halo: col.panel });
    if (step >= 3 && m >= BE - 0.01) {
      line(ctx, [[X(BE), Y(0)], [X(BE), Y(P * BE)]], col.muted, 1, [4, 4]);
      text(ctx, 'break-even 37.5', X(BE), Y(0) - 10, { color: col.ink, size: 11.5, weight: 600, align: 'center', halo: col.panel });
    }
    if (step === 2) text(ctx, 'local catches up 16 a month', X(MAX) - 4, Y(120), { color: col.muted, size: 11.5, align: 'right', halo: col.panel });
  };
  cv.redraw();
  return { step(i) { from = MARK[step] * (i > step ? 1 : 0); if (i < step) from = 0; step = i; k = calm() ? 1 : 0; cv.redraw(); if (k < 1) anim.play(); } };
}
