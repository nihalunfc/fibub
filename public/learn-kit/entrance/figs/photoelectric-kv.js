// Dual nature: the photoelectric effect. Top: maximum kinetic energy of photoelectrons against light frequency for
// three metals (parallel lines of slope h, starting at each metal's threshold). Bottom: photocurrent against anode
// voltage; brighter light raises the saturation current but not the stopping potential. Work functions are typical
// textbook values and vary with the surface.
import { canvas, axes, line, dot, row, slider, choice, readout, text, fmt } from '../../kit.js';

const H = 4.136e-15; // eV s
const METALS = { cs: { name: 'Caesium', phi: 2.14 }, na: { name: 'Sodium', phi: 2.75 }, zn: { name: 'Zinc', phi: 4.3 } };
export default function (host) {
  let key = 'na', f = 9, inten = 1; // f in 10¹⁴ Hz
  const cv = canvas(host, { aspect: 0.95, max: 520, min: 360, label: 'Photoelectric effect: kinetic energy against frequency, and current against voltage' });
  const ctl = row(host);
  choice(ctl, 'Metal', Object.entries(METALS).map(([k, m]) => [k, m.name]), key, (v) => { key = v; upd(); });
  slider(ctl, { label: 'Frequency', min: 3, max: 15, step: 0.1, value: f, fmt: (v) => `${v} × 10¹⁴ Hz`, oninput: (v) => { f = v; upd(); } });
  slider(ctl, { label: 'Intensity', min: 0.25, max: 2, step: 0.25, value: inten, fmt: (v) => `${v} ×`, oninput: (v) => { inten = v; upd(); } });
  const out = readout(host);
  const K = (m) => H * f * 1e14 - m.phi;
  const upd = () => {
    cv.redraw();
    const m = METALS[key], k = K(m), f0 = m.phi / H / 1e14;
    out.innerHTML = `Photon energy hf = ${fmt(H * f * 1e14, 3)} eV (λ = ${fmt(3e8 / (f * 1e14) * 1e9, 3)} nm). ${m.name}: work function ${m.phi} eV, threshold ${fmt(f0, 3)} × 10¹⁴ Hz. ` +
      (k > 0 ? `K<sub>max</sub> = <b>${fmt(k, 3)} eV</b>, stopping potential <b>${fmt(k, 3)} V</b>.` : '<b>No electrons</b>: below the threshold, however bright the light.');
  };
  cv.draw = (ctx, w, h, col) => {
    const m = METALS[key], h1 = h * 0.55;
    const A = axes(ctx, w, h1, col, { x: [0, 15], y: [0, 4], xlabel: 'frequency (× 10¹⁴ Hz)', ylabel: 'K max (eV)', t: 26 });
    Object.entries(METALS).forEach(([k2, mm], i) => {
      const f0 = mm.phi / H / 1e14, sel = k2 === key;
      line(ctx, [[A.X(f0), A.Y(0)], [A.X(15), A.Y(H * 15e14 - mm.phi)]], sel ? col.s[i] : col.line, sel ? 3 : 2);
      text(ctx, mm.name, A.X(Math.min(14.5, f0 + 0.3)), A.Y(0) - 10, { color: sel ? col.s[i] : col.muted, size: 10, halo: col.panel });
    });
    const k = K(m); dot(ctx, A.X(f), A.Y(Math.max(0, k)), 6, k > 0 ? col.s[3] : col.bad, col.panel);
    text(ctx, 'slope = h for every metal', A.X(15) - 4, A.Y(3.7), { color: col.muted, size: 11, align: 'right', halo: col.panel });
    // current-voltage
    ctx.save(); ctx.translate(0, h1 + 4);
    const B = axes(ctx, w, h - h1 - 4, col, { x: [-4, 4], y: [0, 2.3], xlabel: 'anode voltage (V)', ylabel: 'current', t: 10, fy: () => '' });
    line(ctx, [[B.X(0), B.Y(0)], [B.X(0), B.Y(2.3)]], col.line, 1);
    const V0 = Math.max(0, k);
    [inten, inten / 2].forEach((I0, j) => {
      if (k <= 0) return;
      const pts = []; for (let V = -4; V <= 4; V += 0.02) { const x = V <= -V0 ? 0 : V >= 0.8 ? 1 : Math.pow((V + V0) / (V0 + 0.8), 0.6); pts.push([B.X(V), B.Y(I0 * x)]); }
      line(ctx, pts, j ? col.muted : col.s[1], j ? 1.5 : 2.5, j ? [4, 4] : undefined);
    });
    if (k > 0) text(ctx, `−V₀ = −${fmt(V0, 3)} V`, B.X(-V0), B.Y(0) - 10, { color: col.s[1], size: 10, align: 'center', halo: col.panel });
    text(ctx, 'dashed: half the intensity', B.X(4) - 4, B.Y(2.15), { color: col.muted, size: 10, align: 'right', halo: col.panel });
    ctx.restore();
  };
  upd();
}
