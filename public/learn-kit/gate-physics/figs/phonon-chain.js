// 7.4 Phonons on a chain. Top: a row of atoms moving in one normal mode (displacements drawn sideways, exaggerated, for
// clarity; the real motion is along the chain). Bottom: the dispersion curve(s) with the chosen mode marked. Monatomic:
// one acoustic branch, flat at the zone edge. Diatomic: acoustic and optical branches with a gap set by the mass ratio;
// at the zone edge only one kind of atom moves in each branch, and at k = 0 the optical mode has the two atoms opposite.
import { canvas, row, slider, choice, readout, axes, line, dot, text, fmt, loop } from '../../kit.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.78, max: 500, min: 330, label: 'A chain of atoms vibrating in a normal mode above its dispersion curve' });
  let kind = 'di', mr = 2, kf = 0.5, br = 'ac', t = 0;
  const ctl = row(host), out = readout(host);
  const re = () => { cv.redraw(); show(); };
  choice(ctl, 'Chain', [['mono', 'Monatomic'], ['di', 'Diatomic']], kind, (v) => { kind = v; re(); });
  choice(ctl, 'Branch', [['ac', 'Acoustic'], ['op', 'Optical']], br, (v) => { br = v; re(); });
  slider(ctl, { label: 'Wave vector k (units of π/a)', min: 0, max: 1, step: 0.01, value: kf, fmt: (v) => fmt(v, 2), oninput: (v) => { kf = v; re(); } });
  slider(ctl, { label: 'Mass ratio M₁/M₂ (diatomic)', min: 1, max: 5, step: 0.1, value: mr, fmt: (v) => fmt(v, 2), oninput: (v) => { mr = v; re(); } });
  const lp = loop(host, (dt) => { t += dt; cv.redraw(); });
  lp.button(ctl);
  // units: K = 1, M2 = 1, M1 = mr (diatomic, repeat distance a); monatomic: m = 1, spacing a
  const disp = (k, sign) => {
    if (kind === 'mono') return 2 * Math.abs(Math.sin(k * Math.PI / 2));
    const M1 = mr, M2 = 1, s = 1 / M1 + 1 / M2, q = Math.sqrt(Math.max(0, s * s - 4 * Math.sin(k * Math.PI / 2) ** 2 / (M1 * M2)));
    return Math.sqrt(s + sign * q);
  };
  // amplitude ratio u2/u1 for the diatomic chain (atom 1 at x = 0, atom 2 at a/2)
  const ratio = (k, w) => { const M1 = mr, ka = k * Math.PI; const c = Math.cos(ka / 2); return Math.abs(c) < 1e-9 && Math.abs(2 - M1 * w * w) < 1e-9 ? null : (2 - M1 * w * w) / (2 * c); };
  const show = () => {
    const sign = br === 'op' ? 1 : -1;
    if (kind === 'mono') { out.innerHTML = `ω/√(K/m) = ${fmt(disp(kf, 1), 3)}; group velocity = ${fmt(Math.cos(kf * Math.PI / 2), 3)} × v_s. ${kf > 0.98 ? 'At the zone edge neighbours move in opposition: a standing wave.' : ''} (A monatomic chain has no optical branch.)`; return; }
    const w = disp(kf, sign), lo = Math.sqrt(2 / mr), hi = Math.sqrt(2);
    out.innerHTML = `${br === 'op' ? 'Optical' : 'Acoustic'} branch: ω/√(K/M₂) = ${fmt(w, 3)}. Gap at the zone edge from ${fmt(lo, 3)} to ${fmt(hi, 3)} (√(2K/M₁) to √(2K/M₂)). ${mr < 1.05 ? 'Equal masses: the gap closes.' : ''}`;
  };
  cv.draw = (ctx, W, H, col) => {
    const sign = br === 'op' ? 1 : -1, mono = kind === 'mono';
    const w = disp(kf, mono ? 1 : sign);
    // chain
    const top = 18, chainH = H * 0.36, cy = top + chainH / 2, nCells = 10, dx = (W - 40) / (mono ? nCells * 2 : nCells * 2);
    text(ctx, mono ? 'Monatomic chain' : 'Diatomic chain (large dots: mass M₁)', 10, 12, { color: col.ink, size: 11.5, weight: 700 });
    line(ctx, [[14, cy], [W - 14, cy]], col.line, 1);
    let u2 = 1;
    if (!mono) { const rr = ratio(kf, w); u2 = rr === null ? 0 : rr; }
    const amp = chainH * 0.36, phase = w * t * 2.2;
    let norm = mono ? 1 : Math.max(1, Math.abs(u2)); if (!mono && br === 'ac' && kf > 0.999) { u2 = 0; norm = 1; }
    if (!mono && br === 'op' && kf > 0.999) norm = 1;
    const pts = [];
    for (let j = 0; j < nCells * 2; j++) {
      const x = 20 + j * dx + dx / 2;
      let u;
      if (mono) u = Math.cos(kf * Math.PI * j - phase);
      else { const cell = Math.floor(j / 2), second = j % 2 === 1; const base = Math.cos(kf * Math.PI * cell + (second ? kf * Math.PI / 2 : 0) - phase); u = second ? (br === 'op' && kf > 0.999 ? Math.cos(kf * Math.PI * cell + Math.PI / 2 - phase) : u2 * base) / norm : (br === 'op' && kf > 0.999 ? 0 : base / norm); }
      pts.push([x, cy - amp * u, mono ? false : j % 2 === 0]);
    }
    line(ctx, pts.map(([x, y]) => [x, y]), col.muted, 1, [3, 3]);
    for (const [x, y, heavy] of pts) dot(ctx, x, y, mono ? 5 : heavy ? 4 + Math.min(4, mr) : 4, heavy || mono ? col.s[0] : col.s[2]);
    // dispersion
    const g0 = top + chainH + 6;
    ctx.save(); ctx.translate(0, g0);
    const ymax = mono ? 2.2 : Math.sqrt(2 * (1 / mr + 1)) * 1.1;
    const ax = axes(ctx, W, H - g0, col, { x: [-1, 1], y: [0, ymax], xlabel: 'k (units of π/a)', ylabel: 'ω', t: 8, b: 34, xt: [-1, -0.5, 0, 0.5, 1] });
    const ac = [], op = [];
    for (let k = -1; k <= 1.0001; k += 0.005) { ac.push([ax.X(k), ax.Y(disp(Math.abs(k), mono ? 1 : -1))]); if (!mono) op.push([ax.X(k), ax.Y(disp(Math.abs(k), 1))]); }
    line(ctx, ac, col.s[0], 2.5); if (!mono) line(ctx, op, col.s[2], 2.5);
    if (!mono) { ctx.globalAlpha = 0.12; ctx.fillStyle = col.s[3]; ctx.fillRect(ax.L, ax.Y(Math.sqrt(2)), ax.R - ax.L, ax.Y(Math.sqrt(2 / mr)) - ax.Y(Math.sqrt(2))); ctx.globalAlpha = 1; }
    dot(ctx, ax.X(kf), ax.Y(w), 5, col.ink, col.panel);
    text(ctx, mono ? 'acoustic' : 'acoustic', ax.X(-0.95), ax.Y(disp(0.95, mono ? 1 : -1)) - 10, { color: col.s[0], size: 11, weight: 700, halo: col.panel });
    if (!mono) text(ctx, 'optical', ax.X(-0.95), ax.Y(disp(0.95, 1)) + 12, { color: col.s[2], size: 11, weight: 700, halo: col.panel });
    ctx.restore();
  };
  re();
}
