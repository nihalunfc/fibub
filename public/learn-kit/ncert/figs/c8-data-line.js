// Class 8 Tales by Dots and Lines: a line graph shows how something changes with time. Points are measured; the line
// between them is an estimate. Starting the axis at a high number (zoomed) can make a small change look huge.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const T = [6, 8, 10, 12, 14, 16, 18, 20], V = [14, 16, 21, 26, 28, 26, 21, 17];
export default function (host) {
  let t = 11, zoom = false;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 280, label: 'Temperature through a day as a line graph, with a time slider' });
  const ctl = row(host);
  choice(ctl, 'Axis starts at', [[false, '0 °C'], [true, '12 °C']], zoom, (v) => { zoom = v; sync(); });
  slider(ctl, { label: 'Time', min: 6, max: 20, step: 0.5, value: t, fmt: (v) => v.toFixed(1).replace('.5', ':30').replace('.0', ':00'), oninput: (v) => { t = v; sync(); } });
  const out = readout(host);
  const at = (x) => { let i = 0; while (i < T.length - 2 && x > T[i + 1]) i++; return V[i] + ((V[i + 1] - V[i]) * (x - T[i])) / (T[i + 1] - T[i]); };
  function sync() { out.innerHTML = `At ${Math.floor(t)}:${t % 1 ? '30' : '00'} the line reads about <b>${+at(t).toFixed(1)} °C</b>${T.includes(t) ? ' (a measured point)' : ' (between two measured points, so an estimate)'}. ${zoom ? 'Careful: the axis starts at 12, so the afternoon looks more than twice as hot as the morning, but 28 is only twice 14.' : 'Axis from 0: the heights are honest.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Temperature (°C) during a winter day', col), L = 36, B = h - 34, W = w - L - 14, Hh = B - top - 14, lo = zoom ? 12 : 0, hi = 30, X = (x) => L + ((x - 6) / 14) * W, Y = (v) => B - ((v - lo) / (hi - lo)) * Hh;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1;
    for (let g = lo; g <= hi; g += zoom ? 3 : 5) { ctx.beginPath(); ctx.moveTo(L, Y(g)); ctx.lineTo(L + W, Y(g)); ctx.stroke(); text(ctx, String(g), L - 5, Y(g), { color: col.muted, size: 10, align: 'right' }); }
    T.forEach((x) => text(ctx, x + ':00', X(x), B + 13, { color: col.muted, size: 9.5, align: 'center' }));
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.beginPath(); T.forEach((x, i) => (i ? ctx.lineTo(X(x), Y(V[i])) : ctx.moveTo(X(x), Y(V[i])))); ctx.stroke();
    T.forEach((x, i) => { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.arc(X(x), Y(V[i]), 4, 0, 7); ctx.fill(); });
    ctx.setLineDash([4, 3]); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(t), B); ctx.lineTo(X(t), Y(at(t))); ctx.lineTo(L, Y(at(t))); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.arc(X(t), Y(at(t)), 5.5, 0, 7); ctx.fill();
  };
  sync();
}
