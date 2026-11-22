// Class 10 Acids, Bases and Salts (step player): two classic tests of what an acid does.
// Acid + metal gives a salt and hydrogen gas, which burns with a pop. Acid + metal carbonate gives a salt, water and
// carbon dioxide, which turns lime water milky (CaCO3) and, in excess, clears it again (soluble Ca(HCO3)2).
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.66, max: 440, min: 300, label: 'A flask with acid and a metal or a carbonate, a delivery tube and a test' });
  const TITLES = ['Set up: acid and zinc in a flask', 'Zn + 2HCl → ZnCl₂ + H₂: bubbles of gas', 'The pop test for hydrogen', 'Now sodium carbonate + acid', 'CO₂ turns lime water milky', 'Too much CO₂ and it clears again'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8;
    const fx = w * 0.12, fw = w * 0.3, fy = top + 40, fh = h - fy - 44;
    const carb = step >= 3, gas = step >= 1 && step !== 2 || step === 2;
    // flask
    ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.2; ctx.fillRect(fx, fy + fh * 0.45, fw, fh * 0.55); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(fx + fw * 0.3, fy); ctx.lineTo(fx + fw * 0.3, fy + fh * 0.2); ctx.lineTo(fx, fy + fh); ctx.lineTo(fx + fw, fy + fh); ctx.lineTo(fx + fw * 0.7, fy + fh * 0.2); ctx.lineTo(fx + fw * 0.7, fy); ctx.stroke();
    ctx.fillStyle = carb ? '#e8e8e8' : '#8c8f94'; ctx.fillRect(fx + fw / 2 - 12, fy + fh - 8, 24, 6);
    text(ctx, carb ? 'Na₂CO₃ + dil. HCl' : 'zinc + dil. HCl', fx + fw / 2, fy + fh + 14, { color: col.muted, size: 10.5, align: 'center' });
    // cork and tube
    const tx = fx + fw / 2, ty = fy - 10, ex = w * 0.72;
    line(ctx, [[tx, fy + 6], [tx, ty], [ex, ty], [ex, fy + fh * 0.55]], col.ink, 3);
    const bubbling = step === 1 || step === 4 || step === 5;
    const nB = bubbling || step === 2 ? 7 : 0;
    for (let i = 0; i < nB; i++) { const y = (t * 0.5 + i / 7) % 1; dot(ctx, fx + 10 + ((i * 29) % (fw - 20)), fy + fh - 12 - y * fh * 0.55, 2.5 + (i % 3), col.bg || '#fff', col.muted); }
    // receiver
    const rx = ex - w * 0.14, rw = w * 0.28, ry = fy + fh * 0.4, rh = fh * 0.6;
    if (step === 0 || step === 1 || step === 2) {
      // soap solution dish with bubbles
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.18; ctx.fillRect(rx, ry + rh * 0.6, rw, rh * 0.4); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rx, ry + rh * 0.45); ctx.lineTo(rx, ry + rh); ctx.lineTo(rx + rw, ry + rh); ctx.lineTo(rx + rw, ry + rh * 0.45); ctx.stroke();
      text(ctx, 'soap solution', rx + rw / 2, ry + rh + 13, { color: col.muted, size: 10.5, align: 'center' });
      if (step >= 1) for (let i = 0; i < 4; i++) { const y = (t * 0.35 + i / 4) % 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(ex + (i - 1.5) * 10 + Math.sin(t * 3 + i) * 4, ry + rh * 0.55 - y * rh * 0.55, 7, 0, 7); ctx.stroke(); }
      if (step === 2) {
        const cy = ry - 10, pop = (t % 2) / 2;
        line(ctx, [[rx + rw + 20, cy + 20], [rx + rw + 20, cy - 10]], col.ink, 3); dot(ctx, rx + rw + 20, cy - 16, 5, col.s[3]);
        line(ctx, [[rx + rw + 20, cy - 16], [ex + 4, ry + rh * 0.1]], col.s[3], 1.5, [3, 3]);
        if (pop > 0.55) { text(ctx, 'POP!', ex + 6, ry - 8, { color: col.s[7], size: 16, weight: 700, align: 'center' }); }
        text(ctx, 'burning splinter near the hydrogen bubbles', w / 2, h - 28, { color: col.muted, size: 10.5, align: 'center' });
      }
    } else {
      const milky = step === 3 ? 0 : step === 4 ? Math.min(1, (t * 0.5) % 2) : Math.max(0, 1 - (t * 0.4) % 2.5);
      const cl = step === 4 ? Math.min(1, t / 2) : step === 5 ? Math.max(0, 1 - t / 3) : 0;
      ctx.fillStyle = col.bg ? col.panel : '#fff'; ctx.fillStyle = col.soft; ctx.fillRect(rx, ry + rh * 0.3, rw, rh * 0.7);
      ctx.fillStyle = `rgba(190,190,190,${cl * 0.9})`; ctx.fillRect(rx, ry + rh * 0.3, rw, rh * 0.7);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(rx, ry, rw, rh);
      text(ctx, 'lime water', rx + rw / 2, ry + rh + 13, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, step === 3 ? 'clear Ca(OH)₂' : step === 4 ? (cl < 0.5 ? 'going cloudy...' : 'milky: CaCO₃') : (cl > 0.4 ? 'still milky' : 'clear again: Ca(HCO₃)₂'), rx + rw / 2, ry - 8, { color: col.ink, size: 10.5, weight: 700, align: 'center' });
      for (let i = 0; i < 4 && step >= 4; i++) { const y = (t * 0.6 + i / 4) % 1; dot(ctx, ex + (i - 1.5) * 9, ry + rh - 8 - y * rh * 0.55, 2.5, col.bg || '#fff', col.muted); }
    }
    const note = ['Dilute acid is poured onto granules of zinc.', 'Gas bubbles up and forms soap bubbles filled with hydrogen.', 'The hydrogen burns with a squeaky pop: this is the test for H₂.', 'The same acid on a carbonate also fizzes. Pass the gas through lime water.', 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O: white, insoluble CaCO₃ makes it milky.', 'CaCO₃ + H₂O + CO₂ → Ca(HCO₃)₂: soluble, so the milkiness goes away.'][step];
    text(ctx, note, w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
