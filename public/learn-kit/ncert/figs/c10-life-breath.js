// Class 10 Life Processes: breathing. Breathing in: the diaphragm flattens and the ribs lift, the chest volume grows,
// the pressure falls and air rushes in. Breathing out reverses it. Lungs hold air that is gas-exchanged in about 300 million
// alveoli. Minute ventilation = breathing rate x tidal volume (volume of one breath). A resting adult has about 12-16
// breaths a minute and a tidal volume of about 0.5 L (about 6-8 L per minute); in heavy exercise both rise.
import { canvas, text, title, line, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let rate = 14, tv = 0.5, ph = 0;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'Lungs and diaphragm moving as breathing rate and breath depth change' });
  const ctl = row(host);
  slider(ctl, { label: 'Breaths per minute', min: 6, max: 40, step: 1, value: rate, fmt: (v) => v + '/min', oninput: (v) => { rate = v; say(); } });
  slider(ctl, { label: 'Depth of each breath', min: 0.3, max: 3, step: 0.1, value: tv, fmt: (v) => v.toFixed(1) + ' L', oninput: (v) => { tv = v; say(); } });
  const anim = loop(host, (dt) => { ph += dt * rate / 60 * 2 * Math.PI; cv.redraw(); });
  const out = readout(host);
  function say() { const mv = rate * tv; out.innerHTML = `Air moved per minute = ${rate} × ${tv.toFixed(1)} L = <b>${mv.toFixed(1)} L/min</b> (about ${(mv * 60 * 24 / 1000).toFixed(1)} m³ a day). ${mv < 5 ? 'Slower than rest.' : mv < 10 ? 'This is about a person at rest.' : mv < 25 ? 'Brisk walking or jogging.' : 'Heavy exercise: the body needs far more oxygen.'} `; }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Breathing: in and out', col) + 6, cx = w / 2, cb = (1 - Math.cos(ph)) / 2, inhale = Math.sin(ph) > 0;
    const grow = 0.5 + 0.5 * Math.min(1, tv / 1.5) * cb, bodyW = w * 0.62, y0 = top + 8, bodyH = (h - top) * 0.66;
    // chest
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(cx - bodyW / 2, y0, bodyW, bodyH, 26); ctx.stroke();
    // ribs lift
    for (let i = 0; i < 4; i++) { const y = y0 + 26 + i * 18 - cb * 5; line(ctx, [[cx - bodyW / 2 - 4, y], [cx - bodyW / 2 + 14 - cb * 6, y + 10]], col.muted, 2); line(ctx, [[cx + bodyW / 2 + 4, y], [cx + bodyW / 2 - 14 + cb * 6, y + 10]], col.muted, 2); }
    // lungs
    const lw = bodyW * 0.16 * (0.75 + 0.5 * grow), lh = bodyH * 0.3 * (0.75 + 0.45 * grow);
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3 + 0.2 * cb; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.ellipse(cx + s * bodyW * 0.22, y0 + bodyH * 0.38, lw, lh, 0, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; [-1, 1].forEach((s) => { ctx.beginPath(); ctx.ellipse(cx + s * bodyW * 0.22, y0 + bodyH * 0.38, lw, lh, 0, 0, 7); ctx.stroke(); });
    // windpipe
    line(ctx, [[cx, y0 - 10], [cx, y0 + bodyH * 0.25], [cx - bodyW * 0.2, y0 + bodyH * 0.38]], col.ink, 2.5); line(ctx, [[cx, y0 + bodyH * 0.25], [cx + bodyW * 0.2, y0 + bodyH * 0.38]], col.ink, 2.5);
    // moving air dots
    for (let i = 0; i < 4; i++) { const f = (ph / 6.283 * 3 + i / 4) % 1; dot(ctx, cx, inhale ? y0 - 10 + f * bodyH * 0.35 : y0 + bodyH * 0.25 - f * bodyH * 0.35, 3.2, col.s[1]); }
    // diaphragm
    const dy = y0 + bodyH - 14 + cb * 12;
    ctx.strokeStyle = col.s[7]; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx - bodyW / 2 + 4, y0 + bodyH - 6); ctx.quadraticCurveTo(cx, dy - 24 * (1 - cb) - 2, cx + bodyW / 2 - 4, y0 + bodyH - 6); ctx.stroke();
    text(ctx, 'diaphragm', cx, y0 + bodyH + 12, { color: col.s[7], size: 10.5, weight: 700, align: 'center' });
    text(ctx, inhale ? 'Breathing IN: diaphragm flattens, ribs lift, volume ↑, pressure ↓' : 'Breathing OUT: diaphragm domes up, ribs fall, volume ↓, pressure ↑', cx, h - 14, { color: col.ink, size: 10, weight: 700, align: 'center' });
  };
  say();
}
