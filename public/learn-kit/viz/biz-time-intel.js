// Time intelligence on a calendar of 24 months (made-up sales). Pick a month, then a function: the highlighted bars are the
// months that function puts into the filter, and the total is what the measure returns. Compare YTD, same period last year,
// a rolling 3 months, and the previous month. Try moving the month to January: YTD resets.
import { canvas, text, title, row, slider, choice, readout } from '../kit.js';
import { wob, short } from './_biz.js';

const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATA = Array.from({ length: 24 }, (_, i) => Math.round(90 + i * 2.2 + 18 * Math.sin(((i % 12) - 2) / 12 * 2 * Math.PI) + 8 * wob(i)));
const FN = {
  cur: { n: 'This month', dax: 'CALCULATE ( [Sales], <current month> )', pick: (i) => [i] },
  ytd: { n: 'Year to date', dax: 'TOTALYTD ( [Sales], \'Date\'[Date] )', pick: (i) => { const s = i - (i % 12); return range(s, i); } },
  qtd: { n: 'Quarter to date', dax: 'TOTALQTD ( [Sales], \'Date\'[Date] )', pick: (i) => { const s = i - (i % 3); return range(s, i); } },
  ly: { n: 'Same period last year', dax: 'CALCULATE ( [Sales], SAMEPERIODLASTYEAR ( \'Date\'[Date] ) )', pick: (i) => (i >= 12 ? [i - 12] : []) },
  ytdly: { n: 'YTD last year', dax: 'CALCULATE ( [YTD], SAMEPERIODLASTYEAR ( … ) )', pick: (i) => (i >= 12 ? range(i - 12 - (i % 12), i - 12) : []) },
  roll: { n: 'Rolling 3 months', dax: 'CALCULATE ( [Sales], DATESINPERIOD ( \'Date\'[Date], <last date>, -3, MONTH ) )', pick: (i) => range(Math.max(0, i - 2), i) },
  prev: { n: 'Previous month', dax: 'CALCULATE ( [Sales], PREVIOUSMONTH ( \'Date\'[Date] ) )', pick: (i) => (i >= 1 ? [i - 1] : []) },
};
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, k) => a + k);

export default function (host) {
  let fn = 'ytd';
  const cv = canvas(host, { aspect: 0.82, max: 400, min: 310, label: 'Two years of monthly sales with the months a time function selects' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Function', Object.entries(FN).map(([k, v]) => [k, v.n]), fn, (v) => { fn = v; cv.redraw(); show(); });
  const S = slider(c2, { label: 'Selected month', min: 0, max: 23, step: 1, value: 17, fmt: (v) => `${MN[v % 12]} ${2024 + Math.floor(v / 12)}`, oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  const sel = () => FN[fn].pick(S.value);
  function show() { const k = sel(), t = k.reduce((a, i) => a + DATA[i], 0), i = S.value; out.innerHTML = `<b>${FN[fn].n}</b> at ${MN[i % 12]} ${2024 + Math.floor(i / 12)}: ${k.length ? `${k.length} month${k.length > 1 ? 's' : ''} selected, total <b>${short(t * 1000)}</b>` : '<b>blank</b>: there is no earlier year in this data'}. ` + (fn === 'ly' || fn === 'ytdly' ? 'Compare it with the same measure for this year to get growth.' : fn === 'ytd' ? 'It restarts every January.' : ''); }
  cv.draw = (ctx, w, h, col) => {
    const k = sel(), i = S.value, hi = 140, top = 40, B = h - 50, bw = (w - 20) / 24;
    title(ctx, FN[fn].n + ' on the calendar', col);
    DATA.forEach((v, j) => {
      const x = 10 + j * bw, bh = ((B - top - 6) * v) / hi, on = k.includes(j);
      ctx.globalAlpha = on ? 1 : 0.28; ctx.fillStyle = j === i ? col.s[1] : col.s[0]; ctx.fillRect(x + 1, B - bh, bw - 2, bh); ctx.globalAlpha = 1;
      if (j % 12 === 0 || j === i) text(ctx, MN[j % 12], x + bw / 2, B + 11, { color: j === i ? col.ink : col.muted, size: 9.5, weight: j === i ? 800 : 400, align: 'center', fit: false });
    });
    text(ctx, '2024', 10 + 6 * bw, B + 27, { color: col.muted, size: 10, weight: 700, align: 'center', fit: false }); text(ctx, '2025', 10 + 18 * bw, B + 27, { color: col.muted, size: 10, weight: 700, align: 'center', fit: false });
    ctx.fillStyle = col.line; ctx.fillRect(10 + 12 * bw - 1, top, 1, B - top);
    text(ctx, FN[fn].dax, 10, h - 8, { color: col.muted, size: 9.5, fit: true });
    text(ctx, '(orange bar = selected month)', w - 8, top + 4, { color: col.s[1], size: 9.5, align: 'right', fit: false });
  };
  show(); cv.redraw();
}
