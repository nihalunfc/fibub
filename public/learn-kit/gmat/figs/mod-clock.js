// 2.3 Remainders as a clock: counting n steps around a clock with d positions lands on n mod d.
import { canvas, text, dot, line, row, slider, readout, title, loop } from '../../kit.js';
export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 320, min: 240, label: 'A remainder clock' });
  let d = 7, n = 23, shown = 0;
  const ctl = row(host);
  slider(ctl, { label: 'Divide by', min: 2, max: 12, step: 1, value: d, fmt: (v) => String(Math.round(v)), oninput: (v) => { d = Math.round(v); shown = 0; say(); } });
  slider(ctl, { label: 'Number', min: 1, max: 60, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); shown = 0; say(); } });
  const out = readout(host);
  const say = () => { out.innerHTML = `${n} = ${d} × ${Math.floor(n / d)} + <b>${n % d}</b>. Going ${n} steps round a clock with ${d} positions makes ${Math.floor(n / d)} full turns and stops at <b>${n % d}</b>: that is the remainder.`; };
  loop(host, (dt) => { if (shown < n) { shown = Math.min(n, shown + dt * 8); cv.redraw(); } });
  cv.draw = (ctx, w, h, col) => {
    const cx = w / 2, cy = h / 2 + 8, R = Math.min(w, h) * 0.36;
    for (let k = 0; k < d; k++) {
      const a = -Math.PI / 2 + (k / d) * 2 * Math.PI, x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
      dot(ctx, x, y, 14, k === Math.floor(shown) % d ? col.s[0] : col.soft, col.line);
      text(ctx, String(k), x, y, { color: k === Math.floor(shown) % d ? col.panel : col.ink, size: 12, weight: 700, align: 'center' });
    }
    text(ctx, `count: ${Math.floor(shown)}`, cx, cy - 8, { color: col.ink, size: 14, weight: 700, align: 'center' });
    text(ctx, `full turns: ${Math.floor(Math.floor(shown) / d)}`, cx, cy + 14, { color: col.muted, size: 12, align: 'center' });
    title(ctx, 'The remainder is where you stop', col);
  };
  cv.redraw(); say();
}
