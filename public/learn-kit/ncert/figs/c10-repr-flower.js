// Class 10 How do Organisms Reproduce?: parts of a bisexual flower in section. Sepals (green, protect the bud), petals
// (colour, attract insects), stamen = anther + filament (make pollen: the male part), carpel = stigma + style + ovary with
// ovules (the female part). Choose a part to highlight it and read its job.
import { canvas, text, title, line, dot, row, choice, readout } from '../../kit.js';

const PARTS = {
  all: ['Whole flower', 'A flower is the reproductive part of the plant. This one is bisexual: it has both male and female parts.'],
  sepal: ['Sepals (calyx)', 'Green, leaf-like. They cover and protect the flower while it is still a bud.'],
  petal: ['Petals (corolla)', 'Brightly coloured and often scented, to attract bees, butterflies and birds.'],
  stamen: ['Stamen: anther and filament (male)', 'The anther makes pollen grains, which carry the male gametes. The filament holds the anther up.'],
  carpel: ['Carpel: stigma, style, ovary (female)', 'The sticky stigma catches pollen. The style is the tube down to the ovary. The ovary holds ovules, each with an egg cell.'],
};
export default function (host) {
  let part = 'all';
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'A flower cut in half with sepals, petals, stamens and the carpel labelled' });
  const ctl = row(host);
  choice(ctl, 'Show', [['all', 'All'], ['sepal', 'Sepal'], ['petal', 'Petal'], ['stamen', 'Stamen'], ['carpel', 'Carpel']], part, (v) => { part = v; say(); });
  const out = readout(host);
  function say() { out.innerHTML = `<b>${PARTS[part][0]}.</b> ${PARTS[part][1]}`; cv.redraw(); }
  const ell = (ctx, x, y, rx, ry, a, f, s, lw = 1.6, al = 1) => { ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, 7); if (f) { ctx.fillStyle = f; ctx.fill(); } if (s) { ctx.strokeStyle = s; ctx.lineWidth = lw; ctx.stroke(); } ctx.restore(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'A flower in section', col) + 6, cx = w / 2, base = h - 40, rec = base - 30;
    const on = (p) => part === 'all' || part === p, al = (p) => (on(p) ? 1 : 0.18), ring = (p) => (part === p ? col.ink : col.muted);
    // stalk and receptacle
    line(ctx, [[cx, h - 8], [cx, base]], col.s[1], 6); ell(ctx, cx, base - 8, 24, 10, 0, col.s[1], col.ink, 1.5, 0.9);
    // sepals
    [-1, 1].forEach((d) => ell(ctx, cx + d * 30, base - 12, 24, 8, -d * 0.55, col.s[1], ring('sepal'), part === 'sepal' ? 2.6 : 1.4, al('sepal')));
    // petals
    [-1, 1].forEach((d) => { ell(ctx, cx + d * 64, base - 78, 22, 56, d * 0.5, col.s[4], ring('petal'), part === 'petal' ? 2.6 : 1.4, al('petal')); ell(ctx, cx + d * 40, base - 70, 14, 48, d * 0.25, col.s[4], ring('petal'), 1, al('petal') * 0.8); });
    // stamens
    [-1, 1].forEach((d) => { const x = cx + d * 24; ctx.save(); ctx.globalAlpha = al('stamen'); line(ctx, [[x, base - 16], [x + d * 6, base - 110]], ring('stamen'), part === 'stamen' ? 3 : 2); ell(ctx, x + d * 6, base - 116, 7, 12, 0, col.s[3], ring('stamen'), 1.6); for (let i = 0; i < 4; i++) dot(ctx, x + d * (12 + i * 3), base - 130 - i * 5, 1.7, col.s[3]); ctx.restore(); });
    // carpel
    ctx.save(); ctx.globalAlpha = al('carpel'); ell(ctx, cx, base - 28, 15, 18, 0, col.s[2], ring('carpel'), part === 'carpel' ? 2.6 : 1.6); [-6, 6].forEach((d) => dot(ctx, cx + d * 0.6, base - 28 + (d > 0 ? 3 : -3), 3.5, col.panel, ring('carpel')));
    line(ctx, [[cx, base - 46], [cx, base - 130]], ring('carpel'), part === 'carpel' ? 3 : 2.2); ell(ctx, cx, base - 136, 9, 6, 0, col.s[2], ring('carpel'), 1.6); ctx.restore();
    // labels
    const lab = (s, x, y, tx, ty, p, al_ = 'left') => { if (on(p)) { line(ctx, [[x, y], [tx, ty]], col.muted, 1); text(ctx, s, tx + (al_ === 'left' ? 4 : -4), ty, { color: col.ink, size: 10.5, align: al_, weight: part === p ? 700 : 400 }); } };
    lab('stigma', cx + 7, base - 136, cx + 40, top + 22, 'carpel'); lab('style', cx, base - 95, cx + 40, top + 40, 'carpel'); lab('ovary with ovule', cx + 12, base - 28, w - 108, base + 4, 'carpel');
    lab('anther', cx - 30, base - 118, 10, base - 160, 'stamen'); lab('filament', cx - 28, base - 70, 10, base - 138, 'stamen');
    lab('petal', cx - 74, base - 90, 10, base - 120, 'petal'); lab('sepal', cx - 40, base - 16, 10, base - 4, 'sepal');
  };
  say();
}
