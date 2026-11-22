// Class 12 Chemistry, Alcohols, Phenols and Ethers: acidity of alcohols and phenols. Choose a compound and slide the pH.
// HA <-> H+ + A-. The fraction ionised at a given pH is 1 / (1 + 10^(pKa - pH)) (Henderson-Hasselbalch). A lower pKa means a stronger acid.
// Phenol (pKa 10) is about a million times more acidic than ethanol (pKa 16) because the phenoxide ion spreads its negative charge over the ring; nitro groups spread it further.
// pKa values in water at 25 deg C (CRC Handbook; Bordwell tables).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const C = [['etoh', 'ethanol', 15.9, 'Alkyl group pushes electrons to O, so the ethoxide ion is unstable.'], ['water', 'water', 15.7, 'The reference: alcohols are a little weaker than water.'], ['me', '4-methylphenol', 10.26, 'CH₃ pushes electrons into the ring and slightly destabilises the phenoxide.'], ['ph', 'phenol', 9.99, 'The negative charge spreads onto the ring carbons (resonance).'], ['cl', '4-chlorophenol', 9.41, 'Cl pulls electrons (–I) and helps spread the charge.'], ['no', '4-nitrophenol', 7.15, '–NO₂ pulls electrons strongly, also by resonance from the para position.'], ['pic', '2,4,6-trinitrophenol', 0.38, 'Three –NO₂ groups: as strong as some mineral acids (picric acid).']];
export default function (host) {
  let k = 'ph', pH = 7, ls = 4;
  const cv = canvas(host, { aspect: 0.9, max: 400, min: 320, label: 'Fraction of molecules ionised for an alcohol or phenol at a chosen pH, and its pKa on a scale' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'compound', C.map(([id, n]) => [id, n]), k, (v) => { k = v; go(); });
  slider(ctl, { label: 'pH of the solution', min: 0, max: 14, step: 0.1, value: pH, fmt: (v) => v.toFixed(1), oninput: (v) => { pH = v; go(); } });
  const cur = () => C.find((c) => c[0] === k), frac = () => 1 / (1 + Math.pow(10, cur()[2] - pH));
  const go = () => { const c = cur(), f = frac(); ro.textContent = `${c[1]}: pKa = ${c[2]} (Ka = ${Math.pow(10, -c[2]).toExponential(1)}). At pH ${pH.toFixed(1)}, ${(f * 100).toFixed(f < 0.01 && f > 0 ? 3 : 1)} % is ionised. ${c[3]}`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const c = cur(), f = frac(), top = title(ctx, `${c[1]}: pKa ${c[2]}`, col), L = 20, R = w - 20, Y = top + 34;
    text(ctx, 'pKa scale: strong acid on the left, weak on the right', w / 2, top + 10, { color: col.muted, size: 10.5, align: 'center' });
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, Y); ctx.lineTo(R, Y); ctx.stroke();
    const X = (v) => L + (v / 18) * (R - L);
    for (let v = 0; v <= 18; v += 2) { ctx.beginPath(); ctx.moveTo(X(v), Y - 3); ctx.lineTo(X(v), Y + 3); ctx.stroke(); text(ctx, String(v), X(v), Y + 14, { color: col.muted, size: 9.5, align: 'center' }); }
    C.forEach((q) => { ctx.fillStyle = q[0] === k ? col.s[3] : col.muted; ctx.beginPath(); ctx.arc(X(q[2]), Y, q[0] === k ? 6 : 3.5, 0, 7); ctx.fill(); });
    // pH marker
    ctx.fillStyle = col.s[0]; ctx.beginPath(); ctx.moveTo(X(pH), Y + 22); ctx.lineTo(X(pH) - 5, Y + 32); ctx.lineTo(X(pH) + 5, Y + 32); ctx.fill(); text(ctx, 'pH', X(pH), Y + 42, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    // molecule grid: 10 x 5
    const gy = Y + 62, cols = 10, rows = 5, cw = (R - L) / cols, rh = Math.min(30, (h - gy - 74) / rows), nI = Math.round(f * cols * rows);
    for (let i = 0; i < cols * rows; i++) { const x = L + cw * (i % cols) + cw / 2, y = gy + rh * Math.floor(i / cols) + rh / 2, ion = i < nI; ctx.fillStyle = ion ? col.s[3] : col.soft; ctx.strokeStyle = ion ? col.s[3] : col.muted; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, Math.min(cw, rh) * 0.38, 0, 7); ctx.fill(); ctx.stroke(); text(ctx, ion ? '−' : 'H', x, y, { color: ion ? col.panel : col.muted, size: 10, weight: 700, align: 'center' }); }
    const by = gy + rh * rows + 16;
    text(ctx, `${(f * 100).toFixed(f < 0.01 && f > 0 ? 2 : 0)} % ionised  (filled − = anion A⁻, H = intact molecule)`, w / 2, by, { color: col.ink, size: 12, weight: 700, align: 'center' });
    text(ctx, 'ionised fraction = 1 / (1 + 10^(pKa − pH))', w / 2, by + 20, { color: col.muted, size: 10.5, align: 'center' });
    text(ctx, 'each step down in pKa = ten times stronger acid', w / 2, by + 38, { color: col.muted, size: 10.5, align: 'center' });
  };
  go();
}
