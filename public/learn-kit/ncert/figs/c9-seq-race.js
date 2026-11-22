// Class 9 Sequences: adding versus doubling. Plan A gives Rs 100 on day 1 and Rs 100 more every day (an AP: 100, 200,
// 300 ...). Plan B gives Rs 1 on day 1 and doubles the amount each day (1, 2, 4, 8 ...). For a while A is far ahead,
// but repeated doubling (a geometric progression) overtakes steady adding on day 12 and then runs away.
import { canvas, text, title, row, slider, button, readout, loop } from '../../kit.js';

const A = (n) => 100 * n, B = (n) => 2 ** (n - 1), fm = (v) => v.toLocaleString('en-IN');
export default function (host) {
  let day = 8, acc = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 290, label: 'A race between a plan that adds 100 rupees a day and a plan that doubles each day' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Day', min: 1, max: 20, step: 1, value: day, fmt: (v) => String(v), oninput: (v) => { day = v; sync(); } });
  const c2 = row(host);
  const anim = loop(host, (dt) => { acc += dt; if (acc > 0.5) { acc = 0; day = day >= 20 ? 1 : day + 1; sl.set(day); sync(); } }, { autoplay: false });
  anim.button(c2);
  const out = readout(host);
  function sync() { out.innerHTML = `Day ${day}: Plan A (add ₹100) gives ₹${fm(A(day))}. Plan B (start at ₹1, double daily) gives ₹${fm(B(day))}. ${B(day) > A(day) ? '<b>Doubling is ahead!</b>' : B(day) === A(day) ? 'Level.' : 'Adding is still ahead.'} Plan B on day ${day} is 2<sup>${day - 1}</sup>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Adding ₹100 a day vs doubling from ₹1', col), gx0 = 48, gx1 = w - 14, gy0 = top + 14, gy1 = h - 50, N = 20, X = (i) => gx0 + ((i - 1) / (N - 1)) * (gx1 - gx0), mx = Math.max(A(day), B(day), 400), Y = (v) => gy1 - (v / mx) * (gy1 - gy0);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    [0, 0.5, 1].forEach((f) => { ctx.beginPath(); ctx.moveTo(gx0, Y(mx * f)); ctx.lineTo(gx1, Y(mx * f)); ctx.stroke(); text(ctx, fm(Math.round(mx * f)), gx0 - 4, Y(mx * f), { color: col.muted, size: 9, align: 'right' }); });
    [1, 5, 10, 15, 20].forEach((i) => text(ctx, 'day ' + i, X(i), gy1 + 11, { color: col.muted, size: 10, align: 'center' }));
    [[A, col.s[0], 'A: +100'], [B, col.s[2], 'B: ×2']].forEach(([f, c, nm]) => {
      ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 1; i <= day; i++) { i === 1 ? ctx.moveTo(X(i), Y(f(i))) : ctx.lineTo(X(i), Y(f(i))); } ctx.stroke();
      for (let i = 1; i <= day; i++) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(i), Y(f(i)), 3.5, 0, 7); ctx.fill(); }
      ctx.fillStyle = c; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(day), Y(f(day)), 6, 0, 7); ctx.fill(); ctx.stroke();
    });
    text(ctx, 'A: ₹' + fm(A(day)), gx0 + 6, gy1 + 28, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'B: ₹' + fm(B(day)), gx1, gy1 + 28, { color: col.s[2], size: 12, weight: 700, align: 'right' });
  };
  sync();
}
