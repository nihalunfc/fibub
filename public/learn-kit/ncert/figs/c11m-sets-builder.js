// Class 11 Maths, Sets: set-builder form and roster form say the same thing. Choose a rule and a limit; the numbers 1 to 30 that obey the rule
// light up, and both ways of writing the set are shown.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

const isP = (n) => n > 1 && [...Array(n).keys()].slice(2).every((d) => n % d);
const RULES = { even: ['x is even', (x) => x % 2 === 0], odd: ['x is odd', (x) => x % 2 === 1], prime: ['x is prime', isP], m3: ['x is a multiple of 3', (x) => x % 3 === 0], sq: ['x is a perfect square', (x) => Number.isInteger(Math.sqrt(x))], f24: ['x divides 24', (x) => 24 % x === 0] };
export default function (host) {
  let rule = 'even', lim = 20;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 290, label: 'Numbers one to thirty with those that satisfy a rule highlighted' });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Which numbers belong to the set?', col), f = RULES[rule][1], cw = (w - 20) / 10, ch = 34, ms = [];
    for (let x = 1; x <= 30; x++) {
      const cx = 10 + ((x - 1) % 10) * cw, cy = top + 6 + Math.floor((x - 1) / 10) * ch, inn = x <= lim && f(x); if (inn) ms.push(x);
      ctx.fillStyle = inn ? col.s[0] : x > lim ? col.panel : col.soft; ctx.globalAlpha = inn ? 0.85 : 1; ctx.beginPath(); ctx.roundRect(cx + 2, cy + 2, cw - 4, ch - 4, 6); ctx.fill(); ctx.globalAlpha = 1;
      text(ctx, String(x), cx + cw / 2, cy + ch / 2, { color: inn ? col.panel : x > lim ? col.line : col.ink, size: 13, weight: inn ? 800 : 500, align: 'center' });
    }
    const y = top + 3 * ch + 24;
    text(ctx, 'Set-builder form:', 12, y, { color: col.muted, size: 11.5 }); text(ctx, `{ x : x ∈ N, x ≤ ${lim}, ${RULES[rule][0]} }`, 12, y + 20, { color: col.ink, size: 13, weight: 700 });
    text(ctx, 'Roster (listing) form:', 12, y + 48, { color: col.muted, size: 11.5 }); text(ctx, '{ ' + ms.join(', ') + ' }', 12, y + 68, { color: col.s[0], size: 13, weight: 800 });
    out.innerHTML = `The set has <b>${ms.length}</b> element${ms.length === 1 ? '' : 's'}.`;
  };
  const r = row(host);
  choice(r, 'Rule', Object.entries(RULES).map(([k, v]) => [k, v[0].replace('x is ', '').replace('x ', '')]), rule, (v) => { rule = v; cv.redraw(); });
  slider(r, { label: 'Up to', min: 5, max: 30, step: 1, value: lim, fmt: (v) => v, oninput: (v) => { lim = v; cv.redraw(); } });
  cv.redraw();
}
