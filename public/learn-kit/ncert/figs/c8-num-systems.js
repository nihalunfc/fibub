// Class 8 A Story of Numbers: the same number written four ways: tally marks, Roman numerals, Egyptian signs (a stroke for 1,
// an arch for 10, a coil for 100) and our Hindu-Arabic digits. Slide up and see which system needs the most space.
import { canvas, text, title, row, slider, readout } from '../../kit.js';

const roman = (n) => [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, '');
export default function (host) {
  let n = 47;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'One number shown in tally marks, Roman numerals, Egyptian signs and digits' });
  const out = readout(host); const ctl = row(host);
  slider(ctl, { label: 'Number', min: 1, max: 399, step: 1, value: n, fmt: (v) => Math.round(v), oninput: (v) => { n = Math.round(v); sync(); } });
  function sync() { const e = Math.floor(n / 100) + Math.floor((n % 100) / 10) + (n % 10); out.innerHTML = `<b>${n}</b>: tally needs ${n} marks, Egyptian signs ${e}, Roman letters ${roman(n).length}, Hindu-Arabic only <b>${String(n).length}</b> digit${String(n).length > 1 ? 's' : ''}, because the <i>place</i> of a digit tells its value.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'One number, four ways', col), rh = (h - top - 10) / 4;
    const lab = (t, i) => text(ctx, t, 10, top + 10 + i * rh, { color: col.muted, size: 10.5, weight: 700 });
    // tally
    lab('Tally marks', 0);
    const gx = Math.max(5, Math.min(7, (w - 24) / 20 / 1.0)), marks = Math.min(n, 50); let x = 12, y = top + 22; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    for (let i = 0; i < marks; i++) {
      const pos = i % 5; if (pos === 0 && i > 0) x += 6; const px = x + (pos === 4 ? -3.5 * gx + 0 : 0);
      if (pos < 4) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + rh * 0.45); ctx.stroke(); x += gx; } else { ctx.beginPath(); ctx.moveTo(x - 4 * gx - 2, y + rh * 0.38); ctx.lineTo(x - 1, y + 2); ctx.stroke(); }
      void px; if (x > w - 14) break;
    }
    if (n > 50) text(ctx, `… and ${n - 50} more marks`, w - 10, top + 10, { color: col.s[3], size: 10.5, align: 'right' });
    // roman
    lab('Roman', 1); text(ctx, roman(n), 12, top + rh + 34, { color: col.ink, size: 22, weight: 700 });
    // egyptian
    lab('Egyptian', 2); let ex = 14; const ey = top + 2 * rh + 34;
    const sign = (type) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; if (type === 1) { ctx.beginPath(); ctx.moveTo(ex, ey - 11); ctx.lineTo(ex, ey + 11); ctx.stroke(); ex += 7; } else if (type === 10) { ctx.beginPath(); ctx.arc(ex + 6, ey + 2, 8, Math.PI, 0); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ex - 2, ey + 2); ctx.lineTo(ex - 2, ey + 11); ctx.moveTo(ex + 14, ey + 2); ctx.lineTo(ex + 14, ey + 11); ctx.stroke(); ex += 20; } else { ctx.beginPath(); ctx.arc(ex + 8, ey, 4, 0, 7); ctx.moveTo(ex + 8 + 9, ey); ctx.arc(ex + 8, ey, 9, 0, Math.PI * 1.6); ctx.stroke(); ex += 24; } };
    for (let i = 0; i < Math.floor(n / 100); i++) { if (ex > w - 40) break; sign(100); }
    for (let i = 0; i < Math.floor((n % 100) / 10); i++) { if (ex > w - 40) break; sign(10); }
    for (let i = 0; i < n % 10; i++) { if (ex > w - 20) break; sign(1); }
    // digits
    lab('Hindu-Arabic (place value)', 3); text(ctx, String(n), 12, top + 3 * rh + 34, { color: col.s[2], size: 26, weight: 700 });
  };
  sync();
}
