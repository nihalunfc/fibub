// Class 12 Electromagnetic Induction: a rod pulled along rails in a magnetic field: ε = B l v, I = ε/R, braking force F = B² l² v / R, and the power you put in
// equals the heat in the resistor. Change v, B, l and R and see each number respond. Current is anticlockwise (Lenz): it opposes the growing flux.
import { canvas, text, title, row, slider, readout, line, dot, arrow, loop } from '../../kit.js';
import { bgrid, si } from '../c12p-mmlib.js';

export default function (host) {
  let v = 4, B = 0.5, l = 0.3, R = 2, t = 0;
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 260, label: 'A rod moving on rails in a magnetic field, with emf, current, force and power' });
  const ctl = row(host);
  slider(ctl, { label: 'Speed v', min: 0, max: 10, step: 0.5, value: v, fmt: (x) => `${x} m/s`, oninput: (x) => { v = x; } });
  slider(ctl, { label: 'Field B', min: 0.1, max: 1, step: 0.1, value: B, fmt: (x) => `${x.toFixed(1)} T`, oninput: (x) => { B = x; } });
  slider(ctl, { label: 'Rod length l', min: 0.1, max: 0.5, step: 0.05, value: l, fmt: (x) => `${x.toFixed(2)} m`, oninput: (x) => { l = x; } });
  slider(ctl, { label: 'Resistance R', min: 0.5, max: 5, step: 0.5, value: R, fmt: (x) => `${x} Ω`, oninput: (x) => { R = x; } });
  const out = readout(host);
  loop(host, (dt) => { t += dt * v * 0.12; cv.redraw(); });
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'ε = Blv, I = ε/R, F = B²l²v/R', col);
    bgrid(ctx, 0, top, w, h, true, col.line, 38, 5);
    const eps = B * l * v, I = eps / R, F = B * I * l, P = F * v, yc = (top + h) / 2, hh = 20 + l * 160, yT = yc - hh / 2, yB = yc + hh / 2, xL = 44, xR = w - 20, rx = xL + 30 + ((t % 1) * (xR - xL - 80));
    line(ctx, [[xL, yT], [xR, yT]], col.ink, 3); line(ctx, [[xL, yB], [xR, yB]], col.ink, 3); line(ctx, [[xL, yT], [xL, yB]], col.ink, 3);
    ctx.save(); ctx.fillStyle = col.panel; ctx.strokeStyle = col.s[1]; ctx.lineWidth = 2; ctx.fillRect(xL - 12, yc - 14, 24, 28); ctx.strokeRect(xL - 12, yc - 14, 24, 28); ctx.restore();
    line(ctx, [[rx, yT - 3], [rx, yB + 3]], col.s[2], 6);
    if (v > 0) { arrow(ctx, rx + 8, yc, rx + 8 + 14 + v * 4, yc, col.s[3], 3, 9); arrow(ctx, rx - 8, yc, rx - 8 - Math.min(60, 8 + F * 60), yc, col.bad, 3.5, 10); }
    const per = [[rx, yB], [rx, yT], [xL, yT], [xL, yB], [rx, yB]], segs = [(yB - yT), (rx - xL), (yB - yT), (rx - xL)], tot = segs.reduce((a, b) => a + b, 0);
    for (let k = 0; k < 12; k++) { let d = (((performance.now() / 1000) * Math.min(1.5, I * 0.3) + k / 12) % 1) * tot, i = 0; while (i < 3 && d > segs[i]) { d -= segs[i]; i++; } const f = d / segs[i], A = per[i], Bp = per[i + 1]; if (I > 0.001) dot(ctx, A[0] + (Bp[0] - A[0]) * f, A[1] + (Bp[1] - A[1]) * f, 3, col.s[1]); }
    text(ctx, 'F (braking)', rx + 8, yc + 18, { color: col.bad, size: 10.5, weight: 700 }); text(ctx, 'v', rx + 24 + v * 4, yc - 10, { color: col.s[3], size: 12, weight: 700 });
    out.innerHTML = `ε = Blv = ${B.toFixed(1)} × ${l.toFixed(2)} × ${v} = <b>${eps.toFixed(2)} V</b>. I = ε/R = <b>${I.toFixed(2)} A</b>. Braking force F = BIl = <b>${F.toFixed(3)} N</b>. Power you supply Fv = <b>${P.toFixed(3)} W</b> = I²R = ${(I * I * R).toFixed(3)} W of heat. Double v: emf and current double, force doubles, power quadruples.`;
  };
  cv.redraw();
}
