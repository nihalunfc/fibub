// Class 9 Identities: a^3 + b^3 + c^3 - 3abc = (a + b + c)(a^2 + b^2 + c^2 - ab - bc - ca). Choose a, b, c and compare both sides.
// If a + b + c = 0 the right side is 0, so a^3 + b^3 + c^3 = 3abc: bars on the two sides become equal.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const num = (v) => String(v).replace('-', '−');
export default function (host) {
  let v = [2, 3, -5];
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 250, label: 'Bars comparing a cubed plus b cubed plus c cubed with three a b c, and both sides of the identity' });
  const ctl = row(host);
  ['a', 'b', 'c'].forEach((n, i) => slider(ctl, { label: n, min: -6, max: 6, step: 1, value: v[i], fmt: num, oninput: (x) => { v[i] = x; upd(); } }));
  const out = readout(host);
  const vals = () => { const [a, b, c] = v; return { s3: a ** 3 + b ** 3 + c ** 3, t: 3 * a * b * c, L: a ** 3 + b ** 3 + c ** 3 - 3 * a * b * c, S: a + b + c, Q: a * a + b * b + c * c - a * b - b * c - c * a }; };
  cv.draw = (ctx, w, h, col) => {
    const { s3, t, L, S, Q } = vals(), tt = title(ctx, 'a³ + b³ + c³ − 3abc', col), mid = w * 0.5, mx = Math.max(Math.abs(s3), Math.abs(t), Math.abs(L), 1), sc = (w * 0.42) / mx;
    const bars = [['a³ + b³ + c³', s3, col.s[0]], ['3abc', t, col.s[3]], ['left side', L, col.s[5]], ['(a+b+c)·(…)', S * Q, col.s[2]]];
    ctx.save(); ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(mid, tt + 8); ctx.lineTo(mid, h - 8); ctx.stroke(); ctx.restore();
    bars.forEach(([lab, val, c], i) => { const y = tt + 24 + i * 40, x1 = mid + val * sc; ctx.save(); ctx.fillStyle = c; ctx.globalAlpha = 0.65; ctx.fillRect(Math.min(mid, x1), y - 11, Math.abs(val * sc) + 1, 22); ctx.restore(); text(ctx, lab + ' = ' + num(val), 10, y - 20 + 5, { color: col.ink, size: 11, weight: 700 }); });
    if (S === 0) text(ctx, 'a + b + c = 0: the bars match', w / 2, h - 12, { color: col.s[2], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const { s3, t, L, S, Q } = vals(); out.innerHTML = `Left: ${s3} − ${t} = <b>${num(L)}</b>. Right: (${num(S)})(${Q}) = <b>${num(S * Q)}</b>. ` + (S === 0 ? 'Since a + b + c = 0, the factor (a + b + c) is 0 and so a³ + b³ + c³ = 3abc: ' + num(s3) + ' = ' + num(t) + '.' : 'Equal either way: the identity works for every a, b, c.'); cv.redraw(); }
  upd();
}
