// Class 9 Numbers: zooming in on a real number. Each zoom level magnifies the interval around the number by 10, revealing the next
// decimal digit. A terminating decimal stops giving new digits; a recurring one shows a pattern; an irrational one never repeats.
import { canvas, text, title, row, choice, slider, readout, dot, line } from '../../kit.js';

const NUMS = { '√2': [Math.SQRT2, '1.41421356237309504880'], 'π': [Math.PI, '3.14159265358979323846'], '1/3': [1 / 3, '0.3333333333333333333333'], '0.6': [0.6, '0.6000000000000000000000'], '1/7': [1 / 7, '0.142857142857142857142857'] };
export default function (host) {
  let k = '√2', lev = 0;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 230, label: 'A number line magnified around a chosen number, showing one more decimal digit at each zoom level' });
  const c1 = row(host); choice(c1, 'Number', Object.keys(NUMS).map((v) => [v, v]), k, (v) => { k = v; upd(); });
  const ctl = row(host);
  slider(ctl, { label: 'Zoom level', min: 0, max: 6, step: 1, value: lev, oninput: (v) => { lev = v; upd(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const [v, s] = NUMS[k], t = title(ctx, k + ' under the magnifier', col), step = Math.pow(10, -lev), lo = Math.floor(v / step + 1e-12) * step;
    const y = t + 70, x0 = 24, x1 = w - 24, X = (z) => x0 + ((z - lo) / (step * 1)) * (x1 - x0) / 1, dec = Math.max(0, lev);
    // the interval [lo, lo+step] is shown with 10 sub-ticks
    ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore();
    for (let i = 0; i <= 10; i++) { const xx = x0 + (i / 10) * (x1 - x0); line(ctx, [[xx, y - (i % 5 ? 5 : 9)], [xx, y + (i % 5 ? 5 : 9)]], col.ink, i % 5 ? 1 : 2); if (i % 2 === 0) text(ctx, (lo + (i * step) / 10).toFixed(dec + 1), xx, y + 24, { color: col.muted, size: 10, align: 'center' }); }
    const px = x0 + ((v - lo) / step) * (x1 - x0); dot(ctx, Math.max(x0, Math.min(x1, px)), y, 7, col.s[3], col.ink);
    text(ctx, 'Shown: the interval from ' + lo.toFixed(dec) + ' to ' + (lo + step).toFixed(dec) + ' (width ' + ['1', '0.1', '0.01', '0.001', '0.0001', '0.00001', '0.000001'][lev] + ')', w / 2, y - 26, { color: col.muted, size: 11, align: 'center' });
    text(ctx, 'digits so far: ' + s.slice(0, lev + 2), w / 2, y + 56, { color: col.s[3], size: 18, weight: 700, align: 'center' });
    text(ctx, lev === 6 ? 'still no end in sight' : 'zoom in to see the next digit', w / 2, y + 78, { color: col.muted, size: 11.5, align: 'center' });
  };
  function upd() { out.innerHTML = `The point ${k} stays inside the interval at every zoom. ` + (k === '0.6' ? 'The digits stop (all zeros after 6): a terminating decimal.' : k === '1/3' ? 'The digit 3 repeats forever: a recurring decimal.' : k === '1/7' ? 'The block 142857 repeats forever: a recurring decimal.' : 'The digits never end and never fall into a repeating block: an irrational number.'); cv.redraw(); }
  upd();
}
