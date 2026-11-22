// Class 12 Biology, Organisms and Populations (step player): the body at high altitude. Air pressure falls with height, so each breath carries less oxygen:
// about 100 % at sea level, 70 % at 3000 m, 53 % at 5000 m and about 32 % on Mt Everest (8848 m). Altitude sickness (nausea, fatigue, palpitations) follows.
// Over days to weeks the body acclimatises: the red blood cell count rises, haemoglobin binds oxygen less tightly so it unloads more easily in tissues,
// and breathing becomes faster. The curves for the later steps are illustrative.
import { canvas, text, title, line, dot } from '../../kit.js';

export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A mountain with bars showing the oxygen in the air, and the body responses over days at altitude' });
  const TITLES = ['1. Sea level', '2. Climbing: less oxygen', '3. Altitude sickness', '4. The body acclimatises', '5. Settled at altitude'];
  const O2 = [100, 53, 53, 53, 53], RBC = [100, 100, 100, 122, 135], BR = [100, 105, 150, 140, 130];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[st], col) + 6, mh = 78, by = top + mh;
    ctx.fillStyle = col.soft; ctx.beginPath(); ctx.moveTo(10, by); ctx.lineTo(w * 0.35, by - 30); ctx.lineTo(w * 0.52, by - 58); ctx.lineTo(w * 0.66, by - mh); ctx.lineTo(w - 10, by); ctx.closePath(); ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.stroke();
    const px = [w * 0.1, w * 0.52, w * 0.52, w * 0.52, w * 0.52][st], py = [by - 2, by - 58, by - 58, by - 58, by - 58][st]; dot(ctx, px, py - 8, 5, col.s[2], col.ink); line(ctx, [[px, py - 3], [px, py + 6]], col.s[2], 3);
    text(ctx, st === 0 ? 'sea level' : '5000 m', px + 10, py - 8, { color: col.ink, size: 10.5, weight: 700 });
    const bars = [['oxygen in air', O2[st], col.s[0]], ['red blood cells', RBC[st], col.s[2]], ['breathing rate', BR[st], col.s[3]]], bx = 16, bw = w - 140, y0 = by + 26;
    bars.forEach(([n, v, c], i) => { const y = y0 + i * 38; text(ctx, n, bx, y - 8, { color: col.muted, size: 10.5, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(bx, y, bw, 14); ctx.fillStyle = c; ctx.fillRect(bx, y, Math.min(bw, bw * v / 160), 14); text(ctx, v + ' %', bx + bw + 8, y + 7, { color: col.ink, size: 11, weight: 700 }); });
    const NOTES = ['At sea level the air holds all the oxygen your body is used to: 100 % in the bars (the reference).', 'At 5000 m the air pressure is about half, so each breath carries only about 53 % as much oxygen.', 'Not enough oxygen reaches the tissues: nausea, fatigue and a racing heart. Breathing speeds up to catch more.', 'Over days the body makes more red blood cells, haemoglobin unloads oxygen more easily, and breathing stays faster.', 'After weeks the person copes. People born at altitude, like Sherpas, have these adaptations from birth.'];
    NOTES[st].match(/.{1,50}(\s|$)/g).forEach((ln, i) => text(ctx, ln.trim(), 14, y0 + 124 + i * 15, { color: col.ink, size: 11 }));
  };
  cv.redraw();
  return { step(i) { st = Math.min(i, 4); cv.redraw(); } };
}
