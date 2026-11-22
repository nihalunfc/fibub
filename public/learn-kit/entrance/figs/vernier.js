// Units 1.x: read a vernier caliper. Slide the jaw; the main-scale reading plus the matching vernier line gives
// the length. Least count = 1 main division − 1 vernier division = 1 mm − 0.9 mm = 0.1 mm.
import { canvas, text, line, row, slider, readout, button } from '../../kit.js';

export default function (host) {
  let L = 23.4, zeroErr = 0; // mm
  const cv = canvas(host, { aspect: 0.42, max: 260, min: 190, label: 'A main scale in millimetres with a sliding ten-division vernier scale' });
  const ctl = row(host);
  const s = slider(ctl, { label: 'Object length', min: 5, max: 45, step: 0.1, value: L, fmt: (v) => `${v.toFixed(1)} mm`, oninput: (v) => { L = v; cv.redraw(); show(); } });
  let hide = true;
  const b = button(ctl, 'Show answer', () => { hide = !hide; b.textContent = hide ? 'Show answer' : 'Hide answer'; show(); });
  button(ctl, 'Zero error +0.3 mm', () => { zeroErr = zeroErr ? 0 : 0.3; cv.redraw(); show(); });
  const out = readout(host);
  const show = () => {
    const shown = L + zeroErr, msr = Math.floor(shown + 1e-9), vc = Math.round((shown - msr) * 10) % 10;
    out.innerHTML = hide ? 'Find the main-scale mark just left of the vernier zero, then the vernier line that lines up exactly with a main-scale line.'
      : `Main scale reading ${msr} mm, vernier line ${vc} coincides: ${msr} + ${vc} × 0.1 = <b>${(msr + vc / 10).toFixed(1)} mm</b>${zeroErr ? `. With a +0.3 mm zero error, true length = ${(msr + vc / 10).toFixed(1)} − 0.3 = <b>${L.toFixed(1)} mm</b>` : ''}.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const shown = L + zeroErr;
    const span = 20, start = Math.max(0, Math.floor(shown) - 6); // mm on screen
    const px = (w - 40) / span, X = (mm) => 20 + (mm - start) * px, yM = h * 0.45;
    text(ctx, 'Main scale (mm)', 20, 14, { color: col.muted, size: 11 });
    for (let mm = start; mm <= start + span; mm++) {
      const big = mm % 10 === 0, mid = mm % 5 === 0;
      line(ctx, [[X(mm), yM], [X(mm), yM - (big ? 22 : mid ? 16 : 10)]], col.ink, 1);
      if (big || mid) text(ctx, String(mm), X(mm), yM - 30, { color: col.ink, size: 10, align: 'center' });
    }
    line(ctx, [[X(start), yM], [X(start + span), yM]], col.ink, 1.5);
    // vernier: 10 divisions spanning 9 mm, its zero at `shown`
    ctx.fillStyle = col.soft; ctx.fillRect(X(shown) - 6, yM + 1, 9 * px + 12, 34);
    for (let k = 0; k <= 10; k++) {
      const x = X(shown + k * 0.9), match = Math.abs((shown + k * 0.9) - Math.round(shown + k * 0.9)) < 0.045;
      line(ctx, [[x, yM + 1], [x, yM + (k % 5 === 0 ? 20 : 13)]], match ? col.s[1] : col.ink, match ? 2.5 : 1);
      if (k % 5 === 0) text(ctx, String(k), x, yM + 28, { color: col.ink, size: 10, align: 'center' });
    }
    text(ctx, 'Vernier (10 divisions = 9 mm)', X(shown) - 6, yM + 46, { color: col.muted, size: 11 });
  };
  cv.redraw(); show(); void s;
}
