// Class 11 Biology, Animal Kingdom: germ layers. A fertilised egg divides (cleavage) into a hollow ball (blastula); one side folds in (gastrulation) to make an outer ectoderm and an inner endoderm.
// Diploblastic animals (Cnidaria) stop at two layers; triploblastic animals add a middle mesoderm, and in coelomates a cavity opens inside it. Step player (6 steps).
import { canvas, text, title } from '../../kit.js';
import { ell, note } from '../c11b-lib.js';

const T = ['1. Zygote', '2. Cleavage', '3. Blastula', '4. Gastrulation', '5. Diploblastic: two layers', '6. Triploblastic + coelom'];
const N = ['The fertilised egg, a single diploid cell.', 'It divides again and again by mitosis into a ball of smaller cells, with no growth in size.', 'The ball becomes hollow: a blastula, with a fluid-filled space inside.', 'One side of the blastula folds inwards. The cells now form an outer layer (ectoderm) and an inner layer (endoderm) around a new gut cavity.', 'Cnidarians such as Hydra have only these two layers, with jelly between them: diploblastic.', 'Most animals add a third, middle layer (mesoderm). In coelomates a cavity, the coelom, opens inside the mesoderm. Ectoderm makes skin and nerves; mesoderm muscle, bone, blood; endoderm the gut lining.'];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 300, label: 'Steps from zygote to blastula to two-layered and three-layered embryo' });
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, T[s], col), cx = w / 2, cy = y0 + 92, R = 62;
    if (s === 0) ell(ctx, cx, cy, R * 0.55, R * 0.55, col.s[0], col.ink, 2, 0.5);
    if (s === 1) { const n = 8; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n, dx = Math.cos(a) * R * 0.38, dy = Math.sin(a) * R * 0.38; ell(ctx, cx + dx, cy + dy, R * 0.3, R * 0.3, col.s[0], col.ink, 1.5, 0.5); } ell(ctx, cx, cy, R * 0.28, R * 0.28, col.s[0], col.ink, 1.5, 0.5); }
    if (s === 2) { const n = 16; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n; ell(ctx, cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8, 9, 9, col.s[0], col.ink, 1.3, 0.55); } text(ctx, 'hollow space', cx, cy, { color: col.muted, size: 11, align: 'center' }); }
    if (s >= 3) {
      const n = 16, fold = s === 3 ? 0.5 : 1;
      for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n, bottom = Math.sin(a) > 0.5; let x = Math.cos(a) * R * 0.8, y = Math.sin(a) * R * 0.8; if (bottom) y = y - (Math.sin(a) * R * 0.8 * 2 - R * 0.45) * fold * (Math.sin(a) > 0.9 ? 1 : 0.7); const endo = bottom; ell(ctx, cx + x, cy + y, 9, 9, endo ? col.s[3] : col.s[0], col.ink, 1.3, 0.6); }
      if (s === 3) { text(ctx, 'folds in', cx, cy + R + 22, { color: col.s[3], size: 11, weight: 700, align: 'center' }); text(ctx, 'ectoderm', cx - R - 6, cy - 12, { color: col.s[0], size: 10.5, weight: 700, align: 'right' }); }
    }
    if (s === 4) { ctx.clearRect(0, 0, 0, 0); ell(ctx, cx, cy, R * 0.9, R * 0.9, col.panel, col.ink, 0, 1); ell(ctx, cx, cy, R * 0.95, R * 0.95, col.s[0], col.ink, 2, 0.35); ell(ctx, cx, cy, R * 0.75, R * 0.75, col.panel, col.ink, 0, 1); ell(ctx, cx, cy, R * 0.75, R * 0.75, null, col.s[3], 6); ell(ctx, cx, cy, R * 0.55, R * 0.55, col.soft, col.ink, 1, 1); ell(ctx, cx, cy, R * 0.88, R * 0.88, null, col.s[4], 5); text(ctx, 'gut', cx, cy, { color: col.ink, size: 11, align: 'center', weight: 700 }); text(ctx, 'ectoderm', cx + R + 6, cy - 22, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'jelly', cx + R + 6, cy, { color: col.s[4], size: 10.5, weight: 700 }); text(ctx, 'endoderm', cx + R + 6, cy + 22, { color: col.s[3], size: 10.5, weight: 700 }); }
    if (s === 5) { ell(ctx, cx, cy, R * 0.98, R * 0.98, col.s[0], col.ink, 2.5, 0.4); ell(ctx, cx, cy, R * 0.8, R * 0.8, col.panel, null, 0, 1); ell(ctx, cx, cy, R * 0.8, R * 0.8, null, col.s[2], 9); ell(ctx, cx, cy, R * 0.55, R * 0.55, col.panel, null, 0, 1); ell(ctx, cx, cy, R * 0.58, R * 0.58, null, col.s[2], 9); ell(ctx, cx, cy, R * 0.42, R * 0.42, col.s[3], col.ink, 1.5, 0.45); text(ctx, 'coelom (cavity)', cx + R + 6, cy - 44, { color: col.muted, size: 10.5, weight: 700 }); text(ctx, 'gut', cx, cy, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'ectoderm', cx + R + 6, cy - 22, { color: col.s[0], size: 10.5, weight: 700 }); text(ctx, 'mesoderm', cx + R + 6, cy, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'endoderm', cx + R + 6, cy + 22, { color: col.s[3], size: 10.5, weight: 700 }); }
    note(ctx, N[s], 12, h - 82, w - 24, col, { size: 10.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 5); cv.redraw(); } };
}
