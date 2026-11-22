// 3.6 Waves in plasmas and conductors. Plasma view: the dispersion curve ω² = ωp² + c²k² against the light line,
// with the chosen frequency's phase and group velocities (slopes of the chord and of the tangent), and the
// evanescent decay length below cutoff. Conductor view: a snapshot of the field inside a metal,
// E ∝ e^(−z/δ) cos(z/δ − ωt), with its envelope, for a chosen metal and frequency.
import { canvas, axes, line, dot, text, row, slider, choice, readout, fmt, title } from '../../kit.js';

const METALS = { cu: ['copper', 5.8e7], al: ['aluminium', 3.5e7], ss: ['stainless steel', 1.4e6], sea: ['sea water', 4] };
const MU0 = 1.25663706212e-6;

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 280, label: 'Dispersion curve of a cold plasma, or the decaying field inside a conductor' });
  let mode = 'plasma', x = 1.5, metal = 'cu', logf = 6, phase = 0;
  const ctl = row(host), ctl2 = row(host);
  choice(ctl, 'View', [['plasma', 'Plasma'], ['metal', 'Conductor']], mode, (v) => { mode = v; build(); });
  const out = readout(host);
  const build = () => {
    ctl2.innerHTML = '';
    if (mode === 'plasma') slider(ctl2, { label: 'Frequency ω/ωp', min: 0.2, max: 3, step: 0.01, value: x, fmt: (v) => fmt(v, 3), oninput: (v) => { x = v; upd(); } });
    else {
      choice(ctl2, 'Material', Object.entries(METALS).map(([k, v]) => [k, v[0]]), metal, (v) => { metal = v; upd(); });
      slider(ctl2, { label: 'Frequency (Hz)', min: 1, max: 10, step: 0.1, value: logf, fmt: (v) => fmt(10 ** v, 2), oninput: (v) => { logf = v; upd(); } });
      slider(ctl2, { label: 'Phase ωt', min: 0, max: 6.28, step: 0.05, value: phase, fmt: (v) => fmt(v, 2), oninput: (v) => { phase = v; upd(); } });
    }
    upd();
  };
  const upd = () => {
    if (mode === 'plasma') {
      if (x > 1) { const n = Math.sqrt(1 - 1 / (x * x)); out.innerHTML = `ω = ${fmt(x, 3)} ωp: refractive index n = ${fmt(n, 3)}, phase velocity <b>${fmt(1 / n, 3)} c</b> (slope of the line from the origin), group velocity <b>${fmt(n, 3)} c</b> (slope of the curve). Their product is c².`; }
      else if (x < 1) out.innerHTML = `ω = ${fmt(x, 3)} ωp is below cutoff: k is imaginary, the field decays as e<sup>−κz</sup> with 1/κ = <b>${fmt(1 / Math.sqrt(1 - x * x), 3)} c/ωp</b>, and the wave is totally reflected.`;
      else out.innerHTML = 'At ω = ωp exactly, k = 0: the electrons oscillate together and nothing propagates.';
    } else {
      const [nm, s] = METALS[metal], f = 10 ** logf, d = Math.sqrt(2 / (MU0 * s * 2 * Math.PI * f)), good = s / (2 * Math.PI * f * 8.854e-12 * (metal === 'sea' ? 81 : 1));
      out.innerHTML = `${nm}, f = ${fmt(f, 2)} Hz: skin depth δ = <b>${fmt(d, 3)} m</b>, wavelength inside 2πδ = ${fmt(2 * Math.PI * d, 3)} m, σ/ωε = ${fmt(good, 2)}${good < 10 ? ' (not a good conductor here: the formula is only rough)' : ''}.`;
    }
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    if (mode === 'plasma') {
      title(ctx, 'Cold plasma: ω² = ωp² + c²k²', col);
      const ax = axes(ctx, w, h, col, { x: [0, 3], y: [0, 3.2], t: 40, xlabel: 'ck/ωp', ylabel: 'ω/ωp' });
      line(ctx, [[ax.X(0), ax.Y(0)], [ax.X(3), ax.Y(3)]], col.muted, 1.5, [5, 4]);
      text(ctx, 'light line ω = ck', ax.X(2.1), ax.Y(2.1) - 12, { color: col.muted, size: 11, halo: col.panel });
      const pts = []; for (let k = 0; k <= 3.001; k += 0.03) pts.push([ax.X(k), ax.Y(Math.sqrt(1 + k * k))]);
      line(ctx, pts, col.s[0], 3);
      line(ctx, [[ax.X(0), ax.Y(1)], [ax.X(3), ax.Y(1)]], col.s[2], 1, [2, 4]);
      text(ctx, 'cutoff ωp', ax.X(2.4), ax.Y(1) + 11, { color: col.s[2], size: 11, halo: col.panel });
      if (x > 1) {
        const k = Math.sqrt(x * x - 1), X = ax.X(k), Y = ax.Y(x);
        line(ctx, [[ax.X(0), ax.Y(0)], [X, Y]], col.s[1], 2);
        const sl = k / x, dk = 0.6; line(ctx, [[ax.X(k - dk), ax.Y(x - sl * dk)], [ax.X(Math.min(3, k + dk)), ax.Y(x + sl * (Math.min(3, k + dk) - k))]], col.s[3], 2);
        dot(ctx, X, Y, 5, col.s[0], col.panel);
        text(ctx, 'phase: ω/k', ax.X(k / 2) - 8, ax.Y(x / 2) - 10, { color: col.s[1], size: 11, align: 'right', halo: col.panel });
        text(ctx, 'group: dω/dk', X + 8, Y + 14, { color: col.s[3], size: 11, halo: col.panel });
      } else { dot(ctx, ax.X(0), ax.Y(x), 5, col.bad || col.s[4], col.panel); text(ctx, 'no real k', ax.X(0.08), ax.Y(x), { color: col.ink, size: 11, halo: col.panel }); }
    } else {
      const [nm, s] = METALS[metal], f = 10 ** logf, d = Math.sqrt(2 / (MU0 * s * 2 * Math.PI * f));
      title(ctx, `Field inside ${nm}: E ∝ e^(−z/δ) cos(z/δ − ωt)`, col);
      const ax = axes(ctx, w, h, col, { x: [0, 5], y: [-1.1, 1.1], t: 40, xlabel: 'depth z / δ', ylabel: 'E / E₀', fy: (v) => fmt(v, 2) });
      const env = [], env2 = [], fld = [];
      for (let z = 0; z <= 5.001; z += 0.02) { env.push([ax.X(z), ax.Y(Math.exp(-z))]); env2.push([ax.X(z), ax.Y(-Math.exp(-z))]); fld.push([ax.X(z), ax.Y(Math.exp(-z) * Math.cos(z - phase))]); }
      line(ctx, env, col.muted, 1.5, [4, 4]); line(ctx, env2, col.muted, 1.5, [4, 4]); line(ctx, fld, col.s[0], 3);
      line(ctx, [[ax.X(1), ax.Y(-1.1)], [ax.X(1), ax.Y(1.1)]], col.s[2], 1, [2, 3]);
      text(ctx, `δ = ${fmt(d, 3)} m`, ax.X(1) + 6, ax.Y(0.9), { color: col.s[2], size: 11, halo: col.panel });
    }
  };
  build();
}
