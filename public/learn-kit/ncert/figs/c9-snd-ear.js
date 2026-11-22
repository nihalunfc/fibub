// Class 9 Sound (step player): the path of sound through the human ear. Outer ear (pinna) collects the sound; the ear
// canal carries it to the eardrum, a thin membrane that vibrates; three tiny bones (hammer, anvil, stirrup) pass on and
// strengthen the vibration; in the fluid-filled cochlea hair cells turn the vibration into nerve signals; the auditory
// nerve carries them to the brain, which decides what you heard. A simplified schematic, not to scale.
import { canvas, text, title, dot, line, arrow, loop, font } from '../../kit.js';

const NAMES = ['Pinna (outer ear)', 'Ear canal', 'Eardrum', 'Three tiny bones', 'Cochlea', 'Auditory nerve to brain'];
const CAP = ['The pinna, the part you can see, collects sound waves and funnels them inwards.', 'The ear canal carries the sound waves to a thin stretched skin, the eardrum.', 'Compressions push the eardrum in and rarefactions let it spring out: it vibrates at the sound’s frequency.', 'The hammer, anvil and stirrup pass the vibration on and make it stronger before it reaches the inner ear.', 'The snail-shaped cochlea is filled with fluid. Its hair cells move with the vibration and make electrical signals.', 'The auditory nerve takes the signals to the brain, which turns them into the sound you recognise.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 320, label: 'Six stages of the human ear from outer ear to brain, highlighted one at a time' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, NAMES[step], col);
    const cw = (w - 20) / 3, ch = (h - 100) / 2, S = Math.min(cw, ch) * 0.34;
    const cell = (i) => ({ x: 10 + cw * (i % 3) + cw / 2, y: 36 + ch * Math.floor(i / 3) + ch * 0.42 });
    const osc = Math.sin(t * 9);
    for (let i = 0; i < 6; i++) {
      const { x, y } = cell(i), on = i === step, c = on ? col.s[2] : col.muted, lw = on ? 3 : 1.8;
      ctx.save(); ctx.globalAlpha = on ? 1 : 0.5;
      if (i === 0) { // pinna: curved funnel
        ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x, y, S, -2.2, 2.2); ctx.stroke(); ctx.beginPath(); ctx.arc(x + S * 0.15, y, S * 0.5, -2.2, 2.2); ctx.stroke();
        if (on) for (let k = 0; k < 3; k++) { const f = ((t * 0.8 + k / 3) % 1); ctx.globalAlpha = 1 - f; line(ctx, [[x - S * 1.9 + f * S * 1.4, y - 10 + k * 10], [x - S * 1.9 + f * S * 1.4 + 8, y - 10 + k * 10]], col.s[0], 2); }
      }
      if (i === 1) { line(ctx, [[x - S, y - S * 0.4], [x + S, y - S * 0.4]], c, lw); line(ctx, [[x - S, y + S * 0.4], [x + S, y + S * 0.4]], c, lw); if (on) for (let k = 0; k < 4; k++) { const f = ((t * 0.9 + k / 4) % 1); dot(ctx, x - S + f * 2 * S, y, 2.6, col.s[0]); } }
      if (i === 2) { ctx.strokeStyle = c; ctx.lineWidth = lw + 1; ctx.beginPath(); ctx.moveTo(x, y - S); ctx.quadraticCurveTo(x + (on ? osc * 8 : 0), y, x, y + S); ctx.stroke(); if (on) { arrow(ctx, x - S * 1.2, y, x - S * 0.4 + osc * 4, y, col.s[0], 2, 7); } }
      if (i === 3) { const bx = [x - S * 1.1, x, x + S * 1.1]; bx.forEach((b, k) => { const j = on ? osc * 3 * (k + 1) / 3 : 0; ctx.fillStyle = c; ctx.fillRect(b - 7 + j, y - 5 + (k === 1 ? 0 : 0), 14, 10); if (k < 2) line(ctx, [[b + 7 + j, y], [bx[k + 1] - 7 + (on ? osc * 3 * (k + 2) / 3 : 0), y]], c, 2); }); text(ctx, 'hammer · anvil · stirrup', x, y + S * 0.9, { color: col.muted, size: 10, align: 'center' }); }
      if (i === 4) { ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); for (let a = 0; a < 11; a += 0.2) { const r = S * (0.15 + a * 0.085); ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.stroke(); if (on) for (let k = 0; k < 5; k++) { const a = 1.5 + k * 1.7, r = S * (0.15 + a * 0.085); dot(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r + osc * 2, 2.6, col.s[1]); } }
      if (i === 5) { line(ctx, [[x - S * 1.1, y + S * 0.4], [x - S * 0.2, y + S * 0.4], [x + S * 0.2, y - S * 0.2]], c, lw); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(x + S * 0.65, y - S * 0.45, S * 0.55, 0, 7); ctx.stroke(); if (on) { const f = (t * 0.7) % 1; dot(ctx, x - S * 1.1 + f * S * 1.5, y + S * 0.4 - Math.max(0, f - 0.4) * S * 1.3, 3.5, col.s[1]); } }
      ctx.restore();
      text(ctx, `${i + 1}`, x - cw / 2 + 12, y - ch * 0.38, { color: on ? col.s[2] : col.muted, size: 11, weight: 700 });
      if (i < 5 && i % 3 < 2) arrow(ctx, x + cw / 2 - 18, y + S * 1.3, x + cw / 2 + 4, y + S * 1.3, col.line, 1.6, 6);
    }
    ctx.font = font(10.5, 400);
    const wds = CAP[step].split(' '); const L = []; let cur = ''; wds.forEach((wd) => { const tryS = cur ? cur + ' ' + wd : wd; if (ctx.measureText(tryS).width > w - 24) { L.push(cur); cur = wd; } else cur = tryS; }); L.push(cur);
    L.forEach((l, i) => text(ctx, l, 12, h - 10 - (L.length - 1 - i) * 14, { color: col.ink, size: 10.5 }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(Math.max(0, i), 5); t = 0; cv.redraw(); } };
}
