// Class 12 Dual Nature: the Davisson-Germer experiment. A beam of electrons accelerated through V has wavelength 1.227/sqrt(V) nm. Scattered from the atoms of a
// nickel crystal (row spacing d = 0.215 nm), the electrons come out strongly only in directions where the waves from neighbouring rows add: d sin(phi) = lambda.
// At 54 V the peak is at about 51 degrees, as the wave theory predicts: the first direct evidence that electrons behave like waves.
import { canvas, text, title, row, slider, readout, line, dot, arrow } from '../../kit.js';

export default function (host) {
  let V = 54;
  const d = 0.215;
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'Electrons scattered from a nickel crystal show a peak at an angle given by d sin φ = λ' });
  const ctl = row(host);
  slider(ctl, { label: 'Accelerating voltage', min: 30, max: 100, step: 1, value: V, fmt: (v) => `${v} V`, oninput: (v) => { V = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Davisson–Germer: electrons off nickel', col) + 8, lam = 1.227 / Math.sqrt(V), s = lam / d, phi = Math.asin(Math.min(1, s));
    const cx = w * 0.5, cy = h - 40, R = Math.min(w * 0.46, (cy - top - 12) / 0.9);
    // crystal block
    ctx.fillStyle = col.soft; ctx.fillRect(cx - 34, cy, 68, 22); ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.strokeRect(cx - 34, cy, 68, 22);
    for (let i = 0; i < 6; i++) dot(ctx, cx - 28 + i * 11.2, cy + 5, 2.6, col.s[5]);
    text(ctx, 'nickel crystal', cx, cy + 36, { color: col.muted, size: 10.5, align: 'center' });
    // beam from above
    arrow(ctx, cx, top + 6, cx, cy - 2, col.s[0], 3, 9); text(ctx, 'electron beam', cx + 8, top + 18, { color: col.s[0], size: 11, weight: 700 });
    // intensity as radial plot around the crystal (angle measured from the beam direction, scattered into the upper side via backward angle)
    const pts = []; for (let a = -88; a <= 88; a += 2) { const r = a * Math.PI / 180, I = Math.exp(-(((Math.sin(Math.abs(r)) - s) / 0.09) ** 2)) * 1.0 + 0.12; const rr = R * (0.28 + 0.6 * I / 1.12); pts.push([cx + Math.sin(r) * rr, cy - Math.cos(r) * rr * 0 - Math.cos(Math.PI / 2 - Math.abs(r) * 0) * 0 - Math.cos(r) * rr + 0]); }
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R * 0.28, Math.PI, 2 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, R * 0.88, Math.PI, 2 * Math.PI); ctx.stroke();
    line(ctx, pts, col.ink, 2);
    for (const sg of [-1, 1]) { const rr = R * 0.9; line(ctx, [[cx, cy], [cx + sg * Math.sin(phi) * rr, cy - Math.cos(phi) * rr]], col.s[3], 1.5, [5, 4]); }
    text(ctx, `φ = ${(phi * 180 / Math.PI).toFixed(0)}°`, cx + Math.sin(phi) * R * 0.5 + 10, cy - Math.cos(phi) * R * 0.5, { color: col.s[3], size: 12, weight: 700 });
    out.innerHTML = `At V = ${V} V: λ = 1.227/√${V} = <b>${lam.toFixed(3)} nm</b>. Wave theory (d sin φ = λ with d = 0.215 nm) predicts a peak at <b>φ = ${(phi * 180 / Math.PI).toFixed(1)}°</b>. ` + (V === 54 ? 'At 54 V the real experiment found its peak at about 50°: the electrons behave as waves.' : 'Change the voltage and the peak moves, just as the wave theory says.');
  };
  cv.redraw();
}
