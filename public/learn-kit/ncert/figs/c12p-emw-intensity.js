// Class 12 Electromagnetic Waves: energy and intensity. A source of power P spreads its wave over a sphere, so the
// intensity is I = P/(4 pi r^2). For a plane wave I = (1/2) eps0 c E0^2, so E0 = sqrt(2I/(eps0 c)) and B0 = E0/c. The wave
// also carries momentum: radiation pressure on a perfect absorber = I/c. Choose a source and a distance.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const sci = (x, d = 3) => { const e = Math.floor(Math.log10(Math.abs(x))); return e >= -2 && e <= 4 ? String(+x.toPrecision(d)) : `${(x / 10 ** e).toPrecision(d)} × 10<sup>${e}</sup>`; };

export default function (host) {
  const S = [
    { n: '100 W bulb', P: 100, r0: 0.5, r1: 100, unit: 'm', k: 1 },
    { n: 'Mobile tower 20 W', P: 20, r0: 5, r1: 1000, unit: 'm', k: 1 },
    { n: 'Sun', P: 3.846e26, r0: 0.39, r1: 30, unit: 'AU', k: 1.496e11 },
  ];
  let si = 0, pos = 0.4;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 280, label: 'Intensity of an electromagnetic wave falling as one over distance squared, with field amplitudes' });
  const dist = () => S[si].r0 * Math.pow(S[si].r1 / S[si].r0, pos);
  const ctl = row(host);
  choice(ctl, 'Source', S.map((s, i) => [i, s.n]), si, (v) => { si = v; sl.set(pos); upd(); });
  const sl = slider(ctl, { label: 'Distance (log scale)', min: 0, max: 1, step: 0.01, value: pos, fmt: () => `${dist().toPrecision(3)} ${S[si].unit}`, oninput: (v) => { pos = v; upd(); } });
  const out = readout(host);
  const eps0 = 8.854e-12, c = 3e8;
  const Iof = (r) => S[si].P / (4 * Math.PI * (r * S[si].k) ** 2);
  function upd() {
    const r = dist(), I = Iof(r), E0 = Math.sqrt((2 * I) / (eps0 * c)), B0 = E0 / c;
    out.innerHTML = `I = P/4πr² = <b>${sci(I)} W/m²</b>. E₀ = √(2I/ε₀c) = <b>${sci(E0)} V/m</b>, B₀ = E₀/c = <b>${sci(B0 * 1e9)} nT</b>. Radiation pressure on a black surface = I/c = <b>${sci(I / c)} Pa</b>. Half the energy sits in E, half in B.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `Intensity from the ${S[si].n === 'Sun' ? 'Sun' : S[si].n}`, col);
    const s = S[si], r = dist(), lo = Iof(s.r1), hi = Iof(s.r0);
    const ax = axes(ctx, w, h, col, { x: [s.r0, s.r1], y: [lo * 0.7, hi * 1.4], xlog: true, ylog: true, t: top + 6, xlabel: `distance (${s.unit})`, ylabel: 'intensity (W/m²)', l: 58 });
    ctx.save(); ax.clip(); const p = []; for (let k = 0; k <= 80; k++) { const rr = s.r0 * Math.pow(s.r1 / s.r0, k / 80); p.push([ax.X(rr), ax.Y(Iof(rr))]); } line(ctx, p, col.s[0], 2.5); ctx.restore();
    dot(ctx, ax.X(r), ax.Y(Iof(r)), 6.5, col.s[3], col.panel);
    text(ctx, 'I ∝ 1/r²', ax.X(Math.sqrt(s.r0 * s.r1)), ax.Y(Iof(Math.sqrt(s.r0 * s.r1))) - 14, { color: col.s[0], size: 12, weight: 700, align: 'center', halo: col.panel });
  };
  upd();
}
