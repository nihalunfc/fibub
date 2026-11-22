// Breathing as a pump. Watch the diaphragm flatten and the ribs lift on inspiration: the chest volume rises, so the
// pressure inside the lungs falls below the air outside (Boyle's law) and air flows in. On expiration it runs the other
// way. Try "Forced" to bring in the extra muscles (more volume change, bigger pressure swing).
import { canvas, loop, row, slider, choice, readout, text, title } from '../kit.js';

export default function (host) {
  let rate = 15, mode = 'quiet', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 330, label: 'A chest with a moving diaphragm and rib cage, with lung volume and pressure over time' });
  const ctl = row(host);
  loop(host, (dt) => { t += dt * rate / 60 * 2 * Math.PI; cv.redraw(); show(); }).button(ctl);
  slider(ctl, { label: 'Breaths', min: 6, max: 40, step: 1, value: rate, fmt: (v) => `${v}/min`, oninput: (v) => { rate = v; } });
  choice(ctl, 'Effort', [['quiet', 'Quiet'], ['forced', 'Forced']], mode, (v) => { mode = v; show(); });
  const out = readout(host);
  const amp = () => (mode === 'quiet' ? 0.5 : 1.8);  // litres of tidal volume
  const vol = (tt) => 2.4 + amp() * (1 - Math.cos(tt)) / 2;
  const pres = (tt) => -3 * (amp() / 2) * Math.sin(tt) * (rate / 60) * 2 * Math.PI; // cm H2O, proportional to -dV/dt
  function show() { const ph = Math.sin(t) > 0 ? 'inspiration' : 'expiration'; out.innerHTML = `Now: <b>${ph}</b>. Lung volume <b>${vol(t).toFixed(2)} L</b>, pressure inside <b>${pres(t) >= 0 ? '+' : ''}${pres(t).toFixed(1)} cm H₂O</b> relative to the air outside. Inspiration: diaphragm contracts (flattens), external intercostals lift the ribs, volume up, pressure below atmospheric. Expiration is normally passive recoil.`; }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Chest and lungs', col);
    const s = 0.5 - 0.5 * Math.cos(t), f = mode === 'quiet' ? s * 0.55 : s, bx = w * 0.3, top = 58, bot = h * 0.56;
    const W = w * 0.26 + f * 14, H = (bot - top) / 2 + f * 6;
    // rib cage (grows wide and rises)
    ctx.strokeStyle = col.muted; ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) { const y = top + 14 + i * 22 - f * 7; ctx.beginPath(); ctx.moveTo(bx, y + 10); ctx.quadraticCurveTo(bx - W * 1.05, y - 6, bx - W * 0.9, y + 28); ctx.moveTo(bx, y + 10); ctx.quadraticCurveTo(bx + W * 1.05, y - 6, bx + W * 0.9, y + 28); ctx.stroke(); }
    // lungs inflate
    ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(bx, top + 56 - f * 2, W * 0.72, 40 + f * 10, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    text(ctx, 'lungs', bx, top + 56, { color: col.ink, size: 11, weight: 700, align: 'center' });
    // diaphragm dome flattens
    const dy = bot + 14 - f * 3, dome = 24 * (1 - f * 0.85);
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(bx - W * 0.95, dy + 10 + f * 12); ctx.quadraticCurveTo(bx, dy - dome * 2 + 20 + f * 12, bx + W * 0.95, dy + 10 + f * 12); ctx.stroke();
    text(ctx, 'diaphragm', bx, dy + 30 + f * 12, { color: col.s[1], size: 11, weight: 700, align: 'center' });
    // air arrow
    const flow = Math.sin(t) > 0 ? 1 : -1; ctx.strokeStyle = flow > 0 ? col.good : col.bad; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, 28 + (flow > 0 ? 0 : 20)); ctx.lineTo(bx, 28 + (flow > 0 ? 20 : 0)); ctx.stroke();
    text(ctx, flow > 0 ? 'air in' : 'air out', bx + 8, 38, { color: ctx.strokeStyle, size: 10.5, weight: 700, fit: false });
    // graphs on the right
    const gx = w * 0.58, gw = w * 0.38, gh = 64;
    const plot = (y0, fn, c, lab, lo, hi) => { ctx.strokeStyle = col.line; ctx.strokeRect(gx, y0, gw, gh); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const tt = t - 2 * Math.PI * (1 - i / 60) * 1.0, v = fn(tt), y = y0 + gh - ((v - lo) / (hi - lo)) * gh; i ? ctx.lineTo(gx + gw * i / 60, y) : ctx.moveTo(gx, y); } ctx.stroke(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(gx + gw, y0 + gh - ((fn(t) - lo) / (hi - lo)) * gh, 4, 0, 7); ctx.fill(); text(ctx, lab, gx, y0 - 8, { color: col.ink, size: 10.5, weight: 700, fit: false }); };
    plot(60, vol, col.s[0], 'Lung volume (L)', 1.4, 5.2);
    plot(168, pres, col.s[5], 'Lung pressure (cm H₂O)', -9, 9);
    text(ctx, 'Boyle: volume up, pressure down.', w / 2, h - 12, { color: col.muted, size: 11, align: 'center' });
  };
  show();
}
