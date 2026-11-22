// AC in R, L, C and the series LCR circuit, as turning arrows (phasors). The arrow for the voltage and the arrow for
// the current rotate together; the waves below are their shadows. Resistor: in phase. Inductor: voltage leads by 90°.
// Capacitor: voltage lags by 90°. LCR: the three voltages add like vectors, V² = V_R² + (V_L − V_C)², and the phase
// angle tanφ = (X_L − X_C)/R. Move ω across ω₀ = 1 and the circuit flips from capacitive to inductive.
import { canvas, axes, line, text, row, slider, choice, readout, loop, arrow, dot } from '../kit.js';

export default function (host) {
  let kind = 'lcr', w = 0.6, Rr = 1, th = 0;
  const cv = canvas(host, { aspect: 1.15, max: 440, min: 340, label: 'Phasor diagram and waveforms for AC in R, L, C and series LCR' });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Circuit', [['r', 'R only'], ['l', 'L only'], ['c', 'C only'], ['lcr', 'Series LCR']], kind, (v) => { kind = v; upd(); });
  slider(c2, { label: 'Frequency ω (ω₀ = 1)', min: 0.2, max: 3, value: w, step: 0.02, fmt: (x) => x.toFixed(2), oninput: (x) => { w = x; upd(); } });
  slider(c2, { label: 'R', min: 0.3, max: 3, value: Rr, step: 0.1, fmt: (x) => x.toFixed(1), oninput: (x) => { Rr = x; upd(); } });
  const out = readout(host);
  const anim = loop(host, (dt) => { th += dt * 1.6; cv.redraw(); }); anim.button(c2);
  // L = C = 1 so X_L = ω, X_C = 1/ω; V0 = 10 (peak)
  const calc = () => { const XL = w, XC = 1 / w, VR0 = 1, vR = kind === 'r' || kind === 'lcr', vL = kind === 'l' || kind === 'lcr', vC = kind === 'c' || kind === 'lcr';
    const Z = Math.hypot(vR ? Rr : 0, (vL ? XL : 0) - (vC ? XC : 0)), I0 = 10 / Z, VRv = vR ? I0 * Rr : 0, VLv = vL ? I0 * XL : 0, VCv = vC ? I0 * XC : 0, phi = Math.atan2((vL ? XL : 0) - (vC ? XC : 0), vR ? Rr : 0);
    return { Z, I0, VRv, VLv, VCv, phi, XL, XC }; };
  function upd() { const c = calc(), d = c.phi * 180 / Math.PI; out.innerHTML = `Z = <b>${c.Z.toFixed(2)}</b>, I₀ = V₀/Z = ${c.I0.toFixed(2)} A (V₀ = 10 V). Voltage ${Math.abs(d) < 0.5 ? 'is <b>in phase</b> with the current' : d > 0 ? `<b>leads</b> the current by ${d.toFixed(0)}°` : `<b>lags</b> the current by ${Math.abs(d).toFixed(0)}°`}. ${kind === 'lcr' ? `X<sub>L</sub> = ${c.XL.toFixed(2)}, X<sub>C</sub> = ${c.XC.toFixed(2)}: ${Math.abs(c.XL - c.XC) < 0.03 ? 'resonance, impedance is just R' : c.XL > c.XC ? 'inductive' : 'capacitive'}. Power factor cosφ = ${Math.cos(c.phi).toFixed(2)}.` : ''} Phasors turn counter-clockwise; the voltage is the arrow ahead of the current arrow when it leads.`; cv.redraw(); }
  cv.draw = (ctx, W, H, col) => {
    const c = calc(), cx = W * 0.3, cy = 112, S = 66 / Math.max(c.VRv, c.VLv, c.VCv, 10, Math.abs(c.VLv - c.VCv), 1);
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, 78, 0, 7); ctx.stroke(); line(ctx, [[cx - 80, cy], [cx + 80, cy]], col.line, 1); line(ctx, [[cx, cy - 80], [cx, cy + 80]], col.line, 1);
    const R2 = (x, y, a) => [cx + (x * Math.cos(a) - y * Math.sin(a)) * S, cy - (x * Math.sin(a) + y * Math.cos(a)) * S];
    const comps = []; if (kind !== 'l' && kind !== 'c') comps.push([c.VRv, 0, col.s[2], 'V_R']); if (kind === 'l' || kind === 'lcr') comps.push([0, c.VLv, col.s[3], 'V_L']); if (kind === 'c' || kind === 'lcr') comps.push([0, -c.VCv, col.s[4], 'V_C']);
    if (kind === 'r') comps.length = 0, comps.push([c.VRv, 0, col.s[2], 'V_R']);
    let x = 0, y = 0; const Ia = c.I0 * 8 / Math.max(c.I0, 2) * 1.0;
    comps.forEach(([vx, vy, cc, lab]) => { const p0 = R2(x, y, th), p1 = R2(x + vx, y + vy, th); arrow(ctx, p0[0], p0[1], p1[0], p1[1], cc, 2, 7); const m = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2]; text(ctx, lab, m[0] + 6, m[1] - 6, { color: cc, size: 10.5, weight: 700, halo: col.panel }); x += vx; y += vy; });
    const pt = R2(x, y, th), p0 = R2(0, 0, th); arrow(ctx, p0[0], p0[1], pt[0], pt[1], col.s[0], 3, 9); text(ctx, 'V', pt[0] + 8, pt[1] - 4, { color: col.s[0], size: 12, weight: 700, halo: col.panel });
    const iEnd = R2(Math.min(70 / S, 7 / Math.max(c.I0, 1) * 10), 0, th); arrow(ctx, p0[0], p0[1], iEnd[0], iEnd[1], col.s[5], 3, 9); text(ctx, 'I', iEnd[0] + 8, iEnd[1] - 4, { color: col.s[5], size: 12, weight: 700, halo: col.panel });
    [`Z = ${c.Z.toFixed(2)}`, `I₀ = ${c.I0.toFixed(2)}`, `φ = ${(c.phi * 180 / Math.PI).toFixed(0)}°`, `cosφ = ${Math.cos(c.phi).toFixed(2)}`].forEach((t, i) => text(ctx, t, W * 0.62, 50 + i * 20, { color: col.ink, size: 12, weight: 600 }));
    text(ctx, 'Phasors turn counter-clockwise', 10, 14, { color: col.muted, size: 10.5 });
    const G = axes(ctx, W, H, col, { x: [0, 4 * Math.PI], y: [-1.15, 1.15], xlabel: 'ωt', l: 40, t: 205, b: 34, xt: [0, 2 * Math.PI, 4 * Math.PI], fx: (v) => (v / Math.PI) + 'π', yt: [-1, 0, 1], fy: (v) => v });
    const ph = c.phi, ex = Math.atan2(y, x), ph2 = (kind === 'lcr') ? ph : ph;
    line(ctx, Array.from({ length: 161 }, (_, i) => { const a = i / 160 * 4 * Math.PI; return [G.X(a), G.Y(Math.sin(a + ph2))]; }), col.s[0], 2.2);
    line(ctx, Array.from({ length: 161 }, (_, i) => { const a = i / 160 * 4 * Math.PI; return [G.X(a), G.Y(Math.sin(a))]; }), col.s[5], 2.2, [5, 3]);
    const a = ((th % (4 * Math.PI)) + 4 * Math.PI) % (4 * Math.PI); line(ctx, [[G.X(a), G.T], [G.X(a), G.B]], col.muted, 1, [3, 3]); dot(ctx, G.X(a), G.Y(Math.sin(a + ph2)), 4.5, col.s[0], col.panel); dot(ctx, G.X(a), G.Y(Math.sin(a)), 4.5, col.s[5], col.panel);
    text(ctx, 'v (solid)  i (dashed)', G.R - 4, G.T + 8, { color: col.ink, size: 10.5, align: 'right', weight: 600 });
  };
  upd();
}
