// Class 8 Time and the skies: phases of the Moon. The Sun always lights one half of the Moon. As the Moon goes round the Earth
// (29.5 days from new Moon to new Moon) we see more or less of the lit half. Left: the view from above the North Pole. Right:
// what we see from Earth (northern hemisphere, so the right side lights up first). Lit fraction = (1 - cos(phase angle)) / 2.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

const NAMES = ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'];
const P = 29.53;
export default function (host) {
  let day = 3.7;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 270, label: 'The Moon going round the Earth with the lit half facing the Sun, and the phase seen from Earth' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Moon age', min: 0, max: 29.5, step: 0.1, value: day, fmt: (v) => `${v.toFixed(1)} days`, oninput: (v) => { day = v; say(); } });
  const an = loop(host, (dt) => { day = (day + dt * 1.6) % P; sl.set(day); say(); }, { autoplay: false }); an.button(ctl);
  const out = readout(host);
  const name = () => NAMES[Math.round(day / P * 8) % 8];
  function say() { const ph = 2 * Math.PI * day / P, lit = (1 - Math.cos(ph)) / 2; out.innerHTML = `Day ${day.toFixed(1)}: <b>${name()}</b>, about <b>${Math.round(lit * 100)}%</b> of the face we see is lit. The Moon always has a lit half; we just see it from different angles.`; cv.redraw(); }
  function disc(ctx, x, y, r, col) {
    const ph = 2 * Math.PI * day / P, c = Math.cos(ph), s = day < P / 2 ? 1 : -1;
    dot(ctx, x, y, r, col.ink); ctx.save(); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, s < 0);
    ctx.ellipse(x, y, Math.max(0.01, Math.abs(c)) * r, r, 0, Math.PI / 2, -Math.PI / 2, (s > 0) === (c < 0) ? false : true);
    ctx.fill(); ctx.restore(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, name(), col);
    const cx = w * 0.47, cy = h * 0.55, R = Math.min(w * 0.2, h * 0.33), ph = 2 * Math.PI * day / P;
    dot(ctx, 22, cy, 15, col.warn, col.ink); text(ctx, 'Sun', 22, cy + 28, { color: col.muted, size: 10.5, align: 'center' });
    for (const k of [-0.5, 0, 0.5]) line(ctx, [[42, cy + k * R], [cx - R - 12, cy + k * R]], col.warn, 1.2, [4, 4]);
    ctx.save(); ctx.strokeStyle = col.line; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
    dot(ctx, cx, cy, 11, col.s[2], col.ink); text(ctx, 'Earth', cx, cy + 24, { color: col.muted, size: 10, align: 'center', halo: col.panel });
    const mx = cx - R * Math.cos(ph), my = cy + R * Math.sin(ph);
    dot(ctx, mx, my, 8, col.ink); ctx.save(); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(mx, my, 7, Math.PI / 2, -Math.PI / 2); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(mx, my, 8, 0, 7); ctx.stroke();
    line(ctx, [[cx, cy], [mx, my]], col.muted, 1, [2, 3]);
    const vx = w * 0.86, vy = cy, vr = Math.min(w * 0.095, 32); disc(ctx, vx, vy, vr, col); text(ctx, 'as seen from Earth', vx, vy + vr + 16, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'view from above the North Pole', 10, h - 8, { color: col.muted, size: 10 });
  };
  say();
  return { step(i) { day = Math.min(P - 0.1, (Math.min(Math.max(0, i), 7)) * P / 8); sl.set(day); an.pause(); say(); } };
}
