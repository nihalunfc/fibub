// Class 8 Power Play: fold a sheet of paper in half again and again. The number of layers doubles each fold (2^n) and so
// does the thickness. With paper 0.1 mm thick, 42 folds would be taller than the distance to the Moon.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const MARK = [[1e-3, '1 mm'], [1e-2, 'finger'], [1.7, 'a person'], [8.3e2, 'Burj Khalifa'], [8.85e3, 'Mt Everest'], [3.84e8, 'the Moon']];
export default function (host) {
  let n = 7;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Paper layers and stack height after n folds on a log scale' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Folds', min: 0, max: 45, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); sync(); } });
  const H = () => 1e-4 * 2 ** n, f = (m) => (m < 0.01 ? (m * 1000).toFixed(1) + ' mm' : m < 1000 ? m.toFixed(m < 10 ? 2 : 0) + ' m' : (m / 1000).toLocaleString('en-IN', { maximumFractionDigits: 0 }) + ' km');
  function sync() { out.innerHTML = `After <b>${n}</b> fold${n === 1 ? '' : 's'}: <b>2<sup>${n}</sup> = ${(2 ** n).toLocaleString('en-IN')}</b> layers, about <b>${f(H())}</b> tall (paper 0.1 mm thick).`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Folding paper: 2 × 2 × 2 …', col);
    // stack picture
    const layers = Math.min(2 ** n, 64), sh = 90, sy = top + 12, lh = Math.max(1, sh / layers);
    for (let i = 0; i < layers; i++) { ctx.fillStyle = col.s[i % 2 ? 0 : 1]; ctx.fillRect(14, sy + sh - (i + 1) * lh, 70, Math.max(lh - 0.4, 0.8)); }
    text(ctx, n > 6 ? '64 shown' : `${layers} layers`, 14, sy + sh + 12, { color: col.muted, size: 10.5 });
    // log scale
    const x0 = 120, x1 = w - 14, lo = -4.5, hi = 8.8, X = (m) => x0 + ((Math.log10(m) - lo) / (hi - lo)) * (x1 - x0), yb = sy + 50;
    ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(x1, yb); ctx.stroke();
    MARK.forEach(([m, t], i) => { const x = X(m); ctx.fillStyle = col.muted; ctx.fillRect(x - 1, yb - 5, 2, 10); text(ctx, t, x, yb + (i % 2 ? 22 : 38), { color: col.muted, size: 10, align: i === 0 ? 'left' : 'center' }); });
    const hx = Math.min(x1, X(H())); ctx.fillStyle = col.s[3]; ctx.fillRect(x0, yb - 4, hx - x0, 8);
    text(ctx, f(H()), Math.min(x1 - 20, Math.max(x0 + 30, hx)), yb - 18, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    // layer count bars
    const bx = 14, by = sy + sh + 48, bw = w - 28; text(ctx, 'layers', bx, by - 8, { color: col.muted, size: 10.5 });
    ctx.fillStyle = col.line; ctx.fillRect(bx, by, bw, 10); ctx.fillStyle = col.s[0]; ctx.fillRect(bx, by, bw * (n / 45), 10);
    text(ctx, 'each fold doubles the height: the scale above is multiplied, not added', w / 2, by + 34, { color: col.ink, size: 11, align: 'center' });
  };
  sync();
}
