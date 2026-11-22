// Class 9 Mixtures (step player): fractional distillation of two miscible liquids with different boiling points
// (ethanol boils at 78 C, water at 100 C; the difference should be less than about 25 C for simple distillation to fail).
// A fractionating column packed with glass beads gives many cycles of condensing and re-boiling: it is cooler at the top.
// Water (less volatile) condenses and runs back; ethanol vapour reaches the top first, passes into the condenser and is
// collected at 78 C. When the thermometer rises towards 100 C, the receiver is changed to collect water.
// Used for air (nitrogen, oxygen, argon), crude oil (petrol, diesel, kerosene) and alcohol.
import { canvas, text, title, dot, line, loop } from '../../kit.js';

const CAP = ['Ethanol and water mix completely, so they cannot be filtered or settled. Their boiling points differ (78 °C and 100 °C), which we can use.', 'Heat the flask. Both liquids evaporate, but ethanol is more volatile, so the vapour is richer in ethanol.', 'In the fractionating column the glass beads give a large surface. It is cooler higher up: water vapour condenses and drips back; ethanol vapour keeps rising.', 'Ethanol vapour reaches the top at 78 °C, enters the condenser and is collected as liquid ethanol in receiver 1.', 'When the thermometer climbs to 100 °C the ethanol is used up. Change to receiver 2 to collect the water. The two liquids are separated.'];
export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 300, label: 'A fractionating column separating ethanol that rises to the top from water that condenses and runs back' });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Two liquids, two boiling points', 'Heat the mixture', 'Up the column', 'Ethanol collected', 'Then water'][step], col);
    const fx = w * 0.22, fy = h * 0.66, fr = Math.min(w, h) * 0.11, cx = fx, ctop = h * 0.2, cbot = fy - fr + 4, cw = 26;
    ctx.beginPath(); ctx.arc(fx, fy, fr, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.arc(fx, fy, fr - 1, 0, 7); ctx.clip(); ctx.fillStyle = step === 4 ? col.s[0] : col.s[2]; ctx.globalAlpha = 0.4; ctx.fillRect(fx - fr, fy - fr * 0.1, fr * 2, fr * 1.2); ctx.globalAlpha = 1; ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.strokeRect(cx - cw / 2, ctop, cw, cbot - ctop);
    for (let i = 0; i < 26; i++) dot(ctx, cx - cw / 2 + 5 + (i % 3) * 8, ctop + 8 + Math.floor(i / 3) * ((cbot - ctop - 14) / 8), 2.6, col.line, col.muted);
    // temperature gradient bar
    const g = ctx.createLinearGradient(0, ctop, 0, cbot); g.addColorStop(0, col.s[0]); g.addColorStop(1, col.bad); ctx.fillStyle = g; ctx.globalAlpha = 0.5; ctx.fillRect(cx + cw / 2 + 4, ctop, 7, cbot - ctop); ctx.globalAlpha = 1;
    text(ctx, 'cool', cx - cw / 2 - 4, ctop + 8, { color: col.s[0], size: 10, align: 'right' }); text(ctx, 'hot', cx - cw / 2 - 4, cbot - 8, { color: col.bad, size: 10, align: 'right' });
    text(ctx, 'thermometer: ' + (step < 1 ? '25' : step === 4 ? '100' : '78') + ' °C', cx - cw / 2, ctop - 12, { color: col.bad, size: 10.5, weight: 700 });
    // condenser
    const cy0 = ctop + 6, cx1 = w * 0.78, cy1 = h * 0.58; line(ctx, [[cx + cw / 2, cy0], [w * 0.4, cy0]], col.ink, 2.5);
    ctx.save(); ctx.translate(w * 0.4, cy0); const ang = Math.atan2(cy1 - cy0, cx1 - w * 0.4), L = Math.hypot(cx1 - w * 0.4, cy1 - cy0); ctx.rotate(ang); ctx.fillStyle = col.soft; ctx.fillRect(0, -10, L, 20); ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(0, -10, L, 20); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(L, 0); ctx.stroke(); ctx.restore();
    // receivers
    const rs = [[cx1 - 38, cy1 + 30, 'ethanol', col.s[2], step >= 3], [cx1 + 12, cy1 + 30, 'water', col.s[0], step >= 4]];
    rs.forEach(([x, y, lb, c, on], i) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(x, y, 40, 40); const f = i === 0 ? (step >= 4 ? 0.7 : step === 3 ? 0.15 + 0.35 * ((t * 0.15) % 1) : 0) : step >= 4 ? 0.15 + 0.3 * ((t * 0.12) % 1) : 0; ctx.fillStyle = c; ctx.globalAlpha = 0.55; ctx.fillRect(x + 1, y + 39 - 36 * f, 38, 36 * f); ctx.globalAlpha = 1; text(ctx, lb, x + 20, y + 54, { color: col.ink, size: 9.5, weight: 700, align: 'center' }); if ((i === 0 && step === 3) || (i === 1 && step === 4)) { ctx.strokeStyle = col.good; ctx.lineWidth = 3; ctx.strokeRect(x - 2, y - 2, 44, 44); } void on; });
    // vapours
    if (step >= 1 && step <= 3) for (let i = 0; i < 12; i++) { const eth = i % 3 !== 0, p = ((t * (eth ? 0.3 : 0.2) + i / 12) % 1); const top = step === 1 ? 0.35 : eth ? 1 : 0.55; const y = fy - fr * 0.4 - p * (fy - fr - ctop - 6) * top; dot(ctx, cx - 6 + (i % 3) * 6 + Math.sin(t * 5 + i) * 2, y, 2.4, eth ? col.s[2] : col.s[0]); }
    if (step === 4) for (let i = 0; i < 8; i++) { const p = ((t * 0.3 + i / 8) % 1); dot(ctx, cx - 6 + (i % 3) * 6, fy - fr * 0.4 - p * (fy - fr - ctop - 6), 2.4, col.s[0]); }
    if (step >= 3) for (let i = 0; i < 6; i++) { const p = ((t * 0.4 + i / 6) % 1); dot(ctx, cx + cw / 2 + p * (cx1 - cx - cw / 2 - 20), cy0 + p * (cy1 - cy0 - 10), 2.4, step === 4 ? col.s[0] : col.s[2]); }
    if (step === 2) for (let i = 0; i < 4; i++) { const p = ((t * 0.35 + i / 4) % 1); dot(ctx, cx + 6 + (i % 2) * 5, ctop + 30 + p * 40, 2.4, col.s[0]); }
    if (step === 2) text(ctx, 'water drips back', cx + cw / 2 + 24, ctop + 60, { color: col.s[0], size: 10, weight: 700 });
    const Ls = []; let cur = ''; ctx.font = '11px system-ui'; CAP[step].split(' ').forEach((wd) => { if (ctx.measureText((cur + ' ' + wd).trim()).width > w - 24 && cur) { Ls.push(cur); cur = wd; } else cur = (cur + ' ' + wd).trim(); }); Ls.push(cur);
    Ls.forEach((l, i) => text(ctx, l, w / 2, h - 12 - (Ls.length - 1 - i) * 14, { color: col.ink, size: 11, align: 'center' }));
  };
  cv.redraw();
  return { step(i) { step = Math.min(i, 4); t = 0; cv.redraw(); } };
}
