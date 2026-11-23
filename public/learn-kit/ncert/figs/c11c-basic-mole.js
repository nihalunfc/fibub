// Class 11 Chemistry, Some Basic Concepts: the mole bridge. grams / molar mass = moles; moles x N_A = particles.
// N_A = 6.022 x 10^23 per mol (exact since 2019). Gases: 1 mol occupies 22.7 L at 273.15 K and 1 bar (22.4 L at 1 atm).
// Each dot stands for a round number of particles so a pile of 10^24 particles can be "seen".
import { canvas, text, title, row, slider, choice, readout, arrow } from '../../kit.js';

const S = { h2o: ['H₂O', 18.015, 'molecules', 3, 0], co2: ['CO₂', 44.01, 'molecules', 3, 1], nacl: ['NaCl', 58.44, 'formula units', 2, 0], c: ['C', 12.011, 'atoms', 1, 0], o2: ['O₂', 31.998, 'molecules', 2, 1], glu: ['C₆H₁₂O₆', 180.16, 'molecules', 24, 0] };
export default function (host) {
  let k = 'h2o', g = 36;
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 300, label: 'Grams converted to moles and to a count of particles for a chosen substance' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'substance', Object.entries(S).map(([a, b]) => [a, b[0]]), k, (v) => { k = v; go(); });
  slider(ctl, { label: 'mass (g)', min: 1, max: 200, step: 1, value: g, fmt: (v) => v.toFixed(0), oninput: (v) => { g = v; go(); } });
  const go = () => { const s = S[k], mol = g / s[1], N = mol * 6.022e23; ro.textContent = `${g} g ÷ ${s[1]} g/mol = ${mol.toFixed(3)} mol; × 6.022×10²³ = ${N.toExponential(2)} ${s[2]}` + (s[3] > 1 ? `, which is ${(N * s[3]).toExponential(2)} atoms in all.` : '.') + (s[4] ? ` As a gas at 273 K and 1 bar it fills ${(mol * 22.7).toFixed(1)} L.` : ''); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = S[k], mol = g / s[1], N = mol * 6.022e23, t0 = title(ctx, 'grams → moles → particles', col) + 10;
    const bw = (w - 40) / 3, by = t0 + 6, bh = 56;
    [[`${g} g`, 'mass', 0], [`${mol.toFixed(2)} mol`, 'amount', 1], [N.toExponential(1), s[2], 2]].forEach(([a, b, i]) => {
      const x = 10 + i * (bw + 10); ctx.strokeStyle = col.s[i]; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.fillRect(x, by, bw, bh); ctx.strokeRect(x, by, bw, bh);
      text(ctx, a, x + bw / 2, by + 22, { color: col.ink, size: 14, weight: 700, align: 'center' }); text(ctx, b, x + bw / 2, by + 42, { color: col.muted, size: 11, align: 'center' });
    });
    text(ctx, `÷ ${s[1]}`, 10 + bw + 5, by + bh + 14, { color: col.s[1], size: 11, weight: 700, align: 'center' }); text(ctx, '× 6.022e23', 15 + 2 * bw + 5, by + bh + 14, { color: col.s[2], size: 11, weight: 700, align: 'center' });
    arrow(ctx, 10 + bw, by + bh / 2, 20 + bw, by + bh / 2, col.ink, 2, 6); arrow(ctx, 20 + 2 * bw, by + bh / 2, 30 + 2 * bw, by + bh / 2, col.ink, 2, 6);
    const unit = Math.pow(10, Math.ceil(Math.log10(N / 90))), n = Math.min(120, Math.round(N / unit)), y0 = by + bh + 34, per = Math.floor((w - 20) / 14);
    for (let i = 0; i < n; i++) { ctx.fillStyle = col.s[k === 'nacl' ? 4 : 0]; ctx.beginPath(); ctx.arc(14 + (i % per) * 14, y0 + 8 + Math.floor(i / per) * 14, 4.5, 0, 7); ctx.fill(); }
    text(ctx, `each dot = ${unit.toExponential(0)} ${s[2]}`, 10, h - 12, { color: col.muted, size: 11 });
  };
  go();
}
