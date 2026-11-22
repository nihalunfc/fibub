// Class 12 Current Electricity: 12 identical cells (1.5 V, 0.5 ohm each) arranged as m rows of n cells in series. E_eq = nE and r_eq = n r / m. The bars show the
// current in the load R for every possible arrangement; the best one is the one with r_eq closest to R (series chains for large R, parallel rows for small R).
import { canvas, text, title, row, slider, readout } from '../../kit.js';

export default function (host) {
  let R = 2, n = 3;
  const E = 1.5, r = 0.5, N = 12, OPTS = [1, 2, 3, 4, 6, 12];
  const cv = canvas(host, { aspect: 0.8, max: 440, min: 290, label: 'Current from twelve cells arranged in different series and parallel groups' });
  const ctl = row(host), ro = readout(host);
  slider(ctl, { label: 'cells in each series row n', min: 0, max: 5, step: 1, value: 2, fmt: (v) => String(OPTS[v]), oninput: (v) => { n = OPTS[v]; go(); } });
  slider(ctl, { label: 'load R (Ω)', min: 0.1, max: 20, value: R, log: true, fmt: (v) => v.toFixed(2), oninput: (v) => { R = v; go(); } });
  const cur = (nn) => { const m = N / nn; return nn * E / (R + nn * r / m); };
  const go = () => { const m = N / n, I = cur(n); const best = OPTS.reduce((a, b) => (cur(b) > cur(a) ? b : a)); ro.textContent = `${m} row${m > 1 ? 's' : ''} of ${n}: E_eq = nE = ${(n * E).toFixed(1)} V, r_eq = nr/m = ${(n * r / m).toFixed(2)} Ω, current = ${I.toFixed(2)} A.  Best arrangement for this R: ${N / best} × ${best} (${cur(best).toFixed(2)} A).`; cv.redraw(); };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Best current when r_eq ≈ R', col) + 6, m = N / n;
    const gh = Math.min(90, h * 0.3), cw = (w - 40) / n, rh = gh / m;
    for (let j = 0; j < m; j++) for (let i = 0; i < n; i++) { const x = 20 + i * cw + cw / 2, y = top + 8 + j * rh + rh / 2; ctx.strokeStyle = col.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - cw / 2, y); ctx.lineTo(x - 4, y); ctx.moveTo(x + 4, y); ctx.lineTo(x + cw / 2, y); ctx.moveTo(x - 4, y - rh * 0.3); ctx.lineTo(x - 4, y + rh * 0.3); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 4, y - rh * 0.16); ctx.lineTo(x + 4, y + rh * 0.16); ctx.stroke(); }
    const by0 = top + gh + 62, bh = h - by0 - 30, bw = (w - 50) / OPTS.length, imax = Math.max(...OPTS.map(cur));
    text(ctx, 'current in the load for each arrangement (rows × cells per row)', w / 2, by0 - 34, { color: col.muted, size: 10.5, align: 'center' });
    OPTS.forEach((o, k) => { const x = 30 + k * bw, hh = bh * 0.9 * cur(o) / imax; ctx.fillStyle = o === n ? col.s[3] : col.s[0]; ctx.globalAlpha = o === n ? 1 : 0.55; ctx.fillRect(x + 4, by0 + bh - hh, bw - 8, hh); ctx.globalAlpha = 1; text(ctx, `${N / o}×${o}`, x + bw / 2, by0 + bh + 12, { color: col.ink, size: 10.5, align: 'center' }); text(ctx, cur(o).toFixed(2), x + bw / 2, by0 + bh - hh - 7, { color: col.ink, size: 10, align: 'center' }); });
  };
  go();
}
