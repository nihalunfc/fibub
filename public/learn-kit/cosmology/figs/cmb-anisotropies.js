// 7.4 Tiny ripples. A random patch of CMB-like sky, built from waves whose strengths follow the measured
// power spectrum (simplified model in acoustic-peaks-model.js), so the typical spot is about 1° across, twice
// the width of the full Moon. Zoom from 2° to 40° across. "True contrast" shows it as your eye would: ripples of
// tens of microkelvin on 2.7255 K are 1 part in 100,000, so the sky looks perfectly even. "Stretched" scales
// ±250 µK to full colour, like the famous maps. Flat-sky approximation (fine for a patch).
import { canvas, text, title, row, slider, choice, readout } from '../../kit.js';
import { makeWaves, paintPatch } from './cmb-anisotropies-field.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 460, min: 300, label: 'A patch of the CMB sky with tiny temperature ripples about one degree across' });
  let fov = 12, flat = false;
  const waves = makeWaves(11, 340);
  const ctl = row(host);
  slider(ctl, { label: 'Width of the patch', min: 2, max: 40, value: fov, log: true, fmt: (x) => `${x.toFixed(x < 10 ? 1 : 0)}°`, oninput: (x) => { fov = x; key = ''; cv.redraw(); } });
  choice(ctl, 'Contrast', [['s', 'Stretched'], ['t', 'True']], 's', (k) => { flat = k === 't'; key = ''; cv.redraw(); });
  const out = readout(host);
  let img = null, key = '';
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, flat ? 'True contrast: an even glow' : 'Stretched contrast: ripples about 1° across', col) + 6;
    const S = Math.min(w - 20, h - top - 30), x0 = (w - S) / 2, y0 = top + 2;
    const k = [fov, flat, col.s[0], col.s[1], col.panel].join();
    if (k !== key) { img = paintPatch(waves, { px: 120, fov, col, flat }); key = k; }
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, x0, y0, S, S);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, S - 1, S - 1);
    // scale: the full Moon (0.52°) and a 1° bar
    const pxDeg = S / fov, my = y0 + S + 16;
    const mr = Math.max(1.5, 0.26 * pxDeg);
    ctx.beginPath(); ctx.arc(x0 + 10 + mr, my, mr, 0, Math.PI * 2); ctx.fillStyle = col.ink; ctx.fill();
    text(ctx, mr > 2 ? 'full Moon' : 'full Moon (dot)', x0 + 16 + 2 * mr, my, { color: col.muted, size: 11 });
    const bar = Math.min(S * 0.4, pxDeg * (fov > 15 ? 10 : 1)), bx = x0 + S - bar - 4;
    ctx.fillStyle = col.ink; ctx.fillRect(bx, my - 2, bar, 4);
    text(ctx, fov > 15 ? '10°' : '1°', bx - 6, my, { color: col.muted, size: 11, align: 'right' });
    out.innerHTML = flat
      ? `True contrast: every spot is 2.7255 K to within about 0.0001 K, so the patch looks perfectly even. That evenness, 1 part in 100,000, puzzled cosmologists for decades (Lesson 11.1).`
      : `Patch ${fov.toFixed(fov < 10 ? 1 : 0)}° wide. Orange spots are warmer, blue cooler, by typically <b>±${Math.round(img.rms)} µK</b> (millionths of a kelvin) here; the colour runs from −250 to +250 µK. Zoom in until the patch is a few degrees wide to see that the commonest spots are about 1° across.`;
  };
  cv.redraw();
}
