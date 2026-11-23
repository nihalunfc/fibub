// Class 11 Structural Organisation in Animals: connective tissue. Cells are scattered in a matrix (a fluid, jelly or solid) that the cells make. What the matrix is made of decides the job:
// loose (areolar) packing, adipose fat store, dense tendon, cartilage cushion, bone with calcium salts, and blood with liquid plasma.
import { canvas, text, title, row, choice, rng } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const T = {
  lo: ['Loose (areolar)', 'Cells and thin fibres scattered in a jelly-like matrix. Packs between organs and under the skin; fibroblasts make the fibres, macrophages eat germs.'],
  ad: ['Adipose', 'Fat cells with one big droplet that pushes the nucleus to the edge. Stores energy, insulates and cushions (under the skin, round the kidneys).'],
  de: ['Dense regular', 'Fibres packed in parallel rows with rows of fibroblasts between them. Tendons join muscle to bone; ligaments join bone to bone. Strong in one direction.'],
  ca: ['Cartilage', 'Cells (chondrocytes) sit in small spaces (lacunae) in a firm, flexible matrix. Nose tip, ear flap, windpipe rings, ends of bones, discs of the backbone.'],
  bo: ['Bone', 'Hard matrix of calcium salts and collagen arranged in rings round canals that hold blood vessels; osteocytes sit in lacunae. Gives support and protects organs.'],
  bl: ['Blood', 'A fluid connective tissue: plasma matrix (about 55 %) with red cells (carry oxygen), white cells (defence) and platelets (clotting).'],
};
export default function (host) {
  let k = 'lo';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Drawings of six connective tissues: loose, adipose, dense, cartilage, bone and blood' });
  const ctl = row(host);
  choice(ctl, 'Tissue', Object.entries(T).map(([v, a]) => [v, a[0].replace(' (areolar)', '')]), k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[k][0] + ' connective tissue', col), fy = footer(ctx, w, h, col, T[k][1]);
    const x0 = 14, y0 = t0 + 8, W = w - 28, H = fy - y0 - 8, g = rng(k.charCodeAt(0) * 7 + k.charCodeAt(1));
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, W, H); ctx.clip();
    ctx.fillStyle = k === 'bl' ? col.s[3] + '33' : col.soft; ctx.fillRect(x0, y0, W, H);
    const rd = (n) => Array.from({ length: n }, () => [x0 + g() * W, y0 + g() * H]);
    if (k === 'lo') {
      ctx.lineWidth = 1.2; for (let i = 0; i < 26; i++) { ctx.strokeStyle = col.s[1]; const x = x0 + g() * W, y = y0 + g() * H, a = g() * 6.28; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a) * 40, y + Math.sin(a) * 40 + 15, x + Math.cos(a) * 80, y + Math.sin(a) * 60); ctx.stroke(); }
      rd(6).forEach(([x, y]) => { ellipse(ctx, x, y, 8, 5, col.s[0], col.ink, 1, g() * 3); }); rd(3).forEach(([x, y]) => ellipse(ctx, x, y, 11, 11, col.s[3], col.ink, 1));
      text(ctx, 'fibroblast', x0 + 8, y0 + 12, { color: col.ink, size: 10, halo: col.soft }); text(ctx, 'macrophage (round)', x0 + W - 8, y0 + H - 10, { color: col.ink, size: 10, align: 'right', halo: col.soft });
    } else if (k === 'ad') {
      const s = Math.max(30, Math.min(40, W / 8));
      for (let r = 0; r * s * 0.85 < H + s; r++) for (let c = 0; c * s < W + s; c++) { const x = x0 + s / 2 + c * s + (r % 2 ? s / 2 : 0), y = y0 + s / 2 + r * s * 0.85; ellipse(ctx, x, y, s / 2 - 1, s / 2 - 1, col.panel, col.s[3], 1.2); ellipse(ctx, x + s * 0.34, y, 3, 5, col.s[0]); }
      text(ctx, 'fat droplet', x0 + W / 2, y0 + H / 2, { color: col.ink, size: 10.5, halo: col.panel, align: 'center' });
    } else if (k === 'de') {
      for (let r = 0; r < 14; r++) { const y = y0 + 8 + r * H / 14; ctx.strokeStyle = r % 4 === 3 ? col.s[0] : col.s[1]; ctx.lineWidth = r % 4 === 3 ? 0 : 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + W, y); ctx.stroke(); }
      for (let r = 3; r < 14; r += 4) for (let c = 0; c < 5; c++) ellipse(ctx, x0 + 26 + c * (W - 40) / 4, y0 + 8 + r * H / 14, 9, 3.5, col.s[0], col.ink, 1);
      text(ctx, 'parallel collagen fibres (white)', x0 + W / 2, y0 + 14, { color: col.ink, size: 10.5, halo: col.soft, align: 'center' });
    } else if (k === 'ca') {
      ctx.fillStyle = col.s[0] + '33'; ctx.fillRect(x0, y0, W, H);
      const pts = [[0.2, 0.25], [0.28, 0.3], [0.6, 0.2], [0.68, 0.28], [0.35, 0.65], [0.43, 0.7], [0.75, 0.6], [0.2, 0.8]];
      pts.forEach(([a, b], i) => { const x = x0 + a * W, y = y0 + b * H; ellipse(ctx, x, y, 13, 10, col.panel, col.s[0], 1.5); ellipse(ctx, x, y, 7, 5.5, col.s[0], null); });
      text(ctx, 'lacuna with a chondrocyte', x0 + W / 2, y0 + H - 12, { color: col.ink, size: 10.5, halo: col.soft, align: 'center' });
    } else if (k === 'bo') {
      const cx = x0 + W / 2, cy = y0 + H / 2, R = Math.min(W, H) * 0.44;
      for (let i = 1; i <= 5; i++) ellipse(ctx, cx, cy, R * i / 5, R * i / 5, null, col.s[3], 6);
      for (let i = 1; i <= 5; i++) ellipse(ctx, cx, cy, R * i / 5 - 4, R * i / 5 - 4, null, col.line, 1);
      for (let i = 2; i <= 5; i++) for (let j = 0; j < 4 + i; j++) { const a = j / (4 + i) * 6.28 + i; ellipse(ctx, cx + Math.cos(a) * (R * i / 5 - 3), cy + Math.sin(a) * (R * i / 5 - 3), 3.5, 2.2, col.s[0], null); }
      ellipse(ctx, cx, cy, R * 0.18, R * 0.18, col.s[1], col.ink, 1.5);
      text(ctx, 'central canal (vessels)', cx, cy + R + 10, { color: col.ink, size: 10.5, halo: col.soft, align: 'center' });
    } else {
      const g2 = rng(9);
      for (let i = 0; i < 40; i++) { const x = x0 + g2() * W, y = y0 + g2() * H; ellipse(ctx, x, y, 9, 4.5, col.s[4], col.bad ?? col.s[4], 1.2, g2() * 3); ellipse(ctx, x, y, 3, 1.5, col.soft); }
      for (let i = 0; i < 4; i++) { const x = x0 + g2() * W, y = y0 + g2() * H; ellipse(ctx, x, y, 12, 12, col.panel, col.s[0], 2); ellipse(ctx, x, y, 7, 6, col.s[0]); }
      for (let i = 0; i < 12; i++) ellipse(ctx, x0 + g2() * W, y0 + g2() * H, 2.5, 2.5, col.s[1]);
      text(ctx, 'red cells', x0 + 10, y0 + 12, { color: col.ink, size: 10, halo: col.soft }); text(ctx, 'white cell', x0 + W - 8, y0 + 12, { color: col.ink, size: 10, align: 'right', halo: col.soft }); text(ctx, 'platelets (small dots)', x0 + W / 2, y0 + H - 10, { color: col.ink, size: 10, align: 'center', halo: col.soft });
    }
    ctx.restore();
  };
}
