// Class 8 Number Play: digital roots and casting out nines. The digital root of n is n repeated digit-sum down to one digit; it equals
// n mod 9 (with 9 for multiples of 9). So root(a x b) = root(root(a) x root(b)): a quick check for a product, which catches most slips.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 347, b = 26, err = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'Digital roots of two numbers and their product used to check a multiplication' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: 10, max: 999, step: 1, value: a, fmt: (v) => String(Math.round(v)), oninput: (v) => { a = Math.round(v); upd(); } });
  slider(ctl, { label: 'b', min: 2, max: 99, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); upd(); } });
  choice(ctl, 'Answer is', [[0, 'right'], [1, 'off by 1'], [9, 'off by 9']], err, (v) => { err = v; upd(); });
  const out = readout(host);
  const dr = (n) => (n === 0 ? 0 : 1 + ((n - 1) % 9));
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Casting out nines', col), P = a * b + err, ra = dr(a), rb = dr(b), rp = dr(P), chk = dr(ra * rb);
    const colw = w / 3, y = t + 34;
    [[a, ra, 'a'], [b, rb, 'b'], [P, rp, 'a × b']].forEach(([n, r, nm], i) => {
      const cx = colw * i + colw / 2;
      text(ctx, nm, cx, y, { color: col.muted, size: 12, align: 'center' });
      text(ctx, String(n), cx, y + 24, { color: col.ink, size: Math.min(22, colw / (String(n).length * 0.62 + 0.6)), weight: 700, align: 'center' });
      text(ctx, String(n).split('').join(' + ') + (String(n).length > 1 ? ' → ' : ''), cx, y + 50, { color: col.muted, size: 11, align: 'center' });
      ctx.beginPath(); ctx.arc(cx, y + 92, 24, 0, 7); ctx.fillStyle = col.s[i === 2 ? 3 : 0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
      text(ctx, String(r), cx, y + 92, { color: col.ink, size: 22, weight: 700, align: 'center' });
      text(ctx, 'root', cx, y + 128, { color: col.muted, size: 11, align: 'center' });
    });
    text(ctx, 'root(a) × root(b) = ' + ra + ' × ' + rb + ' = ' + ra * rb + ' → root ' + chk, w / 2, h - 46, { color: col.ink, size: 13, weight: 700, align: 'center' });
    text(ctx, chk === rp ? 'Roots match: the answer passes the check' : 'Roots differ: the answer is WRONG', w / 2, h - 22, { color: chk === rp ? col.s[2] : col.s[3], size: 14, weight: 700, align: 'center' });
  };
  function upd() { const P = a * b + err; out.innerHTML = `${a} × ${b} = ${a * b}. You wrote <b>${P}</b>. ${err === 9 ? 'An error of 9 changes no digital root, so the check cannot see it. Casting out nines is not proof.' : err === 1 ? 'An error of 1 changes the root, so the check catches it.' : 'Correct answers always pass.'}`; cv.redraw(); }
  upd();
}
