// Nuclei are not always round. In the liquid-drop picture the surface is R(θ, φ) = R₀[1 + β Y(θ, φ)]: Y₂₀ gives a rugby ball
// (prolate, β > 0) or a pancake (oblate, β < 0), a mix with Y₂₂ gives a triaxial shape, Y₃₀ a pear, and a surface that swings
// between shapes is a vibration. Drag to turn it. The readout gives the quadrupole moment Q₀ = (3/√5π)ZR₀²β(1 + 0.16β) for ¹⁶⁶Er.
import { canvas, text, title, row, slider, choice, readout, loop } from '../kit.js';
import { orbit } from './_3d.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.9, max: 460, min: 340, label: 'A nucleus drawn as a deformed liquid drop in 3D' });
  const cam = orbit(cv, { yaw: 0.7, pitch: 0.35 });
  let mode = 'q', beta = 0.3, gam = 20, t = 0;
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'Shape', [['q', 'Quadrupole β₂'], ['t', 'Triaxial (β₂, γ)'], ['o', 'Octupole pear β₃'], ['v', 'Vibrating drop']], mode, (v) => { mode = v; show(); });
  slider(ctl2, { label: 'Deformation β', min: -0.5, max: 0.5, step: 0.01, value: beta, fmt: (v) => v.toFixed(2), oninput: (v) => { beta = v; show(); } });
  slider(ctl2, { label: 'γ (triaxiality)', min: 0, max: 60, step: 1, value: gam, fmt: (v) => v + '°', oninput: (v) => { gam = v; show(); } });
  const anim = loop(host, (dt) => { t += dt * 3; if (mode === 'v') cv.redraw(); });
  anim.button(ctl2);
  const Y20 = (c) => 0.3154 * (3 * c * c - 1), Y30 = (c) => 0.3732 * (5 * c ** 3 - 3 * c), Y22 = (s, ph) => 0.5463 * s * s * Math.cos(2 * ph);
  const R = (th, ph) => { const c = Math.cos(th), s = Math.sin(th); const be = mode === 'v' ? beta * Math.cos(t) : beta; if (mode === 'o') return 1 + Math.abs(beta) * Y30(c) * (beta < 0 ? -1 : 1); if (mode === 't') { const g = gam * Math.PI / 180; return 1 + be * (Math.cos(g) * Y20(c) + Math.sin(g) * Y22(s, ph)); } return 1 + be * Y20(c); };
  function show() {
    const Z = 68, R0 = 1.2 * Math.cbrt(166), Q0 = 3 / Math.sqrt(5 * Math.PI) * Z * R0 * R0 * beta * (1 + 0.16 * beta);
    out.innerHTML = mode === 'o' ? `Octupole (λ = 3) shape: a pear, with no mirror symmetry top-to-bottom. Such nuclei (Ra-224, Ba-144) have a tiny electric dipole moment pointing along the axis.` : `${mode === 'v' ? 'Amplitude oscillates: spherical on average, zero-point vibration even at rest. ' : ''}β = ${beta.toFixed(2)}: ${beta > 0.01 ? 'prolate (long axis, like rugby)' : beta < -0.01 ? 'oblate (flat, like a pancake)' : 'spherical'}. For ¹⁶⁶Er (Z = 68, R₀ = ${R0.toFixed(1)} fm): Q₀ ≈ <b>${Q0.toFixed(0)} fm²</b> (${(Q0 / 100).toFixed(1)} barns). A spherical nucleus has Q₀ = 0; rotational bands E = ħ²J(J+1)/2𝓘 exist only for deformed ones.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Nuclear shape R = R₀[1 + β Y]', col);
    const sc = Math.min(w, h) * 0.3, P = cam.proj(w, h, sc, w / 2, h * 0.52);
    const pt = (th, ph) => { const r = R(th, ph); return [r * Math.sin(th) * Math.cos(ph), r * Math.cos(th), r * Math.sin(th) * Math.sin(ph)]; };
    ctx.lineCap = 'round';
    const seg = (a, b, c) => { const p = P(a), q = P(b), d = (p[2] + q[2]) / 2; ctx.globalAlpha = Math.max(0.2, Math.min(1, 0.6 + d * 0.5)); ctx.strokeStyle = c; ctx.lineWidth = d > 0 ? 1.8 : 1; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); };
    for (let i = 1; i < 9; i++) { const th = (i / 9) * Math.PI; for (let k = 0; k < 48; k++) seg(pt(th, (k / 48) * 6.2832), pt(th, ((k + 1) / 48) * 6.2832), col.s[0]); }
    for (let m = 0; m < 12; m++) { const ph = (m / 12) * 6.2832; for (let k = 0; k < 36; k++) seg(pt((k / 36) * Math.PI, ph), pt(((k + 1) / 36) * Math.PI, ph), col.s[2]); }
    ctx.globalAlpha = 1;
    const top = P([0, 1.45, 0]), bot = P([0, -1.45, 0]); ctx.strokeStyle = col.muted; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(bot[0], bot[1]); ctx.lineTo(top[0], top[1]); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'symmetry axis', top[0] + 6, top[1] + 4, { color: col.muted, size: 10 }); text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' });
    const pe = R(0, 0), eq = R(Math.PI / 2, 0); text(ctx, `polar ${pe.toFixed(2)} R₀ : equator ${eq.toFixed(2)} R₀`, 10, h - 10, { color: col.ink, size: 10.5 });
  };
  show();
}
