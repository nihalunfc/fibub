// Class 11 Chemistry, Structure of Atom: de Broglie wavelength, lambda = h / (m v), h = 6.626e-34 J s.
// A fast electron has a wavelength about the size of an atom (so wave behaviour matters); a cricket ball's is 10^-34 m, far too small to ever notice.
// The log scale runs from 1e-40 m to 1e-5 m; the marker shows the wavelength, the bands show a nucleus and an atom.
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';

const OBJ = { e: ['electron', 9.109e-31, 2e6], p: ['proton', 1.673e-27, 1e5], dust: ['dust grain', 1e-9, 0.01], ball: ['cricket ball', 0.16, 40], car: ['car', 1000, 20] };
export default function (host) {
  let k = 'e', v = 2e6;
  const cv = canvas(host, { aspect: 0.5, max: 440, min: 300, label: 'The de Broglie wavelength of different objects on a log scale next to the size of an atom' });
  const ctl = row(host), ro = readout(host);
  choice(ctl, 'object', Object.entries(OBJ).map(([a, b]) => [a, b[0]]), k, (x) => { k = x; v = OBJ[k][2]; sp.set(v); go(); });
  const sp = slider(ctl, { label: 'speed (m/s)', min: 0.01, max: 3e7, value: v, log: true, fmt: (x) => x.toExponential(1), oninput: (x) => { v = x; go(); } });
  const lam = () => 6.626e-34 / (OBJ[k][1] * v);
  const go = () => { const l = lam(); ro.textContent = `λ = h/(mv) = 6.626×10⁻³⁴ / (${OBJ[k][1].toExponential(2)} × ${v.toExponential(1)}) = ${l.toExponential(2)} m. ` + (l > 1e-12 ? 'Comparable to atoms or larger: wave behaviour can be measured (electron diffraction).' : 'Far smaller than any atom: you can never see the wave. Ordinary mechanics is fine.'); cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const t0 = title(ctx, 'how big is the matter wave?', col) + 20, L = 16, W = w - 32, X = (l) => L + W * (Math.log10(l) + 40) / 35, y = t0 + 30;
    ctx.fillStyle = col.s[2]; ctx.globalAlpha = 0.25; ctx.fillRect(X(1e-15), y - 16, X(1e-10) - X(1e-15), 32); ctx.globalAlpha = 1; ctx.strokeStyle = col.line; ctx.strokeRect(L, y - 16, W, 32);
    text(ctx, 'nucleus to atom size', (X(1e-15) + X(1e-10)) / 2, y + 30, { color: col.s[2], size: 10.5, weight: 700, align: 'center' });
    for (let e = -40; e <= -5; e += 5) { text(ctx, '1e' + e, X(10 ** e), y - 24, { color: col.muted, size: 9.5, align: 'center' }); ctx.strokeStyle = col.line; ctx.beginPath(); ctx.moveTo(X(10 ** e), y - 16); ctx.lineTo(X(10 ** e), y - 11); ctx.stroke(); }
    const l = Math.max(1e-40, Math.min(1e-5, lam())), x = X(l); ctx.fillStyle = col.s[3]; ctx.fillRect(x - 2, y - 16, 4, 32); ctx.beginPath(); ctx.moveTo(x, y + 18); ctx.lineTo(x - 6, y + 30); ctx.lineTo(x + 6, y + 30); ctx.fill();
    text(ctx, `λ = ${lam().toExponential(1)} m`, Math.max(60, Math.min(w - 60, x)), y + 58, { color: col.s[3], size: 13, weight: 700, align: 'center' });
    text(ctx, 'wave invisible →', 12, h - 12, { color: col.muted, size: 10.5 }); text(ctx, '← wave matters', w - 12, h - 12, { color: col.muted, size: 10.5, align: 'right' });
  };
  go();
}
