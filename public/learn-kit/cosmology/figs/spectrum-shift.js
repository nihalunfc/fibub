// 4.1 Slipher's discovery. A galaxy's spectrum next to a lab spectrum: the same dark lines (calcium, hydrogen,
// magnesium, sodium), all moved by the same factor 1 + z. Slide the speed, or pick a galaxy: Andromeda is
// coming towards us (lines move blue), most others move away (lines move red). The zoom box shows the hydrogen
// line, where a shift of a few hundred km/s becomes visible.
import { canvas, text, title, line, arrow, row, slider, choice, readout } from '../../kit.js';
import { waveCSS } from '../colour.js';

const LINES = [[393.4, 'Ca H, K'], [396.8, ''], [486.1, 'Hβ'], [517.3, 'Mg'], [589.3, 'Na'], [656.3, 'Hα']];
const C = 299792.458;

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 380, min: 290, label: 'A lab spectrum and a galaxy spectrum with the dark lines shifted' });
  let v = 1000;
  const ctl = row(host);
  const s = slider(ctl, { label: 'Galaxy speed (minus = towards us)', min: -500, max: 20000, step: 50, value: v, fmt: (x) => `${Math.round(x).toLocaleString('en-CA')} km/s`, oninput: (x) => { v = x; show(); cv.redraw(); } });
  choice(ctl, 'Pick a galaxy', [[-300, 'Andromeda'], [1000, 'Sombrero'], [1800, 'Slipher\'s fastest'], [15000, 'A far galaxy']], v, (x) => { v = x; s.set(x); show(); cv.redraw(); });
  const out = readout(host);
  const z = () => v / C;
  const show = () => {
    const zz = z();
    out.innerHTML = `z = <b>${zz.toFixed(4)}</b>. Every line is ${zz >= 0 ? 'longer' : 'shorter'} by the same factor 1 + z = ${(1 + zz).toFixed(4)}: Hα at 656.3 nm is seen at <b>${(656.3 * (1 + zz)).toFixed(1)} nm</b>. ${zz < 0 ? 'Blueshift: coming towards us.' : zz > 0 ? 'Redshift: moving away.' : ''}`;
  };
  const strip = (ctx, x0, x1, y, hgt, lo, hi, shift, col, labels) => {
    const X = (nm) => x0 + ((nm - lo) / (hi - lo)) * (x1 - x0);
    for (let x = x0; x < x1; x++) {
      const nm = lo + ((x - x0) / (x1 - x0)) * (hi - lo);
      ctx.fillStyle = waveCSS(nm); ctx.fillRect(x, y, 1.5, hgt);
    }
    ctx.strokeStyle = col.line; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y + 0.5, x1 - x0 - 1, hgt - 1);
    for (const [nm, name] of LINES) {
      const o = nm * shift;
      if (o < lo || o > hi) continue;
      ctx.fillStyle = '#000'; ctx.fillRect(X(o) - 1.5, y, 3, hgt);
      if (labels && name) text(ctx, name, X(o), y - 8, { color: col.muted, size: 10.5, align: 'center' });
    }
    return X;
  };
  cv.draw = (ctx, w, h, col) => {
    const x0 = 46, x1 = w - 12, lo = 380, hi = 750, sh = 1 + z();
    const dy = title(ctx, 'Same pattern of lines, slid along the rainbow', col) - 32; // room for a two-line title
    ctx.save(); ctx.translate(0, dy);
    text(ctx, 'Lab', 6, 62, { color: col.ink, size: 11.5, weight: 600 });
    const X = strip(ctx, x0, x1, 48, 28, lo, hi, 1, col, true);
    text(ctx, 'Galaxy', 4, 106, { color: col.ink, size: 11.5, weight: 600 });
    strip(ctx, x0, x1, 92, 28, lo, hi, sh, col, false);
    for (const [nm] of LINES) {
      const o = nm * sh;
      if (o > hi || Math.abs(o - nm) < 0.8) continue;
      line(ctx, [[X(nm), 77], [X(o), 91]], col.muted, 1, [2, 2]);
    }
    text(ctx, '400 nm (violet)', X(400), 132, { color: col.muted, size: 10.5, align: 'left' });
    text(ctx, '700 nm (red)', X(700), 132, { color: col.muted, size: 10.5, align: 'center' });
    // zoom box around H-alpha
    const zx0 = x0, zx1 = x1, zy = Math.min(186, h - 92 - dy), zh = 34, zlo = 645, zhi = 690;
    text(ctx, 'Zoomed in around the hydrogen line Hα (45 nm wide):', zx0, zy - 26, { color: col.ink, size: 11.5, weight: 600 });
    text(ctx, 'Lab', 6, zy + zh / 2, { color: col.ink, size: 11.5, weight: 600 });
    const ZX = strip(ctx, zx0, zx1, zy, zh, zlo, zhi, 1, col, false);
    text(ctx, 'Galaxy', 4, zy + zh + 12 + zh / 2, { color: col.ink, size: 11.5, weight: 600 });
    strip(ctx, zx0, zx1, zy + zh + 12, zh, zlo, zhi, sh, col, false);
    const o = 656.3 * sh;
    if (o >= zlo && o <= zhi && Math.abs(ZX(o) - ZX(656.3)) > 6) arrow(ctx, ZX(656.3), zy + zh + 6, ZX(o), zy + zh + 6, col.ink, 1.5, 6);
    if (o > zhi) text(ctx, 'Hα has moved off this window →', zx1 - 4, zy + zh + 12 + zh / 2, { color: col.panel, size: 11.5, weight: 700, align: 'right' });
    ctx.restore();
  };
  show(); cv.redraw();
}
