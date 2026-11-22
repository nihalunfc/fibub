// Experimental physics: reading a screw gauge (pitch 0.5 mm, 50 circular divisions, least count 0.01 mm).
// Set the true length of the object and a zero error; read the main scale at the thimble's edge, add the circular
// scale division on the reference line times the least count, then subtract the zero error.
import { canvas, row, slider, choice, readout, line, text } from '../../kit.js';

const P = 0.5, N = 50, LC = P / N;
export default function (host) {
  let L = 4.37, ze = 0; // true length mm, zero error in divisions
  const cv = canvas(host, { aspect: 0.5, max: 300, min: 220, label: 'A screw gauge with its main scale and circular scale' });
  const ctl = row(host);
  slider(ctl, { label: 'True length', min: 0.5, max: 9.5, step: 0.01, value: L, fmt: (v) => `${v.toFixed(2)} mm`, oninput: (v) => { L = v; upd(); } });
  choice(ctl, 'Zero error', [[0, 'None'], [3, '+3 div'], [-4, '−4 div']], ze, (v) => { ze = v; upd(); });
  const out = readout(host);
  const shown = () => +(L + ze * LC).toFixed(4); // what the gauge displays
  const upd = () => {
    cv.redraw();
    const s = shown(), msr = Math.floor(s / P + 1e-9) * P, csr = Math.round((s - msr) / LC);
    out.innerHTML = `Main scale: <b>${msr.toFixed(1)} mm</b> (last mark visible) · circular scale: <b>${csr}</b> × ${LC} = ${(csr * LC).toFixed(2)} mm · observed ${(msr + csr * LC).toFixed(2)} mm` +
      (ze ? ` · zero error ${ze > 0 ? '+' : '−'}${Math.abs(ze * LC).toFixed(2)} mm, so true reading = observed − (${(ze * LC).toFixed(2).replace('-', '−')}) = <b>${(msr + csr * LC - ze * LC).toFixed(2)} mm</b>.` : ` = <b>${(msr + csr * LC).toFixed(2)} mm</b>.`);
  };
  cv.draw = (ctx, w, h, col) => {
    const s = shown(), y0 = h * 0.5, x0 = 24, sc = (w - 150) / 10, xT = x0 + s * sc;
    // sleeve with datum line and scales
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 10, y0 - 22, xT - x0 + 10, 44);
    line(ctx, [[x0, y0], [xT, y0]], col.ink, 1.5);
    for (let m = 0; m <= 10; m += 0.5) {
      const x = x0 + m * sc; if (x > xT + 0.5) break;
      const whole = Math.abs(m - Math.round(m)) < 1e-9;
      line(ctx, whole ? [[x, y0], [x, y0 - 12]] : [[x, y0], [x, y0 + 9]], col.ink, 1.3);
      if (whole) text(ctx, String(m), x, y0 - 18, { color: col.ink, size: 10, align: 'center' });
    }
    text(ctx, 'mm', x0 - 6, y0 - 34, { color: col.muted, size: 10 });
    // thimble with moving circular scale
    const tw = 90, sp = 9;
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
    ctx.fillRect(xT, y0 - 60, tw, 120); ctx.strokeRect(xT, y0 - 60, tw, 120);
    const rot = ((s % P) / P) * N; // divisions turned past zero
    for (let k = Math.floor(rot) - 6; k <= Math.floor(rot) + 7; k++) {
      const y = y0 + (k - rot) * sp * -1, d = ((k % N) + N) % N;
      if (y < y0 - 56 || y > y0 + 56) continue;
      const big = d % 5 === 0;
      line(ctx, [[xT, y], [xT + (big ? 16 : 9), y]], Math.abs(k - Math.round(rot)) < 0.01 && Math.abs(y - y0) < sp / 2 ? col.s[3] : col.ink, big ? 1.6 : 1.1);
      if (big) text(ctx, String(d), xT + 22, y, { color: col.ink, size: 10 });
    }
    line(ctx, [[xT - 4, y0], [xT + tw * 0.25, y0]], col.s[3], 1.2, [3, 3]);
    text(ctx, 'thimble', xT + tw / 2, y0 + 72, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'sleeve (main scale)', x0, y0 + 36, { color: col.muted, size: 10 });
  };
  upd();
}
