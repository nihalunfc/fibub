// Class 9 Earth as a system: weather versus climate. Each dot is the yearly average temperature of an imaginary
// Indian city for 1965 to 2024: a steady trend you can set, plus random year-to-year "weather" wobble (seeded, so
// it is the same each visit). One year's value jumps about; the average over many years (climate, usually 30 years)
// shows the slow trend. Move the averaging slider to see the noise melt away.
import { canvas, text, title, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let n = 1, tr = 0.3;
  const cv = canvas(host, { aspect: 0.74, max: 440, min: 270, label: 'Yearly temperature dots with a moving average line over a chosen number of years' });
  const ctl = row(host);
  slider(ctl, { label: 'Average over', min: 1, max: 30, step: 1, value: 1, fmt: (v) => v + (v === 1 ? ' year' : ' years'), oninput: (v) => { n = v; go(); } });
  slider(ctl, { label: 'Warming per decade', min: 0, max: 0.6, step: 0.05, value: 0.3, fmt: (v) => v.toFixed(2) + ' °C', oninput: (v) => { tr = v; go(); } });
  const out = readout(host);
  let s = 7; const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const noise = Array.from({ length: 60 }, () => (rnd() + rnd() + rnd() - 1.5) * 1.2);
  const data = () => noise.map((e, i) => 26.5 + tr * i / 10 + e);
  const avg = (d) => d.map((_, i) => { if (i < n - 1) return null; let sum = 0; for (let k = 0; k < n; k++) sum += d[i - k]; return sum / n; });
  function go() {
    const d = data(), a = avg(d).filter((v) => v !== null), spread = Math.max(...a) - Math.min(...a);
    out.innerHTML = n === 1 ? `Single years jump by up to ${(Math.max(...d) - Math.min(...d)).toFixed(1)} °C: that is <b>weather</b>-like wobble.` : `With a ${n}-year average the line is smooth: it climbs about ${(a.at(-1) - a[0]).toFixed(1)} °C over the record. A long average like this is what we call <b>climate</b>.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Yearly average temperature, 1965 to 2024', col) + 6;
    const L = 40, R = w - 12, T = top + 6, B = h - 26, lo = 24, hi = 31;
    const X = (i) => L + i / 59 * (R - L), Y = (v) => B - (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (B - T);
    for (const v of [24, 26, 28, 30]) { line(ctx, [[L, Y(v)], [R, Y(v)]], col.line, 1); text(ctx, v + '°', L - 6, Y(v), { color: col.muted, size: 10, align: 'right' }); }
    for (const [i, y] of [[0, 1965], [20, 1985], [40, 2005], [59, 2024]]) text(ctx, String(y), X(i), B + 13, { color: col.muted, size: 10, align: 'center' });
    const d = data(); d.forEach((v, i) => dot(ctx, X(i), Y(v), 2.8, col.muted));
    const a = avg(d), pts = a.map((v, i) => (v === null ? null : [X(i), Y(v)])).filter(Boolean);
    if (pts.length > 1) line(ctx, pts, col.s[1], 3);
  };
  go();
}
