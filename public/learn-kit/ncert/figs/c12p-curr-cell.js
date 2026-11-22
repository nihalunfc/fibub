// Class 12 Current Electricity: a cell with internal resistance. emf E is the potential difference when no current flows; with current I the terminal voltage is
// V = E - I r (the "lost volts" Ir are dropped inside the cell). The bar splits E into V and Ir; the graph of V against I is a straight line from E (open circuit)
// down to zero at the short-circuit current E/r. The dot is the present load R: I = E/(R + r).
import { canvas, text, title, axes, line, dot, row, slider, readout } from '../../kit.js';

export default function (host) {
  let E = 6, r = 1, R = 4;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'Terminal voltage of a cell against current drawn, with the voltage lost inside the cell' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'emf E (V)', min: 1.5, max: 12, step: 0.5, value: E, fmt: (v) => v.toFixed(1), oninput: (v) => { E = v; go(); } });
  slider(ctl, { label: 'internal resistance r (Ω)', min: 0.1, max: 3, step: 0.1, value: r, fmt: (v) => v.toFixed(1), oninput: (v) => { r = v; go(); } });
  slider(ctl, { label: 'load R (Ω)', min: 0.2, max: 20, value: R, log: true, fmt: (v) => v.toFixed(1), oninput: (v) => { R = v; go(); } });
  const go = () => { const I = E / (R + r); ro.textContent = `I = E/(R + r) = ${I.toFixed(2)} A;  terminal voltage V = E − Ir = ${(E - I * r).toFixed(2)} V (= IR = ${(I * R).toFixed(2)} V);  lost inside the cell: ${(I * r).toFixed(2)} V.  Short-circuit current E/r = ${(E / r).toFixed(1)} A.`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Terminal voltage V = E − Ir', col), I = E / (R + r), V = E - I * r;
    const bx = 20, bw = w - 40, by = top + 14;
    ctx.fillStyle = col.s[2]; ctx.fillRect(bx, by, bw * V / E, 22); ctx.fillStyle = col.s[3]; ctx.fillRect(bx + bw * V / E, by, bw * (1 - V / E), 22); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(bx, by, bw, 22);
    text(ctx, 'V to the load', bx + 4, by + 11, { color: col.panel, size: 11, weight: 700 }); if (V / E < 0.8) text(ctx, 'Ir lost', bx + bw - 4, by + 11, { color: col.ink, size: 11, weight: 700, align: 'right' });
    text(ctx, 'E (whole bar)', bx + bw / 2, by + 36, { color: col.muted, size: 10.5, align: 'center' });
    const A = axes(ctx, w, h, col, { x: [0, 1.05 * E / r > 40 ? 40 : 1.05 * E / r], y: [0, E * 1.05], xlabel: 'current I (A)', ylabel: 'terminal voltage V (V)', l: 46, t: by + 52, b: 40 });
    const xm = E / r;
    ctx.save(); A.clip(); line(ctx, [[A.X(0), A.Y(E)], [A.X(xm), A.Y(0)]], col.s[0], 3); ctx.restore();
    dot(ctx, A.X(I), A.Y(V), 6, col.s[3], col.panel);
    text(ctx, 'E (I = 0)', A.L + 6, A.Y(E) + 12, { color: col.muted, size: 10.5 }); text(ctx, 'slope = −r', A.X(xm * 0.45), A.Y(E * 0.55) - 12, { color: col.s[0], size: 11.5, weight: 700 });
  };
  go();
}
