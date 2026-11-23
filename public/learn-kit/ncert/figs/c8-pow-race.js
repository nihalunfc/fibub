// Class 8 Power Play: adding versus doubling. Plan A adds Rs 100 every day (100 x d). Plan B starts with Rs 1 and doubles
// every day (2^(d-1)). Slide the days: for a while A is ahead, then doubling overtakes and runs away.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let d = 10;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'Line chart: adding 100 rupees a day against doubling from 1 rupee' });
  const out = readout(host); const ctl = row(host);
  const sl = slider(ctl, { label: 'Days', min: 1, max: 30, step: 1, value: d, fmt: (v) => Math.round(v), oninput: (v) => { d = Math.round(v); anim.pause(); sync(); } });
  const anim = loop(host, (dt) => { d += dt * 4; if (d > 30) d = 1; sl.set(Math.round(d)); sync(); }, { autoplay: false });
  anim.button(ctl);
  const A = (x) => 100 * x, B = (x) => 2 ** (x - 1), f = (v) => v >= 1e7 ? (v / 1e7).toFixed(1) + ' crore' : v >= 1e5 ? (v / 1e5).toFixed(1) + ' lakh' : Math.round(v).toLocaleString('en-IN');
  function sync() { const r = Math.round(d); out.innerHTML = `Day ${r}: Plan A (add ₹100 daily) = <b>₹${f(A(r))}</b>. Plan B (₹1, then double daily) = <b>₹${f(B(r))}</b>. ${B(r) > A(r) ? 'Doubling is ahead.' : 'Adding is still ahead.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Adding versus doubling (₹)', col), r = Math.round(d), x0 = 40, x1 = w - 14, y1 = top + 14, y0 = h - 30, mx = Math.max(A(r), B(r), 1000) * 1.1;
    const X = (v) => x0 + ((v - 1) / 29) * (x1 - x0), Y = (v) => y0 - (v / mx) * (y0 - y1);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.stroke();
    [[A, col.s[0]], [B, col.s[3]]].forEach(([fn, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 1; i <= r; i++) { const x = X(i), y = Y(fn(i)); i === 1 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(r), Y(fn(r)), 4.5, 0, 7); ctx.fill(); });
    text(ctx, 'A: +100 each day', x0 + 8, y1 + 6, { color: col.s[0], size: 11.5, weight: 700 }); text(ctx, 'B: ×2 each day', x0 + 8, y1 + 22, { color: col.s[3], size: 11.5, weight: 700 });
    text(ctx, 'day 1', x0, y0 + 14, { color: col.muted, size: 10 }); text(ctx, 'day 30', x1, y0 + 14, { color: col.muted, size: 10, align: 'right' }); text(ctx, 'scale changes as the line grows', w / 2, y0 + 14, { color: col.muted, size: 10, align: 'center' });
  };
  sync();
}
