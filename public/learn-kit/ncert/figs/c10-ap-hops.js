// Class 10 Arithmetic Progressions: the n-th term as hops on a number line. Start at a and make (n - 1) hops of size d.
// The landing point is a + (n - 1)d. Press Play to watch the hops, or drag n to land on any term.
import { canvas, text, title, line, dot, row, slider, readout, loop, ticks, fmt } from '../../kit.js';

export default function (host) {
  let a = 3, d = 4, n = 6, prog = 0;
  const cv = canvas(host, { aspect: 0.6, max: 440, min: 290, label: 'A frog hopping along a number line in equal jumps' });
  const ctl = row(host);
  slider(ctl, { label: 'a', min: -10, max: 15, step: 1, value: a, oninput: (v) => { a = v; restart(); } });
  slider(ctl, { label: 'd', min: -6, max: 8, step: 1, value: d, oninput: (v) => { d = v; restart(); } });
  slider(ctl, { label: 'n', min: 1, max: 12, step: 1, value: n, oninput: (v) => { n = v; restart(); } });
  const anim = loop(host, (dt) => { if (prog < n - 1) { prog = Math.min(n - 1, prog + dt * 2.2); cv.redraw(); } });
  const restart = () => { prog = 0; anim.play(); say(); cv.redraw(); };
  const out = readout(host);
  const say = () => { out.innerHTML = `Start at a = ${a}, make ${n - 1} hop${n === 2 ? '' : 's'} of ${d}: a<sub>${n}</sub> = ${a} + ${n - 1} × ${d} = <b>${a + (n - 1) * d}</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `a${n} = a + (n − 1)d`, col);
    const vals = [a, a + (n - 1) * d, a, 0], lo = Math.min(...vals, 0) - 2, hi = Math.max(...vals, 0) + 2, L = 20, R = w - 20, Y = (v) => L + ((v - lo) / (hi - lo)) * (R - L);
    const y = h * 0.62;
    line(ctx, [[L, y], [R, y]], col.muted, 2);
    ctx.font = '11px system-ui'; 
    for (const v of ticks(lo, hi, Math.max(3, Math.floor((R - L) / 36)))) { line(ctx, [[Y(v), y - 4], [Y(v), y + 4]], col.muted, 1); text(ctx, fmt(v), Y(v), y + 16, { color: col.muted, size: 10.5, align: 'center' }); }
    const full = Math.floor(prog);
    for (let i = 0; i < n; i++) {
      const v = a + i * d, reached = i <= prog + 1e-9;
      dot(ctx, Y(v), y, 5, reached ? col.s[0] : col.line);
      if (reached) text(ctx, 'a' + (i + 1), Y(v), y + 34, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    }
    for (let i = 0; i < full || i < Math.ceil(prog); i++) {
      if (i >= n - 1) break;
      const f = Math.min(1, prog - i); if (f <= 0) break;
      const x0 = Y(a + i * d), x1 = Y(a + (i + f) * d), mx = (x0 + x1) / 2, hh = 30 + 6 * (Math.abs(x1 - x0) > 40 ? 1 : 0);
      ctx.beginPath(); ctx.moveTo(x0, y); ctx.quadraticCurveTo(mx, y - hh * 1.6, x1, y); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.stroke();
      if (f >= 1 && Math.abs(Y(a + (i + 1) * d) - Y(a + i * d)) > 26) text(ctx, (d >= 0 ? '+' : '−') + Math.abs(d), (x0 + x1) / 2, y - hh * 0.8 - 6, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    }
    const pv = a + prog * d, py = y - 14 - Math.abs(Math.sin(prog * Math.PI)) * 14;
    dot(ctx, Y(pv), py, 8, col.s[1], col.panel);
    text(ctx, 'frog', Y(pv), py - 14, { color: col.s[1], size: 10.5, weight: 700, align: 'center' });
    void top;
  };
  say();
}
