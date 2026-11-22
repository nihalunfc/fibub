// 3.2 The action J = ∮ p dq is the area of the phase-space orbit. For V = |q|ⁿ (m = 1) choose n and the energy:
// the shaded orbit's area is J(E), and the period T = dJ/dE and frequency ν = 1/T follow. The oscillator (n = 2)
// has J ∝ E, so its period never changes; other potentials have energy-dependent periods.
import { canvas, axes, line, text, title, row, slider, choice, readout, fmt } from '../../kit.js';

const Jof = (n, E) => { const a = E ** (1 / n), N = 600; let s = 0; for (let i = 0; i < N; i++) { const q = a * (i + 0.5) / N; s += Math.sqrt(Math.max(0, 2 * (E - q ** n))); } return 4 * s * a / N; };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 420, min: 280, label: 'Phase-space orbits in a power-law potential, with the enclosed area equal to the action' });
  let n = 2, E = 1;
  const ctl = row(host);
  choice(ctl, 'Potential', [[1, '|q|'], [2, 'q² (oscillator)'], [4, 'q⁴'], [12, 'q¹² (nearly a box)']], n, (v) => { n = v; cv.redraw(); });
  slider(ctl, { label: 'Energy E', min: 0.2, max: 2, step: 0.01, value: E, fmt: (v) => v.toFixed(2), oninput: (v) => { E = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, W, H, col) => {
    title(ctx, 'The action J is the area inside the orbit', col);
    const ax = axes(ctx, W, H, col, { x: [-2.4, 2.4], y: [-2.2, 2.2], xlabel: 'q', ylabel: 'p', t: 30 });
    const orbit = (En) => { const a = En ** (1 / n), pts = []; for (let i = 0; i <= 200; i++) { const q = -a + 2 * a * i / 200; pts.push([q, Math.sqrt(Math.max(0, 2 * (En - Math.abs(q) ** n)))]); } for (let i = 200; i >= 0; i--) { const q = -a + 2 * a * i / 200; pts.push([q, -Math.sqrt(Math.max(0, 2 * (En - Math.abs(q) ** n)))]); } return pts.map(([q, p]) => [ax.X(q), ax.Y(p)]); };
    ctx.save(); ax.clip();
    for (const e of [0.25, 0.5, 1, 1.5, 2]) line(ctx, orbit(e), col.line, 1);
    const o = orbit(E);
    ctx.globalAlpha = 0.25; ctx.fillStyle = col.s[0]; ctx.beginPath(); o.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    line(ctx, o, col.s[0], 2.5);
    ctx.restore();
    const J = Jof(n, E), dE = 1e-3, T = (Jof(n, E + dE) - Jof(n, E - dE)) / (2 * dE);
    text(ctx, `area J = ${fmt(J, 3)}`, ax.X(0), ax.Y(0), { color: col.ink, size: 12, weight: 700, align: 'center', halo: col.panel });
    const pw = 2 * n / (n + 2);
    out.innerHTML = `J(E) = <b>${fmt(J, 4)}</b>; period T = dJ/dE = <b>${fmt(T, 4)}</b>; frequency ν = ∂H/∂J = <b>${fmt(1 / T, 4)}</b>. For V ∝ |q|<sup>${n}</sup>, E ∝ J<sup>${fmt(pw, 3)}</sup>${n === 2 ? ': linear, so the period is the same at every energy.' : n < 2 ? ': the period grows with energy.' : ': the period shrinks as the energy rises.'}`;
  };
  cv.redraw();
}
