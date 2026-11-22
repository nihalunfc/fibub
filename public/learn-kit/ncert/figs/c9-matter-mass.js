// Class 9 Atomic Foundations of Matter: molecular mass and formula unit mass. Pick a substance; its atoms are drawn
// as blocks whose widths are the atomic masses (H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24, S = 32, Cl = 35.5, Ca = 40),
// stacked along a bar so the total length is the mass in u. Molecules (H2O, CO2, NH3, H2SO4) have a molecular
// mass; ionic compounds (NaCl, CaCO3, MgO) have a formula unit mass (no single molecule exists).
import { canvas, text, title, row, choice, readout } from '../../kit.js';

const AM = { H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, Cl: 35.5, Ca: 40 };
const SUBS = {
  H2O: { f: 'H₂O', a: [['H', 2], ['O', 1]], k: 'molecular mass', nm: 'water' },
  CO2: { f: 'CO₂', a: [['C', 1], ['O', 2]], k: 'molecular mass', nm: 'carbon dioxide' },
  NH3: { f: 'NH₃', a: [['N', 1], ['H', 3]], k: 'molecular mass', nm: 'ammonia' },
  H2SO4: { f: 'H₂SO₄', a: [['H', 2], ['S', 1], ['O', 4]], k: 'molecular mass', nm: 'sulphuric acid' },
  NaCl: { f: 'NaCl', a: [['Na', 1], ['Cl', 1]], k: 'formula unit mass', nm: 'sodium chloride' },
  CaCO3: { f: 'CaCO₃', a: [['Ca', 1], ['C', 1], ['O', 3]], k: 'formula unit mass', nm: 'calcium carbonate' },
};
export default function (host) {
  let s = 'H2O';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 290, label: 'Atoms drawn as blocks whose widths are atomic masses adding up to the molecular mass' });
  const ctl = row(host);
  choice(ctl, 'Substance', Object.entries(SUBS).map(([k, v]) => [k, v.f]), s, (v) => { s = v; upd(); });
  const out = readout(host);
  const tot = (d) => d.a.reduce((x, [e, n]) => x + AM[e] * n, 0);
  function upd() { const d = SUBS[s]; out.innerHTML = `${d.nm} ${d.f}: ` + d.a.map(([e, n]) => `${n} × ${AM[e]}`).join(' + ') + ` = <b>${tot(d)} u</b> (${d.k}).` + (d.k === 'formula unit mass' ? ' Ionic compounds are a lattice of ions, so we use “formula unit”.' : ''); cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const d = SUBS[s]; title(ctx, `${d.f}: ${d.k} = ${tot(d)} u`, col);
    const T = tot(d), x0 = 12, bw = w - 24; let x = x0; const y = 70;
    const C = { H: col.s[0], C: col.muted, N: col.s[4], O: col.s[1], Na: col.s[3], Mg: col.s[5], S: col.s[2], Cl: col.s[6], Ca: col.s[7] };
    d.a.forEach(([e, n]) => { for (let i = 0; i < n; i++) { const ww = (AM[e] / T) * bw; ctx.fillStyle = C[e]; ctx.globalAlpha = 0.85; ctx.fillRect(x, y, ww - 2, 46); ctx.globalAlpha = 1; text(ctx, ww > 16 ? e : '', x + ww / 2 - 1, y + 17, { color: col.panel, size: 13, weight: 700, align: 'center', fit: false }); text(ctx, ww > 18 ? `${AM[e]}` : '', x + ww / 2 - 1, y + 34, { color: col.panel, size: 10.5, align: 'center', fit: false }); x += ww; } });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y, bw, 46);
    text(ctx, '0', x0, y + 62, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, `${T} u`, x0 + bw, y + 62, { color: col.ink, size: 11.5, weight: 700, align: 'right' });
    text(ctx, 'block width ∝ atomic mass', w / 2, y - 10, { color: col.muted, size: 10.5, align: 'center' });
    d.a.forEach(([e, n], i) => text(ctx, `${n} × ${e} (${AM[e]}) = ${n * AM[e]}`, 14, 164 + i * 20, { color: col.ink, size: 12, weight: 700 }));
    text(ctx, `total = ${T} u`, 14, 164 + d.a.length * 20 + 6, { color: col.s[2], size: 13, weight: 700 });
  };
  upd();
}
