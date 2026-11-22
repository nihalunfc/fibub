// Class 9 Data: collecting data from a sample. 100 students have marks (the population). Pick a random sample and compute its mean;
// repeat. Small samples jump around the true mean; bigger samples stay close to it, so a fair, large sample describes the whole group.
import { canvas, text, title, row, button, choice, readout, rng } from '../../kit.js';

const r0 = rng(5), POP = Array.from({ length: 100 }, () => Math.round(35 + (r0() + r0() + r0()) * 20));
const MU = POP.reduce((a, b) => a + b, 0) / 100;
export default function (host) {
  let n = 5, picked = new Set(), means = [], rnd = rng(99);
  const cv = canvas(host, { aspect: 0.86, max: 440, min: 290, label: 'A hundred students with marks, a random sample picked, and the sample means compared with the true mean' });
  const c = row(host); choice(c, 'Sample size', [[5, '5'], [20, '20'], [50, '50']], n, (v) => { n = v; means = []; picked = new Set(); upd(); });
  const c2 = row(host); button(c2, 'Pick a sample', () => { const idx = [...Array(100).keys()]; for (let i = 99; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } picked = new Set(idx.slice(0, n)); means.push([...picked].reduce((a, i) => a + POP[i], 0) / n); if (means.length > 40) means.shift(); upd(); });
  button(c2, 'Clear', () => { means = []; picked = new Set(); upd(); });
  const out = readout(host);
  cv.draw = (ctx, w, h, col) => {
    const t = title(ctx, 'Sampling 100 students’ marks', col), g = Math.min((w - 28) / 10, (h - t - 100) / 10), ox = (w - g * 10) / 2;
    POP.forEach((v, i) => { const x = ox + (i % 10) * g + g / 2, y = t + 14 + Math.floor(i / 10) * g + g / 2; ctx.save(); ctx.fillStyle = col.s[0]; ctx.globalAlpha = 0.15 + 0.7 * ((v - 35) / 20); ctx.beginPath(); ctx.arc(x, y, g * 0.38, 0, 7); ctx.fill(); ctx.restore(); if (picked.has(i)) { ctx.save(); ctx.strokeStyle = col.s[6]; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, g * 0.42, 0, 7); ctx.stroke(); ctx.restore(); } });
    const B = h - 26, L = 30, R = w - 30, X = (v) => L + ((v - 35) / 30) * (R - L);
    ctx.save(); ctx.strokeStyle = col.ink; ctx.beginPath(); ctx.moveTo(L, B); ctx.lineTo(R, B); ctx.stroke(); ctx.restore();
    [35, 45, 55, 65].forEach((v) => text(ctx, String(v), X(v), B + 11, { color: col.muted, size: 10, align: 'center' }));
    ctx.save(); ctx.strokeStyle = col.s[2]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(MU), B - 36); ctx.lineTo(X(MU), B + 2); ctx.stroke(); ctx.restore();
    text(ctx, 'true mean ' + MU.toFixed(1), X(MU), B - 44, { color: col.s[2], size: 11, weight: 700, align: 'center', halo: col.panel });
    means.forEach((m, i) => { ctx.save(); ctx.fillStyle = col.s[6]; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.arc(X(m), B - 6 - (i % 4) * 5, 3.5, 0, 7); ctx.fill(); ctx.restore(); });
  };
  function upd() { const last = means[means.length - 1]; out.innerHTML = means.length ? `Sample of ${n}: mean <b>${last.toFixed(1)}</b> (true mean ${MU.toFixed(1)}, off by ${Math.abs(last - MU).toFixed(1)}). Red dots below show ${means.length} sample means so far: ` + (n >= 50 ? 'they cluster tightly around the truth.' : n >= 20 ? 'closer than small samples.' : 'small samples scatter a lot.') : `Press <b>Pick a sample</b>: ${n} students are chosen at random (ringed in red) and their mean is compared with the true mean of all 100.`; cv.redraw(); }
  upd();
}
