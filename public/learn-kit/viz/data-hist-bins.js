// Bin width changes the story. The same 150 values (two overlapping groups, made up) drawn with 3 to 40 bins: too few
// hides the two humps, too many is noise. Switch to equal-COUNT bins (pandas qcut) to see why they differ from
// equal-WIDTH bins (pandas cut). Try: find the bin count where the two humps first appear.
import { canvas, text, row, choice, slider, readout, title, axes, rng } from '../kit.js';

const R = rng(3), g = () => Math.sqrt(-2 * Math.log(R() || 1e-9)) * Math.cos(2 * Math.PI * R());
const D = Array.from({ length: 150 }, (_, i) => (i % 5 < 2 ? 62 + g() * 5 : 40 + g() * 6)).sort((a, b) => a - b);
export default function (host) {
  let k = 8, kind = 'width';
  const cv = canvas(host, { aspect: 0.75, max: 440, min: 290, label: 'A histogram of 150 values with an adjustable number of bins' });
  const c1 = row(host); slider(c1, { label: 'bins', min: 3, max: 40, step: 1, value: k, fmt: (v) => String(Math.round(v)), oninput: (v) => { k = Math.round(v); draw(); } });
  const c2 = row(host); choice(c2, 'Edges', [['width', 'Equal width (cut)'], ['count', 'Equal count (qcut)']], kind, (v) => { kind = v; draw(); });
  const out = readout(host);
  const lo = 25, hi = 80;
  const edges = () => (kind === 'width' ? Array.from({ length: k + 1 }, (_, i) => lo + ((hi - lo) * i) / k) : Array.from({ length: k + 1 }, (_, i) => (i === 0 ? lo : i === k ? hi : D[Math.floor((D.length * i) / k)])));
  function draw() { const e = edges(), c = e.slice(1).map((b, i) => D.filter((v) => v >= e[i] && (i === k - 1 ? v <= b : v < b)).length); out.innerHTML = kind === 'width' ? `<code>pd.cut(s, bins=${k})</code>: ${k} bins of equal width ${((hi - lo) / k).toFixed(1)}, counts from ${Math.min(...c)} to ${Math.max(...c)}. ${k < 6 ? 'Too few bins: the two humps are hidden.' : k > 25 ? 'Too many bins: the shape is lost in noise.' : 'A good number shows two humps.'}` : `<code>pd.qcut(s, q=${k})</code>: every bin holds about ${Math.round(D.length / k)} values, so bins are narrow where data is dense and wide where it is sparse. Bar height shows density (count ÷ width).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const e = edges(), dens = e.slice(1).map((b, i) => D.filter((v) => v >= e[i] && (i === k - 1 ? v <= b : v < b)).length / Math.max(0.01, b - e[i]));
    const ax = axes(ctx, w, h, col, { x: [lo, hi], y: [0, Math.max(...dens) * 1.15], xlabel: 'value', ylabel: kind === 'width' ? 'count per unit' : 'density', l: 40, t: 26, fy: (v) => (+v.toFixed(1)).toString() }); title(ctx, `${k} bins`, col);
    dens.forEach((d, i) => { ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(ax.X(e[i]) + 0.5, ax.Y(d), Math.max(1, ax.X(e[i + 1]) - ax.X(e[i]) - 1), ax.B - ax.Y(d)); }); ctx.globalAlpha = 1;
  };
  draw();
}
