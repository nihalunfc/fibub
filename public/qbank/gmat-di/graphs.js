// Graphics Interpretation: a chart drawn from made-up data, and a sentence to complete with the closest value.
import { int, choose, numOpts, fmt } from '../grad-quant/_q.js';
const E = ['gmat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
// A bar chart in SVG; it uses currentColor so it follows light, dark and red modes.
function bars(vals, labels, unit, title) {
  const r1 = (z) => Math.round(z * 10) / 10, W = 340, H = 200, l = 40, b = 26, t = 24, max = Math.ceil(Math.max(...vals) * 1.1 / 50) * 50, bw = (W - l - 10) / vals.length;
  const y = (v) => H - b - (H - b - t) * v / max, ticks = [0, 1, 2, 3, 4, 5].map((k) => (max * k) / 5);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:420px" role="img" aria-label="${title}: ${labels.map((x, i) => x + ' ' + vals[i]).join(', ')}" font-size="11" fill="currentColor">` +
    `<text x="4" y="13" font-weight="700">${title}</text>` +
    ticks.map((v) => `<line x1="${l}" x2="${W - 6}" y1="${r1(y(v))}" y2="${r1(y(v))}" stroke="currentColor" stroke-opacity=".2"/><text x="${l - 4}" y="${r1(y(v) + 4)}" text-anchor="end">${v}</text>`).join('') +
    vals.map((v, i) => `<rect x="${r1(l + i * bw + bw * 0.18)}" y="${r1(y(v))}" width="${r1(bw * 0.64)}" height="${r1(H - b - y(v))}" fill="currentColor" fill-opacity=".55"/><text x="${r1(l + i * bw + bw / 2)}" y="${r1(y(v) - 3)}" text-anchor="middle" font-size="10">${v}</text><text x="${r1(l + i * bw + bw / 2)}" y="${H - 9}" text-anchor="middle">${labels[i]}</text>`).join('') + '</svg>';
}
const pct = (a, b) => ((b - a) / a) * 100;
const QS = [
  (v, L) => { let i = 1; for (let k = 2; k < v.length; k++) if (v[k] - v[k - 1] > v[i] - v[i - 1]) i = k;
    return { t: `The largest rise from one month to the next was closest to ____ units.`, val: v[i] - v[i - 1], traps: [v[i], v[i - 1]], why: `Compare each bar with the one before it. The biggest jump is ${L[i - 1]} to ${L[i]}: ${v[i]} − ${v[i - 1]} = ${v[i] - v[i - 1]}.` }; },
  (v, L) => { const i = 0, j = v.length - 1, p = pct(v[i], v[j]);
    return { t: `From ${L[i]} to ${L[j]}, sales changed by closest to ____ percent.`, val: Math.round(p), traps: [Math.round(pct(v[j], v[i])), v[j] - v[i]], why: `Percent change = (new − old) ÷ old = (${v[j]} − ${v[i]}) ÷ ${v[i]} = ${fmt(p, 1)}%. Divide by the starting month, not the end.` }; },
  (v, L) => { const s = v.reduce((a, b) => a + b, 0), m = s / v.length;
    return { t: 'The average (arithmetic mean) monthly sales were closest to ____ units.', val: Math.round(m), traps: [Math.round((Math.max(...v) + Math.min(...v)) / 2) + 7, s], why: `Total ${v.join(' + ')} = ${s}; ${s} ÷ ${v.length} = ${fmt(m, 1)}.` }; },
  (v, L) => { const lim = Math.round(v.reduce((a, b) => a + b, 0) / v.length / 10) * 10; const k = v.filter((x) => x > lim).length;
    return { t: `In ____ of the ${v.length} months, sales were above ${lim} units.`, val: k, traps: [v.length - k, k + 1, k - 1], why: `Bars above the ${lim} line: ${L.filter((_, i) => v[i] > lim).join(', ') || 'none'}, so ${k}.` }; },
];
const gen = (id, sub, qs) => ({ id, type: 'mcq', level: 3, exams: E, format: 'graph', sub,
      make(r) {
        const n = int(r, 5, 7), L = MONTHS.slice(0, n), v = []; let x = int(r, 8, 20) * 10;
        for (let i = 0; i < n; i++) { v.push(x); x = Math.max(40, x + int(r, -6, 9) * 10); }
        const Q = QS[choose(r, qs)](v, L), o = numOpts(r, Q.val, Q.traps, (z) => String(Math.round(z)));
        return { q: `<p>The chart shows the number of units a small workshop sold each month. Complete the sentence with the closest value.</p>${bars(v, L, 'units', 'Units sold per month')}<p>${Q.t}</p>`,
          options: o.options, answer: o.answer, value: Q.val, sol: `<p>${Q.why}</p><p><b>Tip:</b> on the test, charts often have no value labels. Read each bar against the gridlines, write the numbers down, then do the sum.</p>`, hint: 'Write the value of each bar under it first.', _v: v, _L: L };
      } });
export default {
  topic: 'graphs',
  gens: [gen('gi-g01', 'graphics interpretation', [0, 1, 2, 3]), gen('gi-g02', 'charts: change', [0]), gen('gi-g03', 'charts: percent change', [1]), gen('gi-g04', 'charts: averages and counts', [2, 3])],
};
