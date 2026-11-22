// Class 9 Rotation: direction and repeated turns. Anticlockwise turns are positive, clockwise turns are negative.
// Angles that differ by a whole number of full turns (360 degrees) leave the arm in the same place.
import { canvas, text, title, row, slider, button, readout, arrow, dot } from '../../kit.js';

export default function (host) {
  let a = -150;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 290, label: 'An arm turned anticlockwise or clockwise, with angles that end in the same place' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Angle', min: -720, max: 720, step: 5, value: a, fmt: (v) => (v < 0 ? '−' : '') + Math.abs(Math.round(v)) + '°', oninput: (v) => { a = v; sync(); } });
  const c2 = row(host);
  [['−90° (¼ clockwise)', -90], ['+270°', 270], ['−150°', -150], ['+400°', 400]].forEach(([l, v]) => button(c2, l, () => { a = v; sl.set(v); sync(); }));
  const out = readout(host);
  const rest = () => ((a % 360) + 360) % 360;
  function sync() {
    const t = Math.trunc(a / 360), f = a - t * 360;
    out.innerHTML = `${a < 0 ? 'Clockwise' : a > 0 ? 'Anticlockwise' : 'No turn'}: <b>${Math.round(a)}°</b> leaves the arm where <b>${rest()}°</b> does` + (Math.abs(a) >= 360 ? ` (after ${Math.abs(t)} full turn${Math.abs(t) > 1 ? 's' : ''} and ${Math.abs(f)}° more)` : '') + `. All angles ${rest()}° + 360° × (any whole number) end here.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Positive = anticlockwise, negative = clockwise', col), cx = w / 2, cy = top + (h - top) / 2 - 2, R = Math.min(w / 2 - 28, (h - top) / 2 - 22);
    const th = (a * Math.PI) / 180, neg = a < 0, c = neg ? col.s[2] : col.s[0];
    ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + R, cy); ctx.stroke(); ctx.setLineDash([]);
    const rounds = Math.ceil(Math.abs(a) / 360) || 0;
    for (let k = 0; k < rounds; k++) {
      const part = Math.min(Math.abs(a) - k * 360, 360) * Math.PI / 180, r = R * (0.3 + 0.1 * k);
      ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, neg ? part : -part, !neg); ctx.stroke();
    }
    arrow(ctx, cx, cy, cx + Math.cos(th) * R, cy - Math.sin(th) * R, c, 4, 10);
    dot(ctx, cx, cy, 5, col.ink);
    [[0, '0°'], [90, '90°'], [180, '180°'], [270, '270°']].forEach(([d, l]) => { const r = (d * Math.PI) / 180; text(ctx, l, cx + Math.cos(r) * (R + 14), cy - Math.sin(r) * (R + 14), { color: col.muted, size: 10, align: 'center' }); });
    text(ctx, neg ? '↻ clockwise' : '↺ anticlockwise', cx, h - 10, { color: c, size: 12, weight: 700, align: 'center' });
  };
  sync();
}
