// Class 11 Anatomy of Flowering Plants: a gallery of plant tissues drawn as small cross-sections. Meristems divide; permanent tissues (parenchyma, collenchyma,
// sclerenchyma, xylem, phloem) differ in wall thickness, living or dead cells and job. Pick a tissue to see its cells.
import { canvas, text, title, row, choice } from '../../kit.js';
import { ellipse, footer } from '../c11b-ex-util.js';

const INFO = {
  mer: ['Meristem', 'Living, small cells with thin walls, dense cytoplasm, a big nucleus and no vacuole. They keep dividing at root and shoot tips (apical) and in the cambium (lateral).'],
  par: ['Parenchyma', 'Living, thin-walled, round cells with a big vacuole and air spaces. They store food, do photosynthesis (chlorenchyma) and fill most of the plant.'],
  col: ['Collenchyma', 'Living cells with the corners thickened by cellulose and pectin. They give flexible support to young stems and leaf stalks (the strings of celery).'],
  scl: ['Sclerenchyma', 'Dead cells with very thick lignified walls and a tiny hollow. Fibres and stone cells give strength: jute, coconut husk, the gritty bits in a guava.'],
  xyl: ['Xylem', 'Mostly dead, thick-walled vessels and tracheids carry water and minerals upwards; xylem parenchyma and fibres help.'],
  phl: ['Phloem', 'Living sieve tubes with sieve plates carry sugar, helped by small companion cells with a dense nucleus.'],
};
export default function (host) {
  let k = 'mer';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 300, label: 'Cross-section drawings of six plant tissues: meristem, parenchyma, collenchyma, sclerenchyma, xylem and phloem' });
  const ctl = row(host);
  choice(ctl, 'Tissue', Object.entries(INFO).map(([v, a]) => [v, a[0]]), k, (v) => { k = v; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, INFO[k][0], col), fy = footer(ctx, w, h, col, INFO[k][1]);
    const s = Math.max(30, Math.min(40, (w - 30) / 7)), x0 = 14, y0 = t0 + 10;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w - 28, fy - y0 - 22); ctx.clip();
    for (let r = 0; r * s * 0.87 < fy - y0 + s; r++) for (let c = 0; c * s < w + s; c++) {
      const x = x0 + s / 2 + c * s + (r % 2 ? s / 2 : 0), y = y0 + s / 2 + r * s * 0.87, R = s / 2 - 1;
      if (k === 'mer') { ellipse(ctx, x, y, R, R, col.soft, col.s[0], 1.3); ellipse(ctx, x, y, R * 0.45, R * 0.45, col.s[0]); }
      else if (k === 'par') { ellipse(ctx, x, y, R - 1, R - 1, col.soft, col.s[2], 1.3); ellipse(ctx, x, y, R * 0.62, R * 0.62, col.panel, col.line, 1); ellipse(ctx, x + R * 0.5, y - R * 0.3, 2.5, 2.5, col.s[2]); }
      else if (k === 'col') { ellipse(ctx, x, y, R, R, col.soft, col.s[1], 1.3); for (let a = 0; a < 6; a++) { const an = a * Math.PI / 3 + Math.PI / 6; ellipse(ctx, x + Math.cos(an) * R * 0.92, y + Math.sin(an) * R * 0.92, 4.5, 4.5, col.s[1]); } ellipse(ctx, x, y, R * 0.45, R * 0.45, col.panel); }
      else if (k === 'scl') { ellipse(ctx, x, y, R, R, col.s[3], col.ink, 1.2); ellipse(ctx, x, y, R * 0.2, R * 0.2, col.panel); }
      else if (k === 'xyl') { const big = (r + c) % 3 === 0; if (big) { ellipse(ctx, x, y, R, R, col.s[3], col.ink, 1.2); ellipse(ctx, x, y, R * 0.72, R * 0.72, col.panel); } else if ((r + c) % 3 === 1) { ellipse(ctx, x, y, R * 0.7, R * 0.7, col.s[3], col.ink, 1.2); ellipse(ctx, x, y, R * 0.4, R * 0.4, col.panel); } else ellipse(ctx, x, y, R * 0.6, R * 0.6, col.soft, col.s[2], 1.2); }
      else { const t = (r + c) % 3; if (t === 0) { ellipse(ctx, x, y, R, R, col.soft, col.s[2], 1.5); ctx.fillStyle = col.s[2]; ctx.fillRect(x - R * 0.6, y - 1.5, R * 1.2, 3); } else if (t === 1) { ellipse(ctx, x, y, R * 0.62, R * 0.62, col.soft, col.s[4], 1.3); ellipse(ctx, x, y, R * 0.25, R * 0.25, col.s[4]); } else ellipse(ctx, x, y, R * 0.8, R * 0.8, col.soft, col.s[2], 1.2); }
    }
    ctx.restore();
    const key = { mer: 'dark dot = large nucleus', par: 'big pale circle = vacuole', col: 'dark corners = extra thickening', scl: 'thick wall, tiny hollow, dead', xyl: 'big empty circles = dead vessels', phl: 'wide = sieve tube (plate across), small dark = companion cell' }[k];
    ctx.fillStyle = col.panel; ctx.fillRect(x0, y0 - 2, w - 28, 0);
    text(ctx, key, w / 2, fy - 10, { color: col.ink, size: 10.5, weight: 700, align: 'center', halo: col.panel });
  };
}
