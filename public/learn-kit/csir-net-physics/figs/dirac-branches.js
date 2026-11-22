// 5.3 Relativistic energy branches. E = +/- sqrt(p^2c^2 + m^2c^4) with the 2mc^2 gap, the light cone E = +/- pc and the
// non-relativistic parabola. A slider picks the momentum; the readout gives E, group velocity and how wrong p^2/2m is.
// A second view shows the Dirac hydrogen levels against Z for 1s1/2, 2s1/2 = 2p1/2 and 2p3/2.
import { canvas, axes, line, dot, text, title, row, slider, choice, readout } from '../../kit.js';

const A = 1 / 137.036;
const En = (n, j, Z) => { const k = j + 0.5, za = Z * A; if (za >= k) return NaN; return 1 / Math.sqrt(1 + (za / (n - k + Math.sqrt(k * k - za * za))) ** 2); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 260, label: 'Positive and negative energy branches of a free relativistic particle, and Dirac levels of hydrogen-like ions' });
  let p = 1.2, view = 'free';
  const ctl = row(host);
  choice(ctl, 'View', [['free', 'Free particle'], ['atom', 'Dirac atom']], view, (v) => { view = v; cv.redraw(); show(); });
  slider(ctl, { label: 'Momentum p/mc (free view)', min: 0, max: 3, step: 0.01, value: p, fmt: (v) => v.toFixed(2), oninput: (v) => { p = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    if (view === 'free') {
      const E = Math.sqrt(1 + p * p), nr = 1 + p * p / 2;
      out.innerHTML = `p = ${p.toFixed(2)} mc: E = ±<b>${E.toFixed(3)}</b> mc². Group velocity pc²/E = <b>${(p / E).toFixed(3)} c</b>. The non-relativistic mc² + p²/2m gives ${nr.toFixed(3)} mc² (${((nr / E - 1) * 100).toFixed(1)}% high). The negative branch mirrors it; a photon needs at least 2mc² to lift a state across the gap (pair creation).`;
    } else {
      out.innerHTML = 'Binding energies (in units of mc²) from the exact Dirac formula. 2s<sub>1/2</sub> and 2p<sub>1/2</sub> coincide for every Z (only n and j matter); the 1s<sub>1/2</sub> curve ends at Z = 137, where (Zα)² reaches 1.';
    }
  };
  cv.draw = (ctx, W, H, col) => {
    if (view === 'atom') {
      const ax = axes(ctx, W, H, col, { x: [0, 140], y: [0, 1], xlabel: 'nuclear charge Z', ylabel: 'binding (units of mc²)', t: 34 });
      title(ctx, 'Dirac levels of a hydrogen-like ion', col);
      ctx.save(); ax.clip();
      const L = [[1, 0.5, col.s[0]], [2, 0.5, col.s[2]], [2, 1.5, col.s[4]]];
      for (const [n, j, c] of L) { const pts = []; for (let Z = 1; Z <= 140; Z += 0.25) { const e = En(n, j, Z); if (Number.isFinite(e)) pts.push([ax.X(Z), ax.Y(1 - e)]); } line(ctx, pts, c, 2.4); }
      ctx.restore();
      text(ctx, '1s₁/₂', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
      text(ctx, '2s₁/₂ = 2p₁/₂', ax.R - 6, ax.T + 29, { color: col.s[2], size: 11, align: 'right', halo: col.panel });
      text(ctx, '2p₃/₂', ax.R - 6, ax.T + 44, { color: col.s[4], size: 11, align: 'right', halo: col.panel });
      return;
    }
    const ax = axes(ctx, W, H, col, { x: [-3, 3], y: [-3.4, 3.4], xlabel: 'momentum p/mc', ylabel: 'energy E/mc²', t: 34 });
    title(ctx, 'E = ±√(p²c² + m²c⁴): two branches and a 2mc² gap', col);
    ctx.save(); ax.clip();
    ctx.fillStyle = col.soft; ctx.fillRect(ax.L, ax.Y(1), ax.R - ax.L, ax.Y(-1) - ax.Y(1));
    const up = [], dn = [], nr = [];
    for (let i = 0; i <= 300; i++) { const q = -3 + (i / 300) * 6, E = Math.sqrt(1 + q * q); up.push([ax.X(q), ax.Y(E)]); dn.push([ax.X(q), ax.Y(-E)]); nr.push([ax.X(q), ax.Y(1 + q * q / 2)]); }
    line(ctx, [[ax.X(-3), ax.Y(-3)], [ax.X(3), ax.Y(3)]], col.muted, 1, [4, 4]); line(ctx, [[ax.X(-3), ax.Y(3)], [ax.X(3), ax.Y(-3)]], col.muted, 1, [4, 4]);
    line(ctx, nr, col.s[3], 1.6, [6, 4]); line(ctx, up, col.s[0], 2.6); line(ctx, dn, col.s[1], 2.6);
    dot(ctx, ax.X(p), ax.Y(Math.sqrt(1 + p * p)), 5, col.s[0]); dot(ctx, ax.X(p), ax.Y(-Math.sqrt(1 + p * p)), 5, col.s[1]);
    ctx.restore();
    text(ctx, 'positive energy', ax.R - 6, ax.T + 14, { color: col.s[0], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'negative energy (filled sea)', ax.R - 6, ax.B - 12, { color: col.s[1], size: 11, align: 'right', halo: col.panel });
    text(ctx, 'mc² + p²/2m', ax.L + 8, ax.T + 14, { color: col.s[3], size: 11, halo: col.panel });
    text(ctx, 'gap 2mc²', ax.L + 8, ax.Y(0), { color: col.muted, size: 11, halo: col.panel });
  };
  cv.redraw(); show();
}
