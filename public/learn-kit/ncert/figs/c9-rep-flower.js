// Class 9 Reproduction: parts of a flower (a simplified, cut-open flower). Sepals (outer green leaves) protect the bud;
// petals are bright to attract insects; the stamen (anther on a filament) is the male part that makes pollen; the
// carpel or pistil (stigma, style, ovary with ovules) is the female part. Choose a part to highlight it.
import { canvas, text, title, dot, line, row, choice, readout } from '../../kit.js';

const INFO = {
  all: 'A complete flower has four whorls: sepals, petals, stamens (male) and a carpel (female). Choose a part to highlight it.',
  sepal: 'Sepals: usually green, they cover and protect the flower while it is a bud. Together they are the calyx.',
  petal: 'Petals: bright, scented and often with nectar, they attract insects for pollination. Together they are the corolla.',
  stamen: 'Stamen (male): the anther makes pollen grains; the filament holds the anther up. Each pollen grain carries a male gamete.',
  carpel: 'Carpel (female): stigma catches pollen, the style is the tube down, and the ovary holds ovules. Each ovule contains an egg cell.',
};
export default function (host) {
  let part = 'all';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A cut-open flower showing sepals, petals, stamens and carpel' });
  const ctl = row(host);
  choice(ctl, 'Highlight', [['all', 'All'], ['sepal', 'Sepals'], ['petal', 'Petals'], ['stamen', 'Stamens'], ['carpel', 'Carpel']], part, (v) => { part = v; upd(); });
  const out = readout(host);
  function upd() { out.textContent = INFO[part]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Parts of a flower', col);
    const cx = w / 2, by = h * 0.86, s = Math.min(1.5, h / 290, w / 230), on = (p) => part === 'all' || part === p, a = (p) => (on(p) ? 1 : 0.18);
    const draw = (p, fn) => { ctx.save(); ctx.globalAlpha = a(p); fn(); ctx.restore(); };
    line(ctx, [[cx, h * 0.97], [cx, by]], col.s[2], 6 * s);
    // sepals
    draw('sepal', () => { [-1, 1].forEach((d) => { ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(cx + d * 36 * s, by - 6, 42 * s, 11 * s, d * -0.45, 0, 7); ctx.fill(); }); text(ctx, 'sepal', cx + 96 * s, by + 8, { color: col.ink, size: 11, weight: on('sepal') && part !== 'all' ? 700 : 400 }); });
    // receptacle
    ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.ellipse(cx, by - 14, 16 * s, 11 * s, 0, 0, 7); ctx.fill();
    // petals
    draw('petal', () => { [-1, 1].forEach((d) => { ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.ellipse(cx + d * 58 * s, by - 90 * s, 28 * s, 62 * s, d * 0.5, 0, 7); ctx.fill(); }); text(ctx, 'petal', cx - 110 * s, by - 150 * s, { color: col.ink, size: 11, align: 'right', weight: on('petal') && part !== 'all' ? 700 : 400 }); });
    // stamens
    draw('stamen', () => { [-1, 1].forEach((d) => { const x = cx + d * 26 * s; line(ctx, [[x, by - 20], [x + d * 5, by - 120 * s]], col.s[1], 3); ctx.fillStyle = col.s[3]; ctx.beginPath(); ctx.ellipse(x + d * 5, by - 128 * s, 9 * s, 14 * s, 0, 0, 7); ctx.fill(); for (let k = 0; k < 4; k++) dot(ctx, x + d * 5 + (k - 1.5) * 4, by - 134 * s - (k % 2) * 6, 2, col.ink); }); text(ctx, 'anther', cx + 54 * s, by - 150 * s, { color: col.ink, size: 11 }); text(ctx, 'filament', cx + 52 * s, by - 74 * s, { color: col.ink, size: 11 }); });
    // carpel
    draw('carpel', () => { ctx.fillStyle = col.s[4]; ctx.beginPath(); ctx.ellipse(cx, by - 38 * s, 17 * s, 24 * s, 0, 0, 7); ctx.fill(); [-6, 6].forEach((o) => dot(ctx, cx + o, by - 40 * s, 4.5, col.panel)); line(ctx, [[cx, by - 60 * s], [cx, by - 146 * s]], col.s[4], 5); dot(ctx, cx, by - 150 * s, 8, col.s[1]); text(ctx, 'stigma', cx - 14, by - 164 * s, { color: col.ink, size: 11, align: 'right' }); text(ctx, 'style', cx - 14, by - 100 * s, { color: col.ink, size: 11, align: 'right' }); text(ctx, 'ovary with ovules', cx + 26 * s, by - 30 * s, { color: col.ink, size: 11 }); });
    text(ctx, on('stamen') && part === 'stamen' ? 'male part' : part === 'carpel' ? 'female part' : '', cx, 40, { color: col.s[3], size: 12, weight: 700, align: 'center' });
  };
  upd();
}
