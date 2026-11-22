// 7.8 Read the recipe: a game. A "mystery universe" has secret amounts of atoms (Ω_b h²), dark matter (Ω_c h²)
// and expansion rate H0 (flat space). Its power spectrum is shown as measured points with error bars; move the
// sliders until your curve runs through them. Match score: 100 × exp(−√(χ²/N − 1) / 3), so 100 = as good as
// the error bars allow.
// The first mystery is the real one: Planck 2018. Spectra come from the simplified model (acoustic-peaks-model.js).
import { canvas, axes, line, dot, text, title, row, slider, button, readout, rng } from '../../kit.js';
import { curve, geometry, Dl, BASE } from './acoustic-peaks-model.js';
import { flatAgeGyr } from '../phys.js';

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 420, min: 310, label: 'Match the power spectrum of a mystery universe by changing its recipe' });
  const r = rng(42);
  const you = { wb: 0.030, wc: 0.090, h: 0.75 };
  let secret = { ...BASE }, pts = [], reveal = false, n = 0;
  const lbins = Array.from({ length: 40 }, (_, i) => 60 + i * 45);
  const make = () => {
    const g = geometry(secret);
    pts = lbins.map((l) => { const d = Dl(l, secret, g), e = 0.015 * d + 15; return [l, d + e * (r() + r() + r() - 1.5) * 0.9, e]; });
  };
  const ctl = row(host);
  const sb = slider(ctl, { label: 'Atoms Ω_b h²', min: 0.010, max: 0.040, step: 0.0005, value: you.wb, fmt: (v) => v.toFixed(4), oninput: (v) => { you.wb = v; upd(); } });
  const sc = slider(ctl, { label: 'Dark matter Ω_c h²', min: 0.06, max: 0.20, step: 0.002, value: you.wc, fmt: (v) => v.toFixed(3), oninput: (v) => { you.wc = v; upd(); } });
  const sh = slider(ctl, { label: 'Hubble constant H₀', min: 55, max: 85, step: 0.5, value: you.h * 100, fmt: (v) => `${v.toFixed(1)} km/s/Mpc`, oninput: (v) => { you.h = v / 100; upd(); } });
  button(ctl, 'Show the answer', () => { reveal = true; show(); cv.redraw(); });
  button(ctl, 'New mystery universe', () => {
    n++; reveal = false;
    secret = { ...BASE, wb: +(0.016 + r() * 0.016).toFixed(4), wc: +(0.08 + r() * 0.09).toFixed(3), h: +(0.6 + r() * 0.18).toFixed(3) };
    make(); upd();
  });
  const out = readout(host);
  let cur = [];
  const score = () => {
    const g = geometry(you);
    const chi = pts.reduce((s, [l, d, e]) => s + ((Dl(l, you, g) - d) / e) ** 2, 0) / pts.length;
    return Math.round(100 * Math.exp(-Math.sqrt(Math.max(0, chi - 1)) / 3));
  };
  const upd = () => { cur = curve(you, 2000, 4); show(); cv.redraw(); };
  const show = () => {
    const s = score(), Om = (you.wb + you.wc) / you.h ** 2;
    const yours = `Your universe: atoms ${(100 * you.wb / you.h ** 2).toFixed(1)}%, dark matter ${(100 * you.wc / you.h ** 2).toFixed(1)}%, dark energy ${(100 * (1 - Om)).toFixed(1)}% of the critical density; age ${flatAgeGyr(you.h * 100, Om).toFixed(2)} billion years.`;
    const ans = reveal ? `<br><b>Answer${n === 0 ? ' (Planck 2018)' : ''}:</b> Ω_b h² = ${secret.wb}, Ω_c h² = ${secret.wc}, H₀ = ${(secret.h * 100).toFixed(1)}.` : '';
    out.innerHTML = `Match: <b>${s} / 100</b>${s >= 90 ? ' — well read!' : ''}. ${yours}${ans} <i>Simplified teaching model.</i>`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 2000], y: [0, 7500], t: 46, l: 52, xlabel: 'Multipole ℓ  (≈ 180° ÷ spot size)', ylabel: 'Ripple power D_ℓ (µK²)', fy: (v) => (v ? (v / 1000) + 'k' : '0') });
    ctx.save(); A.clip();
    if (reveal) line(ctx, curve(secret, 2000, 4).map(([l, d]) => [A.X(l), A.Y(d)]), col.s[2], 1.5, [5, 4]);
    pts.forEach(([l, d, e]) => { line(ctx, [[A.X(l), A.Y(d - e)], [A.X(l), A.Y(d + e)]], col.ink, 1.2); dot(ctx, A.X(l), A.Y(d), 2.6, col.ink); });
    line(ctx, cur.map(([l, d]) => [A.X(l), A.Y(d)]), col.s[0], 2.5);
    ctx.restore();
    text(ctx, 'dots: the mystery sky', A.R - 4, A.T + 24, { color: col.ink, size: 11, align: 'right', halo: col.panel });
    text(ctx, 'line: your recipe', A.R - 4, A.T + 40, { color: col.s[0], size: 11, weight: 700, align: 'right', halo: col.panel });
    title(ctx, n === 0 ? 'Mystery 1: our own universe' : `Mystery universe ${n + 1}`, col);
  };
  make(); upd();
}
