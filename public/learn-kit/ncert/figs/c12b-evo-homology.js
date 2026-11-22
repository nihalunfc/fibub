// Class 12 Evolution: homologous and analogous structures. The forelimbs of a human, bat, whale and cheetah are built from the same bones (humerus, radius and ulna, carpals, metacarpals,
// phalanges) used for different jobs: homology, evidence of common ancestry (divergent evolution). Wings of a bird and an insect do the same job but have different structure: analogy (convergent evolution).
import { canvas, text, title, line, row, choice, readout } from '../../kit.js';

const BONES = ['humerus', 'radius + ulna', 'carpals', 'metacarpals', 'phalanges'];
const LIMBS = [
  ['Human', 'grasping', [4, 4, 1, 2.2, 2.2]],
  ['Bat', 'flying', [3.5, 5.2, 0.7, 5.5, 6]],
  ['Whale', 'swimming', [2, 1.6, 0.6, 1.4, 3]],
  ['Cheetah', 'running', [3.6, 3.8, 0.9, 3.4, 1.6]],
];
export default function (host) {
  let mode = 'homo';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Forelimb bones of four mammals in matching colours, or wings of a bird and an insect compared' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Compare', [['homo', 'Forelimbs (homologous)'], ['ana', 'Wings (analogous)']], mode, (v) => { mode = v; go(); });
  const go = () => { ro.textContent = mode === 'homo' ? 'Same five bone groups in the same order, but different lengths for different jobs. Same origin, different function: homologous organs, divergent evolution (adaptive radiation). Evidence for common ancestry.' : 'Both wings let an animal fly, but a bird wing is built on bones with feathers and an insect wing is a thin membrane braced by veins with no bones at all. Different origin, same function: analogous organs, convergent evolution. Other examples: the eye of an octopus and of a human; flippers of a penguin and a dolphin; sweet potato (root) and potato (stem).'; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, mode === 'homo' ? 'Same bones, different jobs' : 'Same job, different structure', col);
    if (mode === 'homo') {
      const sc = (w - 120) / 18, rowH = (h - t0 - 38) / 4;
      LIMBS.forEach(([name, job, len], r) => {
        const y = t0 + 14 + r * rowH + rowH / 2; let x = 84; text(ctx, name, 8, y - 6, { color: col.ink, size: 12, weight: 700 }); text(ctx, job, 8, y + 9, { color: col.muted, size: 10.5 });
        len.forEach((L, i) => { const th = i === 4 ? 7 : 10; ctx.fillStyle = col.s[i]; ctx.fillRect(x, y - th / 2, L * sc - 2, th); x += L * sc; });
      });
      BONES.forEach((b, i) => { const lw = (w - 20) / 5; ctx.fillStyle = col.s[i]; ctx.fillRect(10 + i * lw, h - 24, 10, 10); text(ctx, b, 24 + i * lw, h - 19, { color: col.muted, size: 9.5 }); });
    } else {
      const cx1 = w * 0.27, cx2 = w * 0.73, cy = t0 + 100;
      text(ctx, 'Bird wing', cx1, t0 + 20, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, 'Insect wing', cx2, t0 + 20, { color: col.ink, size: 12, weight: 700, align: 'center' });
      const bones = [[0, 0, 40, 6], [40, 6, 78, 18], [78, 18, 112, 6]];
      ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.25; ctx.beginPath(); ctx.moveTo(cx1 - 56, cy - 30); ctx.quadraticCurveTo(cx1, cy - 70, cx1 + 56, cy - 30); ctx.lineTo(cx1 + 56, cy + 30); ctx.quadraticCurveTo(cx1, cy + 8, cx1 - 56, cy + 30); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
      line(ctx, [[cx1 - 56, cy - 28], [cx1 - 10, cy - 6], [cx1 + 56, cy - 24]], col.s[0], 6); for (let k = 0; k < 6; k++) line(ctx, [[cx1 - 40 + k * 16, cy - 14 + (k % 2) * 3], [cx1 - 50 + k * 18, cy + 28]], col.s[0], 1.5);
      text(ctx, 'bones + feathers', cx1, cy + 54, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, '(a modified forelimb)', cx1, cy + 68, { color: col.muted, size: 10.5, align: 'center' });
      ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.3; ctx.beginPath(); ctx.ellipse(cx2, cy, 44, 20, -0.25, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 2; ctx.stroke();
      [[-28, -2], [-10, -8], [8, -12], [26, -16]].forEach(([dx, dy]) => line(ctx, [[cx2 - 40, cy + 4], [cx2 + dx + 14, cy + dy - 6]], col.s[3], 1.5));
      text(ctx, 'membrane + veins,', cx2, cy + 54, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, 'no bones inside', cx2, cy + 68, { color: col.muted, size: 10.5, align: 'center' });
      text(ctx, 'both can fly', w / 2, cy + 110, { color: col.ink, size: 12, weight: 700, align: 'center' });
    }
  };
  go();
}
