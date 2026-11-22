// Class 12 Biology, Human Reproduction: a seminiferous tubule cut across. Spermatogonia (2n) at the wall divide by mitosis; some become primary
// spermatocytes (2n) that undergo meiosis I to secondary spermatocytes (n), meiosis II to spermatids (n), and spermiogenesis makes sperm that are
// released into the lumen. Sertoli cells nurse the germ cells; Leydig cells between tubules make testosterone under LH; FSH acts on Sertoli cells.
import { canvas, text, title, dot, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let stage = 4, view = 'cells';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Cross-section of a seminiferous tubule with germ cells in rings from the wall to the lumen, or the hormones that control it' });
  const ctl = row(host), ro = readout(host);
  const NAMES = ['spermatogonium (2n)', 'primary spermatocyte (2n)', 'secondary spermatocyte (n)', 'spermatid (n)', 'sperm (n)'];
  const INFO = ['Spermatogonia sit against the wall and divide by mitosis, keeping their number up. They are diploid (2n = 46).', 'Some grow into primary spermatocytes (2n = 46) that start meiosis I.', 'Meiosis I makes two haploid secondary spermatocytes (n = 23, each chromosome still of two chromatids).', 'Meiosis II gives four haploid spermatids (n = 23).', 'Spermiogenesis: spermatids grow tails and become sperm. Spermiation releases them into the lumen of the tubule.'];
  slider(ctl, { label: 'stage', min: 0, max: 4, step: 1, value: 4, fmt: (v) => NAMES[Math.round(v)].split(' (')[0], oninput: (v) => { stage = Math.round(v); go(); } });
  choice(ctl, 'View', [['cells', 'Cells'], ['hormones', 'Hormones']], 'cells', (v) => { view = v; go(); });
  const go = () => { ro.textContent = view === 'cells' ? INFO[stage] : 'LH acts on Leydig cells, which make androgens (testosterone) that drive spermatogenesis. FSH acts on Sertoli cells, which help the spermatogenic cells to mature. Both come from the anterior pituitary, under GnRH from the hypothalamus.'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, view === 'cells' ? 'Seminiferous tubule in cross-section' : 'Hormone control of the testis', col) + 4;
    if (view === 'hormones') {
      const bx = (x, y, s, f) => { const bw = Math.min(150, w * 0.4); ctx.fillStyle = f; ctx.fillRect(x - bw / 2, y - 14, bw, 28); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x - bw / 2, y - 14, bw, 28); text(ctx, s, x, y, { color: col.ink, size: 10.5, weight: 600, align: 'center' }); };
      const ar = (x0, y0, x1, y1, s) => { ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.beginPath(); ctx.arc(x1, y1, 2.5, 0, 7); ctx.fillStyle = col.muted; ctx.fill(); if (s) text(ctx, s, (x0 + x1) / 2 + 6, (y0 + y1) / 2, { color: col.s[3], size: 10.5, weight: 700, halo: col.panel }); };
      const ys = top + 26, yp = top + 90, yl = top + 170, c1 = w * 0.28, c2 = w * 0.72;
      bx(w / 2, ys, 'Hypothalamus', col.soft); ar(w / 2, ys + 14, w / 2, yp - 14, 'GnRH'); bx(w / 2, yp, 'Anterior pituitary', col.soft);
      ar(w / 2 - 20, yp + 14, c1, yl - 14, 'LH'); ar(w / 2 + 20, yp + 14, c2, yl - 14, 'FSH');
      bx(c1, yl, 'Leydig cells', col.s[3]); bx(c2, yl, 'Sertoli cells', col.s[0]);
      ar(c1, yl + 14, c1, yl + 64, 'testosterone'); ar(c2, yl + 14, c2, yl + 64, 'helps sperm mature');
      bx(w / 2, yl + 84, 'Spermatogenesis', col.s[2]); text(ctx, 'Testosterone also gives male features and feeds back on the pituitary.', w / 2, h - 12, { color: col.muted, size: 10, align: 'center' });
      return;
    }
    const cx = w / 2, cy = top + (h - top) / 2, R = Math.min(w * 0.36, (h - top) / 2 - 52), rings = [0.9, 0.73, 0.58, 0.44, 0.26];
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = col.soft; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = col.ink; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.18, 0, 7); ctx.fillStyle = col.panel; ctx.fill();
    for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283 + 0.2; const x = cx + Math.cos(a) * (R + 14), y = cy + Math.sin(a) * (R + 14); ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[3]; ctx.fill(); ctx.globalAlpha = 1; }
    for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * R * 0.97, cy + Math.sin(a) * R * 0.97); ctx.lineTo(cx + Math.cos(a - 0.1) * R * 0.45, cy + Math.sin(a - 0.1) * R * 0.45); ctx.lineWidth = 3; ctx.strokeStyle = col.s[7]; ctx.globalAlpha = 0.45; ctx.stroke(); ctx.globalAlpha = 1; }
    const cnt = [26, 18, 14, 14, 12], rad = [4.5, 7, 5.5, 4, 2.5], colr = [col.s[5], col.s[1], col.s[2], col.s[4], col.s[0]];
    for (let s = 0; s < 5; s++) { const on = s <= stage; for (let k = 0; k < cnt[s]; k++) { const a = (k + (s % 2) * 0.5) / cnt[s] * 6.283; const x = cx + Math.cos(a) * R * rings[s], y = cy + Math.sin(a) * R * rings[s]; ctx.globalAlpha = on ? 1 : 0.15; if (s === 4) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(cx + Math.cos(a) * R * 0.1, cy + Math.sin(a) * R * 0.1); ctx.strokeStyle = colr[s]; ctx.lineWidth = 1; ctx.stroke(); } dot(ctx, x, y, rad[s] * Math.min(1, R / 130 + 0.4), colr[s], on ? col.ink : null); } }
    ctx.globalAlpha = 1;
    text(ctx, 'orange dots outside = Leydig cells (make testosterone)', cx, h - 24, { color: col.s[3], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'pink spokes = Sertoli cells (nurse the germ cells)', cx, h - 8, { color: col.s[7], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'lumen', cx, cy, { color: col.muted, size: 10, align: 'center' });
    text(ctx, `${NAMES[stage]}`, cx, top + 10, { color: colr[stage], size: 11, weight: 700, align: 'center' });
  };
  go();
}
