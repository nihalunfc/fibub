// Class 12 Chemistry, Amines: basic strength in water. Pick a series, slide the pH, and see how much of each amine is protonated (RNH3+).
// pKb = -log Kb; the conjugate acid has pKaH = 14 - pKb. Fraction protonated = 1 / (1 + 10^(pH - pKaH)). Aliphatic amines (+I groups push electrons onto N) are stronger than ammonia;
// in water the 2 deg amine is the strongest, because hydration of the cation (fewer N-H to bond to water in 3 deg) and steric crowding work against the third alkyl group. Aryl amines are weak because the lone pair is delocalised into the ring.
// pKb at 298 K (CRC Handbook): NH3 4.75; CH3NH2 3.38; (CH3)2NH 3.27; (CH3)3N 4.22; C2H5NH2 3.29; (C2H5)2NH 3.00; (C2H5)3N 3.25; C6H5NH2 9.38; 4-CH3C6H4NH2 8.92; 4-O2NC6H4NH2 13.0; C6H5CH2NH2 4.66.
import { canvas, text, title, row, choice, slider, readout } from '../../kit.js';

const S = {
  me: ['methyl series', [['NH₃', 4.75], ['CH₃NH₂', 3.38], ['(CH₃)₂NH', 3.27], ['(CH₃)₃N', 4.22]]],
  et: ['ethyl series', [['NH₃', 4.75], ['C₂H₅NH₂', 3.29], ['(C₂H₅)₂NH', 3.0], ['(C₂H₅)₃N', 3.25]]],
  ar: ['aryl amines', [['NH₃', 4.75], ['C₆H₅CH₂NH₂', 4.66], ['4-CH₃-C₆H₄NH₂', 8.92], ['C₆H₅NH₂', 9.38], ['4-NO₂-C₆H₄NH₂', 13.0]]],
};
export default function (host) {
  let s = 'me', pH = 10;
  const cv = canvas(host, { aspect: 0.9, max: 380, min: 310, label: 'Basic strength (pKb) of amines in a series with the fraction protonated at a chosen pH' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'series', Object.entries(S).map(([id, o]) => [id, o[0]]), s, (v) => { s = v; go(); });
  slider(ctl, { label: 'pH of the solution', min: 0, max: 14, step: 0.1, value: pH, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; go(); } });
  const f = (pKb) => 1 / (1 + Math.pow(10, pH - (14 - pKb)));
  const go = () => {
    const L = S[s][1], best = L.reduce((a, b) => (b[1] < a[1] ? b : a));
    ro.textContent = `Strongest base in this series: ${best[0]} (pKb ${best[1]}). Smaller pKb = stronger base. At pH ${pH.toFixed(1)}: ` + L.map((x) => `${x[0]} ${(100 * f(x[1])).toFixed(f(x[1]) < 0.01 ? 2 : 0)} %`).join(', ') + ' protonated.';
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const L = S[s][1], top = title(ctx, 'Base strength: longer bar = stronger base', col), n = L.length, y0 = top + 14, rh = (h - y0 - 60) / n, x0 = w * 0.36, bw = w - x0 - 56;
    const best = Math.min(...L.map((x) => x[1]));
    L.forEach(([nm, pKb], i) => {
      const y = y0 + rh * i + rh / 2, len = bw * (14 - pKb) / 11;
      text(ctx, nm, x0 - 8, y - 7, { color: col.ink, size: 11.5, weight: 700, align: 'right' }); text(ctx, 'pKb ' + pKb, x0 - 8, y + 8, { color: col.muted, size: 10, align: 'right' });
      ctx.fillStyle = col.soft; ctx.fillRect(x0, y - 11, bw, 22); ctx.fillStyle = pKb === best ? col.s[3] : col.s[0]; ctx.globalAlpha = pKb === best ? 1 : 0.7; ctx.fillRect(x0, y - 11, len, 22); ctx.globalAlpha = 1;
      const fr = f(pKb); ctx.fillStyle = col.s[1]; ctx.fillRect(x0, y + 7, bw * fr, 4);
      text(ctx, (100 * fr).toFixed(fr < 0.01 && fr > 0 ? 1 : 0) + '%', x0 + bw + 4, y + 8, { color: col.s[1], size: 10, weight: 700 });
    });
    text(ctx, 'thin green line: % protonated (RNH₃⁺) at the chosen pH', w / 2, h - 36, { color: col.s[1], size: 10.5, align: 'center' });
    text(ctx, s === 'ar' ? 'ring pulls the lone pair in: weaker; –NO₂ makes it weaker still' : s === 'me' ? 'secondary amine strongest; tertiary is crowded and poorly hydrated' : 'with bigger groups the +I effect wins: 2° strongest again', w / 2, h - 18, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
