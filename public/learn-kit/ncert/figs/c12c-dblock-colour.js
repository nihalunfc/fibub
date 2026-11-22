// Class 12 Chemistry, d- and f-block: why transition metal ions are coloured. Water (or other ligands) splits the five d orbitals into two groups. A d electron can jump
// up if a photon of energy delta = hc/lambda is absorbed. White light minus that colour leaves the complementary colour, which is what we see.
// Ions with d0 (Sc3+) or d10 (Zn2+) have no d-d jump possible, so they are colourless. Wavelengths are approximate absorption maxima of the aqua ions.
import { canvas, text, title, line, arrow, row, choice, readout, loop } from '../../kit.js';

const ION = {
  Ti: ['Ti³⁺ (d¹)', 500, '#7e4fa8', 'purple'], V: ['V³⁺ (d²)', 590, '#3f9a5a', 'green'], Cr: ['Cr³⁺ (d³)', 575, '#7a5aa8', 'violet'], Co: ['Co²⁺ (d⁷)', 510, '#d98aa8', 'pink'],
  Ni: ['Ni²⁺ (d⁸)', 720, '#4fa863', 'green'], Cu: ['Cu²⁺ (d⁹)', 800, '#3a86d6', 'blue'], Sc: ['Sc³⁺ (d⁰)', 0, '#f4f4f4', 'colourless'], Zn: ['Zn²⁺ (d¹⁰)', 0, '#f4f4f4', 'colourless'],
};
const hue = (nm) => (nm < 440 ? 270 : nm < 490 ? 270 - (nm - 440) * 3.6 : nm < 580 ? 180 - (nm - 490) * 1.33 : 60 - (nm - 580) * 0.43);

export default function (host) {
  let key = 'Cu', ph = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Absorption of a photon by a d electron explains the colour of a transition metal ion' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'ion', Object.keys(ION).map((k) => [k, k]), key, (v) => { key = v; go(); });
  loop(host, (dt) => { ph = (ph + dt * 0.5) % 1; cv.redraw(); });
  const go = () => {
    const [nm, lam, , c] = ION[key];
    ro.textContent = lam ? `${nm}: absorbs near ${lam} nm (Δ = hc/λ = ${(1240 / lam).toFixed(2)} eV, ${(119627 / lam).toFixed(0)} kJ/mol), so the solution looks ${c}.` : `${nm}: no d–d jump is possible (${key === 'Sc' ? 'no d electrons' : 'd orbitals full'}), so it absorbs no visible light: colourless.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Colour from a d–d jump', col), [nm, lam, hex] = ION[key];
    // spectrum
    const sx = 20, sw = w - 40, sy = top + 6, sh = 22;
    for (let x = 0; x < sw; x++) { const l = 400 + (x / sw) * 400, dark = lam && Math.abs(l - lam) < 45; ctx.fillStyle = dark ? col.panel : `hsl(${hue(l)},85%,52%)`; ctx.fillRect(sx + x, sy, 1.5, sh); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(sx, sy, sw, sh);
    text(ctx, '400 nm', sx, sy + sh + 10, { color: col.muted, size: 10 }); text(ctx, '800 nm', sx + sw, sy + sh + 10, { color: col.muted, size: 10, align: 'right' });
    text(ctx, lam ? 'white light after the solution: a band is missing' : 'white light passes straight through', w / 2, sy + sh + 25, { color: col.muted, size: 10.5, align: 'center' });
    // energy levels
    const ey = top + 82, eh = h - ey - 62, lx = w * 0.14, ex = w * 0.5;
    text(ctx, 'eg', ex + 56, ey + 8, { color: col.muted, size: 11 }); text(ctx, 't₂g', ex + 56, ey + eh - 8, { color: col.muted, size: 11 });
    line(ctx, [[ex - 50, ey + 8], [ex + 50, ey + 8]], col.ink, 3); line(ctx, [[ex - 50, ey + eh - 8], [ex + 50, ey + eh - 8]], col.ink, 3);
    if (lam) {
      arrow(ctx, ex - 86, ey + eh - 8, ex - 86, ey + 8, col.s[3], 1.5, 6); text(ctx, 'Δ', ex - 92, ey + eh / 2, { color: col.s[3], size: 13, weight: 700, align: 'right' });
      const p = Math.min(1, ph * 1.6), photon = p < 0.5 ? p * 2 : 1, jump = p < 0.5 ? 0 : (p - 0.5) * 2;
      const lamHue = `hsl(${hue(lam)},85%,50%)`;
      if (photon < 1) { const x = lx + (ex - 6 - lx) * photon, y = ey + eh - 8; ctx.strokeStyle = lamHue; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i < 40; i++) { const xx = x - i * 1.6; i ? ctx.lineTo(xx, y - 14 + Math.sin(i * 0.9) * 5) : ctx.moveTo(xx, y - 14); } ctx.stroke(); }
      const ey2 = ey + eh - 8 - jump * (eh - 16); ctx.fillStyle = col.s[2]; ctx.beginPath(); ctx.arc(ex - 6, ey2 - 9, 6, 0, 7); ctx.fill();
      text(ctx, 'photon', lx, ey + eh - 26, { color: lamHue, size: 11, weight: 700 });
    } else text(ctx, key === 'Sc' ? 'no electrons to move' : 'no empty d place to jump to', ex, ey + eh / 2, { color: col.muted, size: 12, align: 'center' });
    // swatch
    const by = h - 52; ctx.fillStyle = hex; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.fillRect(w / 2 - 70, by, 40, 36); ctx.strokeRect(w / 2 - 70, by, 40, 36);
    text(ctx, `${nm}: looks ${ION[key][3]}`, w / 2 - 22, by + 18, { color: col.ink, size: 12.5, weight: 700 });
  };
  go();
}
