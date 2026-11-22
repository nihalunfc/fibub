// Class 12 Atoms: why Rutherford's model fails. In a classical atom the orbiting electron is accelerating, so Maxwell's theory says it radiates energy and
// spirals into the nucleus in about 1e-11 s, giving a continuous spectrum and no stable atoms. Real atoms last forever and give line spectra. Bohr's postulate:
// in certain allowed orbits the electron does not radiate. Switch between the two pictures.
import { canvas, text, title, row, choice, readout, line, dot, loop } from '../../kit.js';

export default function (host) {
  let m = 'cl', t = 0, ang = 0;
  const cv = canvas(host, { aspect: 0.72, max: 440, min: 270, label: 'A classical electron spiralling into the nucleus compared with a stable Bohr orbit' });
  const ctl = row(host);
  choice(ctl, 'Atom', [['cl', 'Classical (Rutherford)'], ['bohr', 'Bohr']], m, (v) => { m = v; t = 0; cv.redraw(); });
  loop(host, (dt) => { t += dt; ang += dt * (m === 'cl' ? 4 + 14 * Math.min(1, t / 6) : 4); if (m === 'cl' && t > 7) t = 0; cv.redraw(); }).button(ctl);
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, m === 'cl' ? 'Classical atom: the electron radiates and falls in' : 'Bohr atom: allowed orbit, no radiation', col) + 6, cx = w * 0.5, cy = top + (h - top) * 0.5, R0 = Math.min(w * 0.4, (h - top) * 0.44);
    const f = Math.max(0.04, 1 - (t / 6.2) ** 1.6), R = m === 'cl' ? R0 * f : R0 * 0.55;
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R0, 0, 7); ctx.stroke();
    if (m === 'cl') { for (let k = 0; k < 3; k++) { const rr = R + 14 + ((t * 40 + k * 22) % 66); ctx.strokeStyle = col.s[3]; ctx.globalAlpha = Math.max(0, 0.5 - (rr - R) / 130); ctx.beginPath(); ctx.arc(cx, cy, Math.min(rr, R0 + 30), 0, 7); ctx.stroke(); ctx.globalAlpha = 1; } }
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    dot(ctx, cx, cy, 5, col.s[3]); dot(ctx, cx + R * Math.cos(ang), cy - R * Math.sin(ang), 5.5, col.s[0], col.ink);
    text(ctx, m === 'cl' ? `time: ${(Math.min(t, 6.2) / 6.2 * 1.6e-11 * 1e12).toFixed(0)}×10⁻¹² s` : 'stays here for ever', 10, h - 10, { color: col.muted, size: 11 });
    out.innerHTML = m === 'cl' ? 'An accelerating charge radiates (Maxwell). The electron loses energy continuously, spirals in and <b>crashes into the nucleus in about 10⁻¹¹ s</b>; the light it gives out would change smoothly: a continuous spectrum. Neither is what we see.' : 'Bohr’s first postulate: the electron can move in certain <b>stationary orbits without radiating</b>, so atoms are stable. Light is emitted only in a jump between two orbits, so the spectrum has sharp lines.';
  };
  cv.redraw();
}
