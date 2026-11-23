// Class 11 Maths, Binomial Theorem: putting numbers in. In (1 + x)ⁿ = nC0 + nC1 x + ... + nCn xⁿ set x = 1 and the
// coefficients add to 2ⁿ (every subset of n things is counted). Set x = −1 and they alternate in sign and add to 0,
// so the even-position coefficients and the odd-position ones have the same total, 2ⁿ⁻¹.
import { canvas, row, slider, choice, readout, text, title } from '../../kit.js';

const C = (n, r) => { let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
export default function (host) {
  let n = 5, x = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Bars for the coefficients of 1 plus x to the n with their sum for x equals 1 or minus 1' });
  const c1 = row(host), out = readout(host);
  slider(c1, { label: 'n', min: 1, max: 10, step: 1, value: n, fmt: String, oninput: (v) => { n = v; re(); } });
  choice(c1, 'put x =', [['1', '1'], ['-1', '−1']], '1', (v) => { x = +v; re(); });
  const re = () => { cv.redraw(); let s = 0, ev = 0, od = 0; for (let k = 0; k <= n; k++) { s += C(n, k) * x ** k; k % 2 ? (od += C(n, k)) : (ev += C(n, k)); } out.innerHTML = x === 1 ? `Put x = 1: ${n}C0 + ${n}C1 + ... + ${n}C${n} = <b>${s}</b> = 2<sup>${n}</sup>.` : `Put x = −1: ${n}C0 − ${n}C1 + ${n}C2 − ... = <b>${s}</b>. So the even-position terms add to ${ev} and the odd-position terms add to ${od}: both are 2<sup>${n - 1}</sup> = ${2 ** (n - 1)}.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Coefficients of (1 + x)${n}: put x = ${x > 0 ? '1' : '−1'}`, col), y0 = top + 40, bh = (h - y0 - 56) / 2, mx = C(n, Math.floor(n / 2)), bw = (w - 30) / (n + 1), zero = y0 + bh;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(15, zero); ctx.lineTo(w - 15, zero); ctx.stroke();
    let run = 0;
    for (let k = 0; k <= n; k++) { const v = C(n, k) * x ** k, hh = (Math.abs(v) / mx) * (bh - 6), xx = 15 + k * bw; ctx.fillStyle = v >= 0 ? col.s[0] : col.s[1]; ctx.globalAlpha = 0.55; ctx.fillRect(xx + 2, v >= 0 ? zero - hh : zero, bw - 4, hh); ctx.globalAlpha = 1; text(ctx, String(v).replace('-', '−'), xx + bw / 2, v >= 0 ? zero - hh - 8 : zero + hh + 9, { color: col.ink, size: 10.5, weight: 700, align: 'center' }); run += v; }
    text(ctx, `running total of all the bars = ${run}`.replace('-', '−'), w / 2, h - 18, { color: col.ink, size: 14, weight: 700, align: 'center' });
  };
  re();
}
