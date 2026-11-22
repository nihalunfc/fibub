// From zygote to implantation as a step player: fertilisation in the ampulla of the fallopian tube, cleavage divisions
// (2, 4, 8 cells), the morula, the blastocyst (trophoblast and inner cell mass) and implantation in the uterine wall.
// The embryo travels toward the uterus while it divides without growing in size.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Fertilisation: zygote', '2. Cleavage: 2 then 4 cells', '3. 8 to 16 cells: morula', '4. Blastocyst', '5. Implantation'];
const TXT = ['Sperm and ovum fuse in the ampulla of the fallopian tube: one diploid cell, the zygote.', 'Mitotic divisions (cleavage) split the zygote into smaller and smaller cells with no growth in total size; the embryo moves toward the uterus by cilia and muscle.', 'A solid ball of 8 to 16 cells, the morula (about 4 days), reaches the uterus.', 'Fluid forms a cavity: the blastocyst has an outer trophoblast and an inner cell mass (becomes the embryo).', 'The trophoblast sticks to and sinks into the endometrium (about day 7): implantation, and pregnancy begins.'];

export default function (host) {
  return stepper(host, { aspect: 0.95, max: 430, min: 340, stages: 5, label: 'The embryo from zygote to implantation, travelling toward the uterus' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    // tube and uterus path from left (ovary side) to right (uterus)
    ctx.strokeStyle = col.s[3]; ctx.globalAlpha = 0.35; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(24, 110); ctx.quadraticCurveTo(w * 0.36, 70, w * 0.55, 120); ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.18; ctx.beginPath(); ctx.moveTo(w * 0.5, 110); ctx.lineTo(w - 12, 110); ctx.lineTo(w - 12, h * 0.62); ctx.lineTo(w * 0.5, h * 0.62); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = col.s[1]; ctx.globalAlpha = 0.3; ctx.fillRect(w * 0.5, h * 0.55, w * 0.5 - 12, 14); ctx.globalAlpha = 1; text(ctx, 'uterus wall (endometrium)', w - 14, h * 0.55 + 28, { color: col.s[1], size: 10, weight: 700, align: 'right' });
    text(ctx, 'fallopian tube', 16, 62, { color: col.s[3], size: 10, weight: 700, fit: false });
    // embryo position by stage
    const X = [34, w * 0.22, w * 0.5, w * 0.66, w * 0.76], Y = [112, 95, 112, 140, h * 0.55 - 4];
    const x = mix(X[pv], X[st], k), y = mix(Y[pv], Y[st], k), R = 20;
    const cell = (cx, cy, r) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.3; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke(); };
    const embryo = (s, cx, cy) => {
      ctx.beginPath(); ctx.arc(cx, cy, R + 3, 0, 7); ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.stroke(); // zona pellucida
      if (s === 0) cell(cx, cy, R - 4);
      else if (s === 1) [[-8, -8], [8, -8], [-8, 8], [8, 8]].forEach(([a, b]) => cell(cx + a, cy + b, 9));
      else if (s === 2) for (let i = 0; i < 12; i++) { const a = i * 2.4, r = (i % 2 ? 7 : 13); cell(cx + Math.cos(a) * r * (i < 6 ? 0.55 : 1), cy + Math.sin(a) * r * (i < 6 ? 0.55 : 1), 5.5); }
      else { for (let i = 0; i < 16; i++) { const a = i / 16 * 2 * Math.PI; cell(cx + Math.cos(a) * (R - 3), cy + Math.sin(a) * (R - 3), 3.6); } ctx.beginPath(); ctx.ellipse(cx + 5, cy - 5, 9, 7, 0.6, 0, 7); ctx.fillStyle = col.s[5]; ctx.globalAlpha = 0.55; ctx.fill(); ctx.globalAlpha = 1; }
    };
    embryo(Math.min(3, st === 4 ? 3 : st), x, y);
    if (st === 3 || st === 4) { text(ctx, 'trophoblast', x - 8, y + R + 20, { color: col.s[0], size: 10, weight: 700, align: 'right', fit: false }); text(ctx, 'inner cell mass', x + 8, y - R - 14, { color: col.s[5], size: 10, weight: 700, align: 'left', fit: true }); }
    if (st === 0) text(ctx, 'zygote 2n', x + 26, y, { color: col.ink, size: 10.5, weight: 700, fit: false });
    // timeline
    const days = ['day 1', 'day 2 to 3', 'day 4', 'day 5', 'day 7'];
    text(ctx, days[st], 12, h * 0.72, { color: col.ink, size: 14, weight: 700 });
    wrap(ctx, TXT[st], w / 2, h - 56, w - 24, { color: col.ink, size: 11 });
  });
}
