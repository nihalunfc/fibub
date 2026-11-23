// Class 8 Algebra Play: three kinds of statement with x. An equation is true for some value(s) of x; an identity is true for every x;
// a statement like x + 1 = x + 2 is true for no x. Slide x and compare the two sides.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const S = { eq: ['x + 3 = 7', (x) => x + 3, (x) => 7, 'An equation: true only for x = 4.'], id: ['2(x + 1) = 2x + 2', (x) => 2 * (x + 1), (x) => 2 * x + 2, 'An identity: true for every x.'], no: ['x + 1 = x + 2', (x) => x + 1, (x) => x + 2, 'Never true: no value of x works.'] };
export default function (host) {
  let key = 'eq', x = 1;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 280, label: 'Two sides of an expression drawn as lines, with a slider for x' });
  const ctl = row(host);
  choice(ctl, 'Statement', Object.entries(S).map(([k, v]) => [k, v[0]]), key, (v) => { key = v; sync(); });
  slider(ctl, { label: 'x', min: -5, max: 8, step: 1, value: x, fmt: (v) => v, oninput: (v) => { x = v; sync(); } });
  const out = readout(host);
  function sync() { const [, f, g, msg] = S[key], l = f(x), r = g(x); out.innerHTML = `x = ${x}: left side = <b>${l}</b>, right side = <b>${r}</b>. ${l === r ? 'Equal.' : 'Not equal.'} ${msg}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, S[key][0], col), [, f, g] = S[key], L = 30, B = h - 30, W = w - L - 14, H = B - top - 10, lo = -10, hi = 24, X = (v) => L + ((v + 5) / 13) * W, Y = (v) => B - ((v - lo) / (hi - lo)) * H;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; for (let v = -5; v <= 8; v += 1) { ctx.beginPath(); ctx.moveTo(X(v), B); ctx.lineTo(X(v), B - H); ctx.stroke(); } for (let v = -10; v <= 24; v += 10) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(L + W, Y(v)); ctx.stroke(); text(ctx, String(v), L - 5, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, Y(0)); ctx.lineTo(L + W, Y(0)); ctx.stroke();
    [[f, col.s[0], 'left'], [g, col.s[3], 'right']].forEach(([fn, c, nm], i) => { ctx.strokeStyle = c; ctx.lineWidth = key === 'id' ? 5 - 2.5 * i : 2.5; ctx.beginPath(); for (let v = -5; v <= 8; v++) { v === -5 ? ctx.moveTo(X(v), Y(fn(v))) : ctx.lineTo(X(v), Y(fn(v))); } ctx.stroke(); });
    const l = f(x), r = g(x), eq = l === r; ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(X(x), Y(l), 6, 0, 7); ctx.fill(); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X(x), Y(r), 9, 0, 7); ctx.stroke();
    text(ctx, 'blue: left side, orange: right side', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, eq ? 'Equal here!' : 'Not equal', 10, top + 14, { color: eq ? col.s[2] : col.muted, size: 12, weight: 700 });
  };
  sync();
}
