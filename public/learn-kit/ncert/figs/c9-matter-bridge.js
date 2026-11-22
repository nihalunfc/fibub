// Class 9 Atomic Foundations of Matter: the mole bridge. Mass in grams, amount in moles and number of particles are linked by
// molar mass M (g/mol) and Avogadro's number N_A = 6.022e23 per mol: n = m / M and N = n x N_A. Pick a substance and
// drag its mass; the figure shows the three quantities side by side, with a rows of atoms-per-mole bar.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

const S = { H2O: ['H₂O (water)', 18, 'molecules'], CO2: ['CO₂', 44, 'molecules'], C: ['carbon', 12, 'atoms'], Fe: ['iron', 56, 'atoms'], NaCl: ['NaCl (salt)', 58.5, 'formula units'], O2: ['O₂ (oxygen gas)', 32, 'molecules'] };
const NA = 6.022e23;
export default function (host) {
  let k = 'H2O', m = 36;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Mass in grams moles and number of particles for a chosen substance linked by molar mass and Avogadro number' });
  const ctl = row(host);
  choice(ctl, 'Substance', Object.entries(S).map(([v, d]) => [v, d[0].split(' ')[0]]), k, (v) => { k = v; upd(); });
  slider(ctl, { label: 'Mass', min: 1, max: 200, step: 1, value: m, fmt: (v) => `${v} g`, oninput: (v) => { m = v; upd(); } });
  const out = readout(host);
  const sci = (x) => { const e = Math.floor(Math.log10(x)); return `${(x / 10 ** e).toFixed(2)} × 10${String(e).split('').map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹⁻'['0123456789-'.indexOf(d)]).join('')}`; };
  function upd() { const [nm, M, unit] = S[k], n = m / M, N = n * NA; out.innerHTML = `${nm}: M = ${M} g/mol. n = ${m} ÷ ${M} = <b>${n.toFixed(3)} mol</b>. Number = ${n.toFixed(3)} × 6.022 × 10²³ = <b>${sci(N)} ${unit}</b>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const [nm, M, unit] = S[k], n = m / M, N = n * NA; title(ctx, `${nm}: grams, moles, particles`, col);
    const bx = [w * 0.16, w * 0.5, w * 0.84], lab = [['mass', `${m} g`], ['amount', `${n.toFixed(2)} mol`], ['number', sci(N)]];
    lab.forEach(([a, b], i) => { ctx.strokeStyle = col.s[i * 2]; ctx.lineWidth = 2; ctx.fillStyle = col.soft; ctx.fillRect(bx[i] - w * 0.1, 56, w * 0.2, 64); ctx.strokeRect(bx[i] - w * 0.1, 56, w * 0.2, 64); text(ctx, a, bx[i], 72, { color: col.muted, size: 10.5, align: 'center' }); text(ctx, b, bx[i], 98, { color: col.ink, size: 11.5, weight: 700, align: 'center' }); });
    text(ctx, `÷ ${M} g/mol`, (bx[0] + bx[1]) / 2, 138, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); text(ctx, '→', (bx[0] + bx[1]) / 2, 88, { color: col.s[2], size: 16, align: 'center' });
    text(ctx, '× 6.022×10²³', (bx[1] + bx[2]) / 2, 138, { color: col.s[4], size: 10.5, weight: 700, align: 'center' }); text(ctx, '→', (bx[1] + bx[2]) / 2, 88, { color: col.s[4], size: 16, align: 'center' });
    text(ctx, `${unit}`, bx[2], 112, { color: col.muted, size: 9.5, align: 'center' });
    // 1 mole bar vs this sample
    const x0 = 14, bw = w - 28; text(ctx, `your sample is ${(n).toFixed(2)} mole${n === 1 ? '' : 's'}`, 14, 166, { color: col.ink, size: 12, weight: 700 });
    ctx.fillStyle = col.line; ctx.fillRect(x0, 176, bw, 16); ctx.fillStyle = col.s[2]; ctx.fillRect(x0, 176, Math.min(bw, bw * n / 5), 16);
    text(ctx, '0', x0, 204, { color: col.muted, size: 10 }); text(ctx, '5 mol', x0 + bw, 204, { color: col.muted, size: 10, align: 'right' });
    text(ctx, `1 mole of ${nm.split(' ')[0]} weighs ${M} g`, w / 2, h - 34, { color: col.s[3], size: 12, weight: 700, align: 'center' });
    text(ctx, 'molar mass in g/mol = the atomic or molecular mass in u', w / 2, h - 14, { color: col.muted, size: 10.5, align: 'center' });
  };
  upd();
}
