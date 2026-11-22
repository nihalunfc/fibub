// Build a journey from three stretches of constant acceleration and see all three graphs at once: a–t (steps), v–t
// (straight pieces; its slope is a) and x–t (smooth curve; its slope is v). The shaded area under v–t is the distance.
// A car follows along the bottom. Try a braking stretch (negative a) and look for where v crosses zero.
import { canvas, text, row, slider, readout, loop, button, line } from '../kit.js';

export default function (host) {
  let t = 0;
  const cv = canvas(host, { aspect: 1.05, max: 460, min: 330, label: 'Acceleration, velocity and position graphs of a three-stage journey, with a car' });
  const c1 = row(host), c2 = row(host);
  const A = [2, 0, -3].map((v, i) => slider(c1, { label: 'a' + (i + 1), min: -5, max: 5, step: 0.5, value: v, fmt: (x) => x + ' m/s²', oninput: re }));
  const sd = slider(c2, { label: 'Each stage lasts', min: 2, max: 6, step: 1, value: 4, fmt: (v) => v + ' s', oninput: re });
  const anim = loop(host, (dt) => { t += dt * 1.5; if (t > 3 * sd.value + 1) t = 0; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  function re() { t = 0; cv.redraw(); show(); }
  function state(tm) {
    const D = sd.value; let x = 0, v = 0, a = 0, tt = 0;
    for (let i = 0; i < 3; i++) { const dt = Math.min(D, Math.max(0, tm - i * D)); x += v * dt + 0.5 * A[i].value * dt * dt; v += A[i].value * dt; if (tm >= i * D && tm <= (i + 1) * D) a = A[i].value; }
    return { x, v, a: tm > 3 * D ? 0 : a };
  }
  function show() {
    const D = sd.value, s = state(3 * D), mid = [state(D), state(2 * D)];
    out.innerHTML = `After ${D} s: v = ${mid[0].v.toFixed(1)} m/s, x = ${mid[0].x.toFixed(1)} m. After ${2 * D} s: v = ${mid[1].v.toFixed(1)}, x = ${mid[1].x.toFixed(1)}. At the end (${3 * D} s): v = ${s.v.toFixed(1)} m/s, x = ${s.x.toFixed(1)} m. Slope of v–t = a, slope of x–t = v, area under v–t = displacement (negative area when v < 0).`;
  }
  cv.draw = (ctx, w, h, col) => {
    const D = sd.value, tot = 3 * D, N = 90, S = []; for (let i = 0; i <= N; i++) S.push(state((tot * i) / N));
    const panels = [['a (m/s²)', (s) => s.a, col.s[2], -5, 5], ['v (m/s)', (s) => s.v, col.s[0], null], ['x (m)', (s) => s.x, col.s[1], null]];
    const ph = (h - 54) / 3, gx0 = 44, gx1 = w - 12, X = (tm) => gx0 + (tm / tot) * (gx1 - gx0);
    panels.forEach(([name, f, c, lo, hi], k) => {
      const y0 = 16 + k * ph, y1 = y0 + ph - 18, vals = S.map(f), mn = lo ?? Math.min(0, ...vals), mx = hi ?? Math.max(0.1, ...vals) , Y = (v) => y1 - ((v - mn) / (mx - mn || 1)) * (y1 - y0);
      line(ctx, [[gx0, Y(0)], [gx1, Y(0)]], col.muted, 1); line(ctx, [[gx0, y0], [gx0, y1]], col.muted, 1);
      text(ctx, name, 4, y0 + 2, { color: c, size: 10, weight: 700 });
      if (k === 1) { ctx.fillStyle = c; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); S.forEach((s, i) => { if (i * tot / N <= t) ctx.lineTo(X(i * tot / N), Y(f(s))); }); ctx.lineTo(X(Math.min(t, tot)), Y(0)); ctx.fill(); ctx.globalAlpha = 1; }
      line(ctx, S.map((s, i) => [X((tot * i) / N), Y(f(s))]), c, 2.5);
      const cur = state(Math.min(t, tot)); ctx.beginPath(); ctx.arc(X(Math.min(t, tot)), Y(f(cur)), 5, 0, 7); ctx.fillStyle = col.bad; ctx.fill();
      [1, 2].forEach((i) => line(ctx, [[X(i * D), y0], [X(i * D), y1]], col.line, 1));
    });
    const xs = S.map((s) => s.x), x0 = Math.min(0, ...xs), x1 = Math.max(1, ...xs), cy = h - 14, car = state(Math.min(t, tot)).x;
    line(ctx, [[gx0, cy], [gx1, cy]], col.muted, 2);
    const cx = gx0 + ((car - x0) / (x1 - x0)) * (gx1 - gx0 - 20); ctx.fillStyle = col.s[0]; ctx.fillRect(cx, cy - 12, 20, 10);
    ctx.beginPath(); ctx.arc(cx + 5, cy - 2, 3, 0, 7); ctx.arc(cx + 15, cy - 2, 3, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
  };
  show();
}
