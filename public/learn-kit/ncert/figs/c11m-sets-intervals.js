// Class 11 Maths, Sets: intervals on the number line. Square bracket = end point included (closed), round bracket = excluded (open).
// Drag the four ends of A and B, choose the end styles and an operation, and read the answer as an interval.
import { canvas, text, title, row, choice, readout, touchGuard, dot } from '../../kit.js';
import { r2, pos } from '../c11m-lib.js';

export default function (host) {
  let a = [-3, 2], b = [0, 5], ca = [1, 1], cb = [1, 1], op = 'un', drag = null, P = null;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'Two intervals A and B on a number line and the result of a set operation' });
  const out = readout(host);
  const inI = (x, i, c) => (x > i[0] && x < i[1]) || (x === i[0] && c[0]) || (x === i[1] && c[1]);
  const mem = (x) => { const p = inI(x, a, ca), q = inI(x, b, cb); return op === 'un' ? p || q : op === 'in' ? p && q : op === 'ab' ? p && !q : q && !p; };
  const answer = () => {
    const pts = []; for (let x = -7; x <= 9.001; x += 0.5) pts.push(x);
    const runs = []; let s = -1;
    pts.forEach((x, i) => { const m = mem(x); if (m && s < 0) s = i; if ((!m || i === pts.length - 1) && s >= 0) { runs.push([s, m ? i : i - 1]); s = -1; } });
    return runs.map(([i, j]) => { let l = pts[i], r = pts[j], lc = '[', rc = ']'; if (l % 1) { l -= 0.5; lc = '('; } if (r % 1) { r += 0.5; rc = ')'; } return l === r ? `{${r2(l)}}` : `${lc}${r2(l)}, ${r2(r)}${rc}`; });
  };
  const bar = (ctx, P, y, iv, c, color, name) => {
    ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(P.X(iv[0]), y); ctx.lineTo(P.X(iv[1]), y); ctx.stroke();
    iv.forEach((v, k) => { dot(ctx, P.X(v), y, 7, c[k] ? color : P.panel, color); });
    text(ctx, name, P.X(iv[0]) - 12, y - 14, { color, size: 14, weight: 800 });
  };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Drag the ends of A and B', col);
    const L = 18, R = w - 18, X = (v) => L + ((v + 6) / 14) * (R - L); P = { X, panel: col.panel, ix: (px) => ((px - L) / (R - L)) * 14 - 6 };
    const ys = [60, 110, 175];
    [ys[0], ys[1], ys[2]].forEach((y) => { ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); for (let v = -6; v <= 8; v++) { ctx.beginPath(); ctx.moveTo(X(v), y - 4); ctx.lineTo(X(v), y + 4); ctx.stroke(); } });
    for (let v = -6; v <= 8; v += 2) { text(ctx, r2(v), X(v), 76, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, r2(v), X(v), 126, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, r2(v), X(v), 191, { color: col.muted, size: 10.5, align: 'center' }); }
    bar(ctx, P, ys[0], a, ca, col.s[0], 'A'); bar(ctx, P, ys[1], b, cb, col.s[2], 'B');
    const pts = []; for (let x = -7; x <= 9.001; x += 0.5) pts.push(x);
    ctx.strokeStyle = col.s[3]; ctx.lineWidth = 6; ctx.lineCap = 'butt'; let s = -1;
    pts.forEach((x, i) => { const m = mem(x); if (m && s < 0) s = i; if ((!m || i === pts.length - 1) && s >= 0) { const l = pts[s], r = pts[m ? i : i - 1]; ctx.beginPath(); ctx.moveTo(X(Math.max(-6.3, Math.min(l, 8.3))), ys[2]); ctx.lineTo(X(Math.max(-6.3, Math.min(r, 8.3))), ys[2]); ctx.stroke(); s = -1; } });
    text(ctx, { un: 'A ∪ B', in: 'A ∩ B', ab: 'A − B', ba: 'B − A' }[op], 18, ys[2] - 16, { color: col.s[3], size: 14, weight: 800 });
    const ans = answer(); out.innerHTML = `A = ${ca[0] ? '[' : '('}${a[0]}, ${a[1]}${ca[1] ? ']' : ')'}, B = ${cb[0] ? '[' : '('}${b[0]}, ${b[1]}${cb[1] ? ']' : ')'}. Answer: <b>${ans.length ? ans.join(' ∪ ') : '∅ (empty)'}</b>.`;
  };
  const hit = (x, y) => { if (!P) return null; const ys = [60, 110]; for (const [k, iv] of [[0, a], [1, b]]) for (const e of [0, 1]) if (Math.hypot(P.X(iv[e]) - x, ys[k] - y) < 18) return [k, e]; return null; };
  const set = (e) => { const [x] = pos(cv.c, e), v = Math.max(-6, Math.min(8, Math.round(P.ix(x)))), iv = drag[0] ? b : a; iv[drag[1]] = v; if (iv[0] > iv[1]) { iv[drag[1] ^ 1] = v; } cv.redraw(); };
  cv.c.addEventListener('pointerdown', (e) => { drag = hit(...pos(cv.c, e)); if (drag) { cv.c.setPointerCapture(e.pointerId); set(e); } });
  cv.c.addEventListener('pointermove', (e) => { if (drag) set(e); }); cv.c.addEventListener('pointerup', () => { drag = null; });
  touchGuard(cv.c, (x, y) => !!hit(x, y));
  const r = row(host);
  choice(r, 'Operation', [['un', 'A ∪ B'], ['in', 'A ∩ B'], ['ab', 'A − B'], ['ba', 'B − A']], op, (v) => { op = v; cv.redraw(); });
  choice(r, 'A ends', [['11', '[ ]'], ['00', '( )'], ['10', '[ )'], ['01', '( ]']], '11', (v) => { ca = [+v[0], +v[1]]; cv.redraw(); });
  choice(r, 'B ends', [['11', '[ ]'], ['00', '( )'], ['10', '[ )'], ['01', '( ]']], '11', (v) => { cb = [+v[0], +v[1]]; cv.redraw(); });
  cv.redraw();
}
