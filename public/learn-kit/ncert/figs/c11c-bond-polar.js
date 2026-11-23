// Class 11 Chemistry, Chemical Bonding: polarity. Mode "bond": set the electronegativity of two atoms; the shared electron cloud leans towards the more electronegative atom, giving a bond dipole (arrow from + to -).
// Percent ionic character (Pauling's estimate) = 100 (1 - exp(-(dx)^2 / 4)). Mode "molecule": add the bond dipoles as vectors. CO2, BF3, CCl4 cancel (non-polar); H2O, NH3, CHCl3 do not (polar).
import { canvas, text, title, row, slider, choice, readout, arrow } from '../../kit.js';

const D2R = Math.PI / 180;
const MOLS = {
  CO2: { list: [[0, 1, 1], [180, 1, 1]], note: 'linear: two equal dipoles pull opposite ways and cancel' },
  H2O: { list: [[135, 1, -1], [45, 1, -1]], note: 'bent: the two dipoles add up, so water is polar (μ = 1.85 D)' },
  BF3: { list: [[90, 1, 1], [210, 1, 1], [330, 1, 1]], note: 'trigonal planar: three equal dipoles at 120° cancel' },
  NH3: { list: [[210, 1, -1], [330, 1, -1], [270, 0.0, -1]], note: 'pyramidal: the N–H dipoles add up (and the lone pair adds to them), μ = 1.47 D' },
  CCl4: { list: [[45, 1, 1], [135, 1, 1], [225, 1, 1], [315, 1, 1]], note: 'tetrahedral: four equal dipoles cancel in pairs' },
  CHCl3: { list: [[210, 0.8, 1], [330, 0.8, 1], [270, 0.8, 1], [90, 0.3, -1]], note: 'three strong C–Cl dipoles and one weak C–H: they do not cancel, μ = 1.04 D' },
};
export default function (host) {
  let mode = 'bond', xa = 2.2, xb = 3.2, mol = 'H2O';
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 330, label: 'Bond polarity from electronegativity and the vector sum of bond dipoles in molecules' });
  const ctl = row(host), ro = readout(host);
  const ctlB = document.createElement('div'); const ctlM = document.createElement('div'); ctl.append(ctlB, ctlM);
  choice(ctl, 'show', [['bond', 'one bond'], ['mol', 'whole molecule']], mode, (v) => { mode = v; go(); });
  slider(ctlB, { label: 'electronegativity of A', min: 0.7, max: 4.0, step: 0.1, value: xa, fmt: (v) => v.toFixed(1), oninput: (v) => { xa = v; go(); } });
  slider(ctlB, { label: 'electronegativity of B', min: 0.7, max: 4.0, step: 0.1, value: xb, fmt: (v) => v.toFixed(1), oninput: (v) => { xb = v; go(); } });
  choice(ctlM, 'molecule', Object.keys(MOLS).map((k) => [k, k]), mol, (v) => { mol = v; go(); });
  const go = () => {
    ctlB.style.display = mode === 'bond' ? '' : 'none'; ctlM.style.display = mode === 'bond' ? 'none' : '';
    if (mode === 'bond') { const d = Math.abs(xa - xb), ic = 100 * (1 - Math.exp(-d * d / 4)); ro.textContent = `Difference ${d.toFixed(1)}: ${d < 0.4 ? 'non-polar covalent' : d < 1.7 ? 'polar covalent' : 'mostly ionic'} bond, about ${ic.toFixed(0)} % ionic character.`; }
    else ro.textContent = `${mol}: ${MOLS[mol].note}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, mode === 'bond' ? 'One bond: where does the electron cloud sit?' : `Bond dipoles of ${mol} added as vectors`, col);
    if (mode === 'bond') {
      const d = xb - xa, shift = Math.max(-1, Math.min(1, d / 2.5)), cy = t0 + (h - t0) * 0.36, a = w * 0.27, b = w * 0.73;
      const cloudX = (a + b) / 2 + shift * (b - a) * 0.32, rx = (b - a) * 0.38;
      ctx.beginPath(); ctx.ellipse(cloudX, cy, rx, 36, 0, 0, 7); ctx.fillStyle = col.s[3]; ctx.globalAlpha = 0.28; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = col.s[3]; ctx.lineWidth = 1.5; ctx.stroke();
      [[a, 'A', xa], [b, 'B', xb]].forEach(([x, nm, v]) => { const r = 12 + v * 4; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.9; ctx.fill(); ctx.globalAlpha = 1; text(ctx, nm, x, cy, { color: col.panel, size: 13, weight: 700, align: 'center' }); text(ctx, 'χ ' + v.toFixed(1), x, cy + 60, { color: col.muted, size: 11, align: 'center' }); });
      const dp = Math.abs(d) > 0.3;
      if (dp) { const pa = d > 0 ? 'δ+' : 'δ−', pb = d > 0 ? 'δ−' : 'δ+'; text(ctx, pa, a, cy - 52, { color: d > 0 ? col.bad : col.s[0], size: 13, weight: 700, align: 'center' }); text(ctx, pb, b, cy - 52, { color: d > 0 ? col.s[0] : col.bad, size: 13, weight: 700, align: 'center' });
        const y = cy + 92; d > 0 ? arrow(ctx, a, y, b, y, col.ink, 2.5, 10) : arrow(ctx, b, y, a, y, col.ink, 2.5, 10); text(ctx, 'dipole: + to −', (a + b) / 2, y + 18, { color: col.muted, size: 11, align: 'center' }); }
      else text(ctx, 'shared equally: no dipole', w / 2, cy + 92, { color: col.muted, size: 12, align: 'center' });
      const ic = 100 * (1 - Math.exp(-d * d / 4)); ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(24, h - 38, w - 48, 14); ctx.fillStyle = col.s[2]; ctx.fillRect(24, h - 38, (w - 48) * ic / 100, 14);
      text(ctx, 'ionic character ' + ic.toFixed(0) + ' %', w / 2, h - 12, { color: col.ink, size: 11.5, weight: 700, align: 'center' });
    } else {
      const m = MOLS[mol], cx = w / 2, cy = t0 + (h - t0) * 0.45, sc = Math.min(w, h) * 0.24; let sx = 0, sy = 0;
      const heavy = mol === 'CCl4' || mol === 'CHCl3' || mol === 'NH3' || mol === 'H2O' || mol === 'BF3' || mol === 'CO2';
      ctx.beginPath(); ctx.arc(cx, cy, 13, 0, 7); ctx.fillStyle = col.ink; ctx.fill();
      m.list.forEach(([ang, mag, dir]) => { const ux = Math.cos(ang * D2R), uy = -Math.sin(ang * D2R); if (mag > 0) { ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + ux * sc * 1.15, cy + uy * sc * 1.15); ctx.stroke(); ctx.beginPath(); ctx.arc(cx + ux * sc * 1.15, cy + uy * sc * 1.15, 9, 0, 7); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.5; ctx.fill(); ctx.globalAlpha = 1; }
        const m2 = mag * (mol === 'NH3' && mag === 0 ? 0 : 1); const vx = ux * m2 * dir, vy = uy * m2 * dir; sx += vx; sy += vy;
        if (m2 > 0) { const px = cx + ux * sc * 0.55 - vx * sc * 0.28, py = cy + uy * sc * 0.55 - vy * sc * 0.28; arrow(ctx, px, py, px + vx * sc * 0.5, py + vy * sc * 0.5, col.s[2], 2.5, 8); } });
      const net = Math.hypot(sx, sy);
      if (net > 0.05) { const y0 = h - 52, f = Math.min(1, 26 / (net * sc * 0.25)) * sc * 0.25; arrow(ctx, cx - sx * f, y0 - sy * f, cx + sx * f, y0 + sy * f, col.bad, 4, 11); text(ctx, 'net dipole: polar molecule', cx, h - 20, { color: col.bad, size: 12.5, weight: 700, align: 'center' }); }
      else text(ctx, 'net dipole = 0: non-polar molecule', cx, h - 30, { color: col.good, size: 12.5, weight: 700, align: 'center' });
      text(ctx, 'green arrows: bond dipoles (flat view)', cx, h - 8, { color: col.muted, size: 10, align: 'center' });
    }
  };
  go();
}
