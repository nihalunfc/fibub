// Class 12 Biology, Reproductive Health (step player): in vitro fertilisation and embryo transfer (IVF-ET), the commonest assisted reproductive technology.
// Eggs are collected from the ovary, fertilised with sperm in a dish in the laboratory, the embryo grows to 8 cells (transfer to the fallopian tube, ZIFT) or to
// a blastocyst (transfer to the uterus, IUT), and development goes on in the mother. 'Test-tube baby' means fertilisation outside the body only.
import { canvas, text, title, arrow, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Steps of in vitro fertilisation: collect eggs and sperm, fertilise in a dish, grow the embryo and place it in the mother' });
  const T = ['1. Ovaries are stimulated', '2. Eggs are collected', '3. Fertilisation in a dish', '4. The embryo grows in the lab', '5. Transfer to the mother', '6. The pregnancy continues'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, T[step], col) + 8, cx = w / 2, cy = top + (h - top) * 0.4;
    const L = (s, x, y, al = 'center', c = col.ink, sz = 10.5) => text(ctx, s, x, y, { color: c, size: sz, weight: 600, align: al, halo: col.panel });
    const E = (x, y, rx, ry, f) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fillStyle = f; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = col.ink; ctx.stroke(); };
    const dish = (x, y) => { E(x, y, 62, 22, col.soft); E(x, y - 6, 56, 16, col.panel); };
    if (step === 0) { E(cx - 70, cy, 40, 28, col.s[2]); for (let i = 0; i < 5; i++) dot(ctx, cx - 92 + i * 11, cy + (i % 2) * 8 - 4, 6, col.panel, col.ink); arrow(ctx, cx + 4, cy, cx + 40, cy, col.s[3], 2.5, 8); L('hormone injections (FSH-like)', cx + 90, cy - 18, 'center', col.s[3]); L('help several follicles to ripen', cx + 90, cy + 20, 'center', col.muted, 10); L('ovary', cx - 70, cy + 48, 'center', col.muted); }
    if (step === 1) { E(cx - 70, cy, 40, 28, col.s[2]); line2(ctx, cx - 40, cy - 6, cx + 10, cy - 30, col); dot(ctx, cx + 12, cy - 30, 6, col.panel, col.ink); L('a fine needle, guided by ultrasound, collects the eggs', cx, cy + 70, 'center', col.ink); L('semen is collected from the partner or a donor', cx, cy + 90, 'center', col.s[1]); }
    if (step === 2) { dish(cx, cy + 20); dot(ctx, cx - 10, cy + 12, 8, col.panel, col.ink); for (let k = 0; k < 4; k++) dot(ctx, cx + 24 + k * 5, cy + 6 + (k % 2) * 6, 2.5, col.s[1]); arrow(ctx, cx + 20, cy + 14, cx - 3, cy + 12, col.s[1], 1.5, 5); L('egg + sperm in a culture dish: fertilisation outside the body (in vitro)', cx, cy + 70, 'center', col.ink); L('some centres inject one sperm into the egg (ICSI)', cx, cy + 88, 'center', col.muted, 10); }
    if (step === 3) { dish(cx, cy + 20); const x0 = cx - 40; [[0, 0, 1], [30, 0, 2], [66, 0, 8]].forEach(([dx, dy, n], i) => { for (let k = 0; k < n; k++) { const a = k / n * 6.283; dot(ctx, x0 + dx + 12 + (n > 1 ? Math.cos(a) * (n > 4 ? 9 : 5) : 0), cy + 14 + (n > 1 ? Math.sin(a) * (n > 4 ? 9 : 5) : 0), n > 4 ? 3.6 : n > 1 ? 6 : 8, col.s[3], col.ink); } }); L('zygote → 2 cells → 8 cells (up to 8 blastomeres)', cx, cy + 70, 'center', col.ink); L('then (if kept longer) morula and blastocyst', cx, cy + 88, 'center', col.muted, 10); }
    if (step >= 4) {
      // uterus with tube
      ctx.beginPath(); ctx.moveTo(cx - 54, cy - 36); ctx.lineTo(cx + 54, cy - 36); ctx.lineTo(cx + 12, cy + 56); ctx.lineTo(cx - 12, cy + 56); ctx.closePath(); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1; ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
      line2(ctx, cx - 54, cy - 36, cx - 100, cy - 20, col, col.s[0], 5); line2(ctx, cx + 54, cy - 36, cx + 100, cy - 20, col, col.s[0], 5);
      if (step === 4) { arrow(ctx, cx, cy + 90, cx, cy + 30, col.s[3], 2.5, 8); dot(ctx, cx, cy + 20, 7, col.s[3], col.ink); L('embryo with up to 8 blastomeres: into the fallopian tube (ZIFT)', cx, cy + 110, 'center', col.ink); L('embryo with more than 8 cells: into the uterus (IUT)', cx, cy + 126, 'center', col.ink); }
      else { dot(ctx, cx, cy - 20, 8, col.s[3], col.ink); ctx.beginPath(); ctx.arc(cx, cy - 20, 18, 0, 7); ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.stroke(); L('implants in the uterine wall; the foetus grows as in a natural pregnancy', cx, cy + 78, 'center', col.ink); L('Used when the tubes are blocked, sperm are few, or other methods failed.', cx, cy + 96, 'center', col.muted, 10); }
    }
  };
  function line2(ctx, x0, y0, x1, y1, col, c = col.ink, wd = 2) { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.strokeStyle = c; ctx.lineWidth = wd; ctx.stroke(); }
  cv.redraw();
  return { step(i) { step = Math.min(i, 5); cv.redraw(); } };
}
