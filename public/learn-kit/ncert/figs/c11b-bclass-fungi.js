// Class 11 Biology, Biological Classification: the sexual life cycle of a fungus. Spores (n) grow into a hyphal network (mycelium, n). Two compatible hyphae fuse their cytoplasm (plasmogamy) and
// the cell holds two separate nuclei (n + n, the dikaryon). The nuclei then fuse (karyogamy, 2n); meiosis follows at once and makes new spores (n). Step player (5 steps) with ploidy colour.
import { canvas, text, title } from '../../kit.js';
import { rr, ell, note } from '../c11b-lib.js';

const ST = [['Spores (n)', 'n', 'Haploid spores are carried by wind or water. In damp conditions a spore germinates into a thread called a hypha.'], ['Mycelium (n)', 'n', 'Hyphae branch and weave into a network, the mycelium, which absorbs food from the dead or living matter it grows on.'], ['Plasmogamy: n + n', 'n+n', 'Two compatible hyphae meet and the cytoplasm fuses. Each cell now has two separate nuclei: the dikaryotic stage (n + n). In many fungi it lasts a long time, and is the main body of a mushroom.'], ['Karyogamy: 2n', '2n', 'The two nuclei fuse to make a diploid (2n) zygote nucleus. This is the only diploid stage in most fungi, and it is short.'], ['Meiosis: spores (n)', 'n', 'Meiosis shortly follows, making haploid spores in sporangia, asci or basidia. The cycle starts again.']];
export default function (host) {
  let s = 0;
  const cv = canvas(host, { aspect: 1, max: 440, min: 300, label: 'The fungal life cycle with the number of chromosome sets at each stage' });
  cv.draw = (ctx, w, h, col) => {
    const y0 = title(ctx, ST[s][0], col), cx = w / 2, R = Math.max(40, Math.min(w / 2 - 70, (h - y0 - 175) / 1.81)), cy = y0 + 44 + R;
    const pos = (i) => [cx + R * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 5), cy + R * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / 5)];
    const C = { n: col.s[0], 'n+n': col.s[4], '2n': col.s[3] };
    for (let i = 0; i < 5; i++) { const [a, b] = pos(i), [c, d] = pos((i + 1) % 5); ctx.strokeStyle = i < s ? col.ink : col.line; ctx.lineWidth = i === s - 1 ? 3 : 1.6; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke(); }
    for (let i = 0; i < 5; i++) {
      const [x, y] = pos(i), on = i === s; ell(ctx, x, y, on ? 26 : 20, on ? 26 : 20, C[ST[i][1]], col.ink, on ? 3 : 1, on ? 0.95 : 0.55);
      if (i === 0) { ell(ctx, x, y, 6, 4, col.panel, null, 0, 0.9); }
      if (i === 1) { ctx.strokeStyle = col.panel; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 12, y + 6); ctx.quadraticCurveTo(x, y - 12, x + 12, y + 4); ctx.moveTo(x - 4, y - 2); ctx.lineTo(x + 6, y - 14); ctx.stroke(); }
      if (i === 2) { ell(ctx, x - 6, y, 4.5, 4.5, col.panel, null, 0); ell(ctx, x + 6, y, 4.5, 4.5, col.panel, null, 0); }
      if (i === 3) ell(ctx, x, y, 8, 8, col.panel, null, 0);
      if (i === 4) { [[-8, -6], [8, -6], [-8, 8], [8, 8]].forEach(([a, b]) => ell(ctx, x + a, y + b, 3.5, 3.5, col.panel, null, 0)); }
      const lab = ['spores', 'mycelium', 'plasmogamy', 'karyogamy', 'meiosis'][i], dx = (x - cx) / R, dy = (y - cy) / R, lx = x + dx * 34, ly = y + dy * 34;
      text(ctx, lab, lx, ly, { color: on ? col.ink : col.muted, size: 10.5, weight: on ? 700 : 400, align: dx > 0.2 ? 'left' : dx < -0.2 ? 'right' : 'center' });
    }
    text(ctx, ST[s][1] === 'n+n' ? 'n + n' : ST[s][1], cx, cy, { color: C[ST[s][1]], size: 22, weight: 700, align: 'center' });
    note(ctx, ST[s][2], 12, h - 60, w - 24, col, { size: 10.5 });
  };
  cv.redraw();
  return { step(i) { s = Math.min(i, 4); cv.redraw(); } };
}
