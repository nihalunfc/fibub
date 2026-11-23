// Class 11 Gravitation: Kepler's second law (equal areas in equal times). The planet moves on an ellipse with the Sun at one focus (semi-major axis a = 1, eccentricity e).
// Position from Kepler's equation M = E - e sin E (M = 2 pi t / T): x = a (cos E - e), y = b sin E. Two wedges swept in equal time T/12 are shaded: one at perihelion, one at aphelion. Their areas are equal (pi a b / 12), so the planet must move faster when close.
import { canvas, line, text, title, dot, row, slider, readout, loop } from '../../kit.js';

export default function (host) {
  let e = 0.6, t = 0;
  const cv = canvas(host, { aspect: 0.85, max: 440, min: 300, label: 'A planet on an ellipse around the Sun with two equal-time wedges of equal area shaded' });
  const ctl = row(host);
  slider(ctl, { label: 'Eccentricity e (0 = circle)', min: 0, max: 0.8, step: 0.05, value: 0.6, fmt: (v) => v.toFixed(2), oninput: (v) => { e = v; cv.redraw(); } });
  const b2 = row(host); const lp = loop(host, (dt) => { t = (t + dt / 8) % 1; cv.redraw(); }); lp.button(b2);
  const ro = readout(host);
  const solve = (M) => { let E = M; for (let i = 0; i < 30; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E)); return E; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Equal areas in equal times', col), b = Math.sqrt(1 - e * e);
    const S = Math.min((w - 40) / 2, (h - top - 30) / 2 / Math.max(b, 0.4)), fx = w / 2 + S * e, cy = top + (h - top) / 2 + 4;
    const P = (E) => [fx + S * (Math.cos(E) - e), cy - S * b * Math.sin(E)];
    const ell = []; for (let k = 0; k <= 120; k++) ell.push(P(2 * Math.PI * k / 120)); line(ctx, ell, col.muted, 1.5);
    const wedge = (M0, c) => { ctx.beginPath(); ctx.moveTo(fx, cy); for (let k = 0; k <= 24; k++) { const p = P(solve(M0 + (2 * Math.PI / 12) * k / 24)); ctx.lineTo(p[0], p[1]); } ctx.closePath(); ctx.fillStyle = c; ctx.globalAlpha = 0.45; ctx.fill(); ctx.globalAlpha = 1; };
    wedge(-Math.PI / 12, col.s[0]); wedge(Math.PI - Math.PI / 12, col.s[2]);
    const M = 2 * Math.PI * t, E = solve(M), p = P(E), r = 1 - e * Math.cos(E), sp = Math.sqrt(Math.max(0, 2 / r - 1));
    line(ctx, [[fx, cy], p], col.ink, 1.5);
    dot(ctx, fx, cy, 7, col.s[3], col.panel); text(ctx, 'Sun', fx - 10, cy + 16, { color: col.ink, size: 10.5, align: 'right', weight: 700 });
    dot(ctx, p[0], p[1], 6, col.s[1], col.panel);
    text(ctx, 'fast (near)', Math.min(w - 40, P(0)[0]), P(0)[1] - 16, { color: col.s[0], size: 10.5, weight: 700, align: 'center' });
    text(ctx, 'slow (far)', Math.max(36, P(Math.PI)[0]), P(Math.PI)[1] - 16, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    ro.textContent = `Both shaded wedges are swept in the same time (one twelfth of a year) and have the same area π a b / 12 = ${(Math.PI * b / 12).toFixed(3)} (a = 1). The planet is now ${r.toFixed(2)} from the Sun, moving at ${sp.toFixed(2)} × the circular speed. Perihelion speed ÷ aphelion speed = (1+e)/(1−e) = ${((1 + e) / (1 - e)).toFixed(2)}.`;
  };
  cv.redraw();
}
