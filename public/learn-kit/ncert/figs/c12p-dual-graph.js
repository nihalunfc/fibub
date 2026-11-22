// Class 12 Dual Nature: stopping potential against frequency. Einstein's equation e V0 = h nu - phi gives a straight line V0 = (h/e) nu - phi/e.
// Its slope is h/e, the same for every metal (so the lines are parallel); where it meets the frequency axis is the threshold frequency nu0 = phi/h,
// and where it meets the V axis is -phi/e. Millikan used exactly this graph to measure h.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';

const M = { Na: [2.3, 0], Zn: [4.3, 1], Cu: [4.7, 2] };
export default function (host) {
  let metal = 'Na', f = 9;
  const cv = canvas(host, { aspect: 0.9, max: 440, min: 290, label: 'Stopping potential against frequency for three metals' });
  const ctl = row(host);
  choice(ctl, 'Metal', Object.keys(M).map((k) => [k, k]), metal, (v) => { metal = v; cv.redraw(); });
  slider(ctl, { label: 'Frequency ν', min: 4, max: 14, step: 0.1, value: f, fmt: (v) => `${v.toFixed(1)}×10¹⁴ Hz`, oninput: (v) => { f = v; cv.redraw(); } });
  const out = readout(host);
  const hq = 4.136e-15 * 1e14; // volts per 1e14 Hz = h/e
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'V₀ against ν: parallel straight lines', col) + 8, gx0 = 44, gx1 = w - 14, gy0 = top + 8, gy1 = h - 32;
    const X = (v) => gx0 + (v / 15) * (gx1 - gx0), Y = (v) => gy1 - ((v + 2.5) / 7.5) * (gy1 - gy0);
    line(ctx, [[gx0, Y(0)], [gx1, Y(0)]], col.ink, 1.2); line(ctx, [[gx0, gy0], [gx0, gy1]], col.ink, 1.2);
    for (let v = 0; v <= 15; v += 5) { text(ctx, String(v), X(v), Y(0) + 12, { color: col.muted, size: 10, align: 'center' }); }
    for (const v of [-2, 0, 2, 4]) text(ctx, String(v), gx0 - 5, Y(v), { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'ν (×10¹⁴ Hz)', gx1, gy1 + 22, { color: col.muted, size: 10.5, align: 'right' }); text(ctx, 'V₀ (volts)', gx0 + 6, gy0 + 2, { color: col.muted, size: 10.5 });
    Object.entries(M).forEach(([k, [phi, ci]]) => {
      const nu0 = phi / hq, sel = k === metal, c = col.s[ci];
      line(ctx, [[X(nu0), Y(0)], [X(15), Y(hq * 15 - phi)]], c, sel ? 3.2 : 1.6);
      line(ctx, [[X(0), Y(-phi)], [X(nu0), Y(0)]], c, 1, [4, 4]);
      if (Y(-phi) < gy1 + 2) dot(ctx, X(0), Y(-phi), 3, c);
      text(ctx, k, X(15) - 6, Y(hq * 15 - phi) + (ci === 2 ? 14 : ci === 1 ? -10 : -10), { color: c, size: 11.5, weight: 700, align: 'right' });
    });
    const phi = M[metal][0], nu0 = phi / hq, V0 = Math.max(0, hq * f - phi);
    dot(ctx, X(f), Y(V0), 5.5, col.s[3], col.ink);
    line(ctx, [[X(f), Y(V0)], [X(f), Y(0)]], col.s[3], 1, [3, 3]);
    text(ctx, 'every slope = h/e', X(5.2), Y(3.6), { color: col.ink, size: 11, weight: 700 });
    out.innerHTML = `${metal}: threshold ν₀ = φ/h = <b>${nu0.toFixed(2)}×10¹⁴ Hz</b> (φ = ${phi} eV), intercept on the V axis = −φ/e = <b>−${phi} V</b>. At ν = ${f.toFixed(1)}×10¹⁴ Hz: ` + (f <= nu0 ? 'below threshold, no emission.' : `V₀ = (h/e)ν − φ/e = <b>${V0.toFixed(2)} V</b>.`) + ` The slope h/e = ${(hq).toFixed(3)} V per 10¹⁴ Hz is the same for every metal, so h = e × slope = <b>6.63×10⁻³⁴ J s</b>.`;
  };
  cv.redraw();
}
