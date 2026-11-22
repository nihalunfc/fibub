// 3.8 A train crossing a pole or a platform: it must travel its own length (plus the platform). Watch the front
// and back of the train; time = total length ÷ speed.
import { canvas, text, row, slider, readout, loop, choice } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.36, max: 230, min: 170, label: 'A train moving past a pole or along a platform' });
  let L = 200, plat = 300, kmh = 72, mode = 'platform', t = 0;
  const ctl = row(host);
  choice(ctl, 'Crossing', ['pole', 'platform'], mode, (v) => { mode = v; t = 0; show(); });
  slider(ctl, { label: 'Train length (m)', min: 100, max: 400, step: 10, value: L, fmt: (v) => `${v} m`, oninput: (v) => { L = v; t = 0; show(); } });
  slider(ctl, { label: 'Platform (m)', min: 100, max: 500, step: 10, value: plat, fmt: (v) => `${v} m`, oninput: (v) => { plat = v; t = 0; show(); } });
  slider(ctl, { label: 'Speed (km/h)', min: 36, max: 144, step: 18, value: kmh, fmt: (v) => `${v} km/h`, oninput: (v) => { kmh = v; t = 0; show(); } });
  const out = readout(host);
  const total = () => L + (mode === 'platform' ? plat : 0), ms = () => (kmh * 5) / 18;
  const show = () => { out.innerHTML = `${kmh} km/h × 5/18 = ${ms()} m/s. Distance = ${mode === 'platform' ? `${L} + ${plat}` : L} = ${total()} m. Time = ${total()} ÷ ${ms()} = <b>${+(total() / ms()).toFixed(2)} s</b>.`; };
  loop(host, (dt) => { t += Math.min(dt, 0.05); if (t > total() / ms() + 1.5) t = 0; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const span = L + plat + L + 40, sc = (w - 20) / span, base = h * 0.62, x0 = 10 + L * sc;
    ctx.fillStyle = col.line; ctx.fillRect(10, base, w - 20, 3);
    if (mode === 'platform') { ctx.fillStyle = col.s[7] || col.muted; ctx.globalAlpha = 0.35; ctx.fillRect(x0, base + 3, plat * sc, 12); ctx.globalAlpha = 1; text(ctx, `platform ${plat} m`, x0 + (plat * sc) / 2, base + 26, { color: col.ink, size: 11, align: 'center' }); }
    else { ctx.fillStyle = col.ink; ctx.fillRect(x0 - 1, base - 40, 3, 40); text(ctx, 'pole', x0, base + 16, { color: col.ink, size: 11, align: 'center' }); }
    const front = x0 + Math.min(t * ms(), total()) * sc;
    ctx.fillStyle = col.s[0]; ctx.fillRect(front - L * sc, base - 22, L * sc, 20);
    text(ctx, 'train', front - (L * sc) / 2, base - 12, { color: '#fff', size: 11, weight: 700, align: 'center' });
    text(ctx, `${Math.min(t, total() / ms()).toFixed(1)} s`, w - 14, 14, { color: col.ink, size: 12, weight: 600, align: 'right' });
  };
  show();
}
