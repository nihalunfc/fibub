// Class 10 Real Numbers: when does m^n end in the digit 0? Only if its prime factors include both 2 and 5; each pair (2, 5) makes one trailing zero.
// Counts of 2s and 5s in m^n are n times those in m. Used to show that 4^n or 6^n can never end in 0.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let m = 12, n = 3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 300, label: 'Counts of the prime factors 2 and 5 in a power and the zeros they make at the end' });
  const ctl = row(host);
  slider(ctl, { label: 'Base m', min: 2, max: 40, step: 1, value: m, fmt: String, oninput: (v) => { m = v; upd(); } });
  slider(ctl, { label: 'Power n', min: 1, max: 8, step: 1, value: n, fmt: String, oninput: (v) => { n = v; upd(); } });
  const out = readout(host);
  const cnt = (x, p) => { let c = 0; while (x % p === 0) { x /= p; c++; } return c; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${m}^${n} = ${(BigInt(m) ** BigInt(n)).toString()}`, col) + 22, t = cnt(m, 2) * n, f = cnt(m, 5) * n, mx = Math.max(t, f, 6), s = Math.min(22, (w - 60) / mx), z = Math.min(t, f);
    const bar = (y, c, p, tone) => { text(ctx, `${p}s`, 8, y + s / 2, { color: tone, size: 13, weight: 700 }); for (let i = 0; i < c; i++) { ctx.fillStyle = i < z ? tone : col.soft; ctx.strokeStyle = tone; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(40 + i * s, y, s - 3, s - 3, 3); ctx.fill(); ctx.stroke(); } if (!c) text(ctx, 'none', 40, y + s / 2, { color: col.muted, size: 12 }); };
    bar(top, t, 2, col.s[0]); bar(top + s + 14, f, 5, col.s[1]);
    text(ctx, `Pairs of (2, 5) = trailing zeros: ${z}`, w / 2, top + 2 * s + 56, { color: z ? col.s[3] : col.s[6], size: 13, weight: 700, align: 'center' });
  };
  function upd() { const t = cnt(m, 2) * n, f = cnt(m, 5) * n, z = Math.min(t, f);
    out.innerHTML = `${m}<sup>${n}</sup> has ${t} twos and ${f} fives among its prime factors. ` + (z ? `Each 2 with a 5 makes a 10: it ends in <b>${z} zero${z > 1 ? 's' : ''}</b>.` : `${t ? 'No 5 at all' : 'No 2 at all'}, so it can <b>never</b> end in 0.`); cv.redraw(); }
  upd();
}
