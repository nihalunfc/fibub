// Class 11 Structural Organisation in Animals: epithelial tissue. Cells sit on a basement membrane with almost no matrix between them. Cell shape and layers follow the job:
// flat cells for exchange, cubes for secretion and absorption, tall columns for absorption, cilia for moving mucus, goblet cells for mucus, layers for wear.
import { canvas, text, title, row, choice, loop } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const T = {
  sq: ['Simple squamous', 'One layer of flat cells: thin, so gases and fluids pass quickly. Lining of blood vessels and heart, air sacs (alveoli) of the lungs.'],
  cu: ['Simple cuboidal', 'One layer of cubes with a round nucleus. Secretion and absorption: kidney tubules, ducts of glands, thyroid follicles.'],
  co: ['Simple columnar', 'Tall cells, often with microvilli. Absorb and secrete: lining of stomach and intestine.'],
  ci: ['Ciliated columnar', 'Columnar cells with beating cilia that sweep mucus along: windpipe, fallopian tubes, nasal passage.'],
  gl: ['Glandular', 'Columnar or cuboidal cells specialised to make a secretion; unicellular (goblet cells of the gut) or multicellular (salivary gland). Exocrine glands have ducts, endocrine glands release hormones into blood.'],
  st: ['Compound (stratified)', 'Many layers to protect against wear and tear: the skin surface, the lining of the mouth, the pharynx. Only the bottom layer divides.'],
};
export default function (host) {
  let k = 'sq', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Drawings of simple squamous, cuboidal, columnar, ciliated, glandular and compound epithelium on a basement membrane' });
  const ctl = row(host);
  choice(ctl, 'Epithelium', Object.entries(T).map(([v, a]) => [v, a[0].replace('Simple ', '').replace('Compound (stratified)', 'Compound')]), k, (v) => { k = v; cv.redraw(); });
  loop(host, (dt) => { t += dt; if (k === 'ci') cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, T[k][0] + ' epithelium', col), fy = footer(ctx, w, h, col, T[k][1]);
    const base = fy - 34, x0 = 18, W = w - 36;
    ctx.fillStyle = col.s[4]; ctx.fillRect(x0 - 4, base, W + 8, 4);
    text(ctx, 'basement membrane', w / 2, base + 14, { color: col.muted, size: 10, align: 'center' });
    ctx.fillStyle = col.soft; ctx.fillRect(x0 - 4, base + 4, W + 8, 5);
    const nuc = (x, y, rx, ry) => ellipse(ctx, x, y, rx, ry, col.s[0], null);
    const cell = (x, y, cw, ch, fill) => { ctx.fillStyle = fill ?? col.soft; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.5; ctx.fillRect(x, y, cw, ch); ctx.strokeRect(x, y, cw, ch); };
    const space = base - t0 - 20;
    if (k === 'sq') { const n = Math.floor(W / 46); for (let i = 0; i < n; i++) { const cw = W / n; cell(x0 + i * cw, base - 16, cw, 16); nuc(x0 + i * cw + cw / 2, base - 8, 9, 4); } text(ctx, 'flat cell', w / 2, base - 32, { color: col.ink, size: 10.5, align: 'center' }); }
    else if (k === 'cu') { const n = Math.floor(W / 36); for (let i = 0; i < n; i++) { const cw = W / n; cell(x0 + i * cw, base - cw, cw, cw); nuc(x0 + i * cw + cw / 2, base - cw / 2, cw * 0.22, cw * 0.22); } text(ctx, 'round central nucleus', w / 2, base - W / n - 12, { color: col.ink, size: 10.5, align: 'center' }); }
    else if (k === 'co' || k === 'ci') {
      const n = Math.floor(W / 28), cw = W / n, ch = Math.min(110, space * 0.7);
      for (let i = 0; i < n; i++) {
        cell(x0 + i * cw, base - ch, cw, ch); nuc(x0 + i * cw + cw / 2, base - 14, cw * 0.32, 7);
        if (k === 'co') { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.2; for (let j = 0; j < 4; j++) { const xx = x0 + i * cw + 4 + j * (cw - 8) / 3; ctx.beginPath(); ctx.moveTo(xx, base - ch); ctx.lineTo(xx, base - ch - 5); ctx.stroke(); } }
        else { ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.2; for (let j = 0; j < 3; j++) { const xx = x0 + i * cw + 5 + j * (cw - 10) / 2, sw = Math.sin(t * 7 + i * 0.7 + j) * 3.5; ctx.beginPath(); ctx.moveTo(xx, base - ch); ctx.quadraticCurveTo(xx + sw, base - ch - 7, xx + sw * 1.8, base - ch - 14); ctx.stroke(); } }
      }
      text(ctx, k === 'co' ? 'microvilli (brush border)' : 'cilia sweep mucus along', w / 2, base - ch - 24, { color: col.ink, size: 10.5, align: 'center' });
    } else if (k === 'gl') {
      const n = Math.floor(W / 28), cw = W / n, ch = Math.min(80, space * 0.6);
      for (let i = 0; i < n; i++) {
        const gob = i % 3 === 1; cell(x0 + i * cw, base - ch, cw, ch, gob ? col.panel : col.soft);
        if (gob) { ellipse(ctx, x0 + i * cw + cw / 2, base - ch * 0.62, cw * 0.38, ch * 0.3, col.s[3] + '88', col.s[3], 1); nuc(x0 + i * cw + cw / 2, base - 8, cw * 0.28, 5); ellipse(ctx, x0 + i * cw + cw / 2, base - ch - 5 - ((t * 20 + i * 7) % 14), 2.5, 2.5, col.s[3]); } else nuc(x0 + i * cw + cw / 2, base - 14, cw * 0.32, 7);
      }
      text(ctx, 'goblet cells make mucus', w / 2, base - ch - 26, { color: col.ink, size: 10.5, align: 'center' });
    } else {
      const layers = 5, ch = Math.min(34, (space - 24) / layers), n = Math.floor(W / 34), cw = W / n;
      for (let l = 0; l < layers; l++) for (let i = 0; i < n; i++) {
        const y = base - (l + 1) * ch, flat = l === layers - 1, ww = flat ? cw : cw * 0.95; ctx.fillStyle = l === 0 ? col.soft : col.panel; ctx.strokeStyle = col.s[2]; ctx.lineWidth = 1.2;
        const xx = x0 + i * cw + (l % 2 ? cw / 2 - cw / 2 : 0); ctx.fillRect(xx, y, ww, ch); ctx.strokeRect(xx, y, ww, ch); nuc(xx + ww / 2, y + ch / 2, ww * 0.18, ch * 0.22 * (flat ? 0.6 : 1));
      }
      text(ctx, 'new cells at the bottom, worn flat cells at the top', w / 2, base - layers * ch - 12, { color: col.ink, size: 10.5, align: 'center' });
    }
  };
}
