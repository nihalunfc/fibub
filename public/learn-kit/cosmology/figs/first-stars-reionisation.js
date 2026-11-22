// 10.5 Reionisation as growing bubbles (a toy). Galaxies switch on, the first ones in the densest spots (rare
// peaks), and each blows a bubble of ionised hydrogen that grows with time; bubbles overlap and merge until no
// neutral gas is left. Birth times and the growth law are made up, then the bubble size is tuned when the page
// loads so that half the volume is ionised at z = 7.7 (Planck 2018's midpoint from τ ≈ 0.054). It then ends
// near z ≈ 6, as quasar spectra show (Fan et al. 2006). Times from the Planck-like model in phys.js.
import { canvas, axes, text, title, line, dot, row, slider, readout, loop, rng } from '../../kit.js';
import { ageGyr, PLANCK18 } from '../phys.js';
import { rgbOf } from './cosmic-web-field.js';

const AS = 1.5; // box is 1.5 wide, 1 tall (periodic)
const age = (z) => ageGyr(z, PLANCK18) * 1000;
const zs = []; for (let i = 0; i <= 200; i++) zs.push(4.5 + i * 0.1);
const ages = zs.map(age);
const zOfAge = (t) => { for (let i = 0; i < zs.length - 1; i++) if (t <= ages[i] && t >= ages[i + 1]) return zs[i] + (zs[i + 1] - zs[i]) * (ages[i] - t) / (ages[i] - ages[i + 1]); return t > ages[0] ? zs[0] : zs[zs.length - 1]; };

function model() {
  const r = rng(9), N = 250;
  const cents = Array.from({ length: 14 }, () => [r() * AS, r()]);
  const gauss = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
  const src = [];
  for (let i = 0; i < N; i++) {
    const u = i / N, zb = 6.3 + 13.5 * u ** 4, c = cents[i % cents.length], sp = 0.04 + 0.12 * (1 - u);
    src.push({ x: (c[0] + gauss() * sp + AS * 5) % AS, y: (c[1] + gauss() * sp + 5) % 1, tb: age(zb), zb });
  }
  const Q = (t, R0, nx = 48, ny = 32) => {
    let c = 0;
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      const x = ((i + 0.5) / nx) * AS, y = (j + 0.5) / ny;
      for (const s of src) {
        if (t <= s.tb) continue;
        const R = R0 * (t - s.tb) ** 2;
        let dx = Math.abs(x - s.x); dx = Math.min(dx, AS - dx);
        let dy = Math.abs(y - s.y); dy = Math.min(dy, 1 - dy);
        if (dx * dx + dy * dy < R * R) { c++; break; }
      }
    }
    return c / (nx * ny);
  };
  let lo = 1e-8, hi = 1e-4; const tm = age(7.7);
  for (let k = 0; k < 26; k++) { const m = Math.sqrt(lo * hi); Q(tm, m) < 0.5 ? (lo = m) : (hi = m); }
  const R0 = Math.sqrt(lo * hi);
  const hist = zs.filter((_, i) => i % 4 === 0).map((z) => [z, Q(age(z), R0, 36, 24)]);
  return { src, R0, hist, Q };
}

export default function (host) {
  const cv = canvas(host, { aspect: 1.0, max: 520, min: 380, label: 'Bubbles of ionised gas around the first galaxies grow and merge until all the hydrogen is ionised' });
  const M = model();
  const T0 = age(20), T1 = age(5);
  let T = age(9);
  const ctl = row(host);
  const anim = loop(host, (dt) => { T = Math.min(T1, T + dt * 160); sl.set(T); cv.redraw(); show(); if (T >= T1) anim.pause(); }, { autoplay: false });
  anim.button(ctl);
  const sl = slider(ctl, { label: 'Time since the Big Bang', min: Math.round(T0), max: Math.round(T1), step: 1, value: T, fmt: (v) => Math.round(v) + ' million years', oninput: (v) => { T = v; cv.redraw(); show(); } });
  const out = readout(host);
  let q = 0;
  const show = () => {
    const z = zOfAge(T);
    out.innerHTML = `Redshift <b>z ≈ ${z.toFixed(1)}</b>, ${Math.round(T)} million years after the Big Bang: <b>${Math.round(100 * q)}%</b> of the hydrogen is ionised. ${q > 0.995 ? 'Reionisation is over: the fog has lifted.' : z > 12 ? 'Only the first stars, in the rarest dense spots.' : ''}`;
  };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Bubbles of light eat the fog', col) + 4;
    const bw = w - 20, bh = Math.min(bw / AS, h * 0.6), Y0 = top + 2, S = bh;
    const BW = Math.min(bw, S * AS), X0 = (w - BW) / 2;
    const fog = rgbOf(col.muted), pan = rgbOf(col.panel), s0 = rgbOf(col.s[0]);
    const mix = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
    ctx.save(); ctx.beginPath(); ctx.rect(X0, Y0, BW, bh); ctx.clip();
    ctx.fillStyle = mix(pan, fog, 0.55); ctx.fillRect(X0, Y0, BW, bh);
    ctx.fillStyle = mix(pan, s0, 0.12);
    const born = [];
    for (const s of M.src) {
      if (T <= s.tb) continue;
      born.push(s);
      const R = M.R0 * (T - s.tb) ** 2 * S;
      for (const ox of [-AS, 0, AS]) for (const oy of [-1, 0, 1]) {
        const cx = X0 + (s.x + ox) * S, cy = Y0 + (s.y + oy) * S;
        if (cx + R < X0 || cx - R > X0 + BW || cy + R < Y0 || cy - R > Y0 + bh) continue;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, 2 * Math.PI); ctx.fill();
      }
    }
    born.forEach((s) => dot(ctx, X0 + s.x * S, Y0 + s.y * S, 2.2, col.s[3]));
    ctx.restore();
    ctx.strokeStyle = col.line; ctx.strokeRect(X0 + 0.5, Y0 + 0.5, BW - 1, bh - 1);
    q = M.Q(T, M.R0, 48, 32);
    // history strip
    const A = axes(ctx, w, h, col, { x: [T0, T1], y: [0, 1], t: Y0 + bh + 26, b: 36, yt: [0, 0.5, 1], fy: (v) => Math.round(v * 100) + '%', xt: [20, 12, 9, 7, 6, 5].map(age), fx: (v) => String(Math.round(zOfAge(v))), xlabel: 'Redshift z (time runs to the right)', ylabel: 'Ionised' });
    line(ctx, [[A.X(age(7.7)), A.Y(0)], [A.X(age(7.7)), A.Y(1)]], col.muted, 1, [3, 3]);
    line(ctx, M.hist.map(([z, v]) => [A.X(age(z)), A.Y(v)]), col.s[0], 2.5);
    dot(ctx, A.X(T), A.Y(q), 5, col.s[3], col.panel);
    text(ctx, 'half at z ≈ 7.7', A.X(age(7.7)) - 4, A.Y(0.85), { align: 'right', color: col.muted, size: 10.5, halo: col.panel });
    text(ctx, 'galaxies (dots) · ionised bubbles (clear) · neutral hydrogen fog (grey)', w / 2, Y0 + bh + 11, { color: col.muted, size: 10.5, align: 'center' });
  };
  cv.redraw(); show();
}
