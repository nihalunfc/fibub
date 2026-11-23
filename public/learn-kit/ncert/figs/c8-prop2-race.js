// Class 8 Proportional Reasoning 2: time = distance / speed. Two vehicles cover the same distance at different speeds;
// the faster one takes less time (inverse proportion). A distance-time picture is animated.
import { canvas, text, title, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let va = 40, vb = 80, D = 120, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 230, label: 'Two vehicles racing over the same distance at different speeds' });
  const ctl = row(host);
  slider(ctl, { label: 'Red speed', min: 20, max: 120, step: 10, value: va, fmt: (v) => v + ' km/h', oninput: (v) => { va = v; t = 0; sync(); } });
  slider(ctl, { label: 'Blue speed', min: 20, max: 120, step: 10, value: vb, fmt: (v) => v + ' km/h', oninput: (v) => { vb = v; t = 0; sync(); } });
  const ctl2 = row(host);
  slider(ctl2, { label: 'Distance', min: 60, max: 240, step: 20, value: D, fmt: (v) => v + ' km', oninput: (v) => { D = v; t = 0; sync(); } });
  const out = readout(host);
  const T = () => Math.max(D / va, D / vb) * 1.08;
  const anim = loop(host, (dt) => { t += dt * T() / 6; if (t > T()) t = 0; cv.redraw(); });
  anim.button(ctl2);
  function sync() { out.innerHTML = `Time = distance ÷ speed. Red: ${D} ÷ ${va} = <b>${+(D / va).toFixed(2)} h</b>. Blue: ${D} ÷ ${vb} = <b>${+(D / vb).toFixed(2)} h</b>. Speed × time = ${D} km for both.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Same road, different speeds', col), L = 18, R = w - 18, len = R - L;
    [[va, col.s[3], 'Red'], [vb, col.s[0], 'Blue']].forEach(([v, c, nm], i) => {
      const y = top + 34 + i * Math.min(70, (h - top - 60) / 2.2), prog = Math.min(1, (v * t) / D), x = L + prog * len;
      ctx.strokeStyle = col.line; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(R, y); ctx.stroke(); ctx.lineCap = 'butt';
      ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(x, y); ctx.stroke();
      ctx.fillStyle = c; ctx.fillRect(x - 12, y - 11, 24, 12); ctx.fillStyle = col.ink; ctx.beginPath(); ctx.arc(x - 6, y + 2, 3.5, 0, 7); ctx.arc(x + 6, y + 2, 3.5, 0, 7); ctx.fill();
      text(ctx, nm + (prog >= 1 ? ' arrived at ' + +(D / v).toFixed(2) + ' h' : ''), L, y - 20, { color: c, size: 11, weight: 700 });
    });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R, top + 10); ctx.lineTo(R, h - 34); ctx.stroke();
    text(ctx, 'finish ' + D + ' km', R - 4, h - 22, { color: col.ink, size: 10.5, align: 'right' });
    text(ctx, 'clock: ' + t.toFixed(2) + ' h', L, h - 22, { color: col.muted, size: 11, weight: 600 });
  };
  sync();
}
