// 8.6 A toy xenon detector. Choose a WIMP mass, how strongly it bumps into atomic nuclei (cross-section) and how
// long you run, then watch the flashes. Signal and background flashes look the same, as in a real detector: all you
// can do is count and compare with the background you expect. The sensitivity is a simplified shape of the LZ 2024
// limit (about 2.2 × 10⁻⁴⁸ cm² near 40 GeV for 4.2 tonne-years; weaker for light WIMPs, which make recoils too
// small to see, and for heavy ones, which are fewer). Toy numbers: a WIMP at that limit gives 3 events in 4.2
// tonne-years on top of 1.5 expected background events. The p-value is the Poisson chance of background alone
// giving at least as many events.
import { canvas, text, title, dot, row, slider, button, readout, rng, calm } from '../../kit.js';

const LIM = 2.2e-48, MREF = 40, EXREF = 4.2, SREF = 3, BREF = 1.5;
const sens = (m) => LIM * (0.5 * m / MREF + 0.5 * (MREF / m) ** 2.5); // cross-section giving SREF events in EXREF
const expected = (m, sig, ex) => ({ s: SREF * (sig / sens(m)) * (ex / EXREF), b: BREF * (ex / EXREF) });
const poisson = (lam, r) => { // Knuth for small λ, normal approximation for large
  if (lam > 60) return Math.max(0, Math.round(lam + Math.sqrt(lam) * Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r())));
  let k = 0, p = 1; const e = Math.exp(-lam);
  do { k++; p *= r(); } while (p > e);
  return k - 1;
};
const pAtLeast = (k, b) => { let s = 0, t = Math.exp(-b); for (let i = 0; i < k; i++) { s += t; t *= b / (i + 1); } return Math.max(0, 1 - s); };

export default function (host) {
  const cv = canvas(host, { aspect: 0.62, max: 360, min: 260, label: 'A xenon detector tank with flashes from particle recoils, and a counter' });
  let m = 40, sig = 1e-47, ex = 4.2, evs = [], shown = 0, raf = 0, seed = 1, done = false;
  const ctl = row(host);
  slider(ctl, { label: 'WIMP mass', min: 8, max: 1000, log: true, value: m, fmt: (v) => `${v < 100 ? v.toFixed(0) : Math.round(v / 10) * 10} GeV`, oninput: (v) => { m = v; clear(); } });
  slider(ctl, { label: 'Cross-section', min: 1e-49, max: 1e-45, log: true, value: sig, fmt: (v) => { const e = Math.floor(Math.log10(v)); return `${(v / 10 ** e).toFixed(1)}×10${String(e).replace(/[-0-9]/g, (d) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'['-0123456789'.indexOf(d)])} cm²`; }, oninput: (v) => { sig = v; clear(); } });
  slider(ctl, { label: 'Exposure', min: 0.5, max: 20, step: 0.1, value: ex, fmt: (v) => `${v.toFixed(1)} tonne-years`, oninput: (v) => { ex = v; clear(); } });
  button(ctl, '▶ Run the experiment', () => run());
  const out = readout(host);
  const clear = () => { cancelAnimationFrame(raf); evs = []; shown = 0; done = false; cv.redraw(); show(); };
  const run = () => {
    cancelAnimationFrame(raf);
    const r = rng(seed++ * 7919), { s, b } = expected(m, sig, ex);
    const ns = poisson(s, r), nb = poisson(b, r), shownMax = 400;
    evs = [];
    for (let i = 0; i < Math.min(shownMax, ns + nb); i++) evs.push({ x: r(), y: r(), t: r(), sig: i < ns });
    evs.sort((a, c) => a.t - c.t); evs.total = ns + nb; evs.ns = ns;
    done = false; shown = 0;
    const t0 = performance.now(), dur = calm() ? 0 : 5000;
    const tick = (now) => {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1;
      shown = k; if (k >= 1) done = true; cv.redraw(); show();
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  const show = () => {
    const { s, b } = expected(m, sig, ex);
    let html = `Expected: <b>${s < 10 ? s.toFixed(1) : Math.round(s)}</b> dark matter events and <b>${b.toFixed(1)}</b> background events. `;
    if (!evs.total && !done) html += 'Press Run to count flashes.';
    else if (!done) html += 'Counting…';
    else {
      const k = evs.total, p = pAtLeast(k, b);
      const verdict = p < 2.9e-7 ? 'That is beyond 5 sigma: a discovery claim (in a real experiment, after many cross-checks).'
        : p < 0.01 ? 'Interesting, but not yet a discovery (that needs about 1 in 3.5 million).'
        : 'Nothing unusual: this run would set a limit, not claim a discovery.';
      html += `You saw <b>${k}</b> events. Chance that background alone gives ${k} or more: <b>${p < 1e-4 ? p.toExponential(1) : p.toFixed(3)}</b>. ${verdict}`;
    }
    out.innerHTML = html;
  };
  cv.draw = (ctx, w, h, col) => {
    const tw = Math.min(w * 0.62, h * 1.0), th = h * 0.62, tx = 12, ty = h * 0.25;
    // the tank: liquid xenon in a cylinder seen side on
    ctx.save(); ctx.fillStyle = col.soft; ctx.strokeStyle = col.muted; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(tx, ty, tw, th, 14) : ctx.rect(tx, ty, tw, th); ctx.fill(); ctx.stroke(); ctx.restore();
    // light sensors top and bottom
    for (let i = 0; i < 9; i++) { const x = tx + 10 + (i + 0.5) * ((tw - 20) / 9); dot(ctx, x, ty + 6, 3.5, col.muted); dot(ctx, x, ty + th - 6, 3.5, col.muted); }
    text(ctx, 'liquid xenon', tx + tw / 2, ty + th / 2, { color: col.muted, size: 11, align: 'center' });
    const vis = evs.filter((e) => e.t <= shown);
    for (const e of vis) {
      const x = tx + 14 + e.x * (tw - 28), y = ty + 16 + e.y * (th - 32), fresh = shown - e.t < 0.06;
      dot(ctx, x, y, fresh ? 7 : 3.5, fresh ? col.s[3] : col.s[0]);
    }
    const cx = tx + tw + 14, count = done ? evs.total : Math.round((vis.length / Math.max(1, evs.length)) * (evs.total || 0));
    text(ctx, 'events', cx, ty + 10, { color: col.muted, size: 11, weight: 600 });
    text(ctx, String(evs.total ? count : 0), cx, ty + 42, { color: col.ink, size: 30, weight: 700 });
    const { b } = expected(m, sig, ex);
    text(ctx, 'background', cx, ty + 78, { color: col.muted, size: 11, weight: 600 });
    text(ctx, `≈ ${b.toFixed(1)}`, cx, ty + 100, { color: col.ink, size: 18, weight: 700 });
    text(ctx, 'All flashes look alike: you can only count.', 12, h - 10, { color: col.muted, size: 10.5 });
    title(ctx, 'A dark matter detector, deep underground', col);
  };
  cv.redraw(); show();
}
