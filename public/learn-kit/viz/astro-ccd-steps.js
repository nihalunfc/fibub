// Calibrating an image, step by step, on a tiny made-up CCD frame (48 × 32 pixels). A raw frame contains the stars, sky glow, a
// constant offset (bias), dark current with hot pixels, and the camera's uneven sensitivity (vignetting and dust shadows). Step 1:
// subtract bias and dark. Step 2: divide by the flat field. The graph shows one row of pixels: the stars stand out once cleaned.
import { canvas, text, row, choice, readout, title, axes, line } from '../kit.js';

const W = 48, H = 32;
const flat = (x, y) => { const r = Math.hypot((x - 23.5) / 30, (y - 15.5) / 20); let f = 1 - 0.45 * r * r; [[12, 9, 3], [34, 22, 2.5]].forEach(([dx, dy, rr]) => { const d = Math.hypot(x - dx, y - dy); if (d < rr) f *= 0.82 + 0.18 * (d / rr); }); return f; };
const HOT = new Set(['5,6', '40,8', '20,27', '29,3', '8,24']);
const dark = (x, y) => 12 + (HOT.has(x + ',' + y) ? 160 : 0) + (x + y) % 3;
const BIAS = 100;
const sig = (x, y) => 40 + 260 * Math.exp(-((x - 30) ** 2 + (y - 12) ** 2) / 4.5) + 120 * Math.exp(-((x - 14) ** 2 + (y - 21) ** 2) / 3.5) + 30 * Math.exp(-((x - 20) ** 2 + (y - 8) ** 2) / 3);
export default function (host) {
  let st = 0;
  const cv = canvas(host, { aspect: 0.95, max: 440, min: 320, label: 'A small raw CCD frame, then the same frame after dark subtraction and flat fielding, with a pixel row plot' });
  const c1 = row(host);
  const ch = choice(c1, 'Frame', [[0, 'Raw'], [1, 'Bias and dark removed'], [2, 'Flat fielded']], st, (v) => { st = v; show(); });
  const out = readout(host);
  const val = (x, y, s) => { const raw = sig(x, y) * flat(x, y) + dark(x, y) + BIAS; if (s === 0) return raw; const d = raw - dark(x, y) - BIAS; return s === 1 ? d : d / flat(x, y); };
  const SET = [
    'Raw frame: the stars sit on a bright offset, a few hot pixels glow, the corners are dark (vignetting) and two dust shadows appear. Raw numbers cannot be compared across the frame.',
    'Bias and dark subtracted: the offset and hot pixels are gone, but the corners are still too dim and the dust rings remain: the same star would read lower there.',
    'Flat fielded (divided by a normalised flat): equal sources now give equal counts anywhere on the chip. The profile now shows the real star shapes on a flat sky level of about 40 counts.',
  ];
  function show() { out.innerHTML = SET[st]; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, ['Raw frame', 'After subtracting bias and dark', 'After dividing by the flat'][st], col);
    const px = Math.min((w - 20) / W, (h * 0.52) / H), x0 = (w - px * W) / 2, y0 = 30, mx = st === 0 ? 480 : 360;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const v = Math.max(0, Math.min(1, (val(x, y, st) - (st === 0 ? 80 : 0)) / (mx - (st === 0 ? 80 : 0)))); const g = Math.round(255 * Math.pow(v, 0.7)); ctx.fillStyle = `rgb(${g},${g},${g})`; ctx.fillRect(x0 + x * px, y0 + y * px, px + 0.5, px + 0.5); }
    ctx.strokeStyle = col.s[1]; ctx.lineWidth = 1.5; ctx.strokeRect(x0, y0 + 12 * px, W * px, px);
    text(ctx, 'row plotted below', x0 + 2, y0 + 12 * px - 6, { color: col.s[1], size: 9.5, weight: 700, halo: '#000' });
    const A = axes(ctx, w, h, col, { x: [0, W], y: [0, 520], t: y0 + H * px + 16, l: 44, b: 30, xlabel: 'pixel along the row', ylabel: 'counts', xt: [0, 12, 24, 36, 48], fx: (v) => v, yt: [0, 200, 400], fy: (v) => v });
    [[0, col.muted], [1, col.s[0]], [2, col.s[2]]].forEach(([s, c]) => { if (s > st) return; const pts = []; for (let x = 0; x < W; x++) pts.push([A.X(x + 0.5), A.Y(val(x, 12, s))]); line(ctx, pts, c, s === st ? 2.4 : 1.2, s === st ? undefined : [4, 3]); });
  };
  show();
  return { step(i) { st = Math.min(2, i); show(); } };
}
