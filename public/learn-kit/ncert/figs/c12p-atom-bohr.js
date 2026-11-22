// Class 12 Atoms (step player): deriving the Bohr radii and energies. Step 1: Coulomb attraction F = k e^2 / r^2 supplies the centripetal force m v^2 / r.
// Step 2: Bohr's rule m v r = n h / 2 pi. Step 3: eliminate v: r_n = n^2 h^2 / (4 pi^2 m k e^2) = 0.0529 n^2 nm and v_n = 2 pi k e^2 / (n h) = 2.19e6 / n m/s.
// Step 4: K = k e^2 / 2r, U = -k e^2 / r, E = K + U = -k e^2 / 2r. Step 5: E_n = -13.6 / n^2 eV.
import { canvas, text, title, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 300, label: 'Step by step derivation of the Bohr model radii and energies' });
  const TITLES = ['An electron circles a proton', 'Coulomb force supplies the centripetal force', 'Bohr’s rule: angular momentum comes in units of h/2π', 'Solve the two equations for r and v', 'The energy: K = ke²/2r, U = −ke²/r', 'Total energy E = −ke²/2r = −13.6/n² eV'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TITLES[step], col) + 8, cx = w * 0.27, cy = top + 84, R = Math.min(62, w * 0.18);
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    dot(ctx, cx, cy, 6, col.s[3]); text(ctx, '+e', cx + 8, cy + 14, { color: col.s[3], size: 11, weight: 700 });
    const ex = cx + R * Math.cos(-0.7), ey = cy + R * Math.sin(-0.7); dot(ctx, ex, ey, 5.5, col.s[0], col.ink); text(ctx, '−e, m', ex + 8, ey - 6, { color: col.s[0], size: 11, weight: 700 });
    const tx = -Math.sin(-0.7), ty = Math.cos(-0.7);
    arrow(ctx, ex, ey, ex + tx * 32, ey + ty * 32, col.s[2], 2.5, 8); text(ctx, 'v', ex + tx * 36 + 4, ey + ty * 36, { color: col.s[2], size: 12, weight: 700 });
    line(ctx, [[cx, cy], [ex, ey]], col.line, 1, [3, 3]); text(ctx, 'r', (cx + ex) / 2 - 8, (cy + ey) / 2 + 8, { color: col.muted, size: 12, weight: 700 });
    if (step >= 1) { arrow(ctx, ex, ey, ex + (cx - ex) * 0.55, ey + (cy - ey) * 0.55, col.s[3], 3, 9); text(ctx, 'F = ke²/r²', cx + 2, cy + R + 22, { color: col.s[3], size: 11.5, weight: 700, align: 'center' }); }
    const X = w * 0.52, f = (s, y, c = col.ink, wt = 400, sz = 12.5) => text(ctx, s, X, y, { color: c, size: sz, weight: wt });
    let y = top + 22;
    if (step >= 1 && step < 4) { f('Force = centripetal:', y, col.muted, 700, 11.5); y += 20; f('mv²/r = ke²/r²', y, col.ink, 700); y += 18; f('⇒ mv² = ke²/r   (1)', y, col.s[7], 700); y += 28; }
    if (step >= 2 && step < 4) { f('Quantum rule:', y, col.muted, 700, 11.5); y += 20; f('mvr = nh/2π   (2)', y, col.s[7], 700); y += 28; }
    if (step === 3) { f('From (1) and (2):', y, col.muted, 700, 11.5); y += 20; f('r = n²h²/(4π²mke²)', y, col.ink, 700); y += 18; f('  = 0.0529 n² nm', y, col.s[7], 700); y += 20; f('v = 2πke²/nh', y, col.ink, 700); y += 18; f('  = 2.19×10⁶/n m/s', y, col.s[7], 700); }
    if (step === 0) { text(ctx, 'two ideas decide the atom:', X, top + 22, { color: col.muted, size: 11.5 }); f('1  Newton + Coulomb', top + 44, col.ink, 700); f('2  Bohr’s quantum rule', top + 64, col.ink, 700); }
    if (step >= 4) {
      f('Kinetic: K = ½mv² = ke²/2r', y, col.s[2], 700, 11.5); y += 22; f('Potential: U = −ke²/r', y, col.s[3], 700, 11.5); y += 22; f('Total: E = K + U', y, col.ink, 700, 11.5); y += 18; f('   = −ke²/2r', y, col.s[7], 700); y += 24;
      if (step >= 5) { f('put in r = 0.0529 n² nm:', y, col.muted, 700, 11); y += 20; f('E_n = −13.6 / n² eV', y, col.s[7], 700, 14); }
      const by = h - 64, bw = 30, sc = 34, bx0 = 26, vals = [['K', 0.5, col.s[2]], ['U', -1, col.s[3]], ['E', -0.5, col.s[7]]];
      line(ctx, [[bx0 - 8, by], [bx0 + 3 * 46, by]], col.ink, 1);
      vals.forEach(([n, v, c], i) => { const x = bx0 + i * 46; ctx.fillStyle = c; if (v > 0) ctx.fillRect(x, by - v * sc, bw, v * sc); else ctx.fillRect(x, by, bw, -v * sc); text(ctx, n, x + bw / 2, v > 0 ? by - v * sc - 8 : by - v * sc + 11, { color: col.ink, size: 11, weight: 700, align: 'center' }); });
      text(ctx, 'bars in units of ke²/r', bx0 - 8, h - 8, { color: col.muted, size: 10 });
    }
  };
  cv.redraw();
  return { step(k) { step = Math.min(5, k); cv.redraw(); } };
}
