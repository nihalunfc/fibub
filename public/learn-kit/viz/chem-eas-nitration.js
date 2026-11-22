// Electrophilic aromatic substitution, nitration of benzene, then "where does the next group go?". Steps 1 to 4 show NO₂⁺ forming,
// the ring's π electrons attacking it (the slow step, giving the arenium ion), and the loss of H⁺ that restores aromaticity.
// Step 5 lets you pick a group already on the ring: activating groups (OH, CH₃) send the NO₂ to ortho and para, deactivating
// ones (NO₂) to meta, and halogens are deactivating yet ortho/para directing. The bars give the typical product mix.
import { canvas, text, row, choice, button, readout, title } from '../kit.js';
import { curved } from './_chem.js';

const S = ['Make the electrophile NO₂⁺', 'Ring π electrons attack NO₂⁺ (slow)', 'The arenium ion (sigma complex)', 'Loss of H⁺ restores the ring', 'Where does the next group go?'];
const SUB = {
  oh: ['OH', 'activating, ortho/para', [40, 2, 58], 'much faster than benzene (about 10³×)', 'The O lone pair donates into the ring (+M), putting extra negative charge on the o and p carbons.'],
  me: ['CH₃', 'activating, ortho/para', [59, 4, 37], 'about 25× faster than benzene', 'The methyl group donates (+I and hyperconjugation), stabilising the arenium ion when + sits next to it (o or p attack).'],
  cl: ['Cl', 'deactivating but ortho/para', [30, 1, 69], 'about 0.03× (slower than benzene)', 'Cl withdraws through σ (−I), slowing the ring, but its lone pairs stabilise the o/p arenium ion (+M), so it still directs there.'],
  no2: ['NO₂', 'deactivating, meta', [6, 93, 1], 'about 10⁻⁷× (very slow)', 'NO₂ withdraws (−M, −I). For o/p attack one resonance form puts + right on the carbon bearing NO₂, which is worst, so meta attack is the least bad.'],
};
function hex(ctx, cx, cy, r, color, lw = 2.2, skip = -1) { for (let k = 0; k < 6; k++) { if (k === skip) continue; const a = (Math.PI / 3) * k - Math.PI / 2, b = (Math.PI / 3) * (k + 1) - Math.PI / 2; ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a)); ctx.lineTo(cx + r * Math.cos(b), cy + r * Math.sin(b)); ctx.stroke(); } }
export default function (host) {
  let i = 0, sub = 'me';
  const cv = canvas(host, { aspect: 0.62, max: 300, min: 250, label: 'Mechanism of benzene nitration drawn step by step and the directing effect of substituents' });
  choice(row(host), 'Group on the ring (step 5)', Object.entries(SUB).map(([k, v]) => [k, v[0]]), sub, (v) => { sub = v; go(i); });
  const own = !host.classList.contains('lk-stage');
  if (own) { const c = row(host); button(c, '◀ Back', () => go(i - 1)); button(c, 'Next ▶', () => go(i + 1)); }
  const out = readout(host);
  function go(k) {
    i = Math.max(0, Math.min(4, k));
    const t = [
      'Conc. HNO₃ + conc. H₂SO₄ ("nitrating mixture"): H₂SO₄ protonates HNO₃, which loses water: HNO₃ + 2H₂SO₄ → NO₂⁺ + H₃O⁺ + 2HSO₄⁻. NO₂⁺ is linear and a strong electrophile.',
      'The delocalised π cloud of benzene is a weak nucleophile; two of its electrons form a bond to N. This breaks aromaticity, so it is the slow, rate-determining step (activation energy high).',
      'The carbon that took NO₂ is sp³ (it still has its H). The + is spread over the other five carbons, mostly on the ortho and para positions (three resonance forms).',
      'HSO₄⁻ (or H₂O) removes H⁺ from the sp³ carbon; the C–H electrons return to the ring, restoring the aromatic sextet. Product: nitrobenzene, with H₂SO₄ regenerated. Fast, because aromaticity is regained.',
      `<b>${SUB[sub][0]}</b> is ${SUB[sub][1]}; ring reactivity ${SUB[sub][3]}. ${SUB[sub][4]} Typical nitration mix (% ortho, meta, para): ${SUB[sub][2].join(' : ')}.`,
    ][i];
    out.innerHTML = `<b>Step ${i + 1}: ${S[i].replace(/\?$/, '')}.</b> ${t}`; cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, S[i], col);
    const r = Math.min(w / 8, 46), cx = w * 0.36, cy = 112;
    if (i === 0) {
      text(ctx, 'HNO₃ + 2 H₂SO₄', w / 2, 70, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, '↓', w / 2, 92, { color: col.muted, size: 16, align: 'center' });
      text(ctx, 'O=N⁺=O  +  H₃O⁺  +  2 HSO₄⁻', w / 2, 120, { color: col.s[1], size: 15, weight: 700, align: 'center' }); text(ctx, 'NO₂⁺ (nitronium ion): linear, no lone pair on N', w / 2, 148, { color: col.muted, size: 11, align: 'center' });
    } else if (i <= 3) {
      hex(ctx, cx, cy, r, col.ink); if (i === 1 || i === 3) { ctx.beginPath(); ctx.arc(cx, cy, r * 0.6, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2; ctx.stroke(); }
      if (i === 1) { text(ctx, 'NO₂⁺', cx + r * 2.3, cy, { color: col.s[1], size: 14, weight: 700, align: 'center' }); curved(ctx, cx + r * 0.5, cy - r * 0.4, cx + r * 1.7, cy - 4, col.s[0], -22); text(ctx, 'π electrons', cx, cy + r + 16, { color: col.s[0], size: 11, align: 'center' }); }
      if (i === 2) { ctx.save(); ctx.fillStyle = col.panel; ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0, 7); ctx.fill(); ctx.restore(); ctx.beginPath(); ctx.arc(cx, cy, r * 0.62, 0.3, 4.6); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 2.5; ctx.stroke(); text(ctx, '+', cx, cy, { color: col.s[5], size: 20, weight: 800, align: 'center' }); const a = (Math.PI / 3) * 0 - Math.PI / 2; text(ctx, 'H', cx + r * 0.95 * Math.cos(a) + 12, cy + r * 0.95 * Math.sin(a) - 4, { color: col.ink, size: 12, weight: 700 }); text(ctx, 'NO₂', cx + r * 0.9 * Math.cos(a) - 28, cy + r * 0.95 * Math.sin(a) - 10, { color: col.s[1], size: 11, weight: 700 }); [1, 3, 5].forEach((k) => { const q = (Math.PI / 3) * k - Math.PI / 2; text(ctx, 'δ+', cx + (r + 14) * Math.cos(q), cy + (r + 14) * Math.sin(q), { color: col.s[5], size: 10, weight: 700, align: 'center', fit: false }); }); text(ctx, 'o, p, o carbons carry the +', cx, cy + r + 24, { color: col.muted, size: 10, align: 'center' }); }
      if (i === 3) { text(ctx, 'NO₂', cx + r * 0.2, cy - r - 12, { color: col.s[1], size: 12, weight: 700, align: 'center' }); text(ctx, '+ H₂SO₄', cx + r * 2.6, cy, { color: col.muted, size: 12, weight: 700 }); text(ctx, 'nitrobenzene: ring aromatic again', cx, cy + r + 18, { color: col.muted, size: 10, align: 'center' }); curved(ctx, cx + r * 1.9, cy - r * 0.8, cx + r * 0.9, cy - r * 0.5, col.s[1], 16); }
    } else {
      const sx = cx; hex(ctx, sx, cy, r, col.ink);
      text(ctx, SUB[sub][0], sx, cy - r - 12, { color: col.s[0], size: 13, weight: 700, align: 'center' });
      const pos = [[1, 'o'], [5, 'o'], [2, 'm'], [4, 'm'], [3, 'p']], pct = SUB[sub][2];
      pos.forEach(([k, t]) => { const a = (Math.PI / 3) * k - Math.PI / 2, v = t === 'o' ? pct[0] / 2 : t === 'm' ? pct[1] / 2 : pct[2]; ctx.beginPath(); ctx.arc(sx + (r + 17) * Math.cos(a), cy + (r + 17) * Math.sin(a), 6 + Math.sqrt(v) * 0.9, 0, 7); ctx.fillStyle = t === 'm' ? col.s[3] : col.s[2]; ctx.globalAlpha = 0.25 + v / 80; ctx.fill(); ctx.globalAlpha = 1; text(ctx, t, sx + (r + 17) * Math.cos(a), cy + (r + 17) * Math.sin(a), { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); });
      const bx = w * 0.62, bh = 70; [['ortho', pct[0], col.s[2]], ['meta', pct[1], col.s[3]], ['para', pct[2], col.s[2]]].forEach(([n, v, c], j) => { const x = bx + j * 36; ctx.fillStyle = c; ctx.fillRect(x, cy + 30 - (v / 100) * bh, 26, (v / 100) * bh); text(ctx, v + '%', x + 13, cy + 22 - (v / 100) * bh, { color: col.ink, size: 10, weight: 700, align: 'center', fit: false }); text(ctx, n, x + 13, cy + 42, { color: col.muted, size: 9, align: 'center', fit: false }); });
    }
    text(ctx, `step ${i + 1} of ${S.length}`, w - 8, h - 8, { color: col.muted, size: 10, align: 'right' });
  };
  go(0);
  return { step: (k) => go(k) };
}
