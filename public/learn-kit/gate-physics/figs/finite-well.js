// 4.3 The finite square well. Two views: the graphical solution (tan z and -cot z branches meeting
// sqrt(z0²/z² - 1), with z = ka/2 and z0 = (a/2) sqrt(2 m V0)/hbar) and the bound states drawn at their energies
// inside the well, leaking into the walls as exp(-kappa |x|). The strength z0 is the only parameter.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt } from '../../kit.js';

const HB2M = 0.0381; // eV nm^2, for the electron example in the readout

// Roots z of the even (tan z = r) and odd (-cot z = r) conditions with r = sqrt(z0²/z² - 1).
export function boundStates(z0) {
  const rhs = (z) => Math.sqrt(Math.max(0, z0 * z0 / (z * z) - 1));
  const out = [];
  for (let k = 0; ; k++) {
    const lo = k * Math.PI / 2;
    if (lo >= z0) break;
    const even = k % 2 === 0;
    const g = (z) => (even ? Math.tan(z) : -1 / Math.tan(z)) - rhs(z);
    let a = lo + 1e-9, b = Math.min(lo + Math.PI / 2 - 1e-9, z0);
    // g(a) < 0 (branch starts at 0 while rhs is positive), g(b) > 0 (branch large or rhs zero)
    for (let i = 0; i < 80; i++) { const m = (a + b) / 2; g(m) < 0 ? (a = m) : (b = m); }
    out.push({ z: (a + b) / 2, even });
  }
  return out;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.72, max: 470, min: 320, label: 'Finite square well: graphical solution for the bound states, or the bound-state wavefunctions in the well' });
  let z0 = 4, mode = 'graph';
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const st = boundStates(z0), V0 = HB2M * (2 * z0) ** 2;
    out.innerHTML = `z₀ = ${fmt(z0, 3)}: <b>${st.length} bound state${st.length > 1 ? 's' : ''}</b> (${st.filter((s) => s.even).length} even, ${st.filter((s) => !s.even).length} odd), 1 + ⌊2z₀/π⌋ = ${1 + Math.floor(2 * z0 / Math.PI)}. ` +
      `Energies E/V₀ = ${st.map((s) => fmt(-(1 - s.z * s.z / (z0 * z0)), 3)).join(', ')}. For an electron in a 1 nm wide well this z₀ means V₀ = ${fmt(V0, 3)} eV.`;
  };
  slider(ctl, { label: 'Well strength z₀', min: 0.3, max: 12, step: 0.05, value: z0, fmt: (v) => fmt(v, 3), oninput: (v) => { z0 = v; cv.redraw(); show(); } });
  choice(ctl, 'View', [['graph', 'graphical solution'], ['states', 'bound states']], mode, (v) => { mode = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const st = boundStates(z0);
    if (mode === 'graph') {
      const X1 = Math.max(z0 + 0.6, Math.PI), Y1 = 8;
      const a = axes(ctx, w, h, col, { x: [0, X1], y: [0, Y1], xlabel: 'z = ka/2', ylabel: 'both sides of the condition', t: 26, xt: Array.from({ length: Math.floor(X1 / (Math.PI / 2)) + 1 }, (_, i) => i * Math.PI / 2), fx: (v) => (v === 0 ? '0' : `${Math.round(v / (Math.PI / 2))}π/2`) });
      ctx.save(); a.clip();
      for (let k = 0; k * Math.PI / 2 < X1; k++) {
        const even = k % 2 === 0, pts = [];
        for (let i = 1; i < 200; i++) {
          const z = k * Math.PI / 2 + (Math.PI / 2) * i / 200;
          const y = even ? Math.tan(z) : -1 / Math.tan(z);
          if (y > Y1 * 1.2) break;
          pts.push([a.X(z), a.Y(y)]);
        }
        line(ctx, pts, even ? col.s[0] : col.s[2], 2);
      }
      const rp = [];
      for (let i = 1; i <= 300; i++) { const z = z0 * i / 300; rp.push([a.X(z), a.Y(Math.min(Y1 * 1.2, Math.sqrt(Math.max(0, z0 * z0 / (z * z) - 1))))]); }
      line(ctx, rp, col.ink, 2.2);
      for (const s of st) dot(ctx, a.X(s.z), a.Y(Math.sqrt(z0 * z0 / (s.z * s.z) - 1)), 5, s.even ? col.s[0] : col.s[2], col.panel);
      ctx.restore();
      text(ctx, 'tan z (even states)', a.L + 8, a.T + 10, { color: col.s[0], size: 12, weight: 700 });
      text(ctx, '−cot z (odd states)', a.L + 8, a.T + 27, { color: col.s[2], size: 12, weight: 700 });
      text(ctx, '√(z₀²/z² − 1)', a.L + 8, a.T + 44, { color: col.ink, size: 12, weight: 700 });
      return;
    }
    const a = axes(ctx, w, h, col, { x: [-1.5, 1.5], y: [-1.05, 0.25], xlabel: 'position x / a', ylabel: 'energy E / V₀', t: 24, xt: [-1, -0.5, 0, 0.5, 1] });
    ctx.save(); a.clip();
    line(ctx, [[a.X(-1.5), a.Y(0)], [a.X(-0.5), a.Y(0)], [a.X(-0.5), a.Y(-1)], [a.X(0.5), a.Y(-1)], [a.X(0.5), a.Y(0)], [a.X(1.5), a.Y(0)]], col.ink, 2);
    const xs = Array.from({ length: 401 }, (_, i) => -1.5 + 3 * i / 400);
    const amp = Math.min(0.12, 0.8 / (st.length + 1));
    st.forEach((s, i) => {
      const E = -(1 - s.z * s.z / (z0 * z0)), q = Math.sqrt(Math.max(0, z0 * z0 - s.z * s.z));
      const edge = s.even ? Math.cos(s.z) : Math.sin(s.z);
      const f = (x) => {
        if (Math.abs(x) <= 0.5) return s.even ? Math.cos(2 * s.z * x) : Math.sin(2 * s.z * x);
        return edge * Math.exp(-2 * q * (Math.abs(x) - 0.5)) * (s.even || x > 0 ? 1 : -1);
      };
      line(ctx, [[a.X(-1.5), a.Y(E)], [a.X(1.5), a.Y(E)]], col.muted, 1, [3, 3]);
      line(ctx, xs.map((x) => [a.X(x), a.Y(E + amp * f(x))]), s.even ? col.s[0] : col.s[2], 2.2);
      text(ctx, `n = ${i + 1}`, a.X(1.05), a.Y(E) - 8, { color: col.muted, size: 11 });
    });
    ctx.restore();
    text(ctx, 'even', a.L + 8, a.T + 10, { color: col.s[0], size: 12, weight: 700 });
    text(ctx, 'odd', a.L + 48, a.T + 10, { color: col.s[2], size: 12, weight: 700 });
  };
  cv.redraw(); show();
}
