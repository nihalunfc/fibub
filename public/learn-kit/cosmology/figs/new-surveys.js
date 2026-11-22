// 12.5 Sky surveys compared. View 1: area of sky against depth (faintest galaxies reached). APPROXIMATE headline
// numbers from each project's published descriptions; depths are rough AB magnitudes (about 5σ for point
// sources) and are defined differently by different teams, so treat positions as a sketch, good to half a
// magnitude or so. Roman is the planned High Latitude Wide Area Survey (size still being finalised).
// View 2: when each survey runs (years approximate; Rubin, Roman and SKA dates are plans as of late 2025).
import { canvas, axes, text, title, line, dot, row, choice, readout } from '../../kit.js';

const S = [
  // name, area deg², depth mag, kind (0 done, 1 running or new, 2 planned), label place: r right, l left, b below, a above-left, d below-right
  ['SDSS', 14555, 22.5, 0, 'r'], ['DES', 5000, 24.3, 0, 'l'], ['KiDS', 1350, 25.0, 0, 'l'], ['HSC Wide', 1100, 26.2, 0, 'b'],
  ['Hubble UDF', 0.0031, 29.7, 0, 'l'], ['JWST JADES', 0.05, 29.8, 1, 'l'],
  ['Euclid Wide', 14000, 26.0, 1, 'a'], ['Euclid Deep', 53, 28.0, 1, 'l'],
  ['Rubin LSST, 10 yr', 18000, 27.5, 1, 'd'], ['Roman wide (plan)', 2000, 26.7, 2, 'r'],
];
const T = [
  ['SDSS', 2000, 2008.5, 0], ['BOSS, eBOSS', 2009, 2019, 0], ['KiDS', 2011, 2019, 0], ['DES', 2013, 2019, 0], ['HSC-SSP', 2014, 2021, 0],
  ['DESI', 2021.4, 2026.5, 1], ['Euclid', 2024.1, 2030, 1], ['SPHEREx', 2025.3, 2027.3, 1], ['Rubin LSST', 2025.8, 2035.8, 1],
  ['Roman', 2027, 2032, 2], ['SKA (early science)', 2027.5, 2036, 2],
];

export default function (host) {
  const cv = canvas(host, { aspect: 0.8, max: 480, min: 440, label: 'Sky surveys compared by area of sky and depth, and by when they run' });
  let view = 'a';
  const ctl = row(host);
  choice(ctl, 'Show', [['a', 'Area vs depth'], ['t', 'When']], 'a', (v) => { view = v; upd(); });
  const out = readout(host);
  const cOf = (col, k) => [col.muted, col.s[0], col.s[3]][k];
  cv.draw = (ctx, w, h, col) => {
    if (view === 'a') {
      const top = title(ctx, 'Wider or deeper? Sky surveys (approximate)', col) + 4;
      const A = axes(ctx, w, h, col, { x: [22, 30.5], y: [0.001, 300000], ylog: true, yt: [0.001, 0.1, 10, 1000, 100000], t: top + 8, l: 50, r: 14, xlabel: 'Depth: faintest magnitude reached →', ylabel: 'Area of sky (square degrees)', xt: [22, 24, 26, 28, 30], fx: (v) => String(v) });
      ctx.save(); A.clip();
      line(ctx, [[A.L, A.Y(41253)], [A.R, A.Y(41253)]], col.muted, 1, [5, 4]);
      ctx.restore();
      text(ctx, 'whole sky', A.L + 6, A.Y(41253) - 9, { color: col.muted, size: 10.5, halo: col.panel });
      S.forEach(([n, a, m, k, at]) => {
        const x = A.X(m), y = A.Y(a), c = cOf(col, k);
        dot(ctx, x, y, 5.5, c, col.panel);
        const [dx, dy, al] = { r: [9, 0, 'left'], l: [-9, 0, 'right'], b: [0, 13, 'center'], a: [-7, -11, 'right'], d: [8, 12, 'left'] }[at];
        text(ctx, n, x + dx, y + dy, { color: k ? c : col.ink, size: 11, weight: k ? 700 : 400, align: al, halo: col.panel });
      });
    } else {
      const top = title(ctx, 'When each survey runs (approximate)', col) + 4;
      const nameW = Math.min(140, Math.max(112, w * 0.3));
      const A = axes(ctx, w, h, col, { x: [2000, 2036], y: [0, T.length + 0.5], t: top + 8, l: nameW, r: 14, xlabel: 'Year', yt: [], xt: w > 520 ? [2000, 2010, 2020, 2030] : [2000, 2015, 2030], fx: (v) => String(v) });
      ctx.save(); A.clip();
      line(ctx, [[A.X(2026.9), A.T], [A.X(2026.9), A.B]], col.ink, 1.5, [4, 3]);
      T.forEach(([n, a, b, k], i) => {
        const y = A.Y(T.length - i - 0.2);
        ctx.fillStyle = cOf(col, k); ctx.globalAlpha = k === 2 ? 0.55 : 0.9;
        ctx.fillRect(A.X(a), y - 6, A.X(b) - A.X(a), 12);
        ctx.globalAlpha = 1;
      });
      ctx.restore();
      T.forEach(([n], i) => text(ctx, n, A.L - 6, A.Y(T.length - i - 0.2), { color: col.ink, size: 11, align: 'right' }));
      text(ctx, 'now', A.X(2026.9) + 4, A.B - 10, { color: col.ink, size: 10.5, weight: 700, halo: col.panel });
    }
  };
  const key = (c, t) => `<span style="color:${c};font-weight:700">●</span> ${t}`;
  const upd = () => {
    out.innerHTML = view === 'a'
      ? `${key('var(--muted)', 'finished')} · ${key('var(--s1)', 'running or new')} · ${key('var(--s4)', 'planned')}. Up is more sky; right is fainter, so more distant galaxies. Rubin's ten-year survey is the only one in the top right (a single 30-second Rubin visit reaches about magnitude 24.5): nearly the whole southern sky, very deep. Depths are rough and defined differently by each team.`
      : `${key('var(--muted)', 'finished')} · ${key('var(--s1)', 'running')} · ${key('var(--s4)', 'planned')}. Dates after 2025 are plans and may move.`;
    cv.redraw();
  };
  upd();
}
