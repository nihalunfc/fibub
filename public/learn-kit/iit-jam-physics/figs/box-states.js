// 6.3 The particle in a box. The lowest stationary states of an infinite square well, each drawn on the line of
// its own energy (E grows as n squared), as the wavefunction or as the probability density. The chosen state is
// highlighted; the readout gives its energy for an electron in a box of the chosen width, its nodes, and the
// photon emitted when it drops to the ground state.
import { canvas, axes, line, text, row, slider, choice, readout, fmt } from '../../kit.js';

const BOX = 0.376; // h^2 / (8 m_e) in eV nm^2

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 320, label: 'Energy levels and wavefunctions of a particle in an infinite square well' });
  let n = 2, L = 1, mode = 'psi';
  const NMAX = 5;
  const ctl = row(host);
  const out = readout(host);
  const show = () => {
    const E = n * n * BOX / (L * L), E1 = BOX / (L * L);
    out.innerHTML = `State n = ${n}: ${n} half-wavelength${n > 1 ? 's' : ''} fit the box, ${n - 1} node${n === 2 ? '' : 's'} inside. For an electron in a ${fmt(L, 3)} nm box, E<sub>${n}</sub> = n²h²/8mL² = <b>${fmt(E, 3)} eV</b>` +
      (n > 1 ? `; dropping to n = 1 emits ${fmt(E - E1, 3)} eV, λ = <b>${fmt(1239.84 / (E - E1), 4)} nm</b>.` : '. This is the zero-point energy: the particle can never be at rest.');
  };
  slider(ctl, { label: 'State n', min: 1, max: NMAX, step: 1, value: n, fmt: (v) => String(v), oninput: (v) => { n = Math.round(v); cv.redraw(); show(); } });
  slider(ctl, { label: 'Box width L (nm)', min: 0.2, max: 3, step: 0.05, value: L, fmt: (v) => fmt(v, 3), oninput: (v) => { L = v; show(); } });
  choice(ctl, 'Draw', [['psi', 'ψ'], ['prob', '|ψ|²']], mode, (v) => { mode = v; cv.redraw(); });

  cv.draw = (ctx, w, h, col) => {
    const top = NMAX * NMAX + 3;
    const a = axes(ctx, w, h, col, { x: [-0.15, 1.15], y: [0, top], xt: [0, 0.5, 1], fx: (v) => (v === 0 ? '0' : v === 1 ? 'L' : 'L/2'), yt: [1, 4, 9, 16, 25], xlabel: 'position x', ylabel: 'energy (units of E₁)', grid: false, t: 24 });
    // walls
    ctx.fillStyle = col.soft;
    ctx.fillRect(a.X(-0.15), a.T, a.X(0) - a.X(-0.15), a.B - a.T);
    ctx.fillRect(a.X(1), a.T, a.X(1.15) - a.X(1), a.B - a.T);
    line(ctx, [[a.X(0), a.T], [a.X(0), a.B]], col.ink, 2);
    line(ctx, [[a.X(1), a.T], [a.X(1), a.B]], col.ink, 2);
    const xs = Array.from({ length: 201 }, (_, i) => i / 200);
    for (let k = 1; k <= NMAX; k++) {
      const E = k * k, amp = k === 1 ? 1.4 : 2.2 + 0.25 * k, on = k === n;
      line(ctx, [[a.X(0), a.Y(E)], [a.X(1), a.Y(E)]], col.muted, 1, [3, 3]);
      const f = (x) => (mode === 'psi' ? Math.sin(k * Math.PI * x) : Math.sin(k * Math.PI * x) ** 2);
      line(ctx, xs.map((x) => [a.X(x), a.Y(E + amp * f(x))]), on ? col.s[0] : col.s[2], on ? 2.8 : 1.4);
      text(ctx, `n = ${k}`, a.X(1.02), a.Y(E), { color: on ? col.s[0] : col.muted, size: 11, weight: on ? 700 : 400 });
    }
  };
  cv.redraw(); show();
}
