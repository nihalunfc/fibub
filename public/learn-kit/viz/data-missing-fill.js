// What you do with missing values changes the answer. Eleven values, three are missing (NaN) and one is an outlier.
// Pick a strategy and watch the mean and median move. Try: compare "fill with the mean" (it keeps the mean, shrinks the
// spread) with "fill with 0" (which drags the mean down) and "interpolate" (which follows the trend).
import { canvas, text, row, choice, readout, title, axes, dot, line } from '../kit.js';

const Y = [52, 55, null, 58, 61, null, 64, 120, null, 68, 70];
const med = (a) => { const s = a.slice().sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
export default function (host) {
  let how = 'skip';
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A series with missing points filled by different strategies' });
  const c1 = row(host); choice(c1, 'Strategy', [['skip', 'leave NaN'], ['drop', 'dropna'], ['zero', 'fill 0'], ['ffill', 'ffill'], ['mean', 'fill mean'], ['median', 'fill median'], ['interp', 'interpolate']], how, (v) => { how = v; draw(); });
  const out = readout(host);
  const have = Y.filter((v) => v !== null);
  function filled() {
    const mu = mean(have), md = med(have);
    return Y.map((v, i) => { if (v !== null) return v; if (how === 'zero') return 0; if (how === 'ffill') { for (let j = i - 1; j >= 0; j--) if (Y[j] !== null) return Y[j]; return null; } if (how === 'mean') return mu; if (how === 'median') return md; if (how === 'interp') { let a = i - 1, b = i + 1; while (Y[a] === null) a--; while (Y[b] === null) b++; return Y[a] + ((Y[b] - Y[a]) * (i - a)) / (b - a); } return null; });
  }
  function draw() { const f = filled().filter((v) => v !== null); out.innerHTML = `<b>${f.length}</b> values used: mean <b>${mean(f).toFixed(1)}</b>, median <b>${med(f).toFixed(1)}</b> (true known values: mean ${mean(have).toFixed(1)}, median ${med(have).toFixed(1)}). ${{ skip: 'Pandas mean() skips NaN by default, so nothing changes.', drop: 'dropna() removes the rows: fewer points, same mean.', zero: 'Zero is a made-up value; it drags the mean down.', ffill: 'Copies the last known value forward; good for slow-moving data.', mean: 'Mean stays the same but the spread shrinks.', median: 'Median fill is less pulled by the outlier 120.', interp: 'Draws a straight line between neighbours, so it respects the trend.' }[how]}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const ax = axes(ctx, w, h, col, { x: [0, 10], y: [0, 130], xlabel: 'row', l: 36, t: 26 }); title(ctx, 'Known values and filled values', col);
    const f = filled(); const mu = mean(f.filter((v) => v !== null));
    ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = col.s[1]; ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(mu)); ctx.lineTo(ax.R, ax.Y(mu)); ctx.stroke(); ctx.restore();
    text(ctx, `mean ${mu.toFixed(1)}`, ax.R - 4, ax.Y(mu) - 8, { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
    Y.forEach((v, i) => { if (v !== null) dot(ctx, ax.X(i), ax.Y(v), 4.5, col.s[0]); else { ctx.save(); ctx.strokeStyle = col.bad; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(i), ax.T); ctx.lineTo(ax.X(i), ax.B); ctx.stroke(); ctx.restore(); if (f[i] !== null) dot(ctx, ax.X(i), ax.Y(f[i]), 5, col.panel, col.bad); } });
  };
  draw();
}
