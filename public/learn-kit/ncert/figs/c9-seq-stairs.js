// Class 9 Sequences: an arithmetic progression (AP) as a staircase. Each step is the same amount higher than the
// one before: first term a, common difference d, so the nth term is a + (n - 1) d. Climb the stairs and read off terms.
import { canvas, text, title, row, slider, button, readout, loop } from '../../kit.js';

const mn = (v) => String(v).replace('-', '−');
const ord = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
export default function (host) {
  let a = 3, d = 2, n = 6, climb = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 290, label: 'A staircase whose step heights form an arithmetic progression' });
  const ctl = row(host);
  slider(ctl, { label: 'First term a', min: -4, max: 10, step: 1, value: a, fmt: mn, oninput: (v) => { a = v; sync(); } });
  slider(ctl, { label: 'Common difference d', min: -3, max: 5, step: 1, value: d, fmt: mn, oninput: (v) => { d = v; sync(); } });
  slider(ctl, { label: 'Which term n', min: 1, max: 10, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = v; sync(); } });
  const c2 = row(host);
  button(c2, 'Climb', () => { climb = 0.001; });
  loop(host, (dt) => { if (climb > 0 && climb < 10.5) { climb += dt * 3; if (climb >= 10.5) climb = 0; cv.redraw(); } });
  const out = readout(host);
  const term = (i) => a + (i - 1) * d;
  function sync() { out.innerHTML = `Terms: ${Array.from({ length: 6 }, (_, i) => mn(term(i + 1))).join(', ')}, ... Each step changes by d = ${mn(d)}. The ${ord(n)} term is a + (n − 1)d = ${mn(a)} + ${n - 1} × (${mn(d)}) = <b>${mn(term(n))}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'AP staircase: step height = a + (n − 1)d', col), N = 10, vals = Array.from({ length: N }, (_, i) => term(i + 1)), lo = Math.min(0, ...vals), hi = Math.max(0, ...vals), gx0 = 14, gx1 = w - 14, by = h - 38, ty = top + 22, sc = (by - ty) / (hi - lo || 1), y0 = by - (0 - lo) * sc, bw = (gx1 - gx0) / N;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(gx0, y0); ctx.lineTo(gx1, y0); ctx.stroke();
    vals.forEach((v, i) => {
      const x = gx0 + i * bw, y = y0 - v * sc, on = i + 1 === n, rev = climb > 0 ? i + 1 <= climb : true;
      if (!rev) return;
      ctx.fillStyle = on ? col.s[2] : col.s[0]; ctx.globalAlpha = on ? 0.95 : 0.55; ctx.fillRect(x + 2, Math.min(y, y0), bw - 4, Math.abs(y0 - y) || 1); ctx.globalAlpha = 1;
      text(ctx, mn(v), x + bw / 2, v >= 0 ? y - 9 : y + 11, { color: col.ink, size: 11, weight: on ? 700 : 400, align: 'center', halo: col.panel });
      text(ctx, String(i + 1), x + bw / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
    });
  };
  sync();
}
