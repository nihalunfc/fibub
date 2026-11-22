// The bootstrap, watched: from one sample of 10 values, draw 10 new values WITH replacement (some are picked twice,
// some never), take the mean, and stack it on a histogram. Repeat a few hundred times and the middle 95% of those means
// is a bootstrap confidence interval. Try: press "Draw 1" a few times, then "Draw 500". Data are made up.
import { canvas, text, row, button, readout, title, axes, rng } from '../kit.js';

const S = [12, 15, 9, 22, 18, 14, 31, 11, 16, 13];
export default function (host) {
  const R = rng(31); let means = [], last = null, cnt = Array(10).fill(0);
  const cv = canvas(host, { aspect: 0.95, max: 460, min: 340, label: 'A sample of ten values, one resample, and a histogram of resampled means' });
  const c1 = row(host); button(c1, 'Draw 1', () => { draw1(); show(); }); button(c1, 'Draw 500', () => { for (let i = 0; i < 500; i++) draw1(true); show(); }); button(c1, 'Reset', () => { means = []; last = null; cnt = Array(10).fill(0); show(); });
  const out = readout(host);
  function draw1(quiet) { const pick = Array.from({ length: 10 }, () => Math.floor(R() * 10)); const c = Array(10).fill(0); pick.forEach((i) => c[i]++); cnt = c; last = pick.reduce((s, i) => s + S[i], 0) / 10; means.push(last); }
  const q = (p) => { const s = means.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
  const mu = S.reduce((a, b) => a + b, 0) / 10;
  function show() { out.innerHTML = means.length < 20 ? `Sample mean <b>${mu.toFixed(1)}</b>. ${means.length} resample(s) so far${last !== null ? `; last resample mean ${last.toFixed(1)}, with ${cnt.filter((c) => c === 0).length} original values left out and ${cnt.filter((c) => c > 1).length} picked more than once` : ''}. Keep drawing.` : `<b>${means.length} resamples.</b> Middle 95% of the resampled means: <b>${q(0.025).toFixed(1)} to ${q(0.975).toFixed(1)}</b> (the percentile bootstrap CI for the mean). The spread of the histogram is the standard error.`; cv.redraw(); }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, 'Resampling with replacement', col);
    const bw = (w - 20) / 10;
    S.forEach((v, i) => { ctx.fillStyle = cnt[i] === 0 && last !== null ? col.line : col.s[0]; ctx.fillRect(10 + i * bw + 2, 40, bw - 4, 26); text(ctx, String(v), 10 + i * bw + bw / 2, 53, { color: cnt[i] === 0 && last !== null ? col.muted : '#fff', size: 12, weight: 700, align: 'center', fit: false }); if (cnt[i] > 0) text(ctx, '×' + cnt[i], 10 + i * bw + bw / 2, 78, { color: cnt[i] > 1 ? col.s[1] : col.muted, size: 11, weight: 700, align: 'center', fit: false }); });
    text(ctx, last === null ? 'original sample of 10 (mean ' + mu.toFixed(1) + ')' : `×n = how many times each value was drawn; resample mean ${last.toFixed(1)}`, 10, 96, { color: col.muted, size: 10.5 });
    const lo = 9, hi = 26, bins = 17, hc = Array(bins).fill(0); means.forEach((m) => { const b = Math.min(bins - 1, Math.max(0, Math.floor(((m - lo) / (hi - lo)) * bins))); hc[b]++; });
    const mx = Math.max(5, ...hc), T = 112, B = h - 38, L = 16, W = w - 30, bwd = W / bins;
    hc.forEach((c, i) => { const hh = (c / mx) * (B - T); const x = lo + (i / bins) * (hi - lo); const inCI = means.length >= 20 && x + (hi - lo) / bins > q(0.025) && x < q(0.975); ctx.fillStyle = inCI ? col.s[2] : col.s[0]; ctx.globalAlpha = 0.85; ctx.fillRect(L + i * bwd + 1, B - hh, bwd - 2, hh); }); ctx.globalAlpha = 1;
    ctx.strokeStyle = col.muted; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(L + W, B); ctx.stroke();
    [10, 14, 18, 22, 26].forEach((v) => text(ctx, String(v), L + ((v - lo) / (hi - lo)) * W, B + 10, { color: col.muted, size: 10, align: 'center', fit: false }));
    text(ctx, 'resampled means', L + W / 2, B + 26, { color: col.ink, size: 11, weight: 600, align: 'center' });
    if (last !== null) { const x = L + ((last - lo) / (hi - lo)) * W; ctx.fillStyle = col.s[1]; ctx.fillRect(x - 1.5, T, 3, B - T); }
    if (means.length >= 20) text(ctx, 'green = middle 95%', L + 2, T + 8, { color: col.s[2], size: 10.5, weight: 700 });
  };
  show();
}
