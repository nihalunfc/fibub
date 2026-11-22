// Class 12 Molecular Basis of Inheritance: Chargaff's rules. In double-stranded DNA every A pairs with a T and every G with a C,
// so %A = %T, %G = %C and purines (A + G) = pyrimidines (T + C) = 50 %. In a single-stranded genome (some viruses) there is no pairing, so the rule fails.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

export default function (host) {
  let a = 30, mode = 'ds';
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 290, label: 'Bar chart of the percentage of the four DNA bases for a chosen percentage of adenine' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: '% of A', min: 10, max: 45, step: 1, value: a, fmt: (v) => v + ' %', oninput: (v) => { a = v; go(); } });
  choice(ctl, 'Genome', [['ds', 'Double-stranded DNA'], ['ss', 'Single-stranded (virus)']], mode, (v) => { mode = v; go(); });
  const vals = () => {
    if (mode === 'ds') { const g = 50 - a; return { A: a, T: a, G: g, C: g }; }
    const g = Math.round(30 - a * 0.3), c = Math.round(20 + a * 0.1); return { A: a, T: 100 - a - g - c, G: g, C: c };
  };
  const go = () => {
    const v = vals(), pur = v.A + v.G, pyr = v.T + v.C;
    ro.textContent = mode === 'ds' ? `A = T = ${v.A} %, G = C = ${v.G} %. Purines A + G = ${pur} %, pyrimidines T + C = ${pyr} %. Equal, because every purine sits opposite a pyrimidine.` : `Without a second strand nothing forces A to equal T: A = ${v.A} %, T = ${v.T} %, G = ${v.G} %, C = ${v.C} %. A + G = ${pur} % is not equal to T + C = ${pyr} %.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, mode === 'ds' ? 'Chargaff: A = T and G = C' : 'Single strand: no pairing, no rule', col) + 14, v = vals();
    const names = ['A', 'T', 'G', 'C'], cs = [col.s[0], col.s[3], col.s[2], col.s[1]], L = 40, bw = (w - 2 * L) / 4 - 14, base = h - 52, hh = base - top - 20;
    names.forEach((n, i) => {
      const x = L + i * (bw + 14) + 7, val = v[n], bh = (val / 50) * hh;
      ctx.fillStyle = cs[i]; ctx.fillRect(x, base - bh, bw, bh);
      text(ctx, val + ' %', x + bw / 2, base - bh - 9, { color: col.ink, size: 12, weight: 700, align: 'center' });
      text(ctx, n, x + bw / 2, base + 14, { color: col.ink, size: 15, weight: 700, align: 'center' });
    });
    text(ctx, 'Purines (A, G)  |  Pyrimidines (T, C)', w / 2, base + 34, { color: col.muted, size: 11, align: 'center' });
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L - 4, base + 0.5); ctx.lineTo(w - L + 4, base + 0.5); ctx.stroke();
  };
  go();
}
