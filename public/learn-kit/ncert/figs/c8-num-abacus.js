// Class 8 A Story of Numbers: place value on an abacus. Add beads to a column; ten beads in one column are swapped for one
// bead in the next column to the left (carry). The digit in each column times the column's value gives the number.
import { canvas, text, title, row, button, readout } from '../../kit.js';

const NAMES = ['Thousands', 'Hundreds', 'Tens', 'Ones'];
export default function (host) {
  const d = [0, 2, 0, 7];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 270, label: 'An abacus with columns for thousands, hundreds, tens and ones' });
  const out = readout(host); const ctl = row(host);
  const add = (i, v) => { d[i] += v; if (d[i] > 9 && i > 0) { d[i] -= 10; add(i - 1, 1); } else if (d[i] > 9) d[i] = 9; if (d[i] < 0 && i > 0 && v < 0) { d[i] += 10; add(i - 1, -1); } if (d[i] < 0) d[i] = 0; };
  ['+1', '+10', '+100', '+1000'].forEach((t, k) => button(ctl, t, () => { add(3 - k, 1); sync(); }));
  button(ctl, '−1', () => { if (val() > 0) add(3, -1); sync(); }); button(ctl, 'Clear', () => { d.fill(0); sync(); });
  const val = () => d[0] * 1000 + d[1] * 100 + d[2] * 10 + d[3];
  function sync() { out.innerHTML = `<b>${val()}</b> = ${d.map((x, i) => `${x} × ${[1000, 100, 10, 1][i]}`).join(' + ')}. Ten beads in a column are swapped for one bead in the column to the left.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Place value abacus', col), cw = (w - 20) / 4, rod0 = top + 28, rod1 = h - 54, br = Math.min(8.5, (rod1 - rod0) / 22);
    NAMES.forEach((nm, i) => {
      const cx = 10 + cw * (i + 0.5);
      text(ctx, nm, cx, top + 12, { color: col.muted, size: 10.5, align: 'center' });
      ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, rod0); ctx.lineTo(cx, rod1); ctx.stroke();
      for (let b = 0; b < d[i]; b++) { ctx.fillStyle = col.s[i]; ctx.beginPath(); ctx.arc(cx, rod1 - br - b * (br * 2 + 1.5), br, 0, 7); ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 1; ctx.stroke(); }
      text(ctx, String(d[i]), cx, h - 34, { color: col.ink, size: 20, weight: 700, align: 'center' });
      text(ctx, '× ' + [1000, 100, 10, 1][i], cx, h - 14, { color: col.muted, size: 11, align: 'center' });
    });
  };
  sync();
}
