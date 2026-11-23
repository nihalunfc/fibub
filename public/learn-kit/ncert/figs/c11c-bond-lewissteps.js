// Class 11 Chemistry, Chemical Bonding (step player): drawing the Lewis structure of the carbonate ion CO3(2-) in five steps.
// Valence electrons: C 4 + 3 x O 6 + 2 for the charge = 24. Skeleton uses 6, octets on O use 18, carbon is two short, so one lone pair of O becomes a C=O double bond.
// Formal charge = valence electrons - lone-pair electrons - bonds: C 0, double-bonded O 0, each single-bonded O -1 (total -2).
import { canvas, text, title, dot } from '../../kit.js';

export default function (host) {
  let step = 0;
  const TITLES = ['Count the valence electrons', 'Skeleton: C in the middle, one bond to each O', 'Complete the octets of the outer atoms', 'Carbon is short: share a lone pair', 'Check the formal charges'];
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'Step by step Lewis structure of the carbonate ion' });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, TITLES[step], col);
    const cx = w / 2, cy = t0 + (h - t0) * 0.42, R = Math.min(w, h) * 0.26;
    const O = [[cx, cy - R], [cx - R * 0.87, cy + R * 0.5], [cx + R * 0.87, cy + R * 0.5]];
    const atom = (x, y, s, c) => { ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = c; ctx.stroke(); text(ctx, s, x, y, { color: c, size: 14, weight: 700, align: 'center' }); };
    const pairs = (x, y, dirs, c) => dirs.forEach((a) => { const px = x + Math.cos(a) * 25, py = y + Math.sin(a) * 25, nx = -Math.sin(a) * 4.5, ny = Math.cos(a) * 4.5; dot(ctx, px + nx, py + ny, 2.4, c); dot(ctx, px - nx, py - ny, 2.4, c); });
    if (step === 0) {
      const rows = [['C  4 × 1', 4], ['O  6 × 3', 18], ['charge 2−', 2]];
      rows.forEach((r, i) => { text(ctx, r[0] + ' = ' + r[1], 24, t0 + 40 + i * 30, { color: col.ink, size: 14 }); });
      text(ctx, 'Total = 4 + 18 + 2 = 24 electrons', 24, t0 + 140, { color: col.s[2], size: 15, weight: 700 });
      text(ctx, '= 12 pairs to place', 24, t0 + 168, { color: col.muted, size: 13 });
      text(ctx, 'A negative charge ADDS electrons.', 24, t0 + 198, { color: col.muted, size: 12 });
      return;
    }
    // bonds
    O.forEach((p, i) => { ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; const dbl = step >= 3 && i === 0; const nx = (p[1] - cy) / R * 3.5, ny = -(p[0] - cx) / R * 3.5; for (const s of dbl ? [-1, 1] : [0]) { ctx.beginPath(); ctx.moveTo(cx + nx * s, cy + ny * s); ctx.lineTo(p[0] + nx * s, p[1] + ny * s); ctx.stroke(); } });
    atom(cx, cy, 'C', col.ink);
    const away = O.map((p) => Math.atan2(p[1] - cy, p[0] - cx));
    O.forEach((p, i) => {
      atom(p[0], p[1], 'O', col.s[0]);
      if (step >= 2) { const a = away[i], n = step >= 3 && i === 0 ? 2 : 3, offs = n === 3 ? [-1.1, 0, 1.1] : [-0.75, 0.75]; pairs(p[0], p[1], offs.map((o) => a + o), col.s[0]); }
    });
    text(ctx, step === 1 ? 'bonds use 3 × 2 = 6 electrons, 18 left' : step === 2 ? 'lone pairs use 18 electrons; C has only 6 around it' : step === 3 ? 'now C has 8 electrons: 3 bonds + 1 extra from C=O' : 'formal charge = valence − lone-pair e⁻ − bonds', w / 2, h - 34, { color: col.muted, size: 11.5, align: 'center' });
    if (step === 2) text(ctx, 'C: octet not complete (6)', cx, cy + R * 0.95 + 26, { color: col.bad, size: 12, weight: 700, align: 'center' });
    if (step === 4) {
      text(ctx, '0', cx + 24, cy, { color: col.good, size: 13, weight: 700 });
      [['0', col.good], ['−1', col.bad], ['−1', col.bad]].forEach((q, i) => text(ctx, q[0], O[i][0] + Math.cos(away[i]) * 42, O[i][1] + Math.sin(away[i]) * 42, { color: q[1], size: 13, weight: 700, align: 'center' }));
      text(ctx, 'Sum: 0 + 0 − 1 − 1 = −2 ✓ matches the ion', w / 2, h - 14, { color: col.s[2], size: 12, weight: 700, align: 'center' });
    }
  };
  return { step(i) { step = Math.min(i, 4); cv.redraw(); } };
}
