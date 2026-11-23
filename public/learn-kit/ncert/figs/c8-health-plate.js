// Class 8 Science, Health: a balanced diet. Set how much of your plate goes to each food group (units add to 10).
// A healthy Indian thali is roughly: cereals and millets 4, pulses and protein 2, vegetables and fruits 3, milk 1,
// with a little oil and sugar. Missing groups cause deficiencies (illustrative guide, not medical advice).
import { canvas, text, title, line, row, slider, button, readout } from '../../kit.js';

const G = [['Cereals, millets (energy)', 4, 0], ['Pulses, eggs, fish (protein)', 2, 1], ['Vegetables, fruits (vitamins, minerals, fibre)', 3, 2], ['Milk, curd (calcium)', 1, 3], ['Oil, sweets (extra energy)', 0, 4]];
export default function (host) {
  const v = G.map((g) => g[1]);
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A plate divided into food groups with a balance check' });
  const ctl = row(host);
  const sl = G.map((g, i) => slider(ctl, { label: g[0].split(' (')[0], min: 0, max: 10, step: 1, value: v[i], fmt: (x) => String(x), oninput: (x) => { v[i] = x; upd(); } }));
  button(ctl, 'Try the sample thali', () => { G.forEach((g, i) => { v[i] = g[1]; sl[i].set(g[1]); }); upd(); });
  const out = readout(host);
  function upd() {
    const tot = v.reduce((a, b) => a + b, 0), msgs = [];
    if (tot === 0) { out.textContent = 'Add some food to the plate.'; return cv.redraw(); }
    const f = v.map((x) => x / tot * 10);
    if (f[1] < 1) msgs.push('too little protein can slow growth (kwashiorkor)'); if (f[2] < 2) msgs.push('few vegetables and fruits: low vitamins and iron (anaemia, scurvy risk)');
    if (f[3] < 0.5) msgs.push('little calcium: weak bones'); if (f[4] > 1.5) msgs.push('too much oil and sugar: risk of obesity and diabetes'); if (f[0] < 2) msgs.push('too little energy food: tired, underweight');
    out.innerHTML = msgs.length ? `<b>Not balanced:</b> ${msgs.join('; ')}.` : '<b>Balanced.</b> Every group is there in a sensible share. Add water and a pinch of salt only.'; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'My plate', col);
    const tot = v.reduce((a, b) => a + b, 0) || 1, cx = w * 0.3, cy = h * 0.5, R = Math.min(w * 0.26, h * 0.33);
    let a0 = -Math.PI / 2;
    ctx.fillStyle = col.panel; ctx.strokeStyle = col.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R + 8, 0, 7); ctx.stroke();
    v.forEach((x, i) => { if (!x) return; const a1 = a0 + x / tot * 2 * Math.PI; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a0, a1); ctx.closePath(); ctx.fillStyle = col.s[i]; ctx.fill(); ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.stroke(); a0 = a1; });
    const lx = w * 0.3 + R + 22;
    G.forEach((g, i) => { const y = 54 + i * 36; ctx.fillStyle = col.s[i]; ctx.fillRect(lx, y - 6, 12, 12); text(ctx, g[0].split(' (')[0], lx + 18, y - 4, { color: col.ink, size: 10.5, weight: 700 }); text(ctx, `${(v[i] / tot * 100).toFixed(0)}% of plate`, lx + 18, y + 9, { color: col.muted, size: 10 }); });
  };
  upd();
}
