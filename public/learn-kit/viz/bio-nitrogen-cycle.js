// The nitrogen cycle as a step player around a ring: N₂ in the air, fixation, ammonia, nitrification (two steps), uptake by
// plants and animals, decay (ammonification), and denitrification back to N₂. The glowing arrow shows the step being read.
import { text, title } from '../kit.js';
import { stepper, mix, wrap } from './_bio-kit.js';

const NODES = [['N₂ in air', 0.5, 0.12], ['NH₃ / NH₄⁺', 0.84, 0.3], ['NO₂⁻', 0.84, 0.66], ['NO₃⁻', 0.5, 0.82], ['Plants, then animals', 0.16, 0.66], ['Dead matter, wastes', 0.16, 0.3]];
const STEPS = [
  { n: '1. Nitrogen fixation', a: 0, b: 1, who: 'Rhizobium, Azotobacter, Anabaena, lightning', t: 'N₂ is turned into ammonia. Symbiotic Rhizobium lives in root nodules of legumes; the enzyme nitrogenase needs a low-oxygen place (leghaemoglobin).' },
  { n: '2. Nitrification, step 1', a: 1, b: 2, who: 'Nitrosomonas, Nitrococcus', t: 'Ammonia is oxidised to nitrite (NO₂⁻), releasing energy the bacteria use.' },
  { n: '3. Nitrification, step 2', a: 2, b: 3, who: 'Nitrobacter', t: 'Nitrite is oxidised to nitrate (NO₃⁻), the form plants take up best.' },
  { n: '4. Assimilation', a: 3, b: 4, who: 'plants, then animals that eat them', t: 'Roots absorb nitrate and make amino acids, proteins and nucleic acids; animals get nitrogen by eating plants.' },
  { n: '5. Ammonification', a: 4, b: 5, who: 'decomposers (bacteria and fungi)', t: 'Dead remains, urea and wastes are broken down and nitrogen is returned as ammonia.' },
  { n: '6. Ammonia available again', a: 5, b: 1, who: 'soil', t: 'Ammonia from decay re-enters the pool and is nitrified again; the cycle keeps the nitrogen moving.' },
  { n: '7. Denitrification', a: 3, b: 0, who: 'Pseudomonas, Thiobacillus (waterlogged soil)', t: 'Nitrate is reduced back to N₂ gas, which returns to the air and completes the cycle.' },
];

export default function (host) {
  return stepper(host, { aspect: 1.1, max: 440, min: 350, stages: 7, label: 'The nitrogen cycle in seven steps' }, (ctx, w, h, col, st, k, t, pv) => {
    const S = STEPS[st]; title(ctx, S.n, col);
    const P = NODES.map((n) => [n[1] * w, 56 + n[2] * (h - 150)]);
    STEPS.forEach((s, i) => { const [x0, y0] = P[s.a], [x1, y1] = P[s.b], on = i === st; ctx.strokeStyle = on ? col.s[1] : col.line; ctx.lineWidth = on ? 4 : 2; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); const ang = Math.atan2(y1 - y0, x1 - x0), mx = (x0 + x1) / 2, my = (y0 + y1) / 2; ctx.fillStyle = on ? col.s[1] : col.muted; ctx.beginPath(); ctx.moveTo(mx + Math.cos(ang) * 9, my + Math.sin(ang) * 9); ctx.lineTo(mx - Math.cos(ang - 0.5) * 8, my - Math.sin(ang - 0.5) * 8); ctx.lineTo(mx - Math.cos(ang + 0.5) * 8, my - Math.sin(ang + 0.5) * 8); ctx.fill(); });
    NODES.forEach((n, i) => { const [x, y] = P[i], on = i === S.a || i === S.b; ctx.beginPath(); ctx.ellipse(x, y, 40, 17, 0, 0, 7); ctx.fillStyle = col.panel; ctx.fill(); ctx.strokeStyle = on ? col.s[1] : col.muted; ctx.lineWidth = on ? 3 : 1.5; ctx.stroke(); text(ctx, n[0], x, y, { color: col.ink, size: 10.5, weight: 700, align: 'center', fit: false }); });
    const a = P[S.a], b = P[S.b], f = (t * 0.6) % 1; ctx.beginPath(); ctx.arc(mix(a[0], b[0], f), mix(a[1], b[1], f), 6, 0, 7); ctx.fillStyle = col.s[1]; ctx.fill();
    text(ctx, 'by: ' + S.who, w / 2, h - 82, { color: col.s[0], size: 11, weight: 700, align: 'center' });
    wrap(ctx, S.t, w / 2, h - 62, w - 24, { color: col.ink, size: 10.5, lh: 13 });
  });
}
