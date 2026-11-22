// 6.4 A 40-minute job on a laptop. On battery, on a sofa: 12 tokens per second until the chip reaches its heat limit
// after about 5 minutes, then it slows to about 7. Plugged in, on a desk with the back raised: holds about 11.
// The area under each line is the number of tokens written. Shapes are illustrative, not a measurement.
import { axes, line, text, title, dot } from '../../kit.js';
import { stepFig } from './b-lib.js';

const sofa = (m) => (m < 5 ? 12 : 7 + 5 * Math.exp(-(m - 5) / 1.2));
const desk = (m) => (m < 5 ? 12 : 11 + Math.exp(-(m - 5) / 1.5));
const temp = (m) => Math.min(1, m / 5); // share of the way to the heat limit
const tokens = (f) => { let s = 0; for (let m = 0; m < 40; m += 0.01) s += f(m + 0.005) * 0.6; return s; };

export default function (host) {
  return stepFig(host, {
    aspect: 0.6, max: 320, min: 250, label: 'Tokens per second over a 40-minute laptop job, falling when the chip gets hot',
    draw(ctx, w, h, col, s) {
      title(ctx, 'Speed through a 40-minute job', col);
      const A = axes(ctx, w, h, col, { x: [0, 40], y: [0, 14], xlabel: 'minutes', ylabel: 'tokens per second', l: 46, t: 56 });
      const end = s.step === 0 ? 2 : s.step === 1 ? 5 : 40, upTo = s.step === s.prev ? end : (s.step <= 1 ? end * s.e : 40);
      const pts = (f, to) => { const p = []; for (let m = 0; m <= to + 1e-9; m += 0.2) p.push([A.X(m), A.Y(f(m))]); return p; };
      const sofaTo = s.step >= 2 ? (s.prev < 2 ? 5 + 35 * s.e : 40) : upTo;
      if (s.step >= 4) { ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.moveTo(A.X(0), A.B); pts(desk, 40).forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(A.X(40), A.B); ctx.fill(); ctx.restore(); }
      line(ctx, pts(sofa, sofaTo), col.s[1], 2.5);
      if (s.step >= 3) line(ctx, pts(desk, s.prev < 3 ? 40 * s.e : 40), col.s[2], 2.5);
      // heat bar
      const m = Math.min(sofaTo, 40), t = temp(m);
      const bx = A.R - 120, by = 34;
      if (s.step < 4) {
      text(ctx, 'chip heat', bx - 6, by + 5, { color: col.muted, size: 10.5, align: 'right', fit: false });
      ctx.save(); ctx.fillStyle = col.line; ctx.fillRect(bx, by, 100, 10); ctx.fillStyle = t >= 1 ? (col.bad || col.s[1]) : (col.warn || col.s[3]); ctx.fillRect(bx, by, 100 * t, 10); ctx.restore();
      if (t >= 1) text(ctx, 'limit', bx + 100, by + 20, { color: col.bad || col.s[1], size: 10, align: 'right', fit: false });
      }
      dot(ctx, A.X(m), A.Y(sofa(m)), 4, col.s[1]);
      text(ctx, 'battery, on a sofa', A.X(16), A.Y(sofa(30)) + 14, { color: col.s[1], size: 11, weight: 650 });
      if (s.step >= 3) text(ctx, 'plugged in, on a desk', A.X(16), A.Y(11) - 12, { color: col.s[2], size: 11, weight: 650 });
      if (s.step >= 4) text(ctx, `Tokens written: about ${(Math.round(tokens(sofa) / 100) * 100).toLocaleString('en-CA')} vs ${(Math.round(tokens(desk) / 100) * 100).toLocaleString('en-CA')}`, 10, 38, { color: col.ink, size: 11.5, weight: 700 });
    },
  });
}
