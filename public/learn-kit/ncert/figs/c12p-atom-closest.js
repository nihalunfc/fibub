// Class 12 Atoms: distance of closest approach. An alpha particle of kinetic energy E heading straight at a nucleus (charge Ze) slows down as the electric
// potential energy U(r) = k (2e)(Ze) / r = 2.88 Z / r (MeV with r in fm) grows. It stops where U = E, i.e. at r0 = 2.88 Z / E, then turns back.
// Slide the alpha in along the curve: kinetic energy K = E - U falls to zero at r0, which is far bigger than the nucleus itself, so the alpha never touches it.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

const ATOMS = { Au: [79, 197], Cu: [29, 64], Al: [13, 27] };
export default function (host) {
  let el = 'Au', E = 5.5, r = 90;
  const cv = canvas(host, { aspect: 0.78, max: 440, min: 280, label: 'Potential energy of an alpha particle approaching a nucleus and the distance of closest approach' });
  const ctl = row(host);
  choice(ctl, 'Target', Object.keys(ATOMS).map((k) => [k, k]), el, (v) => { el = v; cv.redraw(); });
  slider(ctl, { label: 'Alpha energy E', min: 3, max: 9, step: 0.1, value: E, fmt: (v) => `${v.toFixed(1)} MeV`, oninput: (v) => { E = v; cv.redraw(); } });
  const rs = slider(ctl, { label: 'Distance r from nucleus', min: 10, max: 200, step: 1, value: r, fmt: (v) => `${v} fm`, oninput: (v) => { r = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Energy of an alpha near a nucleus', col) + 8, [Z, A] = ATOMS[el], k = 2.88 * Z, r0 = k / E, Rn = 1.2 * Math.cbrt(A);
    const gx0 = 44, gx1 = w - 14, gy0 = top + 6, gy1 = h - 30, X = (v) => gx0 + (v / 200) * (gx1 - gx0), Ymax = E * 2.4, Y = (e) => gy1 - Math.min(e, Ymax) / Ymax * (gy1 - gy0);
    line(ctx, [[gx0, gy1], [gx1, gy1]], col.ink, 1.2); line(ctx, [[gx0, gy0], [gx0, gy1]], col.ink, 1.2);
    const pts = []; for (let v = 10; v <= 200; v += 2) pts.push([X(v), Y(k / v)]);
    line(ctx, pts, col.s[1], 2.4); text(ctx, 'U = 2.88 Z / r', gx1 - 6, Y(k / 150) - 14, { color: col.s[1], size: 11, weight: 700, align: 'right' });
    line(ctx, [[gx0, Y(E)], [gx1, Y(E)]], col.s[3], 2, [6, 3]); text(ctx, `E = ${E.toFixed(1)} MeV`, gx1, Y(E) - 8, { color: col.s[3], size: 11, weight: 700, align: 'right' });
    if (r0 < 200) { line(ctx, [[X(r0), Y(E)], [X(r0), gy1]], col.ink, 1.2, [3, 3]); text(ctx, `r₀ = ${r0.toFixed(0)} fm`, X(r0) + 6, Y(E) + 16, { color: col.ink, size: 11, weight: 700 }); }
    line(ctx, [[X(Rn), gy1 - 14], [X(Rn), gy1]], col.s[2], 4); text(ctx, 'nuclear radius', X(Rn) + 4, gy1 - 24, { color: col.s[2], size: 10, weight: 700 });
    const U = k / r, K = E - U;
    dot(ctx, X(r), Y(Math.min(U, E)), 6, col.s[0], col.ink);
    for (const v of [0, 50, 100, 150, 200]) text(ctx, String(v), X(v), gy1 + 13, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'r (fm)', gx1, gy1 + 26, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'energy (MeV)', gx0 + 6, gy0 + 2, { color: col.muted, size: 10.5 });
    out.innerHTML = r < r0 ? `At r = ${r} fm the potential energy ${U.toFixed(1)} MeV is bigger than E: the alpha <b>never gets this close</b>. Its limit is r₀ = 2.88Z/E = <b>${r0.toFixed(1)} fm</b>, about ${(r0 / Rn).toFixed(1)} nuclear radii.` : `At r = ${r} fm: U = ${U.toFixed(1)} MeV and K = E − U = <b>${K.toFixed(1)} MeV</b>. It still has energy to go closer. It stops at r₀ = 2.88Z/E = <b>${r0.toFixed(1)} fm</b>, about ${(r0 / Rn).toFixed(1)} times the nuclear radius ${Rn.toFixed(1)} fm.`;
  };
  cv.redraw();
}
