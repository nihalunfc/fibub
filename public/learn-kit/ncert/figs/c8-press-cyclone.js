// Class 8 Cyclones: seen from above, a tropical cyclone is a spinning bowl of clouds (anticlockwise in the northern
// hemisphere) with very low pressure at the centre. Winds are strongest in the wall around the eye and nearly calm in
// the eye itself. Toggle the view between the clouds and the wind speed along a line across the storm.
// The wind profile is a simple sketch (Rankine-style vortex), not a measured storm.
import { canvas, text, title, dot, line, row, choice, slider, loop, readout, rng } from '../../kit.js';

export default function (host) {
  let t = 0, view = 'top', eye = 0.14;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'A cyclone seen from above with its calm eye and a graph of wind speed across it' });
  const R = rng(3), band = Array.from({ length: 140 }, () => ({ a: R() * 6.283, r: 0.1 + R() * 0.9, s: 0.5 + R() }));
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ctl = row(host);
  choice(ctl, 'View', [['top', 'From above'], ['graph', 'Wind speed']], view, (v) => { view = v; upd(); });
  slider(ctl, { label: 'Eye width', min: 0.08, max: 0.22, step: 0.01, value: eye, fmt: (z) => `${Math.round(z * 200)} km`, oninput: (z) => { eye = z; upd(); } });
  const out = readout(host);
  const speed = (r) => (r < eye ? 120 * (r / eye) * 0.2 : 120 * Math.pow(eye / r, 0.6));
  function upd() { out.innerHTML = 'Pressure is lowest at the centre, so air spirals inwards. The <b>eye</b> is calm and clear; the <b>eye wall</b> next to it has the strongest wind and the heaviest rain.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, view === 'top' ? 'A cyclone from above' : 'Wind speed across a cyclone', col);
    const cx = w / 2, cy = h * 0.5, S = Math.min(w, h) * 0.38;
    if (view === 'top') {
      for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let a = 0; a < 9.5; a += 0.15) { const r = (eye + (a / 9.5) * 0.9) * S / 0.8 * 0.85; const aa = a + k * 1.571 - t * 0.6; ctx.lineTo(cx + Math.cos(aa) * r, cy + Math.sin(aa) * r); } ctx.strokeStyle = col.line; ctx.lineWidth = 7; ctx.stroke(); }
      band.forEach((b) => { const aa = b.a - t * 0.9 * (1.2 - b.r) * b.s; const r = (eye + 0.03 + b.r * 0.8) * S / 0.8 * 0.85; dot(ctx, cx + Math.cos(aa + b.r * 4) * r, cy + Math.sin(aa + b.r * 4) * r, 2.6, col.muted); });
      ctx.beginPath(); ctx.arc(cx, cy, eye * S / 0.8 * 0.85, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
      text(ctx, 'eye', cx, cy, { color: col.s[0], size: 11, weight: 700, align: 'center' });
      text(ctx, 'low pressure', cx, cy + 14, { color: col.muted, size: 9.5, align: 'center' });
      text(ctx, 'air spirals in', w - 12, h - 14, { color: col.muted, size: 10.5, align: 'right' });
    } else {
      const gx = 36, gw = w - 56, gy = h - 50, gh = h - 130;
      line(ctx, [[gx, gy], [gx + gw, gy]], col.ink, 1.5); line(ctx, [[gx, gy], [gx, gy - gh]], col.ink, 1.5);
      const pts = []; for (let i = 0; i <= 80; i++) { const r = Math.abs(i / 40 - 1) * 0.9 + 0.001; pts.push([gx + gw * i / 80, gy - gh * speed(r) / 130]); }
      line(ctx, pts, col.s[1], 3);
      text(ctx, 'wind km/h', gx + 4, gy - gh - 8, { color: col.muted, size: 10.5 });
      text(ctx, 'distance from the centre →', gx + gw / 2, gy + 20, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, 'calm', gx + gw / 2, gy - gh * 0.55, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
      text(ctx, 'eye wall: fastest wind', gx + gw - 2, gy - gh * 0.9, { color: col.s[1], size: 10.5, weight: 700, align: 'right' });
    }
  };
  upd();
}
