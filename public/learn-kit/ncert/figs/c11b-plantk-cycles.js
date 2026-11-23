// Class 11 Biology, Plant Kingdom: three kinds of life cycle. Every plant alternates between a haploid (n) gamete-making phase and a diploid (2n) spore-making phase; they differ in which phase is a big, many-celled body.
// Haplontic (Spirogyra): only the zygote is 2n. Diplontic (pine, mango): only the gametes are n. Haplo-diplontic: both are many-celled; the gametophyte dominates in a moss, the sporophyte in a fern.
import { canvas, text, title, row, choice, readout, loop } from '../../kit.js';
import { rr, ell } from '../c11b-lib.js';

const T = {
  hap: ['Haplontic: Spirogyra', 'The body is haploid. The zygote is the only diploid cell, and divides by meiosis at once. About 100 % of the life is n.', [1, 0.12, 0.12, 0.12, 0.3], 0.97],
  dip: ['Diplontic: pine, mango', 'The body is diploid. Only the gametes (and a tiny gametophyte inside the flower or cone) are haploid. Most of the life is 2n.', [0.12, 0.12, 0.12, 1, 0.3], 0.03],
  moss: ['Haplo-diplontic: moss', 'Both phases are many-celled. The leafy gametophyte (n) is the green, free-living plant; the sporophyte (2n) grows on it and depends on it.', [1, 0.12, 0.12, 0.5, 0.3], 0.72],
  fern: ['Haplo-diplontic: fern', 'Both are free-living. The big fern plant is the sporophyte (2n); the small heart-shaped prothallus is the gametophyte (n).', [0.35, 0.12, 0.12, 1, 0.3], 0.2],
};
export default function (host) {
  let k = 'moss', t = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'A plant life cycle ring with haploid and diploid stages and the share of life spent as haploid' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'Plant', [['hap', 'Spirogyra (alga)'], ['moss', 'Moss'], ['fern', 'Fern'], ['dip', 'Pine / mango']], k, (v) => { k = v; ro.textContent = T[k][1]; cv.redraw(); });
  ro.textContent = T[k][1];
  loop(host, (dt) => { t += dt * 0.35; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, T[k][0], col), cx = w / 2, R = Math.max(40, Math.min(w / 2 - 62, (h - y0 - 150) / 2)), cy = y0 + 40 + R, sz = T[k][2], N = col.s[0], D = col.s[3];
    // nodes: 0 gametophyte (n) top-left, 1 gametes (n) top-right, 2 zygote (2n) bottom-right, 3 sporophyte (2n) bottom-left, 4 spores (n) left
    const ang = [-1.571, -0.314, 0.942, 2.199, 3.456], P = ang.map((a) => [cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    const names = ['gametophyte', 'gametes', 'zygote', 'sporophyte', 'spores'], ploidy = ['n', 'n', '2n', '2n', 'n'];
    for (let i = 0; i < 5; i++) { const [a, b] = P[i], [c, d] = P[(i + 1) % 5]; ctx.strokeStyle = col.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
    text(ctx, 'fusion', (P[1][0] + P[2][0]) / 2 + 6, (P[1][1] + P[2][1]) / 2, { color: col.muted, size: 10, align: 'left' }); text(ctx, 'meiosis', (P[3][0] + P[4][0]) / 2 - 6, (P[3][1] + P[4][1]) / 2 + 6, { color: col.muted, size: 10, align: 'right' });
    for (let i = 0; i < 5; i++) { const [x, y] = P[i], r = 9 + sz[i] * 20, c = ploidy[i] === 'n' ? N : D; ell(ctx, x, y, r, r, c, col.ink, 1.5, 0.45 + 0.4 * sz[i]); text(ctx, ploidy[i], x, y, { color: col.ink, size: 11, weight: 700, align: 'center' }); const dx = (x - cx) / R, dy = (y - cy) / R; text(ctx, names[i], x + dx * (r + 6), y + dy * (r + 6) + (dy > 0.5 ? 8 : dy < -0.5 ? -8 : 0), { color: col.ink, size: 10.5, weight: 600, align: dx > 0.3 ? 'left' : dx < -0.3 ? 'right' : 'center' }); }
    const u = ((t % 1) + 1) % 1 * 5, i0 = Math.floor(u) % 5, f = u - Math.floor(u), A = P[i0], B = P[(i0 + 1) % 5]; ell(ctx, A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f, 5, 5, col.ink, col.panel, 1.5);
    const by = h - 42, bw = w - 40; text(ctx, 'share of life as n and 2n', 20, by - 10, { color: col.muted, size: 10.5, weight: 700 }); rr(ctx, 20, by, bw, 14, 4, D, null); rr(ctx, 20, by, bw * T[k][3], 14, 4, N, null);
    text(ctx, `n ≈ ${Math.round(T[k][3] * 100)} %`, 24, by + 7, { color: col.panel, size: 10, weight: 700 }); text(ctx, `2n ≈ ${100 - Math.round(T[k][3] * 100)} %`, 20 + bw - 4, by + 7, { color: col.panel, size: 10, weight: 700, align: 'right' });
  };
}
