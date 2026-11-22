// Debye screening. Put a positive test charge in a plasma: free electrons crowd around it and ions are pushed away, so at a
// distance beyond λ_D = √(ε₀kT/ne²) the charge is almost hidden and its potential falls as e^(−r/λ_D)/r instead of 1/r. Heat
// the plasma (more thermal motion, fuzzier cloud) and λ_D grows; add more particles and λ_D shrinks. The dots are electrons
// of the cloud; the graph compares the screened and bare potentials.
import { canvas, axes, line, text, row, slider, readout, loop, rng, dot } from '../kit.js';

export default function (host) {
  let ln = 18, lT = 4.5, t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 420, min: 320, label: 'A charge screened by a cloud of electrons in a plasma, and its potential' });
  const ctl = row(host);
  slider(ctl, { label: 'Density n', min: 6, max: 26, value: ln, step: 0.2, fmt: (x) => '10^' + x.toFixed(1) + ' m⁻³', oninput: (x) => { ln = x; upd(); } });
  slider(ctl, { label: 'Temperature T', min: 2, max: 8, value: lT, step: 0.1, fmt: (x) => '10^' + x.toFixed(1) + ' K', oninput: (x) => { lT = x; upd(); } });
  const out = readout(host);
  const R = rng(9), E = Array.from({ length: 150 }, () => ({ u: R(), a: R() * 6.28, ph: R() * 6.28 }));
  const anim = loop(host, (dt) => { t += dt; cv.redraw(); }); anim.button(ctl);
  const lam = () => 69 * Math.sqrt(Math.pow(10, lT) / Math.pow(10, ln)); // metres (ε0 kT/ne²)^(1/2) = 69 √(T/n)
  const fm = (m) => (m >= 1 ? m.toFixed(2) + ' m' : m >= 1e-3 ? (m * 1e3).toFixed(2) + ' mm' : m >= 1e-6 ? (m * 1e6).toFixed(2) + ' µm' : (m * 1e9).toFixed(1) + ' nm');
  function upd() { const l = lam(), ND = 4 / 3 * Math.PI * Math.pow(10, ln) * l ** 3; out.innerHTML = `λ<sub>D</sub> = √(ε₀kT/ne²) = <b>${fm(l)}</b>. There are about ${ND >= 1e3 ? ND.toExponential(1) : ND.toFixed(0)} particles in a sphere of that radius, ${ND > 10 ? 'plenty, so the plasma picture (collective screening) is valid' : 'too few: it is not really a plasma'}. At r = λ<sub>D</sub> the potential is already 37% of the bare Coulomb value; at 3λ<sub>D</sub> only 5%. Hotter or sparser: bigger λ<sub>D</sub>.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    const cx = w * 0.5, cy = 100, S = 80; // cloud picture: λD maps to 36 px so the relative size is shown on a log-ish scale
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(cx, cy, 36, 0, 7); ctx.stroke(); ctx.setLineDash([]); text(ctx, 'λ_D', cx + 28, cy - 36, { color: col.muted, size: 10.5 });
    E.forEach((e) => { const r = -Math.log(1 - e.u * 0.98) * 36, a = e.a + Math.sin(t * 1.3 + e.ph) * 0.12, rr = r + Math.sin(t * 2 + e.ph) * 2; dot(ctx, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.9, 2.4, col.s[0]); });
    dot(ctx, cx, cy, 8, col.s[5], col.panel); text(ctx, '+', cx, cy, { color: '#fff', size: 11, weight: 700, align: 'center' });
    text(ctx, 'blue: the screening electron cloud (thickens near +)', 10, 16, { color: col.ink, size: 11, weight: 700 });
    const G = axes(ctx, w, h, col, { x: [0, 5], y: [0, 1.05], xlabel: 'distance r (units of λ_D)', ylabel: 'potential (relative)', l: 44, t: 200, b: 40, xt: [0, 1, 2, 3, 4, 5], yt: [0, 0.5, 1], fy: (v) => v });
    G.clip && (ctx.save(), G.clip()); line(ctx, Array.from({ length: 200 }, (_, i) => { const r = 0.1 + i * 0.025; return [G.X(r), G.Y(Math.min(1.5, 1 / r))]; }), col.muted, 1.6, [5, 3]); line(ctx, Array.from({ length: 200 }, (_, i) => { const r = 0.1 + i * 0.025; return [G.X(r), G.Y(Math.min(1.5, Math.exp(-r) / r))]; }), col.s[5], 2.6); ctx.restore();
    text(ctx, 'bare Coulomb 1/r', G.X(2.6), G.Y(0.38) - 12, { color: col.muted, size: 10.5 }); text(ctx, 'screened e^(−r/λ_D)/r', G.X(1.3), G.Y(0.2) - 10, { color: col.s[5], size: 10.5, weight: 700 });
  };
  upd();
}
