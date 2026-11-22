// A powder X-ray diffraction pattern, built peak by peak. Pick simple, body-centred or face-centred cubic, set the
// lattice constant and the wavelength: peaks appear at 2θ where λ = 2d sinθ with d = a/√(h²+k²+l²), but only for the
// (hkl) the structure factor allows (SC: all, BCC: h+k+l even, FCC: h,k,l all odd or all even). Missing ones are ghosts.
import { canvas, axes, line, text, row, slider, choice, readout, title, fmt } from '../kit.js';

const allowed = { sc: () => true, bcc: (h, k, l) => (h + k + l) % 2 === 0, fcc: (h, k, l) => ((h % 2) + 2) % 2 === ((k % 2) + 2) % 2 && ((k % 2) + 2) % 2 === ((l % 2) + 2) % 2 };
const NAMES = { sc: 'simple cubic', bcc: 'body-centred cubic', fcc: 'face-centred cubic' };
function hkls(kind, a, lam) {
  const seen = new Map();
  for (let h = 0; h <= 6; h++) for (let k = 0; k <= h; k++) for (let l = 0; l <= k; l++) {
    const N = h * h + k * k + l * l; if (!N) continue;
    const s = (lam * Math.sqrt(N)) / (2 * a); if (s > 1) continue;
    const mult = new Set(); // multiplicity: distinct signed permutations
    for (const p of [[h, k, l], [h, l, k], [k, h, l], [k, l, h], [l, h, k], [l, k, h]]) for (const sg of [1, -1]) for (const sh of [1, -1]) for (const sl of [1, -1]) mult.add([p[0] * sg, p[1] * sh, p[2] * sl].join());
    if (!seen.has(N)) seen.set(N, { N, tt: 2 * Math.asin(s) * 180 / Math.PI, ok: allowed[kind](h, k, l), hkl: `${h}${k}${l}`, m: mult.size });
  }
  return [...seen.values()];
}
export default function (host) {
  let kind = 'fcc';
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 240, label: 'Powder diffraction peaks against 2 theta' });
  const ctl = row(host);
  choice(ctl, 'Lattice', Object.entries(NAMES).map(([k]) => [k, k.toUpperCase()]), kind, (v) => { kind = v; cv.redraw(); show(); });
  const sa = slider(ctl, { label: 'a (Å)', min: 2.5, max: 6, step: 0.05, value: 4.05, fmt: (v) => v.toFixed(2), oninput: () => { cv.redraw(); show(); } });
  const sl = slider(ctl, { label: 'λ (Å)', min: 0.7, max: 2, step: 0.01, value: 1.54, fmt: (v) => v.toFixed(2), oninput: () => { cv.redraw(); show(); } });
  const out = readout(host);
  function show() {
    const P = hkls(kind, sa.value, sl.value).filter((p) => p.ok).slice(0, 4);
    out.innerHTML = `<b>${NAMES[kind]}, a = ${sa.value.toFixed(2)} Å, λ = ${sl.value.toFixed(2)} Å.</b> First peaks (hkl at 2θ): ${P.map((p) => `(${p.hkl}) ${p.tt.toFixed(1)}°`).join(' · ') || 'none'}. Ratio of sin²θ for the first peaks: ${P.slice(0, 4).map((p) => (p.N / (P[0] ? P[0].N : 1)).toFixed(2)).join(' : ')} (= N/N₁, with N = h²+k²+l²). Try a = 4.05 and λ = 1.54 for aluminium.`;
  }
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [10, 150], y: [0, 1.1], xlabel: '2θ (degrees)', ylabel: 'intensity (arb.)', l: 40, yt: [], grid: false });
    const P = hkls(kind, sa.value, sl.value), mx = Math.max(...P.filter((p) => p.ok).map((p) => p.m / Math.sqrt(p.N)), 1);
    P.forEach((p) => {
      const I = (p.m / Math.sqrt(p.N) / mx) * 0.9 + 0.05, x = A.X(p.tt);
      if (p.tt < 10 || p.tt > 150) return;
      if (p.ok) { line(ctx, [[x, A.B], [x, A.Y(I)]], col.s[0], 3); text(ctx, p.hkl, x, A.Y(I) - 7, { color: col.ink, size: 10, align: 'center', weight: 600 }); }
      else { line(ctx, [[x, A.B], [x, A.Y(0.3)]], col.muted, 1.5, [3, 3]); if (p.N <= 6) text(ctx, p.hkl, x, A.Y(0.3) - 7, { color: col.muted, size: 9.5, align: "center" }); }
    });
    title(ctx, 'Powder pattern: solid = seen, dashed = forbidden', col);
  };
  show();
}
