// Morphology of flowering plants: a floral diagram with its formula. Pick a family: four rings show the calyx (or
// perianth), corolla, androecium and gynoecium, with joined parts drawn touching. The readout gives the formula,
// what each symbol means and the family's uses (Fabaceae, Solanaceae, Liliaceae as in NCERT Class 11).
import { canvas, text, row, choice, readout } from '../../kit.js';

const F = {
  fab: { name: 'Fabaceae', f: '% ⚥ K(5) C1+2+(2) A(9)+1 G1 (superior)', rings: [[5, true, 'sepals, joined'], [5, false, 'petals: 1 standard, 2 wings, 2 keel petals joined'], [10, false, 'stamens: 9 joined + 1 free (diadelphous)'], [1, false, 'one carpel, marginal placentation']],
    note: 'zygomorphic flower; vexillary (papilionaceous) aestivation; fruit a legume (pod); root nodules', uses: 'pulses (gram, arhar, moong, soybean), edible oil (soybean, groundnut), dye (indigofera), fibre (sunn hemp), fodder (Sesbania, Trifolium), ornamentals (lupin, sweet pea), medicine (muliathi)' },
  sol: { name: 'Solanaceae', f: '⊕ ⚥ K(5) C(5) A5 G(2) (superior)', rings: [[5, true, 'sepals, joined, persistent'], [5, true, 'petals, joined, valvate'], [5, false, 'stamens, epipetalous (on the petals)'], [2, true, 'two joined carpels, obliquely placed, swollen axile placenta']],
    note: 'actinomorphic flower; fruit a berry or capsule; seeds endospermous', uses: 'food (tomato, brinjal, potato), spice (chilli), medicine (belladonna, ashwagandha), fumigatory (tobacco), ornamentals (petunia)' },
  lil: { name: 'Liliaceae', f: 'Br ⊕ ⚥ P(3+3) A3+3 G(3) (superior)', rings: [[6, true, 'tepals in two whorls of three, often joined (perianth)'], [0, false, 'no separate corolla'], [6, false, 'stamens 3 + 3, epitepalous'], [3, true, 'three joined carpels, axile placentation']],
    note: 'a monocot family; bracteate, actinomorphic, trimerous; fruit a capsule, rarely a berry', uses: 'ornamentals (tulip, Gloriosa), medicine (Aloe), vegetables (Asparagus), colchicine (Colchicum autumnale)' },
};
export default function (host) {
  let cur = 'fab';
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'Floral diagram of one plant family with four whorls' });
  const ctl = row(host);
  choice(ctl, 'Family', Object.entries(F).map(([k, f]) => [k, f.name]), cur, (v) => { cur = v; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const f = F[cur];
    out.innerHTML = `<b>${f.name}: ${f.f}</b>. Rings from outside: ${f.rings.filter((r) => r[0]).map((r) => r[2]).join('; ')}. ${f.note[0].toUpperCase() + f.note.slice(1)}. Uses: ${f.uses}. (Br bracteate, ⊕ actinomorphic, % zygomorphic, ⚥ bisexual, K calyx, C corolla, P perianth, A androecium, G gynoecium, brackets = joined.)`;
  };
  cv.draw = (ctx, w, h, col) => {
    const f = F[cur], cx = w * 0.4, cy = h / 2 + 6, R = Math.min(w * 0.36, h * 0.42);
    const radii = [R, R * 0.74, R * 0.5, R * 0.2];
    f.rings.forEach(([k, joined], i) => {
      if (!k) return;
      const r = radii[i], size = i === 3 ? R * 0.16 : (Math.PI * r / k) * (joined ? 0.98 : 0.6);
      const c = col.s[i] || col.ink;
      if (i === 3 && k === 1) { ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.06, R * 0.14, 0, 0, 7); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke(); return; }
      for (let j = 0; j < k; j++) {
        const a = -Math.PI / 2 + (j + 0.5) * (2 * Math.PI / k), x = cx + Math.cos(a) * (i === 3 ? R * 0.12 : r), y = cy + Math.sin(a) * (i === 3 ? R * 0.12 : r);
        ctx.beginPath(); ctx.ellipse(x, y, size * 0.5, i === 2 ? size * 0.35 : size * 0.3, a + Math.PI / 2, 0, 7);
        ctx.fillStyle = col.soft; ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke();
      }
      if (cur === 'fab' && i === 2) { ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2 + 0.4, 1.5 * Math.PI - 0.4); ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.stroke(); }
    });
    const lx = cx + R + 14, labels = ['K / P', 'C', 'A', 'G'];
    f.rings.forEach(([k], i) => { if (k) text(ctx, `${labels[i]}: ${k}`, lx, cy - R * 0.6 + i * 22, { color: col.s[i] || col.ink, size: 12, weight: 700 }); });
    text(ctx, f.name, lx, cy + R * 0.5, { color: col.ink, size: 13, weight: 700 });
    text(ctx, 'axis', cx, cy - R - 10, { color: col.muted, size: 10, align: 'center' });
  };
  cv.redraw(); show();
}
