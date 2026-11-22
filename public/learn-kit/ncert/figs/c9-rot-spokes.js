// Class 9 Rotation: n equal spokes share the full turn, so the angle between neighbouring spokes is 360 / n.
// Try 24 for the Ashoka Chakra (15 degrees between spokes) or 36 for a bicycle wheel (10 degrees).
import { canvas, text, title, row, slider, button, readout, loop, dot } from '../../kit.js';

export default function (host) {
  let n = 24, spin = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 290, label: 'A wheel with n equal spokes and the angle between two neighbouring spokes' });
  const ctl = row(host);
  const sl = slider(ctl, { label: 'Spokes n', min: 3, max: 48, step: 1, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); sync(); } });
  const c2 = row(host);
  [['Tricycle 8', 8], ['Clock 12', 12], ['Ashoka Chakra 24', 24], ['Bicycle 36', 36]].forEach(([l, v]) => button(c2, l, () => { n = v; sl.set(v); sync(); }));
  const anim = loop(host, (dt) => { spin += 0.5 * dt; cv.redraw(); });
  anim.button(c2);
  const out = readout(host);
  function sync() { const g = 360 / n; out.innerHTML = `${n} spokes share 360°, so the angle between two neighbours is 360 ÷ ${n} = <b>${+g.toFixed(2)}°</b>. Turn the wheel by one spoke gap and it looks exactly the same.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'n spokes: angle between spokes = 360° ÷ n', col), cx = w / 2, cy = top + (h - top) / 2, R = Math.min(w / 2 - 20, (h - top) / 2 - 14), g = (2 * Math.PI) / n;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    for (let i = 0; i < n; i++) {
      const t = spin * 0.4 + i * g;
      ctx.strokeStyle = i === 0 ? col.s[2] : col.s[0]; ctx.lineWidth = i === 0 ? 3 : 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(t) * R, cy - Math.sin(t) * R); ctx.stroke();
    }
    const t0 = spin * 0.4;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 0.55, -t0, -(t0 + g), true); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    dot(ctx, cx, cy, 6, col.ink);
    text(ctx, (+((360 / n)).toFixed(1)) + '°', cx + Math.cos(t0 + g / 2) * R * 0.7, cy - Math.sin(t0 + g / 2) * R * 0.7, { color: col.ink, size: 11, weight: 700, align: 'center', halo: col.panel });
  };
  sync();
}
