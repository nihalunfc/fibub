// Class 10 Probability: the sample space of throwing two dice is a 6 × 6 grid of 36 equally likely outcomes. Choose an
// event and its favourable outcomes light up. Probability = number of favourable outcomes ÷ 36, reduced to lowest terms.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const EV = {
  sum7: ['Sum is 7', (a, b) => a + b === 7],
  sum10: ['Sum ≥ 10', (a, b) => a + b >= 10],
  dbl: ['Doubles', (a, b) => a === b],
  odd: ['Both odd', (a, b) => a % 2 && b % 2],
  prime: ['Sum is prime', (a, b) => [2, 3, 5, 7, 11].includes(a + b)],
  p12: ['Product is 12', (a, b) => a * b === 12],
  six: ['At least one 6', (a, b) => a === 6 || b === 6],
  lt: ['1st die < 2nd', (a, b) => a < b],
};
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
export default function (host) {
  let ev = 'sum7', show = 'sum';
  const cv = canvas(host, { aspect: 1.05, max: 440, min: 290, label: 'A six by six grid of all outcomes of two dice with the favourable ones highlighted' });
  const ctl = row(host);
  choice(ctl, 'Event', Object.entries(EV).map(([k, v]) => [k, v[0]]), ev, (v) => { ev = v; say(); });
  choice(ctl, 'Cells show', [['sum', 'Sum'], ['pair', 'Pair']], show, (v) => { show = v; cv.redraw(); });
  const out = readout(host);
  const count = () => { let k = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (EV[ev][1](a, b)) k++; return k; };
  function say() { const k = count(), g = gcd(k, 36) || 1; out.innerHTML = `“${EV[ev][0]}”: <b>${k}</b> favourable outcomes out of 36, so P = ${k}/36 ${k ? `= <b>${k / g}/${36 / g}</b> ≈ ${(k / 36).toFixed(3)}` : '= <b>0</b> (impossible)'}.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'All 36 outcomes of two dice', col), L = 34, s = Math.min((w - L - 12) / 6, (h - top - 50) / 6), x0 = (w - 6 * s + L - 12) / 2 - 12;
    const y0 = top + 30;
    text(ctx, '2nd die →', x0 + 3 * s, y0 - 14, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, '1st die', 4, y0 + 3, { color: col.muted, size: 10 });
    for (let i = 1; i <= 6; i++) { text(ctx, String(i), x0 + (i - 0.5) * s, y0 - 3, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, String(i), x0 - 8, y0 + (i - 0.5) * s + 8, { color: col.ink, size: 11, weight: 700, align: 'right' }); }
    for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) {
      const on = EV[ev][1](a, b), x = x0 + (b - 1) * s, y = y0 + 8 + (a - 1) * s;
      ctx.fillStyle = on ? col.s[1] : col.soft; ctx.globalAlpha = on ? 0.9 : 1; ctx.fillRect(x + 1, y + 1, s - 2, s - 2); ctx.globalAlpha = 1;
      text(ctx, show === 'sum' ? String(a + b) : `${a},${b}`, x + s / 2, y + s / 2, { color: on ? col.panel : col.muted, size: show === 'sum' ? 12 : 10, weight: on ? 700 : 400, align: 'center' });
    }
  };
  say();
}
