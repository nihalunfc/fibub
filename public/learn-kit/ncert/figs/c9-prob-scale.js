// Class 9 Probability: the probability scale from 0 (impossible) to 1 (certain). P(E) = favourable outcomes / all
// outcomes, so it is never below 0 or above 1. Choose an event or set the numbers and see where it sits.
import { canvas, text, title, row, slider, choice, readout, dot } from '../../kit.js';

const EX = [['sun', 'Sun rises tomorrow', 1, 1], ['seven', 'Die shows 7', 0, 6], ['head', 'Coin: heads', 1, 2], ['six', 'Die shows 6', 1, 6], ['lt5', 'Die shows less than 5', 4, 6], ['even', 'Die shows even', 3, 6]];
const word = (p) => (p === 0 ? 'impossible' : p === 1 ? 'certain' : p < 0.25 ? 'unlikely' : p < 0.5 ? 'less than even' : p === 0.5 ? 'even chance' : p < 0.75 ? 'more than even' : 'very likely');
export default function (host) {
  let f = 1, n = 6;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'A number line from 0 to 1 with the probability of an event marked' });
  const ctl = row(host);
  choice(ctl, 'Event', EX.map(([k, l]) => [k, l]), 'six', (v) => { const e = EX.find((x) => x[0] === v); f = e[2]; n = e[3]; sf.set(f); sn.set(n); sync(); });
  const sf = slider(ctl, { label: 'Favourable outcomes', min: 0, max: 12, step: 1, value: f, fmt: (v) => String(v), oninput: (v) => { f = Math.min(v, n); if (f !== v) sf.set(f); sync(); } });
  const sn = slider(ctl, { label: 'All outcomes', min: 1, max: 12, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; if (f > n) { f = n; sf.set(f); } sync(); } });
  const out = readout(host);
  function sync() { const p = f / n; out.innerHTML = `P = ${f}/${n} = <b>${+p.toFixed(3)}</b> = ${+(p * 100).toFixed(1)}%. The event is <b>${word(p)}</b>. Favourable can be 0 to ${n}, so P is always from 0 to 1.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'The probability scale', col), x0 = 24, x1 = w - 24, y = top + (h - top) * 0.45, X = (p) => x0 + p * (x1 - x0), p = f / n;
    const g = ctx.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, col.s[1]); g.addColorStop(1, col.s[2]);
    ctx.fillStyle = g; ctx.globalAlpha = 0.4; ctx.fillRect(x0, y - 8, x1 - x0, 16); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    [[0, '0', 'impossible'], [0.25, '¼', 'unlikely'], [0.5, '½', 'even chance'], [0.75, '¾', 'likely'], [1, '1', 'certain']].forEach(([v, t, wd]) => { ctx.beginPath(); ctx.moveTo(X(v), y - 12); ctx.lineTo(X(v), y + 12); ctx.stroke(); text(ctx, t, X(v), y + 24, { color: col.ink, size: 13, weight: 700, align: v === 0 ? 'left' : v === 1 ? 'right' : 'center' }); text(ctx, wd, X(v), y + 42, { color: col.muted, size: 10, align: v === 0 ? 'left' : v === 1 ? 'right' : 'center' }); });
    dot(ctx, X(p), y, 9, col.s[3], col.ink);
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(p), y - 9); ctx.lineTo(X(p), y - 30); ctx.stroke();
    text(ctx, f + '/' + n + ' = ' + +p.toFixed(2), Math.min(Math.max(X(p), x0 + 40), x1 - 40), y - 40, { color: col.ink, size: 13, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
