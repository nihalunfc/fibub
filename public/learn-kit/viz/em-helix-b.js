// A charged particle in a uniform magnetic field, in 3D (drag to turn the view). B points up. Only the part of the
// velocity across B bends: v⊥ = v sinα gives a circle of radius r = mv⊥/(qB); the part along B, v∥ = v cosα, is
// unchanged, so the path is a helix with pitch p = 2πm v∥/(qB). At α = 90° it is a circle, at α = 0 a straight line.
// Reverse the charge and the helix turns the other way.
import { canvas, text, row, slider, choice, readout, loop, arrow } from '../kit.js';
import { orbit } from './_3d.js';

export default function (host) {
  let sg = 1, v = 2, B = 20, al = 60, t = 0, trail = [];
  const cv = canvas(host, { aspect: 0.85, max: 400, min: 290, label: 'A charged particle moving in a helix around magnetic field lines' });
  const cam = orbit(cv, { yaw: 0.7, pitch: 0.35 });
  const ctl = row(host), c2 = row(host);
  choice(ctl, 'Particle', [[1, 'Proton'], [-1, 'Electron']], sg, (x) => { sg = x; trail = []; upd(); });
  slider(c2, { label: 'Speed', min: 0.5, max: 5, value: v, step: 0.1, fmt: (x) => x.toFixed(1) + ' ×10⁶ m/s', oninput: (x) => { v = x; trail = []; upd(); } });
  slider(c2, { label: 'B', min: 5, max: 50, value: B, step: 1, fmt: (x) => x + ' mT', oninput: (x) => { B = x; trail = []; upd(); } });
  slider(c2, { label: 'Angle α (v and B)', min: 0, max: 90, value: al, step: 1, fmt: (x) => x + '°', oninput: (x) => { al = x; trail = []; upd(); } });
  const out = readout(host);
  const m = () => (sg > 0 ? 1.67e-27 : 9.11e-31), q = 1.6e-19;
  const par = () => { const vv = v * 1e6, a = al * Math.PI / 180, b = B * 1e-3, r = m() * vv * Math.sin(a) / (q * b), w = q * b / m(); return { r, w, vp: vv * Math.cos(a), T: 2 * Math.PI / w, pitch: 2 * Math.PI / w * vv * Math.cos(a) }; };
  function upd() { const p = par(); out.innerHTML = `r = mv sinα/(qB) = <b>${p.r < 1e-2 ? (p.r * 1e3).toFixed(3) + ' mm' : (p.r * 100).toFixed(2) + ' cm'}</b>, period T = 2πm/(qB) = ${(p.T * 1e9).toFixed(1)} ns (does not depend on speed), pitch = ${(p.pitch * 100).toFixed(2)} cm, v∥ = ${(p.vp / 1e6).toFixed(2)}×10⁶ m/s. Magnetic force does no work, so the speed stays constant.`; cv.redraw(); }
  const geo = () => { const p = par(), L = Math.max(p.r, p.pitch / 1.6, 1e-12); return { Rm: 1.1 * p.r / L, per: 1.1 * p.pitch / L }; };
  const anim = loop(host, (dt) => { const g = geo(); t += dt; const f = t / 2.2, y = (f * g.per) % 3.2 - 1.6;
    if (trail.length && y < trail[trail.length - 1][1] - 0.5) trail = [];
    trail.push([Math.cos(f * 6.2832) * g.Rm, y, Math.sin(f * 6.2832) * g.Rm * -sg]); if (trail.length > 260) trail.shift(); cv.redraw(); }); anim.button(ctl);
  cv.draw = (ctx, w, h, col) => {
    const sc = Math.min(w, h) * 0.3, P = cam.proj(w, h, sc, w / 2, h / 2 + 6), c = col.s[sg > 0 ? 5 : 0];
    let pts = trail;
    if (pts.length < 3) { const g = geo(); pts = Array.from({ length: 120 }, (_, i) => { const f = i / 80; return [Math.cos(f * 6.2832) * g.Rm, (f * g.per) % 3.2 - 1.6, Math.sin(f * 6.2832) * g.Rm * -sg]; }).filter((p, i, a) => !i || p[1] >= a[i - 1][1]); }
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j += 2) { const a = P([i * 0.55, -1.7, j * 0.45]), b = P([i * 0.55, 1.7, j * 0.45]); ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    const a0 = P([0, -1.7, 0]), a1 = P([0, 1.9, 0]); arrow(ctx, a0[0], a0[1], a1[0], a1[1], col.muted, 1.6, 7); text(ctx, 'B', a1[0] + 8, a1[1], { color: col.muted, size: 12, weight: 700 });
    ctx.lineWidth = 2.2; for (let i = 1; i < pts.length; i++) { if (Math.abs(pts[i][1] - pts[i - 1][1]) > 1) continue; const a = P(pts[i - 1]), b = P(pts[i]); ctx.strokeStyle = c; ctx.globalAlpha = 0.25 + 0.75 * i / pts.length; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.globalAlpha = 1; if (pts.length) { const e = P(pts[pts.length - 1]); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(e[0], e[1], 6, 0, 7); ctx.fill(); }
    text(ctx, 'Drag to turn', w - 8, h - 10, { color: col.muted, size: 10, align: 'right' }); text(ctx, `α = ${al}°  ${al === 90 ? 'circle' : al === 0 ? 'straight line' : 'helix'}`, 10, 16, { color: col.ink, size: 12, weight: 700 });
  };
  upd();
}
