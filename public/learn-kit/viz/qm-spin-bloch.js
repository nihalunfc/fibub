// A spin in a magnetic field, in 3D (drag to turn). "Free precession": the moment keeps its angle to B and circles it at the
// Larmor frequency ω = γB. "RF pulse": in the frame turning with the field, a small sideways field B₁ just tips the spin
// away from z; press Pulse to see a 90° or 180° flip, then the signal (free-induction decay) as the spin dephases.
import { canvas, text, title, arrow, row, slider, choice, button, readout, loop, line } from '../kit.js';
import { orbit, shapes, wire } from './_3d.js';

const G = { e: ['electron', 28.025e9], p: ['proton', 42.577e6] }; // gamma/2π in Hz per tesla
export default function (host) {
  const cv = canvas(host, { aspect: 0.95, max: 480, min: 360, label: 'A spin vector precessing about a magnetic field in 3D' });
  const cam = orbit(cv, { yaw: 0.7, pitch: 0.4 });
  let mode = 'free', who = 'p', B = 1, th = 40, ph = 0, tilt = 0, flip = 90, pulsing = 0, fid = [], T = 0, trail = [];
  const ctl = row(host), ctl2 = row(host), out = readout(host);
  choice(ctl, 'View', [['free', 'Free precession'], ['rf', 'RF pulse (rotating frame)']], mode, (v) => { mode = v; reset(); });
  choice(ctl, 'Spin', Object.keys(G).map((k) => [k, G[k][0]]), who, (v) => { who = v; show(); });
  const sB = slider(ctl2, { label: 'Field B', min: 0.5, max: 10, step: 0.1, value: B, fmt: (v) => v.toFixed(1) + ' T', oninput: (v) => { B = v; show(); } });
  const sT = slider(ctl2, { label: 'Tilt / flip angle', min: 5, max: 180, step: 5, value: 40, fmt: (v) => v + '°', oninput: (v) => { th = v; flip = v; if (mode === 'free') { trail = []; } show(); } });
  button(ctl2, 'Pulse', () => { if (mode === 'rf') { pulsing = 1; tilt = 0; fid = []; T = 0; } });
  const anim = loop(host, (dt) => {
    if (mode === 'free') { ph += dt * 2.2; trail.push(ph); if (trail.length > 60) trail.shift(); }
    else if (pulsing) { tilt += dt * 90; if (tilt >= flip) { tilt = flip; pulsing = 0; T = 0; } }
    else { T += dt; if (tilt) fid.push(Math.sin(tilt * Math.PI / 180) * Math.exp(-T / 1.5) * Math.cos(T * 18)); if (fid.length > 220) fid.shift(); }
    cv.redraw();
  });
  anim.button(ctl2);
  function reset() { ph = 0; tilt = 0; pulsing = 0; fid = []; trail = []; show(); }
  function show() {
    const f = G[who][1] * B;
    out.innerHTML = mode === 'free'
      ? `Larmor frequency f = γB/2π = <b>${f >= 1e9 ? (f / 1e9).toFixed(1) + ' GHz' : (f / 1e6).toFixed(1) + ' MHz'}</b> for the ${G[who][0]} at ${B.toFixed(1)} T (ω = γB: ${(f * 2 * Math.PI).toExponential(2)} rad/s). The angle to B stays ${th}°; the spin's z-component is fixed, only the sideways part turns. ESR for electrons sits in microwaves, NMR for protons in radio waves.`
      : `A field B₁ at the Larmor frequency (${f >= 1e9 ? (f / 1e9).toFixed(1) + ' GHz' : (f / 1e6).toFixed(1) + ' MHz'}) looks static in the rotating frame, so the spin turns about it by θ = γB₁t. Pulse of <b>${flip}°</b> leaves ${Math.round(Math.sin(flip * Math.PI / 180) * 100)}% of the signal in the xy-plane (maximum at 90°, none at 180° or 0°).`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, mode === 'free' ? 'Spin precessing in B' : 'Rotating frame: tip with B₁', col);
    const sc = Math.min(w, h * 0.66) * 0.3, P = cam.proj(w, h * 0.7, sc, w / 2, h * 0.36);
    wire(ctx, P, shapes.sphere(1, 6), col.line, 0.9);
    const ax = (a, b, c, t, lab) => { const p0 = P([0, 0, 0]), p1 = P([a * 1.35, b * 1.35, c * 1.35]); arrow(ctx, p0[0], p0[1], p1[0], p1[1], c ? col.muted : col.muted, 1.2, 6); text(ctx, lab, p1[0] + 5, p1[1] - 5, { color: col.muted, size: 10 }); };
    ax(1, 0, 0, 0, 'x'); ax(0, 0, 1, 0, 'y'); // z axis is vertical (screen up) = model y
    const pb = P([0, 1.45, 0]); arrow(ctx, P([0, -1.4, 0])[0], P([0, -1.4, 0])[1], pb[0], pb[1], col.s[2], 2.4, 8); text(ctx, 'B (z)', pb[0] + 8, pb[1], { color: col.s[2], size: 11, weight: 700 });
    let v;
    if (mode === 'free') { const a = th * Math.PI / 180; v = [Math.sin(a) * Math.cos(ph), Math.cos(a), Math.sin(a) * Math.sin(ph)];
      const pts = trail.map((p) => P([Math.sin(a) * Math.cos(p), Math.cos(a), Math.sin(a) * Math.sin(p)])); line(ctx, pts.map((q) => [q[0], q[1]]), col.s[0], 1.5, [3, 3]);
      const c = Math.cos(a); line(ctx, Array.from({ length: 61 }, (_, i) => { const p = P([Math.sin(a) * Math.cos(i / 60 * 6.283), c, Math.sin(a) * Math.sin(i / 60 * 6.283)]); return [p[0], p[1]]; }), col.line, 1, [2, 3]); }
    else { const a = tilt * Math.PI / 180; v = [0, Math.cos(a), -Math.sin(a)]; const b1 = P([1.4, 0, 0]); arrow(ctx, P([0, 0, 0])[0], P([0, 0, 0])[1], b1[0], b1[1], col.s[3], 2, 7); text(ctx, 'B₁', b1[0] + 4, b1[1] - 4, { color: col.s[3], size: 11, weight: 700 }); }
    const p0 = P([0, 0, 0]), p1 = P(v); arrow(ctx, p0[0], p0[1], p1[0], p1[1], col.s[1], 3.2, 10); text(ctx, 'spin / moment', p1[0] + 8, p1[1] + 12, { color: col.s[1], size: 11, weight: 700 });
    const pf = P([v[0], 0, v[2]]); line(ctx, [[pf[0], pf[1]], [p1[0], p1[1]]], col.s[1], 1, [2, 3]);
    // lower panel: FID or z-component
    const y0 = h * 0.76, y1 = h - 8; ctx.strokeStyle = col.line; ctx.strokeRect(10, y0, w - 20, y1 - y0);
    if (mode === 'rf') { text(ctx, 'signal picked up by the coil (free-induction decay)', 14, y0 + 10, { color: col.muted, size: 10 }); if (fid.length > 1) line(ctx, fid.map((s, i) => [10 + (i / 220) * (w - 20), (y0 + y1) / 2 + 6 - s * (y1 - y0) * 0.38]), col.s[0], 1.5); }
    else text(ctx, `z-component fixed: cos ${th}° = ${Math.cos(th * Math.PI / 180).toFixed(2)};  xy-part turning at ω_L`, 14, (y0 + y1) / 2, { color: col.muted, size: 10.5 });
  };
  show();
}
