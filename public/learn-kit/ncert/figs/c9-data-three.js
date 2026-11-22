// Class 9 Data: mean, median and mode on one picture. A dot plot of shoe sizes sold in a shop. The mode is the tallest stack, the median
// the middle of the lined-up values, the mean the balance point. Choose a data set to see when they agree and when they do not.
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const SETS = {
  sym: ['Even spread', [5, 6, 6, 7, 7, 7, 8, 8, 9]],
  skew: ['Long tail', [5, 5, 5, 6, 6, 6, 7, 7, 8, 9, 10, 11]],
  two: ['Two peaks', [5, 5, 5, 6, 8, 9, 9, 9, 10]],
  none: ['No repeats', [5, 6, 7, 8, 9, 10]],
};
export default function (host) {
  let k = 'sym';
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 280, label: 'A dot plot with the mean, median and mode marked' });
  const c = row(host); choice(c, 'Data', Object.entries(SETS).map(([v, o]) => [v, o[0]]), k, (v) => { k = v; upd(); });
  const out = readout(host);
  const st = () => { const d = SETS[k][1], s = [...d].sort((a, b) => a - b), n = d.length, cnt = {}; d.forEach((v) => (cnt[v] = (cnt[v] || 0) + 1)); const m = Math.max(...Object.values(cnt)), modes = m === 1 ? [] : Object.keys(cnt).filter((v) => cnt[v] === m).map(Number); return { d, s, n, cnt, modes, med: n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2, mean: d.reduce((a, b) => a + b, 0) / n }; };
  cv.draw = (ctx, w, h, col) => {
    const { cnt, modes, med, mean } = st(), t = title(ctx, 'Shoe sizes: ' + SETS[k][0], col), L = 24, R = w - 24, X = (v) => L + ((v - 4) / 8) * (R - L), B = h - 62, r = Math.min(10, (R - L) / 8 * 0.4);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L - 8, B); ctx.lineTo(R + 8, B); ctx.stroke(); ctx.restore();
    for (let v = 4; v <= 12; v++) text(ctx, String(v), X(v), B + 12, { color: col.muted, size: 10.5, align: 'center' });
    Object.entries(cnt).forEach(([v, c]) => { for (let i = 0; i < c; i++) { ctx.save(); ctx.fillStyle = modes.includes(+v) ? col.s[2] : col.s[0]; ctx.globalAlpha = 0.8; ctx.beginPath(); ctx.arc(X(+v), B - r - 2 - i * 2 * r, r, 0, 7); ctx.fill(); ctx.restore(); } });
    const mark = (v, c, lab, y) => { ctx.save(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(X(v), t + 14); ctx.lineTo(X(v), B + 24); ctx.stroke(); ctx.restore(); text(ctx, lab, X(v), y, { color: c, size: 11, weight: 700, align: 'center', halo: col.panel }); };
    mark(mean, col.s[6], 'mean ' + (+mean.toFixed(2)), h - 30); mark(med, col.s[3], 'median ' + med, h - 16);
    text(ctx, modes.length ? 'mode: ' + modes.join(' and ') + ' (green)' : 'no mode: every value appears once', w / 2, t + 8, { color: col.s[2], size: 11.5, weight: 700, align: 'center' });
  };
  function upd() { const { modes, med, mean } = st(); out.innerHTML = `Mean <b>${+mean.toFixed(2)}</b>, median <b>${med}</b>, mode <b>${modes.length ? modes.join(' and ') : 'none'}</b>. ` + ({ sym: 'The data are spread evenly, so the three are close together.', skew: 'A few large sizes make a long tail to the right and pull the mean above the median.', two: 'Two equally common sizes: there are two modes, and the mean falls in the gap where nobody actually is.', none: 'No value repeats, so there is no mode. Mean and median still exist.' })[k]; cv.redraw(); }
  upd();
}
