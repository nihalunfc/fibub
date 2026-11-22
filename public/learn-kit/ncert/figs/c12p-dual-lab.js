// Class 12 Dual Nature: a photocell lab. Light of frequency nu falls on a metal plate (work function phi). Electrons come out only if h nu > phi,
// with a maximum kinetic energy K = h nu - phi. The collector voltage V pushes them on (V > 0) or holds them back (V < 0). The photocurrent
// is zero at the stopping potential V0 = K/e, grows as the collector turns less negative, and saturates; brighter light means more electrons, so a
// larger saturation current, but the same V0. Electrons are drawn with random energies up to K to show which ones are turned back.
import { canvas, text, title, row, slider, choice, readout, line, dot, loop, rng } from '../../kit.js';
import { wl2rgb, HC_EV_NM } from '../c12p-optlib.js';

const METALS = { Cs: 2.1, Na: 2.3, Zn: 4.3, Cu: 4.7 };
export default function (host) {
  let metal = 'Na', f = 8, I = 60, V = 0, t = 0;
  const cv = canvas(host, { aspect: 1.02, max: 440, min: 330, label: 'Photocell with adjustable light frequency, brightness, metal and collector voltage' });
  const ctl = row(host);
  choice(ctl, 'Metal', Object.keys(METALS).map((k) => [k, k]), metal, (v) => { metal = v; cv.redraw(); });
  slider(ctl, { label: 'Frequency ν', min: 3, max: 14, step: 0.1, value: f, fmt: (v) => `${v.toFixed(1)}×10¹⁴ Hz`, oninput: (v) => { f = v; cv.redraw(); } });
  slider(ctl, { label: 'Brightness', min: 10, max: 100, step: 5, value: I, fmt: (v) => `${v}%`, oninput: (v) => { I = v; cv.redraw(); } });
  slider(ctl, { label: 'Collector voltage V', min: -4, max: 4, step: 0.1, value: V, fmt: (v) => `${v.toFixed(1)} V`, oninput: (v) => { V = v; cv.redraw(); } });
  loop(host, (dt) => { t += dt; cv.redraw(); });
  const out = readout(host);
  const r = rng(5), U = Array.from({ length: 9 }, () => ({ u: 0.15 + 0.85 * r(), p: r() }));
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Photocell: light, metal, collector', col) + 4, phi = METALS[metal], hv = (6.626e-34 * f * 1e14) / 1.602e-19, K = Math.max(0, hv - phi), V0 = K, lam = 2.998e8 / (f * 1e14) * 1e9;
    const sh = (h - top) * 0.36, cy = top + sh * 0.55, cx0 = w * 0.18, cx1 = w * 0.82, hh = sh * 0.36;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 3; line(ctx, [[cx0, cy - hh], [cx0, cy + hh]], col.s[2], 6); line(ctx, [[cx1, cy - hh], [cx1, cy + hh]], col.ink, 6);
    text(ctx, metal, cx0 - 6, cy + hh + 14, { color: col.s[2], size: 11, weight: 700, align: 'center' }); text(ctx, 'collector', cx1, cy + hh + 14, { color: col.muted, size: 10.5, align: 'center' });
    // light
    ctx.save(); ctx.globalAlpha = 0.25 + 0.6 * I / 100; ctx.strokeStyle = wl2rgb(lam); ctx.lineWidth = 3;
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(cx0 - 8 - 60 + k * 14, top + 2 + k * 2); ctx.lineTo(cx0 - 8, cy - 8 + k * 8); ctx.stroke(); }
    ctx.restore();
    text(ctx, `${lam.toFixed(0)} nm`, 8, top + 8, { color: col.muted, size: 10.5 });
    const n = Math.round(1 + (I / 100) * 8);
    if (K > 0) for (let k = 0; k < n; k++) {
      const e = U[k], s = (t * 0.45 + e.p) % 1, y = cy - hh + 0.1 * hh + (e.p * 1.8 * hh) % (1.8 * hh);
      let x;
      if (V >= 0 || e.u * K > -V) x = cx0 + s * (cx1 - cx0); else { const q = (e.u * K) / -V, sw = s < 0.5 ? s * 2 : 2 - s * 2; x = cx0 + q * (cx1 - cx0) * (1 - (1 - sw) ** 2) * 0.9; }
      dot(ctx, x + 6, y, 3.6, col.s[0]);
    }
    // graph: current against V
    const gy0 = top + sh + 30, gh = h - gy0 - 26, gx0 = 40, gx1 = w - 14, X = (v) => gx0 + ((v + 4) / 8) * (gx1 - gx0), Yv = (c) => gy0 + gh - c * gh;
    const Isat = K > 0 ? I / 100 : 0, cur = (v) => (K <= 0 ? 0 : v <= -V0 ? 0 : v >= 0 ? Isat * (1 - 0.35 * Math.exp(-v * 1.6)) : Isat * 0.65 * (1 + v / V0) ** 1.0);
    line(ctx, [[gx0, Yv(0)], [gx1, Yv(0)]], col.line, 1); line(ctx, [[X(0), gy0], [X(0), gy0 + gh]], col.line, 1);
    const pts = []; for (let v = -4; v <= 4.001; v += 0.1) pts.push([X(v), Yv(cur(v))]);
    line(ctx, pts, col.ink, 2.2);
    if (K > 0 && V0 <= 4) { line(ctx, [[X(-V0), gy0 + gh], [X(-V0), gy0 + gh * 0.4]], col.s[3], 1.4, [4, 3]); text(ctx, 'V₀', X(-V0), gy0 + gh * 0.4 - 6, { color: col.s[3], size: 11, weight: 700, align: 'center' }); }
    dot(ctx, X(V), Yv(cur(V)), 5, col.s[3], col.ink);
    for (const v of [-4, -2, 0, 2, 4]) text(ctx, String(v), X(v), h - 10, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'photocurrent', gx0 + 4, gy0 - 8, { color: col.muted, size: 10.5 }); text(ctx, 'collector voltage V (volts)', gx1, h - 22, { color: col.muted, size: 10.5, align: 'right' });
    const nu0 = (phi * 1.602e-19) / 6.626e-34 / 1e14;
    out.innerHTML = K <= 0 ? `hν = ${hv.toFixed(2)} eV is less than φ = ${phi} eV (threshold ν₀ = ${nu0.toFixed(2)}×10¹⁴ Hz). <b>No electrons at all</b>, however bright the light.` : `hν = ${hv.toFixed(2)} eV, φ = ${phi} eV, so K<sub>max</sub> = hν − φ = <b>${K.toFixed(2)} eV</b> and the stopping potential is <b>V₀ = ${V0.toFixed(2)} V</b>. Photocurrent now: ${(cur(V) * 100).toFixed(0)} units` + (V < -V0 ? ' (the collector is more negative than −V₀: nothing reaches it).' : '.');
  };
  cv.redraw();
}
