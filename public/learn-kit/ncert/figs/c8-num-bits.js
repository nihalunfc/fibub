// Class 8 A Story of Numbers: binary is a base-2 place value system with only two digits, 0 and 1: a switch that is off or on.
// Tap a switch to flip a bit; the lit values add up to the number. Computers store everything this way.
import { canvas, text, title, row, button, readout, touchGuard } from '../../kit.js';

const V = [128, 64, 32, 16, 8, 4, 2, 1];
export default function (host) {
  const bits = [0, 0, 1, 0, 1, 1, 0, 1];
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 240, label: 'Eight switches whose place values 128 to 1 add up to a number' });
  const out = readout(host); const ctl = row(host);
  button(ctl, 'Clear', () => { bits.fill(0); sync(); }); button(ctl, '+1', () => { const v = (val() + 1) % 256; V.forEach((p, i) => (bits[i] = Math.floor(v / p) % 2)); sync(); });
  const val = () => bits.reduce((s, b, i) => s + b * V[i], 0);
  let G = null;
  function sync() { const on = V.filter((_, i) => bits[i]); out.innerHTML = `<b>${bits.join('')}</b> in binary = ${on.length ? on.join(' + ') : '0'} = <b>${val()}</b>. Tap a switch to flip it.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Binary switches', col), cw = (w - 16) / 8; G = { cw, top };
    bits.forEach((b, i) => {
      const cx = 8 + cw * (i + 0.5), y = top + 40;
      text(ctx, String(V[i]), cx, top + 14, { color: col.muted, size: 11, weight: 700, align: 'center' });
      ctx.fillStyle = b ? col.s[2] : col.soft; ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(cx - cw * 0.34, y, cw * 0.68, 52, 8); ctx.fill(); ctx.stroke();
      ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(cx, b ? y + 16 : y + 36, cw * 0.24, 0, 7); ctx.fill();
      text(ctx, String(b), cx, y + 72, { color: col.ink, size: 16, weight: 700, align: 'center' });
    });
    text(ctx, String(val()), w / 2, h - 28, { color: col.s[2], size: 28, weight: 700, align: 'center' });
  };
  cv.c.style.cursor = 'pointer';
  const hit = (x, y) => G && y > G.top + 20 && y < G.top + 100 && x > 8 && x < 8 + G.cw * 8;
  touchGuard(cv.c, hit);
  cv.c.addEventListener('pointerdown', (e) => { const r = cv.c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; if (hit(x, y)) { const i = Math.floor((x - 8) / G.cw); bits[i] ^= 1; sync(); e.preventDefault(); } });
  sync();
}
