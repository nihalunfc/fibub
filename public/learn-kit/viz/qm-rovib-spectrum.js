// How a rotation-vibration band is built: molecules jump v = 0 → 1 and J → J ± 1 at the same time. R lines (ΔJ = +1) sit above
// the band centre, P lines (ΔJ = −1) below, and no line sits at the centre (the Q gap, 4B). Heights follow the Boltzmann
// populations. Pick a molecule, raise T, step through J, and turn on "B changes with v" to see the R lines crowd up (band head side).
import { canvas, axes, line, text, title, row, slider, choice, readout, arrow } from '../kit.js';

const MOL = { HCl: ['HCl', 2886, 10.59, 0.302], CO: ['CO', 2143, 1.93, 0.0175], HBr: ['HBr', 2559, 8.46, 0.226] };
export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 500, min: 400, label: 'Rotational levels of two vibrational states with allowed transitions and the resulting spectrum with P and R branches' });
  let mol = 'HCl', T = 300, J = 3, br = 'R', real = false;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Molecule', Object.keys(MOL).map((k) => [k, k]), mol, (v) => { mol = v; show(); });
  choice(ctl, 'Branch', [['R', 'R: ΔJ = +1'], ['P', 'P: ΔJ = −1']], br, (v) => { br = v; show(); });
  choice(ctl2, 'B', [[false, 'Same B in v = 0, 1'], [true, 'B(v=1) < B(v=0)']], real, (v) => { real = v; show(); });
  slider(ctl2, { label: 'Lower J', min: 0, max: 14, step: 1, value: J, fmt: (v) => String(v), oninput: (v) => { J = v; show(); } });
  slider(ctl2, { label: 'Temperature', min: 50, max: 1000, step: 10, value: T, fmt: (v) => v + ' K', oninput: (v) => { T = v; show(); } });
  const p = () => { const [, nu0, B, da] = MOL[mol], Bp = real ? B - da : B; return { nu0, B, Bp }; };
  const lineR = (J_, q) => q.nu0 + (q.Bp + q.B) * (J_ + 1) + (q.Bp - q.B) * (J_ + 1) ** 2, lineP = (J_, q) => q.nu0 - (q.Bp + q.B) * J_ + (q.Bp - q.B) * J_ * J_;
  const pop = (J_, q) => (2 * J_ + 1) * Math.exp(-(q.B * J_ * (J_ + 1) * 1.4388) / T);
  function show() {
    const q = p(), nu = br === 'R' ? lineR(J, q) : lineP(J, q);
    if (br === 'P' && J === 0) { out.innerHTML = 'P(0) does not exist: J = 0 cannot go down to J = −1. That is why there is a gap at the centre on that side too.'; cv.redraw(); return; }
    out.innerHTML = `${br}(${J}): J = ${J} → ${br === 'R' ? J + 1 : J - 1} at <b>${nu.toFixed(1)} cm⁻¹</b>. Rigid rotor: lines are spaced 2B = ${(2 * q.B).toFixed(1)} cm⁻¹, with a gap of 4B = ${(4 * q.B).toFixed(1)} cm⁻¹ at ν₀ = ${q.nu0} cm⁻¹. Strongest lines near J ≈ √(kT/2hcB) − ½ = <b>${(Math.sqrt(T / (2 * 1.4388 * q.B)) - 0.5).toFixed(1)}</b>.${real ? ' With B′ < B″ the R lines draw together and the P lines spread apart.' : ''}`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, `${mol} rotation-vibration band`, col);
    const q = p(), top = 30, lh = Math.round(h * 0.40);
    // ladder
    const lx0 = w * 0.1, lx1 = w * 0.45, ux0 = w * 0.55, ux1 = w * 0.9, E0 = (j) => q.B * j * (j + 1), E1 = (j) => q.Bp * j * (j + 1), sc = (lh - 50) / (E1(8) + 0.0001 * 0 || 1);
    const yb = top + lh - 6, ymax = Math.max(E1(7), E0(8)) ; const s = (lh - 60) / Math.max(1, ymax * 1.0), vgap = 46;
    const yl = (j) => yb - E0(j) * s, yu = (j) => yb - vgap - E1(j) * s - 0;
    for (let j_ = 0; j_ <= 7; j_++) { line(ctx, [[lx0, yl(j_)], [lx1, yl(j_)]], col.muted, j_ === J ? 3 : 1.2); line(ctx, [[ux0, yu(j_) - 40 * 0], [ux1, yu(j_)]], col.muted, 1.2); text(ctx, 'J=' + j_, lx0 - 2, yl(j_) - 5, { color: col.muted, size: 9, fit: false }); }
    text(ctx, 'v = 0', lx0, yb + 10, { color: col.ink, size: 11, weight: 700 }); text(ctx, 'v = 1', ux0, yb - vgap + 12, { color: col.ink, size: 11, weight: 700 });
    const J2 = br === 'R' ? J + 1 : J - 1;
    if (J2 >= 0 && J <= 7 && J2 <= 7) arrow(ctx, lx1 - 8, yl(J), ux0 + 12, yu(J2), col.s[1], 2.4, 8);
    // spectrum
    const a = axes(ctx, w, h, col, { x: [q.nu0 - 15 * 2 * q.B * 0 - 14.5 * (q.B + q.Bp), q.nu0 + 14.5 * (q.B + q.Bp)], y: [0, 1.1], l: 20, r: 12, t: top + lh + 24, b: 40, xlabel: 'wavenumber (cm⁻¹)', yt: [], fx: (v) => Math.round(v), xt: [q.nu0 - 10 * q.B * 2, q.nu0, q.nu0 + 10 * q.B * 2].map((v) => Math.round(v)) });
    let mx = 0; for (let j_ = 0; j_ <= 14; j_++) mx = Math.max(mx, pop(j_, q));
    for (let j_ = 0; j_ <= 14; j_++) {
      const pr = pop(j_, q) / mx, r = lineR(j_, q), pq = j_ ? lineP(j_, q) : null; const hi = j_ === J;
      line(ctx, [[a.X(r), a.B], [a.X(r), a.Y(pr * 0.85)]], hi && br === 'R' ? col.s[1] : col.s[0], hi && br === 'R' ? 3.5 : 2);
      if (pq !== null) line(ctx, [[a.X(pq), a.B], [a.X(pq), a.Y(pr * 0.85)]], hi && br === 'P' ? col.s[1] : col.s[2], hi && br === 'P' ? 3.5 : 2);
    }
    text(ctx, 'P branch', a.L + 4, a.T + 8, { color: col.s[2], size: 10.5, weight: 700 }); text(ctx, 'R branch', a.R - 4, a.T + 8, { color: col.s[0], size: 10.5, weight: 700, align: 'right' });
    text(ctx, 'no line here (Q gap)', a.X(q.nu0), a.T + 24, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
