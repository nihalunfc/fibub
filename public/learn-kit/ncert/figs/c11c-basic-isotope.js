// Class 11 Chemistry, Some Basic Concepts: average atomic mass from isotope abundance. Chlorine has Cl-35 (34.969 u) and Cl-37 (36.966 u).
// Average = sum of (abundance fraction x isotopic mass). Natural abundance is about 75.8 % Cl-35 (IUPAC), giving 35.45 u.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const EL = { cl: ['Cl', [['³⁵Cl', 34.969], ['³⁷Cl', 36.966]], 75.8], cu: ['Cu', [['⁶³Cu', 62.930], ['⁶⁵Cu', 64.928]], 69.2], b: ['B', [['¹⁰B', 10.013], ['¹¹B', 11.009]], 19.9], mg: ['Mg', [['²⁴Mg', 23.985], ['²⁶Mg', 25.983]], 80] };
export default function (host) {
  let k = 'cl', p = 75.8;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 300, label: 'Isotope abundance bars and the weighted average atomic mass' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'element', Object.entries(EL).map(([a, b]) => [a, b[0]]), k, (v) => { k = v; p = EL[k][2]; sl.set(p); go(); });
  const sl = slider(ctl, { label: 'light isotope (%)', min: 0, max: 100, step: 0.5, value: p, fmt: (v) => v.toFixed(1), oninput: (v) => { p = v; go(); } });
  const avg = () => { const I = EL[k][1]; return (p * I[0][1] + (100 - p) * I[1][1]) / 100; };
  const go = () => { const I = EL[k][1]; ro.textContent = `(${p.toFixed(1)}/100) × ${I[0][1]} + (${(100 - p).toFixed(1)}/100) × ${I[1][1]} = ${avg().toFixed(2)} u. Slide to the real value to match the periodic table.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const I = EL[k][1], t0 = title(ctx, `average mass of ${EL[k][0]}`, col) + 14, L = 36, W = w - 2 * L, bb = h - 60, H = bb - t0 - 10;
    I.forEach((a, i) => { const pc = i ? 100 - p : p, bw = W * 0.3, x = L + W * (i ? 0.62 : 0.08); ctx.fillStyle = col.s[i]; ctx.fillRect(x, bb - H * pc / 100, bw, H * pc / 100); text(ctx, `${a[0]}`, x + bw / 2, bb + 14, { color: col.ink, size: 13, weight: 700, align: 'center' }); text(ctx, `${a[1]} u`, x + bw / 2, bb + 30, { color: col.muted, size: 11, align: 'center' }); text(ctx, `${pc.toFixed(1)} %`, x + bw / 2, bb - H * pc / 100 - 8, { color: col.ink, size: 12, weight: 700, align: 'center' }); });
    ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(L - 4, bb); ctx.lineTo(L + W, bb); ctx.stroke();
    text(ctx, `average = ${avg().toFixed(2)} u`, w / 2, bb + 48, { color: col.s[2], size: 14, weight: 700, align: 'center' });
  };
  go();
}
