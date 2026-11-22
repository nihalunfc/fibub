// Class 12 Alternating Current (step player): impedance of a series LCR circuit from a phasor diagram. The current I is
// the same in R, L and C, so it is the reference arrow. V_R is along I, V_L is 90 degrees ahead, V_C is 90 degrees
// behind. Subtract (V_L - V_C), add V_R at right angles, and Pythagoras gives V = I sqrt(R^2 + (X_L - X_C)^2), so
// Z = sqrt(R^2 + (X_L - X_C)^2) and tan(phi) = (X_L - X_C)/R. Numbers: I = 1 A, R = 3, X_L = 7, X_C = 3 ohm (Z = 5).
import { canvas, line, dot, text, title, arrow } from '../../kit.js';

export default function (host) {
  let step = 0;
  const cv = canvas(host, { aspect: 0.82, max: 440, min: 300, label: 'Phasor diagram of a series LCR circuit built up step by step' });
  const TT = ['1. Series: the same current in R, L and C', '2. Three voltages, three directions', '3. V_L and V_C point opposite ways: subtract', '4. Add at a right angle: Pythagoras', '5. Divide by I: the impedance triangle'];
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, TT[step], col);
    const s = (h - top - 46) / 10.5, ox = Math.min(90, w * 0.2), oy = top + 14 + 7 * s;
    const P = (x, y) => [ox + x * s * 1.5, oy - y * s];
    const A = (x0, y0, x1, y1, c, wd = 3) => { const a = P(x0, y0), b = P(x1, y1); arrow(ctx, a[0], a[1], b[0], b[1], c, wd, 10); };
    const lab = (t, x, y, c, al = 'left') => { const p = P(x, y); text(ctx, t, p[0], p[1], { color: c, size: 12, weight: 700, align: al, halo: col.panel }); };
    const u = step === 4 ? 1 : 1; // unit label (volts for I = 1 A are the same numbers as ohms)
    if (step === 0) { A(0, 0, 4.2, 0, col.s[3]); lab('I (reference)', 2.0, -0.7, col.s[3], 'center'); text(ctx, 'Electrons have only one path, so the', 12, h - 40, { color: col.muted, size: 11.5 }); text(ctx, 'same current flows through every part.', 12, h - 24, { color: col.muted, size: 11.5 }); return; }
    if (step <= 2) {
      A(0, 0, 4.2, 0, col.line, 2);
      A(0, 0, 3, 0, col.s[0]); lab('V_R = IR  (with I)', 1.5, -0.7, col.s[0], 'center');
      A(0, 0, 0, 7, col.s[1]); lab('V_L = IX_L  (90° ahead)', 0.1, 7.5, col.s[1]);
      if (step === 1) A(0, 0, 0, -3, col.s[2]); else A(0, 0, 0, -3, col.s[2], 2);
      lab('V_C = IX_C (90° behind)', 0.1, -3.7, col.s[2]);
    }
    if (step === 2) { A(0.6, 3, 0.6, 7, col.s[4], 4); lab('V_L − V_C', 0.8, 5.3, col.s[4]); dot(ctx, ...P(0.6, 3), 3, col.s[4]); }
    if (step >= 3) {
      A(0, 0, 3, 0, col.s[0]); lab(step === 3 ? 'V_R' : 'R', 1.5, -0.7, col.s[0], 'center');
      A(3, 0, 3, 4, col.s[4]); lab(step === 3 ? 'V_L − V_C' : 'X = X_L − X_C', 3.15, 2, col.s[4]);
      A(0, 0, 3, 4, col.ink, 3.5); lab(step === 3 ? 'V = √(V_R² + (V_L−V_C)²)' : 'Z', step === 3 ? 0.1 : 1.2, step === 3 ? 4.8 : 2.7, col.ink);
      const [cx, cy] = P(0, 0); ctx.save(); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, 34, 0, -Math.atan2(4, 3 * 1.5 / 1.5) * 1, true); ctx.stroke(); ctx.restore();
      lab('φ', 0.75, 0.55, col.ink);
    }
    if (step === 3) { text(ctx, 'V = I√(R² + (X_L − X_C)²)', 12, h - 40, { color: col.muted, size: 11.5 }); text(ctx, 'here: 1 × √(3² + 4²) = 5 V for I = 1 A', 12, h - 24, { color: col.muted, size: 11.5 }); }
    if (step === 4) { text(ctx, 'Z = √(R² + (X_L − X_C)²) = 5 Ω,  tan φ = 4/3, φ ≈ 53°', 12, h - 40, { color: col.ink, size: 11.5, weight: 700 }); text(ctx, 'X_L > X_C: the circuit is inductive, current lags.', 12, h - 24, { color: col.muted, size: 11.5 }); }
  };
  return { step(i) { step = Math.min(4, i); cv.redraw(); } };
}
