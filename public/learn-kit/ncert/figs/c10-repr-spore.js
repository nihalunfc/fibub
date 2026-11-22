// Class 10 How do Organisms Reproduce? (step player): spore formation in Rhizopus (bread mould). Hyphae grow upright and
// form sporangia full of spores. When ripe, the sporangium bursts and light spores drift in the air. A spore with a hard
// protective coat survives dry spells; on damp food it germinates into a new hypha and a new mould colony.
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 290, label: 'Bread mould forming spores that spread through the air and grow on new bread' });
  const TITLES = ['Rhizopus growing on bread', 'Spores form inside the sporangium', 'The sporangium bursts', 'A spore lands on damp bread', 'The spore germinates', 'A new mould colony'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 6, by = h - 66, bh = 34;
    ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.roundRect(w * 0.08, by, w * 0.84, bh, 8); ctx.fill(); ctx.restore();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(w * 0.08, by, w * 0.84, bh, 8); ctx.stroke();
    text(ctx, step >= 3 ? 'damp bread' : 'bread', w / 2, by + bh / 2, { color: col.ink, size: 11, align: 'center' });
    const spo = (x, burst) => { const sh = Math.min(by - top - 40, 100); line(ctx, [[x, by], [x, by - sh]], col.ink, 2.2); if (!burst) { dot(ctx, x, by - sh - 14, 14, step >= 1 ? col.s[2] : col.s[1], col.ink); if (step >= 1) for (let i = 0; i < 9; i++) dot(ctx, x - 7 + (i % 3) * 7, by - sh - 20 + Math.floor(i / 3) * 6, 1.8, col.panel); } else { ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, by - sh - 14, 14, 2.4, 6.9); ctx.stroke(); } return by - sh - 14; };
    if (step <= 2) {
      const ys = [0.28, 0.5, 0.72].map((f) => spo(w * f, step === 2));
      line(ctx, [[w * 0.12, by + 1], [w * 0.88, by + 1]], col.ink, 1.2);
      for (let i = 0; i < 10; i++) line(ctx, [[w * (0.14 + i * 0.075), by + 2], [w * (0.14 + i * 0.075) + 8, by + 12]], col.muted, 1);
      text(ctx, 'sporangium', w * 0.28, ys[0] - 24, { color: col.muted, size: 10, align: 'center' });
      if (step === 2) for (let i = 0; i < 24; i++) { const a = i * 2.4, k = (t * 0.4 + i * 0.07) % 1; dot(ctx, w * (0.2 + 0.6 * ((i * 37) % 100) / 100) + Math.sin(a + t) * 10, ys[i % 3] - k * (by - top) * 0.7, 2, col.s[4]); }
    }
    if (step === 3) { for (let i = 0; i < 6; i++) { const k = Math.min(1, t * 0.6 - i * 0.05); dot(ctx, w * (0.2 + i * 0.12), top + 20 + (by - top - 34) * Math.max(0, k) * (0.6 + (i % 3) * 0.13), 3.5, col.s[4]); } text(ctx, 'spores have a tough coat: they wait out dry weather', w / 2, top + 22, { color: col.muted, size: 10, align: 'center' }); }
    if (step >= 4) { const k = step === 4 ? Math.min(1, t / 2) : 1; line(ctx, [[w * 0.5, by], [w * 0.5, by - 30 * k]], col.ink, 2); if (step === 4) dot(ctx, w * 0.5, by - 30 * k - 3, 3.5, col.s[4]);
      if (step === 5) { for (let i = -3; i <= 3; i++) line(ctx, [[w * 0.5, by], [w * 0.5 + i * 22, by - 30 - Math.abs(i) * 4]], col.ink, 1.6); spo(w * 0.5 - 66, false); spo(w * 0.5 + 66, false); }
      text(ctx, step === 4 ? 'a thread (hypha) grows into the bread' : 'hyphae spread and make new sporangia', w / 2, top + 30, { color: col.muted, size: 10.5, align: 'center' }); }
    text(ctx, ['Cottony threads called hyphae; black dots are sporangia.', 'Each sporangium fills with hundreds of tiny spores.', 'Spores are very light and float in the air.', 'Warmth and moisture are all it needs.', 'Asexual reproduction: no partner needed.', 'Every spore can start a colony.'][step], w / 2, h - 10, { color: col.muted, size: 10, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
