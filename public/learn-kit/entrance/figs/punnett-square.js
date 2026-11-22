// Principles of inheritance: Punnett squares for the crosses NEET uses. Choose a cross; the square fills with the
// offspring genotypes, coloured by phenotype, and the line below gives the genotype and phenotype ratios.
import { canvas, text, row, choice, readout } from '../../kit.js';

const sortG = (a, b) => [a, b].sort((x, y) => (x.toLowerCase() === y.toLowerCase() ? (x < y ? -1 : 1) : x.toLowerCase() < y.toLowerCase() ? -1 : 1)).join('');
const CROSSES = {
  mono: { name: 'Tt × Tt', note: 'monohybrid, complete dominance (pea height)', p1: ['T', 't'], p2: ['T', 't'], geno: (a, b) => sortG(a, b), phen: (g) => (g.includes('T') ? 'tall' : 'dwarf') },
  test: { name: 'Tt × tt', note: 'test cross: the recessive parent shows what gametes the other makes', p1: ['T', 't'], p2: ['t', 't'], geno: (a, b) => sortG(a, b), phen: (g) => (g.includes('T') ? 'tall' : 'dwarf') },
  inc: { name: 'Rr × Rr', note: 'incomplete dominance (snapdragon flower colour)', p1: ['R', 'r'], p2: ['R', 'r'], geno: (a, b) => sortG(a, b), phen: (g) => ({ RR: 'red', Rr: 'pink', rr: 'white' })[g] },
  abo: { name: 'Iᴬi × Iᴮi', note: 'ABO blood groups: Iᴬ and Iᴮ codominant, both dominant over i', p1: ['Iᴬ', 'i'], p2: ['Iᴮ', 'i'], geno: (a, b) => (a === 'i' ? b + a : a + b), phen: (g) => (g.includes('Iᴬ') && g.includes('Iᴮ') ? 'AB' : g.includes('Iᴬ') ? 'A' : g.includes('Iᴮ') ? 'B' : 'O') },
  di: { name: 'RrYy × RrYy', note: 'dihybrid: round (R) over wrinkled, yellow (Y) over green', p1: ['RY', 'Ry', 'rY', 'ry'], p2: ['RY', 'Ry', 'rY', 'ry'], geno: (a, b) => sortG(a[0], b[0]) + sortG(a[1], b[1]), phen: (g) => (g.includes('R') ? 'round' : 'wrinkled') + ' ' + (g.includes('Y') ? 'yellow' : 'green') },
  xl: { name: 'XᶜX × XY', note: 'X-linked recessive (colour blindness): carrier mother × normal father', p1: ['Xᶜ', 'X'], p2: ['X', 'Y'], geno: (a, b) => (b === 'Y' ? a + 'Y' : (a === 'X' ? b + a : a + b)), phen: (g) => (g.endsWith('Y') ? (g.startsWith('Xᶜ') ? 'colour-blind son' : 'normal son') : g.includes('Xᶜ') ? 'carrier daughter' : 'normal daughter') },
};
export default function (host) {
  let cur = 'mono';
  const cv = canvas(host, { aspect: 0.72, max: 420, min: 280, label: 'A Punnett square with offspring coloured by phenotype' });
  const ctl = row(host);
  choice(ctl, 'Cross', Object.entries(CROSSES).map(([k, c]) => [k, c.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const tally = () => {
    const c = CROSSES[cur], G = new Map(), P = new Map();
    for (const a of c.p1) for (const b of c.p2) { const g = c.geno(a, b), p = c.phen(g); G.set(g, (G.get(g) || 0) + 1); P.set(p, (P.get(p) || 0) + 1); }
    return { G, P };
  };
  const show = () => {
    const c = CROSSES[cur], { G, P } = tally();
    out.innerHTML = `<b>${c.name}</b>, ${c.note}. Genotypes: ${[...G].map(([g, k]) => `${g} ${k}`).join(' : ')}. Phenotypes: ${[...P].map(([p, k]) => `${p} ${k}`).join(' : ')}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const c = CROSSES[cur], n1 = c.p1.length, n2 = c.p2.length, { P } = tally();
    const phenos = [...P.keys()], pc = (p) => col.s[phenos.indexOf(p) % 8];
    const top = 44, left = 54, size = Math.min((w - left - 16) / n2, (h - top - 52) / n1), x0 = left + (w - left - 16 - size * n2) / 2;
    text(ctx, c.name, 10, 16, { color: col.ink, size: 12.5, weight: 700 });
    c.p2.forEach((g, j) => text(ctx, g, x0 + (j + 0.5) * size, top - 10, { color: col.ink, size: 13, weight: 600, align: 'center' }));
    c.p1.forEach((g, i) => text(ctx, g, x0 - 10, top + (i + 0.5) * size, { color: col.ink, size: 13, weight: 600, align: 'right' }));
    c.p1.forEach((a, i) => c.p2.forEach((b, j) => {
      const g = c.geno(a, b), p = c.phen(g), x = x0 + j * size, y = top + i * size;
      ctx.fillStyle = col.soft; ctx.fillRect(x, y, size, size);
      ctx.fillStyle = pc(p); ctx.globalAlpha = 0.28; ctx.fillRect(x, y, size, size); ctx.globalAlpha = 1;
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size);
      text(ctx, g, x + size / 2, y + size / 2 - (size > 50 ? 7 : 0), { color: col.ink, size: n2 > 2 ? 12 : 15, weight: 600, align: 'center' });
      if (size > 50) text(ctx, p, x + size / 2, y + size / 2 + 11, { color: col.muted, size: 10, align: 'center' });
    }));
    const ly = top + n1 * size + 18; let lx = 10;
    let yy = ly;
    for (const p of phenos) {
      const lab = `${p} (${P.get(p)})`; ctx.font = '11px system-ui'; const tw = ctx.measureText(lab).width;
      if (lx > 10 && lx + tw + 20 > w - 8) { lx = 10; yy += 16; }
      ctx.fillStyle = pc(p); ctx.fillRect(lx, yy - 5, 10, 10); text(ctx, lab, lx + 14, yy, { color: col.ink, size: 11 }); lx += tw + 30;
    }
  };
  cv.redraw(); show();
}
