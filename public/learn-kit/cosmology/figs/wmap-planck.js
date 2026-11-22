// 7.6 Sharper and sharper eyes. The same random CMB-like patch, 30° by 18°, as seen by three satellites, each
// blurred by its beam (the smallest detail it can pick out): COBE DMR about 7°, WMAP about 0.22° (13 arcminutes
// at 94 GHz), Planck about 5 arcminutes (0.08°) at its best. Ripples smaller than the beam are averaged away.
import { canvas, text, title, row, choice, readout } from '../../kit.js';
import { makeWaves, paintPatch } from './cmb-anisotropies-field.js';

const SATS = {
  cobe: { name: 'COBE (1989)', beam: 7, info: 'COBE\'s DMR, launched in 1989, saw the sky with a 7° beam: fourteen full Moons wide. It found the ripples in 1992, but only the biggest ones.' },
  wmap: { name: 'WMAP (2001)', beam: 0.22, info: 'WMAP (2001 to 2010) had a beam of about 0.22° (13 arcminutes) at its highest frequency: sharp enough to measure the first and second peaks in detail.' },
  planck: { name: 'Planck (2009)', beam: 5 / 60, info: 'Planck (2009 to 2013) saw details down to about 5 arcminutes (0.08°), in nine frequency bands, and measured seven peaks.' },
};

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 440, min: 230, label: 'The same patch of CMB sky seen by COBE, WMAP and Planck' });
  let sat = 'planck';
  const waves = makeWaves(5, 380, 4, 3000);
  const ctl = row(host);
  choice(ctl, 'Seen by', [['cobe', 'COBE'], ['wmap', 'WMAP'], ['planck', 'Planck']], sat, (k) => { sat = k; show(); cv.redraw(); });
  const out = readout(host);
  const cache = {};
  const show = () => { out.innerHTML = SATS[sat].info; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, `The same patch of sky, seen by ${SATS[sat].name}`, col) + 6;
    const S = Math.min(w - 20, (h - top - 30) / 0.6), H = S * 0.6, x0 = (w - S) / 2, y0 = top + 2;
    const k = [sat, col.s[0], col.s[1], col.panel].join();
    if (!cache[k]) cache[k] = paintPatch(waves, { px: 170, aspect: 0.6, fov: 30, beam: SATS[sat].beam, col, scale: 220 });
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(cache[k], x0, y0, S, H);
    ctx.strokeStyle = col.muted; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, S - 1, H - 1);
    // the beam drawn to scale, and a 5° bar
    const pxDeg = S / 30, br = Math.max(1, (SATS[sat].beam / 2) * pxDeg), by = y0 + H + 16;
    const bx = x0 + 8 + Math.max(br, 3), bcy = y0 + H - 8 - Math.max(br, 3);
    ctx.beginPath(); ctx.arc(bx, bcy, Math.max(br, 1.5), 0, Math.PI * 2);
    ctx.lineWidth = 4; ctx.strokeStyle = col.panel; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = col.ink; ctx.stroke();
    text(ctx, `circle: the beam, ${SATS[sat].beam >= 1 ? SATS[sat].beam + '°' : Math.round(SATS[sat].beam * 60) + ' arcmin'}`, x0, by, { color: col.muted, size: 11 });
    ctx.fillStyle = col.ink; ctx.fillRect(x0 + S - 4 - 5 * pxDeg, by - 2, 5 * pxDeg, 4);
    text(ctx, '5°', x0 + S - 10 - 5 * pxDeg, by, { color: col.muted, size: 11, align: 'right' });
  };
  show(); cv.redraw();
}
