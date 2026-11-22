// Class 12 Dual Nature: de Broglie wavelength lambda = h / p = h / (m v). Every moving object has one, but it is only noticeable when it is comparable
// with the size of something it meets (an atom, 1e-10 m). Pick an object and change its speed; the marker shows lambda on a ruler of powers of ten.
import { canvas, text, title, row, slider, choice, readout, line, dot } from '../../kit.js';
import { sci } from '../c12p-optlib.js';

const H = 6.626e-34;
const OBJ = { e: ['Electron', 9.11e-31, 1e6, 'm/s'], p: ['Proton', 1.673e-27, 1e5, 'm/s'], dust: ['Dust speck 1 µg', 1e-9, 0.01, 'm/s'], ball: ['Cricket ball 160 g', 0.16, 40, 'm/s'], man: ['Person 60 kg', 60, 5, 'm/s'] };
export default function (host) {
  let k = 'e', fac = 1;
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 270, label: 'de Broglie wavelength of different objects on a scale of powers of ten' });
  const ctl = row(host);
  choice(ctl, 'Object', Object.entries(OBJ).map(([id, o]) => [id, o[0].split(' ')[0]]), k, (v) => { k = v; cv.redraw(); });
  slider(ctl, { label: 'Speed × usual', min: 0.1, max: 10, value: 1, log: true, fmt: (v) => `× ${v.toFixed(v < 1 ? 2 : 1)}`, oninput: (v) => { fac = v; cv.redraw(); } });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'λ = h / (mv) on a ruler of powers of ten', col) + 10, [name, m, v0, u] = OBJ[k], v = v0 * fac, lam = H / (m * v);
    const x0 = 16, x1 = w - 16, lo = -38, hi = -4, X = (e) => x0 + ((e - lo) / (hi - lo)) * (x1 - x0), cy = top + (h - top) * 0.45;
    line(ctx, [[x0, cy], [x1, cy]], col.ink, 2);
    for (let e = lo; e <= hi; e += 2) { line(ctx, [[X(e), cy - 4], [X(e), cy + 4]], col.ink, 1); if ((e + 40) % 6 === 0) text(ctx, `10${String(e).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c])}`, X(e), cy + 18, { color: col.muted, size: 9.5, align: 'center' }); }
    const marks = [[-15, 'nucleus', 0], [-10, 'atom', 1], [-6.3, 'visible light', 0]];
    marks.forEach(([e, s, lv]) => { line(ctx, [[X(e), cy - 5], [X(e), cy - 30 - lv * 18]], col.s[2], 1.4); text(ctx, s, X(e), cy - 36 - lv * 18, { color: col.s[2], size: 10.5, weight: 700, align: 'center' }); });
    const e = Math.log10(lam), xe = Math.max(x0 + 4, Math.min(x1 - 4, X(e)));
    dot(ctx, xe, cy, 7, col.s[3], col.ink); line(ctx, [[xe, cy + 8], [xe, cy + 44]], col.s[3], 2);
    text(ctx, `λ of the ${name.split(' ')[0].toLowerCase()}`, xe, cy + 56, { color: col.s[3], size: 11.5, weight: 700, align: 'center' });
    text(ctx, 'shorter (harder to notice) ←', x0, h - 10, { color: col.muted, size: 10 }); text(ctx, '→ longer', x1, h - 10, { color: col.muted, size: 10, align: 'right' });
    const atoms = lam / 1e-10;
    out.innerHTML = `${name}, mass ${sci(m, 3)} kg, speed ${sci(v, 2)} m/s: p = mv = ${sci(m * v, 2)} kg m/s and <b>λ = h/p = ${sci(lam, 3)} m</b>` + (atoms > 0.05 ? `, about ${atoms.toPrecision(2)} atom sizes: comparable to atoms, so wave effects (diffraction by crystals) can be seen.` : `, which is ${sci(1e-10 / lam, 1)} times smaller than an atom: far too small to detect, so it behaves like an ordinary particle.`);
  };
  cv.redraw();
}
