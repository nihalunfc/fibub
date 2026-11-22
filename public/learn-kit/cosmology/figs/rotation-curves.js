// 8.2 A rotation curve you can fit. The points are made-up measurements of a Milky Way-like spiral (not real
// data), made from stars and gas plus a dark halo, with a little scatter. The visible matter is an exponential
// disc (scale length 3 kpc), treated as if its mass were spread in a ball (a simplification: a flat disc spins a
// few per cent faster). The halo is a "pseudo-isothermal" sphere: dense middle of radius 5 kpc, mass inside r
// growing in step with r far out, so its speed levels off at v_halo. Speeds add as squares: v² = v_disc² + v_halo².
// G = 4.30091e-6 kpc (km/s)² per solar mass.
import { canvas, axes, text, title, line, dot, row, slider, readout, rng } from '../../kit.js';

const G = 4.30091e-6, RD = 3, RC = 5;
const mDisc = (r, M) => M * (1 - Math.exp(-r / RD) * (1 + r / RD));
const vDisc = (r, M) => Math.sqrt((G * mDisc(r, M)) / r);
const vHalo = (r, vh) => vh * Math.sqrt(Math.max(0, 1 - (RC / r) * Math.atan(r / RC)));
const vTot = (r, M, vh) => Math.hypot(vDisc(r, M), vHalo(r, vh));
const mHalo = (r, vh) => (vHalo(r, vh) ** 2 * r) / G;

export default function (host) {
  const cv = canvas(host, { aspect: 0.66, max: 400, min: 280, label: 'Orbital speed against distance from the centre of a spiral galaxy: measured points, visible matter, dark halo and their total' });
  let M = 6e10, vh = 0;
  const R = rng(21), data = [];
  for (let r = 2; r <= 32; r += 2) data.push([r, vTot(r, 6e10, 185) + (R() + R() + R() - 1.5) * 10]);
  const ctl = row(host);
  slider(ctl, { label: 'Stars and gas', min: 1e10, max: 1.2e11, step: 1e9, value: M, fmt: (v) => `${(v / 1e10).toFixed(1)} × 10¹⁰ suns`, oninput: (v) => { M = v; cv.redraw(); show(); } });
  slider(ctl, { label: 'Dark halo (its far-out speed)', min: 0, max: 260, step: 5, value: vh, fmt: (v) => (v ? `${v} km/s` : 'none'), oninput: (v) => { vh = v; cv.redraw(); show(); } });
  const out = readout(host);
  const show = () => {
    const rms = Math.sqrt(data.reduce((a, [r, s]) => a + (s - vTot(r, M, vh)) ** 2, 0) / data.length);
    const md = mDisc(30, M), mh = mHalo(30, vh), dark = (100 * mh) / (mh + md);
    const k = (i, t, d = '—') => `<span style="color:var(--s${i});font-weight:700">${d}</span> ${t}`;
    out.innerHTML = `${k(1, 'total model')} · ${k(2, 'stars and gas', '- -')} · ${k(7, 'dark halo', '···')} · <span style="font-weight:700">●</span> made-up measurements · <span style="color:var(--muted)">···</span> Kepler fall-off (all visible mass in the middle)<br>Typical miss from the points: <b>${rms.toFixed(0)} km/s</b> ${rms < 14 ? '(a good fit)' : '(not a fit yet)'}. Mass inside 30 kpc: <b>${((md + mh) / 1e10).toFixed(0)} × 10¹⁰</b> suns, of which <b>${dark.toFixed(0)}%</b> is dark.`;
  };
  cv.draw = (ctx, w, h, col) => {
    const A = axes(ctx, w, h, col, { x: [0, 34], y: [0, 300], t: 50, xlabel: 'Distance from the centre (kpc)', ylabel: 'Orbital speed (km/s)' });
    ctx.save(); A.clip();
    const curve = (f) => { const p = []; for (let r = 0.4; r <= 34; r += 0.3) p.push([A.X(r), A.Y(f(r))]); return p; };
    // Kepler fall-off: what the visible mass would do if it all sat in the middle
    line(ctx, curve((r) => Math.sqrt((G * M) / r)).filter(([, y]) => y > A.T - 50), col.muted, 1.2, [2, 4]);
    line(ctx, curve((r) => vDisc(r, M)), col.s[1], 2, [6, 4]);
    if (vh) line(ctx, curve((r) => vHalo(r, vh)), col.s[6], 2, [2, 3]);
    line(ctx, curve((r) => vTot(r, M, vh)), col.s[0], 3);
    for (const [r, s] of data) { line(ctx, [[A.X(r), A.Y(s - 12)], [A.X(r), A.Y(s + 12)]], col.ink, 1); dot(ctx, A.X(r), A.Y(s), 3.5, col.ink); }
    ctx.restore();
    title(ctx, 'Can you make the model match the stars?', col);
  };
  cv.redraw(); show();
}
