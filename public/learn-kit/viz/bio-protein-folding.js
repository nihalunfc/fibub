// The four levels of protein structure as a step player: a chain of amino acids (primary), local coils and pleats held by
// hydrogen bonds (secondary: α-helix and β-pleated sheet), folding of the whole chain into a 3D shape (tertiary, held by
// R-group interactions, disulphide bonds), and several chains together (quaternary, like haemoglobin with 4).
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NAMES = ['1. Primary: the amino acid sequence', '2. Secondary: helix and pleated sheet', '3. Tertiary: folded 3D chain', '4. Quaternary: several chains'];
const TXT = ['Amino acids joined by peptide bonds in an order set by the gene. Change one amino acid and the protein may change (sickle-cell: Glu → Val).', 'Regular shapes formed by hydrogen bonds between backbone C=O and N–H: the α-helix and the β-pleated sheet.', 'The whole chain folds into a compact shape held by hydrogen bonds, ionic bonds, hydrophobic packing and disulphide bridges. The shape decides the function (an enzyme\'s active site).', 'Two or more folded chains (subunits) assemble: haemoglobin has 4 (2α + 2β), each carrying a haem group.'];
const N = 24;

export default function (host) {
  return stepper(host, { aspect: 0.95, max: 420, min: 330, stages: 4, label: 'A chain of amino acids folding up through the four levels of protein structure' }, (ctx, w, h, col, st, k, t, pv) => {
    title(ctx, NAMES[st], col);
    // positions of bead i per stage
    const cx = w / 2, cy = 150;
    const pos = (i, s) => {
      const f = i / (N - 1);
      if (s === 0) return [mix(18, w - 18, f), cy + (i % 2 ? 7 : -7) + Math.sin(i) * 0];
      if (s === 1) { if (f < 0.5) return [mix(26, w * 0.48, f * 2), cy - 6 + Math.sin(f * 2 * 22) * 18 * (1) * 0.9 * (f < 0.5 ? 1 : 0) + 0]; const g = (f - 0.5) * 2; return [mix(w * 0.55, w - 24, g), cy + (i % 2 ? 18 : -18) * 0.8]; }
      const a = f * Math.PI * 3.1, r = 50 + 42 * Math.sin(f * 7); if (s === 2) return [cx + Math.cos(a) * r * 0.9 + Math.sin(f * 11) * 12, cy + Math.sin(a) * r * 0.62];
      return [0, 0];
    };
    const draw1 = (ox, oy, sc, c, s, a) => {
      const P = Array.from({ length: N }, (_, i) => { const p = pos(i, s); return [ox + (p[0] - cx) * sc, oy + (p[1] - cy) * sc]; });
      ctx.globalAlpha = a; ctx.strokeStyle = c; ctx.lineWidth = 3 * Math.max(0.8, sc); ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      P.forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, 5 * Math.max(0.7, sc), 0, 7); ctx.fillStyle = col.s[i % 8]; ctx.fill(); });
      ctx.globalAlpha = 1; return P;
    };
    if (st < 3 && pv < 3) {
      const sPrev = Math.min(pv, 2), sNow = Math.min(st, 2);
      // interpolate bead positions between the previous and current level
      const P = Array.from({ length: N }, (_, i) => { const a = pos(i, sPrev), b = pos(i, sNow); return [mix(a[0], b[0], k), mix(a[1], b[1], k)]; });
      ctx.strokeStyle = col.muted; ctx.lineWidth = 3; ctx.beginPath(); P.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
      P.forEach(([x, y], i) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fillStyle = col.s[i % 8]; ctx.fill(); });
      if (sNow === 1) { text(ctx, 'α-helix', w * 0.25, cy - 40, { color: col.ink, size: 11, weight: 700, align: 'center' }); text(ctx, 'β-pleated sheet', w * 0.77, cy - 40, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
      if (sNow === 2 && k > 0.8) { ctx.strokeStyle = col.bad; ctx.lineWidth = 2; ctx.setLineDash([3, 3]); const d = [[3, 17], [8, 21]]; d.forEach(([a, b]) => { ctx.beginPath(); ctx.moveTo(P[a][0], P[a][1]); ctx.lineTo(P[b][0], P[b][1]); ctx.stroke(); }); ctx.setLineDash([]); text(ctx, 'S–S bridge', P[3][0] - 6, P[3][1] - 14, { color: col.bad, size: 10, weight: 700, align: 'right', fit: true }); }
    } else {
      const cols = [col.s[0], col.s[2], col.s[0], col.s[2]];
      [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].forEach(([dx, dy], i) => draw1(cx + dx * w * 0.5, 138 + dy * 100, 0.4, cols[i], 2, st === 3 ? k : 1 - k));
      if (st === 3) { text(ctx, 'α', cx - w * 0.25, 58, { color: col.s[0], size: 12, weight: 700, align: 'center' }); text(ctx, 'β', cx + w * 0.25, 58, { color: col.s[2], size: 12, weight: 700, align: 'center' }); text(ctx, '4 subunits: haemoglobin', cx, 138, { color: col.ink, size: 11, weight: 700, align: 'center' }); }
    }
    wrap(ctx, TXT[st], w / 2, h - 84, w - 24, { color: col.ink, size: 10.5, lh: 13 });
  });
}
