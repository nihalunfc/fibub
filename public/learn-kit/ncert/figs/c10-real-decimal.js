// Class 10 Real Numbers: decimal expansion of p/q by long division, digit by digit. If the reduced denominator has only the
// primes 2 and 5 the division stops (terminating); any other prime in it makes the remainders repeat (non-terminating, repeating).
import { canvas, text, title, row, slider, button, readout, loop } from '../../kit.js';

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const fac = (n) => { const m = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { m[p] = (m[p] || 0) + 1; n /= p; } if (n > 1) m[n] = (m[n] || 0) + 1; return m; };
export default function (host) {
  let p = 3, q = 7, shown = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Digits of the decimal expansion of a fraction appearing one by one with the repeating block highlighted' });
  const ctl = row(host);
  const a = loop(host, (dt) => { if (shown < 40) { shown += dt * 7; cv.redraw(); } });
  slider(ctl, { label: 'Numerator p', min: 1, max: 40, step: 1, value: p, fmt: String, oninput: (v) => { p = v; go(); } });
  slider(ctl, { label: 'Denominator q', min: 2, max: 40, step: 1, value: q, fmt: String, oninput: (v) => { q = v; go(); } });
  button(ctl, 'Replay', () => { shown = 0; a.play(); });
  const out = readout(host);
  let D = [], pre = 0, per = 0, intPart = 0, term = false;
  function go() {
    const g = gcd(p, q), pp = p / g, qq = q / g; intPart = Math.floor(pp / qq); let r = pp % qq; D = []; const seen = new Map(); term = false; pre = 0; per = 0;
    while (D.length < 40) { if (r === 0) { term = true; break; } if (seen.has(r)) { pre = seen.get(r); per = D.length - pre; break; } seen.set(r, D.length); r *= 10; D.push(Math.floor(r / qq)); r %= qq; }
    const f = fac(qq), ps = Object.keys(f).map(Number), only25 = ps.every((x) => x === 2 || x === 5);
    const fs = qq === 1 ? '1' : ps.map((x) => (f[x] > 1 ? `${x}<sup>${f[x]}</sup>` : x)).join(' × ');
    out.innerHTML = `${p}/${q}${g > 1 ? ` = ${pp}/${qq}` : ''}: denominator ${qq} = ${fs}. ` + (only25 ? `Only 2s and 5s, so it <b>terminates</b>${D.length ? ' after ' + D.length + ' digit' + (D.length > 1 ? 's' : '') : ''}.` : `It has another prime (${ps.find((x) => x !== 2 && x !== 5)}), so it <b>never ends</b>: the block of ${per} digit${per > 1 ? 's' : ''} repeats forever.`);
    shown = 0; a.play(); cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${p}/${q} as a decimal`, col) + 26;
    const per_row = Math.max(6, Math.floor((w - 24) / 24)), n = Math.min(D.length, Math.floor(shown));
    text(ctx, `${intPart}.`, 12, top, { color: col.ink, size: 20, weight: 700 });
    for (let i = 0; i < n; i++) { const c = (i + 2) % per_row, rr = Math.floor((i + 2) / per_row), x = 12 + c * 24 + 12, y = top + rr * 30, rep = !term && i >= pre;
      ctx.fillStyle = rep ? col.soft : col.panel; ctx.strokeStyle = rep ? col.s[1] : col.line; ctx.lineWidth = rep ? 2 : 1; ctx.beginPath(); ctx.roundRect(x - 10, y - 12, 21, 25, 4); ctx.fill(); ctx.stroke();
      text(ctx, String(D[i]), x, y, { color: col.ink, size: 15, weight: 700, align: 'center' }); }
    if (n >= D.length) { const rows = Math.floor((D.length + 1) / per_row);
      text(ctx, term ? 'It stops. Terminating decimal.' : 'Shaded digits repeat forever: non-terminating, repeating.', w / 2, top + (rows + 1) * 30 + 8, { color: term ? col.s[2] : col.s[1], size: 12, weight: 700, align: 'center' }); }
  };
  go();
}
