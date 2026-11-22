// Class 12 Biology, Reproductive Health: how birth and death rates make a population grow. Net growth rate r = (birth rate - death rate) / 1000 per year, and
// the population follows P = P0 e^(rt), so it doubles in 0.693 / r years. The dots are India's census counts (Census of India): 361 million in 1951,
// 439 (1961), 548 (1971), 683 (1981), 846 (1991), 1029 (2001), 1211 million (2011). Birth 30 and death 10 per 1000 fits them well (2 % a year).
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let b = 30, d = 10, span = 60;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 310, label: 'Population growth curve from 1951 for chosen birth and death rates, with the points of the Indian census' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'births per 1000 per year', min: 10, max: 40, step: 1, value: b, fmt: (v) => String(Math.round(v)), oninput: (v) => { b = Math.round(v); go(); } });
  slider(ctl, { label: 'deaths per 1000 per year', min: 5, max: 30, step: 1, value: d, fmt: (v) => String(Math.round(v)), oninput: (v) => { d = Math.round(v); go(); } });
  slider(ctl, { label: 'years from 1951', min: 20, max: 100, step: 5, value: span, fmt: (v) => String(Math.round(v)), oninput: (v) => { span = Math.round(v); go(); } });
  const CENSUS = [[1951, 361], [1961, 439], [1971, 548], [1981, 683], [1991, 846], [2001, 1029], [2011, 1211]];
  const P = (t) => 361 * Math.exp(((b - d) / 1000) * t);
  const go = () => { const r = (b - d) / 1000; ro.textContent = `Net growth ${(r * 100).toFixed(1)} % a year (births − deaths = ${b - d} per 1000). ${r > 0 ? `It doubles every ${(Math.LN2 / r).toFixed(0)} years.` : r < 0 ? 'The population shrinks.' : 'The population is steady.'} After ${span} years the model gives ${Math.round(P(span))} million; the census value in 2011 (60 years) was 1211 million.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Population from 1951 (millions)', col);
    const mx = Math.max(1300, P(span) * 1.05), A = axes(ctx, w, h, col, { x: [0, span], y: [0, mx], t: top + 4, l: 50, xlabel: 'years after 1951', fx: (v) => String(Math.round(v)) });
    const pts = []; for (let t = 0; t <= span; t += span / 100) pts.push([A.X(t), A.Y(P(t))]);
    ctx.save(); A.clip(); line(ctx, pts, col.s[0], 3); ctx.restore();
    CENSUS.forEach(([y, v]) => { if (y - 1951 <= span) dot(ctx, A.X(y - 1951), A.Y(v), 4.5, col.s[3], col.panel); });
    text(ctx, 'dots: census of India', A.L + 8, A.T + 12, { color: col.s[3], size: 10.5, weight: 700 }); text(ctx, 'line: your model', A.L + 8, A.T + 28, { color: col.s[0], size: 10.5, weight: 700 });
  };
  go();
}
