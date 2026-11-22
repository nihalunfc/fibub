// 6.6 Raman spectrum around the laser line. Vibrational mode: one Stokes line (molecules start in v = 0) and one
// anti-Stokes line weaker by exp(-hc nu/kT). Rotational mode: S-branch lines at +-4B(J + 3/2), with Placzek-Teller
// weights, Boltzmann populations and a choice of nuclear spin statistics. The Rayleigh line is drawn cut off: it is
// about a thousand times stronger than anything else. The nu^4 factor is left out.
import { canvas, axes, line, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const C2 = 1.438777;
const SPIN = { none: [1, 1], h2: [1, 3], n2: [2, 1], co2: [1, 0], o2: [0, 1] };

export default function (host) {
  const cv = canvas(host, { aspect: 0.6, max: 380, min: 260, label: 'Raman spectrum with Stokes and anti-Stokes lines on either side of the Rayleigh line' });
  let mode = 'vib', nu = 459, B = 2.0, T = 300, spin = 'none';
  const ctl = row(host), ctl2 = row(host);
  const out = readout(host);
  const rot = () => {
    const [ge, go] = SPIN[spin], L = [];
    let q = 0; const pop = []; for (let J = 0; J < 200; J++) { const g = (J % 2 ? go : ge) * (2 * J + 1) * Math.exp(-C2 * B * J * (J + 1) / T); pop.push(g); q += g; }
    for (let J = 0; J < 150; J++) {
      const s = 4 * B * (J + 1.5), pt = ((J + 1) * (J + 2)) / ((2 * J + 1) * (2 * J + 3));
      const S = (pop[J] / q) * pt, AS = (pop[J + 2] / q) * pt * (2 * J + 1) / (2 * J + 5);
      if (S > 0) L.push([-s, S]); if (AS > 0) L.push([s, AS]);
    }
    return L;
  };
  const show = () => {
    if (mode === 'vib') { const r = Math.exp(-C2 * nu / T); out.innerHTML = `Stokes at −${fmt(nu, 4)} cm⁻¹, anti-Stokes at +${fmt(nu, 4)} cm⁻¹. Anti-Stokes / Stokes = e^(−hcν̃/kT) = <b>${fmt(r, 3)}</b> at ${fmt(T, 3)} K (times the ν⁴ factor in a real spectrum).`; }
    else out.innerHTML = `First rotational Raman line at ±6B = ${fmt(6 * B, 3)} cm⁻¹, then every 4B = ${fmt(4 * B, 3)} cm⁻¹${spin === 'co2' || spin === 'o2' ? ` (alternate lines missing, so observed spacing 8B = ${fmt(8 * B, 3)} cm⁻¹)` : spin === 'none' ? '' : ' (alternating strong and weak)'}.`;
  };
  const redo = () => { cv.redraw(); show(); };
  choice(ctl, 'Spectrum', [['vib', 'vibrational'], ['rot', 'rotational']], mode, (v) => { mode = v; redo(); });
  slider(ctl, { label: 'Temperature', min: 20, max: 1500, value: T, log: true, fmt: (v) => fmt(v, 3) + ' K', oninput: (v) => { T = v; redo(); } });
  slider(ctl2, { label: 'Vibration ν̃', min: 100, max: 3000, step: 1, value: nu, fmt: (v) => fmt(v, 4) + ' cm⁻¹', oninput: (v) => { nu = v; redo(); } });
  slider(ctl2, { label: 'Rotational B', min: 0.3, max: 10, value: B, log: true, fmt: (v) => fmt(v, 3) + ' cm⁻¹', oninput: (v) => { B = v; redo(); } });
  choice(ctl2, 'Nuclear spins', [['none', 'none'], ['h2', 'H₂ odd ×3'], ['n2', 'N₂ even ×2'], ['co2', 'CO₂ even only'], ['o2', 'O₂ odd only']], spin, (v) => { spin = v; redo(); });

  cv.draw = (ctx, w, h, col) => {
    const lines = mode === 'vib' ? [[-nu, 1], [nu, Math.exp(-C2 * nu / T)]] : rot();
    const span = mode === 'vib' ? Math.max(3200, nu * 1.25) : Math.min(400 * B, Math.max(30 * B, 4 * B * (Math.sqrt(T / (C2 * B)) * 3 + 2)));
    const top = Math.max(...lines.map((x) => x[1])) * 1.25;
    title(ctx, mode === 'vib' ? 'Vibrational Raman lines' : 'Rotational Raman lines', col);
    const a = axes(ctx, w, h, col, { x: [-span, span], y: [0, top], yt: [], xlabel: 'shift from laser line (cm⁻¹): Stokes ← → anti-Stokes', t: 34, l: 20, grid: false });
    ctx.save(); a.clip();
    line(ctx, [[a.X(0), a.Y(0)], [a.X(0), a.T]], col.muted, 3);
    for (const [x, y] of lines) line(ctx, [[a.X(x), a.Y(0)], [a.X(x), a.Y(y)]], x < 0 ? col.s[0] : col.s[3], mode === 'vib' ? 3 : 1.6);
    ctx.restore();
    text(ctx, 'Rayleigh (cut off)', a.X(0) + 4, a.T + 8, { color: col.muted, size: 10 });
  };
  redo();
}
