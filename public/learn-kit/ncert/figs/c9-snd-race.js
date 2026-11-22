// Class 9 Sound: speed of sound in different media. Sound is passed on by the particles bumping into each other:
// closer, stiffer particles pass it on faster, so solids > liquids > gases. Typical speeds: air 343 m/s (20 C),
// sea water 1500 m/s, steel 5000 m/s. The race is shown in slow motion; the clock shows the real time.
import { canvas, text, title, dot, line, row, slider, button, loop, readout } from '../../kit.js';

const LANES = [['Air', 343], ['Water', 1500], ['Steel', 5000]];
export default function (host) {
  let D = 1000, t = 0, running = true;
  const SLOW = 4;
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 290, label: 'A race of sound pulses through air, water and steel over the same distance' });
  const anim = loop(host, (dt) => { if (running) t += dt / SLOW * 1; cv.redraw(); });
  const ctl = row(host);
  button(ctl, '↺ Restart race', () => { t = 0; running = true; anim.play(); });
  slider(ctl, { label: 'Distance', min: 100, max: 2000, step: 100, value: D, fmt: (v) => `${v} m`, oninput: (v) => { D = v; t = 0; upd(); } });
  const out = readout(host);
  function upd() { out.innerHTML = LANES.map(([n, v]) => `${n}: ${D} ÷ ${v} = <b>${(D / v).toFixed(2)} s</b>`).join(' · ') + '. Time = distance ÷ speed.'; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `Sound races over ${D} m`, col);
    const x0 = 58, x1 = w - 20, top = 56, gap = (h - top - 40) / 3;
    const longest = D / LANES[0][1], real = t * 1; // real seconds elapsed in the race (slowed by SLOW)
    LANES.forEach(([n, v], i) => {
      const y = top + gap * i + gap / 2, T = D / v, p = Math.min(1, real / T);
      text(ctx, n, 10, y - 8, { color: col.ink, size: 11, weight: 700 });
      text(ctx, `${v} m/s`, 10, y + 6, { color: col.muted, size: 10 });
      line(ctx, [[x0, y], [x1, y]], col.line, 6);
      line(ctx, [[x1, y - 12], [x1, y + 12]], col.ink, 2);
      const px = x0 + (x1 - x0) * p;
      for (let k = 0; k < 4; k++) dot(ctx, px - k * 6, y, 6 - k, col.s[i === 0 ? 1 : i === 1 ? 0 : 2]);
      const done = p >= 1;
      text(ctx, done ? `${T.toFixed(2)} s` : `${Math.min(real, T).toFixed(2)} s`, x1 - 4, y - 16, { color: done ? col.good : col.muted, size: 10.5, weight: done ? 700 : 400, align: 'right' });
    });
    if (real > longest + 1.5) { t = 0; }
    text(ctx, `Slow motion: the picture runs ${SLOW} times slower than real life. The clock shows real seconds.`, w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
  };
  upd();
}
