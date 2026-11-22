// Yeast fermentation in a flask: yeast turns sugar into ethanol and CO₂ without oxygen, and the CO₂ bubbles show the rate.
// Slide the temperature and the sugar: the rate climbs with warmth (enzymes work faster), peaks near 35 to 40 °C, then
// collapses as the enzymes denature; more sugar raises the rate until the enzymes are saturated. Used in bread, beer and wine.
import { canvas, loop, row, slider, readout, rng, text, title } from '../kit.js';

export default function (host) {
  let T = 30, S = 10, t = 0, bub = [];
  const cv = canvas(host, { aspect: 0.95, max: 400, min: 320, label: 'A flask of yeast and sugar giving off carbon dioxide bubbles at a rate set by temperature' });
  const c = row(host);
  loop(host, (dt) => { t += dt; const r = rate(); if (Math.random() < r * dt * 7) bub.push({ x: 0.2 + Math.random() * 0.6, y: 0.9, v: 0.15 + Math.random() * 0.2 }); bub.forEach((b) => { b.y -= b.v * dt; b.x += Math.sin(t * 3 + b.v * 20) * 0.001; }); bub = bub.filter((b) => b.y > 0.32); cv.redraw(); }).button(c);
  slider(c, { label: 'Temperature', min: 5, max: 65, step: 1, value: T, fmt: (v) => `${v} °C`, oninput: (v) => { T = v; show(); } });
  slider(c, { label: 'Sugar', min: 1, max: 30, step: 1, value: S, fmt: (v) => `${v} %`, oninput: (v) => { S = v; show(); } });
  const out = readout(host);
  const tf = () => (T <= 38 ? Math.exp(-(((T - 38) / 18) ** 2)) : Math.max(0, 1 - (T - 38) / 14) ** 2), sf = () => S / (S + 5);
  const rate = () => tf() * sf() * 1.5;
  function show() { out.innerHTML = `Rate of CO₂ release (relative): <b>${(rate() * 100).toFixed(0)}</b>. ${T > 50 ? 'Too hot: the enzymes of glycolysis denature and the yeast dies.' : T < 12 ? 'Cold: enzymes work slowly.' : T > 42 ? 'Above the optimum: rate drops as enzymes begin to denature.' : 'Near the optimum for yeast enzymes.'} ${S < 4 ? 'Little sugar limits the rate.' : S > 20 ? 'Plenty of sugar: the enzymes are close to saturation.' : ''} C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ + 2 ATP.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Yeast in sugar solution', col);
    const fx = w * 0.12, fw = w * 0.4, ft = 70, fb = h - 40;
    ctx.beginPath(); ctx.moveTo(fx + fw * 0.3, ft); ctx.lineTo(fx + fw * 0.3, ft + 40); ctx.lineTo(fx, fb - 20); ctx.quadraticCurveTo(fx, fb, fx + 20, fb); ctx.lineTo(fx + fw - 20, fb); ctx.quadraticCurveTo(fx + fw, fb, fx + fw, fb - 20); ctx.lineTo(fx + fw * 0.7, ft + 40); ctx.lineTo(fx + fw * 0.7, ft); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.moveTo(fx + fw * 0.15, ft + 90); ctx.lineTo(fx + 2, fb - 20); ctx.quadraticCurveTo(fx + 2, fb - 2, fx + 20, fb - 2); ctx.lineTo(fx + fw - 20, fb - 2); ctx.quadraticCurveTo(fx + fw - 2, fb - 2, fx + fw - 2, fb - 20); ctx.lineTo(fx + fw * 0.85, ft + 90); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    const R = rng(4); for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc(fx + 14 + R() * (fw - 28), fb - 16 - R() * 60, 2, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill(); }
    bub.forEach((b) => { ctx.beginPath(); ctx.arc(fx + b.x * fw, ft + 90 + (b.y - 0.3) / 0.6 * (fb - ft - 100) * 0.9, 3 + b.v * 6, 0, 7); ctx.strokeStyle = col.s[4]; ctx.lineWidth = 1.5; ctx.stroke(); });
    text(ctx, 'blue rings: CO₂ bubbles', w * 0.62, 242, { color: col.s[4], size: 11, weight: 700, fit: true });
    text(ctx, 'orange dots: yeast cells', w * 0.62, 260, { color: col.s[1], size: 11, weight: 700, fit: true });
    // rate bar and curve
    const gx = w * 0.62, gw = w * 0.34, gh = 120, gy = 90; ctx.strokeStyle = col.line; ctx.strokeRect(gx, gy, gw, gh);
    ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const tt = 5 + i; const f = (tt <= 38 ? Math.exp(-(((tt - 38) / 18) ** 2)) : Math.max(0, 1 - (tt - 38) / 14) ** 2) * sf() * 1.5, x = gx + (i / 60) * gw, y = gy + gh - f * gh * 0.8; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    const xx = gx + ((T - 5) / 60) * gw; ctx.strokeStyle = col.bad; ctx.beginPath(); ctx.moveTo(xx, gy); ctx.lineTo(xx, gy + gh); ctx.stroke();
    text(ctx, 'rate vs temperature', gx, gy - 8, { color: col.ink, size: 10.5, weight: 700, fit: false }); text(ctx, '5', gx, gy + gh + 11, { color: col.muted, size: 9.5, fit: false }); text(ctx, '65 °C', gx + gw, gy + gh + 11, { color: col.muted, size: 9.5, align: 'right', fit: false });
  };
  show();
}
