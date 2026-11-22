// 9.1 The 1998 supernova result as a "residual" Hubble diagram: distance modulus minus the value for an empty,
// coasting universe (Ωm = ΩΛ = 0), against redshift. A slowing universe (Einstein-de Sitter, or low-density with
// no Λ) sits below zero: distant supernovae would look brighter. ΛCDM sits above: they look fainter. The dots are
// made-up supernovae scattered (0.15 mag) around ΛCDM, like a real sample; the reader's model is the thick curve.
// H0 cancels in the residual. Luminosity distances: d_L = (1 + z) S_k(∫dz/E), integrated here along a z grid.
import { canvas, axes, text, title, line, dot, row, slider, readout, rng } from '../../kit.js';

const ZMAX = 1.5, DZ = 0.005;
/** Distance modulus (up to a constant) on a z grid for a model, or null where the model has no Big Bang. */
function muGrid(Om, OL) {
  const Ok = 1 - Om - OL, out = [];
  let dc = 0, prev = 1;
  for (let i = 0; i <= ZMAX / DZ; i++) {
    const z = i * DZ, x = 1 + z, e2 = Om * x ** 3 + Ok * x * x + OL;
    if (e2 <= 0) { out.push(null); prev = NaN; continue; }
    const inv = 1 / Math.sqrt(e2);
    if (i > 0) dc += 0.5 * (prev + inv) * DZ;
    prev = inv;
    if (!Number.isFinite(dc)) { out.push(null); continue; }
    const k = Math.sqrt(Math.abs(Ok));
    const dm = Math.abs(Ok) < 1e-6 ? dc : Ok > 0 ? Math.sinh(k * dc) / k : Math.sin(k * dc) / k;
    out.push(i === 0 ? null : 5 * Math.log10(x * dm));
  }
  return out;
}

export default function (host) {
  const cv = canvas(host, { aspect: 0.7, max: 420, min: 320, label: 'Supernova brightness compared with an empty universe, against redshift, for slowing and accelerating models' });
  let Om = 0.31, OL = 0.69;
  const ctl = row(host);
  slider(ctl, { label: 'Matter Ωm', min: 0, max: 1.5, step: 0.01, value: Om, fmt: (v) => v.toFixed(2), oninput: (v) => { Om = v; upd(); } });
  slider(ctl, { label: 'Dark energy ΩΛ', min: 0, max: 1.2, step: 0.01, value: OL, fmt: (v) => v.toFixed(2), oninput: (v) => { OL = v; upd(); } });
  const key = readout(host), out = readout(host);
  const sw = (i, dash) => `<span style="display:inline-block;width:22px;border-top:${i === 0 ? 4 : 2}px ${dash || 'solid'} var(--s${i + 1});vertical-align:middle;margin-right:5px"></span>`;
  key.innerHTML = `${sw(0)}your model &nbsp; ${sw(1)}ΛCDM (0.31, 0.69) &nbsp; ${sw(2, 'dotted')}Ωm 0.3, no Λ &nbsp; ${sw(3, 'dashed')}matter only &nbsp; <span style="white-space:nowrap">● made-up supernovae</span>`;
  key.style.fontSize = '13.5px';
  const empty = muGrid(0, 0), eds = muGrid(1, 0), open = muGrid(0.3, 0), lcdm = muGrid(0.31, 0.69);
  const res = (g) => g.map((m, i) => (m == null || empty[i] == null ? null : m - empty[i]));
  const R = { eds: res(eds), open: res(open), lcdm: res(lcdm) };
  const at = (g, z) => g[Math.round(z / DZ)];
  // made-up supernovae: more nearby, fewer far away, scatter 0.15 mag around ΛCDM
  const r = rng(1998), gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += r(); return (s - 3) * 1.41; };
  const sne = Array.from({ length: 46 }, (_, i) => { const z = i < 16 ? 0.015 + r() * 0.09 : 0.15 + r() * 1.15; return { z, d: at(R.lcdm, z) + 0.15 * gauss() }; });
  let mine = [];
  const upd = () => { mine = res(muGrid(Om, OL)); show(); cv.redraw(); };
  const show = () => {
    if (mine.some((v, i) => i > 0 && v == null)) { out.innerHTML = 'This mix has <b>no Big Bang</b>: going back in time, it bounces before reaching redshift 1.5. Our universe is ruled out from doing that.'; return; }
    // best constant offset (the unknown supernova brightness) then χ² per point
    const off = sne.reduce((s, p) => s + p.d - at(mine, p.z), 0) / sne.length;
    const chi = sne.reduce((s, p) => s + ((p.d - at(mine, p.z) - off) / 0.15) ** 2, 0) / sne.length;
    const d5 = at(mine, 0.5) - at(R.eds, 0.5);
    const q = Om / 2 - OL;
    out.innerHTML = `At z = 0.5 your model makes supernovae <b>${Math.abs(d5).toFixed(2)} mag ${d5 >= 0 ? 'fainter' : 'brighter'}</b> than the matter-only universe. q₀ = ${q.toFixed(2)} (${q < 0 ? 'speeding up' : 'slowing down'}). Fit to the dots: ${chi < 1.3 ? '<b>good</b>' : chi < 2 ? '<b>poor</b>' : '<b>bad</b>'} (χ² per point ${chi.toFixed(1)}; about 1 is a good fit).`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Fainter than expected: the 1998 supernovae', col);
    const A = axes(ctx, w, h, col, { x: [0, ZMAX], y: [-0.75, 0.45], t: top + 8, l: 52, xt: [0, 0.5, 1, 1.5], yt: [-0.5, -0.25, 0, 0.25], xlabel: 'Redshift z', ylabel: 'Fainter ↑   vs empty (mag)', fy: (v) => (v > 0 ? '+' : '') + (+v.toFixed(2)) });
    ctx.save(); A.clip();
    const path = (g) => g.map((v, i) => (v == null ? null : [A.X(i * DZ), A.Y(v)])).filter(Boolean);
    line(ctx, [[A.X(0), A.Y(0)], [A.X(ZMAX), A.Y(0)]], col.muted, 1.5, [2, 3]);
    for (const p of sne) {
      ctx.strokeStyle = col.muted; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(A.X(p.z), A.Y(p.d - 0.15)); ctx.lineTo(A.X(p.z), A.Y(p.d + 0.15)); ctx.stroke();
      dot(ctx, A.X(p.z), A.Y(p.d), 3, col.ink);
    }
    line(ctx, path(R.eds), col.s[3], 2, [7, 4]);
    line(ctx, path(R.open), col.s[2], 2, [3, 3]);
    line(ctx, path(R.lcdm), col.s[1], 2);
    line(ctx, path(mine), col.s[0], 3.5);
    ctx.restore();
    text(ctx, 'fainter: speeding up', A.L + 6, A.Y(0.36), { color: col.muted, size: 11, halo: col.panel });
    text(ctx, 'brighter: slowing down', A.L + 6, A.Y(-0.62), { color: col.muted, size: 11, halo: col.panel });
  };
  upd();
}
