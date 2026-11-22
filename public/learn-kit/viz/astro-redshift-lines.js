// How a spectrum shifts when a source moves. The top strip is a lab spectrum with the hydrogen, sodium and calcium lines
// where they sit at rest; the lower strip is what we see for the radial velocity you choose. Positive velocity (moving away)
// shifts every line to the red, by the same fraction, Δλ/λ = z. Try a star (30 km/s), a spinning galaxy edge and a quasar.
import { canvas, text, row, slider, button, readout, title, arrow } from '../kit.js';

const LINES = [['Ca K', 393.4], ['Ca H', 396.8], ['Hγ', 434.0], ['Hβ', 486.1], ['Na D', 589.3], ['Hα', 656.3]];
const C = 299792.458;
function rgb(l) { // visible wavelength to colour (nm)
  let r = 0, g = 0, b = 0;
  if (l >= 380 && l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = -(l - 510) / 20; } else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = -(l - 645) / 65; } else if (l <= 780) r = 1;
  const f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (780 - l) / 80 : 1;
  return `rgb(${Math.round(255 * r * f)},${Math.round(255 * g * f)},${Math.round(255 * b * f)})`;
}
export default function (host) {
  let v = 30000;
  const cv = canvas(host, { aspect: 0.62, max: 340, min: 240, label: 'A rest spectrum and a Doppler shifted spectrum with absorption lines moved by the radial velocity' });
  const c1 = row(host), c2 = row(host);
  const sv = slider(c1, { label: 'Radial velocity (+ away)', min: -5000, max: 150000, step: 10, value: v, fmt: (x) => `${Math.round(x).toLocaleString()} km/s`, oninput: (x) => { v = x; show(); } });
  [['Star (+30)', 30], ['Galaxy edge (+200)', 200], ['Approaching (−1000)', -1000], ['Quasar 3C 273 (+47,000)', 47000], ['Distant galaxy (+100,000)', 100000]].forEach(([n, x]) => button(c2, n, () => { v = x; sv.set(x); show(); }));
  const out = readout(host);
  const z = () => Math.sqrt((1 + v / C) / (1 - v / C)) - 1;
  function show() {
    const zz = z();
    out.innerHTML = `<b>v = ${Math.round(v).toLocaleString()} km/s → z = ${zz.toFixed(zz < 0.001 && zz > -0.001 ? 5 : 4)}</b> (relativistic Doppler; for small speeds z ≈ v/c). Hα moves from 656.3 nm to <b>${(656.3 * (1 + zz)).toFixed(1)} nm</b>${656.3 * (1 + zz) > 750 ? ', out of the visible range into the infrared' : ''}. Every line moves by the same fraction, so the pattern keeps its shape but slides.`;
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Absorption lines: rest and observed', col);
    const x0 = 14, x1 = w - 14, lo = 380, hi = 1000, X = (l) => x0 + ((l - lo) / (hi - lo)) * (x1 - x0), zz = z();
    const strip = (y, hh, shift, name) => {
      for (let px = x0; px < x1; px += 2) { const l = lo + ((px - x0) / (x1 - x0)) * (hi - lo); ctx.fillStyle = l <= 780 ? rgb(l) : col.soft; ctx.fillRect(px, y, 2, hh); }
      LINES.forEach(([n, l0]) => { const l = l0 * (shift ? 1 + zz : 1), x = X(l); if (x < x0 || x > x1) return; ctx.fillStyle = '#000'; ctx.fillRect(x - 1.5, y, 3, hh); });
      text(ctx, name, x0, y - 8, { color: col.ink, size: 11.5, weight: 700 });
    };
    const y1 = 60, hh = 40, y2 = y1 + hh + 66;
    strip(y1, hh, false, 'Lab (at rest)'); strip(y2, hh, true, 'Observed');
    LINES.forEach(([n, l0], i) => { const xa = X(l0), xb = X(l0 * (1 + zz)); text(ctx, n, xa, y1 + hh + 10 + (i % 2) * 10, { color: col.muted, size: 9.5, align: 'center' }); if (xb >= x0 && xb <= x1 && Math.abs(xb - xa) > 3) arrow(ctx, xa, y1 + hh + 36, xb, y2 - 4, zz > 0 ? col.bad : col.s[0], 1.1, 5); });
    for (let l = 400; l <= 1000; l += 100) { text(ctx, l === 400 ? '400 nm' : String(l), X(l), y2 + hh + 12, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'infrared (not visible)', X(880), y2 + hh + 28, { color: col.muted, size: 10, align: 'center' });
    text(ctx, 'wavelength', w / 2, h - 8, { color: col.muted, size: 10.5, align: 'center' });
  };
  show();
}
