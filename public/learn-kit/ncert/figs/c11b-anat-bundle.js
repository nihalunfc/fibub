// Class 11 Anatomy: how xylem and phloem are arranged in a vascular bundle. Radial (roots): they lie on different radii. Conjoint (stems, leaves): on the same radius,
// open if a cambium lies between them (dicot stems) and closed if not (monocot stems). Concentric: one tissue surrounds the other (amphivasal, amphicribral; some ferns).
import { canvas, text, title, row, choice } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const T = {
  rad: ['Radial', 'Xylem and phloem lie on different radii, with non-conducting tissue between. Found in roots.'],
  open: ['Conjoint, open', 'Xylem and phloem on the same radius with a cambium between them, so the bundle can add new tissue. Dicot stems; secondary growth is possible.'],
  clo: ['Conjoint, closed', 'Same radius but no cambium, so no secondary growth. Monocot stems, often with a sclerenchyma sheath.'],
  amv: ['Concentric: amphivasal', 'Xylem surrounds the phloem (for example Dracaena and Yucca, which are monocots).'],
  amc: ['Concentric: amphicribral', 'Phloem surrounds the xylem (some ferns such as Pteridium).'],
};
export default function (host) {
  let k = 'open';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Five arrangements of xylem and phloem in vascular bundles' });
  const ctl = row(host);
  choice(ctl, 'Bundle', Object.entries(T).map(([v, a]) => [v, a[0].replace('Concentric: ', 'Conc. ')]), k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[k][0] + ' bundle', col), fy = footer(ctx, w, h, col, T[k][1]);
    const cx = w / 2, cy = (t0 + fy) / 2 + 4, R = Math.min(w / 2 - 20, (fy - t0) / 2 - 12), X = col.s[0], P = col.s[2], C = col.s[5];
    const leg = (items) => items.forEach(([c, s], i) => { ctx.fillStyle = c; ctx.fillRect(12, t0 + 8 + i * 15, 9, 9); text(ctx, s, 26, t0 + 13 + i * 15, { color: col.ink, size: 10 }); });
    leg([[P, 'phloem'], [X, 'xylem']].concat(k === 'open' ? [[C, 'cambium']] : []));
    if (k === 'rad') {
      ellipse(ctx, cx, cy, R, R, col.soft, col.line, 1.5);
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; ctx.save(); ctx.translate(cx, cy); ctx.rotate(a); ctx.fillStyle = X; ctx.fillRect(0, -R * 0.1, R * 0.7, R * 0.2); ctx.restore(); ellipse(ctx, cx + Math.cos(a + Math.PI / 4) * R * 0.5, cy + Math.sin(a + Math.PI / 4) * R * 0.5, R * 0.17, R * 0.17, P, col.ink, 1); }
      text(ctx, 'xylem and phloem on different radii', cx, cy + R + 0, { color: col.muted, size: 10, align: 'center', fit: false });
    } else if (k === 'open' || k === 'clo') {
      const bw = R * 0.8, bh = R * 1.3;
      if (k === 'clo') ellipse(ctx, cx, cy, bw * 0.78, bh * 0.62, col.s[3], null);
      ellipse(ctx, cx, cy, bw * 0.7, bh * 0.54, col.soft, k === 'clo' ? col.ink : col.line, 1.5);
      ellipse(ctx, cx, cy - bh * 0.27, bw * 0.55, bh * 0.2, P, col.ink, 1);
      if (k === 'open') ellipse(ctx, cx, cy - bh * 0.02, bw * 0.55, bh * 0.06, C, null);
      [-1, 1].forEach((s) => ellipse(ctx, cx + s * bw * 0.32, cy + bh * 0.12, bw * 0.2, bh * 0.1, X, col.ink, 1));
      ellipse(ctx, cx, cy + bh * 0.36, bw * 0.08, bh * 0.05, X, col.ink, 1);
      text(ctx, 'towards skin', cx, cy - bh * 0.58, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'towards centre', cx, cy + bh * 0.6, { color: col.muted, size: 10, align: 'center' });
    } else {
      const outer = k === 'amv' ? X : P, inner = k === 'amv' ? P : X;
      ellipse(ctx, cx, cy, R * 0.85, R * 0.85, outer, col.ink, 1.5); ellipse(ctx, cx, cy, R * 0.45, R * 0.45, inner, col.ink, 1.5);
      text(ctx, k === 'amv' ? 'phloem inside, xylem round it' : 'xylem inside, phloem round it', cx, cy + R * 0.95, { color: col.muted, size: 10, align: 'center' });
    }
  };
}
