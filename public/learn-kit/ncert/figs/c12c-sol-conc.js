// Class 12 Chemistry, Solutions: ways of expressing concentration. A solution of a solute in water: set the mass of solute, the mass of water and the
// density of the solution, and see mass %, ppm, mole fraction, molality (moles per kg SOLVENT) and molarity (moles per litre of SOLUTION) from the same beaker.
// Molality does not change with temperature (it uses masses); molarity does (the volume expands). Two strips show the mixture by mass and by moles.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const SOL = { nacl: ['NaCl', 58.5], glu: ['glucose', 180], urea: ['urea', 60] };
export default function (host) {
  let key = 'glu', ms = 18, mw = 100, d = 1.05;
  const cv = canvas(host, { aspect: 1.0, max: 440, min: 340, label: 'A solution shown as strips by mass and by moles with five concentration measures worked out' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'solute', [['glu', 'glucose'], ['nacl', 'NaCl'], ['urea', 'urea']], key, (v) => { key = v; go(); });
  slider(ctl, { label: 'solute (g)', min: 1, max: 100, step: 1, value: ms, fmt: (v) => v.toFixed(0), oninput: (v) => { ms = v; go(); } });
  slider(ctl, { label: 'water (g)', min: 50, max: 500, step: 10, value: mw, fmt: (v) => v.toFixed(0), oninput: (v) => { mw = v; go(); } });
  slider(ctl, { label: 'density of solution (g/mL)', min: 0.95, max: 1.25, step: 0.01, value: d, fmt: (v) => v.toFixed(2), oninput: (v) => { d = v; go(); } });
  const calc = () => {
    const M2 = SOL[key][1], n2 = ms / M2, n1 = mw / 18, tot = ms + mw;
    return { n2, n1, pct: 100 * ms / tot, ppm: 1e6 * ms / tot, x2: n2 / (n1 + n2), m: n2 / (mw / 1000), M: n2 / (tot / d / 1000) };
  };
  const go = () => { const c = calc(); ro.textContent = `${ms} g ${SOL[key][0]} in ${mw} g water: ${c.n2.toFixed(3)} mol solute, ${c.n1.toFixed(2)} mol water. Total mass ${ms + mw} g, volume ${((ms + mw) / d).toFixed(0)} mL.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const c = calc(); let y = title(ctx, `Same beaker, five ways to say how much ${SOL[key][0]}`, col) + 8;
    const bx = 16, bw = w - 32;
    const strip = (lab, f) => {
      text(ctx, lab, bx, y + 8, { color: col.muted, size: 11 }); y += 20;
      ctx.fillStyle = col.s[2]; ctx.fillRect(bx, y, bw * f, 22); ctx.fillStyle = col.s[0]; ctx.fillRect(bx + bw * f, y, bw * (1 - f), 22);
      ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, y, bw, 22);
      text(ctx, 'solute ' + (100 * f).toFixed(f < 0.01 ? 2 : 1) + ' %', bx + bw * f + (f > 0.6 ? -4 : 4), y + 33, { color: col.s[2], size: 11, weight: 700, align: f > 0.6 ? 'right' : 'left' });
      y += 50;
    };
    strip('by mass', c.pct / 100); strip('by moles (this is the mole fraction × 100)', c.x2);
    const rows = [['mass percent', c.pct.toFixed(2) + ' %', 'g solute per 100 g solution'], ['ppm', c.ppm >= 1e5 ? (c.ppm / 1e4).toFixed(1) + '×10⁴' : c.ppm.toFixed(0), 'g solute per 10⁶ g solution'],
      ['mole fraction x₂', c.x2.toFixed(4), 'n₂ / (n₁ + n₂), no unit'], ['molality m', c.m.toFixed(3) + ' mol/kg', 'mol per kg of SOLVENT'], ['molarity M', c.M.toFixed(3) + ' mol/L', 'mol per litre of SOLUTION']];
    rows.forEach((r, i) => { const yy = y + i * 31; if (yy > h - 8) return; text(ctx, r[0], bx, yy, { color: col.ink, size: 12, weight: 700 }); text(ctx, r[1], bx + bw * 0.46, yy, { color: col.s[3], size: 12.5, weight: 700 }); text(ctx, r[2], bx, yy + 11, { color: col.muted, size: 10 }); });
  };
  go();
}
