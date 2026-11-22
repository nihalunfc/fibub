// Class 12 Chemistry, Coordination Compounds: the spectrochemical series with chromium(III). Stronger-field ligands split the d orbitals more (bigger delta_o), so the light absorbed
// has a shorter wavelength: lambda (nm) = 10^7 / delta_o (cm-1), and the colour seen is the complement. Delta_o values for [CrL6]: F- 15 200, H2O 17 400, NH3 21 600, en 21 900, CN- 26 600 cm-1.
// Colours are approximate (the complexes also absorb a second, higher band). Order of the full series: I- < Br- < S2- < SCN- < Cl- < F- < OH- < ox2- < H2O < NCS- < NH3 < en < CN- < CO.
import { canvas, text, title, axes, row, slider, readout } from '../../kit.js';

const LG = [['F⁻', 15200, '#58a96a', 'green'], ['H₂O', 17400, '#7e5ab0', 'violet'], ['NH₃', 21600, '#e8c040', 'yellow'], ['en', 21900, '#e8c040', 'yellow'], ['CN⁻', 26600, '#f1dc72', 'pale yellow']];
const hue = (nm) => (nm < 440 ? 270 : nm < 490 ? 270 - (nm - 440) * 3.6 : nm < 580 ? 180 - (nm - 490) * 1.33 : 60 - (nm - 580) * 0.43);

export default function (host) {
  let k = 1;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Splitting energy of chromium(III) complexes against ligand strength with absorbed and seen colour' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'ligand (weak to strong)', min: 0, max: 4, step: 1, value: k, fmt: (v) => LG[v][0], oninput: (v) => { k = v; go(); } });
  const go = () => {
    const [n, D, , c] = LG[k], lam = 1e7 / D;
    ro.textContent = `[Cr(${n})₆]: Δo = ${D.toLocaleString('en-IN')} cm⁻¹ (${(D * 0.01196).toFixed(0)} kJ/mol). First absorption near ${lam.toFixed(0)} nm, so the colour looks ${c}.`;
    cv.redraw();
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Stronger ligand, bigger Δo, shorter λ', col);
    const A = axes(ctx, w, h, col, { x: [-0.6, 4.6], y: [0, 30000], xt: [], yt: [0, 10000, 20000, 30000], fy: (v) => v / 1000 + 'k', ylabel: 'Δo (cm⁻¹)', l: 46, t: top + 4, b: h * 0.34 + 20 });
    const bw = (A.X(1) - A.X(0)) * 0.55;
    LG.forEach(([n, D], i) => { ctx.fillStyle = i === k ? col.s[0] : col.s[2]; ctx.fillRect(A.X(i) - bw / 2, A.Y(D), bw, A.B - A.Y(D)); text(ctx, n, A.X(i), A.B + 13, { color: i === k ? col.ink : col.muted, size: 12, weight: i === k ? 700 : 400, align: 'center' }); });
    // spectrum with absorbed marker, and swatch
    const lam = 1e7 / LG[k][1], sy = A.B + 34, sh = 18, sx = 20, sw = w - 100;
    for (let x = 0; x < sw; x++) { const l = 380 + (x / sw) * 420; ctx.fillStyle = `hsl(${hue(l)},85%,52%)`; ctx.fillRect(sx + x, sy, 1.5, sh); }
    ctx.strokeStyle = col.ink; ctx.lineWidth = 1; ctx.strokeRect(sx, sy, sw, sh);
    const mx = sx + ((Math.min(Math.max(lam, 380), 800) - 380) / 420) * sw; ctx.fillStyle = col.ink; ctx.beginPath(); ctx.moveTo(mx, sy - 2); ctx.lineTo(mx - 5, sy - 10); ctx.lineTo(mx + 5, sy - 10); ctx.fill();
    text(ctx, 'absorbed ≈ ' + lam.toFixed(0) + ' nm' + (lam < 400 ? ' (violet / near UV)' : ''), sx, sy + sh + 14, { color: col.muted, size: 10.5 });
    ctx.fillStyle = LG[k][2]; ctx.fillRect(w - 66, sy - 4, 46, sh + 14); ctx.strokeRect(w - 66, sy - 4, 46, sh + 14); text(ctx, 'seen', w - 43, sy + sh + 24, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
