// 10.7 Finding the ruler by counting pairs (a toy, in a flat 2-D patch 1,500 Mpc across, wrapped at the edges).
// Each galaxy belongs to an old lump: most sit in the lump's middle, some on its 147 Mpc shell, and some are
// spread at random. Nobody can see which galaxy belongs to which lump. But count every pair of galaxies by their
// separation and compare with a random sky: ξ(r) = DD(r) / RR(r) − 1, the two-point correlation function. Pairs
// 147 Mpc apart come out more common: the bump. With few galaxies it is lost in the noise; with many it stands
// out. The bump here is exaggerated many times over: in real surveys ξ near 147 Mpc is only a few parts in 1,000,
// which is why Eisenstein et al. (2005) needed 46,748 galaxies, and DESI uses millions.
import { canvas, axes, text, title, line, dot, row, choice, readout, rng, fmt } from '../../kit.js';

const L = 1500, RMIN = 40, RMAX = 256, DR = 8;

function sky(N, seed) {
  const r = rng(seed), Nc = Math.max(8, Math.round(N / 25)), cs = [];
  const g = () => Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r());
  for (let i = 0; i < Nc; i++) cs.push([r() * L, r() * L]);
  const xs = new Float64Array(N), ys = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const u = r();
    if (u < 0.35) { xs[i] = r() * L; ys[i] = r() * L; continue; }
    const c = cs[Math.floor(r() * Nc)];
    let x, y;
    if (u < 0.6) { const a = r() * 2 * Math.PI, rr = 147 + 5 * g(); x = c[0] + rr * Math.cos(a); y = c[1] + rr * Math.sin(a); }
    else { x = c[0] + 12 * g(); y = c[1] + 12 * g(); }
    xs[i] = ((x % L) + L) % L; ys[i] = ((y % L) + L) % L;
  }
  return { xs, ys };
}

function pairs({ xs, ys }) {
  const N = xs.length, nb = Math.floor(L / RMAX), cell = L / nb, bins = new Float64Array(Math.ceil((RMAX - RMIN) / DR));
  const grid = Array.from({ length: nb * nb }, () => []);
  for (let i = 0; i < N; i++) grid[Math.min(nb - 1, Math.floor(ys[i] / cell)) * nb + Math.min(nb - 1, Math.floor(xs[i] / cell))].push(i);
  for (let cy = 0; cy < nb; cy++) for (let cx = 0; cx < nb; cx++) {
    const A = grid[cy * nb + cx];
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) {
      const B = grid[((cy + oy + nb) % nb) * nb + ((cx + ox + nb) % nb)];
      for (const i of A) for (const j of B) {
        if (j <= i) continue;
        let dx = Math.abs(xs[i] - xs[j]); if (dx > L / 2) dx = L - dx;
        let dy = Math.abs(ys[i] - ys[j]); if (dy > L / 2) dy = L - dy;
        const d = Math.hypot(dx, dy);
        if (d >= RMIN && d < RMAX) bins[Math.floor((d - RMIN) / DR)]++;
      }
    }
  }
  // a pair can be found twice when nb < 3 wraps a cell onto itself; nb = 6 here, so each pair is counted once
  return Array.from(bins, (dd, k) => {
    const r0 = RMIN + k * DR, rr = (N * (N - 1) / 2) * Math.PI * ((r0 + DR) ** 2 - r0 ** 2) / (L * L);
    return [r0 + DR / 2, dd / rr - 1];
  });
}

export default function (host) {
  const cv = canvas(host, { aspect: 1.05, max: 540, min: 420, label: 'A map of toy galaxies and the count of galaxy pairs by separation, with a bump at 147 megaparsecs' });
  let N = 3000, seed = 4, S = sky(N, seed), xi = pairs(S);
  const ctl = row(host);
  choice(ctl, 'Galaxies', [[600, '600'], [3000, '3,000'], [15000, '15,000']], N, (v) => { N = v; S = sky(N, seed); xi = pairs(S); cv.redraw(); show(); });
  const b = document.createElement('button'); b.type = 'button'; b.className = 'lk-btn'; b.textContent = 'New sky';
  b.onclick = () => { seed++; S = sky(N, seed); xi = pairs(S); cv.redraw(); show(); };
  ctl.appendChild(b);
  const out = readout(host);
  const show = () => { out.innerHTML = `${fmt(N)} galaxies make <b>${fmt(N * (N - 1) / 2)}</b> pairs. ${N < 1000 ? 'Too few: the bump hides in the noise. Try “New sky” a few times.' : N < 10000 ? 'The bump near 147 Mpc shows, a little ragged.' : 'Plenty: the bump at 147 Mpc stands out clearly.'}`; };
  cv.draw = (ctx, w, h, col) => {
    const top = title(ctx, 'Count the pairs: a bump at 147 Mpc', col) + 4;
    const ms = Math.min(w - 20, h * 0.42), X0 = (w - ms) / 2, Y0 = top + 2, sc = ms / L;
    ctx.fillStyle = col.soft; ctx.fillRect(X0, Y0, ms, ms);
    const n = Math.min(S.xs.length, 6000), rad = N > 5000 ? 0.9 : 1.4;
    ctx.fillStyle = col.ink;
    for (let i = 0; i < n; i++) ctx.fillRect(X0 + S.xs[i] * sc - rad / 2, Y0 + S.ys[i] * sc - rad / 2, rad, rad);
    // a 147 Mpc scale bar
    line(ctx, [[X0 + 8, Y0 + ms - 8], [X0 + 8 + 147 * sc, Y0 + ms - 8]], col.s[3], 3);
    text(ctx, '147 Mpc', X0 + 8, Y0 + ms - 18, { color: col.s[3], size: 11, weight: 700, halo: col.soft });
    const ymax = Math.max(0.3, ...xi.map((p) => p[1]).filter((v) => v < 5)) * 1.15;
    const A = axes(ctx, w, h, col, { x: [RMIN, RMAX], y: [-ymax * 0.35, ymax], t: Y0 + ms + 16, xlabel: 'Separation of the pair (Mpc)', ylabel: 'Extra pairs, ξ', fy: (v) => fmt(v, 2) });
    line(ctx, [[A.L, A.Y(0)], [A.R, A.Y(0)]], col.muted, 1);
    line(ctx, [[A.X(147), A.T], [A.X(147), A.B]], col.s[3], 1, [3, 3]);
    ctx.save(); A.clip();
    line(ctx, xi.map(([r, v]) => [A.X(r), A.Y(v)]), col.s[0], 2.5);
    xi.forEach(([r, v]) => dot(ctx, A.X(r), A.Y(v), 2.5, col.s[0]));
    ctx.restore();
    text(ctx, 'random sky', A.R - 4, A.Y(0) + 10, { color: col.muted, size: 10.5, align: 'right', halo: col.panel });
  };
  cv.redraw(); show();
}
