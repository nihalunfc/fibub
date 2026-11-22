// Flame tests and where the colour comes from. Pick a metal: heat lifts an electron to a higher level, it falls back and
// emits a photon of exact energy E = hc/λ, so each metal gives its own colour. The strip shows the main emission lines; the
// readout gives the photon energy. (Flame colours are drawn as they look; the wavelengths are standard line values.)
import { canvas, text, row, choice, readout, loop, title } from '../kit.js';
import { nm } from './_chem.js';

const EL = {
  Li: ['crimson red', [670.8, 610.4], 'rgb(220,50,70)'], Na: ['golden yellow', [589.0, 589.6], 'rgb(250,200,40)'], K: ['lilac (pale violet)', [766.5, 404.4], 'rgb(190,140,230)'],
  Ca: ['brick red', [622, 554, 422.7], 'rgb(230,90,40)'], Sr: ['crimson', [605, 460.7, 640], 'rgb(220,30,50)'], Ba: ['apple green', [553.5, 524, 614], 'rgb(150,220,70)'],
  Cu: ['blue-green', [510, 515, 521, 578], 'rgb(60,200,170)'], Cs: ['blue-violet', [455.5, 459.3], 'rgb(110,120,240)'],
};
export default function (host) {
  let el = 'Na', t = 0;
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 330, label: 'A coloured flame, an electron jumping between levels and the emission lines of a metal' });
  choice(row(host), 'Metal', Object.keys(EL).map((k) => [k, k]), el, (v) => { el = v; show(); });
  const out = readout(host);
  loop(host, (dt) => { t += dt; cv.redraw(); });
  function show() {
    const [name, lines] = EL[el];
    out.innerHTML = `<b>${el}</b> gives a <b>${name}</b> flame. Main line${lines.length > 1 ? 's' : ''}: ${lines.map((l) => `${l} nm (E = ${(1239.84 / l).toFixed(2)} eV)`).join(', ')}. E = hc/λ = 1239.84 eV·nm ÷ λ. Salts are best tested with a clean platinum or nichrome wire dipped in conc. HCl (to make the volatile chloride).`;
  }
  cv.draw = (ctx, w, h, col) => {
    const [, lines, fc] = EL[el], main = lines[0];
    title(ctx, `${el}: flame colour from photons`, col);
    // flame (left)
    const fx = w * 0.72, fy = h * 0.5 + 10;
    for (let k = 0; k < 3; k++) {
      const s = 1 - k * 0.28, fl = Math.sin(t * 9 + k) * 4;
      ctx.beginPath(); ctx.moveTo(fx, fy + 60);
      ctx.bezierCurveTo(fx - 38 * s, fy + 50, fx - 30 * s, fy - 20 * s, fx + fl, fy - 80 * s);
      ctx.bezierCurveTo(fx + 30 * s, fy - 20 * s, fx + 38 * s, fy + 50, fx, fy + 60);
      ctx.fillStyle = fc; ctx.globalAlpha = k === 0 ? 0.55 : k === 1 ? 0.7 : 0.9; ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.fillStyle = col.muted; ctx.fillRect(fx - 20, fy + 60, 40, 6);
    // energy levels (centre-left)
    const lx = w * 0.12, lw = w * 0.32, yHi = 70, yLo = fy + 30;
    ctx.strokeStyle = col.ink; ctx.lineWidth = 2;
    [yHi, yLo].forEach((y) => { ctx.beginPath(); ctx.moveTo(lx, y); ctx.lineTo(lx + lw, y); ctx.stroke(); });
    text(ctx, 'excited', lx, yHi - 8, { color: col.muted, size: 10 }); text(ctx, 'ground', lx, yLo + 12, { color: col.muted, size: 10 });
    const cyc = (t % 3) / 3, ex = lx + lw / 2;
    const ey = cyc < 0.35 ? yLo + (yHi - yLo) * Math.min(1, cyc / 0.35) : cyc < 0.5 ? yHi : yHi + (yLo - yHi) * Math.min(1, (cyc - 0.5) / 0.15);
    ctx.beginPath(); ctx.arc(ex, ey - 6, 6, 0, 7); ctx.fillStyle = col.s[0]; ctx.fill();
    if (cyc < 0.35) text(ctx, 'heat in', ex + 14, (yHi + yLo) / 2, { color: col.s[5], size: 11, weight: 700 });
    if (cyc > 0.65) { // photon wave leaving to the right
      const f = (cyc - 0.65) / 0.35, x0 = ex + 10 + f * (fx - ex - 40), c = nm(main);
      ctx.strokeStyle = fc; ctx.lineWidth = 3; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const x = x0 + k * 1.6, y = (yHi + yLo) / 2 + Math.sin(k * 0.9) * 9; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      text(ctx, 'photon', x0, (yHi + yLo) / 2 - 18, { color: fc, size: 11, weight: 700 });
    }
    // spectrum strip
    const sy = h - 44, sx = 12, sw = w - 24;
    for (let k = 0; k < sw; k++) { ctx.fillStyle = nm(380 + (k / sw) * 370); ctx.globalAlpha = 0.28; ctx.fillRect(sx + k, sy, 1, 22); }
    ctx.globalAlpha = 1;
    lines.forEach((l) => { const x = sx + ((l - 380) / 370) * sw; ctx.fillStyle = col.ink; ctx.fillRect(x - 1, sy - 4, 3, 30); ctx.fillStyle = fc; ctx.fillRect(x, sy - 4, 1, 30); });
    text(ctx, '380 nm', sx, sy + 34, { color: col.muted, size: 10 }); text(ctx, '750 nm', sx + sw, sy + 34, { color: col.muted, size: 10, align: 'right' });
    text(ctx, 'emission lines', sx + sw / 2, sy + 34, { color: col.muted, size: 10, align: 'center' });
  };
  show();
}
