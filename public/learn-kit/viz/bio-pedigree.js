// Pedigree reading: three generations drawn for three modes of inheritance. Squares are males, circles females,
// filled = affected, half-filled = carrier. Switch the mode, then turn on the genotypes to check the pattern (affected
// children of normal parents point to a recessive trait; affected people in every generation point to a dominant one;
// X-linked recessive shows up mostly in sons and skips through carrier mothers).
import { canvas, row, choice, readout, text, title } from '../kit.js';

// people: id, gen, x (fraction), sex; per-mode genotype strings
const P = [
  { id: 'I-1', g: 0, x: 0.3, m: 1 }, { id: 'I-2', g: 0, x: 0.55, m: 0 },
  { id: 'II-1', g: 1, x: 0.22, m: 1 }, { id: 'II-2', g: 1, x: 0.5, m: 0 }, { id: 'II-3', g: 1, x: 0.76, m: 1 },
  { id: 'III-1', g: 2, x: 0.38, m: 1 }, { id: 'III-2', g: 2, x: 0.62, m: 0 },
];
const MODES = {
  ar: { name: 'Autosomal recessive', gen: ['Aa', 'Aa', 'aa', 'Aa', 'Aa', 'aa', 'Aa'], aff: (g) => g === 'aa', car: (g) => g === 'Aa', txt: 'Two unaffected carrier parents (Aa × Aa) have an affected child (aa): 1 in 4 chance each time. Boys and girls are equally affected.' },
  ad: { name: 'Autosomal dominant', gen: ['Aa', 'aa', 'Aa', 'Aa', 'aa', 'Aa', 'aa'], aff: (g) => g.includes('A'), car: () => false, txt: 'Every affected person has an affected parent, no generation is skipped, and an affected Aa parent passes it to about half the children.' },
  xr: { name: 'X-linked recessive', gen: ['XY', 'XXa', 'XaY', 'XXa', 'XY', 'XaY', 'XXa'], aff: (g) => g === 'XaY', car: (g) => g === 'XXa', txt: 'Affected sons come from carrier mothers (XXa); an affected father gives his X only to daughters, so the trait skips a generation through carrier daughters.' },
};
const NAME = { XY: 'XᴬY', XXa: 'XᴬXᵃ', XaY: 'XᵃY' };

export default function (host) {
  let mode = 'ar', show = 'off';
  const cv = canvas(host, { aspect: 0.8, max: 340, min: 270, label: 'A three generation pedigree for a chosen mode of inheritance' });
  const c = row(host);
  choice(c, 'Trait', Object.entries(MODES).map(([k, v]) => [k, v.name]), mode, (v) => { mode = v; draw(); });
  choice(c, 'Genotypes', [['off', 'Hidden'], ['on', 'Shown']], show, (v) => { show = v; cv.redraw(); });
  const out = readout(host);
  const draw = () => { out.textContent = MODES[mode].txt; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    title(ctx, MODES[mode].name + ' pedigree', col);
    const M = MODES[mode], gy = (g) => 60 + g * ((h - 126) / 2), pos = {}, S = 17;
    P.forEach((p, i) => { pos[p.id] = [p.x * w, gy(p.g)]; p.geno = M.gen[i]; });
    // couples and children lines
    const couple = (a, b, kids, ym) => {
      const [xa, ya] = pos[a], [xb] = pos[b]; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(xa + S, ya); ctx.lineTo(xb - S, ya); ctx.stroke();
      const mx = (xa + xb) / 2, yc = ya + ym;
      ctx.beginPath(); ctx.moveTo(mx, ya); ctx.lineTo(mx, yc); ctx.stroke();
      const xs = kids.map((k) => pos[k][0]); ctx.beginPath(); ctx.moveTo(Math.min(...xs, mx), yc); ctx.lineTo(Math.max(...xs, mx), yc); ctx.stroke();
      kids.forEach((k) => { ctx.beginPath(); ctx.moveTo(pos[k][0], yc); ctx.lineTo(pos[k][0], pos[k][1] - S); ctx.stroke(); });
    };
    couple('I-1', 'I-2', ['II-1', 'II-2'], (gy(1) - gy(0)) / 2);
    // II-2 marries a person from outside (drawn as II-3, the husband for the X-linked and autosomal pages)
    const ya = gy(1); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(pos['II-2'][0] + S, ya); ctx.lineTo(pos['II-3'][0] - S, ya); ctx.stroke();
    const mx = (pos['II-2'][0] + pos['II-3'][0]) / 2, yc = ya + (gy(2) - ya) / 2;
    ctx.beginPath(); ctx.moveTo(mx, ya); ctx.lineTo(mx, yc); ctx.moveTo(pos['III-1'][0], yc); ctx.lineTo(pos['III-2'][0], yc); ctx.moveTo(pos['III-1'][0], yc); ctx.lineTo(pos['III-1'][0], gy(2) - S); ctx.moveTo(pos['III-2'][0], yc); ctx.lineTo(pos['III-2'][0], gy(2) - S); ctx.moveTo(mx, yc); ctx.lineTo(mx, yc); ctx.stroke();
    // spouse's genotype is shown for II-3 only when it matters
    P.forEach((p) => {
      const [x, y] = pos[p.id], geno = p.geno, aff = M.aff(geno), car = M.car(geno);
      ctx.beginPath(); p.m ? ctx.rect(x - S, y - S, 2 * S, 2 * S) : ctx.arc(x, y, S, 0, 7);
      ctx.fillStyle = col.panel; ctx.fill();
      if (aff) { ctx.fillStyle = col.ink; ctx.fill(); }
      else if (car && show === 'on') { ctx.save(); ctx.clip(); ctx.fillStyle = col.muted; ctx.fillRect(x - S, y - S, S, 2 * S); ctx.restore(); }
      ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); p.m ? ctx.rect(x - S, y - S, 2 * S, 2 * S) : ctx.arc(x, y, S, 0, 7); ctx.stroke();
      text(ctx, p.id, x - S - 3, y - S - 7, { color: col.muted, size: 9.5, fit: false });
      if (show === 'on') text(ctx, mode === 'xr' ? NAME[geno] : geno, x, y + S + 11, { color: col.ink, size: 11, weight: 700, align: 'center' });
    });
    text(ctx, 'filled = affected' + (mode !== 'ad' && show === 'on' ? ', half = carrier' : ''), w / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  draw();
}
