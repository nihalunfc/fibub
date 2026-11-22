// 4.3 Two travellers on one road: toward each other the gap closes at the sum of speeds, same way at the difference.
import { canvas, text, line, dot, row, slider, choice, button, readout, title, loop } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.32, max: 200, min: 160, label: 'Two travellers closing a gap' });
  let v1 = 60, v2 = 40, gap = 300, mode = 'toward', t = 0;
  const ctl = row(host), f = (v) => `${Math.round(v)} km/h`;
  slider(ctl, { label: 'Speed A', min: 20, max: 120, step: 10, value: v1, fmt: f, oninput: (v) => { v1 = v; t = 0; say(); } });
  slider(ctl, { label: 'Speed B', min: 10, max: 110, step: 10, value: v2, fmt: f, oninput: (v) => { v2 = v; t = 0; say(); } });
  choice(ctl, 'Direction', [['toward', 'Toward each other'], ['chase', 'A chases B']], mode, (v) => { mode = v; t = 0; say(); });
  const lp = loop(host, (dt) => { const T = meet(); if (T && t < T) { t = Math.min(T, t + dt * T / 4); cv.redraw(); } });
  button(ctl, '↻ Replay', () => { t = 0; });
  const out = readout(host);
  const close = () => (mode === 'toward' ? v1 + v2 : v1 - v2), meet = () => (close() > 0 ? gap / close() : null);
  const say = () => { const c = close(); out.innerHTML = c <= 0 ? 'A is not faster than B, so A never catches up.' : `The ${gap} km gap shrinks by ${mode === 'toward' ? `${v1} + ${v2}` : `${v1} − ${v2}`} = ${c} km every hour, so they meet after ${gap} ÷ ${c} = <b>${+(gap / c).toFixed(2)} hours</b>.`; };
  cv.draw = (ctx, w, h, col) => {
    const L = 20, R = w - 20, y = h * 0.55, X = (km) => L + (km / (mode === 'toward' ? gap : gap * 2.5)) * (R - L);
    line(ctx, [[L, y], [R, y]], col.line, 3);
    const a = v1 * t, b = mode === 'toward' ? gap - v2 * t : gap + v2 * t;
    dot(ctx, X(a), y, 9, col.s[0]); text(ctx, 'A', X(a), y, { color: col.panel, size: 10, weight: 700, align: 'center' });
    dot(ctx, X(b), y, 9, col.s[1]); text(ctx, 'B', X(b), y, { color: col.panel, size: 10, weight: 700, align: 'center' });
    text(ctx, `t = ${t.toFixed(2)} h · gap ${Math.max(0, Math.abs(b - a)).toFixed(0)} km`, w / 2, y + 30, { color: col.ink, size: 12, align: 'center' });
    title(ctx, mode === 'toward' ? 'Closing speed = sum of speeds' : 'Closing speed = difference of speeds', col);
  };
  cv.redraw(); say();
}
