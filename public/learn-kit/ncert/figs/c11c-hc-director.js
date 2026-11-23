// Class 11 Chemistry, Hydrocarbons: directing influence of a group already on the benzene ring in nitration. Electron-donating or lone-pair groups (-OH, -CH3, -Cl) direct the new group to ortho and para;
// electron-withdrawing groups (-NO2) direct to meta and deactivate the ring. -Cl is the exception that deactivates but is still o/p-directing. Typical nitration product distributions (% o / m / p) and rates relative to benzene:
// toluene 58/4/38 (25x), phenol ~40/<1/60 (about 10^3x, dilute HNO3), chlorobenzene 30/1/69 (0.03x), nitrobenzene 6/93/1 (6e-8x). (Ingold; March's Advanced Organic Chemistry, tables of nitration isomer distributions.)
import { canvas, text, title, choice, readout, row } from '../../kit.js';

const G = {
  oh: { n: '–OH', o: 40, m: 1, p: 59, rate: 1000, k: 'strongly activating, o/p', why: 'The oxygen lone pair flows into the ring (resonance), enriching the ortho and para carbons.' },
  me: { n: '–CH₃', o: 58, m: 4, p: 38, rate: 25, k: 'activating, o/p', why: 'Alkyl groups push electrons (+I and hyperconjugation), stabilising attack at ortho and para.' },
  cl: { n: '–Cl', o: 30, m: 1, p: 69, rate: 0.03, k: 'deactivating but o/p', why: 'Chlorine pulls electrons through σ bonds (−I, slows the reaction) but its lone pairs can donate by resonance to ortho and para positions.' },
  no2: { n: '–NO₂', o: 6, m: 93, p: 1, rate: 0.00000006, k: 'strongly deactivating, meta', why: 'The nitro group withdraws electrons by −I and resonance, leaving the meta position the least electron-poor.' },
};
export default function (host) {
  let k = 'me';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'A benzene ring with a substituent and the percentage of ortho, meta and para nitration products' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'group already on the ring', Object.entries(G).map(([a, d]) => [a, d.n]), k, (v) => { k = v; go(); });
  const go = () => { const g = G[k]; ro.textContent = `${g.n}: ${g.k}. ${g.why} Rate of nitration compared with benzene (= 1): ${g.rate >= 1 ? '×' + g.rate : g.rate < 1e-3 ? '≈ 6 × 10⁻⁸' : '×' + g.rate}.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const g = G[k], top = title(ctx, `Nitration of C₆H₅–${g.n.replace('–', '')}`, col) + 6, cx = w / 2, cy = top + 78, r = 42;
    const pos = [[-Math.PI / 2, g.n, null], [-Math.PI / 6, 'ortho', g.o], [Math.PI / 6, 'meta', g.m], [Math.PI / 2, 'para', g.p], [(5 * Math.PI) / 6, 'meta', g.m], [(7 * Math.PI) / 6, 'ortho', g.o]];
    ctx.beginPath(); for (let i = 0; i < 6; i++) { const a = pos[i][0]; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, 7); ctx.strokeStyle = col.s[0]; ctx.lineWidth = 1.5; ctx.stroke();
    pos.forEach(([a, l, pct], i) => { const x = cx + (r + 24) * Math.cos(a), y = cy + (r + 24) * Math.sin(a); if (i === 0) { text(ctx, g.n, x, y, { color: col.ink, size: 13, weight: 700, align: 'center' }); return; } const big = pct >= 30; ctx.beginPath(); ctx.arc(x, y, 6 + Math.sqrt(pct) * 1.7, 0, 7); ctx.fillStyle = big ? col.s[3] : col.s[0]; ctx.globalAlpha = big ? 0.85 : 0.35; ctx.fill(); ctx.globalAlpha = 1; });
    // bars
    const by = cy + r + 60, bw = w - 140; text(ctx, 'product mixture (%)', 10, by - 14, { color: col.muted, size: 10.5 });
    [['ortho', g.o], ['meta', g.m], ['para', g.p]].forEach(([l, v], i) => { const y = by + i * 26; text(ctx, l, 10, y + 8, { color: col.ink, size: 11.5, weight: 700 }); ctx.fillStyle = col.line; ctx.fillRect(64, y, bw, 16); ctx.fillStyle = v >= 30 ? col.s[3] : col.s[0]; ctx.fillRect(64, y, bw * v / 100, 16); text(ctx, v + '%', 68 + bw * v / 100, y + 8, { color: col.ink, size: 11, weight: 700 }); });
    text(ctx, g.k, w / 2, by + 92, { color: col.ink, size: 12, weight: 700, align: 'center' });
  };
  go();
}
