// Class 9 Numbers: combining rational and irrational numbers. Pick two numbers and an operation and see what kind of number comes out.
// Rational + rational and rational x rational stay rational; a non-zero rational plus or times an irrational is irrational;
// but two irrationals can give a rational (sqrt2 x sqrt2 = 2) or an irrational (sqrt2 + sqrt3).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const N = { '1/2': [0.5, 'Q', '1/2'], '3': [3, 'Q', '3'], '√2': [Math.SQRT2, 'I', '√2'], '√3': [Math.sqrt(3), 'I', '√3'], '−√2': [-Math.SQRT2, 'I', '−√2'], 'π': [Math.PI, 'I', 'π'] };
const fmt = (v) => String(+v.toFixed(5)).replace('-', '−');
function sym(a, o, b) {
  const k = [a, b].sort().join('|'), pr = o === '×';
  if (N[a][1] === 'Q' && N[b][1] === 'Q') return ['rational', null];
  if (a === '√2' && b === '√2' && pr) return ['rational', '√2 × √2 = 2'];
  if (a === '√3' && b === '√3' && pr) return ['rational', '√3 × √3 = 3'];
  if (k === '−√2|√2' && o === '+') return ['rational', '√2 + (−√2) = 0'];
  if (k === '−√2|√2' && pr) return ['rational', '√2 × (−√2) = −2'];
  if (k === '−√2|−√2' && pr) return ['rational', '(−√2)(−√2) = 2'];
  if ((a === '√2' && b === '√3') || (a === '√3' && b === '√2')) return ['irrational', pr ? '√2 × √3 = √6 (irrational)' : '√2 + √3 cannot be simplified: irrational'];
  return ['irrational', N[a][1] === 'Q' || N[b][1] === 'Q' ? 'rational (non-zero) with irrational: irrational' : 'involves π or a mix: irrational'];
}
export default function (host) {
  let a = '√2', b = '√2', o = '×';
  const cv = canvas(host, { aspect: 0.55, max: 440, min: 240, label: 'The sum or product of two chosen numbers and whether the result is rational or irrational' });
  const c1 = row(host); choice(c1, 'First', Object.keys(N).map((k) => [k, k]), a, (v) => { a = v; upd(); });
  const c2 = row(host); choice(c2, 'Operation', [['+', '+'], ['×', '×']], o, (v) => { o = v; upd(); });
  const c3 = row(host); choice(c3, 'Second', Object.keys(N).map((k) => [k, k]), b, (v) => { b = v; upd(); });
  const out = readout(host);
  const val = () => (o === '+' ? N[a][0] + N[b][0] : N[a][0] * N[b][0]);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, a + ' ' + o + ' ' + b, col), [kind] = sym(a, o, b), v = val(), c = kind === 'rational' ? col.s[2] : col.s[3];
    text(ctx, '≈ ' + fmt(v), w / 2, t + 34, { color: col.ink, size: 22, weight: 700, align: 'center' });
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(w / 2 - 80, t + 58, 160, 38, 10); ctx.fill(); ctx.stroke(); ctx.restore();
    text(ctx, kind.toUpperCase(), w / 2, t + 77, { color: c, size: 15, weight: 700, align: 'center' });
    const nl = h - 34, x0 = 24, x1 = w - 24, lo = -4, hi = 12, X = (z) => x0 + ((z - lo) / (hi - lo)) * (x1 - x0);
    ctx.save(); ctx.strokeStyle = col.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, nl); ctx.lineTo(x1, nl); ctx.stroke(); ctx.restore();
    for (let z = lo; z <= hi; z += 2) text(ctx, String(z).replace('-', '−'), X(z), nl + 12, { color: col.muted, size: 10, align: 'center' });
    ctx.beginPath(); ctx.arc(X(Math.max(lo, Math.min(hi, v))), nl, 6, 0, 6.3); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
  };
  function upd() { const [k, why] = sym(a, o, b); out.innerHTML = `<b>${a} ${o} ${b} ≈ ${fmt(val())}</b>, which is <b>${k}</b>. ${why ? why + '.' : ''}` + (k === 'irrational' ? ' Remember: two irrationals can also give a rational number, so check each case.' : ''); cv.redraw(); }
  upd();
}
