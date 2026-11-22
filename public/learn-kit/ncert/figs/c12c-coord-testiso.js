// Class 12 Chemistry, Coordination Compounds: hydrate isomers of CrCl3.6H2O. Same formula, but the water is inside or outside the coordination sphere, so the number of free chloride ions
// changes: [Cr(H2O)6]Cl3 (violet) 3, [Cr(H2O)5Cl]Cl2.H2O (blue-green) 2, [Cr(H2O)4Cl2]Cl.2H2O (dark green) 1 free chloride. Silver nitrate precipitates only the free chloride as AgCl.
// Molar mass of AgCl 143.5 g/mol. Press the button to add AgNO3 (excess) to 0.01 mol of the complex.
import { canvas, text, title, row, choice, button, readout, loop } from '../../kit.js';

const ISO = {
  a: { f: '[Cr(H₂O)₆]Cl₃', col: '#9a7fc4', name: 'violet', free: 3, inside: 0 },
  b: { f: '[Cr(H₂O)₅Cl]Cl₂·H₂O', col: '#7fc4b0', name: 'blue-green', free: 2, inside: 1 },
  c: { f: '[Cr(H₂O)₄Cl₂]Cl·2H₂O', col: '#3f8a4f', name: 'dark green', free: 1, inside: 2 },
};
export default function (host) {
  let key = 'a', t = -1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Test tube showing silver chloride formed from the free chloride of a chromium complex' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'isomer', [['a', 'violet'], ['b', 'blue-green'], ['c', 'dark green']], key, (v) => { key = v; t = -1; go(); });
  button(ctl, 'Add AgNO₃', () => { t = 0; go(); });
  loop(host, (dt) => { if (t >= 0 && t < 2.5) { t += dt; cv.redraw(); } });
  const go = () => { const s = ISO[key]; ro.textContent = `${s.f}: ${s.inside} Cl⁻ inside the coordination sphere, ${s.free} free. ` + (t >= 0 ? `0.01 mol of complex gives ${(0.01 * s.free).toFixed(2)} mol AgCl = ${(0.01 * s.free * 143.5).toFixed(2)} g of white precipitate.` : 'Press “Add AgNO₃” to test it.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const s = ISO[key], top = title(ctx, s.f, col), tx = w * 0.5, ty = top + 40, th = (h - ty) * 0.62, tw = 74;
    ctx.fillStyle = s.col; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty + 34); ctx.lineTo(tx + tw / 2, ty + 34); ctx.lineTo(tx + tw / 2, ty + th); ctx.arc(tx, ty + th, tw / 2, 0, Math.PI); ctx.lineTo(tx - tw / 2, ty + 34); ctx.fill();
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(tx - tw / 2, ty); ctx.lineTo(tx - tw / 2, ty + th); ctx.arc(tx, ty + th, tw / 2, Math.PI, 0, true); ctx.lineTo(tx + tw / 2, ty); ctx.stroke();
    // free chloride labels, left
    for (let i = 0; i < s.free; i++) { const y = ty + 52 + i * 22; ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(tx - tw / 2 - 40, y, 9, 0, 7); ctx.fill(); text(ctx, 'Cl⁻', tx - tw / 2 - 40, y, { color: col.panel, size: 8.5, weight: 700, align: 'center' }); }
    text(ctx, 'free Cl⁻ outside', tx - tw / 2 - 52, ty + 24, { color: col.muted, size: 10.5 });
    if (t >= 0) {
      const p = Math.min(1, t / 1.8);
      for (let i = 0; i < s.free * 3; i++) { const bx = tx - 26 + (i % 3) * 26 + (Math.floor(i / 3) % 2) * 5, rest = ty + th + 8 - Math.floor(i / 3) * 12, fall = Math.max(0, Math.min(1, p * 1.3 - i * 0.05)), y = (ty + 36) + (rest - (ty + 36)) * fall; ctx.fillStyle = '#f5f6f7'; ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(bx, y, 8, 0, 7); ctx.fill(); ctx.stroke(); }
      text(ctx, 'AgCl (white)', tx + tw / 2 + 10, ty + th - 6, { color: col.ink, size: 11.5, weight: 700 });
    }
    text(ctx, `${s.name}: ${s.inside} Cl bonded to Cr, ${s.free} free`, w / 2, h - 12, { color: col.muted, size: 11.5, align: 'center' });
  };
  go();
}
