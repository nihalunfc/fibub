// An A/B test you can run: set the true conversion rates of A and B and the visitors per arm, then run one experiment
// (counts, z test, verdict) or 300 of them. With equal rates about 5% come out "significant" by chance; with a real
// lift the share that comes out significant is the power. Try: equal rates, then A 10% vs B 12% at 500 per arm.
import { canvas, text, row, slider, button, readout, title, rng, axes } from '../kit.js';
import { nCdf } from './_data.js';

export default function (host) {
  const R = rng(77); let pa = 0.10, pb = 0.10, n = 1000, one = null, many = null;
  const cv = canvas(host, { aspect: 0.9, max: 460, min: 330, label: 'Results of one A/B test and of many repeated tests' });
  const c1 = row(host);
  slider(c1, { label: 'true rate A', min: 0.02, max: 0.3, step: 0.005, value: pa, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: (v) => { pa = v; many = null; draw(); } });
  slider(c1, { label: 'true rate B', min: 0.02, max: 0.3, step: 0.005, value: pb, fmt: (v) => (v * 100).toFixed(1) + '%', oninput: (v) => { pb = v; many = null; draw(); } });
  slider(c1, { label: 'visitors per arm', min: 100, max: 5000, step: 50, value: n, fmt: (v) => String(Math.round(v)), oninput: (v) => { n = Math.round(v); many = null; draw(); } });
  const c2 = row(host); button(c2, 'Run one test', () => { one = run(); draw(); }); button(c2, 'Run 300 tests', () => { many = Array.from({ length: 300 }, run); draw(); });
  const out = readout(host);
  const binom = (m, p) => { // normal approximation is fine at these sizes, exact for small m
    if (m < 40) { let c = 0; for (let i = 0; i < m; i++) if (R() < p) c++; return c; }
    const g = Math.sqrt(-2 * Math.log(R() || 1e-9)) * Math.cos(2 * Math.PI * R()); return Math.max(0, Math.min(m, Math.round(m * p + g * Math.sqrt(m * p * (1 - p)))));
  };
  function run() { const a = binom(n, pa), b = binom(n, pb), p1 = a / n, p2 = b / n, pp = (a + b) / (2 * n), se = Math.sqrt(pp * (1 - pp) * 2 / n) || 1e-9, z = (p2 - p1) / se, p = 2 * (1 - nCdf(Math.abs(z))); return { a, b, z, p, sig: p < 0.05 }; }
  function draw() {
    if (many) { const s = many.filter((r) => r.sig).length, good = many.filter((r) => r.sig && r.b > r.a).length; out.innerHTML = `<b>${s} of 300 tests were significant (${((s / 3)).toFixed(0)}%).</b> ${pa === pb ? 'The rates are really equal, so these are false alarms: about 5% is expected (alpha = 0.05).' : `B really is ${pb > pa ? 'better' : 'worse'}; the share that caught it is the power of this design (${good} found B higher).`}`; }
    else if (one) out.innerHTML = `A: <b>${one.a}</b> of ${n} (${((one.a / n) * 100).toFixed(1)}%), B: <b>${one.b}</b> (${((one.b / n) * 100).toFixed(1)}%). z = ${one.z.toFixed(2)}, p = ${one.p.toFixed(3)}: ${one.sig ? 'significant at 0.05' : 'not significant'}${pa === pb && one.sig ? ' (a false alarm, the rates are equal)' : ''}.`;
    else out.innerHTML = 'Set the true rates, then run a test. In real life you never know the true rates; here you do, which is why a simulator teaches so well.';
    cv.redraw();
  }
  cv.draw = (ctx, w, h, col) => {
    title(ctx, many ? 'Each dot = one experiment (z score)' : 'Conversions in one experiment', col);
    if (many) {
      const ax = axes(ctx, w, h, col, { x: [-5, 5], y: [0, 1], yt: [], xlabel: 'z: negative = B worse, positive = B better', l: 14, t: 28, fx: (v) => String(v) });
      ctx.save(); ctx.globalAlpha = 0.15; ctx.fillStyle = col.bad; ctx.fillRect(ax.X(1.96), ax.T, ax.R - ax.X(1.96), ax.B - ax.T); ctx.fillRect(ax.L, ax.T, ax.X(-1.96) - ax.L, ax.B - ax.T); ctx.restore();
      const bins = {}; many.forEach((r, i) => { const x = Math.max(-5, Math.min(5, r.z)), k = Math.round(x * 4); const y = (bins[k] = (bins[k] || 0) + 1); ctx.fillStyle = r.sig ? col.bad : col.s[0]; ctx.beginPath(); ctx.arc(ax.X(k / 4), ax.B - 6 - (y - 1) * 7, 3, 0, 7); ctx.fill(); });
      text(ctx, 'red zone: p < 0.05', ax.R - 4, ax.T + 10, { color: col.bad, size: 10.5, align: 'right' });
    } else {
      const arm = (i, v, nm, c) => { const bw = (w - 60) / 2, x = 20 + i * (bw + 20), T = 50, H = h - 100; ctx.fillStyle = col.line; ctx.fillRect(x, T, bw, H); const mxr = Math.max(pa, pb, 0.05) * 1.6; const hh = Math.min(H, (v / n / mxr) * H); ctx.fillStyle = c; ctx.fillRect(x, T + H - hh, bw, hh); text(ctx, nm, x + bw / 2, T + H + 14, { color: col.ink, size: 12, weight: 700, align: 'center' }); text(ctx, one ? `${v} of ${n}` : `true ${(i ? pb : pa) * 100}%`, x + bw / 2, T + H - hh - 8, { color: col.ink, size: 12, weight: 700, align: 'center' }); };
      arm(0, one ? one.a : pa * n, 'A', col.s[0]); arm(1, one ? one.b : pb * n, 'B', col.s[1]);
      if (one) text(ctx, one.sig ? 'SIGNIFICANT' : 'not significant', w / 2, h - 12, { color: one.sig ? col.bad : col.muted, size: 12, weight: 700, align: 'center' });
    }
  };
  draw();
}
