// Cell cycle: DNA content (in C units) and chromosome number through interphase and mitosis or meiosis.
// G1 = 2C; S doubles it to 4C; mitosis returns each daughter to 2C; meiosis I gives 2C cells with n chromosomes,
// meiosis II gives 1C cells. Chromosome number counts centromeres (it doubles only at anaphase of mitosis or meiosis II).
import { canvas, axes, line, text, row, choice, readout } from '../../kit.js';

const MIT = [['G1', 2, 2], ['S', 4, 2], ['G2', 4, 2], ['Prophase', 4, 2], ['Metaphase', 4, 2], ['Anaphase', 4, 4], ['Telophase', 4, 4], ['Daughter', 2, 2]];
const MEI = [['G1', 2, 2], ['S', 4, 2], ['G2', 4, 2], ['Prophase I', 4, 2], ['Metaphase I', 4, 2], ['Anaphase I', 4, 2], ['After I', 2, 1], ['Prophase II', 2, 1], ['Anaphase II', 2, 2], ['After II', 1, 1]];
export default function (host) {
  let kind = 'mit', n = 23;
  const cv = canvas(host, { aspect: 0.56, max: 340, min: 240, label: 'DNA content and chromosome number at each stage of the cell cycle' });
  const ctl = row(host);
  choice(ctl, 'Division', [['mit', 'Mitosis'], ['mei', 'Meiosis']], kind, (v) => { kind = v; cv.redraw(); show(); });
  choice(ctl, 'Organism', [[23, 'Human 2n = 46'], [4, 'Fruit fly 2n = 8'], [12, 'Rice 2n = 24']], n, (v) => { n = v; show(); });
  const out = readout(host);
  const show = () => {
    const S = kind === 'mit' ? MIT : MEI;
    out.innerHTML = S.map(([s, c, k]) => `${s}: ${c}C, ${k * n} chromosomes`).join(' · ') + '. (Chromosome number counts centromeres; per cell or per nucleus at that stage.)';
  };
  cv.draw = (ctx, w, h, col) => {
    const S = kind === 'mit' ? MIT : MEI;
    const { X, Y } = axes(ctx, w, h, col, { x: [0, S.length - 1], y: [0, 4.5], yt: [1, 2, 4], xt: [], ylabel: 'DNA (C)', b: 56, fy: (v) => `${v}C` });
    const pts = []; S.forEach(([, c], i) => { pts.push([X(i - 0.5 < 0 ? 0 : i - 0.5), Y(c)], [X(Math.min(i + 0.5, S.length - 1)), Y(c)]); });
    line(ctx, pts, col.s[0], 3);
    const pk = []; S.forEach(([, , k], i) => { pk.push([X(i - 0.5 < 0 ? 0 : i - 0.5), Y(k)], [X(Math.min(i + 0.5, S.length - 1)), Y(k)]); });
    line(ctx, pk, col.s[2], 2, [6, 4]);
    S.forEach(([s], i) => text(ctx, s, X(i), h - 40 + (i % 2) * 14, { color: col.muted, size: 10, align: 'center' }));
    text(ctx, '— DNA content', w - 150, 14, { color: col.s[0], size: 11 });
    text(ctx, '- - chromosome sets (× n)', w - 150, 28, { color: col.s[2], size: 11 });
  };
  cv.redraw(); show();
}
