// Class 10 Colourful World: where and when you can see a rainbow. The bow is a circle of light centred on the
// anti-solar point (the point opposite the Sun, where your shadow's head falls). Red is at about 42 degrees from that point,
// violet at about 40 degrees. The higher the Sun, the lower the anti-solar point sinks below the horizon, and the less
// of the circle is above the ground: the top of the bow is at (42 degrees - Sun's height). Above 42 degrees there is no
// rainbow. A fainter secondary bow (light reflected twice inside the drops) lies outside at 51-54 degrees, colours reversed.
import { canvas, text, title, line, dot, row, slider, choice, readout, loop } from '../../kit.js';

const BANDS = ['#e5241d', '#ff8c00', '#e9c70a', '#2bb24c', '#2a6df4', '#4b3fd6', '#8a2be2'];
export default function (host) {
  let sun = 20, second = false, t = 0;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'A rainbow arc above the horizon whose height depends on the height of the Sun' });
  const ctl = row(host);
  slider(ctl, { label: 'Height of the Sun above the horizon', min: 0, max: 60, step: 1, value: sun, fmt: (v) => `${v}°`, oninput: (v) => { sun = v; update(); } });
  choice(ctl, 'Bows', [['one', 'Primary'], ['two', 'Primary + secondary']], 'one', (v) => { second = v === 'two'; update(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function update() { out.innerHTML = sun >= 42 ? `Sun at ${sun}°: the top of the bow would be at 42° − ${sun}° = below the horizon. <b>No rainbow is visible</b>; you need the Sun lower than 42°.` : `Sun at ${sun}°: the top of the primary bow is at 42° − ${sun}° = <b>${42 - sun}°</b> above the horizon. ${sun < 8 ? 'A nearly complete half circle: early morning or evening is the best time.' : 'Only a lower slice of the circle shows.'}`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Rainbow: a circle centred opposite the Sun', col);
    const hor = Math.round(h * 0.78), sc = Math.min((hor - 44) / 44, (w * 0.5 - 12) / 44), cx = w / 2, cyA = hor + sun * sc;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 40, w, hor - 40); ctx.clip();
    const bow = (r0, cols, wid) => cols.forEach((c, i) => { ctx.strokeStyle = c; ctx.lineWidth = wid + 0.6; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(cx, cyA, r0 * sc - i * wid * 0.99 + 0, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.globalAlpha = 1; });
    bow(42.5, BANDS, 0.6 * sc);
    if (second) bow(53.5, [...BANDS].reverse(), 0.6 * sc);
    ctx.restore();
    // rain streaks
    ctx.save(); ctx.strokeStyle = col.muted; ctx.globalAlpha = 0.35; ctx.lineWidth = 1; for (let k = 0; k < 26; k++) { const x = (k * 53.7) % w, y = 44 + ((k * 31.3 + t * 90) % (hor - 50)); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 9); ctx.stroke(); } ctx.restore();
    // ground, observer and the sun's direction
    ctx.fillStyle = col.soft; ctx.fillRect(0, hor, w, h - hor); line(ctx, [[0, hor], [w, hor]], col.ink, 2);
    text(ctx, 'horizon', 8, hor + 12, { color: col.muted, size: 10.5 });
    dot(ctx, cx, hor + 22, 7, col.ink); text(ctx, 'you', cx + 10, hor + 22, { color: col.ink, size: 11, weight: 700 });
    text(ctx, `the Sun is behind you, ${sun}° high`, w - 8, h - 8, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    if (sun < 42) text(ctx, `top of the bow: ${42 - sun}°`, cx, hor - (42 - sun) * sc - 8 > 52 ? hor - (42 - sun) * sc - 8 : 52, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
    else text(ctx, 'no rainbow: Sun too high', cx, hor - 40, { color: col.s[1], size: 12, weight: 700, align: 'center' });
  };
  update();
}
