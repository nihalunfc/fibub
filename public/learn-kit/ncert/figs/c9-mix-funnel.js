// Class 9 Mixtures: separating funnel. Two liquids that do not mix (immiscible), such as oil and water, are shaken and
// then left to stand: the denser liquid (water, 1.0 g/cm3) sinks and the lighter one (oil, about 0.9 g/cm3) floats on it
// in two layers. The tap is opened to run off the lower layer and closed just as the boundary reaches it.
import { canvas, text, title, dot, line, row, button, slider, readout, loop, rng } from '../../kit.js';

export default function (host) {
  let mix = 1, shake = 0, tap = 0, drained = 0, R = rng(12), P = [];
  for (let i = 0; i < 60; i++) P.push({ x: R(), y: R(), oil: i % 2 === 0 });
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'A separating funnel with oil floating over water and the tap opened to run off the water' });
  const ctl = row(host);
  button(ctl, 'Shake', () => { shake = 1.2; mix = 1; drained = 0; tap = 0; });
  button(ctl, 'Let it stand', () => { shake = 0; });
  slider(ctl, { label: 'Tap (closed to open)', min: 0, max: 1, step: 0.1, value: 0, fmt: (v) => (v === 0 ? 'closed' : v < 0.5 ? 'slow' : 'open'), oninput: (v) => { tap = v; } });
  const out = readout(host);
  loop(host, (dt) => {
    if (shake > 0) { shake -= dt; } else mix = Math.max(0, mix - dt * 0.3);
    if (tap > 0 && mix < 0.1 && drained < 0.5) drained = Math.min(0.5, drained + dt * 0.12 * tap);
    out.innerHTML = shake > 0 ? 'Shaking breaks each liquid into droplets: they look mixed (an emulsion).' : mix > 0.1 ? 'Standing: the denser water sinks and the lighter oil rises…' : drained >= 0.5 ? 'All the water has been run off. Close the tap before the oil comes out. The oil is left in the funnel.' : tap > 0 ? 'Running off the lower layer (water). Watch the boundary and stop in time.' : 'Two clear layers: oil on top (less dense), water below. Open the tap to separate them.';
    cv.redraw();
  });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Separating funnel', col);
    const cx = w * 0.42, top = 52, fh = h - 100, fw = Math.min(w * 0.5, 150);
    ctx.beginPath(); ctx.moveTo(cx - fw / 2, top); ctx.lineTo(cx + fw / 2, top); ctx.lineTo(cx + 8, top + fh); ctx.lineTo(cx - 8, top + fh); ctx.closePath();
    ctx.save(); ctx.clip();
    const wh = fh * (1 - drained * 1.0) * 0.5 / 0.5 * 0.5; // water thickness
    const oilH = fh * 0.4, waterH = fh * 0.55 * (1 - drained / 0.5);
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.5; ctx.fillRect(0, top + fh - waterH - oilH, w, oilH); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(0, top + fh - waterH, w, waterH + 4); ctx.globalAlpha = 1;
    if (mix > 0.1 || shake > 0) { ctx.fillStyle = col.panel; ctx.globalAlpha = 0.6 * Math.min(1, mix + (shake > 0 ? 1 : 0)); ctx.fillRect(0, top, w, fh); ctx.globalAlpha = 1; P.forEach((p, i) => dot(ctx, cx - fw / 2 + 10 + p.x * (fw - 20) * (1 - p.y * 0.8) , top + 10 + p.y * (fh - 20), 3.2, p.oil ? col.s[2] : col.s[0])); }
    ctx.restore(); void wh;
    ctx.beginPath(); ctx.moveTo(cx - fw / 2, top); ctx.lineTo(cx + fw / 2, top); ctx.lineTo(cx + 8, top + fh); ctx.lineTo(cx - 8, top + fh); ctx.closePath(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    // tap
    const ty = top + fh - 22; ctx.fillStyle = col.ink; ctx.fillRect(cx - 18, ty, 36, 6); line(ctx, [[cx, ty + 3], [cx + 26 * (tap > 0 ? 1 : 0.2), ty - 12]], col.bad, 5);
    if (tap > 0 && drained < 0.5 && mix < 0.1) for (let i = 0; i < 4; i++) dot(ctx, cx, top + fh + 8 + i * 8, 2.6, col.s[0]);
    const bx = w * 0.18, by = h - 28, bw = 70; ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(w * 0.7, h - 70, 56, 52); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fillRect(w * 0.7 + 1, h - 18 - 50 * (drained / 0.5), 54, 50 * (drained / 0.5)); ctx.globalAlpha = 1; void bx; void by; void bw;
    text(ctx, 'beaker', w * 0.7 + 28, h - 8, { color: col.muted, size: 10, align: 'center' });
    if (mix <= 0.1 && shake <= 0) { text(ctx, 'oil (lighter)', cx + fw / 2 + 4, top + fh * 0.25, { color: col.s[2], size: 10.5, weight: 700 }); if (drained < 0.45) text(ctx, 'water (denser)', cx + fw * 0.3, top + fh * 0.72, { color: col.s[0], size: 10.5, weight: 700 }); }
  };
}
