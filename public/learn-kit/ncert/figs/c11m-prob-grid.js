// Class 11 Maths, Probability: the sample space of two dice as a 6 x 6 grid of 36 equally likely outcomes (first die down, second die across; each cell shows the sum).
// An event is any set of cells. With equally likely outcomes P(E) = n(E)/n(S). Pick a ready-made event, or tap cells to build your own.
import { canvas, text, title, row, readout, choice, button } from '../../kit.js';

const EV = { sum7: ['Sum is 7', (a, b) => a + b === 7], big: ['Sum 10 or more', (a, b) => a + b >= 10], dbl: ['Doubles', (a, b) => a === b], six: ['At least one 6', (a, b) => a === 6 || b === 6], odd: ['Both odd', (a, b) => a % 2 && b % 2], own: ['Mine', null] };
export default function (host) {
  let k = 'sum7'; const own = new Set(); let G = null;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 310, label: 'A six by six grid of the 36 outcomes of two dice with an event highlighted' });
  const ctl = row(host), ro = readout(host);
  const ch = choice(ctl, 'Event', Object.entries(EV).map(([id, v]) => [id, v[0]]), k, (v) => { k = v; cv.redraw(); });
  button(ctl, 'Clear mine', () => { own.clear(); k = 'own'; cv.redraw(); });
  cv.c.addEventListener('click', (e) => {
    if (!G) return; const b = cv.c.getBoundingClientRect(), x = e.clientX - b.left - G.x0, y = e.clientY - b.top - G.y0, c = Math.floor(x / G.s), r = Math.floor(y / G.s);
    if (r < 0 || r > 5 || c < 0 || c > 5) return;
    if (k !== 'own') { own.clear(); for (let a = 1; a <= 6; a++) for (let bb = 1; bb <= 6; bb++) if (EV[k][1](a, bb)) own.add(a * 10 + bb); k = 'own'; [...ctl.querySelectorAll('.lk-choice button')].forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === 5))); }
    const id = (r + 1) * 10 + (c + 1); own.has(id) ? own.delete(id) : own.add(id); cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Sample space of two dice: 36 outcomes', col), s = Math.min((w - 60) / 6, (h - top - 60) / 6), x0 = (w - 6 * s) / 2 + 8, y0 = top + 26; G = { s, x0, y0 };
    let n = 0;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const a = r + 1, b = c + 1, inE = k === 'own' ? own.has(a * 10 + b) : EV[k][1](a, b); if (inE) n++;
      ctx.fillStyle = inE ? col.s[0] : col.soft; ctx.globalAlpha = inE ? 0.85 : 1; ctx.fillRect(x0 + c * s + 1, y0 + r * s + 1, s - 2, s - 2); ctx.globalAlpha = 1;
      text(ctx, String(a + b), x0 + c * s + s / 2, y0 + r * s + s / 2, { color: inE ? col.panel : col.muted, size: Math.min(15, s * 0.42), weight: inE ? 800 : 500, align: 'center' });
    }
    for (let i = 0; i < 6; i++) { text(ctx, String(i + 1), x0 - 11, y0 + i * s + s / 2, { color: col.ink, size: 12, weight: 700, align: 'right' }); text(ctx, String(i + 1), x0 + i * s + s / 2, y0 - 10, { color: col.ink, size: 12, weight: 700, align: 'center' }); }
    text(ctx, '1st die ↓   2nd die →', 12, y0 + 6 * s + 14, { color: col.muted, size: 11 });
    text(ctx, `n(E) = ${n}   P(E) = ${n}/36 = ${+(n / 36).toFixed(4)}`, w - 12, y0 + 6 * s + 14, { color: col.ink, size: 12.5, weight: 800, align: 'right' });
    ro.textContent = `${k === 'own' ? 'Your event' : EV[k][0]}: ${n} favourable outcomes out of 36 equally likely ones, so P = ${n}/36${n ? ' = ' + +(n / 36).toFixed(4) : ''}. Tap any cell to start your own event.`;
  };
  cv.redraw();
}
