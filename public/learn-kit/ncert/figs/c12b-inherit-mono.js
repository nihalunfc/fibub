// Class 12 Biology, Principles of Inheritance and Variation: a monohybrid Punnett square builder. Pick the genotype of each parent (AA, Aa or aa) and
// the rule of dominance. Complete dominance: Aa looks like AA (3:1). Incomplete dominance: Aa is in between, e.g. pink (1:2:1). Codominance: Aa shows both
// traits at once, e.g. roan coat (1:2:1). Gametes line up on the edges and each cell of the square is one equally likely offspring.
import { canvas, text, title, row, choice, button, readout } from '../../kit.js';

export default function (host) {
  let p1 = 'Aa', p2 = 'Aa', mode = 'complete';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A Punnett square for a chosen cross showing the genotype and the colour of each offspring' });
  const ctl = row(host), ro = readout(host);
  const G = [['AA', 'AA'], ['Aa', 'Aa'], ['aa', 'aa']];
  choice(ctl, 'Parent 1', G, 'Aa', (v) => { p1 = v; go(); });
  choice(ctl, 'Parent 2', G, 'Aa', (v) => { p2 = v; go(); });
  choice(ctl, 'Dominance', [['complete', 'Complete'], ['incomplete', 'Incomplete'], ['co', 'Codominance']], 'complete', (v) => { mode = v; go(); });
  button(ctl, 'Test cross (Aa × aa)', () => { p1 = 'Aa'; p2 = 'aa'; sync(); });
  const btns = () => [...ctl.querySelectorAll('.lk-choice')];
  const sync = () => { [p1, p2].forEach((v, i) => btns()[i].querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b.textContent === v)))); go(); };
  const gam = (g) => [g[0], g[1]];
  const pheno = (g) => (g === 'AA' ? 'red' : g === 'aa' ? 'white' : mode === 'complete' ? 'red' : mode === 'incomplete' ? 'pink' : 'red and white');
  const cells = () => { const a = gam(p1), b = gam(p2), out = []; for (const y of b) for (const x of a) out.push([x, y].sort().join('').replace(/^aA$/, 'Aa')); return out.map((g) => (g === 'aA' ? 'Aa' : g)); };
  const ratio = (arr) => { const m = {}; arr.forEach((k) => (m[k] = (m[k] || 0) + 1)); return m; };
  const go = () => {
    const c = cells(), g = ratio(c), ph = ratio(c.map(pheno)), fmt = (o, ord) => ord.filter((k) => o[k]).map((k) => `${o[k]} ${k}`).join(' : ');
    ro.textContent = `Genotypes: ${fmt(g, ['AA', 'Aa', 'aa'])}.  Phenotypes: ${fmt(ph, ['red', 'pink', 'red and white', 'white'])}.  ${p1 === 'Aa' && p2 === 'aa' ? 'A test cross with the recessive parent: a 1 : 1 result shows the other parent was Aa.' : mode === 'complete' && p1 === 'Aa' && p2 === 'Aa' ? 'Mendel’s 3 : 1 ratio, with a 1 : 2 : 1 genotype ratio hidden inside it.' : ''}`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `${p1} × ${p2}`, col) + 6, S = Math.min((w - 90) / 2, (h - top - 80) / 2, 120), x0 = (w - 2 * S) / 2 + 20, y0 = top + 34;
    const a = gam(p1), b = gam(p2), c = cells();
    text(ctx, 'sperm / pollen', x0 + S, top + 8, { color: col.muted, size: 10, align: 'center' }); text(ctx, 'eggs', x0 - 36, y0 + S, { color: col.muted, size: 10, align: 'center' });
    a.forEach((x, i) => text(ctx, x, x0 + S * i + S / 2, y0 - 10, { color: col.s[0], size: 14, weight: 700, align: 'center' }));
    b.forEach((y, j) => text(ctx, y, x0 - 14, y0 + S * j + S / 2, { color: col.s[3], size: 14, weight: 700, align: 'center' }));
    c.forEach((g, k) => {
      const i = k % 2, j = Math.floor(k / 2), x = x0 + i * S, y = y0 + j * S, ph = pheno(g);
      ctx.fillStyle = col.soft; ctx.fillRect(x, y, S, S); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, S, S);
      const cx = x + S / 2, cy = y + S * 0.42, r = S * 0.26;
      const fill = (f) => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fillStyle = f; ctx.fill(); };
      if (ph === 'red') fill(col.s[3]); else if (ph === 'white') { fill(col.panel); } else if (ph === 'pink') fill(col.s[5]); else { ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.clip(); ctx.fillStyle = col.s[3]; ctx.fillRect(cx - r, cy - r, r, 2 * r); ctx.fillStyle = col.panel; ctx.fillRect(cx, cy - r, r, 2 * r); ctx.restore(); }
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
      text(ctx, g, cx, y + S * 0.84, { color: col.ink, size: 13, weight: 700, align: 'center' });
    });
    text(ctx, mode === 'complete' ? 'A is dominant: Aa looks like AA' : mode === 'incomplete' ? 'Neither allele fully dominant: Aa is in between' : 'Both alleles show in Aa', w / 2, h - 10, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
