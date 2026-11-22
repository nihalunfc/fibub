// Class 12 Biology, Sexual Reproduction in Flowering Plants: the four whorls of a flower in a cut-open (longitudinal) view.
// Calyx (sepals), corolla (petals), androecium (stamens = filament + anther) and gynoecium (pistil = stigma, style, ovary with ovules).
// Pick a whorl and the others fade; the stamen and the pistil are the reproductive whorls.
import { canvas, text, line, row, choice, readout, title } from '../../kit.js';

export default function (host) {
  let sel = 'all';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A flower cut in half with calyx, corolla, stamens and pistil labelled; choose a whorl to highlight it' });
  const ctl = row(host), ro = readout(host);
  const INFO = {
    all: 'A complete flower has four whorls on the thalamus (the swollen tip of the flower stalk). Only the stamens and the pistil take part in reproduction.',
    calyx: 'Calyx: the outer whorl of sepals, usually green. It protects the flower while it is a bud.',
    corolla: 'Corolla: the whorl of petals, often coloured and scented. Its job is to attract pollinators.',
    androecium: 'Androecium: all the stamens. Each stamen has a filament (stalk) and an anther that makes pollen. This is the male part.',
    gynoecium: 'Gynoecium: one or more pistils (carpels). Each has a stigma (receives pollen), a style and an ovary holding the ovules. This is the female part.',
  };
  choice(ctl, 'Show', [['all', 'All'], ['calyx', 'Calyx'], ['corolla', 'Corolla'], ['androecium', 'Stamens'], ['gynoecium', 'Pistil']], 'all', (v) => { sel = v; go(); });
  const go = () => { ro.textContent = INFO[sel]; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Parts of a flower (cut open)', col) + 4;
    const u = Math.min(w / 400, (h - top) / 255), cx = w / 2, by = h - 46 * u;
    const on = (k) => sel === 'all' || sel === k, A = (k) => { ctx.globalAlpha = on(k) ? 1 : 0.2; };
    const ell = (x, y, rx, ry, rot, fill, stroke) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = stroke || col.ink; ctx.stroke(); };
    // stalk and thalamus
    A('x'); ctx.globalAlpha = 1; line(ctx, [[cx, by + 40 * u], [cx, by]], col.s[2], 6 * u);
    ell(cx, by, 36 * u, 10 * u, 0, col.soft);
    for (const sg of [-1, 1]) {
      A('calyx'); ell(cx + sg * 46 * u, by - 14 * u, 10 * u, 34 * u, sg * 1.15, col.s[2]);
      A('corolla'); ell(cx + sg * 64 * u, by - 64 * u, 17 * u, 58 * u, sg * 0.42, col.s[5]);
      A('androecium'); line(ctx, [[cx + sg * 20 * u, by - 6 * u], [cx + sg * 30 * u, by - 100 * u]], col.s[3], 3 * u);
      ell(cx + sg * 31 * u, by - 110 * u, 8 * u, 15 * u, sg * 0.1, col.s[3]);
    }
    A('gynoecium');
    ell(cx, by - 28 * u, 21 * u, 24 * u, 0, col.s[0]);
    ctx.globalAlpha = on('gynoecium') ? 1 : 0.2; for (const [dx, dy] of [[-7, -34], [7, -34], [0, -22]]) { ctx.beginPath(); ctx.arc(cx + dx * u, by + dy * u, 4.5 * u, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.stroke(); }
    line(ctx, [[cx, by - 52 * u], [cx, by - 120 * u]], col.s[0], 4 * u);
    ell(cx, by - 126 * u, 13 * u, 7 * u, 0, col.s[0]);
    ctx.globalAlpha = 1;
    const lab = (s, k, tx, ty, lx, ly, al) => { if (!on(k)) return; line(ctx, [[tx, ty], [lx + (al === 'left' ? -3 : 3), ly]], col.muted, 1); text(ctx, s, lx, ly, { color: col.ink, size: 11, weight: 600, align: al, halo: col.panel }); };
    lab('petal', 'corolla', cx - 72 * u, by - 70 * u, 6, by - 140 * u, 'left');
    lab('anther', 'androecium', cx + 33 * u, by - 118 * u, w - 6, by - 150 * u, 'right');
    lab('filament', 'androecium', cx + 28 * u, by - 70 * u, w - 6, by - 90 * u, 'right');
    lab('stigma', 'gynoecium', cx - 12 * u, by - 128 * u, 6, by - 178 * u > top + 6 ? by - 178 * u : top + 12, 'left');
    lab('style', 'gynoecium', cx - 2 * u, by - 90 * u, 6, by - 100 * u, 'left');
    lab('ovary', 'gynoecium', cx - 14 * u, by - 28 * u, 6, by - 20 * u, 'left');
    lab('ovules inside', 'gynoecium', cx + 8 * u, by - 34 * u, w - 6, by - 36 * u, 'right');
    lab('sepal (calyx)', 'calyx', cx + 52 * u, by - 8 * u, w - 6, by + 6 * u, 'right');
    lab('thalamus', 'x', cx - 30 * u, by + 4 * u, 6, by + 30 * u, 'left');
    if (sel === 'all') { text(ctx, 'male: stamen', w - 8, top + 14,  { color: col.s[3], size: 11, weight: 700, align: 'right' }); text(ctx, 'female: pistil', 8, top + 14, { color: col.s[0], size: 11, weight: 700 }); }
  };
  go();
}
