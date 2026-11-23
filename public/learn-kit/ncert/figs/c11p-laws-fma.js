// Class 11 Laws of Motion: Newton's second law F = m a (net force). Two trolleys on a smooth track: a fixed reference (10 N on 5 kg, so a = 2 m/s^2) and yours, with force and mass you choose.
// Acceleration is proportional to the net force and inversely proportional to the mass. The distance covered from rest in time t is (1/2) a t^2, so a bigger a pulls ahead.
import { canvas, text, title, line, dot, arrow, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let F = 20, m = 5, t = 0, hold = 0; const T = 3;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'Two trolleys on a track pushed with different forces and masses' });
  const ctl = row(host), out = readout(host);
  const anim = loop(host, (d) => { if (hold > 0) { hold -= d; if (hold <= 0) t = 0; } else { t += d; if (t >= T) { t = T; hold = 1.2; } } say(); });
  slider(ctl, { label: 'Net force F (N)', min: 2, max: 40, step: 2, value: F, fmt: (v) => v + ' N', oninput: (v) => { F = v; t = 0; hold = 0; say(); } });
  slider(ctl, { label: 'Mass m (kg)', min: 1, max: 10, step: 1, value: m, fmt: (v) => v + ' kg', oninput: (v) => { m = v; t = 0; hold = 0; say(); } });
  anim.button(ctl);
  function say() { const a = F / m; out.innerHTML = `Yours: a = F/m = ${F}/${m} = <b>${a.toFixed(2)} m/s²</b>; after ${t.toFixed(1)} s it has speed ${(a * t).toFixed(1)} m/s and has covered ${(0.5 * a * t * t).toFixed(1)} m. Reference trolley: a = 10/5 = 2 m/s². ${a > 2 ? 'Yours is ahead: more force or less mass gives more acceleration.' : a < 2 ? 'The reference is ahead.' : 'Dead heat.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'F = ma: force, mass and acceleration', col);
    const a = F / m, L = 24, W = w - 60, MAX = 0.5 * Math.max(a, 2, 8) * T * T, X = (s) => L + Math.min(1, s / MAX) * (W - 40);
    [[2, 10, 5, col.s[1], 'reference: 10 N, 5 kg'], [a, F, m, col.s[0], `yours: ${F} N, ${m} kg`]].forEach(([acc, f, mm, c, lab], k) => {
      const y = 84 + k * 84, s = 0.5 * acc * t * t; line(ctx, [[L, y + 20], [L + W, y + 20]], col.muted, 2);
      const sz = 14 + mm * 1.6; ctx.fillStyle = c; ctx.fillRect(X(s), y + 20 - sz - 4, sz + 22, sz); dot(ctx, X(s) + 8, y + 18, 4, col.ink); dot(ctx, X(s) + sz + 14, y + 18, 4, col.ink);
      arrow(ctx, X(s) - Math.min(60, f * 1.4), y + 20 - sz / 2 - 4, X(s) - 2, y + 20 - sz / 2 - 4, col.ink, 3, 8);
      text(ctx, lab, L, y - 26, { size: 11, weight: 700, color: c });
    });
    text(ctx, 'arrow length = force; trolley size = mass', w / 2, h - 8, { size: 10, color: col.muted, align: 'center' });
  };
  say();
}
