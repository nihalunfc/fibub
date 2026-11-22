// Class 12 Atoms: continuous, emission and absorption spectra. A hot solid gives a continuous rainbow. A glowing low-pressure gas gives bright lines at only
// certain wavelengths, a fingerprint of the element. White light passed through a cool gas comes out with dark lines at exactly the same wavelengths.
// Lines (nm): hydrogen 656.3, 486.1, 434.0, 410.2; sodium 589.0 (the yellow D line), 568.8, 615.4; helium 447.1, 471.3, 492.2, 501.6, 587.6, 667.8.
import { canvas, text, title, row, choice, readout, line, dot } from '../../kit.js';
import { wl2rgb } from '../c12p-optlib.js';

const LINES = { H: [656.3, 486.1, 434.0, 410.2], Na: [568.8, 589.0, 615.4], He: [447.1, 471.3, 492.2, 501.6, 587.6, 667.8] };
const NAME = { H: 'hydrogen', Na: 'sodium', He: 'helium' };
export default function (host) {
  let kind = 'emit', el = 'H';
  const cv = canvas(host, { aspect: 0.62, max: 440, min: 250, label: 'Continuous, emission and absorption spectra of hydrogen, sodium and helium' });
  const ctl = row(host);
  choice(ctl, 'Spectrum', [['cont', 'Continuous'], ['emit', 'Emission'], ['abs', 'Absorption']], kind, (v) => { kind = v; cv.redraw(); });
  choice(ctl, 'Gas', Object.keys(LINES).map((k) => [k, k]), el, (v) => { el = v; cv.redraw(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, kind === 'cont' ? 'Hot solid: continuous spectrum' : kind === 'emit' ? `Glowing ${NAME[el]}: emission lines` : `White light through cool ${NAME[el]}: absorption lines`, col) + 10;
    const x0 = 12, x1 = w - 12, X = (nm) => x0 + ((nm - 380) / (720 - 380)) * (x1 - x0), sh = (h - top) * 0.34, ys = top + (h - top) * 0.36;
    // source sketch
    const cy = top + (h - top) * 0.16;
    if (kind === 'cont') { ctx.fillStyle = 'rgba(255,170,60,0.85)'; ctx.fillRect(w * 0.4, cy - 8, w * 0.2, 16); text(ctx, 'hot filament', w * 0.5, cy - 16, { color: col.muted, size: 10.5, align: 'center' }); }
    else { ctx.strokeStyle = col.ink; ctx.lineWidth = 2; ctx.strokeRect(w * 0.38, cy - 10, w * 0.24, 20); ctx.fillStyle = kind === 'emit' ? wl2rgb(LINES[el][0], 0.8) : 'rgba(200,200,200,0.25)'; ctx.fillRect(w * 0.38 + 1, cy - 9, w * 0.24 - 2, 18); text(ctx, kind === 'emit' ? `${NAME[el]} gas, excited` : `cool ${NAME[el]} gas`, w * 0.5, cy - 18, { color: col.muted, size: 10.5, align: 'center' }); if (kind === 'abs') { line(ctx, [[8, cy], [w * 0.38, cy]], col.s[7], 3); text(ctx, 'white', 12, cy - 10, { color: col.muted, size: 10 }); } }
    ctx.fillStyle = '#000'; ctx.fillRect(x0, ys, x1 - x0, sh);
    if (kind === 'emit') for (const l of LINES[el]) { ctx.fillStyle = wl2rgb(l); ctx.fillRect(X(l) - 1.5, ys, 3, sh); }
    else { for (let px = x0; px < x1; px++) { ctx.fillStyle = wl2rgb(380 + ((px - x0) / (x1 - x0)) * 340); ctx.fillRect(px, ys, 1, sh); } if (kind === 'abs') for (const l of LINES[el]) { ctx.fillStyle = '#000'; ctx.fillRect(X(l) - 1.5, ys, 3, sh); } }
    for (const nm of [400, 500, 600, 700]) { line(ctx, [[X(nm), ys + sh], [X(nm), ys + sh + 5]], col.ink, 1); text(ctx, String(nm), X(nm), ys + sh + 16, { color: col.muted, size: 10, align: 'center' }); }
    text(ctx, 'wavelength (nm)', x1, ys + sh + 32, { color: col.muted, size: 10, align: 'right' });
    if (kind !== 'cont') LINES[el].forEach((l, i) => text(ctx, String(l), X(l), ys - 6 - (i % 2) * 11, { color: col.ink, size: 9.5, align: 'center' }));
    out.innerHTML = kind === 'cont' ? 'A hot solid or liquid radiates <b>every</b> wavelength: a continuous band, whatever it is made of.' : kind === 'emit' ? 'Each element emits <b>only certain wavelengths</b>: its fingerprint. Rutherford’s atom, with electrons free to have any energy, cannot explain why. Bohr’s did.' : 'The cool gas takes out exactly the wavelengths it would emit when hot. This is how astronomers find hydrogen and sodium in the Sun’s dark Fraunhofer lines.';
  };
  cv.redraw();
}
