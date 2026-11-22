// Class 10 How do Organisms Reproduce? (step player): from fertilisation to birth. Sperm meet the egg in the oviduct; the zygote
// divides into a ball of cells that travels to the uterus and implants; the placenta (a disc rich in blood vessels,
// with villi) lets food and oxygen pass from mother to embryo and wastes pass back, while the two blood supplies stay
// separate. Pregnancy lasts about nine months (40 weeks).
import { canvas, text, title, line, dot, loop } from '../../kit.js';

export default function (host) {
  let step = 0, t = 0;
  const cv = canvas(host, { aspect: 0.92, max: 440, min: 300, label: 'From fertilisation in the oviduct to the baby growing in the uterus' });
  const TITLES = ['Fertilisation in the oviduct', 'The zygote divides as it travels', 'Implantation in the uterus lining', 'The placenta forms', 'The embryo becomes a foetus', 'Birth after about 9 months'];
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const ell = (ctx, x, y, rx, ry, f, s, lw = 1.8) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, cx = w / 2, ucy = top + (h - top) * 0.52, uw = step >= 4 ? 92 : 72, uh = step >= 4 ? 100 : 78;
    // uterus
    ctx.beginPath(); ctx.ellipse(cx, ucy, uw, uh, 0, 0, 7); ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.ink; ctx.lineWidth = 2.2; ctx.stroke();
    if (step <= 1) { // oviduct picture
      line(ctx, [[cx - uw - 10, top + 30], [cx - 30, top + 40], [cx, ucy - uh + 8]], col.ink, 4);
      if (step === 0) { const ex = cx - uw * 0.9; ell(ctx, ex + 10, top + 40, 12, 12, col.s[3], col.ink); for (let i = 0; i < 5; i++) { const a = t * 3 + i * 1.3; dot(ctx, ex - 24 + i * 6 + Math.sin(a) * 4, top + 30 + (i % 3) * 8 + Math.cos(a) * 3, 1.8, col.s[7]); } text(ctx, 'egg + sperm', ex + 24, top + 62, { color: col.muted, size: 10, align: 'left' }); text(ctx, 'zygote', ex + 20, top + 26, { color: col.ink, size: 10.5, weight: 700, align: 'left' }); }
      else { const f = Math.min(1, t / 6); const pos = [[cx - uw - 6, top + 32], [cx - 60, top + 38], [cx - 20, top + 52], [cx, ucy - uh * 0.3]], seg = f * 3, a = Math.min(2, Math.floor(seg)), u = seg - a, bx = pos[a][0] + (pos[a + 1][0] - pos[a][0]) * u, by = pos[a][1] + (pos[a + 1][1] - pos[a][1]) * u, nn = f < 0.25 ? 2 : f < 0.5 ? 4 : f < 0.75 ? 8 : 16; for (let i = 0; i < nn; i++) { const a_ = i / nn * 6.28 + 0.5, rr = nn === 2 ? 5 : 8; dot(ctx, bx + Math.cos(a_) * (nn === 2 ? 5 : 7), by + Math.sin(a_) * (nn === 2 ? 5 : 7), 5 - (nn > 8 ? 1.5 : nn > 2 ? 0.5 : 0), col.s[3], col.ink); } text(ctx, `${nn} cells`, bx + 14, by + 22, { color: col.ink, size: 10.5, weight: 700, align: 'left' }); }
    }
    if (step >= 2) { ctx.fillStyle = col.s[4]; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(cx, ucy, uw - 6, uh - 6, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ell(ctx, cx, ucy, uw - 14, uh - 14, col.panel, null); text(ctx, 'thick lining', cx, ucy + uh + 12, { color: col.muted, size: 10, align: 'center' }); }
    if (step === 2) { dot(ctx, cx, ucy - uh + 22 + Math.min(1, t / 2) * 6, 8, col.s[3], col.ink); text(ctx, 'ball of cells sinks into the lining', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' }); }
    if (step >= 3) {
      const g = step === 3 ? Math.min(1, t / 2.5) : 1, fs = step === 3 ? 0.35 : step === 4 ? 0.6 : 0.85;
      // placenta on top wall
      ctx.fillStyle = col.s[7]; ctx.globalAlpha = 0.55; ctx.beginPath(); ctx.ellipse(cx, ucy - uh + 22, 40 * g, 11, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; for (let i = -3; i <= 3; i++) line(ctx, [[cx + i * 9 * g, ucy - uh + 26], [cx + i * 9 * g, ucy - uh + 34]], col.s[7], 2);
      text(ctx, 'placenta', cx + 48, ucy - uh + 14, { color: col.ink, size: 10, align: 'left' });
      // cord and foetus
      line(ctx, [[cx, ucy - uh + 30], [cx - 6, ucy - uh + 50 + 10 * fs], [cx + 4, ucy - uh + 70 + 14 * fs]], col.s[7], 2.4);
      const fy = ucy + 8, rr = 42 * fs; ell(ctx, cx + 2, fy, rr * 0.8, rr, col.s[3], col.ink, 1.6); ell(ctx, cx + 2, fy - rr - 8 * fs, 12 * fs, 12 * fs, col.s[3], col.ink, 1.6);
      if (step >= 4) { line(ctx, [[cx - rr * 0.6, fy - rr * 0.3], [cx - rr * 1.1, fy + rr * 0.4]], col.ink, 2); line(ctx, [[cx + rr * 0.6, fy - rr * 0.3], [cx + rr * 1.1, fy + rr * 0.4]], col.ink, 2); }
      if (step === 3) { for (let i = 0; i < 4; i++) { const f = (t * 0.5 + i / 4) % 1; dot(ctx, cx + 20 - f * 20 + Math.sin(i) * 6, ucy - uh + 36 + f * 30, 2.2, i % 2 ? col.s[0] : col.s[7]); } text(ctx, 'food and oxygen in; wastes out (blood stays separate)', w / 2, h - 36, { color: col.muted, size: 10, align: 'center' }); }
    }
    if (step === 5) { text(ctx, 'about 40 weeks', w / 2, h - 36, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    text(ctx, ['Fertilisation forms the zygote, usually in the oviduct.', 'Cells divide again and again: 2, 4, 8, 16...', 'This is the start of pregnancy.', 'The placenta is a disc rich in blood vessels with villi.', 'Week 8 onward: the embryo is called a foetus.', 'The muscles of the uterus push the baby out.'][step], w / 2, h - 14, { color: col.muted, size: 10, align: 'center' });
  };
  return { step(i) { step = Math.min(i, 5); t = 0; cv.redraw(); } };
}
